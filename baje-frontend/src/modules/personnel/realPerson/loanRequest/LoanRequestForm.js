import React, { useContext, useEffect, useState } from "react";
import { Form, message, Row, Spin, Input, notification, Modal } from "antd";
import GoBackBtn from "components/GoBackBtn";
import * as fields from "./common/formItems";
import SubmitBtn from "components/general/SubmitBtn";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { _POST, _GET_ITEM, _PUT } from "./utils/api";
import useCheckAccess from "hooks/useCheckAccess";

import ContentTop from "components/general/ContentTop";
import { pageNames } from "constant";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

const formItemLayout = {
  labelCol: { span: 24 },
  colon: false,
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    lg: { span: 22 },
  },
};

function LoanRequestAdd({ updating, view }) {
  const [mainForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [person, setPerson] = useState();
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const defaultPersonId = query.get("person_id");
  const user = useWhoAmI();
  const currentOffice = useSelector((state) => state.currentOffice);
  const checkAccess = useCheckAccess();
  const formInitialValues = {
    installment: 12,
  };
  const routeParams = useParams();
  const [pageTitle, setPageTitle] = useState("ثبت درخواست مساعده");
  const [current, setCurrent] = useState(null);
  const [defaultCode, setDefaultCode] = useState(
    !updating ? user.nationalCode : null
  );

  let editButton = true;
  // if (!checkAccess(EDIT_CONTRACT)) {
  //   console.info("Not a super admin");
  //   editButton = false;
  // }
  if (!user?.isSuper) {
    editButton = false;
  }

  const handleOnFinish = (params) => {
    if (!currentOffice || currentOffice === -1 || currentOffice === "-1") {
      Modal.error({
        content: "لطفاً شرکت را از بالای صفحه انتخاب نمایید",
      });
      return;
    }
    setBtnLoading(true);
    if (person && person.id) params.personnel_id = person.id;
    if (params.person_name) delete params.person_name;
    if (params.amount) params.amount = parseInt(params.amount);
    params.company_id = String(currentOffice);

    let request;
    if (updating) {
      request = () => _PUT(current, params);
    } else {
      request = () => _POST(params);
    }
    request()
      .then((res) => {
        setBtnLoading(false);
        if (res) {
          notification.success({
            message: "با موفقیت ثبت شد",
          });
          if (!updating) {
            setTimeout(
              () =>
                history.push(pageNames.personnel.realPerson.loanRequest.list),
              1000
            );
          }
        } else {
          notification.error({
            message: "عملیات ناموفق، لطفا مجددا تلاش کنید",
          });
          console.error(res);
        }
      })
      .catch((err) => {
        console.error(err);
        notification.error({
          message: "عملیات ناموفق، لطفا مجددا تلاش کنید",
        });
        setBtnLoading(false);
      });
  };

  // get initial values if is viewing or updating
  useEffect(() => {
    if (updating || view) {
      if (view) setPageTitle("مشاهده مساعده");
      if (updating) setPageTitle("ویرایش مساعده");

      setLoading(true);
      _GET_ITEM(routeParams.id)
        .then((res) => {
          setLoading(false);
          if (res) {
            setCurrent(res.data.id);
            mainForm.setFieldsValue({
              //  person_personnel_id: parseFloat(routeParams.nid),
              amount: parseFloat(res.data.amount),
              installment: parseFloat(res.data.number_of_installment),
              description: res.data?.description,
            });

            setDefaultCode(res.data.personnel_id_fk);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.error(err);
          notification.error({
            message: "مشکلی پیش آمده، لطفا دوباره تلاش کنید",
          });
        });
    }
  }, []);

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title={pageTitle}
        className="mt-3"
        breadcrumbItems={[
          {
            text: "درخواست های مساعده",
            link: pageNames.personnel.realPerson.loanRequest.list,
          },
          { text: pageTitle },
        ]}
      />

      <Form
        {...formItemLayout}
        form={mainForm}
        name="examination"
        onFinish={handleOnFinish}
        initialValues={formInitialValues}
        style={{}}
      >
        <Spin spinning={loading}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <fields.Person
              useForm={mainForm}
              setPerson={setPerson}
              disabled={view}
              defaultValue={defaultCode}
              button={!editButton}
            />
            <fields.Amount disabled={view} />
            <fields.Count disabled={view} />
            <fields.Description disabled={view} />
            {!view && <SubmitBtn loading={btnLoading} />}
          </Row>
        </Spin>
      </Form>
    </>
  );
}

export default LoanRequestAdd;
