import {
  BellOutlined,
  SearchOutlined,
  HomeOutlined,
  CloseOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";

import BottomNavigation from "components/general/BottomNavigation";
import { Badge, Layout } from "antd";
import { LayoutContext } from "../../../contex/Layout-context";
import MainContent from "./MainContent";
import MainHeader from "./MainHeader";
import MainSidebar from "./MainSidebar";
import React from "react";
import bp from "../../../utils/breakpoints";
import logo from "assets/images/logo.svg";
import logoGray from "assets/images/logo-gray.svg";
import packageJson from "./../../../../package.json";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import useIsMobile from "../../../hooks/useIsMobile";
import MobileDrawer from "./MobileDrawer";
import useNotifications from "hooks/useNotifications";

const { Sider } = Layout;

// layout
const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const layoutContext = useContext(LayoutContext);
  const isMobile = useIsMobile();
  const history = useHistory();
  const { notificationsSum } = useNotifications();

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, []);

  const bottomNavItems = [
    // {
    //   title: "منو",
    //   icon: <MenuOutlined className="text-18" />,
    //   activeIcon: <MenuOutlined className="text-white text-18" />,
    //   onClick: () => setShowSidebar(true),
    // },
    {
      title: "خانه",
      icon: <HomeOutlined className="text-18 text-light-black" />,
      activeIcon: <HomeOutlined className="text-white  text-18" />,
      onClick: () => history.replace("/mobile-home"),
    },
    {
      icon: showDrawer ? (
        <CloseOutlined className="text-24" />
      ) : (
        <img src={logoGray} style={{ width: "29px" }} alt="منو" />
      ),
      activeIcon: showDrawer ? (
        <CloseOutlined className="text-24" />
      ) : (
        <img src={logo} style={{ width: "29px" }} alt="منو" />
      ),
      onClick: () => setShowDrawer((prev) => !prev),
    },
    // {
    //   title: "جستجو",
    //   icon: <SearchOutlined className="text-18 text-light-black" />,
    //   activeIcon: <SearchOutlined className="text-white text-18" />,
    // },
    {
      title: "وظیفه ها",
      icon:
        notificationsSum() > 0 ? (
          <Badge size="small" count={notificationsSum()}>
            <CheckSquareOutlined className="text-18 text-light-black" />
          </Badge>
        ) : (
          <CheckSquareOutlined className="text-18 text-light-black" />
        ),
      activeIcon: <CheckSquareOutlined className="text-white  text-18" />,
      onClick: () => history.push("/card-boards"),
    },
  ];

  return (
    <LayoutContainer>
      {/* <MobileMenuToggle
        className={showSidebar && "open"}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {!showSidebar ? (
          <MenuOutlined className="text-white text-20" />
        ) : (
          <CloseOutlined className="text-white text-20" />
        )}
      </MobileMenuToggle> */}
      <Layout className="main-layout" dir="rtl">
        <Sider
          theme="light"
          width="208"
          collapsedWidth="88"
          collapsed={collapsed}
          breakpoint="lg"
          className={showSidebar && "show"}
        >
          <MainSidebar
            collapsed={collapsed}
            onCollapse={() => setCollapsed(!collapsed)}
            showSidebar={showSidebar}
            onHide={() => setShowSidebar(false)}
          />
        </Sider>
        <Layout className="mr-md-2">
          {!layoutContext.hideMainHeader && (
            <LayoutCard>
              <MainHeader />
            </LayoutCard>
          )}

          <LayoutCard className="mt-2">
            <MainContent>{children}</MainContent>
          </LayoutCard>
          <p className="text-center my-2 text-small">{`v ${packageJson.version}`}</p>
        </Layout>
      </Layout>
      <BottomNavigation
        items={bottomNavItems}
        onChange={() => setShowSidebar(false)}
        defaultTab={1}
      />
      <MobileDrawer show={showDrawer} setShowDrawer={setShowDrawer} />
    </LayoutContainer>
  );
};

// css
const LayoutCard = styled.div`
  width: 100%;
  box-shadow: 0px 2px 8px rgba(22, 25, 49, 0.15);
  border-radius: 4px;
  width: 100%;
  background-color: white;
  padding: 16px;
  min-heigt: 100vh;
`;

const LayoutContainer = styled.div`
  overflow-x: hidden;
  .main-layout {
    background: #f3f3f4;
    padding: 8px;
    width: 100%;
    overflow-x: hidden;
  }

  .ant-layout {
    background: #f3f3f4;
  }

  .ant-layout-sider {
    @media (max-width: ${bp.lg}) {
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

const MobileMenuToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  position: fixed;
  top: 0;
  right: 0;
  background-color: ${({ theme }) => theme["primary-dark"]};
  z-index: 2;
  cursor: pointer;
  @media (min-width: ${bp.lg}) {
    display: none;
  }

  &.open {
    right: 100%;
  }
`;

export default MainLayout;
