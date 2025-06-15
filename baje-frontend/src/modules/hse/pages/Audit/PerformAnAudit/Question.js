import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Col, Divider, Form, Modal, Row, Typography } from "antd";
import React, { useContext } from "react";

import AppButton from "components/general/AppButton";
import AppInput from "components/general/AppInput";
import AppPopConfirm from "components/general/AppPopConfirm";
import AppTable from "components/general/AppTable";
import AppTag from "components/general/AppTag";
import ContentTop from "components/general/ContentTop";
import CriticalValue from "modules/hse/components/Critical";
import { PerformAuditContext } from "./context";
import { criticalValues } from "./../../../constant";
import { pageNames } from "constant";
import { showMessage } from "utils/message";
import { useHistory } from "react-router";

const modalConfig = {
  centered: true,
  okText: "تایید بازرسی",
  // cancelText: "بازگشت و ویرایش پاسخ ها",
  // okCancel: true,
  // maskClosable: true,
};

const Question = () => {
  const { replace } = useHistory();
  const [form] = Form.useForm();
  const { state, handleSetAnswer, setState, handleSubmit } = useContext(
    PerformAuditContext
  );
  if (!state.audit.questions?.[state.questionIndex]) return null;
  const {
    id,
    audit_id_fk,
    question: content,
    question_id_fk,
    answer,
    critical,
    weight_factor,
    requirements,
    description,
    group,
    type,
    code,
  } = state.audit.questions[state.questionIndex];

  const handleNext = () => {
    if (
      !state.audit.questions[state.questionIndex].isNotRelated &&
      !state.audit.questions[state.questionIndex].is_not_related &&
      !state.audit.questions[state.questionIndex].answer
    )
      return showMessage("می بایست به همه سوالات پاسخ دهید", "error");

    if (state.questionIndex < state.audit.questions.length - 1)
      return setState((s) => ({ ...s, questionIndex: s.questionIndex + 1 }));

    const criticals = [];
    state.audit.questions.forEach((item) => {
      if (!item.critical || item.critical.length === 0) return;
      const criticalQ = item.critical
        .split(",")
        .find((critical) => critical === item.answer);
      if (criticalQ) criticals.push(item);
    });

    if (criticals.length > 0)
      return Modal.error({
        title: "پرمیت صادر نشد",
        ...modalConfig,
        onOk: () => handleSubmit(false),
        width: "60%",
        content: (
          <>
            <Typography.Title level={5}>
              برای این فرم بازرسی حالت بحرانی پیش آمده
            </Typography.Title>
            <QuestionTable questions={criticals} />
            <Divider />
          </>
        ),
      });

    const sum = state.audit.questions
      .filter((item) => item.answer)
      .reduce(
        (pre, current) =>
          parseInt(pre) + parseInt(current.answer) * current.weight_factor,
        [0]
      );

    const totalPoint = state.audit.questions
      .filter((item) => item.answer)
      .reduce((pre, current) => parseInt(pre) + 4 * current.weight_factor, [0]);

    const permitValue = (sum / totalPoint) * 100 || 0;
    const questionNotAnswered = state.audit.questions.filter(
      (item) => !item.answer
    );

    if (permitValue >= state.audit.minimum_point)
      return Modal.success({
        title: "پرمیت صادر شد",
        ...modalConfig,
        onOk: () => handleSubmit(false),
        content: (
          <>
            <Typography.Title level={5}>
              {`برای این بازرسی ${Math.floor(
                permitValue
              )} درصد از نمره بازرسی را کسب کردید.`}
            </Typography.Title>
            {questionNotAnswered.length > 0 && (
              <>
                <Divider />
                <Typography.Text>به سوالات زیر پاسخ نداده اید</Typography.Text>
                <QuestionTable questions={questionNotAnswered} />
              </>
            )}
          </>
        ),
      });
    Modal.error({
      ...modalConfig,
      title: "پرمیت صادر نشد",
      onOk: () => handleSubmit(false),
      content: (
        <>
          <Typography.Title level={5}>
            {`${Math.floor(
              permitValue
            )}درصد نمره این بازرسی اخذ شد. حداقل درصد لازم ${
              state.audit.minimum_point
            } می باشد.`}
          </Typography.Title>
          {questionNotAnswered.length > 0 && (
            <>
              <Divider />
              <Typography.Text>به سوالات زیر پاسخ نداده اید</Typography.Text>
              <QuestionTable questions={questionNotAnswered} />
            </>
          )}
        </>
      ),
    });
  };

  const handleBack = () => {
    form.setFields([
      {
        name: "answer",
        value: state.audit.questions[state.questionIndex - 1].answer,
      },
    ]);
    setState((s) => ({ ...s, questionIndex: s.questionIndex - 1 }));
  };

  const handleReject = () => {
    replace(pageNames.hse.audit.index);
  };

  const handleSave = () => {
    handleSubmit(true);
  };

  const handleChangeAnswer = (target) => {
    const temp = target.slice(-1)[0];
    if (
      state.audit.questions[state.questionIndex].answer === temp &&
      target.length === 2
    )
      return handleSetAnswer(target[0]);
    if (state.audit.questions[state.questionIndex].answer === temp)
      return handleSetAnswer("");
    handleSetAnswer(temp);
  };

  const onChangeDescription = ({ target }) => {
    const temp = [...state.audit.questions];
    temp[state.questionIndex].operator_description = target.value;
    temp[state.questionIndex].operatorDescription = target.value;
    setState((s) => ({ ...s, audit: { ...s.audit, questions: temp } }));
  };

  const onChangeNotRelatedQuestion = () => {
    const temp = [...state.audit.questions];
    temp[state.questionIndex].isNotRelated = !temp[state.questionIndex]
      .is_not_related
      ? true
      : false;
    temp[state.questionIndex].is_not_related = !temp[state.questionIndex]
      .is_not_related
      ? true
      : false;
    temp[state.questionIndex].answer = "";
    setState((s) => ({ ...s, audit: { ...s.audit, questions: temp } }));
  };

  return (
    <>
      <ContentTop noBack title={`سوال کد ${code}`} className="mt-4" />

      <Typography.Title level={5}>
        {state.questionIndex + 1 + " - " + content}
      </Typography.Title>
      {state.audit.questions[state.questionIndex].description && (
        <Typography.Text type="secondary">
          {state.audit.questions[state.questionIndex].description}
        </Typography.Text>
      )}
      <div className="mt-2 mx-4 flex">
        <CriticalValue
          disabled={state.audit.questions[state.questionIndex].isNotRelated}
          onChange={handleChangeAnswer}
          componentType="checkbox"
          type={type}
          value={state.audit.questions[state.questionIndex].answer}
          isReverse={state.audit.questions[state.questionIndex].is_reverse}
        />
        <AppButton
          onClick={onChangeNotRelatedQuestion}
          variant={
            state.audit.questions[state.questionIndex].is_not_related ||
            state.audit.questions[state.questionIndex].isNotRelated
              ? "danger"
              : "default"
          }
        >
          سوال نامربوط
        </AppButton>
      </div>

      <div className="flex justify-between mt-3">
        <AppButton
          shape="circle"
          onClick={handleBack}
          disabled={state.questionIndex === 0}
          style={{ width: "50px", height: "50px" }}
          variant={state.questionIndex !== 0 ? "primary" : "default"}
        >
          <ArrowRightOutlined style={{ fontSize: "15px" }} />
        </AppButton>
        <AppButton
          onClick={handleNext}
          shape={
            state.audit.questions.length - 1 === state.questionIndex
              ? null
              : "circle"
          }
          className={`mx-2 ${
            state.audit.questions.length - 1 === state.questionIndex
              ? "px-2"
              : ""
          }`}
          disabled={state.questionIndex === state.audit.questions.length}
          style={{
            width:
              state.audit.questions.length - 1 === state.questionIndex
                ? "auto"
                : "50px",
            height:
              state.audit.questions.length - 1 === state.questionIndex
                ? "40px"
                : "50px",
          }}
          variant={
            state.questionIndex !== state.audit.questions.length
              ? "primary"
              : "default"
          }
        >
          {state.audit.questions.length - 1 === state.questionIndex ? (
            "اتمام بازرسی"
          ) : (
            <ArrowLeftOutlined style={{ fontSize: "15px" }} />
          )}
        </AppButton>
      </div>
      <Divider />
      <Row>
        <Col sm={24} md={12} xs={24}>
          <AppInput
            placeholder={`توضیحات سوال ${
              state.audit.questions[state.questionIndex].code
            }`}
            value={
              state.audit.questions[state.questionIndex].operator_description
            }
            onChange={onChangeDescription}
          />
        </Col>
      </Row>

      <div className="flex justify-end mt-3">
        <AppButton onClick={handleSave} className="mx-2 px-4">
          ذخیره
        </AppButton>
        <AppPopConfirm
          title="با انصراف از بازرسی، هیچ کدام از پاسخ سوالاتی که داده اید ذخیره نخواهد شد."
          placement="top"
          okText="انصراف از بازرسی"
          cancelText="بستن"
          onConfirm={handleReject}
        >
          <AppButton className="px-4">انصراف</AppButton>
        </AppPopConfirm>
      </div>
    </>
  );
};

const QuestionTable = ({ questions = [] }) => (
  <AppTable
    dataSource={questions}
    columns={[
      { title: "عنوان سوال", dataIndex: "question" },
      {
        title: "پاسخ",
        render: (data) =>
          criticalValues(!!data.is_reverse)[data.type].find(
            (item) => item.value === data.answer
          )?.label,
      },
      {
        title: "حالت بحرانی",
        render: (data) =>
          !data.critical || data.critical.length === 0
            ? ""
            : data.critical
                .split(",")
                .map((item) => (
                  <AppTag color="red">
                    {
                      criticalValues(!!data.is_reverse)[data.type].find(
                        (ttt) => ttt.value === item
                      ).label
                    }
                  </AppTag>
                )),
      },
    ]}
  />
);

export default Question;
