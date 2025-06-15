import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button, message, Popconfirm, Spin } from "antd";
import AppTable from "components/general/AppTable";
import GoBackBtn from "components/GoBackBtn";
import axios from "api/appAxios";
import useCheckAccess from "hooks/useCheckAccess";
import { LayoutContext } from "contex/Layout-context";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import { columns } from "./callList/tableColumns";
import * as api from "./utils/api";
import ContentTop from "components/general/ContentTop";
import { PlusOutlined } from "@ant-design/icons";
import useTableSearch from "hooks/useTableSearch";
import useDateFilterTable from "hooks/useDateFilterTable";
import CallChartModal from "./callChart/CallChartModal";
import { pageNames } from "constant";
import qs from "query-string";
import { getLink } from "_helpers";
import ResponsiveList from "components/general/ResponsiveList";

const CallList = (props) => {
  const [listLoading, setListLoading] = useState(true);
  const [list, setList] = useState([]);
  const [initialList, setInitialList] = useState();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const history = useHistory();
  const checkAccess = useCheckAccess();
  const layoutContext = useContext(LayoutContext);
  const pageId = props.match.params.id;
  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const tableDate = useDateFilterTable();
  const [CallChart, setCallChart] = useState(false);
  const [currentCall, setCurrentCall] = useState(null);

  const location = useLocation();

  const searchParams = qs.parse(location.search);

  const [tableInfo, setTableInfo] = useState({
    pagination: {
      current: searchParams.page ? +searchParams.page : 1,
      defaultPageSize: 20,
    },
  });

  const menuBtnList = [
    {
      label: "افزودن فراخوان جدید",
      id: "newCall",
      url: pageNames.suggest.call.add,
      variant: "primary",
      icon: <PlusOutlined />,
    },
  ];

  useEffect(() => {
    (async function () {
      setListLoading(true);
      await getList();
    })();
  }, []);

  const getList = async () => {
    setListLoading(true);

    try {
      const res = pageId
        ? await api._GET_BY_COMMITTEE(pageId)
        : await api._GET();

      setListLoading(false);
      setDeleteLoading(false);
      setList(res.data);
      setInitialList(res.data);
    } catch (error) {
      setListLoading(false);
      console.log(error);
    }
  };

  const footer = () => (
    <Popconfirm
      placement="leftTop"
      title={"آیا برای حذف اطمینان دارید ؟"}
      onConfirm={() => deleteItems(selectedRows)}
      okText="بله"
      cancelText="خیر"
    >
      <Button type="danger">حذف</Button>
    </Popconfirm>
  );

  const deleteItems = async (items) => {
    if (!Array.isArray(items)) items = [items];

    try {
      await api._DELETE(items);

      await getList();
      message.success("آیتم مورد نظر پاک شد");
    } catch (error) {
      message.error(error.data);
      setDeleteLoading(false);
    }
  };

  if (listLoading) {
    return <LogoLoading />;
  }

  const handleOnChangeTablePage = (page) => {
    layoutContext.setTablePage(page);
  };

  const rowSelection = {
    type: "checkbox",
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: false,
    }),
  };

  const onReport = (id) => {
    setCurrentCall(id);
    setCallChart(true);
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
        history.push(getLink(pageNames.suggest.call.edit, record.id)),
    },
    {
      name: "حذف",
      onClick: (record) => deleteItems(record.id),
    },
  ];

  return (
    <>
      <div>
        <ContentTop
          noBack
          title="مدیریت فراخوان های پیشنهاد"
          className="mt-3"
          breadcrumbItems={[{ text: "نظام پیشنهادات" }]}
        />

        <div className="w-100 flex-wrap align-center mb-3">
          <MenuInlineBtn list={menuBtnList} />
        </div>

        <Spin spinning={deleteLoading}>
          <div className="card-container">
            <ResponsiveList
              rowKey={(record) => record.id}
              size="small"
              scroll={{ y: 600, x: true }}
              onRow={() => false}
              columns={columns({
                list,
                history,
                deleteHandler: deleteItems,
                tableSearch,
                tableDate,
                onReport,
                searchParams: qs.parse(location.search),
              })}
              dataSource={list}
              bordered={true}
              rowSelection={{ ...rowSelection }}
              footer={!!selectedRows.length && footer}
              pagination={tableInfo.pagination}
              onChange={handleTableChange}
              tableInfo={tableInfo}
              setTableInfo={setTableInfo}
              filterMode="client"
              itemActions={mobileItemActions}
              showFilters={true}
              titleKeys={["subject"]}
              initialData={initialList}
              setData={setList}
            />
          </div>
        </Spin>
      </div>

      <CallChartModal
        status={CallChart}
        close={() => setCallChart(false)}
        callId={currentCall}
      />
    </>
  );
};

export default CallList;
