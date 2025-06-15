import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Row } from "antd";
import * as FormItems from "./FormItems";
import { checkBirthDateWithContractDate } from "../util";

function AddSubordinateForm({
  subForm,
  insurance,
  list,
  initialSub,
  onFinish,
  mainPerson,
}) {
  const [keepOpen, setKeepOpen] = useState(false);

  const onSelectChange = (val) => {
    if (val) {
      const person = list.find((el) => el.id === val);

      subForm.setFieldsValue({
        personnel_id: person.id,
        relation: person.relation,
        start_date: checkBirthDateWithContractDate(
          person.birth_date,
          insurance.contract_date_from_date
        ),
      });
    }
  };

  useEffect(() => {
    subForm.resetFields();
    if (initialSub) {
      subForm.setFieldsValue(initialSub);
    }
  }, [initialSub]);

  return (
    <>
      <Form form={subForm} onFinish={(data) => onFinish(data, keepOpen)}>
        <FormItems.subordinateSelect list={list} onChange={onSelectChange} />
        <FormItems.relation form={subForm} disabled={true} />
        <FormItems.StartDateInsurance
          useForm={subForm}
          span={24}
          insurance={insurance}
          mainPerson={mainPerson}
        />
        <FormItems.EndDateInsurance
          useForm={subForm}
          span={24}
          insurance={insurance}
        />
        <FormItems.Description useForm={subForm} span={24} />
        <Form.Item name="personnel_id" hidden={true}>
          <Input></Input>
        </Form.Item>
        <FormItems.submitSubordinate
          onClick={(wait) => {
            setKeepOpen(wait);
            subForm.submit();
          }}
        />
      </Form>
    </>
  );
}

export default AddSubordinateForm;
