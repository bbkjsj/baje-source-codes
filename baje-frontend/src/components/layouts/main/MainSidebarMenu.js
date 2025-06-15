import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import items from "../../../utils/sidebarItems";
import { Menu, Badge } from "antd";
import { Link } from "react-router-dom";

import AppBadge from "components/general/AppBadge";
import { convertLegacyProps } from "antd/lib/button/button";
import { useHistory } from "react-router";
import { getLink } from "_helpers";
const { SubMenu } = Menu;

const MainSidebarMenu = (props) => {
  const rootSubmenuKeys = ["0", "1", "2", "3", "4"];
  const history = useHistory();
  const menuEl = useRef(null);
  const [openKeys, setOpenKeys] = React.useState([]);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  // collapse sidebar header if sidebar is scrollabe
  useEffect(() => {
    if (menuEl.current) {
      const el = menuEl.current;
      function handleScrollChange() {
        const scrollY = el.scrollTop;
        // console.log(
        //   "height - scrollY - scroll height:",
        //   el.scrollHeight - el.offsetHeight
        // );

        const threshold = el.scrollHeight - el.offsetHeight;

        if (scrollY > 0) {
          props.onHasScroll(true);
          el.classList.add("sidebar-after");
        } else {
          //el.style.paddingTop = "0px";
          props.onHasScroll(false);
          el.classList.remove("sidebar-after");
        }
      }

      // function handleScrollChange() {
      //   const scrollY = el.scrollTop;

      //   const threshold = el.scrollHeight - el.offsetHeight;
      //   console.log(
      //     threshold + " " + scrollY + " " +  (threshold-scrollY)
      //   );

      //   if(threshold-scrollY===0){
      //     // offssetScroll=scrollY;
      //     // if(!collapse)
      //       props.onHasScroll(true);
      //   }else{
      //     // collapse=false;
      //     // offssetScroll=0;
      //     props.onHasScroll(false);
      //   }

      //   if(!threshold || threshold===0)
      //   props.onHasScroll(false);

      el.addEventListener("scroll", handleScrollChange);
      return () => {
        el.removeEventListener("scroll", handleScrollChange);
      };
    }
  }, []);

  function getDefaultSelected() {
    const URL = window.location.pathname.split("/");

    if (URL.includes("dashboard")) {
      return 0;
    }
    if (URL.includes("person")) {
      return 1;
    }
    if (URL.includes("insurance")) {
      return 2;
    }
    if (URL.includes("machinery")) {
      return 3;
    }
    if (URL.includes("contract")) {
      return 4;
    }
    if (URL.includes("hse")) {
      return 5;
    }
    if (URL.includes("task") || URL.includes("card-boards")) {
      return 6;
    }
    if (URL.includes("environments") || URL.includes("environment-usage")) {
      return 7;
    }
    if (URL.includes("suggest")) {
      return 8;
    }

    return -1;
  }

  // items loop
  const menuItems = items().map((i, idx) => {
    if (!i.hidden) {
      if (i.items) {
        return (
          <SubMenu
            key={idx.toString()}
            icon={
              i.icon && !props.collapsed ? (
                <div style={{ width: "30px" }}>{i.icon}</div>
              ) : (
                i.icon
              )
            }
            title={
              i.badge && !props.collapsed ? (
                <div className="item-text w-100 align-center flex">
                  <span>{i.title}</span>
                  <Badge count={i.badge || 0} className="mr-2" />
                </div>
              ) : (
                i.title
              )
            }
            className={i.className ? i.className : ""}
          >
            {i.items.map((subItem, subIdx) => {
              if (!subItem.hidden) {
                if (subItem.items) {
                  return (
                    <SubMenu
                      key={"sub" + idx.toString() + subIdx.toString()}
                      title={
                        subItem.badge ? (
                          <span className="item-text second w-100 flex align-center">
                            <span>{subItem.title}</span>
                            <Badge
                              count={subItem.badge || 0}
                              className="mr-2"
                            />
                          </span>
                        ) : (
                          subItem.title
                        )
                      }
                    >
                      {subItem.items &&
                        subItem.items.map((lvl3Item, lvl3Idx) => {
                          if (!lvl3Item.hidden) {
                            return (
                              <Menu.Item
                                key={
                                  idx + subIdx.toString() + lvl3Idx.toString()
                                }
                                className="flex w-100 align-center pr-4"
                              >
                                {lvl3Item.link ? (
                                  <span className="item-text third w-100 flex align-center">
                                    <Link to={lvl3Item.link}>
                                      {lvl3Item.title}
                                    </Link>
                                    <AppBadge
                                      count={lvl3Item.badge || 0}
                                      className="mr-2"
                                    />
                                  </span>
                                ) : (
                                  <span
                                    onClick={() => {
                                      history.push(
                                        getLink(
                                          lvl3Item.to.pathname,
                                          lvl3Item.to.params
                                        )
                                      );
                                    }}
                                  >
                                    {lvl3Item.title}
                                  </span>
                                )}
                              </Menu.Item>
                            );
                          }
                        })}
                    </SubMenu>
                  );
                } else {
                  return (
                    <Menu.Item
                      key={idx + subIdx.toString()}
                      className="flex w-100 align-center"
                    >
                      <span
                        className="item-text second flex w-100 align-center"
                        onClick={() => {
                          if (subItem?.onClick) {
                            subItem.onClick();
                          }
                        }}
                      >
                        <Link to={subItem.link}>{subItem.title}</Link>
                        <AppBadge count={subItem.badge || 0} className="mr-2" />
                      </span>
                    </Menu.Item>
                  );
                }
              }
            })}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item
            key={idx.toString()}
            icon={i.icon}
            className={`${
              i.badge && !props.collapsed && "flex w-100 align-center"
            }`}
          >
            <span
              className={`item-text ${
                i.badge && !props.collapsed && "flex w-100 align-center"
              }`}
            >
              <Link to={i.link}>{i.title}</Link>
              {i.badge && !props.collapsed && (
                <AppBadge count={i.badge || 0} className="mr-auto" />
              )}
            </span>
          </Menu.Item>
        );
      }
    }
  });

  // items layout
  return (
    <MenuContainer ref={menuEl} className="h-100 overflow-auto">
      <StyledMenu
        {...props}
        mode="inline"
        defaultSelectedKeys={[
          getDefaultSelected() ? getDefaultSelected().toString() : "0",
        ]}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        className="sidebar-menu"
        inlineIndent={14}
      >
        {menuItems}
      </StyledMenu>
    </MenuContainer>
  );
};

// css
const MenuContainer = styled.div`
  overflow-y: auto;
  overflow-anchor: none;
  overflow-x: hidden;
  flex-grow: 1;
  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: #eee;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 999px;
  }
`;
const StyledMenu = styled(Menu)`
  .ant-menu-item::after {
    right: 3px !important;
    left: auto !important;
    border-color: white;
    top: 3px;
    bottom: 3px;
    border-radius: 999px;
    border-width: 2px;
  }

  .ant-menu-item-selected::after {
    opacity: 1 !important;
    transform: none !important;
  }

  &.ant-menu-rtl.ant-menu-inline {
    border-left: none !important;
  }

  &.sidebar-menu > .ant-menu-submenu {
    border-top: 1px solid rgba(224, 231, 246, 0.25) !important;
    border-bottom: 1px solid rgba(224, 231, 246, 0.25) !important;
    .ant-menu-submenu-title span:not(.anticon, .ant-scroll-number-only-unit) {
      display: inline-block;
    }
  }

  &.sidebar-menu > .ant-menu-submenu {
    transition: none !important;
    & > .ant-menu-submenu-title {
      transition: none !important;
    }
  }

  .ant-menu-submenu-title:active {
    background-color: transparent !important;
    background: transparent !important;
  }

  &.ant-menu-inline .ant-menu-item:not(:last-child) {
    margin-bottom: 0px !important;
  }

  &.sidebar-menu > .ant-menu-submenu:hover,
  &.sidebar-menu > .ant-menu-item:not(.ant-menu-item-selected):hover {
    color: black;
    .anticon {
      color: ${({ theme }) => theme.primary};
    }
    .ant-menu-submenu-title {
      color: black;
    }
    .item-text a {
      color: black;
    }
  }

  .ant-menu-submenu-title {
    display: flex;
  }

  &.sidebar-menu > .ant-menu-item:not(.ant-menu-item-selected) {
    .item-text {
      transform: translateY(-2px);
      a {
        color: rgba(0, 0, 0, 0.65);
      }
    }
  }

  .ant-menu-submenu {
    color: rgba(0, 0, 0, 0.65);

    .anticon {
      color: ${({ theme }) => theme.accent};
    }

    &-open {
      background-color: ${({ theme }) => theme.primary};
      color: white !important;
      position: relative;
      .anticon {
        color: white;
      }
      .ant-menu {
        background-color: ${({ theme }) => theme.primary};
        .ant-menu-item {
          color: white;
        }
      }

      .ant-menu-submenu-arrow {
        color: white !important;
      }

      .ant-menu-submenu-title {
        color: white !important;
      }

      .ant-menu-sub .ant-menu-submenu-title::before,
      .ant-menu-sub > .ant-menu-item > .item-text::before {
        content: "•";
        color: white;
        font-size: 18px;
        margin-left: 8px;
        position: relative;
        top: 0px;
      }

      &:hover {
        .anticon {
          color: white !important;
        }
      }
      &::before {
        content: "";
        position: absolute;
        height: 95%;
        width: 2px;
        background-color: white;
        border-radius: 999px;
        top: 50%;
        right: 3px;
        transform: translateY(-50%);
        z-index: 1;
      }
    }
  }

  .ant-menu-sub .ant-menu-item {
    color: rgba(255, 255, 255, 0.65) !important;
    transition: all 0.3s ease;
    max-width: fit-content;

    a {
      color: rgba(255, 255, 255, 0.65) !important;
    }

    span:not(.ant-badge):not(.second) {
      border-radius: 11px !important;
      transition: all 0.3s ease;
      padding: 5px 10px;
      font-weight: 400;
      font-size: 13px;

      /* &::before {
        content: "○";
        color: rgba(255, 255, 255, 0.65);
        font-size: 14px;
        margin-left: 8px;
        position: absolute;
        top: 2px;
        &:hover {
          color: white !important;
        }
      } */
    }

    .item-text {
      padding-left: 14px;
      padding-right: 14px;
      //border-radius: 10px !important;
      &:hover {
        color: white !important;
        background-color: rgba(125, 175, 222, 0.5);
        border-radius: 11px !important;
        a {
          color: white !important;
        }
        &::before {
          color: white !important;
        }
      }
    }

    &:active {
      background-color: transparent;
    }
  }

  .ant-menu-item {
    color: rgba(0, 0, 0, 0.65);

    .anticon {
      color: ${({ theme }) => theme.accent};
    }
  }

  .ant-menu-item-selected {
    background-color: ${({ theme }) => theme.primary} !important;
    color: white !important;

    .anticon {
      color: white;
    }
    a {
      color: white;
    }
  }

  .ant-menu-sub .ant-menu-submenu {
    // border-bottom: 1px solid rgba(255, 255, 255, 0.35);
    // border-color: rgba(255, 255, 255, 0.35);
    position: relative;
    &:not(:last-of-type) {
      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        width: 90%;
        right: 50%;
        height: 1px;
        transform: translateX(50%);
        background-color: rgba(255, 255, 255, 0.35);
      }
    }
    /* &-open {
      border-bottom: 1px solid transparent;
    } */
  }

  &.ant-menu-inline-collapsed {
    width: 100% !important;

    .ant-menu-submenu-title {
      padding: 0px !important;
      padding-right: 0px !important;
    }

    & > .ant-menu-item {
      padding: 0px !important;
      height: 64px;
      margin-bottom: 0px;
      & > span:not(.anticon) {
        opacity: 1;
        display: block;
        position: absolute;
        margin-top: 0;
        text-align: center;
        top: 20px;
        width: 100%;
        max-width: 100%;
        font-size: 12px;
      }
      & > .anticon {
        margin-left: auto;
        margin-right: auto;
        display: block;
      }
    }

    & > .ant-menu-submenu {
      padding: 0px;
      height: 64px;
      margin-bottom: 0px;
      &::before {
        display: none;
      }
      & > .ant-menu-submenu-title {
        padding: 0px;
        height: 64px;
        margin-bottom: 0px;
        & > span:not(.anticon) {
          opacity: 1;
          display: block;
          position: absolute;
          margin-top: 0;
          text-align: center;
          top: 20px;
          width: 100%;
          max-width: 100%;
          font-size: 11px;
        }
        & > .anticon {
          margin-left: auto;
          margin-right: auto;
          display: block;
        }
      }
    }

    .ant-menu-sub .ant-menu-item:hover {
      background: #000000 !important;
    }
  }

  &.sidebar-menu > .ant-menu-submenu-selected {
    background-color: ${({ theme }) => theme.primary} !important;
    color: white !important;
    position: relative;

    .anticon,
    .ant-menu,
    span,
    .ant-menu-submenu-arrow {
      color: white !important;
    }

    &::before {
      content: "";
      position: absolute;
      height: 85%;
      width: 2px;
      background-color: white;
      border-radius: 999px;
      top: 50%;
      right: 3px;
      transform: translateY(-50%);
      z-index: 1;
    }
  }

  .suggestions-collapse {
    margin-left: 8px;
    margin-right: 8px;
    margin-top: 8px;
    margin-bottom: 16px;
    background: rgba(243, 161, 50, 0.12);
    border: 1px solid rgba(243, 161, 50, 0.6);
    .ant-collapse-arrow {
      right: auto !important;
      left: 8px !important;
      margin-top: 3px;
    }
    .ant-collapse-header {
      padding-right: 8px;
      padding-top: 10px;
      padding-bottom: 10px;
    }
    &--title {
      margin-right: 8px;
    }

    .suggestions-panel {
      border: none;
    }

    .ant-collapse-content-box {
      padding: 0px;
    }

    .ant-menu-submenu-title {
      &::before {
        color: #c20000 !important;
      }
    }
    .ant-menu-submenu-title::before {
      color: #c20000 !important;
    }
  }

  .ant-menu-inline .ant-menu-submenu-title {
    margin: 0px;
  }

  .ant-menu-submenu.suggestions-submenu:not(.ant-menu-submenu-open) {
    background-color: #fef4e6;
    transition: all 0.3s ease;
    &:hover {
      background-color: #f8eddd;
    }
    span,
    a,
    .ant-menu-submenu-arrow {
      color: #c20000 !important;
      font-weight: bold;
    }
  }

  .suggestions-submenu.ant-menu-submenu-open {
    color: #c20000 !important;
    background-color: #fef4e6;
    .ant-menu {
      background-color: #fef4e6;
    }
    span {
      color: #c20000 !important;
    }
    *:not(strong):not(.ant-scroll-number-only-unit) {
      color: #c20000 !important;
    }
    .ant-menu-item {
      span {
        color: #c20000 !important;
      }
      *:not(strong):not(.ant-scroll-number-only-unit) {
        color: #c20000 !important;
      }
      .item-text {
        color: #c20000 !important;
        &::before {
          color: #c20000 !important;
        }
        &:hover {
          color: #c20000 !important;
          background-color: #f8eddd;
          a {
            color: #c20000 !important;
          }
          &::before {
            color: #c20000 !important;
          }
        }
      }
      .ant-menu-submenu-title {
        &::before {
          color: #c20000 !important;
        }
      }
    }
    .ant-menu-submenu-open {
      background-color: #fef4e6;
      span {
        color: #c20000 !important;
      }
      *:not(strong):not(.ant-scroll-number-only-unit) {
        color: #c20000 !important;
      }
      .item-text {
        //background-color: #f8eddd;
        &::before {
          color: #c20000 !important;
        }
        &:hover {
          color: #c20000 !important;
          background-color: #f8eddd;
          a {
            color: #c20000 !important;
          }
          &::before {
            color: #c20000 !important;
          }
        }
      }
      .ant-menu-submenu-title {
        &::before {
          color: #c20000 !important;
        }
      }
    }
  }

  .suggestions-submenu {
    .ant-menu-submenu-title::before {
      color: #c20000 !important;
    }
    &.ant-menu-submenu-selected,
    .ant-menu-item-selected {
      background-color: #fef4e6 !important;
    }
    .ant-menu-submenu-arrow {
      color: #c20000 !important;
    }
    &.ant-menu-submenu-selected {
      color: #ffffff !important;
    }
    &.ant-menu-submenu-selected .ant-menu-submenu-arrow {
      color: #c20000 !important;
    }

    .ant-menu-item {
      width: 100%;
      max-width: 95%;
      margin-left: auto;
      margin-right: auto;
      margin-top: 0;
      ::after {
        border-color: #c20000 !important;
      }
    }

    .ant-menu-item:not(:last-of-type) {
      border-bottom: 1px solid #fbe8db;
    }

    .ant-menu-item:hover {
      background-color: #f8eddd;
    }

    &::before {
      display: none;
    }

    span.third {
      font-weight: 400;
      font-size: 13px;

      &::before {
        content: "○";
        color: #c20000 !important;
        font-size: 14px;
        margin-left: 8px;
        position: relative;
        top: 2px;
      }
    }
  }

  .suggestions-submenu > .ant-menu-sub > .ant-menu-item {
    padding-right: 10px !important;
  }

  .ant-badge-multiple-words {
    padding-top: 3px;
  }
`;

export default MainSidebarMenu;
