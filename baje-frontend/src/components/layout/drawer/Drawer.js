import React, { useContext } from "react";
import Styles from "./drawer.module.css";
import { LayoutContext } from "../../../contex/Layout-context";
import SiderTopSection from "../../siderTopSection/SiderTopSection";
import MenuSider from "../../menuSider/MenuSider";
import { Drawer as AntDrawer } from "antd";

const Drawer = (props) => {
  const layoutContext = useContext(LayoutContext);
  return (
    <AntDrawer
      placement="right"
      closable={false}
      onClose={layoutContext.toggleDrawer}
      visible={layoutContext.drawerVisible}
      getContainer={false}
      className={Styles.container}
    >
      <SiderTopSection />
      <MenuSider drawerToggle={layoutContext.toggleDrawer} />
    </AntDrawer>
  );
};

export default Drawer;
