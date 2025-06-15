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
import MobileList from "components/mobileList/MobileList";
import { pageNames } from "constant";
import { getLink } from "_helpers";
import ResponsiveList from "components/general/ResponsiveList";

const Table = ({
  data,
  updateList,
  selectedRow,
  rowSelection,
  setLoadingList,
  onEdit,
  insuranceID,
  onClickAddSubordiante,
  displayAddPerson,
  selected,
  setSelectedRow,
  setSelectedRowInfo,
  handleTableChange,
  tableInfo,
  setTableInfo,
  disabledFilters,
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

  useEffect(() => {
    setList(data);
  }, [data]);

  let loading2 = loading || loading1;

  const handleDelete = () => {
    // console.log(selectedRow, data, "!need to update");
    const mainIDs = [];
    const subIDs = [];
    selectedRow.forEach((el) => {
      data.forEach((item) => {
        if (el == item.id) {
          item.relation ? subIDs.push(el) : mainIDs.push(el);
        }
      });
    });

    // console.log(mainIDs, "!mainids");
    // console.log(subIDs, "!subids");
    deleteItem(subIDs, updateList, "kinda relation");
    Promise.all([
      deleteItem(subIDs, updateList, "kinda relation"),
      deleteItem(mainIDs, updateList, ""),
    ]);
  };

  const handleCOnfirm = () => {
    approveItem(selectedRow, updateList);
  };

  const handleDeleteById = (ids, relation) => {
    deleteItem(ids, updateList, relation);
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

  const mobileItemActions = [
    {
      name: "ویرایش",
      onClick: (record) => onEdit(record),
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
    {
      name: "مشاهده سوابق",
      onClick: (record) => {
        history.push(
          getLink(
            pageNames.personnel.insurance.supplymentary.personnel.history,
            {
              id: record.main_id,
              personName: record.main_name,
            }
          )
        );
      },

      hide: (record) => !record.relation || record.relation === "main",
    },
    {
      name: "افزودن تبعی ",
      onClick: (record) => {
        onClickAddSubordiante(record);
      },

      hide: (record) =>
        !record.relation || record.relation === "main" || displayAddPerson
          ? true
          : false,
    },
  ];

  return (
    <div>
      <Spin spinning={loading2}>
        <ResponsiveList
          rowKey={(record) => record.id}
          // rowKey={(record, index) => index}
          size="small"
          scroll={{ y: 600, x: true }}
          columns={renderColumns(
            data,
            history,
            handleDeleteById,
            updateList,
            setLoadingList,
            onEdit,
            insuranceID,
            tableSearch,
            tableDate,
            tableSelect,
            onClickAddSubordiante,
            displayAddPerson,
            qs.parse(location.search),
            disabledFilters
          )}
          dataSource={list}
          bordered={true}
          rowSelection={{ ...rowSelection }}
          footer={selectedRow.length > 0 && deleteGroup}
          pagination={tableInfo.pagination}
          onChange={handleTableChange}
          tableInfo={tableInfo}
          setTableInfo={setTableInfo}
          filterMode="client"
          itemActions={mobileItemActions}
          showFilters={true}
          viewLink={(record) =>
            getLink(
              pageNames.personnel.insurance.supplymentary.personnel.history,
              {
                id: record.main_id,
                insuranceID: insuranceID,
                personName: record.main_name,
              }
            )
          }
          titleKeys={["sub_name"]}
          initialData={data}
          setData={setList}
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
        />
      </Spin>
    </div>
  );
};

export default Table;
