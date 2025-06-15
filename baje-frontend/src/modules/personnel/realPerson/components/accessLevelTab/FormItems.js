import React from "react";
import { Col, Form, Select, Button } from "antd";
import RenderSections from "components/renderInput/accessRolesSection/RenderSections";
import FormItem from "components/renderInput/formItem/FormItem";
import { formColSpan } from "../../../../../constant";

const { Option } = Select;

const SelectOffice = ({ option, onChange }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="انتخاب شرکت" name="selectOffice/accessLevelTab">
        <Select onChange={onChange}>
          {option.map((el) => (
            <Option key={el.id} value={el.id} title={el.name}>
              {el.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
  );
};

const SelectContract = ({ option, onChange }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="انتخاب قرارداد" name="selectContract/accessLevelTab">
        <Select onChange={onChange}>
          {option.map((el) => (
            <Option
              key={el.contract_id}
              value={el.contract_id}
              title={el.subject}
            >
              {el.subject}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
  );
};

const SelectPermission = ({ permissions, useForm, onConfirm }) => {
  return (
    <>
      <RenderSections permissions={permissions} form={useForm} />
      <FormItem>
        <Button type="primary" onClick={onConfirm}>
          تایید
        </Button>
      </FormItem>
    </>
  );
};

export { SelectOffice, SelectContract, SelectPermission };
