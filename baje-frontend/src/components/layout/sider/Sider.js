import React from "react";
import Styles from "./sider.module.css";
import { Layout } from "antd";
import SiderTopSection from "../../siderTopSection/SiderTopSection";
import MenuSider from "../../menuSider/MenuSider";
const { Sider: AntSider } = Layout;

const Sider = (props) => {
  return (
    <AntSider
      className={Styles.slider}
      breakpoint="md"
      collapsedWidth="0"
      width="280px"
    >
      <SiderTopSection />
      <MenuSider />
    </AntSider>
  );
};

export default Sider;
