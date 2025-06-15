import { Col, Row } from "antd";
import AppButton from "components/general/AppButton";
import AppFormItem from "components/general/AppFormItem";
import AppInput from "components/general/AppInput";
import AppNumInput from "components/general/AppNumInput";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { ruleMessages } from "constant";
import { Form } from "antd";
import React, { useContext } from "react";
import { AllocateContext } from "../context";
import { allocateToPerson, allocateToVehicle } from "modules/hse/api/allocate";
import { showMessage } from "utils/message";
import { constant } from "modules/hse/constant";
import moment from "moment-jalaali";
import { useHistory } from "react-router";
import CriticalValue from "modules/hse/components/Critical";

const AllocateStep3 = () => {
  const [form] = Form.useForm();
  const { state } = useContext(AllocateContext);
  const { goBack } = useHistory();

  const handleFinish = async (params) => {
    const { fromDate, toDate } = params;
    const tempStart = moment(fromDate, "jYYYY/jM/jD");
    const tempEnd = moment(toDate, "jYYYY/jM/jD");

    if (tempStart.isAfter(tempEnd))
      return showMessage(
        "تاریخ شروع را بعد از تاریخ پایان وارد کرده اید",
        "warning"
      );
    params.fromDate = tempStart.format("YYYY/M/D");
    params.toDate = tempEnd.format("YYYY/M/D");

    const handleAllocateToPerson = async () => {
      try {
        await allocateToPerson({
          ...params,
          questionIds: state.selectedQuestions.map((item) => item.id),
          personnelId: state.personnelId,
          critical: params.critical.join(","),
        });
        showMessage("سوالات به موجودیت در نظر گرفته، الصاق شد.", "success");
        goBack();
      } catch (error) {
        console.log(error.message);
      }
    };

    const handleAllocateToVehicle = async () => {
      try {
        await allocateToVehicle({
          questionIds: state.selectedQuestions.map((item) => item.id),
          vehicleId: state.vehicleId,
          critical: state.selectedQuestions[0]?.type,
          ...params,
        });
        showMessage("سوالات به موجودیت در نظر گرفته، الصاق شد.", "success");
        goBack();
      } catch (error) {
        console.log(error.message);
      }
    };

    if (state.group === constant.inidividual) handleAllocateToPerson();
    if (state.group === constant.vehicle) handleAllocateToVehicle();
  };

  return (
    <Form form={form} onFinish={handleFinish}>
      <Row gutter={10}>
        <CustomDatePicker
          rules={[
            { required: true, message: ruleMessages.required("از تاریخ") },
          ]}
          name="fromDate"
          form={form}
          label="از تاریخ"
        />
        <CustomDatePicker
          rules={[
            { required: true, message: ruleMessages.required("تا تاریخ") },
          ]}
          name="toDate"
          form={form}
          label="تا تاریخ"
        />
      </Row>
      <Row gutter={10}>
        <Col md={8} sm={24}>
          <AppFormItem required name="requirements" label="بند الزامات">
            <AppInput />
          </AppFormItem>
        </Col>
        <Col md={8} sm={24}>
          <AppFormItem
            required
            name="weightFactor"
            label="ضریب وزنی سوال"
            tooltip="انتخاب این موضوع در تاثیر نمره سوال در برایند، تاثیرگذار است."
          >
            <AppNumInput min={0} max={3} />
          </AppFormItem>
        </Col>
        <Col md={8} sm={24}>
          <AppFormItem required name="critical" label="حالت بحرانی">
            <CriticalValue
              mode="multiple"
              componentType="select"
              type={state.selectedQuestions[0].type}
            />
          </AppFormItem>
        </Col>
        <Col md={8} sm={24}>
          <AppFormItem name="description" label="توضیحات">
            <AppInput min={0} max={3} />
          </AppFormItem>
        </Col>
      </Row>

      <AppButton htmlType="submit">ثبت</AppButton>
    </Form>
  );
};

export default AllocateStep3;
