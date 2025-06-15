import { Input, message, Select, Space, Spin, Table } from "antd";
import AppButton from "components/general/AppButton";
import React, { useState, useEffect, useRef } from "react";
import axios from "api/appAxios";
import AppTable from "../general/AppTable";
import getColumns from "./columns";
import qs from "query-string";
import { useLocation, useHistory } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import useIsMobile from "hooks/useIsMobile";
import MobileList from "pages/persons/realPerson/list/MobileList/MobileList";

const GeneralInputSearchModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const location = useLocation();
  let tableDataTimeout = useRef(0);
  let timeout = useRef(0);
  const history = useHistory();
  const isMobile = useIsMobile();

  const [tableInfo, setTableInfo] = useState({
    pagination: {
      current: 1,
      pageSize: window.localStorage.getItem("table_page_size") || 20,
    },
    filters: {},
  });

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }

    timeout.current = setTimeout(() => {
      if (!tableInfo?.silentUpdate) {
        if (tableInfo.filters && Object.keys(tableInfo.filters).length) {
          for (let key in tableInfo.filters) {
            if (tableInfo.filters[key].length >= 3) {
              getList();
              break;
            }
          }
        } else {
          getList();
        }
      }
    }, 500);

    return () => {
      new AbortController().abort();
    };
  }, [tableInfo]);

  ///////////////////////////////////////////////

  //Add filter, sort and pagination params to url
  const addParamsToUrl = (url, paginate = true, manualPage, manualSort) => {
    let paramString = "";

    //Page
    if (paginate) {
      const currPage = manualPage
        ? manualPage
        : tableInfo?.pagination?.current || 1;
      const pageSize =
        tableInfo?.pagination?.pageSize ||
        window.localStorage.getItem("table_page_size") ||
        20;

      // if (!tableInfo?.filters || !Object.entries(tableInfo?.filters).length) {
      paramString += `page=${currPage}&size=${pageSize}`;
      // } else {
      //   paramString += `page=1&size=${pageSize}`;
      // }
    }

    //Filters
    // add multiple filters to url
    if (tableInfo?.filters && Object.keys(tableInfo?.filters).length) {
      for (let filterKey in tableInfo.filters) {
        paramString += `&${filterKey}=${tableInfo.filters[filterKey]}`;
      }
    }

    url += "?" + paramString;
    return url;
  };

  const handleOnTableChange = (
    pagination,
    filters,
    { currentDataSource, action }
  ) => {
    clearTimeout(tableDataTimeout.current);
    setLoading(true);

    //Rate limit on table filter
    tableDataTimeout.current = setTimeout(
      () => {
        //Reset current page on filter or sort
        if (action === "sort")
          pagination = {
            ...pagination,
            current: 1,
          };

        //Trigger changes on table info
        setTableInfo((curr) => ({
          pagination,
          filters: curr.filters,
        }));
      },
      action === "filter" ? 1000 : 0
    );

    //Limit num of active table filters to 1
    // needs to change due to backend update
    const filtersToDisable = [];
    const filterArray = Object.entries(filters);
    const activeFilter = filterArray.find(
      ([key, value]) => value !== null
    )?.[0];

    if (activeFilter)
      filterArray.forEach(([key, value]) => {
        if (key !== activeFilter) filtersToDisable.push(key);
      });
  };

  const getList = (reset) => {
    if (!rows?.length) setLoading(true);

    const searchParams = qs.parse(location.search);

    let url;

    if (reset) {
      url = addParamsToUrl(`/api/v1/baje/personnel/list/${-1}/${-1}`, true, 1);
    } else {
      url = addParamsToUrl(
        `/api/v1/baje/personnel/list/${-1}/${-1}`,
        true,
        false,
        searchParams.sort && searchParams.sort_order
          ? { field: searchParams.sort, order: searchParams.sort_order }
          : false
      );
    }

    axios
      .get(url)
      .then((res) => {
        setRows(res.data.list);

        setLoading(false);

        setTableInfo((state) => ({
          ...state,
          pagination: {
            ...state?.pagination,
            total: res.data.total,
          },
          silentUpdate: true,
        }));
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  function handleChoose(national_number) {
    if (national_number) {
      props.onConfirm(national_number);
      props.onCancel();
      setRows([]);
      setTableInfo((state) => ({
        ...state,
        sorter: null,
        filters: {},
        pagination: {
          current: 1,
          pageSize: window.localStorage.getItem("table_page_size") || 20,
        },
      }));

      const queryParams = qs.parse(location.search);

      // delete all queryParams
      for (let key in queryParams) {
        delete queryParams[key];
      }

      history.replace({ search: qs.stringify(queryParams) });
    }
  }

  const handleMobilePageChange = (page, pageSize) => {
    setTableInfo((state) => ({
      ...state,
      pagination: { ...state.pagination, current: page, pageSize },
      silentUpdate: false,
    }));

    if (tableInfo.pagination.current !== page) {
      const queryParams = qs.parse(location.search);
      queryParams.page = page;
      history.replace({ search: qs.stringify(queryParams) });
    }
  };

  ////////////////////////////////////////////////

  return (
    <div className="nids-modal">
      <div className="flex flex-grow-1">
        {!isMobile && (
          <p className="text-12">
            برای نمایش نتایج جستجو حداقل سه کاراکتر وارد، و یا از دکمه جستجو
            استفاده نمایید:
          </p>
        )}
        {!isMobile && (
          <AppButton
            variant="primary"
            onClick={getList}
            className="mr-auto"
            title="جستجو"
          >
            <SearchOutlined className="text-18" />
          </AppButton>
        )}
      </div>

      <Spin spinning={loading}>
        {isMobile ? (
          <MobileList
            dataSource={rows}
            pagination={tableInfo?.pagination}
            onPageChange={handleMobilePageChange}
            tableInfo={tableInfo}
            setTableInfo={setTableInfo}
            filterIcon={<SearchOutlined />}
            noActions
            onChoose={handleChoose}
          />
        ) : (
          <AppTable
            rowKey={(record) => record.id}
            columns={getColumns({ tableInfo, setTableInfo })}
            dataSource={rows}
            scrollX={1}
            onChange={handleOnTableChange}
            pagination={tableInfo?.pagination}
            rowClassName="pointer"
            onRow={(record) => ({
              onClick: () => {
                handleChoose(record.national_number);
              },
            })}
          />
        )}
        <Space>
          <AppButton
            className="big-btn mt-3"
            size="large"
            variant="text"
            onClick={() => props.onCancel()}
          >
            بستن
          </AppButton>
        </Space>
      </Spin>
    </div>
  );
};

export default GeneralInputSearchModal;
