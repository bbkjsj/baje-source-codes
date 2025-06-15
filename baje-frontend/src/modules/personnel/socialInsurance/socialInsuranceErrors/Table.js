import { Table as AntTable, Popconfirm, Button, Spin } from "antd";
import React, { useState, useContext } from "react";
import { renderColumns } from "./table/renderColumns";
import AppTable from "components/general/AppTable";

const Table = ({ data }) => {
  return (
    <div>
      <AppTable
        rowKey={(record) => record.id}
        columns={renderColumns(data)}
        dataSource={data}
        bordered={true}
      />
    </div>
  );
};

export default Table;
