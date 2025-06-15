import {
  Table as AntTable,
  Popconfirm,
  Button,
  Spin,
  Descriptions,
} from "antd";
import React, { useState, useContext } from "react";
import { renderColumns } from "./table/renderColumns";
import { useHistory, useParams } from "react-router-dom";
import { useDeleteDeductions } from "../util/hooks";
import AppTable from "components/general/AppTable";
import { priceNormalizer } from "_helpers";
import useTableSearch from "hooks/useTableSearch";
import useDateFilterTable from "hooks/useDateFilterTable";

const totalAmount = (arr) => {
  let amount = 0;
  for (let i = 0; i < arr.length; i++) {
    amount += parseInt(arr[i].amount);
  }
  return priceNormalizer(amount.toString());
};

const Table = ({ data, rowSelection, selectedRow, updateList }) => {
  const { deleteItem, loading } = useDeleteDeductions();
  const history = useHistory();
  const tableSearch = useTableSearch();
  const tableFilter = useDateFilterTable();

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
      <Button style={{ marginTop: "10px" }} type="danger">
        حذف
      </Button>
    </Popconfirm>
  );

  const renderFooter = () => {
    if (data.length === 0) {
      return null;
    }

    return (
      <>
        <Descriptions bordered>
          <Descriptions.Item label="جمع کل">
            {totalAmount(data)}
          </Descriptions.Item>
        </Descriptions>
        {selectedRow.length > 0 && deleteGroup()}
      </>
    );
  };

  return (
    <div>
      <Spin spinning={loading}>
        <AppTable
          rowKey={(record) => record.id}
          columns={renderColumns(
            data,
            history,
            handleDeleteById,
            useParams(),
            tableSearch,
            tableFilter
          )}
          dataSource={data}
          rowSelection={{ ...rowSelection }}
          footer={renderFooter}
        />
      </Spin>
    </div>
  );
};

export default Table;
