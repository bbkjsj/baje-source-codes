import React, { useContext, useEffect, useState } from "react";
import { Form, message, Row, Spin, Descriptions } from "antd";
import GoBackBtn from "components/GoBackBtn";
import { useHistory, useLocation, withRouter } from "react-router-dom";
import { covetFormatDateToFA, priceNormalizer } from "_helpers";
import { getRecordClaim } from "./api";
import LoadingLogo from "components/general/LoadingLogo";
import ContentTop from "components/general/ContentTop";
import { pageNames } from "constant";

function RecordClaimDetail({ match }) {
  const [loading, setLoading] = useState(false);
  const claimID = match.params.id;
  const [getLoading, setGetLoading] = useState(true);
  const [recordClaim, setRecordClaim] = useState();

  const handleGetRecordClaim = async () => {
    try {
      const { data } = await getRecordClaim(claimID);
      setRecordClaim(data);
      setGetLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    handleGetRecordClaim();
  }, []);

  if (getLoading) {
    return <LoadingLogo />;
  }

  return (
    <>
      <GoBackBtn />

      <ContentTop
        title="جزییات ادعای سابقه"
        className="mt-3"
        breadcrumbItems={[
          // { text: "منابع انسانی" },
          // { text: "افراد حقیقی" },
          {
            text: "درخواست های ادعای سابقه",
            link: pageNames.personnel.realPerson.recordClaim.list,
          },
          { text: "جزییات" },
        ]}
      />

      <Descriptions bordered>
        <Descriptions.Item label="نام">{`${recordClaim.first_name}  ${recordClaim.last_name}`}</Descriptions.Item>
        <Descriptions.Item label="تاریخ ثبت">
          {covetFormatDateToFA(recordClaim.register_date)}
        </Descriptions.Item>
        <Descriptions.Item label="دستمزد مشمول">
          {priceNormalizer(recordClaim.salary_bonus)}
        </Descriptions.Item>
        <Descriptions.Item label="ردیف پیمان">
          {recordClaim.row}
        </Descriptions.Item>
        <Descriptions.Item label="کد کارگاهی">
          {recordClaim.workshop_code}
        </Descriptions.Item>
        <Descriptions.Item label="وضعیت">
          {recordClaim.status}
        </Descriptions.Item>
        <Descriptions.Item label="سال">{recordClaim.year}</Descriptions.Item>
        <Descriptions.Item label="ماه">{recordClaim.month}</Descriptions.Item>
      </Descriptions>
    </>
  );
}

export default withRouter(RecordClaimDetail);
