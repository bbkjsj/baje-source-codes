import React from "react";
import Styles from "../auth.module.css";

const Header = (props) => {
  const { mainText, infoText } = props;
  return (
    <>
      <h3
        className={Styles.welcomeText}
        style={{ fontSize: props.screens.xs ? "19px" : "1.5rem" }}
      >
        {mainText}
      </h3>
      <p
        className={Styles.infoText}
        style={{ fontSize: props.screens.xs ? "15px" : "17" }}
      >
        {infoText}
      </p>
    </>
  );
};

export default Header;
