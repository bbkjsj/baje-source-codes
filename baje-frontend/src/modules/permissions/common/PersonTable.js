import React, { useState, useEffect } from "react";
import { renderColumns } from "./PersonListColumns";
import { useHistory, useLocation, useParams } from "react-router-dom";
import useTableSearch from "hooks/useTableSearch";
import useTableSelectSearch from "hooks/useTableSelectSearch";
import qs from "query-string";
import ResponsiveList from "components/general/ResponsiveList";
import { deleteUserPermission } from "../utils/api";
import { message, Modal } from "antd";

const PersonTable = ({
  data,
  updateList,
  selectedRow,
  rowSelection,
  setLoadingList,
  setSelectedId,
  setEditModal,
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
  const routeParams = useParams();

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

  function deletePermission(accessId) {
    setLoadingList(true);

    const body = {
      personnelId: Number(routeParams.id),
      accessId,
    };

    deleteUserPermission(body)
      .then(() => {
        message.success({ content: "با موفقیت انجام شد" });
        updateList();
      })
      .finally(() => {
        setLoadingList(false);
      });
  }

  const mobileItemActions = [
    {
      name: "ویرایش",
      onClick: (record) => {
        setSelectedId({
          id: record.id,
          accessId: record.accessId,
          endDate: record.endDate,
        });
        setEditModal(true);
      },
    },
    {
      name: "حذف",
      onClick: (record) => {
        Modal.confirm({
          content: "آیا از حذف این دسترسی برای این فرد اطمینان دارید؟",
          onOk: () => deletePermission(record.accessId),
        });
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
        setEditModal,
        deleteItem: deletePermission,
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

export default PersonTable;
