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
import ListActions from "components/general/ListActions";
import AppTable from "components/general/AppTable";
import ContentTop from "components/general/ContentTop";
import { FileAddOutlined } from "@ant-design/icons";
import useTableSearch from "hooks/useTableSearch";
import useDateFilterTable from "hooks/useDateFilterTable";
import useTableSelectSearch from "hooks/useTableSelectSearch";
import { pageNames } from "constant";
import { useSelector } from "react-redux";
import qs from "query-string";
import { getLink } from "_helpers";
import ResponsiveList from "components/general/ResponsiveList";

const ServiceList = () => {
  const [listLoading, setListLoading] = useState(true);
  const [list, setList] = useState([]);
  const [initialList, setInitialList] = useState([]);
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
  const tableDateFilterTable = useDateFilterTable();
  const tableSelect = useTableSelectSearch({
    saveParams: true,
    filterMultiple: true,
  });

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
      url: pageNames.personnel.realPerson.service.add,
      label: "ثبت خدمت/خسارت",
      id: "newService",
      variant: "primary",
      icon: <FileAddOutlined />,
    },
  ];

  const getList = (type = fields.itemTypes.DAMAGE) => {
    setListLoading(true);

    axios
      .get(
        `/api/v1/baje/damage-service/list/${type}/${currentOffice}/${currentContract}`
      )
      .then((res) => {
        setListLoading(false);
        setDeleteLoading(false);
        setList(res?.data?.list);
        setInitialList(res?.data?.list);
      })
      .catch((err) => {
        setListLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    getList();

    setListLoading(true);
    setActiveTab("damagesTab");
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
      key === "damagesTab" ? fields.itemTypes.DAMAGE : fields.itemTypes.SERVICE
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
      notMarginTop={true}
      rowKey={(record) => record.id}
      className={Styles.tableStripedSows}
      columns={columns(
        history,
        list,
        tableSearch,
        tableDateFilterTable,
        tableSelect,
        qs.parse(location.search)
      )}
      dataSource={list}
      rowSelection={{ ...rowSelection }}
      pagination={tableInfo?.pagination}
      tableInfo={tableInfo}
      setTableInfo={setTableInfo}
      filterMode="client"
      showFilters={true}
      titleKeys={["first_name", "last_name"]}
      initialData={initialList}
      setData={setList}
      size="small"
      scroll={{ y: 600, x: true }}
      bordered={true}
      onChange={handleTableChange}
    />
  );

  return (
    <>
      <ContentTop noBack title="خدمات و خسارات" />

      <div className="w-100 flex-wrap align-center mg-btm-15">
        <MenuInlineBtn list={menuBtnList} />
        <ListActions
          className="mr-md-auto mt-3 mt-lg-0"
          noPrint
          noFilter
          noSort
          noExcel
        />
      </div>

      <Spin spinning={deleteLoading}>
        <div className="card-container">
          <Tabs activeKey={activeTab} onTabClick={handleOnTabClick} type="card">
            <Tabs.TabPane tab="خسارات" key="damagesTab">
              {dataTable}
            </Tabs.TabPane>
            <Tabs.TabPane tab="خدمات" key="servicesTab">
              {dataTable}
            </Tabs.TabPane>
          </Tabs>
        </div>
      </Spin>
    </>
  );
};

export default ServiceList;
