import React, { useContext, useEffect, useState } from "react";
import { Form, message, Row, Spin, Input, notification, Modal } from "antd";
import GoBackBtn from "components/GoBackBtn";
import * as fields from "./common/formItems";
import SubmitBtn from "components/general/SubmitBtn";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { _POST, _GET_ITEM, _PUT } from "./utils/api";
import { convertDateToENProper, covetFormatDateToFA } from "_helpers";
import ContentTop from "components/general/ContentTop";
import useSuperAdminCheck from "hooks/useSuperAdminCheck";
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

function LeaveForm({ updating }) {
  const [mainForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const history = useHistory();
  const routeParams = useParams();
  const [pageTitle, setPageTitle] = useState("ثبت ماموریت");
  const [person, setPerson] = useState();
  const user = useWhoAmI();
  const [defaultCode, setDefaultCode] = useState(
    !updating ? user.nationalCode : null
  );
  const superAdminCheck = useSuperAdminCheck();

  const handleOnFinish = (params) => {
    setBtnLoading(true);

    const body = {
      type: params.type,
      location: params.place,
      subject: params.subject,
      from_date: convertDateToENProper(params.start_date),
      to_date: convertDateToENProper(params.end_date),
      residency: params.rest_type,
      vehicle: params.commuting_type,
      description: params.description,
      status: "جدید",
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
              () => history.push(pageNames.personnel.realPerson.mission.list),
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
      setPageTitle("ویرایش ماموریت");

      setLoading(true);
      _GET_ITEM(routeParams.id)
        .then((res) => {
          setLoading(false);
          if (res) {
            setDefaultCode(res.data.personnel_id_fk);
            mainForm.setFieldsValue({
              type: res.data.type,
              place: res.data.location,
              subject: res.data.subject,
              start_date: covetFormatDateToFA(res.data.from_date),
              end_date: covetFormatDateToFA(res.data.to_date),
              rest_type: res.data.residency,
              commuting_type: res.data.vehicle,
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
          {
            text: "ماموریت ها",
            link: pageNames.personnel.realPerson.mission.list,
          },
          { text: pageTitle },
        ]}
      />

      <Form
        {...formItemLayout}
        form={mainForm}
        name="examination"
        onFinish={handleOnFinish}
        validateTrigger={"onChange"}
        style={{}}
      >
        <Spin spinning={loading}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <fields.Person
              useForm={mainForm}
              setPerson={setPerson}
              defaultValue={defaultCode}
              button={superAdminCheck()}
            />
            <fields.Type />
            <fields.Place />
            <fields.Subject />
            <fields.StartDate useForm={mainForm} />
            <fields.EndDate useForm={mainForm} />
            <fields.RestType />
            <fields.CommutingType />
            <fields.Description />
            <SubmitBtn loading={btnLoading} />
          </Row>
        </Spin>
      </Form>
    </>
  );
}

export default LeaveForm;
