import React, { useState, useEffect } from "react";
import { useParams, useLocation, useHistory } from "react-router";

import { Form, message, Row } from "antd";
import { covetFormatDateToFA } from "_helpers";
import AppButton from "components/general/AppButton";
import ContentTop from "components/general/ContentTop";
import GoBackBtn from "components/GoBackBtn";
import { systemStatus } from "modules/dashboard/const";
import * as api from "./utils/api";
import CustomRow from "../components/CustomRow";
import * as FormItems from "./ProductionForm/formItems";
import { formItemLayout, formRowGutter, pageNames } from "constant";

function ProductionForm() {
  const breadcrumbItems = [
    { text: "داشبورد ", link: pageNames.home.web },
    { text: "گزارش تولید", link: pageNames.dashboard.productionReport.list },
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
    // updateProductionReport(payload , onSuccess , onError)
    api
      ._UPDATE_PRODUCTION(payload)
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
      ._GET_SINGLE_PRODUCTION_REPORT(routeParams.id)
      .then((res) => {
        setRecord(res?.data);
        if (!location.pathname.includes("add")) {
          mainForm.setFieldsValue({
            stone_tonnage: res?.data?.stone_tonnage,
            dust_tonnage: res?.data?.dust_tonnage,
            stone_load_quantity: res?.data?.stone_load_quantity,
            dust_load_quantity: res?.data?.dust_load_quantity,
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
          <FormItems.StoneTonnage />
          <FormItems.DustTonnage />
          <FormItems.StoneLoadQuantity />
          <FormItems.DustLoadQuantity />
          <FormItems.Description />
        </Row>

        <AppButton onClick={mainForm.submit}>ثبت </AppButton>
      </Form>
    </>
  );
}

export default ProductionForm;
