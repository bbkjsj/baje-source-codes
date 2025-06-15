import {
  Table as AntTable,
  Popconfirm,
  Button,
  notification,
  Modal,
} from "antd";
import React, { useState, useContext, useEffect } from "react";
import { renderColumns } from "../listColumns";
import { useHistory, useLocation } from "react-router-dom";
import { _DELETE } from "../utils/api";
import AppTable from "components/general/AppTable";
import useTableSearch from "hooks/useTableSearch";
import useRangeFilter from "hooks/useRangeFilter";
import qs from "query-string";
import useIsMobile from "hooks/useIsMobile";
import MobileList from "components/mobileList/MobileList";
import { pageNames } from "constant";
import { getLink } from "_helpers";
import ResponsiveList from "./../../../../../components/general/ResponsiveList";

const Table = ({
  data,
  status,
  updateList,
  selectedRow,
  rowSelection,
  setLoadingList,
  insurance,
  onViewHandler,
  onEditHandler,
}) => {
  const history = useHistory();
  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const rangeFilter = useRangeFilter();

  const [list, setList] = useState(data);
  ////
  const location = useLocation();
  const isMobile = useIsMobile();

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
    let delIds = [];
    if (Array.isArray(id)) {
      delIds = id;
    } else {
      delIds.push(id);
    }
    setLoadingList(true);
    _DELETE(delIds)
      .then((res) => {
        setLoadingList(false);
        if (res) {
          notification.success({
            message: "با موفقیت حذف شد",
          });
          updateList();
        } else {
          notification.error({
            message: "عملیات ناموفق، لطفا مجددا تلاش کنید",
          });
        }
      })
      .catch((err) => {
        setLoadingList(false);
        notification.error({
          message: "عملیات ناموفق، لطفا مجددا تلاش کنید",
        });
        console.error(err);
      });
  };

  const deleteGroup = () => {
    if (status === "عدم تایید" || status === "null") {
      return (
        <Popconfirm
          placement="leftTop"
          title={"آیا برای حذف اطمینان دارید ؟"}
          onConfirm={() => deleteItem(selectedRow)}
          okText="بله"
          cancelText="خیر"
        >
          <Button type="danger">حذف</Button>
        </Popconfirm>
      );
    }
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
      name: "مشاهده",
      onClick: (record) => onViewHandler(record),
    },

    {
      name: "ویرایش",
      onClick: (record) => onEditHandler(record),
      hide: insurance && !(status === "عدم تایید" || status === "null"),
    },
    {
      name: "حذف",
      onClick: (record) =>
        Modal.confirm({
          onOk: () => deleteItem([record.id]),
          content: "آیا از حذف این مورد اطمینان دارید؟",
        }),
      hide: insurance && !(status === "عدم تایید" || status === "null"),
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
      columns={renderColumns(
        data,
        status,
        history,
        deleteItem,
        updateList,
        setLoadingList,
        insurance,
        tableSearch,
        rangeFilter,
        onViewHandler,
        onEditHandler,
        qs.parse(location.search)
      )}
      // selected={selectedRow}
      // onSelectedChange={setSelectedRow}
      titleKeys={["full_name"]}
      initialData={data}
      setData={setList}
      rowKey={(record) => record.id}
      rowSelection={{ ...rowSelection }}
      footer={selectedRow.length > 0 && deleteGroup}
      scrollX={1420}
      onChange={handleTableChange}
    />
  );
};

export default Table;
