import React, { useEffect, useState } from "react";
import { Form, message, Row, Col, Divider, Spin } from "antd";
import GoBackBtn from "components/GoBackBtn";
import * as fields from "./common/formItems";
import SubmitBtn from "components/general/SubmitBtn";
import * as api from "./utils/api";
import { useHistory } from "react-router-dom";
import useSaveShift from "./common/useSaveShift";
import AppCard from "components/general/AppCard";
import ContentTop from "components/general/ContentTop";
import { formItemLayout, formRowGutter, pageNames } from "constant";
import moment from "moment";
import { useParams } from "react-router-dom";
import { camelize } from "./../../../_helpers";

const ShiftForm = (props) => {
  const pageParams = useParams();
  const [mainForm] = Form.useForm();
  const history = useHistory();
  const [isNew, setIsNew] = useState(true);
  const [savePageLoading, savePage] = useSaveShift();
  const [loading, setLoading] = useState(false);

  const handleOnFinish = async (params) => {
    console.log(pageParams.id);
    const result = await savePage(params, isNew, pageParams.id);

    if (result) {
      message.success("با موفقیت انجام شد");

      const newPath = pageNames.personnel.shiftWork.list;
      history.push(newPath);
    } else {
      message.error("خطا در ثبت اطلاعات");
    }
  };

  useEffect(() => {
    if (pageParams.id) {
      setLoading(true);
      setIsNew(false);

      api
        ._GET_ITEM(pageParams.id)
        .then((res) => {
          setLoading(false);
          const data = res.data.shift;

          // turns out the api returns 0 and 1 instead of true and false :/
          for (let key in data) {
            if (data[key] === 0) {
              data[key] = false;
            } else if (data[key] === 1) {
              data[key] = true;
            }
          }

          const patterns = res.data.patterns.map((item) => ({
            days: item.days,
            status: item.status,
            from: moment(item.from_time),
            to: moment(item.to_time),
          }));
          const newData = { ...data, patterns };

          const formData = {};

          for (let key of Object.keys(newData)) {
            formData[camelize(key)] = newData[key];
          }

          formData.numberOfTimeOffDays = formData.timeOffDays;
          delete formData.timeOffDays;

          mainForm.setFieldsValue(formData);
        })
        .catch((error) => {
          setLoading(false);
          message.error("عملیات ناموفق");
        });
    }
  }, [pageParams.id, mainForm]);

  let formInitialValues = { patterns: [""] };

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title={`${isNew ? "ایجاد" : "ویرایش"} شیفت کاری`}
        className="mt-3"
        breadcrumbItems={[
          { text: "تنظیمات" },
          { text: "شیفت کاری", link: pageNames.personnel.shiftWork.list },
          { text: "ایجاد" },
        ]}
      />
      <Spin spinning={loading}>
        <AppCard>
          <Form
            {...formItemLayout}
            form={mainForm}
            name="call"
            onFinish={handleOnFinish}
            initialValues={formInitialValues}
          >
            <Spin spinning={savePageLoading}>
              <Row gutter={formRowGutter}>
                <fields.ShiftName />
                <fields.Status />
              </Row>
              <Divider orientation="right">الگوی شیفت</Divider>
              <fields.ShiftPattern useForm={mainForm} />
              <Divider orientation="right">مرخصی</Divider>
              <Row gutter={formRowGutter} align="middle">
                <fields.LeaveDayNumber />
                <fields.PeriodDay />
                <fields.WithVacation />
              </Row>
              <Divider orientation="right">جزئیات</Divider>
              <Row gutter={formRowGutter}>
                <fields.CalculateOvertimeWork />
                <fields.CalculateWorkOnHolidays />
                <fields.CalculateWorkInNight />
                <fields.CalculateWorkOnFridays />
                <fields.NoWorkOnHolidays />
                <SubmitBtn loading={savePageLoading} />
              </Row>
            </Spin>
          </Form>
        </AppCard>
      </Spin>
    </>
  );
};

export default ShiftForm;
