import {
  Table as AntTable,
  Popconfirm,
  Button,
  notification,
  Modal,
} from "antd";
import React, { useState, useEffect } from "react";
import renderColumns from "./listColumns";
import { useHistory, useLocation } from "react-router-dom";
import { _DELETE, _PUT } from "../utils/api";
import useTableSearch from "hooks/useTableSearch";
import useDateFilterTable from "hooks/useDateFilterTable";
import useTableSelectSearch from "hooks/useTableSelectSearch";
import qs from "query-string";
import { pageNames } from "constant";
import { getLink } from "_helpers";
import ResponsiveList from "components/general/ResponsiveList";
import useCheckAccess from "hooks/useCheckAccess";
import { permission as permissions } from "json/Permission";

const Table = ({
  data,
  updateList,
  selectedRow,
  rowSelection,
  setLoadingList,
}) => {
  const history = useHistory();
  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const tableDateFilter = useDateFilterTable();
  const tableSelect = useTableSelectSearch({
    saveParams: true,
    filterMultiple: true,
  });

  const [list, setList] = useState(data);
  ////
  const location = useLocation();
  const searchParams = qs.parse(location.search);
  const checkAccess = useCheckAccess();

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
    _DELETE(id)
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

  const deleteGroup = () => (
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
      onClick: (record) =>
        history.push(
          getLink(pageNames.environment.edit, {
            id: record.id,
          })
        ),
      name: "ویرایش",
      hide: !checkAccess([permissions.ENVIRONMENT_EDIT]),
    },
    {
      name: "حذف",
      onClick: (record) =>
        Modal.confirm({
          onOk: () => deleteItem(record.id),
          content: "آیا از حذف این مورد اطمینان دارید؟",
        }),
      hide: !checkAccess([permissions.ENVIRONMENT_DELETE]),
    },
  ];

  // change status
  function changeStatus(key, newStatus, id) {
    Modal.confirm({
      content:
        key === "independentChart"
          ? "در صورت فعال نمودن این گزینه، چارت سازمانی نیاز به اصلاح دارد، آیا مطمئنید؟"
          : "آیا اطمینان دارید؟",
      onOk: () => {
        const body = {
          [key]: newStatus,
        };

        setLoadingList(true);

        _PUT(id, body)
          .then(() => {
            setLoadingList(false);
            notification.success({
              message: "با موفقیت ثبت شد",
            });
            updateList();
          })
          .catch((err) => {
            console.error(err);
            notification.error({
              message: "عملیات ناموفق، لطفا مجددا تلاش کنید",
            });
          });
      },
    });
  }

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
        setLoadingList,
        history,
        tableSearch,
        qs.parse(location.search),
        tableInfo,
        tableSelect,
        changeStatus,
        deleteItem,
        checkAccess
      )}
      viewLink={(record) =>
        getLink(pageNames.environment.view, {
          id: record.id,
        })
      }
      initialData={data}
      setData={setList}
      rowKey={(record) => record.id}
      size="small"
      scroll={{ y: 600, x: true }}
      bordered={true}
      rowSelection={{ ...rowSelection }}
      footer={selectedRow.length > 0 && deleteGroup}
      onChange={handleTableChange}
      mobileItemsTitle={(record) => <span>{record.title}</span>}
    />
  );
};

export default Table;
