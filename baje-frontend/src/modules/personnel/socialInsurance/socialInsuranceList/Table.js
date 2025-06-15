import { Table as AntTable, Popconfirm, Button, Spin, Modal } from "antd";
import React, { useState, useContext, useEffect } from "react";
import { renderColumns } from "./table/renderColumns";
import { useHistory, useLocation } from "react-router-dom";
import { useDeleteSocialInsurance } from "../util/hooks";
import AppTable from "components/general/AppTable";
import useTableSearch from "hooks/useTableSearch";
import useTableSelectSearch from "hooks/useTableSelectSearch";
import useRangeFilter from "hooks/useRangeFilter";
import useCheckAccess from "hooks/useCheckAccess";
import qs from "query-string";
import useIsMobile from "hooks/useIsMobile";
import MobileList from "components/mobileList/MobileList";
import { pageNames } from "constant";
import { getLink } from "_helpers";
import ResponsiveList from "./../../../../components/general/ResponsiveList";

const Table = ({
  data,
  updateList,
  rowSelection,
  selectedRow,

  onDbfModal,
  onViewHandler,
  onEditHandler,
  setLoading,
  setSelectedRow,
}) => {
  const checkAccess = useCheckAccess();
  const history = useHistory();
  const { deleteItem, loading } = useDeleteSocialInsurance(updateList);
  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const tableSelect = useTableSelectSearch({
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

  const handleDelete = () => {
    deleteItem(selectedRow, updateList);
  };

  const handleDeleteById = (id) => {
    deleteItem(id, updateList);
  };

  const deleteGroup = () => (
    <Popconfirm
      placement="leftTop"
      title={"آیا برای حذف اطمینان دارید ؟"}
      onConfirm={handleDelete}
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
    { name: "مشاهده", onClick: (record) => onViewHandler(record) },
    {
      name: "لیست افراد",
      onClick: (record) =>
        history.push(
          getLink(pageNames.personnel.insurance.tamin.personnel.list, {
            id: record.id,
            status: record.status,
          })
        ),
    },
    {
      name: "وضعیت پرداختی",
      onClick: (record) =>
        history.push(
          getLink(pageNames.personnel.insurance.tamin.payment.list, {
            contractID: record.contract_id_fk,
            insuranceID: record.id,
          })
        ),
    },
    {
      name: "ویرایش",
      onClick: (record) => onEditHandler(record),
      //hide: handleEditButton(record.status),
    },
    {
      name: "حذف",
      onClick: (record) =>
        Modal.confirm({
          onOk: () => deleteItem([record.id], updateList),
          content: "آیا از حذف این مورد اطمینان دارید؟",
        }),
      //hide: handleRowStatus(record.personnel_count, record.status, "remove"),
    },
  ];

  return (
    <div>
      <Spin spinning={loading}>
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
            handleDeleteById,
            deleteItem,
            updateList,

            tableSearch,
            tableSelect,
            rangeFilter,
            onDbfModal,
            onViewHandler,
            onEditHandler,
            checkAccess,
            setLoading,
            qs.parse(location.search)
          )}
          // selected={selectedRow}
          // onSelectedChange={setSelectedRow}
          titleKeys={["contract_name", "month", "year"]}
          initialData={data}
          setData={setList}
          rowKey={(record) => record.id}
          columnActionsPlacement="corner"
          bordered={true}
          rowSelection={{ ...rowSelection }}
          footer={selectedRow.length > 0 && deleteGroup}
          scrollX={1400}
          onChange={handleTableChange}
        />
      </Spin>
    </div>
  );
};

export default Table;
