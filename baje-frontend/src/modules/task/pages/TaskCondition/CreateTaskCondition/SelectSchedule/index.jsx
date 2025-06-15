import { Col, Row, Form } from "antd";
import AppButton from "components/general/AppButton";
import AppRadioGroup from "components/general/AppRadioGroup";
import ContentTop from "components/general/ContentTop";
import { constant, scheduleTypes } from "modules/task/constant";
import React from "react";
import {
  useCreateTaskConditionContext,
  createTaskConditionActions,
} from "../context";
import DailySchedule from "./DailySchedule";
import MonthlySchedule from "./MonthlySchedule";
import WeeklySchedule from "./WeeklySchedule";
import YearlySchedule from "./YearlySchedule";
import DatePicker from "react-datepicker2";
import moment from "moment";

const CreateTaskConditionStep3 = () => {
  const { state, dispatch } = useCreateTaskConditionContext();
  const [form] = Form.useForm();

  const handleChangeStep = (payload) => {
    dispatch({ type: createTaskConditionActions.handleThirdStep, payload });
  };

  const handleChangeScheduleType = ({ target: { value: payload } }) => {
    dispatch({ type: createTaskConditionActions.changeScheduleType, payload });
  };

  const handleBack = () => {
    dispatch({
      type: createTaskConditionActions.handleFirstStep,
    });
  };

  const handleChangeFromTo = (payload) => {
    return console.log(payload);
    dispatch({ type: createTaskConditionActions.changeFromToDate, payload });
  };

  const handleChangeFromDate = (payload) => {
    dispatch({ type: createTaskConditionActions.changeFromDate, payload });
  };

  const handleChangeToDate = (payload) => {
    dispatch({ type: createTaskConditionActions.changeToDate, payload });
  };

  const handleChangeCalendarMode = ({ target }) => {
    dispatch({
      type: createTaskConditionActions.changeCalendarMode,
      payload: target.value,
    });
  };

  const today = moment().clone().subtract(1, "day");
  const fromDate = state.fromDate.clone().subtract(1, "day");

  return (
    <>
      <ContentTop title="تنظیمات الگوی شرط" noBack />

      <>
        <AppRadioGroup
          options={scheduleTypes}
          value={state.scheduleType}
          onChange={handleChangeScheduleType}
        />

        <Form form={form}>
          <Row className="mt-3" gutter={16} align="middle">
            <Col md={6} sm={24} xs={24}>
              <p>از تاریخ</p>
              <DatePicker
                value={state.fromDate}
                className="w-100 mt-4"
                inputFormat={"YYYY/MM/DD"}
                inputJalaaliFormat={"jYYYY/jMM/jDD"}
                onChange={handleChangeFromDate}
                isGregorian={state.calendarMode === constant.gregorian}
                min={today}
                timePicker={false}
                //max={state.toDate}
              />

              {/* <Calendar
              value={{ from: state.fromDate, to: state.toDate }}
              locale="fa"
              onChange={handleChangeFromTo}
            /> */}
            </Col>
            <Col md={6} sm={24} xs={24}>
              {state.scheduleType !== constant.monthly && (
                <>
                  <p>تا تاریخ</p>

                  <DatePicker
                    value={state.toDate}
                    className="w-100 mt-4"
                    onChange={handleChangeToDate}
                    isGregorian={state.calendarMode === constant.gregorian}
                    inputFormat={"YYYY/MM/DD"}
                    inputJalaaliFormat={"jYYYY/jMM/jDD"}
                    min={fromDate}
                    timePicker={false}
                  />
                </>
              )}
            </Col>
            <Col md={6} sm={24} xs={24}>
              <p>نوع تقویم</p>
              <div className="flex align-center mt-4">
                <AppRadioGroup
                  value={state.calendarMode}
                  options={[
                    { label: "شمسی", value: constant.solar },
                    { label: "میلادی", value: constant.gregorian },
                    //{ label: "قمری", value: constant.lunar, disabled: true },
                  ]}
                  onChange={handleChangeCalendarMode}
                />
              </div>
            </Col>
          </Row>
        </Form>
        {state.scheduleType === constant.daily && <DailySchedule />}
        {state.scheduleType === constant.weekly && <WeeklySchedule />}
        {state.scheduleType === constant.monthly && <MonthlySchedule />}
        {state.scheduleType === constant.yearly && <YearlySchedule />}
      </>
      <Row justify="end" className="mt-4">
        <AppButton onClick={handleBack} variant="danger">
          مرحله قبل
        </AppButton>
        <AppButton onClick={handleChangeStep} className="mx-2">
          مرحله بعد
        </AppButton>
      </Row>
    </>
  );
};

export default CreateTaskConditionStep3;
