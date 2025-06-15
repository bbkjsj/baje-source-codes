import React, { useState, useEffect } from "react";
import { useParams, useLocation, useHistory } from "react-router";
import { Col, Form, Input, message, Row } from "antd";
import { covetFormatDateToFA } from "_helpers";
import AppButton from "components/general/AppButton";
import ContentTop from "components/general/ContentTop";
import GoBackBtn from "components/GoBackBtn";
import CustomRow from "modules/dashboard/components/CustomRow";
import { systemStatus } from "modules/dashboard/const";
import * as api from "./utils/api";
import * as FormItems from "./PeymanForm/formItems";
import { formItemLayout, formRowGutter, pageNames } from "constant";

function ProductionForm() {
  const breadcrumbItems = [
    { text: "داشبورد ", link: pageNames.home.web },
    { text: " مدیریت پیمان", link: pageNames.dashboard.peymanManagement.list },
  ];
  const routeParams = useParams();
  const location = useLocation();
  const history = useHistory();
  const [pageTitle, setPageTitle] = useState("");
  const [mainForm] = Form.useForm();
  const [record, setRecord] = useState();

  const onFinish = (params) => {
    const data = [
      {
        ...params,
        status: record.status ? record.status : systemStatus.not_approved,
        id: record.id,
      },
    ];

    const payload = {
      contractId: record.contract_id_fk,
      data,
    };
    console.log(payload, "!payload");

    api
      ._UPDATE_PEYMAN(payload)
      .then((res) => {
        message.success("اطلاعات با موفقیت ثبت شد");
        history.go(-1);
      })
      .catch((err) => {
        message.error("خطایی در ثبت اطلاعات رخ  داده است");
      });
  };

  useEffect(() => {
    // console.log(location , '!');
    api
      ._GET_SINGLE_PEYMAN_REPORT(routeParams.id)
      .then((res) => {
        setRecord(res?.data);
        if (!location.pathname.includes("add")) {
          mainForm.setFieldsValue({
            disabled_car_no_part_quantity:
              res?.data?.disabled_car_no_part_quantity,
            disabled_car_no_tier_quantity:
              res?.data?.disabled_car_no_tier_quantity,
            active_car_quantity: res?.data?.active_car_quantity,
            ready_to_work_factor: res?.data?.ready_to_work_factor,
            description: res?.data?.description,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <GoBackBtn />
      <ContentTop title={pageTitle} breadcrumbItems={breadcrumbItems} />
      <CustomRow
        list={[
          {
            name: "تاریخ",
            value: record?.date ? covetFormatDateToFA(record?.date) : "",
          },
        ]}
      />
      <Form form={mainForm} onFinish={onFinish} {...formItemLayout}>
        <Row gutter={formRowGutter}>
          <FormItems.DisableCarNoPartQuantity />
          <FormItems.DisableCarNoTierQuantity />
          <FormItems.ActiveCarQuantuty />
          <FormItems.ReadyToWorkFactor />
          <FormItems.Description />
        </Row>

        <AppButton onClick={mainForm.submit}>ثبت </AppButton>
      </Form>
    </>
  );
}

export default ProductionForm;
