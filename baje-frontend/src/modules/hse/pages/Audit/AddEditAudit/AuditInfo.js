import { Col, Form, Row } from "antd";
import React, { useContext, useEffect } from "react";
import { config, ruleMessages } from "constant";
import { constant, questionGroups } from "modules/hse/constant";

import AppButton from "components/general/AppButton";
import AppFormItem from "components/general/AppFormItem";
import AppInput from "components/general/AppInput";
import AppRadioGroup from "components/general/AppRadioGroup";
import { AuditContext } from "./context";
import { CloseOutlined } from "@ant-design/icons";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import Existency from "./Existency";
import bp from "utils/breakpoints";
import moment from "moment-jalaali";
import styled from "styled-components";
import useIsMobile from "hooks/useIsMobile";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

const AuditInfo = () => {
  const todayDate = moment();
  const user = useWhoAmI();
  const [form] = Form.useForm();
  const isMobile = useIsMobile();

  const {
    setState: setParentState,
    state: parentState,
    toggleQuestionPicker,
    handleCreateAudit,
  } = useContext(AuditContext);

  useEffect(() => {
    form.setFields([
      { name: "date", value: todayDate.format("jYYYY/jMM/jDD") },
      { name: "group", value: constant.vehicle },
    ]);
  }, []);

  const handleChangeGroup = ({ target }) => {
    form.resetFields(["search"]);
    setParentState((s) => ({
      ...s,
      group: target.value,
      existency: {},
      selectedQuestions: [],
    }));
  };

  const handleRemoveQuestion = (question) => {
    return;
    // Modal.warning({
    //   centered: true,
    //   maskClosable: true,
    //   title: "نسبت به حذف سوال مطمئن هستید؟",
    //   onOk: () => toggleSelectQuestion(question),
    // });
  };

  const handleRemoveDescription = () => {
    form.resetFields(["description"]);
  };

  return (
    <>
      <Form
        initialValues={{ group: constant.vehicle }}
        form={form}
        onFinish={handleCreateAudit}
      >
        <Row align="middle">
          <Col md={16} sm={24} className="w-xs-100">
            <Row gutter={10} className="mt-4">
              <Col md={8} sm={24} className="w-xs-100">
                <AppFormItem
                  name="group"
                  required
                  label={!isMobile && "گروه ممیزی"}
                >
                  <StyledAppRadioGroup
                    onChange={handleChangeGroup}
                    options={questionGroups.map((item) => ({
                      label: item.text,
                      value: item.value,
                      disabled: item.value === constant.environment,
                    }))}
                    className="w-xs-100"
                  />
                </AppFormItem>
              </Col>
              <Col md={8} sm={24} className="w-xs-100">
                <CustomDatePicker
                  plain
                  form={form}
                  maximumDate={{
                    day: parseInt(todayDate.format("jD")),
                    month: parseInt(todayDate.format("jM")),
                    year: parseInt(todayDate.format("jYYYY")),
                  }}
                  label="تاریخ بازرسی"
                  name="date"
                  rules={[
                    { required: true, message: ruleMessages.required("تاریخ") },
                  ]}
                  centerTextMobile
                />
              </Col>

              <Existency form={form} />
            </Row>

            <Row gutter={10}>
              <Col md={8} sm={24} className="w-xs-100">
                <AppFormItem name="description" label={!isMobile && "توضیحات"}>
                  <AppInput
                    prefix={
                      <CloseOutlined
                        style={{ color: "red", fontSize: 10 }}
                        onClick={handleRemoveDescription}
                      />
                    }
                    placeholder={isMobile ? "توضیحات" : ""}
                    className="text-xs-center"
                  />
                </AppFormItem>
              </Col>

              <Col md={8} sm={24} className="w-xs-100">
                <AppFormItem required label={!isMobile && "ممیزی کننده"}>
                  <AppInput
                    className="text-xs-center"
                    disabled
                    value={`${isMobile ? "ممیزی کننده:" : ""} ${
                      user.firstName
                    } ${user.lastName}`}
                  />
                </AppFormItem>
              </Col>

              {/* {!isMobile && (
                <Col md={8} sm={24}>
                  <AppFormItem label="انتخاب سوال">
                    <AppButton
                      variant="primary"
                      disabled={!parentState.group}
                      className="w-100"
                      onClick={toggleQuestionPicker}>
                      انتخاب سوال
                    </AppButton>
                  </AppFormItem>
                </Col>
              )} */}
            </Row>
          </Col>
          <Col md={8} sm={24}>
            {parentState.group === constant.inidividual &&
              parentState.existency.id && (
                <div className="flex flex-column">
                  <img
                    src={config.url.API_URL + parentState.existency.image_url}
                    alt="profile"
                    style={{
                      width: "150px",
                      height: "250px",
                      borderRadius: "20px",
                    }}
                  />
                </div>
              )}
            {parentState.group === constant.vehicle &&
              parentState.existency.id && (
                <div className="flex flex-column align-center">
                  <p>
                    ماشین <strong>{parentState.existency.type}</strong>
                    {` ${parentState.existency.system} تیپ ${parentState.existency.style}`}
                    <strong>{parentState.existency.color}</strong>
                    {" - کد سازمانی "}
                    {parentState.existency.organization_code}
                  </p>
                </div>
              )}
          </Col>
        </Row>

        {/* <Divider /> */}
        {/* <Row>
          {parentState.selectedQuestions.map((question) => (
            <Col md={8} sm={24} key={question.id}>
              <QuestionItem
                question={question}
                checked
                onClick={handleRemoveQuestion}
              />
            </Col>
          ))}
        </Row> */}

        <div className="flex row justify-end mt-2">
          {isMobile && (
            <AppButton
              variant="primary"
              disabled={!parentState.group}
              className="w-100"
              onClick={toggleQuestionPicker}
            >
              انتخاب سوال
            </AppButton>
          )}

          <AppButton
            loading={parentState.loading}
            disabled={
              !parentState.group ||
              !parentState.existency.id ||
              parentState.selectedQuestions.length === 0
            }
            htmlType="submit"
            variant="primary"
            className={isMobile && "w-100"}
          >
            بعدی
          </AppButton>
        </div>
      </Form>
    </>
  );
};

// styles
const StyledAppRadioGroup = styled(AppRadioGroup)`
  @media (max-width: ${bp.xs}) {
    display: flex;
    justify-content: space-around;
  }
`;

export default AuditInfo;
