import {
  Table as AntTable,
  Popconfirm,
  Button,
  notification,
  Modal,
} from "antd";
import React, { useState, useContext, useEffect } from "react";
import { renderColumns } from "./listColumns";
import { useHistory, useLocation } from "react-router-dom";
import AppTable from "components/general/AppTable";
import useTableSearch from "hooks/useTableSearch";
import useTableSelectSearch from "hooks/useTableSelectSearch";
import { deleteJob, handleExceptions, updateJob, handleSuccess } from "./api";
import qs from "query-string";
import useIsMobile from "hooks/useIsMobile";
import MobileList from "components/mobileList/MobileList";
import { pageNames } from "constant";
import { getLink } from "_helpers";
import ResponsiveList from "./../../../../components/general/ResponsiveList";

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
  setAccessModal,
  setCodesModal,
  setChartsModal,
  setSelectedId,
  tableInfo,
  setTableInfo,
}) => {
  const history = useHistory();
  const tableSearch = useTableSearch();
  const selectSearch = useTableSelectSearch();
  const [list, setList] = useState(data);
  ////
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    setList(data);
  }, [data]);

  const deleteItem = (id) => {
    setLoadingList(true);
    deleteJob(id)
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
        handleExceptions(err);
        console.error(err);
      });
  };

  function changeStatus(newStatus, id, title) {
    setLoadingList(true);
    updateJob({ status: newStatus, title }, id)
      .then((res) => {
        setLoadingList(false);
        handleSuccess(res);
        updateList();
      })
      .catch((err) => {
        setLoadingList(false);
        handleExceptions(err);
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
      name: "سطوح دسترسی",
      onClick: (record) => {
        setSelectedId(record.id);
        setAccessModal(true);
      },
    },
    {
      name: "کد شغل های قابل قبول تامین اجتماعی",
      onClick: (record) => {
        setSelectedId(record.id);
        setCodesModal(true);
      },
    },
    {
      name: "ملاک های ممیزی",
      onClick: (record) =>
        history.push(pageNames.hse.checklist.index + `?job_id=${record.id}`),
    },
    {
      name: "چارت های استفاده شده",
      onClick: (record) => {
        setSelectedId(record.id);
        setChartsModal(true);
      },
    },
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
        qs.parse(location.search),
        setAccessModal,
        setCodesModal,
        setChartsModal,
        setSelectedId
      )}
      titleKeys={["title"]}
      initialData={data}
      setData={setList}
      rowKey={(record) => record.id}
      onChange={handleOnTableChange}
      loading={loading}
    />
  );
};

export default Table;
