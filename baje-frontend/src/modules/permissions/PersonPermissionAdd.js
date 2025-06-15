import React, { useContext, useEffect, useState } from "react";
import {
  Form,
  message,
  Row,
  Spin,
  Input,
  notification,
  Modal,
  Col,
} from "antd";
import GoBackBtn from "components/GoBackBtn";
import * as fields from "./common/formItems";
import SubmitBtn from "components/general/SubmitBtn";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { _POST, _GET_ITEM, _PUT, assignPermissionsToUser } from "./utils/api";
import {
  convertDateToENProper,
  convertDateToISO8601,
  covetFormatDateToFA,
  getLink,
  getTodayDate,
} from "_helpers";
import ContentTop from "components/general/ContentTop";
import useSuperAdminCheck from "hooks/useSuperAdminCheck";
import { pageNames } from "constant";
import { useSelector } from "react-redux";
import { GET_USER } from "modules/personnel/realPerson/users/utils/api";
import moment from "moment-jalaali";
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

function PersonPermissionAdd() {
  const [mainForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const history = useHistory();
  const routeParams = useParams();
  const [person, setPerson] = useState();
  const [level, setLevel] = useState();
  const user = useWhoAmI();
  const superAdminCheck = useSuperAdminCheck();
  const params = useParams();

  const getPerson = () => {
    if (params.id) {
      GET_USER(params.id).then((res) => {
        setPerson(res.data);
      });
    }
  };

  const handleOnFinish = (values) => {
    // setBtnLoading(true);
    const body = {
      ...values,
      personnelId: Number(params.id),
    };

    body.startDate = convertDateToISO8601(body.startDate);

    if (body.endDate) {
      body.endDate = convertDateToISO8601(body.endDate);
    } else {
      body.endDate = "2099-12-30"; // make end date permanent as it's required for api
    }

    if (!body?.accessIds?.length) {
      Modal.warn({
        content: "لطفاً حداقل یک دسترسی انتخاب نمایید",
      });
      return;
    }

    console.log(body);

    setBtnLoading(true);

    assignPermissionsToUser(body)
      .then((res) => {
        notification.success({
          message: "با موفقیت ثبت شد",
        });

        setTimeout(
          () =>
            history.push(
              getLink(pageNames.permissions.person.list, { id: params.id })
            ),
          1000
        );
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };

  // get initial values if is viewing or updating
  useEffect(() => {
    getPerson();
    mainForm.setFieldsValue({ startDate: getTodayDate() });
  }, []);

  function handleValueChange(_, allValues) {
    setLevel(allValues.accessLevel);
  }

  function getPathComponent() {
    const components = {
      baje: "",
      company: <fields.CompanyPath />,
      environment: <fields.EnvironmentPath />,
    };
    return components[level] || "";
  }

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title={
          person?.first_name
            ? `دسترسی جدید برای ${person?.first_name + " " + person?.last_name}`
            : "دسترسی جدید"
        }
        className="mt-3"
      />

      <Form
        {...formItemLayout}
        form={mainForm}
        name="examination"
        onFinish={handleOnFinish}
        validateTrigger={"onChange"}
        onValuesChange={handleValueChange}
      >
        <Spin spinning={loading}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {
              person ? (
                <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                  <h4>دارنده دسترسی:</h4>
                  {person.national_number}
                </Col>
              ) : (
                ""
              )
              //   <fields.Person
              //     useForm={mainForm}
              //     setPerson={setPerson}
              //     defaultValue={person?.national_number}
              //     button={superAdminCheck()}
              //   />
              // ) : (
              //   ""
            }
            <fields.Permissions />
            <fields.AccessLevel />
            {getPathComponent()}
            <fields.StartDate useForm={mainForm} />
            <fields.EndDate useForm={mainForm} />
            <SubmitBtn loading={btnLoading} />
          </Row>
        </Spin>
      </Form>
    </>
  );
}

export default PersonPermissionAdd;
