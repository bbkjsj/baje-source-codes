import { Table as AntTable, Popconfirm, Button, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { renderColumns } from "./table/renderColumns";
import { useHistory, useLocation } from "react-router-dom";
import AppTable from "components/general/AppTable";
import useTableSearch from "hooks/useTableSearch";
import useDateFilterTable from "hooks/useDateFilterTable";
import qs from "query-string";
import ResponsiveList from "components/general/ResponsiveList";

const Table = ({ data, updateList }) => {
  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const tableDate = useDateFilterTable();

  const history = useHistory();

  const [list, setList] = useState(data);
  ////
  const location = useLocation();
  const searchParams = qs.parse(location.search);

  const [tableInfo, setTableInfo] = useState({
    pagination: {
      current: searchParams.page ? +searchParams.page : 1,
      defaultPageSize: 20,
    },
  });

  useEffect(() => {
    setList(data);
  }, [data]);

  const handleTableChange = (
    pagination,
    filters,
    sorter,
    { currentDataSource, action }
  ) => {
    //Reset current page on filter or sort
    if (action !== "paginate")
      pagination = {
        ...pagination,
        current: 1,
      };

    // save current page if it is updated as url query param so that the page would be loaded on back or refresh
    if (action !== "filter") {
      const queryParams = qs.parse(location.search);
      const newQueries = { ...queryParams };
      const isDiffPage = pagination.current !== tableInfo.pagination.current;
      const isDiffSort =
        !queryParams?.sort ||
        (queryParams?.sort &&
          (sorter?.field !== queryParams.sort ||
            sorter?.order !== queryParams.sort_order));

      if (isDiffPage) {
        newQueries.page = pagination.current;
      }
      if (isDiffSort) {
        newQueries.sort = sorter.field;
        newQueries.sort_order = sorter.order;
      }
      if (!sorter.order) {
        delete newQueries.sort_order;
        delete newQueries.sort;
      }

      if (isDiffPage || isDiffSort) {
        history.replace({ search: qs.stringify(newQueries) });
      }
    }

    //Trigger changes on table info
    setTableInfo({
      pagination,
      filters,
      sorter,
    });
  };

  return (
    <div>
      {/* <Spin spinning={loading}> */}
      <ResponsiveList
        rowKey={(record) => record.id}
        columns={renderColumns(data, history, tableSearch, tableDate)}
        dataSource={list}
        footer={null}
        pagination={tableInfo?.pagination}
        tableInfo={tableInfo}
        setTableInfo={setTableInfo}
        filterMode="client"
        showFilters={true}
        titleKeys={["first_name", "last_name"]}
        initialData={data}
        setData={setList}
        size="small"
        scroll={{ y: 600, x: true }}
        bordered={true}
        onChange={handleTableChange}
      />
      {/* </Spin> */}
    </div>
  );
};

export default Table;
