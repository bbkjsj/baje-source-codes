import {
  Table as AntTable,
  Popconfirm,
  Button,
  notification,
  Modal,
} from "antd";
import React, { useState, useEffect } from "react";
import { renderColumns } from "./listColumns";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { deleteBoardMember, updateBoardMember } from "../utils/api";
import AppTable from "components/general/AppTable";
//import AppTable from "components/base/AppTable/AppTable";
import useTableSearch from "hooks/useTableSearch";
import useDateFilterTable from "hooks/useDateFilterTable";
import useTableSelectSearch from "hooks/useTableSelectSearch";
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
    deleteBoardMember(id)
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

  const updateStatus = (val, id) => {
    setLoadingList(true);
    updateBoardMember({ enabled: val == 1 ? true : false }, id)
      .then((res) => {
        console.info(res);
        setLoadingList(false);
        if (res) {
          notification.success({
            message: "با موفقیت انجام شد",
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

  const mobileItemActions = [
    {
      name: "ویرایش",
      onClick: (record) =>
        history.push(
          getLink(routes.PERSONNEL_BOARD_MEMBERS_VIEW, {
            id: params.id,
            member_id: record.personnel_id,
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
      rowKey={(record) => record.id}
      size="small"
      scroll={{ y: 600, x: true }}
      columns={renderColumns(
        data,
        history,
        deleteItem,
        updateList,
        setLoadingList,
        updateStatus,
        tableSearch,
        dateFilterTable,
        tableSelect,
        params,
        qs.parse(location.search)
      )}
      bordered={true}
      dataSource={list}
      tableInfo={tableInfo}
      setTableInfo={setTableInfo}
      filterMode="client"
      itemActions={mobileItemActions}
      showFilters={true}
      viewLink={(record) =>
        getLink(routes.PERSONNEL_BOARD_MEMBERS_VIEW, {
          id: params.id,
          member_id: record.personnel_id,
        })
      }
      titleKeys={["first_name", "last_name"]}
      initialData={data}
      setData={setList}
      rowSelection={{ ...rowSelection }}
      onChange={handleTableChange}
      pagination={tableInfo?.pagination}
    />
  );
};

export default Table;
