import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button, message, Modal, Popconfirm, Spin, Table } from "antd";
import AppTable from "components/general/AppTable";
import GoBackBtn from "components/GoBackBtn";
import axios from "api/appAxios";
import useCheckAccess from "hooks/useCheckAccess";
import { LayoutContext } from "contex/Layout-context";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import { columns } from "./assessmentCriteriaList/tableColumns";
import * as api from "./utils/api";
import * as committeeApi from "../committee/utils/api";
import { PlusOutlined } from "@ant-design/icons";
import ContentTop from "components/general/ContentTop";
import useTableSearch from "hooks/useTableSearch";
import Text from "antd/lib/typography/Text";
import { roundNumberTwoDecimals } from "_helpers";
import useTableSelectSearch from "hooks/useTableSelectSearch";
import useRangeFilter from "hooks/useRangeFilter";
import { isCommitteeMemberActive } from "../committee/utils/tools";
import { pageNames } from "constant";
import qs from "query-string";
import { getLink } from "_helpers";
import ResponsiveList from "components/general/ResponsiveList";

const AssessmentCriteriaList = (props) => {
  const [listLoading, setListLoading] = useState(true);
  const [list, setList] = useState([]);
  const [initialList, setInitialList] = useState();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [totalInfo, setTotalInfo] = useState(true);
  const [committeeData, setCommitteeData] = useState({});
  const history = useHistory();
  const checkAccess = useCheckAccess();
  const layoutContext = useContext(LayoutContext);
  const pageId = props.match.params.id && parseInt(props.match.params.id);
  const tableSearch = useTableSearch();
  const tableSelect = useTableSelectSearch();
  const rangeFilter = useRangeFilter();

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
      label: "افزودن معیار بررسی جدید",
      id: "newCriteria",
      variant: "primary",
      icon: <PlusOutlined />,
      url:
        pageNames.suggest.assessmentCriteria.add +
        "?committee_id=" +
        (pageId || 0),
    },
  ];

  useEffect(() => {
    (async function () {
      await getList();
      const total = await api._GET_TOTAL_INFO(pageId);

      if (total.data) {
        setTotalInfo(total.data);

        const res = await committeeApi._GET_ITEM(pageId);
        setCommitteeData(res.data);
      }
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
      message.error("دریافت اطلاعات لیست با مشکل روبرو شد");
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

  const checkDependencies = async (items) => {
    if (!Array.isArray(items)) items = [items];
    let allPromise = [];

    //check dependency for each selected item
    items.forEach((item) => {
      allPromise.push(
        new Promise(async (resolve, reject) => {
          try {
            const res = await api._CHECK_SUGGESTION_DEPENDENCY(item);
            resolve(res.data === true);
          } catch (error) {
            reject();
          }
        })
      );
    });

    try {
      const values = await Promise.all(allPromise);
      return values.includes(true);
    } catch (error) {
      return null;
    }
  };

  const deleteItems = async (items) => {
    if (!Array.isArray(items)) items = [items];
    setDeleteLoading(true);

    try {
      //check for dependency
      const hasDependency = await checkDependencies(items);
      setDeleteLoading(false);

      //delete if there is no dependency
      if (hasDependency === true) {
        Modal.warn({
          title: "وابستگی به پیشنهادات",
          content:
            "ملاک / ملاک های مورد نظر، در ارزیابی یک پیشنهاد مورد استفاده قرار گرفته اند و امکان حذف آنها وجود ندارد",
        });

        return false;
      } else if (hasDependency === false) {
        await api._DELETE(items);
        await getList();

        message.success("آیتم مورد نظر پاک شد");
      } else {
        message.error("بررسی وابستگی ملاک با مشکل روبرو شد");
      }
    } catch (error) {
      message.error(error.data);
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

  const getPageTitle = () => {
    let title = "مدیریت معیارهای بررسی پیشنهاد";

    if (committeeData?.name) title += " - " + committeeData.name;

    return title;
  };

  const totalFooter = () => (
    <div className="flex px-4">
      <h4>مجموع امتیازات: {roundNumberTwoDecimals(totalInfo.total)}</h4>
      <h4 className="mr-5">
        ضریب تعدیل: {roundNumberTwoDecimals(totalInfo.tadil)}
      </h4>
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

  return (
    <div>
      <GoBackBtn />
      <ContentTop
        title={getPageTitle()}
        className="mt-3"
        breadcrumbItems={[{ text: "نظام پیشنهادات" }]}
      />

      <div className="w-100 flex-wrap align-center mb-3">
        <MenuInlineBtn list={menuBtnList} />
      </div>

      <Spin spinning={deleteLoading}>
        <div className="card-container">
          <ResponsiveList
            pagination={{
              defaultCurrent: layoutContext.tablePage,
              defaultPageSize: 20,
              onChange: handleOnChangeTablePage,
            }}
            rowKey={(record) => record.id}
            size="small"
            scroll={{ y: 600, x: true }}
            columns={columns({
              list,
              history,
              deleteHandler: deleteItems,
              tableSearch,
              tableSelect,
              rangeFilter,
              pageId,
              searchParams: qs.parse(location.search),
            })}
            dataSource={list}
            bordered={true}
            rowSelection={{ ...rowSelection }}
            footer={
              !!selectedRows.length
                ? footer
                : totalInfo && totalInfo.total && totalInfo.tadil
                ? totalFooter
                : null
            }
            rowClassName={(record, index) => {
              return !record.is_enabled ? "bg-error" : null;
            }}
            onRow={() => false}
            onChange={handleTableChange}
            tableInfo={tableInfo}
            setTableInfo={setTableInfo}
            filterMode="client"
            //itemActions={mobileItemActions}
            showFilters={true}
            titleKeys={["name"]}
            initialData={initialList}
            setData={setList}
          />
        </div>
      </Spin>
    </div>
  );
};

export default AssessmentCriteriaList;
