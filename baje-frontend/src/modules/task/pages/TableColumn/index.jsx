import React, { useEffect, useReducer } from "react";
import ContentTop from "components/general/ContentTop";
import { useLocation } from "react-router-dom";
import {
  getTableColumn,
  getTableDbColumn,
  deleteTableColumn,
} from "modules/task/api/tableColumn";
import AppTable from "components/general/AppTable";
import MenuInlineBtn from "components/MenuInlineBtn";
import GoBackBtn from "components/GoBackBtn";
import {
  tableColumnActions,
  TableColumnContext,
  tableColumnInitialState,
  tableColumnrRducer,
} from "./context";
import AddorEditTableColumn from "./AddorEdit";
import TableActions from "components/general/TableActions";
import qs from "query-string";
import { pageNames } from "constant";
import { getLink } from "_helpers";
import ResponsiveList from "components/general/ResponsiveList";

const TableColumn = () => {
  const [state, dispatch] = useReducer(
    tableColumnrRducer,
    tableColumnInitialState
  );

  const {
    state: { tableName },
  } = useLocation();

  useEffect(() => {
    loadTableColumn();
  }, []);

  const loadTableColumn = async () => {
    try {
      const { data: tableColumns } = await getTableColumn(tableName);
      const { data: tableDbColumns } = await getTableDbColumn(tableName);
      dispatch({
        type: tableColumnActions.setInitialState,
        payload: {
          tableName,
          tableColumns,
          tableDbColumns,
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleCreateColumn = () => {
    dispatch({ type: tableColumnActions.toggleAddOrEditmodal });
  };

  const handleDeleteTableColumn = async (tableColumn) => {
    try {
      await deleteTableColumn(tableColumn);
      dispatch({
        type: tableColumnActions.setTableColumns,
        payload: state.tableColumns.filter(
          (item) => item.id !== tableColumn.id
        ),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEditTableColumn = (payload) => {
    dispatch({ type: tableColumnActions.toggleAddOrEditmodal, payload });
  };

  const mobileItemActions = [
    {
      name: "ویرایش",
      onClick: (record) => handleEditTableColumn(record),
    },
    {
      name: "حذف",
      onClick: (record) => handleDeleteTableColumn(record),
    },
  ];

  return (
    <TableColumnContext.Provider value={{ state, dispatch }}>
      <ContentTop title={`ستون های تعریف شده برای جدول ${tableName.title}`} />
      <GoBackBtn />

      <MenuInlineBtn
        list={[
          { label: "تعریف ستون برای جدول", handleClick: handleCreateColumn },
        ]}
      />

      <ResponsiveList
        dataSource={state.tableColumns}
        loading={state.loading}
        pagination={{ defaultPageSize: 20 }}
        itemActions={mobileItemActions}
        titleKeys={["title"]}
        columns={[
          { title: "شناسه", dataIndex: "id" },
          { title: "عنوان تعریف شده", dataIndex: "title" },
          { title: "نام ستون در دیتابیس", dataIndex: "columnName" },
          { title: "نوع متغیر", dataIndex: "type" },
          {
            title: "ابزار",
            render: (data) => (
              <TableActions
                list={[
                  {
                    name: "edit",
                    onClick: () => handleEditTableColumn(data),
                  },
                  {
                    name: "delete",
                    onClick: () => handleDeleteTableColumn(data),
                  },
                ]}
              />
            ),
          },
        ]}
      />
      <AddorEditTableColumn />
    </TableColumnContext.Provider>
  );
};

export default TableColumn;
