import {
  Col,
  Form,
  Input,
  Select,
  Checkbox,
  TimePicker,
  message,
  Row,
  Button,
  Switch,
} from "antd";
import React, { useEffect, useState } from "react";
import { countOfNumInp, decimalNumberValidation } from "_helpers";
import { holidaysCountRanges, shiftPatternItemTypes } from "../const";
import { formRowGutter } from "constant";
import AppSwitch from "components/general/AppSwitch";

const format = "HH:mm";
const rules = [{ required: true }];

const ShiftName = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="نام شیفت کاری" name="title" rules={rules}>
        <Input />
      </Form.Item>
    </Col>
  );
};

const Status = ({ disabled = false }) => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="وضعیت شیفت" name="enabled" valuePropName="checked">
        <AppSwitch
          checkedChildren="فعال"
          unCheckedChildren="غیرفعال"
          disabled={disabled}
        />
      </Form.Item>
    </Col>
  );
};

const AddDynamicForm = ({ add }) => {
  return (
    <Col xs={6} sm={6} md={6} lg={3} xl={3}>
      <Form.Item>
        <Button type="dashed" onClick={() => add()}>
          اضافه کردن ردیف
        </Button>
      </Form.Item>
    </Col>
  );
};

const RemoveShiftSeen = ({ filedName, remove }) => (
  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
    <Form.Item>
      <Button
        type="danger"
        className="dynamic-delete-button"
        onClick={() => remove(filedName)}
      >
        حذف ردیف
      </Button>
    </Form.Item>
  </Col>
);

const ShiftPattern = ({ useForm, detail }) => {
  return (
    <Form.List name="patterns">
      {(fields, { add, remove }) => {
        return (
          <>
            {fields.map((field, index) => (
              <Row gutter={formRowGutter} key={field.fieldKey}>
                <PatternStatus field={field} />
                <DayNumber field={field} index={index} />
                <StartTime field={field} index={index} disabled={false} />
                <FinishTime
                  field={field}
                  index={index}
                  useForm={useForm}
                  disabled={detail}
                />
                {!detail && fields.length > 1 ? (
                  <RemoveShiftSeen filedName={field.name} remove={remove} />
                ) : null}
              </Row>
            ))}
            {!detail && <AddDynamicForm add={add} />}
          </>
        );
      }}
    </Form.List>
  );
};

const PatternStatus = ({ index, field, onChange, disabled = false }) => {
  const options = [
    { label: "کار", value: shiftPatternItemTypes.work },
    { label: "استراحت", value: shiftPatternItemTypes.rest },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item
        initialValue={options[0].value}
        {...field}
        label="وضعیت"
        fieldKey={[field.fieldKey, "status"]}
        name={[field.name, "status"]}
        rules={rules}
      >
        <Select options={options} onChange={onChange} disabled={disabled} />
      </Form.Item>
    </Col>
  );
};

const DayNumber = ({ index, field }) => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item
        label="تعداد روز"
        {...field}
        fieldKey={[field.fieldKey, "days"]}
        name={[field.name, "days"]}
        normalize={(value, prevValue) => countOfNumInp(value, prevValue, 11)}
        rules={rules}
      >
        <Input />
      </Form.Item>
    </Col>
  );
};

const StartTime = ({ index, field, disabled = false }) => {
  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        return form.getFieldValue(["patterns", index, "status"]) ===
          shiftPatternItemTypes.work ? (
          <Col xs={24} sm={24} md={24} lg={12} xl={6}>
            <Form.Item
              {...field}
              label="ساعت شروع"
              fieldKey={[field.fieldKey, "from"]}
              name={[field.name, "from"]}
              rules={rules}
            >
              <TimePicker format={format} disabled={disabled} />
            </Form.Item>
          </Col>
        ) : null;
      }}
    </Form.Item>
  );
};

const FinishTime = ({ index, field, form, disabled = false }) => {
  const checkFinishTime = (index) => ({ getFieldValue }) => ({
    validator(rule, value) {
      const startTime = getFieldValue(["patterns", index, "from"]);
      const endTime = value;

      // if (!startTime) return Promise.reject("زمان شروع انتخاب نشده است");

      if (startTime >= endTime) {
        return Promise.reject("زمان پایان باید بزرگتر از زمان شروع باشد");
      }

      return Promise.resolve();
    },
  });

  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        return form.getFieldValue(["patterns", index, "status"]) ===
          shiftPatternItemTypes.work ? (
          <Col xs={24} sm={24} md={24} lg={12} xl={6}>
            <Form.Item
              {...field}
              label="ساعت پایان"
              fieldKey={[field.fieldKey, "to"]}
              name={[field.name, "to"]}
              rules={[
                {
                  required: true,
                  message: "فیلد زمان پایان اجباریست",
                },
                checkFinishTime(index),
              ]}
            >
              <TimePicker format={format} disabled={(disabled = false)} />
            </Form.Item>
          </Col>
        ) : null;
      }}
    </Form.Item>
  );
};

const LeaveDayNumber = () => {
  return (
    <Col xs={16} sm={16} md={16} lg={12} xl={6}>
      <Form.Item
        label="تعداد روزهای مرخصی"
        name={"numberOfTimeOffDays"}
        normalize={(value) => decimalNumberValidation(value)}
        rules={rules}
      >
        <Input />
      </Form.Item>
    </Col>
  );
};

const PeriodDay = ({ onChange, disabled = false }) => {
  const options = [
    { label: "در هفته", value: holidaysCountRanges.week },
    { label: "در ماه", value: holidaysCountRanges.month },
    { label: "در سال", value: holidaysCountRanges.year },
  ];

  return (
    <Col xs={16} sm={16} md={16} lg={12} xl={6}>
      <Form.Item
        initialValue={options[0].value}
        label="بازه زمانی"
        name="timespan"
        rules={rules}
      >
        <Select options={options} onChange={onChange} disabled={disabled} />
      </Form.Item>
    </Col>
  );
};

const WithVacation = () => {
  return (
    <Col xs={16} sm={16} md={16} lg={12} xl={6}>
      <label>
        <Form.Item
          name="calculatePublicHolidays"
          valuePropName="checked"
          noStyle={true}
          initialValue={false}
        >
          <Checkbox />
        </Form.Item>
        <span className="mr-2">با احتساب روزهای تعطیل رسمی</span>
      </label>
    </Col>
  );
};

const NoWorkOnHolidays = () => {
  return (
    <Col xs={16} sm={16} md={16} lg={12} xl={6}>
      <label>
        <Form.Item
          name="publicHolidaysAreOff"
          valuePropName="checked"
          noStyle={true}
          initialValue={false}
        >
          <Checkbox />
        </Form.Item>
        <span className="mr-2">تعطیلات رسمی، تعطیل می باشد</span>
      </label>
    </Col>
  );
};

const CalculateOvertimeWork = () => {
  return (
    <Col xs={16} sm={16} md={16} lg={12} xl={6}>
      <label>
        <Form.Item
          name="calculateExtraWork"
          valuePropName="checked"
          noStyle={true}
          initialValue={false}
        >
          <Checkbox />
        </Form.Item>
        <span className="mr-2">محاسبه اضافه کار</span>
      </label>
    </Col>
  );
};

const CalculateWorkOnFridays = () => {
  return (
    <Col xs={16} sm={16} md={16} lg={12} xl={6}>
      <label>
        <Form.Item
          name="calculateFriday"
          valuePropName="checked"
          noStyle={true}
          initialValue={false}
        >
          <Checkbox />
        </Form.Item>
        <span className="mr-2">محاسبه جمعه کاری</span>
      </label>
    </Col>
  );
};

const CalculateWorkOnHolidays = () => {
  return (
    <Col xs={16} sm={16} md={16} lg={12} xl={6}>
      <label>
        <Form.Item
          name="calculateOffWork"
          valuePropName="checked"
          noStyle={true}
          initialValue={false}
        >
          <Checkbox />
        </Form.Item>
        <span className="mr-2">محاسبه تعطیل کاری</span>
      </label>
    </Col>
  );
};

const CalculateWorkInNight = () => {
  return (
    <Col xs={16} sm={16} md={16} lg={12} xl={6}>
      <label>
        <Form.Item
          name="calculateNight"
          valuePropName="checked"
          noStyle={true}
          initialValue={false}
        >
          <Checkbox />
        </Form.Item>
        <span className="mr-2">محاسبه شب کاری</span>
      </label>
    </Col>
  );
};

export {
  ShiftName,
  Status,
  ShiftPattern,
  LeaveDayNumber,
  PeriodDay,
  WithVacation,
  NoWorkOnHolidays,
  CalculateOvertimeWork,
  CalculateWorkOnHolidays,
  CalculateWorkOnFridays,
  CalculateWorkInNight,
};
