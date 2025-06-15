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
const formItemLayout = {
  labelCol: { span: 24 },
  colon: false,
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    lg: { span: 22 },
  },
};

function EnvironmentsForm({ updating }) {
  const [mainForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const history = useHistory();
  const routeParams = useParams();
  const [pageTitle, setPageTitle] = useState("ثبت محیط");
  const [usageMode, setUsageMode] = useState("basedOnSubEnvironments");
  const [statusMode, setStatusMode] = useState("environment");
  const currentOffice = useSelector((state) => state.currentOffice);

  const handleOnFinish = (params) => {
    if (!currentOffice || currentOffice == "-1") {
      Modal.warn({
        title: "شرکت انتخاب نشده است",
        content: "لطفا برای ایجاد محیط شرکت را از بالای صفحه انتخاب نمایید",
      });
      return;
    }

    setBtnLoading(true);

    const body = {
      title: params?.title,
      parentId: params?.parentId || -1,
      type: "others",
      code: "0",
      usage: params?.usage || -1,
      occupiedStatus: params?.occupiedStatus,
      status: "enable",
    };

    if (!updating) {
      body.companyId = currentOffice;
      body.independentChart = false;
      body.independentVehicle = false;
    }

    // console.log("BODY:", body);

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

          setTimeout(() => history.push(pageNames.environment.list), 1000);
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
      setPageTitle("ویرایش محیط");
      setLoading(true);
      _GET_ITEM(routeParams.id)
        .then((res) => {
          setLoading(false);
          if (res) {
            const data = res.data;

            const newValues = {
              title: data?.title,
              occupiedStatus: data?.occupiedStatus,
            };

            if (data.parentId != -1 && data.parentId !== null) {
              newValues.parentId = data?.parentId;
              setStatusMode("subEnvironment");
            }
            if (data.usageId != -1 && data.usageId !== null) {
              newValues.usage = data?.usageId;
              setUsageMode("specificUsage");
            }

            mainForm.setFieldsValue(newValues);
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
            text: "محیط ها",
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
        initialValues={{ occupyingType: "owned" }}
      >
        <Spin spinning={loading}>
          {!loading ? (
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <fields.Name />
              <fields.Usage
                usageMode={usageMode}
                setUsageMode={setUsageMode}
                //defaultValue={""}
              />
              <fields.Status
                statusMode={statusMode}
                setStatusMode={setStatusMode}
                //defaultValue={""}
              />
              <fields.OccupyingType />
              <SubmitBtn loading={btnLoading} />
            </Row>
          ) : (
            ""
          )}
        </Spin>
      </Form>
    </>
  );
}

export default EnvironmentsForm;
