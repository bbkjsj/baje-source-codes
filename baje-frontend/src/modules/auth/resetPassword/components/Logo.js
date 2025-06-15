import React from "react";
import LogoImage from "assets/img/logo.png";
import Styles from "../auth.module.css";

const Logo = (props) => {
  const style = {};
  if (!props.screens.xs) {
    style.width = "50%";
  }

  return (
    <img
      src={LogoImage}
      className={Styles.logoImage}
      alt="logo"
      style={style}
    />
  );
};

export default Logo;
