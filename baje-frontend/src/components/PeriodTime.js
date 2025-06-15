import React, { useRef, useEffect, useState } from "react";
import { Form, Input, Col, Row, Select } from "antd";
import { countOfNumInp } from "_helpers";
import { formColSpan } from "../constant";

const PeriodTime = ({
  label,
  year,
  month,
  day,
  onChange = false,
  required = false,
  useForm = false,
  plain = false,
}) => {
  const rulesPeriodTime = [
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (required) {
          if (
            !parseInt(getFieldValue(day)) &&
            !parseInt(getFieldValue(month)) &&
            !parseInt(getFieldValue(year))
          ) {
            return Promise.reject("تعیین مدت ضروری است");
          }
        }

        return Promise.resolve();
      },
    }),
  ];

  const output = (
    <Form.Item label={label} style={{ marginBottom: "0" }}>
      <Row style={{ flexDirection: "row-reverse" }} gutter={4}>
        <Col span={8}>
          <Form.Item
            // noStyle
            name={year}
            extra="سال"
            normalize={(v, prevV) => countOfNumInp(v, prevV, 2)}
            rules={rulesPeriodTime}
          >
            <Input type="text" placeholder="سال" onChange={onChange} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            // noStyle
            name={month}
            extra="ماه"
            normalize={(v, prevV) => countOfNumInp(v, prevV, 2)}
            rules={rulesPeriodTime}
          >
            <Input type="text" placeholder="ماه" onChange={onChange} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            // noStyle
            name={day}
            extra="روز"
            normalize={(v, prevV) => countOfNumInp(v, prevV, 2)}
            rules={rulesPeriodTime}
          >
            <Input type="text" placeholder="روز" onChange={onChange} />
          </Form.Item>
        </Col>
      </Row>
    </Form.Item>
  );

  return plain ? output : <Col {...formColSpan}>{output}</Col>;
};

export default PeriodTime;
