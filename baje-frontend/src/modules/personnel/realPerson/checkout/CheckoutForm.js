import React, { useEffect, useState } from "react";
import { Form, Row, Spin, notification } from "antd";
import GoBackBtn from "components/GoBackBtn";
import * as fields from "./common/formItems";
import SubmitBtn from "components/general/SubmitBtn";
import { useHistory, useParams } from "react-router-dom";
import { _POST, _GET_ITEM, _PUT } from "./utils/api";
import { convertDateToENProper, covetFormatDateToFA } from "_helpers";
import ContentTop from "components/general/ContentTop";
import useSuperAdminCheck from "hooks/useSuperAdminCheck";
import { formItemLayout, formRowGutter, pageNames } from "constant";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

function CheckoutForm({ updating }) {
  const [mainForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const history = useHistory();
  const routeParams = useParams();
  const [pageTitle, setPageTitle] = useState("ثبت تسویه حساب");
  const [person, setPerson] = useState();
  const user = useWhoAmI();
  const superAdminCheck = useSuperAdminCheck();
  const [defaultCode, setDefaultCode] = useState(
    !updating ? user.nationalCode : null
  );

  const handleOnFinish = (params) => {
    setBtnLoading(true);

    const body = {
      reason: params.reason,
      date: convertDateToENProper(params.date),
      description: params.description,
    };
    if (person && person.id) body.personnel_id = person.id;

    let request;
    if (updating) {
      request = () => _PUT(routeParams.id, body);
    } else {
      request = () => _POST(body);
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
              () => history.push(pageNames.personnel.realPerson.checkout.list),
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
    if (updating) {
      setPageTitle("ویرایش تسویه حساب");

      setLoading(true);
      _GET_ITEM(routeParams.id)
        .then((res) => {
          setLoading(false);
          if (res) {
            setDefaultCode(res.data.personnel_id_fk);
            mainForm.setFieldsValue({
              date: covetFormatDateToFA(res.data.date),
              reason: res.data.reason,
              description: res.data.description,
            });
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
          // { text: "منابع انسانی" },
          {
            text: "درخواست های تسویه حساب",
            link: pageNames.personnel.realPerson.checkout.list,
          },
          { text: pageTitle },
        ]}
      />

      <Form
        {...formItemLayout}
        form={mainForm}
        name="examination"
        onFinish={handleOnFinish}
      >
        <Spin spinning={loading}>
          <Row gutter={formRowGutter}>
            <fields.Person
              useForm={mainForm}
              setPerson={setPerson}
              defaultValue={defaultCode}
              button={superAdminCheck()}
            />
            <fields.Date useForm={mainForm} />
            <fields.Reason />
            <fields.Description />
            <SubmitBtn loading={btnLoading} />
          </Row>
        </Spin>
      </Form>
    </>
  );
}

export default CheckoutForm;
