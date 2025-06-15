import { Table as AntTable, Popconfirm, Button, notification } from "antd";
import React, { useState, useContext, useEffect } from "react";
import { renderColumns } from "./listColumns";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { deleteResume, _DELETE } from "../utils/api";
import AppTable from "components/general/AppTable";
import useTableSearch from "hooks/useTableSearch";
import useTableSelectSearch from "hooks/useTableSelectSearch";
import useDateFilterTable from "hooks/useDateFilterTable";
import qs from "query-string";
import ResponsiveList from "components/general/ResponsiveList";

import {
  handleExceptions,
  handleSuccess,
} from "modules/personnel/jobs/common/api";
import { updateResume } from "./../utils/api";

const Table = ({
  data,
  updateList,
  selectedRow,
  rowSelection,
  setLoadingList,
  handleOnTableChange,
  pagination,
}) => {
  const history = useHistory();
  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const selectSearch = useTableSelectSearch();
  const dateSearch = useDateFilterTable();
  const params = useParams();

  const deleteItem = (id) => {
    setLoadingList(true);
    deleteResume(id)
      .then((res) => {
        setLoadingList(false);
        handleSuccess(res);
        updateList();
      })
      .catch((err) => {
        setLoadingList(false);
        //handleExceptions(err);
      });
  };

  const verifyItem = (item) => {
    setLoadingList(true);
    const body = {
      personnel_id_fk: item.personnel_id,
      jobs_id_fk: item.job_id,
      from_date: item.from_date,
      to_date: item.to_date,
      contract_id_fk: item.contract_id,
      approved: item.approved ? false : true,
    };

    updateResume(body, item.id)
      .then((res) => {
        setLoadingList(false);
        handleSuccess(res);
        updateList();
      })
      .catch((err) => {
        setLoadingList(false);
        //handleExceptions(err);
      });
  };

  return (
    <ResponsiveList
      rowKey={(record) => record.id}
      columns={renderColumns(
        data,
        history,
        deleteItem,
        updateList,
        setLoadingList,
        tableSearch,
        selectSearch,
        dateSearch,
        params,
        verifyItem
      )}
      dataSource={data}
      onChange={handleOnTableChange}
      pagination={pagination}
      titleKeys={["project"]}
      //rowSelection={{ ...rowSelection }}
      //footer={selectedRow.length > 0 && deleteGroup}
    />
  );
};

export default Table;
