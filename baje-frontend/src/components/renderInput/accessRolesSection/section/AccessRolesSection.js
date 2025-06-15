import React, { useState } from "react";
import Styles from "./accessRolesSection.module.css";
import { Form, Checkbox, Col, Row } from "antd";
import { v4 as uuidv4 } from "uuid";
import { permission as systemPermission } from "json/Permission";

const AccessRolesSection = (props) => {
  const [checkAll, setCheckAll] = useState(true);

  const checkBoxValue = [];
  const renderCheckBox = () => {
    let result = props.data.map((el) => {
      if (el) {
        checkBoxValue.push(el.value);
        return (
          <Col key={uuidv4()} xs={24} sm={24} md={12} lg={8} xl={6}>
            <Checkbox value={el.value}>{el.label}</Checkbox>
          </Col>
        );
      }
    });
    return result;
  };

  const handleAllCheck = () => {
    setCheckAll((prev) => !prev);
    props.form.setFieldsValue({
      [props.name]: checkAll ? checkBoxValue : [],
    });
  };

  const shouldAutoCheck = (form, sectionName, sourceList) => {
    const sectionSelectedItems = form.getFieldValue(sectionName);
    return (
      sectionSelectedItems.filter((el) => sourceList.indexOf(el) !== -1)
        .length > 0
    );
  };

  const autoCheck = (form, sectionName, sourceList, targets) => {
    const shouldCheck = shouldAutoCheck(form, sectionName, sourceList);

    if (shouldCheck) {
      targets.forEach((el) => {
        const sectionSelectedItems = form.getFieldValue(sectionName);
        if (sectionSelectedItems.indexOf(el) === -1) {
          form.setFieldsValue({
            [sectionName]: [...sectionSelectedItems, el],
          });
        }
      });
    }
  };

  const changeCheckBoxHandler = (props) => {
    if (props.name === "tamin_insurance") {
      autoCheck(
        props.form,
        "tamin_insurance",
        [
          systemPermission.SOCIAL_INSURANCE_CHANGE_STATUS.permission,
          systemPermission.SOCIAL_INSURANCE_LIST_EXCEL_EXPORT.permission,
          systemPermission.SOCIAL_INSURANCE_MEMEBERS_EXCEL_EXPORT.permission,
        ],
        [systemPermission.SOCIAL_INSURANCE_MENU.permission]
      );

      autoCheck(
        props.form,
        "tamin_insurance",
        [
          systemPermission.SOCIAL_INSURANCE_MENU.permission,
          systemPermission.SOCIAL_INSURANCE_CHANGE_STATUS.permission,
          systemPermission.SOCIAL_INSURANCE_LIST_EXCEL_EXPORT.permission,
          systemPermission.SOCIAL_INSURANCE_MEMEBERS_EXCEL_EXPORT.permission,
        ],
        [
          systemPermission.SOCIAL_INSURANCE_REPORT.permission,
          systemPermission.SOCIAL_INSURANCE_CONTRACTS.permission,
          systemPermission.SOCIAL_INSURANCE_BENEFITS.permission,
        ]
      );
    }
  };
  return (
    <Col span={24}>
      <Form.Item name={"selectAll"}>
        <Checkbox onChange={handleAllCheck}>همه موارد</Checkbox>
      </Form.Item>
      <Form.Item name={props.name}>
        <Checkbox.Group
          style={{ width: "100%" }}
          disabled={!checkAll}
          onChange={() => changeCheckBoxHandler(props)}
        >
          <Row>{renderCheckBox()}</Row>
        </Checkbox.Group>
      </Form.Item>
    </Col>
  );
};

export default AccessRolesSection;
