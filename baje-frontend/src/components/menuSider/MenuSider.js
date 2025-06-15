import React, { useContext, useState } from "react";
import Styles from "./menuSider.module.css";
import { Menu } from "antd";
import AppMenuItem from "../general/AppMenuItem";
import AppSubMenu from "../general/AppSubMenu";
import { getLink } from "_helpers";
import {
  UserOutlined,
  AppstoreOutlined,
  DashboardOutlined,
  CarOutlined,
  FileDoneOutlined,
  ReconciliationOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { permission as permissions } from "json/Permission";
import useCheckAccess from "hooks/useCheckAccess";
import { pageNames } from "constant";
import { NewContext } from "contex/New-Context";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

const { SubMenu } = Menu;
const rootSubmenuKeys = ["person", "machinery", "contract"];

const MenuSider = (props) => {
  const [openKeys, setOpenKeys] = useState(["management"]);
  const checkAccess = useCheckAccess();
  const user = useWhoAmI();
  const newContext = useContext(NewContext);
  const isDoctor = user?.isDoctor;
  const isPublicSuggestion = newContext.isPublicSuggestion();

  const toggleDrawer = () => {
    if (props.drawerToggle) {
      props.drawerToggle();
    }
  };

  const onOpenChange = (openKey) => {
    const latestOpenKey = openKey.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(openKey);
    } else {
      setOpenKeys(
        latestOpenKey ? [latestOpenKey, "management"] : ["management"]
      );
    }
  };

  // ==============
  // SUGGESTION USER MENU
  // ==============

  if (isPublicSuggestion) {
    return (
      <Menu
        // defaultSelectedKeys={[""]}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        defaultOpenKeys={["management"]}
        mode="inline"
      >
        <AppMenuItem
          key="dashboard"
          icon={<DashboardOutlined style={{ fontSize: "1.2rem" }} />}
          className={Styles.menuItem}
          onClick={toggleDrawer}
        >
          <NavLink to={pageNames.suggest.suggestion.list}>پیشنهادات</NavLink>
        </AppMenuItem>
      </Menu>
    );
  }

  // ==============
  // MAIN MENU
  // ==============

  return (
    <Menu
      // defaultSelectedKeys={[""]}
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      defaultOpenKeys={["management"]}
      mode="inline"
    >
      <Menu.SubMenu
        key="management"
        icon={<AppstoreOutlined style={{ fontSize: "1.2rem" }} />}
        title="مدیریت سامانه"
        className={Styles.subMenu}
      >
        <AppMenuItem
          key="dashboard"
          icon={<DashboardOutlined style={{ fontSize: "1.2rem" }} />}
          className={Styles.menuItem}
          onClick={toggleDrawer}
          hidden={isDoctor || isPublicSuggestion}
        >
          <NavLink to={pageNames.home.web}>داشبورد</NavLink>
        </AppMenuItem>

        <AppMenuItem
          key="visit"
          icon={<ReconciliationOutlined style={{ fontSize: "1.2rem" }} />}
          className={Styles.menuItem}
          onClick={toggleDrawer}
          hidden={!isDoctor}
        >
          <NavLink to={pageNames.personnel.realPerson.examination.personList}>
            معاینات پزشکی
          </NavLink>
        </AppMenuItem>

        <AppSubMenu
          key="person"
          icon={<UserOutlined style={{ fontSize: "1.2rem" }} />}
          title="افراد"
          className={Styles.subMenu}
          hidden={
            !checkAccess([
              permissions.LIST_PERSON,
              permissions.INSERT_PERSON,
              permissions.LIST_LEGAL,
              permissions.INSERT_LEGAL,
            ])
          }
        >
          <AppMenuItem
            key="rightful"
            className={Styles.menuItem}
            onClick={toggleDrawer}
            hidden={
              !checkAccess([permissions.LIST_PERSON, permissions.INSERT_PERSON])
            }
          >
            <NavLink to={pageNames.personnel.realPerson.list}>حقیقی</NavLink>
          </AppMenuItem>

          <AppMenuItem
            key="legal"
            className={Styles.menuItem}
            onClick={toggleDrawer}
            hidden={
              !checkAccess([permissions.LIST_LEGAL, permissions.INSERT_LEGAL])
            }
          >
            <NavLink to={pageNames.personnel.rightFull.list}>حقوقی</NavLink>
          </AppMenuItem>
          <AppMenuItem
            key=""
            className={Styles.menuItem}
            onClick={toggleDrawer}
          >
            <NavLink to={pageNames.personnel.insurance.supplymentary.list}>
              بیمه تکمیلی
            </NavLink>
          </AppMenuItem>
          <AppMenuItem
            key=""
            className={Styles.menuItem}
            onClick={toggleDrawer}
          >
            <NavLink to={pageNames.personnel.insurance.tamin.list}>
              بیمه تامین اجتماعی
            </NavLink>
          </AppMenuItem>

          <AppMenuItem
            key="doctor"
            className={Styles.menuItem}
            onClick={toggleDrawer}
          >
            <NavLink to={pageNames.personnel.doctor.list}>پزشک</NavLink>
          </AppMenuItem>
          <AppMenuItem
            key="annualSettings"
            className={Styles.menuItem}
            onClick={toggleDrawer}
          >
            <NavLink to={pageNames.personnel.annualSetting.list}>
              تنظیمات سالانه
            </NavLink>
          </AppMenuItem>
        </AppSubMenu>

        <AppSubMenu
          key="suggestion"
          icon={<BulbOutlined style={{ fontSize: "1.2rem" }} />}
          title="نظام پیشنهادات"
          className={Styles.subMenu}
        >
          <AppMenuItem
            key="suggestion"
            className={Styles.menuItem}
            onClick={toggleDrawer}
          >
            <NavLink to={pageNames.suggest.suggestion.list}> پیشنهادات</NavLink>
          </AppMenuItem>

          <AppMenuItem
            key="committee"
            className={Styles.menuItem}
            onClick={toggleDrawer}
            hidden={isPublicSuggestion}
          >
            <NavLink to={pageNames.suggest.commitee.list}> کارگروه ها</NavLink>
          </AppMenuItem>

          <AppMenuItem
            key="assessment"
            className={Styles.menuItem}
            onClick={toggleDrawer}
            hidden={isPublicSuggestion}
          >
            <NavLink
              to={getLink(pageNames.suggest.assessmentCriteria.list, false)}
            >
              ملاک های ارزیابی
            </NavLink>
          </AppMenuItem>

          <AppMenuItem
            key="rejection"
            className={Styles.menuItem}
            onClick={toggleDrawer}
            hidden={isPublicSuggestion}
          >
            <NavLink
              to={getLink(pageNames.suggest.rejectionCriteria.list, false)}
            >
              ملاک های رد
            </NavLink>
          </AppMenuItem>

          <AppMenuItem
            key="category"
            className={Styles.menuItem}
            onClick={toggleDrawer}
            hidden={isPublicSuggestion}
          >
            <NavLink to={pageNames.suggest.category.list}>
              حوزه‌های پیشنهاد
            </NavLink>
          </AppMenuItem>

          <AppMenuItem
            key="call"
            className={Styles.menuItem}
            onClick={toggleDrawer}
            hidden={isPublicSuggestion}
          >
            <NavLink to={pageNames.suggest.call.list}> فراخوان ها</NavLink>
          </AppMenuItem>

          <AppMenuItem
            key="reports"
            className={Styles.menuItem}
            onClick={toggleDrawer}
            hidden={isPublicSuggestion}
          >
            <NavLink to={pageNames.suggest.reportIndex}>گزارشات</NavLink>
          </AppMenuItem>

          <AppMenuItem
            key="configuration"
            className={Styles.menuItem}
            onClick={toggleDrawer}
            hidden={isPublicSuggestion}
          >
            <NavLink to={pageNames.suggest.configuration}> تنظیمات</NavLink>
          </AppMenuItem>
        </AppSubMenu>

        <AppMenuItem
          onClick={toggleDrawer}
          key="shiftwork"
          icon={<CarOutlined style={{ fontSize: "1.2rem" }} />}
          className={Styles.subMenu}
        >
          <NavLink to={pageNames.personnel.shiftWork.list}>شیفت کاری</NavLink>
        </AppMenuItem>

        <AppMenuItem
          onClick={toggleDrawer}
          key="machinery"
          icon={<CarOutlined style={{ fontSize: "1.2rem" }} />}
          className={Styles.subMenu}
          hidden={
            !checkAccess([
              permissions.LIST_MACHINERY,
              permissions.INSERT_MACHINERY,
            ])
          }
        >
          <NavLink to={pageNames.machinery.list}>ماشین آلات</NavLink>
        </AppMenuItem>

        <AppSubMenu
          key="contract"
          icon={<FileDoneOutlined style={{ fontSize: "1.2rem" }} />}
          title="امور قرارداد ها"
          className={Styles.subMenu}
          hidden={
            !checkAccess([
              permissions.LIST_CONTRACT,
              permissions.INSERT_CONTRACT,
            ])
          }
        >
          <Menu.Item key="" className={Styles.menuItem} onClick={toggleDrawer}>
            <NavLink to={pageNames.contract.list}>قرارداد ها</NavLink>
          </Menu.Item>
        </AppSubMenu>
      </Menu.SubMenu>
    </Menu>
  );
};

export default MenuSider;
