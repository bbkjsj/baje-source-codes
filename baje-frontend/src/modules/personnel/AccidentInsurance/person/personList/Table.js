import { Table as AntTable, Popconfirm, Button, Spin, Modal } from "antd";
import React, { useState, useContext, useEffect } from "react";
import { renderColumns } from "./table/renderColumns";
import { useHistory, useLocation } from "react-router-dom";
import { useDeletePerson, useApprovePerson } from "../util/hooks";
import AppTable from "components/general/AppTable";
import useTableSearch from "hooks/useTableSearch";
import useDateFilterTable from "hooks/useDateFilterTable";
import useTableSelectSearch from "hooks/useTableSelectSearch";
import qs from "query-string";
import { pageNames } from "constant";
import { getLink } from "_helpers";
import ResponsiveList from "components/general/ResponsiveList";

const Table = ({
  data,
  updateList,
  selectedRow,
  rowSelection,
  setLoadingList,
  setEditModal,
  insuranceID,
  setSelectedRow,
  setSelectedRowInfo,
}) => {
  const history = useHistory();
  let { loading, deleteItem } = useDeletePerson();
  let { loading1, approveItem } = useApprovePerson();
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

  let loading2 = loading || loading1;
  // console.info(loading, loading1);

  const handleDelete = () => {
    deleteItem(selectedRow, updateList);
  };

  const handleCOnfirm = () => {
    approveItem(selectedRow, updateList);
  };

  const handleDeleteById = (id) => {
    deleteItem(id, updateList);
  };

  const deleteGroup = () => (
    <div style={{ display: "flex" }}>
      <Popconfirm
        placement="leftTop"
        title={"آیا برای حذف اطمینان دارید ؟"}
        onConfirm={handleDelete}
        okText="بله"
        cancelText="خیر"
      >
        <Button style={{ marginLeft: "10px" }} type="danger">
          حذف
        </Button>
      </Popconfirm>
      <Popconfirm
        placement="leftTop"
        title={"آیا برای تایید اطمینان دارید؟"}
        onConfirm={handleCOnfirm}
        okText="بله"
        cancelText="خیر"
      >
        <Button type="primary">تایید گروهی</Button>
      </Popconfirm>
    </div>
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
      name: "ویرایش",
      onClick: (record) => setEditModal(record.id),
      hide: (record) => !record.is_approved == 1,
    },
    {
      name: "حذف",
      onClick: (record) =>
        Modal.confirm({
          onOk: () => handleDeleteById([record.id], record.relation || null),
          content: "آیا از حذف این مورد اطمینان دارید؟",
        }),
      hide: (record) => !record.is_approved == 1,
    },
  ];

  return (
    <div>
      <Spin spinning={loading2}>
        <ResponsiveList
          rowKey={(record) => record.id}
          size="small"
          scroll={{ y: 600, x: true }}
          columns={renderColumns(
            data,
            history,
            handleDeleteById,
            updateList,
            setLoadingList,
            setEditModal,
            insuranceID,
            tableSearch,
            tableDate,
            tableSelect,
            qs.parse(location.search)
          )}
          dataSource={list}
          bordered={true}
          rowSelection={{ ...rowSelection }}
          footer={selectedRow.length > 0 && deleteGroup}
          tableInfo={tableInfo}
          setTableInfo={setTableInfo}
          filterMode="client"
          itemActions={mobileItemActions}
          showFilters={true}
          titleKeys={["full_name"]}
          initialData={data}
          setData={setList}
          pagination={tableInfo.pagination}
          onChange={handleTableChange}
          selected={selectedRow}
          onSelectedChange={(selecteds) => {
            setSelectedRow(selecteds);
            const findItem = data.find((item) => item.id == selecteds[0]);
            if (findItem) {
              setSelectedRowInfo([findItem]);
            } else {
              setSelectedRowInfo([]);
            }
          }}
          viewLink={(record) =>
            getLink(pageNames.personnel.insurance.accident.personnel.history, {
              id: record.main_id,
            })
          }
        />
      </Spin>
    </div>
  );
};

export default Table;
