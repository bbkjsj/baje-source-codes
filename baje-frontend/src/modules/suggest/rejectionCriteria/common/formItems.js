import {
  Col,
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  message,
  Row,
  Button,
} from "antd";
import React, { useEffect, useState } from "react";
import { checkShamsi, countOfNumInp, numberNormalize } from "_helpers";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { utils } from "react-modern-calendar-datepicker";
import { NationalIdInput } from "modules/personnel/realPerson/service/formItems";
import { itemStatus } from "../const";

const Committee = ({ onChange, items, disabled = false }) => {
  const rules = [
    {
      required: true,
    },
  ];

  let options = [];

  if (items)
    options = items.map((item) => {
      return { label: item.name, value: item.id };
    });

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="کارگروه" name="workgroup_id" rules={rules}>
        <Select options={options} onChange={onChange} disabled={disabled} />
      </Form.Item>
    </Col>
  );
};

const Name = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="نام ملاک" name={"name"} rules={rules}>
        <Input />
      </Form.Item>
    </Col>
  );
};

const MinimumVote = ({ onChange, items, onClick }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const [number, setNumber] = useState(0);
  const getLength = async () => {
    const len = await onClick();
    setNumber(len);
  };
  const options = [...Array(number + 1).keys()]
    .slice(1)
    .map((val) => ({ label: val, value: val }));

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="حداقل رای جهت رد" name="min_point" rules={rules}>
        <Select
          options={options}
          onChange={onChange}
          onClick={getLength}
        ></Select>
      </Form.Item>
    </Col>
  );
};

const Status = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="وضعیت" name={"is_enable"} rules={rules}>
        <Radio.Group>
          <Radio value={itemStatus.ACTIVE}>فعال</Radio>
          <Radio value={itemStatus.DISABLE}>غیرفعال</Radio>
        </Radio.Group>
      </Form.Item>
    </Col>
  );
};

const Description = () => {
  const rules = [];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="توضیحات" name={"description"} rules={rules}>
        <Input.TextArea />
      </Form.Item>
    </Col>
  );
};

export { Committee, Name, MinimumVote, Status, Description };
