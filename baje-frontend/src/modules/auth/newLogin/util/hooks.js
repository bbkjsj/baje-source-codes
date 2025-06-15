import React, { useState, useContext, useEffect } from "react";
import { _POST_LOGIN, _POST_VERIFY_CODE } from "./api";
import { message, Modal } from "antd";
import { useHistory } from "react-router-dom";
import { pageNames } from "constant";
import { NewContext } from "contex/New-Context";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentOffice } from "../../../../store/action/currentOffice";
/***
 * steps  = 1 : getUsername 2: getCode
 */

export const useLoginSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserID] = useState();
  const [step, setStep] = useState(0);
  const newContext = useContext(NewContext);
  const [userDataLogin, setUserDataLogin] = useState();
  const dispatch = useDispatch();
  const { replace } = useHistory();

  const handleLoginSubmit = async (inputs = null) => {
    setLoading(true);
    try {
      let res;
      if (inputs) {
        res = await _POST_LOGIN(inputs);
      } else {
        res = await _POST_LOGIN(userDataLogin);
      }

      setLoading(false);
      setStep(2);
      setUserID(res.data.id);
    } catch (err) {
      setLoading(false);
      if (err?.response?.data?.statusCode == 400) {
        Modal.error({ content: "نام کاربری یا رمز عبور نادرست است!" });
      }
    }
  };

  const onSubmit = async (inputs) => {
    if (step === 1) {
      setUserDataLogin(inputs);
      await handleLoginSubmit(inputs);
    } else {
      setLoading(true);

      try {
        let { data } = await _POST_VERIFY_CODE({
          code: inputs.code,
          id: userId,
        });
        newContext.signIn(data);
        setLoading(false);
        // if (data?.user?.defaultCompanyId) {
        //   dispatch(setCurrentOffice(data.user.defaultCompanyId));
        // }

        replace(
          data?.user?.isDoctor
            ? pageNames.personnel.realPerson.examination.list
            : data?.user?.defaultHomePage
            ? data.user.defaultHomePage.slice(
                data.user.defaultHomePage.indexOf(".ir") + 3,
                data.user.defaultHomePage.length
              )
            : pageNames.home.web
        );
      } catch (err) {
        console.log("err", err);
        setLoading(false);
        if (err?.response?.data?.statusCode == 400) {
          Modal.error({ content: "کد وارد شده صحیح نیست" });
        } else {
          message.error("مشکلی پیش آمده است لطفا دوباره تلاش کنید");
        }
      }
    }
  };

  return [loading, onSubmit, step, setStep, handleLoginSubmit];
};
