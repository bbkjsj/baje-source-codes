import { Form, Row } from "antd";
import AppButton from "components/general/AppButton";
import AppFormItem from "components/general/AppFormItem";
import AppInput from "components/general/AppInput";
import AppModal from "components/general/AppModal";
import AppSelect from "components/general/AppSelect";
import {
  patchTableColumn,
  postTableColumn,
} from "modules/task/api/tableColumn";
import React, { useEffect } from "react";
import { tableColumnActions, useTableColumnContext } from "./context";

const AddorEditTableColumn = () => {
  const { state, dispatch } = useTableColumnContext();
  const [form] = Form.useForm();

  useEffect(() => {
    if (state.addOrEditModal && state.selectedTableColumn)
      form.setFields([
        { name: "title", value: state.selectedTableColumn.title },
        { name: "columnName", value: state.selectedTableColumn.columnName },
      ]);
    if (state.addOrEditModal && !state.selectedTableColumn) form.resetFields();
  }, [state.addOrEditModal]);

  const handleClose = () => {
    dispatch({ type: tableColumnActions.toggleAddOrEditmodal });
  };

  const handleModifyTableColumn = (tableColumn) => {
    const type = state.tableDbColumns.find(
      (item) => item.Field === tableColumn.columnName
    )?.Type;
    const handleCreateTableColumn = async () => {
      try {
        const { data } = await postTableColumn({
          ...tableColumn,
          tableId: state.tableName.id,
          type,
        });
        form.resetFields();
        dispatch({
          type: tableColumnActions.setTableColumns,
          payload: [...state.tableColumns, data],
        });
      } catch (error) {
        console.log(error.message);
      }
    };

    const handleEditTableColumn = async () => {
      try {
        await patchTableColumn({
          id: state.selectedTableColumn.id,
          type,
          ...tableColumn,
        });
        const temp = [...state.tableColumns];
        const index = temp.findIndex(
          (item) => item.id === state.selectedTableColumn.id
        );
        temp[index] = {
          id: state.selectedTableColumn.id,
          type,
          ...tableColumn,
        };
        dispatch({ type: tableColumnActions.setTableColumns, payload: temp });
      } catch (error) {
        console.log(error.message);
      }
    };

    if (!state.selectedTableColumn) handleCreateTableColumn();
    handleEditTableColumn();
  };

  return (
    <AppModal
      footer={null}
      closable={false}
      visible={state.addOrEditModal}
      onCancel={handleClose}>
      <Form form={form} onFinish={handleModifyTableColumn}>
        <AppFormItem required label="ستون های دیتابیس" name="columnName">
          <AppSelect
            options={state.tableDbColumns
              .filter(
                (item) =>
                  !state.tableColumns.find(
                    (ttt) => ttt.columnName === item.Field
                  )
              )
              .map((item) => ({
                label: item.Field,
                value: item.Field,
              }))}
          />
        </AppFormItem>
        <AppFormItem required label="عنوان ستون" name="title">
          <AppInput />
        </AppFormItem>

        <Row justify="end">
          <AppButton className="mx-2" htmlType="submit">
            افزودن
          </AppButton>
          <AppButton variant="danger" onClick={handleClose}>
            بستن
          </AppButton>
        </Row>
      </Form>
    </AppModal>
  );
};

export default AddorEditTableColumn;
