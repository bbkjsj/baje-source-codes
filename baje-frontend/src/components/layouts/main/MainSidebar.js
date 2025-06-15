import { Space, Menu, Button } from "antd";
import logo from "../../../assets/images/logo.svg";
import styled from "styled-components";
import AppDropdown from "../../general/AppDropdown";
import { MoreOutlined, CloseOutlined } from "@ant-design/icons";
import ShadowAvatar from "../../general/ShadowAvatar";
import MainSidebarMenu from "./MainSidebarMenu";
import { PoweroffOutlined } from "@ant-design/icons";
import TodayDate from "../../general/TodayDate";
import menu from "../../../assets/images/icons/menu.svg";
import arrows from "../../../assets/images/icons/arrows.svg";
import { useCallback, useEffect, useState } from "react";
import bp from "../../../utils/breakpoints";
import React, { useContext } from "react";
import UserProfile from "../../../assets/icons/profile_full.svg";
import WomanUserProfile from "../../../assets/icons/profile_woman_full.svg";
import { useHistory } from "react-router-dom";
import AppButton from "components/general/AppButton";
import { config, pageNames } from "constant";
import { useDispatch, useSelector } from "react-redux";
import { NewContext } from "contex/New-Context";
import useWhoAmI from "hooks/useWhoAmI";
import { GET_USER } from "modules/personnel/realPerson/users/utils/api";

const MainSidebar = ({ collapsed, onCollapse, showSidebar, onHide }) => {
  const dispatch = useDispatch();
  const [menuScroll, setMenuScroll] = useState(false);

  const newContext = useContext(NewContext);
  const history = useHistory();
  const user = useWhoAmI();
  const defaultImage = user?.gender === "f" ? WomanUserProfile : UserProfile;
  const [profile, setProfile] = useState(defaultImage);

  const getMenuScroll = () => {
    return menuScroll;
  };

  const userMenu = (
    <Menu>
      {/* <Menu.Item>
        <a href="#">ویرایش اطلاعات</a>
      </Menu.Item> */}
      <Menu.Item>
        <a
          href="#"
          onClick={() => {
            if (newContext.isPublicSuggestion()) {
              history.replace(pageNames.suggest.auth.intro);
            } else {
              history.replace(pageNames.auth.login);
            }
            newContext.signOut();
          }}
        >
          خروج
        </a>
      </Menu.Item>
    </Menu>
  );

  const getUserTitle = () =>
    newContext.isPublicSuggestion()
      ? "پیشنهاد دهنده"
      : user?.isDoctor
      ? "پزشک"
      : "کاربر سازمان";

  const setUserProfile = useCallback(() => {
    if (user?.id) {
      GET_USER(user.id).then((res) => {
        if (res?.data?.image_url) {
          setProfile(
            config.url.API_URL +
              "/api/v1/baje" +
              res?.data?.image_url.replace("$.", "")
          );
        }
      });
    }
  }, [user.id]);

  useEffect(() => {
    setUserProfile();
  }, [setUserProfile]);

  return (
    <SidebarContainer className="w-100">
      <div
        className={`main-sidebar ${collapsed && "collapsed"} ${
          showSidebar && "open"
        }`}
      >
        {!collapsed && (
          <div
            className={`sidebar-header w-100 bg-primary-dark ${
              menuScroll && !collapsed && "scroll"
            }`}
          >
            <div className="w-100 flex align-start">
              <img className="sidebar-logo" alt="جهاد نصر کرمان" src={logo} />
              <div className="mr-2">
                <p className="sidebar-title text-12 m-0">
                  بانک اطلاعات جامع هلدینگ
                </p>
                <p className="text-white text-12 mb-0">
                  بــــــــــــــــــــــــــــاجــــــــــــــــــــــــه
                </p>
              </div>
              <CloseOutlined
                className="mr-auto text-white text-20 hide-desktop"
                onClick={() => onHide()}
              />
            </div>
          </div>
        )}

        <div
          className={`sidebar-subheader flex bg-primary-dark px-2 w-100 justify-between ${
            collapsed && "collapsed"
          } ${menuScroll && !collapsed && "scroll"}`}
        >
          {!collapsed && <div></div>}
          <ShadowAvatar
            src={profile}
            size={collapsed ? 36 : 52}
            className={`sidebar-avatar ${
              collapsed && "sidebar-avatar--collapsed"
            } ${menuScroll && !collapsed && "scroll"}`}
          />
          {!collapsed && (
            <AppDropdown
              overlay={userMenu}
              trigger={["click"]}
              placement="bottomCenter"
            >
              <MoreOutlined className="text-white text-20" />
            </AppDropdown>
          )}
          <span
            className={`sidebar-toggle hide-mobile ${
              !collapsed && "collapsed"
            }`}
            onClick={onCollapse}
          >
            <img src={collapsed ? menu : arrows} alt="toggleMenu" />
          </span>
        </div>

        {!collapsed && (
          <div
            className={`sidebar-user pb-2 ${
              menuScroll && !collapsed && "scroll"
            }`}
          >
            <p className="text-center text-primary text-14 text-center mb-0">
              {user.fullname
                ? user.fullname
                : user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-center text-light-black text-12 text-center mb-0 user-pos">
              {getUserTitle()}
            </p>
          </div>
        )}

        <MainSidebarMenu
          collapsed={collapsed}
          hasCollapse={getMenuScroll}
          onHasScroll={(hasScroll) => setMenuScroll(hasScroll)}
        />

        <div className={`sidebar-footer flex ${collapsed && "collapsed"}`}>
          <TodayDate className="ml-2" />
          <AppButton
            icon={<PoweroffOutlined />}
            variant="danger"
            size="small"
            className="mr-auto p-0 px-2 text-14 footer-exit-btn"
            onClick={() => {
              if (newContext.isPublicSuggestion()) {
                history.replace(pageNames.suggest.auth.intro);
              } else {
                history.replace(pageNames.auth.login);
              }

              newContext.signOut();
            }}
          >
            خروج
          </AppButton>
        </div>
      </div>
    </SidebarContainer>
  );
};

// css
const SidebarContainer = styled.div`
  position: relative;

  .main-sidebar {
    background-color: white;
    box-shadow: 0px -1px 6px rgba(22, 25, 49, 0.05);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 16px) !important;
    position: fixed;
    transition: max-width 0.3s linear;
    @media (min-width: ${bp.lg}) {
      width: 100%;
      max-width: 208px;
      &.collapsed {
        max-width: 88px;
        .sidebar-custom-icon {
          position: absolute;
          top: 15%;
          transform: translateX(-50%);
          left: 50%;
        }
      }
    }
    @media (max-width: ${bp.lg}) {
      height: 100% !important;
      top: 0;
      right: -100%;
      width: 100%;
      box-shadow: 0px 0px 50px rgba(0, 0, 0, 0.5);
      opacity: 0;
      padding-bottom: 70px;
    }

    &.open {
      right: 0% !important;
      opacity: 1;
      z-index: 20;
    }
  }

  .sidebar-header {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    padding: 20px 10px;
    border: 1px solid rgba(224, 231, 246, 0.25);
    opacity: 1;
    transition: all 0.3s linear;

    &.scroll {
      @media (min-width: ${bp.lg}) {
        height: 0px;
        opacity: 0;
        padding: 0px;
        border: none;
      }
    }
  }

  .sidebar-subheader {
    &.collapsed,
    &.scroll {
      border-top-right-radius: 4px;
      border-top-left-radius: 4px;
    }

    &.scroll {
      @media (min-width: ${bp.lg}) {
        padding-top: 10px;
        padding-bottom: 10px;
        .ant-dropdown-trigger {
          z-index: 1;
        }
      }
    }
  }

  .sidebar-title {
    color: rgba(255, 255, 255, 0.35);
  }

  .sidebar-logo {
    width: 32px;
    height: 36px;
  }

  .sidebar-avatar {
    transform: translateY(20px) translateX(-10px);

    &--collapsed {
      transform: none;
      margin: 11px auto;
    }

    &.scroll {
      @media (min-width: ${bp.lg}) {
        width: 32px !important;
        height: 32px !important;
        line-height: 32px !important;
        font-size: 14px !important;
        transform: translateY(0px) translateX(62px);
      }
    }
  }

  .sidebar-user {
    padding-top: 30px;

    &.scroll {
      @media (min-width: ${bp.lg}) {
        padding: 0px 56px;
        background: #235786;
        margin-top: -41px;
        P {
          font-size: 12px;
          color: white;
          text-align: right;
          margin-right: 60px;
        }

        .user-pos {
          font-size: 10px;
          color: #f6f6f6;
        }
      }
    }
  }

  .sidebar-footer {
    width: 100%;
    background-color: #ffffff;
    padding: 8px;
    box-shadow: 0px -1px 6px rgba(22, 25, 49, 0.05);
    position: relative;
    bottom: 0;
    right: 0;
    max-width: 208px;
    border-radius: 0px 0px 4px 4px;

    &.collapsed {
      max-width: 88px;
      flex-wrap: wrap;

      .today-date {
        min-width: 70px;
        flex-wrap: wrap !important;
        justify-content: center;
        margin-bottom: 8px;
      }
    }

    @media (max-width: ${bp.lg}) {
      max-width: 100%;
      padding-right: 16px;
      padding-left: 16px;
      .today-date {
        max-width: 100px;
      }
    }

    @media (min-width: ${bp.lg}) {
      .footer-exit-btn {
        width: 100%;
      }
    }
  }

  .sidebar-toggle {
    width: 20px;
    height: 20px;
    border-radius: 2px;
    background-color: ${({ theme }) => theme["primary-dark"]};
    border: 1px solid #ffffff;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 2px 8px rgba(22, 25, 49, 0.15);
    transition: transform 0.3s linear;
    left: -10px;
    z-index: 1;
    cursor: pointer;

    &:hover {
      transform: scale(1.2);
    }

    &.collapsed {
      top: 160px;

      img {
        width: 10px;
      }
    }

    img {
      width: auto;
      max-width: 20px;
    }
  }

  .sidebar-after::after {
    padding: 172px 0 0 0;
    content: "";
    display: block;
  }
`;

export default MainSidebar;
