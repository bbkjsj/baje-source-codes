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
import { _DELETE } from "../utils/api";
import AppTable from "components/general/AppTable";
import useTableSearch from "hooks/useTableSearch";
import useDateFilterTable from "hooks/useDateFilterTable";
import useTableSelectSearch from "hooks/useTableSelectSearch";
import { useSelector } from "react-redux";
import useCheckAccess from "hooks/useCheckAccess";
import qs from "query-string";
import useIsMobile from "hooks/useIsMobile";
import MobileList from "components/mobileList/MobileList";
import { pageNames } from "constant";
import { getLink } from "_helpers";
import ResponsiveList from "./../../../../../components/general/ResponsiveList";
import colors from "utils/colors";
import useWhoAmI from "hooks/useWhoAmI";
import useTablePersonFilter from "hooks/useTablePersonFilter";

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
  const tableSelectSearch = useTableSelectSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const tablePersonFilter = useTablePersonFilter({
    saveParams: true,
  });
  const user = useWhoAmI();
  const checkAccess = useCheckAccess();
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

  const mobileItemActions = [
    {
      name: "ویرایش",
      onClick: (record) =>
        history.push(
          getLink(pageNames.personnel.realPerson.leaveRequest.edit, {
            id: record.id,
          })
        ),
      hide: (record) =>
        record.status == "تایید نهایی" || record.status == "عدم تایید"
          ? true
          : false,
    },
    {
      name: "حذف",
      onClick: (record) =>
        Modal.confirm({
          onOk: () => deleteItem([record.id]),
          content: "آیا از حذف این مورد اطمینان دارید؟",
        }),
      hide: (record) =>
        record.status == "تایید نهایی" || record.status == "عدم تایید"
          ? true
          : false,
    },
  ];

  function getMobileTitle(record) {
    return `${record.first_name} ${record.last_name} - ${
      record.requested
        ? record.request_type === "ساعتی"
          ? `${record.hours} ساعت`
          : `${record.days + 1} روز`
        : ""
    }`;
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
      personFilters={[{ id: "operator_id_fk", label: "تایید کننده" }]}
      defaultSorter={true}
      columns={renderColumns(
        data,
        history,
        deleteItem,
        updateList,
        setLoadingList,
        tableSearch,
        tableDateFilter,
        tableSelectSearch,
        user.isSuper,
        checkAccess,
        qs.parse(location.search),
        tablePersonFilter
      )}
      viewLink={(record) =>
        getLink(pageNames.personnel.realPerson.leaveRequest.view, {
          id: record.id,
        })
      }
      mobileItemsTitle={getMobileTitle}
      initialData={data}
      setData={setList}
      rowKey={(record) => record.id}
      size="small"
      scroll={{ y: 600, x: true }}
      bordered={true}
      // rowSelection={{ ...rowSelection }}
      // footer={selectedRow.length > 0 && deleteGroup}
      onChange={handleTableChange}
      mobileItemColors={(record) => {
        if (record.status == "تایید نهایی") {
          return "#5e8a26";
        } else if (record.status == "عدم تایید") {
          return "#f9b900";
        }
        return colors.primary;
      }}
    />
  );
};

export default Table;
