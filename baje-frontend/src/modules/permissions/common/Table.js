import React, { useState, useEffect } from "react";
import { renderColumns } from "./listColumns";
import { useHistory, useLocation } from "react-router-dom";
import useTableSearch from "hooks/useTableSearch";
import useTableSelectSearch from "hooks/useTableSelectSearch";
import qs from "query-string";
import ResponsiveList from "components/general/ResponsiveList";
import { downloadExcel } from "_helpers";
import { endpoint } from "../utils/api";

const Table = ({
  data,
  updateList,
  selectedRow,
  rowSelection,
  setLoadingList,
  setSelectedId,
  setCodesModal,
  setJobsModal,
}) => {
  const history = useHistory();
  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const tableSelect = useTableSelectSearch({
    saveParams: true,
    filterMultiple: true,
  });

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

  const mobileItemActions = [
    {
      name: "دارندگان",
      onClick: (record) => {
        downloadExcel(
          endpoint("/access/report/excel/personnel-access/" + record.code)
        );
      },
    },
    // {
    //   name: "مشاغل دارای دسترسی",
    //   onClick: () => {},
    // },
    {
      name: "دسترسی های لازم",
      onClick: (record) => {
        setSelectedId(record.id);
        setCodesModal(true);
      },
    },
    {
      name: "دسترسی های ملزوم",
      onClick: (record) => {
        downloadExcel(
          endpoint("/access/report/excel/prerequisite/" + record.code)
        );
      },
    },
  ];

  return (
    <ResponsiveList
      dataSource={list}
      pagination={tableInfo?.pagination}
      tableInfo={tableInfo}
      setTableInfo={setTableInfo}
      filterMode="client"
      itemActions={mobileItemActions}
      showFilters={true}
      columns={renderColumns({
        data,
        history,
        updateList,
        setLoadingList,
        tableSearch,
        tableSelect,
        searchParams: qs.parse(location.search),
        setSelectedId,
        setCodesModal,
        setJobsModal,
      })}
      titleKeys={["module", "label"]}
      titleSeparator=" - "
      initialData={data}
      setData={setList}
      rowKey={(record) => record.id}
      size="small"
      scroll={{ y: 600, x: true }}
      bordered={true}
      onChange={handleTableChange}
    />
  );
};

export default Table;
