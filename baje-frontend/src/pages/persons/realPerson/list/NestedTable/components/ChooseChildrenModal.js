import { Col, Form } from "antd";
import AppFormItem from "components/general/AppFormItem";
import AppSelect from "components/general/AppSelect";
import SubmitBtn from "components/general/SubmitBtn";
import { ADD_SUBORDINATE } from "pages/persons/realPerson/utils/api";
import React from "react";
import { useState } from "react";
import { showMessage } from "utils/message";

const ChooseChildrenModal = ({ onFinish, payload, familyData }) => {
  const { body, children, validateNamesAndSubmit } = payload;
  const sex = familyData?.sex;

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const childOptions = children.map((i) => {
    return { label: i.firstName + " " + i.lastName, value: i.nationalCode };
  });

  function handleOnFinish(values) {
    if (values?.childrenNIds?.length) {
      console.log("NIDS:", values?.childrenNIds);
      //setLoading(true);

      const requests = values?.childrenNIds.map((childNid) => {
        return ADD_SUBORDINATE({
          [sex === "f"
            ? "motherNationalId"
            : "fatherNationalId"]: familyData.national_number,
          personnelNationalId: childNid,
          relation: sex === "f" ? "mother" : "father",
        });
      });

      console.log("requests:", requests);

      Promise.all(requests)
        .then((responses) => {
          showMessage("فرزندان انتخاب شده برای همسر اضافه شدند", "success");
          validateNamesAndSubmit(body, false);
          onFinish();
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
      <Form form={form} name="chooseChildren" onFinish={handleOnFinish}>
        <Col md={8} sm={24} xs={24}>
          <AppFormItem label="فرزندان" name="childrenNIds">
            <AppSelect
              options={childOptions}
              //defaultValue={childOptions.map((i) => i.value)}
              mode="multiple"
              showSearch={false}
              showArrow
            />
          </AppFormItem>
        </Col>

        <SubmitBtn loading={loading} />
      </Form>
    </div>
  );
};

export default ChooseChildrenModal;
