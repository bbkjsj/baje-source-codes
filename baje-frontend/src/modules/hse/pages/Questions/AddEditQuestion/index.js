import { Col, Form, Row } from "antd";
import AppButton from "components/general/AppButton";
import AppFormItem from "components/general/AppFormItem";
import AppRadioGroup from "components/general/AppRadioGroup";
import AppSelect from "components/general/AppSelect";
import AppTextArea from "components/general/AppTextArea";
import ContentTop from "components/general/ContentTop";
import GoBackBtn from "components/GoBackBtn";
import { pageNames } from "constant";
import { createQuestion, updateQuestion } from "modules/hse/api/question";
import { constant, questionGroups, questionTypes } from "modules/hse/constant";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router";
import { showMessage } from "utils/message";

const AddEditQuestion = () => {
  const { goBack } = useHistory();
  const { state: question } = useLocation();
  const [form] = Form.useForm();

  const [state, setState] = useState({ loading: false, questionType: null });

  const handleAddQuestion = async (params) => {
    if (question) return handleEditQuestion(params);
    setState((s) => ({ ...s, loading: true }));
    try {
      await createQuestion({
        ...params,
        isReverse:
          state.questionType === constant.rate ||
          state.questionType === constant.criticalToPerfect ||
          state.questionType === constant.wellOrFault
            ? false
            : params.isReverse,
      });
      showMessage("با موفقیت ساخته شد", "success");
      goBack();
    } catch (error) {
      console.log(error.message);
      setState((s) => ({ ...s, loading: false }));
    }
  };

  const handleEditQuestion = async (params) => {
    try {
      setState((s) => ({ ...s, loading: true }));
      await updateQuestion({ ...question, ...params });
      showMessage("با موفقیت ویرایش شد", "success");
      goBack();
    } catch (error) {
      console.log(error.message);
      setState((s) => ({ ...s, loading: false }));
    }
  };

  const onChangeQuestionType = (questionType) => {
    if (
      questionType === constant.rate ||
      questionType === constant.criticalToPerfect ||
      questionType === constant.wellOrFault
    )
      form.setFields([{ name: "isReverse", value: false }]);
    setState((s) => ({ ...s, questionType }));
  };

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="افزودن سوال جدید"
        breadcrumbItems={[
          {
            text: "لیست سوالات",
            link: pageNames.hse.questions.index,
          },
          {
            text: "سوال جدید",
          },
        ]}
      />

      <Form
        form={form}
        initialValues={{
          ...question,
          isReverse: !!question?.is_reverse || false,
        }}
        onFinish={handleAddQuestion}
        layout="vertical"
      >
        <Row gutter={10}>
          <Col md={24} sm={24}>
            <AppFormItem required label="عنوان سوال" name="question">
              <AppTextArea />
            </AppFormItem>
          </Col>
          <Col md={6} sm={24}>
            <AppFormItem required label="گروه ممیزی" name="group">
              <AppRadioGroup
                disabled={!!question}
                options={questionGroups.map((item) => ({
                  label: item.text,
                  value: item.value,
                }))}
              />
            </AppFormItem>
          </Col>
          <Col md={6} sm={24}>
            <AppFormItem required label="شیوه ممیزی" name="type">
              <AppSelect
                disabled={!!question}
                onChange={onChangeQuestionType}
                options={questionTypes.map((item) => ({
                  ...item,
                  disabled: item.value === constant.measurement,
                }))}
              />
            </AppFormItem>
          </Col>
          <Col md={6} sm={24}>
            <AppFormItem
              required
              tooltip="اگر شیوه نمره دهی را برعکس انتخاب کنید، بالاترین مقدار که رقم 4 میباشد، برای پایین ترین مقدار جواب در نظر گرفته خواهد شد."
              label="شیوه نمره دهی"
              name="isReverse"
            >
              <AppRadioGroup
                // value={"1"}
                disabled={
                  !!question ||
                  !state.questionType ||
                  state.questionType === constant.rate ||
                  state.questionType === constant.criticalToPerfect ||
                  state.questionType === constant.wellOrFault
                }
                options={[
                  { label: "برعکس", value: true },
                  { label: "عادی", value: false },
                ]}
              />
            </AppFormItem>
          </Col>
        </Row>
        <AppButton loading={state.loading} htmlType="submit" type="primary">
          ثبت
        </AppButton>
      </Form>
    </>
  );
};

export default AddEditQuestion;
