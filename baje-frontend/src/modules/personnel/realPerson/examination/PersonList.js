import React, { useContext, useEffect, useState } from "react";
import { Button, message, Popconfirm, Spin, Table, Tabs } from "antd";
import GoBackBtn from "components/GoBackBtn";
import axios from "api/appAxios";
import moment from "moment-jalaali";
import { useHistory, useLocation } from "react-router-dom";
import useCheckAccess from "hooks/useCheckAccess";
import { LayoutContext } from "contex/Layout-context";
import LogoLoading from "components/general/LoadingLogo";
import Styles from "pages/persons/realPerson/list/realPerson.module.css";
import MenuInlineBtn from "components/MenuInlineBtn";
import { columns } from "./listColumns";
import * as fields from "./formItems";
import { FileAddOutlined } from "@ant-design/icons";
import ListActions from "components/general/ListActions";
import AppTable from "components/general/AppTable";
import ContentTop from "components/general/ContentTop";
import useTableSearch from "hooks/useTableSearch";
import useRangeFilter from "hooks/useRangeFilter";
import { getLink, handleClickExportExl } from "_helpers";
import { pageNames } from "constant";
import { useSelector } from "react-redux";
import qs from "query-string";
import useIsMobile from "hooks/useIsMobile";
import MobileList from "components/mobileList/MobileList";
import ResponsiveList from "./../../../../components/general/ResponsiveList";

const PersonList = () => {
  const [listLoading, setListLoading] = useState(true);
  const [list, setList] = useState([]);
  const [selectedRow, setSleetedRow] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("damagesTab");
  const history = useHistory();
  const currentOffice = useSelector((state) => state.currentOffice);
  const currentContract = useSelector((state) => state.currentContract);

  const checkAccess = useCheckAccess();
  const layoutContext = useContext(LayoutContext);
  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const rangeFilter = useRangeFilter({
    saveParams: true,
    filterMultiple: true,
  });
  const [exportKey, setExportKey] = useState();

  ////
  const location = useLocation();
  const isMobile = useIsMobile();
  const [initialList, setInitialList] = useState();

  const searchParams = qs.parse(location.search);

  const [tableInfo, setTableInfo] = useState({
    pagination: {
      current: searchParams.page ? +searchParams.page : 1,
      defaultPageSize: 20,
    },
  });

  const menuBtnList = [
    {
      url: pageNames.personnel.realPerson.examination.add,
      label: "ثبت معاینه",
      id: "newExamination",
      variant: "primary",
      icon: <FileAddOutlined />,
    },
  ];

  const visitStatusTypes = {
    NOT_VISITED: "notvisited",
    VISITED: "visited",
  };

  const tabNames = {
    VISITED: "visitedTab",
    NOT_VISITED: "notVisitedTab",
  };

  const getList = (type = visitStatusTypes.NOT_VISITED) => {
    setListLoading(true);

    axios
      .get(`/api/visit/${type}/${currentOffice || -1}/${currentContract || -1}`)
      .then((res) => {
        setListLoading(false);
        setDeleteLoading(false);
        setList(res.data);
        setInitialList(res.data);
      })
      .catch((err) => {
        setListLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    getList();

    setListLoading(true);
    setActiveTab(tabNames.NOT_VISITED);
  }, [currentOffice, currentContract]);

  if (listLoading) {
    return <LogoLoading />;
  }

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSleetedRow(selectedRowKeys);
    },
  };

  const handleOnChangeTablePage = (page) => {
    layoutContext.setTablePage(page);
  };

  const handleOnTabClick = (key) => {
    getList(
      key === tabNames.VISITED
        ? visitStatusTypes.VISITED
        : visitStatusTypes.NOT_VISITED
    );
    setActiveTab(key);
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

  const dataTable = (
    <ResponsiveList
      dataSource={list}
      pagination={tableInfo?.pagination}
      tableInfo={tableInfo}
      setTableInfo={setTableInfo}
      filterMode="client"
      showFilters={true}
      columns={columns(history, list, tableSearch, rangeFilter, searchParams)}
      viewLink={(record) =>
        getLink(
          pageNames.personnel.realPerson.examination.list,
          record.personnel_id
        )
      }
      titleKeys={["first_name", "last_name"]}
      initialData={initialList}
      setData={setList}
      notMarginTop={true}
      rowKey={(record) => record.personnel_id}
      rowSelection={{
        type: "checkbox",
        ...rowSelection,
      }}
      onChange={handleTableChange}
    />
  );

  return (
    <>
      <ContentTop noBack title="معاینات پزشکی" />

      <div className="w-100 flex-wrap align-center mg-btm-15">
        <MenuInlineBtn list={menuBtnList} />
        <ListActions
          className="mr-md-auto mt-lg-0"
          noPrint
          noFilter
          noSort
          actions={{
            excelExport: () => handleClickExportExl(exportKey),
          }}
        />
      </div>

      <Spin spinning={deleteLoading}>
        <div className="card-container">
          <Tabs activeKey={activeTab} onTabClick={handleOnTabClick} type="card">
            <Tabs.TabPane tab="معاینه نشده" key={tabNames.NOT_VISITED}>
              {dataTable}
            </Tabs.TabPane>
            <Tabs.TabPane tab="معاینه شده" key={tabNames.VISITED}>
              {dataTable}
            </Tabs.TabPane>
          </Tabs>
        </div>
      </Spin>
    </>
  );
};

export default PersonList;
