import React, { useEffect } from "react";
import { Form, Row, Button } from "antd";
import * as FormItems from "./components/FormItems";
import GoBackBtn from "components/GoBackBtn";
import { useSupplementaryInsuranceGetById } from "./util/hooks";
import { withRouter } from "react-router-dom";
import LoadingLogo from "components/general/LoadingLogo";
import { config } from "constant";
import Col from "antd/es/grid/col";

const formItemLayout = {
  labelCol: { span: 24 },
  colon: false,
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    lg: { span: 22 },
  },
};

const formStyle = {};

const formGutter = { xs: 8, sm: 16, md: 24, lg: 32 };

const SupplementaryInsuranceDetail = (id) => {
  const insuranceID = id.id;
  const [form] = Form.useForm();
  const { loading, getItem, data } = useSupplementaryInsuranceGetById(
    insuranceID,
    form
  );

  useEffect(() => {
    getItem();
  }, [insuranceID]);

  if (loading) {
    return <LoadingLogo />;
  }

  const handleClose = () => {
    // closeModal();
  };

  return (
    <>
      {/* <GoBackBtn /> */}
      {/* <ContentTop
        title="جزییات بیمه تکمیلی افراد"
        className="mt-3"
        breadcrumbItems={[
          // { text: "منابع انسانی" },
          {
            text: "لیست بیمه تکمیلی",
            link:pageNames.personnel.insurance.supplymentary.list,
          },
          { text: "جزییات" },
        ]}
      /> */}
      <Form
        {...formItemLayout}
        form={form}
        name="supplementaryInsuranceDetail"
        style={formStyle}
      >
        <Row gutter={formGutter}>
          <FormItems.InsurancePolicyType detail />
          <FormItems.Insurer detail />
          <FormItems.CompanyID detail />
          <FormItems.ContractNumber detail />
          <FormItems.ContractDate useForm={form} detail />
          <FormItems.ContractStartDate useForm={form} detail />
          <FormItems.ContractEndDate useForm={form} detail />
          <FormItems.MaximumChangeDate useForm={form} detail />
          <FormItems.Description detail />

          <FormItems.MainInsuranceShare detail />

          <FormItems.WifeInsuranceShare detail />
          <FormItems.DaughterInsuranceShare detail />
          <FormItems.SonInsuranceShare detail />
          <FormItems.FatherInsuranceShare detail />
          <FormItems.MotherInsuranceShare detail />

          {data.pdf_file_url ? (
            <Col xs={24} sm={24} md={24} lg={12} xl={6}>
              <Form.Item label="فایل تعهدات بیمه گر">
                <Button href={config.url.API_URL + data.pdf_file_url}>
                  مشاهده فایل
                </Button>
              </Form.Item>
            </Col>
          ) : null}
        </Row>
      </Form>

      {/* <Button onClick={handleClose} /> */}
    </>
  );
};

export default SupplementaryInsuranceDetail;
