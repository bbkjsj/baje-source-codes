import { Layout, Row } from "antd";
import styled from "styled-components";
import bp from "../../../utils/breakpoints";
import React, { useEffect, useState } from "react";
import MobileHeader from "./components/MobileHeader";
import ShortcutItem from "./components/ShortcutItem";
import { useHistory, useLocation } from "react-router-dom";
import {
  SettingOutlined,
  FormOutlined,
  CoffeeOutlined,
  MedicineBoxOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import { pageNames } from "constant";
import useWhoAmI from "hooks/useWhoAmI";
import { getLink } from "_helpers";
import hemletIcon from "assets/icons/hemlet_blue.svg";
import arman from "assets/icons/arman.png";
import cakeIcon from "assets/icons/cake_blue.svg";
import insuranceIcon from "assets/images/social-insurance-logo.svg";
import GoBackBtn from "components/GoBackBtn";
import MobileSettings from "./components/MobileSettings";

// layout
const Main = () => {
  const history = useHistory();
  const location = useLocation();
  const { id, firstName, lastName } = useWhoAmI();

  const iconClass = "text-primary";
  const rowProps = {
    justify: "center",
    style: { alignItems: "baseline" },
  };

  const isSettings = location.hash === "#settings";

  return (
    <LayoutContainer>
      <Layout className="main-layout" dir="rtl">
        <Layout>
          <MobileHeader />
          <div className="mt-3 px-3">
            {isSettings && <GoBackBtn block onClick={() => history.goBack()} />}

            {isSettings && <MobileSettings />}

            {!isSettings && (
              <>
                <Row {...rowProps}>
                  <ShortcutItem
                    icon={<SettingOutlined className={iconClass} />}
                    title="تنظیمات"
                    onClick={() => {
                      history.push("#settings");
                    }}
                  />
                  <ShortcutItem
                    icon={<FormOutlined className={iconClass} />}
                    title="مشاهده و ویرایش افراد تبعی"
                    //onClick={}
                  />
                  <ShortcutItem
                    icon={<CoffeeOutlined className={iconClass} />}
                    title="مرخصی"
                    onClick={() =>
                      history.push(
                        pageNames.personnel.realPerson.leaveRequest.list +
                          `?full_name=${firstName} ${lastName}`
                      )
                    }
                  />
                  <ShortcutItem
                    icon={
                      <img
                        src={insuranceIcon}
                        alt="insurance"
                        style={{ width: "32px" }}
                      />
                    }
                    title="مشاهده سابقه تامین اجتماعی"
                    onClick={() =>
                      history.push(
                        getLink(
                          pageNames.personnel.insurance.tamin.personnelReport,
                          id
                        )
                      )
                    }
                  />
                  <ShortcutItem
                    icon={<MedicineBoxOutlined className={iconClass} />}
                    title="مشاهده سابقه بیمه تکمیلی"
                    onClick={() =>
                      history.push(
                        getLink(
                          pageNames.personnel.insurance.supplymentary.personnel
                            .history,
                          {
                            id: id,
                            personName: `${firstName} ${lastName}`,
                          }
                        )
                      )
                    }
                  />
                  <ShortcutItem
                    icon={
                      <img
                        src={hemletIcon}
                        alt="hse"
                        style={{ width: "38px" }}
                      />
                    }
                    title="مشاهده سوابق بازرسی HSE"
                    onClick={() =>
                      history.push(
                        pageNames.hse.audit.index +
                          `?to_be_audit=${firstName} ${lastName}`
                      )
                    }
                  />
                  <ShortcutItem
                    icon={
                      <img src={arman} alt="arman" style={{ width: "60px" }} />
                    }
                    title="خرید اقساطی"
                    onClick={() =>
                      (window.location.href = "https://armanbazar.com/")
                    }
                  />
                  <ShortcutItem
                    icon={
                      <img
                        src={cakeIcon}
                        alt="bithday"
                        style={{ width: "40px" }}
                      />
                    }
                    title="تولد همکاران"
                    //onClick={}
                  />
                  <ShortcutItem
                    icon={<BulbOutlined className={iconClass} />}
                    title="یه پیشنهاد دارم"
                    onClick={() =>
                      history.push(pageNames.suggest.suggestion.list)
                    }
                  />
                </Row>
              </>
            )}
          </div>
        </Layout>
      </Layout>
    </LayoutContainer>
  );
};

// css
const LayoutContainer = styled.div`
  background: white;
  overflow-x: hidden;
  .ant-layout {
    background: #f3f4f5;
    padding-bottom: 35px;
  }
  .main-layout {
    background: #f3f4f5;
  }
  .ant-layout-sider {
    @media (max-width: ${bp.md}) {
      width: initial !important;
      min-width: initial !important;
      flex: initial !important;
      z-index: 1;
      right: -100%;
      transition: all 0.3s ease;
    }
    &.show {
      right: 0% !important;
    }
  }
`;

export default Main;
