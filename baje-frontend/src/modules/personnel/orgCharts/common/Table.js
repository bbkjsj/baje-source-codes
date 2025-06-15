import {
  Table as AntTable,
  Popconfirm,
  Button,
  notification,
  Modal,
} from "antd";
import React, { useState, useEffect } from "react";
import { renderColumns } from "./listColumns";
import { useHistory, useLocation } from "react-router-dom";
import AppTable from "components/general/AppTable";
import useTableSearch from "hooks/useTableSearch";
import useDateFilterTable from "hooks/useDateFilterTable";
import useTableSelect from "hooks/useTableSelectSearch";
import { deleteChart, updateChart, updateChartStatus } from "./api";
import {
  handleExceptions,
  handleSuccess,
} from "modules/personnel/jobs/common/api";
import { useParams } from "react-router";
import qs from "query-string";
import { pageNames } from "constant";
import { getLink } from "_helpers";
import ResponsiveList from "components/general/ResponsiveList";
import routes from "../../routes";

const Table = ({
  data,
  updateList,
  selectedRow,
  rowSelection,
  setLoadingList,
  handleOnTableChange,
  pagination,
  loading,
  setSelected,
}) => {
  const history = useHistory();
  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const tableDate = useDateFilterTable();
  const tableSelect = useTableSelect({
    saveParams: true,
    filterMultiple: true,
  });
  const params = useParams();

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

  const deleteItem = (id) => {
    setLoadingList(true);
    deleteChart(id)
      .then((res) => {
        setLoadingList(false);
        handleSuccess(res);
        window.location.reload();
      })
      .catch((err) => {
        setLoadingList(false);
        handleExceptions(err);
      });
  };

  const verifyItem = (newStatus, id, title) => {
    setLoadingList(true);
    updateChart({ enable: newStatus }, id)
      .then((res) => {
        setLoadingList(false);
        handleSuccess(res);
        updateList();
      })
      .catch((err) => {
        setLoadingList(false);
        handleExceptions(err);
      });
  };

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

  const mobileItemActions = [
    {
      name: "ویرایش",
      onClick: (record) =>
        history.push(
          getLink(routes.PERSONNEL_JOBS_CHARTS_EDIT, {
            chart_id: record.id,
            id: params.id,
          })
        ),

      hide: (record) => record.status !== "تایید شده",
    },
    {
      name: "حذف",
      onClick: (record) =>
        Modal.confirm({
          onOk: () => deleteItem([record.id]),
          content: "آیا از حذف این مورد اطمینان دارید؟",
        }),

      hide: (record) => record.status !== "تایید شده",
    },
  ];

  return (
    <ResponsiveList
      rowKey={(record) => record.id}
      size="small"
      scroll={{ y: 600, x: true }}
      columns={renderColumns(
        data,
        history,
        deleteItem,
        verifyItem,
        updateList,
        setLoadingList,
        tableSearch,
        tableDate,
        tableSelect,
        params,
        qs.parse(location.search)
      )}
      dataSource={list}
      bordered={true}
      rowSelection={{ ...rowSelection }}
      //onChange={handleOnTableChange}
      //pagination={pagination}
      loading={loading}
      pagination={tableInfo?.pagination}
      tableInfo={tableInfo}
      setTableInfo={setTableInfo}
      filterMode="client"
      itemActions={mobileItemActions}
      showFilters={true}
      viewLink={(record) =>
        getLink(routes.PERSONNEL_JOBS_CHARTS_VIEW, {
          chart_id: record.id,
          id: params.id,
        })
      }
      titleKeys={["title"]}
      initialData={data}
      setData={setList}
      onChange={handleTableChange}
      selected={selectedRow}
      onSelectedChange={(selected) => setSelected(selected)}
    />
  );
};

export default Table;
