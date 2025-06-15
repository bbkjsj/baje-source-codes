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
import qs from "query-string";
import useIsMobile from "hooks/useIsMobile";
import MobileList from "components/mobileList/MobileList";
import { pageNames } from "constant";
import { getLink } from "_helpers";
import ResponsiveList from "./../../../../../components/general/ResponsiveList";

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
  const dateFilterTable = useDateFilterTable();
  const tableSelect = useTableSelectSearch({
    saveParams: true,
    filterMultiple: true,
  });

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

    console.log("filters:", filters);

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
          getLink(pageNames.personnel.realPerson.checkout.edit, {
            id: record.id,
          })
        ),
    },
    {
      name: "حذف",
      onClick: (record) =>
        Modal.confirm({
          onOk: () => deleteItem([record.id]),
          content: "آیا از حذف این مورد اطمینان دارید؟",
        }),
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
        history,
        deleteItem,
        updateList,
        setLoadingList,

        tableSearch,
        dateFilterTable,
        tableSelect,
        qs.parse(location.search)
      )}
      viewLink={(record) =>
        getLink(pageNames.personnel.realPerson.checkout.view, {
          id: record.id,
        })
      }
      titleKeys={["first_name", "last_name"]}
      initialData={data}
      setData={setList}
      rowKey={(record) => record.id}
      size="small"
      scroll={{ y: 600, x: true }}
      bordered={true}
      rowSelection={{ ...rowSelection }}
      footer={selectedRow.length > 0 && deleteGroup}
      onChange={handleTableChange}
    />
  );
};

export default Table;
