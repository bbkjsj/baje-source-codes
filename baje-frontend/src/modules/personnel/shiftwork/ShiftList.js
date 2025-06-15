import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { message, Spin } from "antd";
import AppTable from "components/general/AppTable";
import useCheckAccess from "hooks/useCheckAccess";
import { LayoutContext } from "contex/Layout-context";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import { columns } from "./shiftList/tableColumns";
import { PlusOutlined } from "@ant-design/icons";
import ContentTop from "components/general/ContentTop";
import useTableSearch from "hooks/useTableSearch";
import useRangeFilter from "hooks/useRangeFilter";
import useTableSelect from "hooks/useTableSelectSearch";
import axios from "api/appAxios";
import { pageNames } from "constant";
import Modal from "antd/es/modal";
import endpoints from "./../endpoints";
import * as api from "./utils/api";
import qs from "query-string";
import ResponsiveList from "components/general/ResponsiveList";
import { getLink } from "_helpers";

const ShiftList = (props) => {
  const [listLoading, setListLoading] = useState(true);
  const [list, setList] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const history = useHistory();
  const checkAccess = useCheckAccess();
  const layoutContext = useContext(LayoutContext);
  const tableSearch = useTableSearch();
  const rangeFilter = useRangeFilter();
  const tableSelect = useTableSelect();
  const [updateLoading, setUpdateLoading] = useState(false);
  let tableDataTimeout = useRef(0);
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
      label: "شیفت جدید",
      id: "newShift",
      url: pageNames.personnel.shiftWork.add,
      variant: "primary",
      icon: <PlusOutlined />,
    },
  ];

  const addParamsToUrl = (url) => {
    let paramString = "";

    //Sort
    if (tableInfo?.sorter?.column)
      paramString += `order_column=${tableInfo?.sorter.field}&order_dir=${
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

    url += "?" + paramString;
    return url;
  };

  // useEffect(() => {
  //   getList();
  // }, []);

  // handle page change
  useEffect(() => {
    if (!tableInfo?.silentUpdate) getList();
  }, [tableInfo]);

  const getList = () => {
    setListLoading(true);

    axios
      .get(addParamsToUrl(endpoints.shiftWork.get))
      .then((res) => {
        setListLoading(false);
        setDeleteLoading(false);
        setList(res.data);

        // setTableInfo({
        //   ...tableInfo,
        //   pagination: {
        //     ...tableInfo?.pagination,
        //     total: res.data.total,
        //   },
        //   silentUpdate: true,
        // });
      })
      .catch((err) => {
        setListLoading(false);
      });
  };

  const deleteItems = (id) => {
    const dataItem = list.find((item) => item?.id === id);

    if (dataItem) {
      api
        ._DELETE(id)
        .then((res) => {
          getList();
          message.success("آیتم مورد نظر پاک شد");
        })
        .catch((err) => {
          const errorMessage =
            err.response?.data?.errors?.shift?.[0] ||
            "حذف گزینه مورد نظر در حال حاضر با مشکل روبرو میباشد";
          message.error(errorMessage);
          setDeleteLoading(false);
        });
    }
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
        if (action !== "paginate") {
          pagination = {
            ...pagination,
            current: 1,
          };
        }

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

  const updateItemStatus = async (id, status) => {
    if (updateLoading) return;

    try {
      setUpdateLoading(true);
      const res = await api._GET_ITEM(id);
      const patterns = res.data.patterns.map((i) => ({
        days: i.days,
        status: i.status,
        from: i.from_time,
        to: i.to_time,
      }));
      const body = {
        ...res.data.shift,
        enabled: status,
        patterns,
      };

      await api._PUT(id, body);
      message.success("وضعیت شیفت بروزرسانی شد");

      setUpdateLoading(false);
      getList();
    } catch (error) {
      console.log(error);
      message.error("بروزرسانی وضعیت با مشکل روبرو شد");
      setUpdateLoading(false);
    }
  };

  const handleOnChangeTablePage = (page) => {
    layoutContext.setTablePage(page);
  };

  const mobileItemActions = [
    {
      name: "ویرایش",
      onClick: (record) =>
        history.push(getLink(pageNames.personnel.shiftWork.edit, record.id)),
      hide: (record) => !record.enabled,
    },
    {
      name: "حذف",
      onClick: (record) =>
        Modal.confirm({
          onOk: () => deleteItems(record.id),
          content: "آیا از حذف این مورد اطمینان دارید؟",
        }),
    },
  ];

  return (
    <div>
      <ContentTop
        noBack
        title="منابع انسانی"
        className="mt-3"
        breadcrumbItems={[{ text: "تنظیمات" }, { text: "شیفت کاری" }]}
      />

      <div className="w-100 flex-wrap align-center mb-3">
        <MenuInlineBtn list={menuBtnList} />
      </div>

      <Spin spinning={deleteLoading}>
        <div className="card-container">
          <ResponsiveList
            rowKey={(record) => record.id}
            onRow={() => false}
            columns={columns({
              list,
              history,
              deleteHandler: deleteItems,
              tableSearch,
              rangeFilter,
              updateItemStatus,
              selectSearch: tableSelect,
              searchParams: qs.parse(location.search),
            })}
            dataSource={list}
            loading={updateLoading || listLoading}
            //onChange={handleOnTableChange}
            pagination={{ defaultPageSize: 20 }}
            tableInfo={tableInfo}
            setTableInfo={setTableInfo}
            filterMode="server"
            itemActions={mobileItemActions}
            showFilters={true}
            titleKeys={["title"]}
          />
        </div>
      </Spin>
    </div>
  );
};

export default ShiftList;
