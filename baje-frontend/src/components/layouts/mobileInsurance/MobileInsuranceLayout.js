import styled from "styled-components";
import React from "react";
import BottomNavigation from "components/general/BottomNavigation";
import { useHistory } from "react-router";
import logo from "assets/images/logo.svg";
import logoGray from "assets/images/logo-gray.svg";
import {
  SearchOutlined,
  BellOutlined,
  CheckSquareOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Badge } from "antd";
import useNotifications from "hooks/useNotifications";

const MobileInsuranceLayout = ({ children }) => {
  const history = useHistory();
  const { notificationsSum } = useNotifications();

  const bottomNavItems = [
    {
      title: "خانه",
      icon: <HomeOutlined className="text-18 text-light-black" />,
      activeIcon: <HomeOutlined className="text-white  text-18" />,
      onClick: () => history.replace("/mobile-home"),
    },
    // {
    //   title: "اعلانات",
    //   icon: <BellOutlined className="text-18 text-light-black" />,
    //   activeIcon: <BellOutlined className="text-white  text-18" />,
    // },
    {
      icon: <img src={logoGray} style={{ width: "29px" }} alt="" />,
      activeIcon: <img src={logo} style={{ width: "29px" }} alt="" />,
      onClick: () => history.push("/mobile-home"),
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
    <StyledLayout className="mobile-insurance-layout">
      {children}
      <BottomNavigation items={bottomNavItems} defaultTab={1} />
    </StyledLayout>
  );
};

// css
const StyledLayout = styled.div`
  background-color: white;
  padding: 18px;
  width: 100%;
  height: 100%;
  position: absolute;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 80px;
  left: 0;
  top: 0;
`;

export default MobileInsuranceLayout;
