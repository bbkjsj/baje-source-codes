import { Table as AntTable, Popconfirm, Button, Spin, Modal } from "antd";
import React, { useState, useContext, useEffect } from "react";
import { renderColumns } from "./table/renderColumns";
import { useHistory, useLocation } from "react-router-dom";
import { useAccidentInsuranceDelete } from "../util/hooks";
import { AccidentInsuranceContext } from "../../AccidentInsurance/util/AccidentInsuranceContext";
import AppTable from "components/general/AppTable";
import useTableSearch from "hooks/useTableSearch";
import useDateFilterTable from "hooks/useDateFilterTable";
import useTableSelectSearch from "hooks/useTableSelectSearch";
import qs from "query-string";
import MobileList from "components/mobileList/MobileList";
import { pageNames } from "constant";
import { getLink } from "_helpers";
import ResponsiveList from "components/general/ResponsiveList";

const Table = ({ data, updateList, rowSelection, selectedRow }) => {
  const { deleteItem, loading } = useAccidentInsuranceDelete();
  const accidentInsuranceContext = useContext(AccidentInsuranceContext);
  const { setInsurance, setInsuranceId } = accidentInsuranceContext;
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
    {
      name: "ویرایش",
      onClick: (record) =>
        history.push(
          getLink(pageNames.personnel.insurance.accident.edit, record.id)
        ),
    },
    {
      name: "حذف",
      onClick: (record) =>
        Modal.confirm({
          onOk: () => handleDeleteById([record.id]),
          content: "آیا از حذف این مورد اطمینان دارید؟",
        }),
      // hide: handleRowStatus(record.personnel_count, record.status, "remove"),
    },
    {
      name: "لیست افراد",
      onClick: (record) => {
        setInsurance(record);
        setInsuranceId(record.id);
        localStorage.setItem("record", JSON.stringify(record));
        history.push(
          getLink(pageNames.personnel.insurance.accident.personnel.list, {
            id: record.id,
          })
        );
      },
    },
  ];

  return (
    <div>
      <Spin spinning={loading}>
        <ResponsiveList
          rowKey={(record) => record.id}
          columns={renderColumns(
            data,
            history,
            handleDeleteById,
            setInsurance,
            setInsuranceId,
            tableSearch,
            tableDate,
            tableSelect,
            qs.parse(location.search)
          )}
          dataSource={list}
          rowSelection={{ ...rowSelection }}
          footer={selectedRow.length > 0 && deleteGroup}
          scrollX={1200}
          pagination={tableInfo.pagination}
          onChange={handleTableChange}
          tableInfo={tableInfo}
          setTableInfo={setTableInfo}
          filterMode="client"
          itemActions={mobileItemActions}
          showFilters={true}
          viewLink={(record) =>
            getLink(pageNames.personnel.insurance.accident.view, record.id)
          }
          titleKeys={["insurer_main"]}
          initialData={data}
          setData={setList}
        />
      </Spin>
    </div>
  );
};

export default Table;
