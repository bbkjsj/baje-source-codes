import React from "react";
import { Col, Form, Input } from "antd";
import { formColSpan } from "../../../../constant";

//
const rules = (currentFieldLabel, relatedFieldLabel, relatedFieldName) => {
  return [
    { required: true, message: "وارد کردن این فیلد اجباریست" },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (value < 0) {
          return Promise.reject("فرمت عدد صحیح نمی باشد");
        } else if (
          value &&
          parseInt(value) === 0 &&
          getFieldValue(relatedFieldName) > 0
        ) {
          return Promise.reject(`
            باتوجه به ${relatedFieldLabel}، ${currentFieldLabel} نمی تواند صفر باشد`);
        } else if (
          value > 0 &&
          parseInt(getFieldValue(relatedFieldName)) === 0
        ) {
          return Promise.reject(
            `باتوجه به ${relatedFieldLabel}، ${currentFieldLabel} نمی تواند  بیش از صفر باشد`
          );
        }

        return Promise.resolve();
      },
    }),
  ];
};

export const StoneTonnage = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        name="stone_tonnage"
        label="تناژ سنگ"
        rules={rules("تناژ سنگ", "تعداد حمل بار سنگ", "stone_load_quantity")}
      >
        <Input type="number" />
      </Form.Item>
    </Col>
  );
};

//
export const DustTonnage = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        name="dust_tonnage"
        label="تناژ خاک و باطله"
        rules={rules(
          "تناژ خاک و باطله",
          "تعداد حمل بار خاک و باطله",
          "dust_load_quantity"
        )}
      >
        <Input type="number" />
      </Form.Item>
    </Col>
  );
};

//
export const StoneLoadQuantity = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        name="stone_load_quantity"
        label="تعداد حمل بار سنگ"
        rules={rules("تعداد حمل بار سنگ", "تناژ سنگ", "stone_tonnage")}
      >
        <Input type="number" />
      </Form.Item>
    </Col>
  );
};

//
export const DustLoadQuantity = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        name="dust_load_quantity"
        label="تعداد حمل بار خاک و باطله"
        rules={rules(
          "تعداد حمل بار خاک و باطله",
          "تناژ خاک و باطله",
          "dust_tonnage"
        )}
      >
        <Input type="number" />
      </Form.Item>
    </Col>
  );
};

//
export const Description = () => {
  return (
    <Col {...formColSpan} xl={12}>
      <Form.Item name="description" label="توضیحات">
        <Input.TextArea />
      </Form.Item>
    </Col>
  );
};
