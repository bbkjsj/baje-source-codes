import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { Spin } from "antd";
import AppTable from "components/general/AppTable";
import { mobileItemActions, renderColumns } from "../utils/index";
import ResponsiveList from "components/general/ResponsiveList";

function Table({
  list,
  getList,
  onDisplayForm,
  onChangeStatus,
  columnsList,
  operatorAccess,
  managerAccess,
  current,
}) {
  const loading = false;
  return (
    <div>
      <Spin spinning={loading}>
        <ResponsiveList
          rowKey={(record) => record.id}
          columns={renderColumns(
            list,
            onDisplayForm,
            getList,
            onChangeStatus,
            columnsList(list),
            operatorAccess,
            managerAccess
          )}
          dataSource={list}
          current={current}
          titleKeys={["id"]}
          showFilters={false}
          pagination={{ defaultPageSize: 20 }}
          noRowNum
          itemActions={mobileItemActions(
            onDisplayForm,
            getList,
            onChangeStatus,
            operatorAccess,
            managerAccess
          )}
        />
      </Spin>
    </div>
  );
}

export default Table;
