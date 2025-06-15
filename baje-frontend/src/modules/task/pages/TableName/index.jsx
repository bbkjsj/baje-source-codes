import { Modal } from "antd";
import AppTable from "components/general/AppTable";
import ContentTop from "components/general/ContentTop";
import ResponsiveList from "components/general/ResponsiveList";
import TableActions from "components/general/TableActions";
import MenuInlineBtn from "components/MenuInlineBtn";
import { pageNames } from "constant";
import { deleteTableName, getTableNames } from "modules/task/api/tableName";
import React, { useEffect, useReducer } from "react";
import { useHistory } from "react-router-dom";
import { getLink } from "_helpers";
import AddOrEditTableName from "./AddOrEdit";

const tableNameActions = {
  setInitialState: "setInitialState",
  toggleAddOrEditModal: "toggleAddOrEditModal",
  setTableNames: "setTableNames",
};

const initialState = {
  tableNames: [],
  loading: true,
  addOrEditModal: false,
  selectedTableName: null,
};

/**
 *
 * @param {object} action - action of reducer
 * @param {string} action.type - type
 * @param {any} action.payload - payload
 * @returns
 */
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case tableNameActions.setInitialState:
      return { ...state, loading: false, tableNames: action.payload };

    case tableNameActions.toggleAddOrEditModal:
      return {
        ...state,
        addOrEditModal: !state.addOrEditModal,
        selectedTableName: action.payload,
      };

    case tableNameActions.setTableNames:
      return { ...state, tableNames: action.payload, addOrEditModal: false };

    default:
      break;
  }
};

const TableName = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { push } = useHistory();

  useEffect(() => {
    loadTableNames();
  }, []);

  const loadTableNames = async () => {
    try {
      const { data: payload } = await getTableNames();
      dispatch({ type: tableNameActions.setInitialState, payload });
    } catch (error) {
      dispatch({ type: tableNameActions.setInitialState, payload: [] });
      console.log(error.message);
    }
  };

  const toggleAddOrEditModal = () => {
    dispatch({ type: tableNameActions.toggleAddOrEditModal });
  };

  const handleDeleteTableName = async (tableName) => {
    try {
      await deleteTableName(tableName);
      dispatch({
        type: tableNameActions.setTableNames,
        payload: state.tableNames.filter((item) => item.id !== tableName.id),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEditTableName = (payload) => {
    dispatch({
      type: tableNameActions.toggleAddOrEditModal,
      payload,
    });
  };

  const onCreatedTableName = (tableName) => {
    dispatch({
      type: tableNameActions.setTableNames,
      payload: [...state.tableNames, tableName],
    });
  };

  const onEditedTableName = (tableName) => {
    const temp = [...state.tableNames];
    const index = temp.findIndex((item) => item.id === tableName.id);
    temp[index] = tableName;
    dispatch({ type: tableNameActions.setTableNames, payload: temp });
  };

  const handleTableColumn = (tableName) => {
    push(pageNames.task.tableName.columns, {
      tableName,
    });
  };

  const mobileItemActions = [
    {
      name: "مشاهده",
      onClick: (record) => handleTableColumn(record),
    },
    { name: "ویرایش", onClick: (record) => handleEditTableName(record) },
    {
      name: "حذف",
      onClick: (record) =>
        Modal.confirm({
          onOk: () => handleDeleteTableName(record),
          content: "آیا از حذف این مورد اطمینان دارید؟",
        }),
    },
  ];

  return (
    <>
      <ContentTop title="عنوان جداول" noBack />
      <MenuInlineBtn
        list={[
          {
            id: "newTable",
            variant: "primary",
            label: "ساخت جدول جدید",
            handleClick: toggleAddOrEditModal,
          },
        ]}
      />
      <ResponsiveList
        dataSource={state.tableNames}
        loading={state.loading}
        titleKeys={["title"]}
        itemActions={mobileItemActions}
        pagination={{ defaultPageSize: 20 }}
        columns={[
          { title: "شناسه", dataIndex: "id" },
          { title: "عنوان", dataIndex: "title" },
          { title: "نام جدول", dataIndex: "table_name" },
          {
            name: "ابزار",
            render: (data) => (
              <TableActions
                list={[
                  {
                    name: "detail",
                    onClick: () => handleTableColumn(data),
                    tooltip: "مشاهده ستون جداول",
                  },
                  { name: "edit", onClick: () => handleEditTableName(data) },
                  {
                    name: "delete",
                    onClick: () => handleDeleteTableName(data),
                  },
                ]}
              />
            ),
          },
        ]}
      />
      <AddOrEditTableName
        onCancel={toggleAddOrEditModal}
        visible={state.addOrEditModal}
        onCreatedTableName={onCreatedTableName}
        selectedTableName={state.selectedTableName}
        onEditedTableName={onEditedTableName}
      />
    </>
  );
};

export default TableName;
