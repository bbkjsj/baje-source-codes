import { Table as AntTable, Popconfirm, Button, Spin } from "antd";
import React, { useState, useContext } from "react";
import { renderColumns } from "./table/renderColumns";
import { useHistory } from "react-router-dom";
import AppTable from "components/general/AppTable";
import useTableSearch from "hooks/useTableSearch";
import useDateFilterTable from "hooks/useDateFilterTable";

const Table = ({ data, updateList }) => {
  const [selectedRow, setSleetedRow] = useState([]);
  const tableSearch = useTableSearch();
  const tableDate = useDateFilterTable();

  const history = useHistory();
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSleetedRow(selectedRowKeys);
    },
  };

  const deleteItem = () => {};

  const handleDelete = () => {
    deleteItem(selectedRow, updateList);
  };

  const handleDeleteById = (id) => {
    deleteItem(id, updateList);
  };

  const deleteGroup = () => (
    <Popconfirm
      placement="leftTop"
      title={"آیا برای حذف اطمینان دارید ؟"}
      onConfirm={handleDelete}
      okText="بله"
      cancelText="خیر"
    >
      <Button type="danger">حذف</Button>
    </Popconfirm>
  );

  return (
    <div>
      {/* <Spin spinning={loading}> */}
      <AppTable
        rowKey={(record) => record.id}
        columns={renderColumns(
          data,
          history,
          handleDeleteById,
          tableSearch,
          tableDate
        )}
        dataSource={data}
        rowSelection={{ ...rowSelection }}
        footer={selectedRow.length > 0 && deleteGroup}
      />
      {/* </Spin> */}
    </div>
  );
};

export default Table;
