import React, { useEffect, useState } from "react";
import { Tabs, Row, Col, Button, Modal } from "antd";
import { useHistory, useLocation, withRouter } from "react-router-dom";
import styled from "styled-components";
import GoBackBtn from "./../../../../components/GoBackBtn";
import LogoLoading from "../../../../components/general/LoadingLogo";
import { loadImage } from "../../../../_helpers";
import { getPersonData } from "../common/_helpers";
import {
  FirstTab,
  SecondTab,
  ThirdTab,
  FourthTab,
  FifthTab,
  SixthTab,
} from "./realPersonView/Tabs";
import ContentTop from "components/general/ContentTop";
import { pageNames } from "constant";
import Hse from "./realPersonView/tabs/Hse";

const { TabPane } = Tabs;
const rowGutter = { xs: 8, sm: 16, md: 24, lg: 32 };

const StyledTabs = styled(TabPane)`
  background-color: #fff;
  padding: 20px;
  margin-right: 3px;
  box-shadow: 0 4px 8px 0 rgba(19, 37, 71, 0.1);
`;

const RealPersonView = (props) => {
  const [personData, setPersonData] = useState();
  const [subordinates, setSubordinates] = useState();
  const [activeTab, setActiveTab] = useState("1");
  const personID = props.match.params.id;

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tabTarget = query.get("target");

  useEffect(() => {
    getPersonData(personID).then((data) => {
      setPersonData({
        ...data.person,
        jobName: data.job && data.job.title,
        companyName: data.company && data.company.name,
      });
      setSubordinates(data.subordinates);
    });

    if (tabTarget) setActiveTab(tabTarget);
  }, []);

  if (!personData) {
    return <LogoLoading />;
  }

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="جزییات"
        breadcrumbItems={[
          { text: "حقیقی", link: pageNames.personnel.realPerson.list },
          { text: "جزییات" },
        ]}
      />

      <Tabs
        type="card"
        activeKey={activeTab}
        onTabClick={(key) => setActiveTab(key)}
        defaultActiveKey="1"
      >
        <StyledTabs tab="اطلاعات اولیه" key="1">
          <Row gutter={rowGutter}>
            <FirstTab data={personData} />
          </Row>
        </StyledTabs>

        <StyledTabs tab="اطلاعات شغلی" key="2">
          <Row gutter={rowGutter}>
            <SecondTab data={personData} />
          </Row>
        </StyledTabs>

        <StyledTabs tab="اطلاعات تماس" key="3">
          <Row gutter={rowGutter}>
            <ThirdTab data={personData} />
          </Row>
        </StyledTabs>

        <StyledTabs tab="افراد تبعی" key="4">
          <Row gutter={rowGutter}>
            <FourthTab data={subordinates} />
          </Row>
        </StyledTabs>

        <StyledTabs tab="حسابهای بانکی" key="5">
          <Row gutter={rowGutter}>
            <FifthTab data={personData} />
          </Row>
        </StyledTabs>

        <StyledTabs tab="اسناد" key="6">
          <Row gutter={rowGutter}>
            <SixthTab data={personData} />
          </Row>
        </StyledTabs>
        <StyledTabs tab="ایمنی" key="7">
          <Hse data={personData} />
        </StyledTabs>
      </Tabs>
    </>
  );
};

export default withRouter(RealPersonView);
