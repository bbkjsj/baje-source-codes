import {
  Table as AntTable,
  Popconfirm,
  Button,
  notification,
  Modal,
} from "antd";
import React, { useState, useContext, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import useTableSearch from "hooks/useTableSearch";
import useTableSelectSearch from "hooks/useTableSelectSearch";
import { deleteEnvironmentUsage, updateEnvironmentUsage } from "./api";
import qs from "query-string";
import useIsMobile from "hooks/useIsMobile";
import ResponsiveList from "./../../../components/general/ResponsiveList";
import { renderColumns } from "./listColumns";

const Table = ({
  data,
  updateList,
  selectedRow,
  rowSelection,
  setSelectedRow,
  setLoadingList,
  handleOnTableChange,
  pagination,
  loading,
}) => {
  const history = useHistory();
  const tableSearch = useTableSearch();
  const selectSearch = useTableSelectSearch();
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
    setLoadingList(true);
    deleteEnvironmentUsage(id)
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

        console.error(err);
      });
  };

  function changeStatus(newStatus, id) {
    setLoadingList(true);
    updateEnvironmentUsage({ isEnable: newStatus }, id)
      .then((res) => {
        setLoadingList(false);

        updateList();
      })
      .catch((err) => {
        setLoadingList(false);
      });
  }

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
      name: "حذف",
      onClick: (record) =>
        Modal.confirm({
          onOk: () => deleteItem([record.id]),
          content: "آیا از حذف این مورد اطمینان دارید؟",
        }),
      hide: (record) =>
        record.title !== "مدیر عامل" && record.title !== "مدیر پروژه",
    },
  ];

  return (
    <ResponsiveList
      dataSource={list}
      pagination={tableInfo?.pagination}
      tableInfo={tableInfo}
      setTableInfo={setTableInfo}
      filterMode="client"
      selected={selectedRow}
      onSelectedChange={setSelectedRow}
      itemActions={mobileItemActions}
      showFilters={true}
      columns={renderColumns(
        data,
        history,
        deleteItem,
        updateList,
        setLoadingList,
        tableSearch,
        selectSearch,
        changeStatus,
        qs.parse(location.search)
      )}
      titleKeys={["title"]}
      initialData={data}
      setData={setList}
      rowKey={(record) => record.id}
      rowSelection={{ ...rowSelection }}
      onChange={handleOnTableChange}
      loading={loading}
    />
  );
};

export default Table;
