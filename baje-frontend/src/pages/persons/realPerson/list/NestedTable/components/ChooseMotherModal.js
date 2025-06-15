import { Col, Form } from "antd";
import AppFormItem from "components/general/AppFormItem";
import AppSelect from "components/general/AppSelect";
import SubmitBtn from "components/general/SubmitBtn";
import { ADD_SUBORDINATE } from "pages/persons/realPerson/utils/api";
import React from "react";
import { useState } from "react";
import { showMessage } from "utils/message";

const ChooseMotherModal = ({
  onFinish,
  payload,
  familyData,
  setEditingKey,
  getMainPerson,
}) => {
  const { body, spouses, validateNamesAndSubmit, mainRecord } = payload;
  const sex = mainRecord?.sex;

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const spouseOptions = spouses.map((i) => {
    return { label: i.firstName + " " + i.lastName, value: i.nationalCode };
  });

  function handleOnFinish(values) {
    if (values?.parentNationalId && values?.parentNationalId !== "none") {
      const body2 = {
        [sex === "f"
          ? "fatherNationalId"
          : "motherNationalId"]: values.parentNationalId,
        personnelNationalId: familyData.national_number,
        relation: sex === "f" ? "father" : "mother",
        syncMother: true,
      };

      setLoading(true);
      ADD_SUBORDINATE(body2)
        .then((res) => {
          showMessage(
            `${sex === "f" ? "پدر" : "مادر"} برای فرزند اضافه شد`,
            "success"
          );
          validateNamesAndSubmit(body, false);
          onFinish();
          setEditingKey("");
          getMainPerson();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      validateNamesAndSubmit(body, false);
      onFinish();
    }
  }

  return (
    <div>
      <Form form={form} name="chooseMother" onFinish={handleOnFinish}>
        <Col md={8} sm={24} xs={24}>
          <AppFormItem
            label={sex === "f" ? "پدر" : "مادر"}
            name="parentNationalId"
          >
            <AppSelect
              options={[{ label: "هیچ‌کدام", value: "none" }, ...spouseOptions]}
              defaultValue="none"
            />
          </AppFormItem>
        </Col>

        <SubmitBtn loading={loading} />
      </Form>
    </div>
  );
};

export default ChooseMotherModal;
