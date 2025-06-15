import React, { useContext, useEffect, useState } from "react";
import { Form, message, Row, Spin, Input, notification, Modal } from "antd";
import GoBackBtn from "components/GoBackBtn";
import * as fields from "./common/formItems";
import SubmitBtn from "components/general/SubmitBtn";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { _POST, _GET_ITEM, _PUT } from "./utils/api";
import ContentTop from "components/general/ContentTop";
import { formItemLayout, formRowGutter, pageNames } from "constant";

function SettingsForm({ updating, view }) {
  const [mainForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const history = useHistory();
  const routeParams = useParams();
  const [pageTitle, setPageTitle] = useState("افزودن تنظیمات سالانه");

  const handleOnFinish = (params) => {
    if (parseFloat(params.max_salary) < parseFloat(params.min_salary) * 7) {
      Modal.error({
        content: `حداکثر دستمزد روزانه باید حداقل هفت برابر حداقل دستمزد (${
          parseFloat(params.min_salary) * 7
        } ریال) باشد`,
      });
    } else {
      setBtnLoading(true);

      for (let key in params) {
        if (key !== "description") {
          params[key] = parseFloat(params[key]);
        }
      }

      let request;
      if (updating) {
        request = () => _PUT(routeParams.id, params);
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
                () => history.push(pageNames.personnel.annualSetting.list),
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
    }
  };

  // get initial values if is viewing or updating
  useEffect(() => {
    if (updating || view) {
      if (view) setPageTitle("مشاهده تنظیمات سال");
      if (updating) setPageTitle("ویرایش تنظیمات سال");

      setLoading(true);
      _GET_ITEM(routeParams.id)
        .then((res) => {
          setLoading(false);
          if (res) {
            mainForm.setFieldsValue({
              year: res.data?.year,
              min_salary: res.data?.min_daily_salary,
              max_salary: res.data?.max_daily_salary,
              bonus: res.data?.bonus,
              housing: res.data?.housing,
              description: res.data?.description,
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
          { text: "منابع انسانی" },
          { text: "تنظیمات سالانه" },
          { text: "افزودن تنظیمات سالانه" },
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
            <fields.Year disabled={view || updating} />
            <fields.MinSalary disabled={view} />
            <fields.MaxSalary disabled={view} />
            <fields.Bonus disabled={view} />
            <fields.Housing disabled={view} />
            <fields.Description disabled={view} />
            {!view && <SubmitBtn loading={btnLoading} />}
          </Row>
        </Spin>
      </Form>
    </>
  );
}

export default SettingsForm;
