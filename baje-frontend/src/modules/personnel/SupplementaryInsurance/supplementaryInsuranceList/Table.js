import { Table as AntTable, Popconfirm, Button, Spin } from "antd";
import React, { useState, useContext, useEffect } from "react";
import { renderColumns } from "./table/renderColumns";
import { useHistory, useLocation } from "react-router-dom";
import { useSupplementaryInsuranceDelete } from "../util/hooks";
import AppTable from "components/general/AppTable";
import useTableSearch from "hooks/useTableSearch";
import useDateFilterTable from "hooks/useDateFilterTable";
import useTableSelectSearch from "hooks/useTableSelectSearch";
import qs from "query-string";
import useIsMobile from "hooks/useIsMobile";
import MobileList from "components/mobileList/MobileList";
import { pageNames } from "constant";
import { getLink } from "_helpers";
import ResponsiveList from "./../../../../components/general/ResponsiveList";
import useCheckAccess from "hooks/useCheckAccess";
import { permission as permissions } from "json/Permission";

const Table = ({
  detailView,
  data,
  updateList,
  rowSelection,
  selectedRow,
  rowClassName,
  setSelectedRow,
}) => {
  const { deleteItem, loading, setLoading } = useSupplementaryInsuranceDelete();

  const history = useHistory();
  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const tableDate = useDateFilterTable();
  const tableSelect = useTableSelectSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const [list, setList] = useState(data);
  ////
  const location = useLocation();
  const isMobile = useIsMobile();
  const checkAccess = useCheckAccess();

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

  const handleView = (id) => {
    detailView(id);
  };

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
    { name: "مشاهده", onClick: (record) => handleView(record.id) },
    {
      name: "لیست افراد",
      onClick: (record) =>
        history.push(
          getLink(pageNames.personnel.insurance.supplymentary.personnel.list, {
            id: record.id,
          })
        ),
    },
    {
      name: "ویرایش",
      onClick: (record) =>
        history.push(
          getLink(pageNames.personnel.insurance.supplymentary.edit, record.id)
        ),
      hide: (record) =>
        record.approved || !checkAccess([permissions.ENVIRONMENT_EDIT]),
    },
    {
      name: "حذف",
      onClick: (record) => handleDeleteById(record.id),
      hide: (record) =>
        record.approved || !checkAccess([permissions.ENVIRONMENT_DELETE]),
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
          selected={selectedRow}
          onSelectedChange={setSelectedRow}
          itemActions={mobileItemActions}
          showFilters={true}
          columns={renderColumns(
            handleView,
            data,
            history,
            handleDeleteById,
            tableSearch,
            tableDate,
            tableSelect,
            updateList,
            setLoading,
            qs.parse(location.search),
            checkAccess
          )}
          titleKeys={["insurer_main"]}
          initialData={data}
          setData={setList}
          rowKey={(record) => record.id}
          rowSelection={{ ...rowSelection }}
          rowClassName={rowClassName}
          footer={selectedRow.length > 0 && deleteGroup}
          scrollX={1200}
          onChange={handleTableChange}
        />
      </Spin>
    </div>
  );
};

export default Table;
