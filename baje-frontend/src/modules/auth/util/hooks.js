import React, { useState, useContext, useEffect } from "react";
import { loginSubmit, verifyCode } from "./api";
import { message } from "antd";
import { useHistory } from "react-router-dom";
import { pageNames } from "constant";
import { NewContext } from "contex/New-Context";

/***
 * steps  = 1 : getUsername 2: getCode
 */

export const useLoginSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserID] = useState();
  const [step, setStep] = useState("getUsername");
  const newContext = useContext(NewContext);
  const history = useHistory();

  const handleLoginSubmit = async (inputs) => {
    setLoading(true);
    try {
      let res = await loginSubmit(inputs);
      setLoading(false);
      setStep("getCode");
      setUserID(res.data.id);
    } catch (err) {
      setLoading(false);
      if (err.response) {
        message.error(err.response.data);
      }
    }
  };

  const onSubmit = async (inputs) => {
    if (step === "getUsername") {
      handleLoginSubmit(inputs);
    } else {
      setLoading(true);
      const data = { code: inputs.code, id: userId };
      try {
        let res = await verifyCode(data);
        newContext.signIn(res.data);
        const officeId = res.data.user?.company[0]?.id;
        if (officeId) newContext.getContractList();
        setLoading(false);
        window.location = res.data?.user?.isDoctor
          ? pageNames.personnel.realPerson.examination.personList
          : pageNames.home.web;
      } catch (err) {
        console.log("err", err);
        setLoading(false);
        if (err.response) {
          message.error(err.response.data);
        } else {
          message.error("مشکلی پیش آمده است لطفا دوباره تلاش کنید");
        }
      }
    }
  };

  return [loading, onSubmit, step, setStep, handleLoginSubmit];
};
