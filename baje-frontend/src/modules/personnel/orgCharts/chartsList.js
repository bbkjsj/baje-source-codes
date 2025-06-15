import React, { useEffect, useRef, useState } from "react";
import { Spin, Modal } from "antd";
import GoBackBtn from "components/GoBackBtn";

import { useHistory, useParams } from "react-router-dom";
import { UserContext } from "contex/User-context";
import useCheckAccess from "hooks/useCheckAccess";
import { LayoutContext } from "contex/Layout-context";
import LogoLoading from "components/general/LoadingLogo";
import Styles from "pages/persons/realPerson/list/realPerson.module.css";
import MenuInlineBtn from "components/MenuInlineBtn";
import routes from "modules/personnel/routes";
import Table from "./common/Table";
import ContentTop from "components/general/ContentTop";
import { PlusOutlined } from "@ant-design/icons";
import { getLink } from "_helpers";
import { cloneChart, getChartsList } from "./common/api";
import { handleExceptions, handleSuccess } from "../jobs/common/api";
import api from "api/appAxios";

const ChartsList = (props) => {
  const [listLoading, setListLoading] = useState(false);
  const params = useParams();
  const [list, setList] = useState([]);
  const [selectedRow, setSleetedRow] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  let tableDataTimeout = useRef(0);
  const [tableInfo, setTableInfo] = useState({
    pagination: {
      current: 1,
      pageSize: window.localStorage.getItem("table_page_size") || 20,
    },
  });

  const menuBtnList = [
    {
      url: getLink(routes.PERSONNEL_JOBS_CHARTS_ADD, { id: params.id }),
      label: "چارت جدید",
      id: "newChart",
      variant: "primary",
      icon: <PlusOutlined />,
    },
    {
      label: "کپی چارت",
      id: "copyChart",
      handleClick: () => cloneTheChart(selectedRow[0]),
      disabled: selectedRow.length !== 1,
    },
  ];

  const addParamsToUrl = (url) => {
    let paramString = "";

    //Sort
    if (tableInfo?.sorter?.column)
      paramString += `&order_column=${tableInfo?.sorter.field}&order_dir=${
        tableInfo?.sorter.order === "ascend" ? "asc" : "desc"
      }`;

    //Filters
    if (tableInfo?.filters) {
      Object.entries(tableInfo?.filters).forEach(([key, value]) => {
        if (value !== null) {
          paramString += `&${key}=${value[0]}`;
        }
      });

      // if (activeFilter)
      //   paramString += `&filter=${activeFilter[0]}&fvalue=${
      //     Array.isArray(activeFilter[1]) ? activeFilter[1][0] : activeFilter[1]
      //   }`;
    }

    //Page
    const currPage = tableInfo?.pagination?.current || 1;
    const pageSize =
      tableInfo?.pagination?.pageSize ||
      window.localStorage.getItem("table_page_size") ||
      20;

    paramString += `&page=${currPage}&size=${pageSize}`;

    url += `?company_id=${params.id}` + paramString;
    return url;
  };

  const getList = async () => {
    try {
      setListLoading(true);

      const res = await getChartsList();

      setListLoading(false);
      setDeleteLoading(false);

      if (res.data.length) {
        const thisCompanyCharts = res.data.filter(
          (i) => i.company_id_fk == params.id
        );

        if (thisCompanyCharts.length) setList(thisCompanyCharts);
      }

      // setTableInfo({
      //   ...tableInfo,
      //   pagination: {
      //     ...tableInfo?.pagination,
      //     total: res.data.data.pagination.total,
      //   },
      //   silentUpdate: true,
      // });
    } catch (err) {
      setListLoading(false);
      handleExceptions(err);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  // useEffect(() => {
  //   if (!tableInfo?.silentUpdate) getList();
  // }, [tableInfo]);

  const cloneTheChart = (id) => {
    Modal.confirm({
      title: "کپی چارت",
      content: "آیا از کپی چارت اطمینان دارید؟",
      okText: "بله",
      cancelText: "خیر",
      centered: true,
      closable: true,
      onOk: () => {
        setListLoading(true);
        cloneChart(id)
          .then((res) => {
            setListLoading(false);
            handleSuccess(res);
          })
          .catch((err) => {
            setListLoading(false);
            handleExceptions(err);
          });
      },
    });
  };

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSleetedRow(selectedRowKeys);
    },
  };

  const handleOnTableChange = (
    pagination,
    filters,
    sorter,
    { currentDataSource, action }
  ) => {
    clearTimeout(tableDataTimeout.current);
    setListLoading(true);

    //Rate limit on table filter
    tableDataTimeout.current = setTimeout(
      () => {
        //Reset current page on filter or sort
        if (action !== "paginate")
          pagination = {
            ...pagination,
            current: 1,
          };

        //Trigger changes on table info
        setTableInfo({
          pagination,
          filters,
          sorter,
        });
      },
      action === "filter" ? 1000 : 0
    );

    //Limit num of active table filters to 1
    // const filtersToDisable = [];
    // const filterArray = Object.entries(filters);
    // const activeFilter = filterArray.find(
    //   ([key, value]) => value !== null
    // )?.[0];

    // if (activeFilter)
    //   filterArray.forEach(([key, value]) => {
    //     if (key !== activeFilter) filtersToDisable.push(key);
    //   });

    //This state is passed to table columns
    //setDisabledFilters(filtersToDisable);
  };

  return (
    <div>
      <GoBackBtn />

      <ContentTop
        title="چارت سازمانی"
        className="mt-3"
        breadcrumbItems={[
          { text: "منابع انسانی" },
          { text: "افراد حقوقی" },
          { text: "لیست افراد", link: routes.PERSONNEL_RIGHTFUL_LIST },
        ]}
      />
      <div className="w-100 flex-wrap align-center mb-3">
        <MenuInlineBtn list={menuBtnList} />
      </div>

      <Spin spinning={deleteLoading}>
        <div className="card-container">
          <Table
            data={list}
            updateList={getList}
            selectedRow={selectedRow}
            rowSelection={rowSelection}
            setLoadingList={setListLoading}
            //handleOnTableChange={handleOnTableChange}
            //pagination={tableInfo?.pagination}
            loading={listLoading}
            setSelected={setSleetedRow}
          />
        </div>
      </Spin>
    </div>
  );
};

export default ChartsList;
