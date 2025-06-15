import React, { useEffect, useContext } from "react";
import { Col, Form, Select, Checkbox, Row } from "antd";
import { PersonIntroductionLetterTypeValue } from "../const";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

const InsuranceCompany = () => {
  const rules = [{ required: true }];
  const user = useWhoAmI();
  const listLegal = user?.companies;
  //
  return (
    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
      <Form.Item label="شرکت بیمه" name="company_id" rules={rules}>
        <Select>
          {listLegal.map((el) => (
            <Select.Option key={el.id} value={el.id} title={el.name}>
              {el.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
  );
};

const IntroduceType = () => {
  const rules = [{ required: true }];

  const options = [
    {
      label: "افزودن",
      value: PersonIntroductionLetterTypeValue.ADD,
    },

    {
      label: "حذف",
      value: PersonIntroductionLetterTypeValue.DELETE,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
      <Form.Item label="نوع معرفی نامه" name="type" rules={rules}>
        <Select options={options} />
      </Form.Item>
    </Col>
  );
};

const Subordinates = ({ options }) => {
  const rules = [{ required: true }];
  return (
    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
      <Form.Item label="افراد تبعی" name="subordinates" rules={rules}>
        <Checkbox.Group>
          <Row gutter={[5, 5]}>
            {options.map((el, i) => (
              <Col key={i} xs={24} sm={24} md={24} lg={24} xl={24}>
                <Checkbox value={el.value}>{el.label}</Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Form.Item>
    </Col>
  );
};

export { InsuranceCompany, IntroduceType, Subordinates };
