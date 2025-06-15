import { Divider, Form, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import {
  getDbTableNames,
  patchTableName,
  postTableName,
} from "modules/task/api/tableName";

import AppButton from "components/general/AppButton";
import AppFormItem from "components/general/AppFormItem";
import AppInput from "components/general/AppInput";
import AppModal from "components/general/AppModal";
import AppSelect from "components/general/AppSelect";

/**
 *
 * @param {object} params - params of component
 * @param {boolean} params.visible - modal visibility
 * @param {Function} params.onCancel - on cancel function
 * @param {Function} params.onCreatedTableName - onCreatedTableName
 * @param {Function} params.onEditedTableName - onEditedTableName
 * @param {object} params.selectedTableName - selectedTableName
 * @returns
 */
const AddOrEditTableName = ({ ...prp }) => {
  const [state, setState] = useState({ dbTableNames: [] });
  const { useForm } = Form;
  const [form] = useForm();

  useEffect(() => {
    if (prp.visible) loadDbTableNames();
    if (prp.visible && prp.selectedTableName?.id)
      form.setFields([
        { name: "title", value: prp.selectedTableName.title },
        { name: "table_name", value: prp.selectedTableName.table_name },
      ]);
    if (prp.visible && !prp.selectedTableName)
      form.setFields([
        { name: "title", value: "" },
        { name: "table_name", value: "" },
      ]);
  }, [prp.visible]);

  const loadDbTableNames = async () => {
    try {
      const { data: dbTableNames } = await getDbTableNames();
      setState((s) => ({ ...s, dbTableNames }));
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleModifyTableName = (tableName) => {
    const handleEditTableName = async () => {
      try {
        await patchTableName({
          id: prp.selectedTableName.id,
          ...tableName,
        });
        prp.onEditedTableName &&
          prp.onEditedTableName({
            ...prp.selectedTableName,
            ...tableName,
          });
      } catch (error) {
        console.log(error.message);
      }
    };

    const handleCreateTableName = async () => {
      try {
        const { data } = await postTableName(tableName);
        form.resetFields();
        prp.onCreatedTableName && prp.onCreatedTableName(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    if (!prp.selectedTableName) return handleCreateTableName();
    handleEditTableName();
  };

  return (
    <AppModal centered footer={null} closable={false} {...prp}>
      <Typography.Title level={5}>ساخت جدول جدید</Typography.Title>
      <Divider />

      <Form onFinish={handleModifyTableName} form={form}>
        <AppFormItem
          tooltip="نام جدول باید اختصاصی و منحصربه فرد باشد. شما می توانید از بین نام جدول های موجود در دیتابیس یک مورد را انتخاب کنید."
          label="نام جدول"
          name="table_name"
          required>
          <AppSelect
            showSearch
            options={state.dbTableNames.map((item) => ({
              label: item,
              value: item,
            }))}
          />
        </AppFormItem>
        <AppFormItem label="عنوان" name="title" required>
          <AppInput />
        </AppFormItem>
        <Row justify="end">
          <AppButton htmlType="submit" className="mx-2">
            {`${!prp.selectedTableName ? "ساخت" : "ویرایش"}`}
          </AppButton>
          <AppButton onClick={prp.onCancel} variant="danger">
            بستن
          </AppButton>
        </Row>
      </Form>
    </AppModal>
  );
};

export default AddOrEditTableName;
