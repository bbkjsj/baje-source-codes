import { Col, Divider, Form, Row } from "antd";
import AppButton from "components/general/AppButton";
import AppFormItem from "components/general/AppFormItem";
import AppInput from "components/general/AppInput";
import AppModal from "components/general/AppModal";
import AppSelect from "components/general/AppSelect";
import AppTextArea from "components/general/AppTextArea";
import { getQuestions } from "modules/hse/api/question";
import CriticalValue from "modules/hse/components/Critical";
import { weightFactor } from "modules/hse/constant";
import React, { useEffect, useState } from "react";

const QuestionPicker = ({
  visible,
  onCancel,
  handleAddQuestion,
  groupName,
  selectedQuestions = [],
}) => {
  const [form] = Form.useForm();
  const [state, setState] = useState({ questions: [], selectedQuestion: {} });

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const { data: questions } = await getQuestions();
      setState((s) => ({ ...s, questions }));
    } catch (error) {
      console.log(error.message);
    }
  };

  const onFinish = (params) => {
    const { question } = params;
    form.resetFields();
    handleAddQuestion({
      ...params,
      is_reverse: !!JSON.parse(question).is_reverse,
      isReverse: !!JSON.parse(question).is_reverse,
      question: JSON.parse(question),
    });
  };

  const handlChangeQuestion = (question) => {
    setState((s) => ({ ...s, selectedQuestion: JSON.parse(question) }));
  };

  return (
    <AppModal visible={visible} footer={null} onCancel={onCancel}>
      <Form form={form} onFinish={onFinish}>
        <AppFormItem label="سوال" required name="question">
          <AppSelect
            showSearch
            filterOption={(input, option) => {
              if (!parseInt(input[0])) return option.label.includes(input);
              return JSON.parse(option.value).code.startsWith(input);
            }}
            placeholder="متن، یا کد اختصاصی سوال"
            onChange={handlChangeQuestion}
            options={state.questions
              .filter((item) => item.group === groupName)
              .filter(
                (item) => !selectedQuestions.find((se) => se.id === item.id)
              )
              .map((item) => ({
                value: JSON.stringify(item),
                label: item.question,
              }))}
          />
        </AppFormItem>
        <Row gutter={10}>
          <Col sm={12} xs={24}>
            <AppFormItem
              label="ضریب وزنی"
              initialValue={1}
              required
              name="weight_factor"
            >
              <AppSelect options={weightFactor} />
            </AppFormItem>
          </Col>
          <Col sm={12} xs={24}>
            <AppFormItem label="بند الزامات" name="requirements">
              <AppInput />
            </AppFormItem>
          </Col>
        </Row>

        <AppFormItem label="توضیحات" name="description">
          <AppTextArea />
        </AppFormItem>

        <Divider />
        <AppFormItem name="critical" label="حالت بحرانی">
          <CriticalValue
            mode="multiple"
            type={state.selectedQuestion.type}
            isReverse={state.selectedQuestion.is_reverse}
          />
        </AppFormItem>

        {/* <AppFormItem
          label="حالت بحرانی"
          required
          rules={[
            { required: true, message: ruleMessages.required("ضریب وزنی") },
          ]}
          name="critical">
          <AppNumInput />
        </AppFormItem> */}
        <AppButton htmlType="submit">ثبت</AppButton>
      </Form>
    </AppModal>
  );
};

export default QuestionPicker;
