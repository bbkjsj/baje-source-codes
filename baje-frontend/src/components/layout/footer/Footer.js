import React from "react";
import Styles from "./footer.module.css";
import { Layout } from "antd";
import FooterContent from "../footerContent/FooterContent";

const { Footer: AntFooter } = Layout;
const Footer = (props) => {
  return (
    <AntFooter className={Styles.footer}>
      <FooterContent />
    </AntFooter>
  );
};

export default Footer;
