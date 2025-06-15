import React, { useContext, useEffect, useReducer, useState } from "react";
import { Descriptions, Space, Divider } from "antd";
import GoBackBtn from "components/GoBackBtn";
import { withRouter, useHistory } from "react-router-dom";
import { useAccidentInsuranceGetGeneralInfo } from "./util/hooks";
import LogoLoading from "components/general/LoadingLogo";
import ContentTop from "components/general/ContentTop";
import { getLink } from "_helpers";
import { pageNames } from "constant";

function AccidentInsuranceGeneralInfo({ match }) {
  const insuranceID = match.params.id;
  const { data, loading } = useAccidentInsuranceGetGeneralInfo(insuranceID);
  const history = useHistory();

  console.log("data in info", data);

  if (loading) {
    return <LogoLoading />;
  }

  const renderItems = (obj) => {
    let items = [];
    for (let key in obj) {
      items.push(<Descriptions.Item label={key}>{obj[key]}</Descriptions.Item>);
    }

    return items;
  };

  return (
    <>
      <GoBackBtn />

      <ContentTop
        title="افزودن بیمه عمر و حادثه"
        className="mt-3"
        breadcrumbItems={[
          {
            text: "لیست بیمه عمر و حادثه",
            link: pageNames.personnel.insurance.accident.list,
          },
          {
            text: "لیست افراد قرارداد",
            link: getLink(
              pageNames.personnel.insurance.accident.personnel.list,
              insuranceID
            ),
          },
          { text: "اطلاعات کلی" },
        ]}
      />

      <Space direction="vertical">
        {data.map((el, i) => {
          const period = Object.keys(el)[0];
          return (
            <>
              <Descriptions title={period} bordered={true}>
                {renderItems(el[period])}
              </Descriptions>
              <Divider />
            </>
          );
        })}
      </Space>
    </>
  );
}

export default withRouter(AccidentInsuranceGeneralInfo);
