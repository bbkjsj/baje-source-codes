import React from "react";
import { Button } from "antd";
import { useHistory } from "react-router-dom";
import Styles from "./error.module.css";
import { pageNames } from "constant";

const Error = () => {
  const history = useHistory();
  return (
    <div className={Styles.container}>
      <h1>404</h1>
      <h3>صفحه ای یافت نشد</h3>
      <Button onClick={() => history.push(pageNames.home.web)}>
        صفحه اصلی
      </Button>
    </div>
  );
};

export default Error;
