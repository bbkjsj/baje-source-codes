import React, { useContext, useEffect, useReducer, useState } from "react";
import { Descriptions, Space } from "antd";
import GoBackBtn from "components/GoBackBtn";
import AppCard from "components/general/AppCard";
import { withRouter, useHistory } from "react-router-dom";
import { useGetOnePayment } from "./util/hooks";
import LogoLoading from "components/general/LoadingLogo";
import ContentTop from "components/general/ContentTop";
import { pageNames } from "constant";
function PaymentDetail({ match }) {
  const history = useHistory();
  const paymentID = match.params.id;

  const { loading: getItemLoading, data: payment } = useGetOnePayment(
    paymentID
  );

  if (getItemLoading) {
    return <LogoLoading />;
  }

  //   estimated_debt: null;
  //   execution_share: "5";
  //   file_url: "";
  //   id: 4;
  //   installment_number: "55";
  //   insurance_tamin_id_fk: 5;
  //   insured_share: "2222";
  //   jobless_share: "25";
  //   paid_for: "اقساط";
  //   pay_date: "1399-11-21 00:00:00";
  //   peiman_insured_share: null;
  //   penalty_share: "5";
  //   periodic_debt_end_date: null;
  //   periodic_debt_start_date: null;
  //   status: "0";

  return (
    <>
      <GoBackBtn />

      {payment && (
        <>
          <ContentTop
            title="لیست پرداختی های بیمه"
            className="mt-3"
            breadcrumbItems={[
              {
                text: "بیمه تامین اجتماعی",
                link: pageNames.personnel.insurance.tamin.list,
              },
              {
                text: "لیست پرداختی های بیمه",
                link: pageNames.personnel.insurance.tamin.payment.list,
              },
              { text: "جزییات پرداختی" },
            ]}
          />
          {/* <Space direction="vertical" size={32}> */}
          <Descriptions bordered={true}>
            <Descriptions.Item label="پرداخت بابت">
              {payment.paid_for}
            </Descriptions.Item>
            <Descriptions.Item label="شماره قسط">
              {payment.installment_number}
            </Descriptions.Item>
            <Descriptions.Item label="بدهی برآوردی">
              {payment.estimated_debt}
            </Descriptions.Item>
            <Descriptions.Item label="تاریخ پرداخت">
              {payment.pay_date}
            </Descriptions.Item>
            <Descriptions.Item label="تاریخ شروع بدهی">
              {payment.periodic_debt_start_date}
            </Descriptions.Item>
            <Descriptions.Item label="تاریخ پایان بدهی">
              {payment.periodic_debt_end_date}
            </Descriptions.Item>
            <Descriptions.Item label="حق بیمه">
              {payment.insured_share}
            </Descriptions.Item>
            <Descriptions.Item label="حق بیمه بیکاری">
              {payment.jobless_share}
            </Descriptions.Item>
            <Descriptions.Item label="جرایم">
              {payment.penalty_share}
            </Descriptions.Item>
            <Descriptions.Item label="حق الاجراء">
              {payment.execution_share}
            </Descriptions.Item>
            <Descriptions.Item label="حق بیمه پیمان">
              {payment.peiman_insured_share}
            </Descriptions.Item>
            <Descriptions.Item label="وضعیت">
              {payment.status}
            </Descriptions.Item>
            <Descriptions.Item label="فایل">
              {payment.file_url}
            </Descriptions.Item>
          </Descriptions>
          {/* </Space> */}
        </>
      )}
    </>
  );
}

export default withRouter(PaymentDetail);
