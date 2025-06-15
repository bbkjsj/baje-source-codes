import { Col, Form, Input, Radio, Checkbox, Select } from "antd";
import React from "react";
import { formColSpan } from "../../../../constant";
const requiredRule = [{ required: true }];

const getFields = (extForm) => {
  const ForwardReason = ({ onChange }) => {
    const options = [
      { label: "رد پیشنهاد", value: "rejection" },
      { label: "تعیین کارگروه تخصصی", value: "change_workgroup" },
    ];

    return (
      <Col {...formColSpan}>
        <Form.Item
          label="علت ارجاع"
          name="forward_reason"
          initialValue="rejection"
          rules={requiredRule}
        >
          <Radio.Group options={options} />
        </Form.Item>
      </Col>
    );
  };

  return [<ForwardReason />];
};

export default getFields;
