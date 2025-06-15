import { Table, Popconfirm, Button, Spin, Modal } from "antd";
import React, { useState, useEffect } from "react";
import { renderColumns } from "./accidentReportTable/renderColumns";
import { useHistory, useLocation } from "react-router-dom";
import { useDeleteAccidentReport } from "../utils/hooks";
import AppTable from "components/general/AppTable";
import useTableSearch from "hooks/useTableSearch";
import useTableSelectSearch from "hooks/useTableSelectSearch";
import useDateFilterTable from "hooks/useDateFilterTable";
import qs from "query-string";
import useIsMobile from "hooks/useIsMobile";
import MobileList from "components/mobileList/MobileList";
import { pageNames } from "constant";
import { getLink } from "_helpers";
import ResponsiveList from "./../../../../components/general/ResponsiveList";

const AccidentReportTable = ({ data }) => {
  const [selectedRow, setSleetedRow] = useState([]);
  const { deleteItem, loading } = useDeleteAccidentReport();
  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const tableSelectSearch = useTableSelectSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const tableDateFilter = useDateFilterTable();
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

  const history = useHistory();
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSleetedRow(selectedRowKeys);
    },
  };

  useEffect(() => {
    setList(data);
  }, [data]);

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
          getLink(pageNames.personnel.realPerson.accidentReport.edit, record.id)
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
            deleteItem,
            tableSearch,
            tableSelectSearch,
            tableDateFilter,
            qs.parse(location.search)
          )}
          viewLink={(record) =>
            getLink(
              pageNames.personnel.realPerson.accidentReport.view,
              record.id
            )
          }
          titleKeys={["location"]}
          initialData={data}
          setData={setList}
          rowKey={(record) => record.id}
          size="small"
          bordered={true}
          rowSelection={{ ...rowSelection }}
          footer={selectedRow.length > 0 && deleteGroup}
          onChange={handleTableChange}
        />
      </Spin>
    </div>
  );
};

export default AccidentReportTable;
