import React, { useState } from "react";
import { Button, Grid } from "antd";
import { useHistory } from "react-router-dom";
import Styles from "./auth.module.css";
import Logo from "./components/Logo";
import Header from "./components/Header";
import From from "./components/form";

const { useBreakpoint } = Grid;

/*******
 * creator SahsaDEv
 * inputStatus: 1 = getNumber , 2 = getCode
 */

const goBackBtnStyle = { marginTop: "5px" };

const RestPassword = () => {
  const [inputStatus, setInputStatus] = useState(1);
  const history = useHistory();
  const screens = useBreakpoint();

  const goBackBtn = () => history.goBack();
  const handleWrongPhone = () => {
    setInputStatus(1);
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.centerBox}>
        <Logo screens={screens} />
        <Header
          screens={screens}
          mainText="فراموشی رمز عبور"
          infoText="برای بازیابی رمز عبور شماره تماس خود را وارد نمایید"
        />
        <From
          onSubmit={() => setInputStatus(2)}
          inputStatus={inputStatus}
          handleWrongPhone={handleWrongPhone}
        />
        <Button block type="default" style={goBackBtnStyle} onClick={goBackBtn}>
          بازگشت
        </Button>
      </div>
    </div>
  );
};

export default RestPassword;
