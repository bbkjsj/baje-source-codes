import React, { useState, useEffect } from "react";
import { Form, Row, Divider, Checkbox, Col } from "antd";
import SubmitBtn from "components/general/SubmitBtn";
import { formItemLayout, formRowGutter } from "constant";
import LoadingLogo from "components/general/LoadingLogo";
import AppButton from "components/general/AppButton";
import { permission as systemPermission } from "json/Permission";
//
export default function PermissionsForm({
  loading,
  staticPermissions,
  form,
  totalAccess,
  setTotalAccess,
}) {
  const [btnLoading, setBtnLoading] = useState(false);

  const addPermissions = () => {
    const {
      selectContract,
      selectOffice,
      selectAll,
      ...values
    } = form.getFieldsValue();

    let access = [];

    for (const section in values) {
      access.push(values[section]);
    }

    access = [].concat.apply([], access);

    const singleAccess = {
      companyId: selectOffice,
      contractId: selectContract,
      access,
    };

    const index = totalAccess.findIndex(
      (el) =>
        el.companyId == singleAccess.companyId &&
        el.contractId == singleAccess.contractId
    );

    if (index == -1) {
      setTotalAccess((totalAccess) => [...totalAccess, singleAccess]);
    } else {
      setTotalAccess((totalAccess) => {
        totalAccess[index] = singleAccess;
        return totalAccess;
      });
    }
  };

  const onCheckAll = (e, el) => {
    if (e.target.checked) {
      form.setFieldsValue({
        [el.section]: el.permissions.map((perm) => perm.value),
      });
    } else form.setFieldsValue({ [el.section]: [] });
  };

  const onChangeCheckBoxValue = (section, sectionValues) => {
    if (section === "tamin_insurance") {
      const newValues = [...sectionValues];
      if (
        sectionValues.includes(
          systemPermission.SOCIAL_INSURANCE_MENU.permission
        )
      ) {
        const automaticValues = [
          systemPermission.SOCIAL_INSURANCE_REPORT.permission,
          systemPermission.SOCIAL_INSURANCE_CONTRACTS.permission,
          systemPermission.SOCIAL_INSURANCE_BENEFITS.permission,
        ];

        automaticValues.forEach((element) => {
          if (sectionValues.findIndex((item) => item === element) === -1) {
            newValues.push(element);
          }
        });
      }

      if (
        [
          systemPermission.SOCIAL_INSURANCE_CHANGE_STATUS.permission,
          systemPermission.SOCIAL_INSURANCE_LIST_EXCEL_EXPORT.permission,
          systemPermission.SOCIAL_INSURANCE_MEMEBERS_EXCEL_EXPORT.permission,
        ].some((el) => sectionValues.includes(el))
      ) {
        const automaticValues = [
          systemPermission.SOCIAL_INSURANCE_MENU.permission,
          systemPermission.SOCIAL_INSURANCE_REPORT.permission,
          systemPermission.SOCIAL_INSURANCE_CONTRACTS.permission,
          systemPermission.SOCIAL_INSURANCE_BENEFITS.permission,
        ];

        automaticValues.forEach((element) => {
          if (sectionValues.findIndex((item) => item === element) === -1) {
            newValues.push(element);
          }
        });
      }

      form.setFieldsValue({ tamin_insurance: newValues });
    }
  };

  if (loading) {
    return <LoadingLogo />;
  }

  return (
    <>
      <Row gutter={formRowGutter}>
        {staticPermissions.map((el) => {
          return (
            <div key={el.section}>
              <Divider orientation="right">{el.label}</Divider>
              <Col span={24}>
                <Form.Item>
                  <Checkbox onChange={(e) => onCheckAll(e, el)}>
                    همه موارد
                  </Checkbox>
                </Form.Item>
                <Form.Item name={el.section}>
                  <Checkbox.Group
                    style={{ width: "100%" }}
                    options={el.permissions.filter(
                      (item) => item !== null && item?.label !== "null"
                    )}
                    onChange={(e) => onChangeCheckBoxValue(el.section, e)}
                  >
                    {el.permissions
                      .filter((item) => item !== null)
                      .map((item) => {
                        return (
                          <Checkbox key={item.value} checked={item.value}>
                            {item.label}
                          </Checkbox>
                        );
                      })}
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </div>
          );
        })}
      </Row>
      <div className="flex ">
        <AppButton
          size="small"
          loading={btnLoading}
          variant="alt-primary"
          onClick={addPermissions}
        >
          تایید
        </AppButton>
      </div>
    </>
  );
}
