import { Form, Modal, notification } from "antd";
import AppButton from "components/general/AppButton";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import bp from "utils/breakpoints";
import * as fields from "./common/formItems";
import { signupContext } from "./signupContext";
import register from "assets/images/register.svg";
import { _GET_PHONE } from "./api";
import { getLink } from "_helpers";
import { pageNames } from "constant";

const InitialForm = () => {
  const [form] = Form.useForm();
  const { setNid, formVals } = useContext(signupContext);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const handleOnFinish = (values) => {
    console.log(values);
    setLoading(true);
    _GET_PHONE({
      national_code: values.national_code,
    })
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          if (!res.data.exist) {
            Modal.warning({
              content:
                "کد ملی وارد شده در سامانه وجود ندارد، لطفا ثبت نام کنید",
              onOk: () => {
                setNid(values.national_code);
                history.push(
                  getLink(pageNames.suggest.auth.signUp, { type: "register" })
                );
              },
              okText: "ثبت نام",
              closable: true,
            });
          } else {
            setNid(values.national_code, res.data.mobile);
          }
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        notification.error({
          message: "مشکلی پیش آمده، لطفا دوباره تلاش کنید",
        });
      });
  };

  function handleOnChange(values) {
    if (values.national_code && values.national_code.toString().length === 10) {
      handleOnFinish(values);
    }
  }

  return (
    <FormContainer className="fade-in">
      <img src={register} alt="register" className="mx-auto d-block user-img" />

      <Form
        form={form}
        name="signup"
        onFinish={handleOnFinish}
        className="mt-2"
        initialValues={formVals}
        onValuesChange={handleOnChange}
      >
        <fields.NID className="mx-auto" />
      </Form>

      <div className="flex justify-center mt-auto">
        <AppButton
          className="form-btn"
          variant="primary"
          size="large"
          loading={loading}
          onClick={() => form.submit()}
        >
          ادامه
        </AppButton>
        <AppButton
          className="form-btn mr-1"
          size="large"
          onClick={() => history.goBack()}
        >
          انصراف
        </AppButton>
      </div>
    </FormContainer>
  );
};

//css
const FormContainer = styled.div`
  padding-top: 75px;
  @media (max-width: ${bp.xxl}) {
    padding-top: 30px;
    .user-img {
      width: 100px;
    }
  }

  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;

  .form-btn {
    width: 126px;
    height: 48px;
    font-size: 14px;
  }
`;

export default InitialForm;
