import {
  Col,
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  message,
  Row,
  Modal,
  Button,
  Switch,
  InputNumber,
  Space,
  Divider,
  List,
  Upload,
  Spin,
} from "antd";
import {} from "@ant-design/icons";
import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";

const localFormColSpan = { xs: 24, lg: 12, xl: 8 };

export const Title = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col {...localFormColSpan}>
      <Form.Item label="عنوان پیشنهاد" name={"title"} rules={rules}>
        <Input />
      </Form.Item>
    </Col>
  );
};
