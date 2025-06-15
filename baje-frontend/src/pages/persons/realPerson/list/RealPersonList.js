import React, { useEffect, useState, useContext, useRef } from "react";
import { Popconfirm, Button, message, Spin, Tabs, Modal } from "antd";
import axios from "api/appAxios";
import { useHistory, useLocation } from "react-router-dom";
import LogoLoading from "components/general/LoadingLogo";
import { deleteRealPerson, deleteSubordinate } from "../common/_helpers";
import { columns as tableColumns } from "./columns";
import { columnsRelation } from "./columnsRelation";
import { downloadExcel, endpoint, getLink } from "_helpers";
import MenuInlineBtn from "components/MenuInlineBtn";
import { handleClickExportExl } from "_helpers";
import { permission } from "json/Permission";
import useCheckAccess from "hooks/useCheckAccess";
import { CheckAccess } from "AuxComponent/CheckAccess";
import { LayoutContext } from "contex/Layout-context";
import { UserAddOutlined } from "@ant-design/icons";
import ListActions from "components/general/ListActions";
import AppTable from "components/general/AppTable";
import ContentTop from "components/general/ContentTop";
import useTableSearch from "hooks/useTableSearch";
import InsuranceBtn from "../../../../components/general/InsuranceBtn";
import { pageNames } from "constant";
import { useSelector } from "react-redux";
import EditableTable from "./NestedTable/EditableTable";

import qs from "query-string";
import useIsMobile from "hooks/useIsMobile";
import MobileList from "./MobileList/MobileList";
import UserInfoModal from "./UserInfoModal";
import { additionalTypes } from "../constant";
import styles from "./RealPersonList.module.css";
import DropdownButton from "components/DropdownButton";
import FamilyTreeModal from "./FamilyTreeModal";

const {
  INSERT_PERSON,
  LIST_PERSON,
  VIEWSUBORDINATE_PERSON,
  EDIT_PERSON,
  DELETE_PERSON,
} = permission;

const RealPersonList = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [listLoading, setListLoading] = useState(true);
  const [list, setList] = useState([]);
  const [additionalInfoModal, setAdditionalInfoModal] = useState(null);
  const [familyModal, setFamilyModal] = useState(null);
  const [userID, setUserID] = useState(null);

  const [relationList, setRelationList] = useState();
  const [selectedRow, setSelectedRow] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [exportKey, setExportKey] = useState();
  const [exportKeyIsJson, setExportKeyIsJson] = useState();
  const [excelLoading, setExcelLoading] = useState(false);
  const [searchParamsFirst, setSearchParamsFirst] = useState(null);
  const [activeTab, setActiveTab] = useState("mainTab");
  const history = useHistory();
  const checkAccess = useCheckAccess();
  const layoutContext = useContext(LayoutContext);
  const tableSearch = useTableSearch({ saveParams: true });

  const currentOffice = useSelector((state) => state.currentOffice);
  const currentContract = useSelector((state) => state.currentContract);

  const searchQueries = qs.parse(location.search);

  const [tableInfo, setTableInfo] = useState({
    pagination: {
      current: searchQueries.page ? +searchQueries.page : 1,
      pageSize: window.localStorage.getItem("table_page_size") || 20,
    },
    filters: getInitialFilters(),
  });
  const [disabledFilters, setDisabledFilters] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  let tableDataTimeout = useRef(0);
  const firstUpdate = useRef(true);
  let timeout;
  const [selectedColumns, setSelectedColumns] = useState([]);
  const defaultColumns = [
    "number",
    "national_number",
    "first_name",
    "last_name",
    "mobile1",
    "insurance_number",
    "action",
    "status",
    "father_name",
  ];
  const expandedRowRender = (record) => {
    // console.log(record, "record");
    return <EditableTable record={record} getList={getList} />;
  };

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

    //Sort
    if (tableInfo?.sorter?.column) {
      paramString += `&sort=${tableInfo?.sorter.field}&stype=${
        tableInfo?.sorter.order === "ascend" ? "asc" : "desc"
      }`;
    } else if (manualSort) {
      paramString += `&sort=${manualSort.field}&stype=${
        manualSort.order === "ascend" ? "asc" : "desc"
      }`;
    } else {
      paramString += `&sort=last_name&stype=asc`;
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

  const getStoredColumns = () => {
    const storedColumns = localStorage.getItem("real_personnel_columns");
    return storedColumns ? storedColumns.split(",") : false;
  };

  const getList = (reset) => {
    if (!list) setListLoading(true);
    else setTableLoading(true);

    const searchParams = qs.parse(location.search);

    let url;

    if (reset) {
      url = addParamsToUrl(
        `/api/v1/baje/personnel/list/${currentOffice}/${currentContract}`,
        true,
        1
      );
    } else {
      url = addParamsToUrl(
        `/api/v1/baje/personnel/list/${currentOffice}/${currentContract}`,
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
        setList(res.data.list);
        setExportKey(res.data.export);
        setExportKeyIsJson(false);
        setListLoading(false);
        setDeleteLoading(false);
        setTableLoading(false);
        setTableInfo((state) => ({
          ...state,
          pagination: {
            ...state?.pagination,
            total: res.data.total,
          },
          silentUpdate: true,
        }));
        const columns = getStoredColumns();
        columns
          ? setSelectedColumns(columns)
          : setSelectedColumns(defaultColumns);
      })
      .catch((err) => {
        setListLoading(false);
        console.log(err);
      });
  };

  const getSubordinateList = () => {
    if (!relationList) setListLoading(true);
    else setTableLoading(true);

    const searchParams = qs.parse(location.search);

    let url = addParamsToUrl(
      `/api/admin/personnel/subordinates/${currentOffice}/${currentContract}`,
      true,
      searchParams.page ? +searchParams.page : false,
      searchParams.sort && searchParams.sort_order
        ? { field: searchParams.sort, order: searchParams.sort_order }
        : false
    );

    axios
      .get(url)
      .then((res) => {
        setRelationList(res.data.list);
        setExportKey(res.data.json);
        setExportKey(res.data.json);
        setExportKeyIsJson(true);
        setListLoading(false);
        setDeleteLoading(false);
        setTableLoading(false);
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
        setListLoading(false);
        console.log(err);
      });
  };

  const handleExcelExport = async () => {
    const realPersonUrl = addParamsToUrl(
      `/api/v1/baje/personnel/list/${currentOffice}/${currentContract}`,
      false
    );

    const subPersonUrl = addParamsToUrl(
      `/api/admin/personnel/subordinates/${currentOffice}/${currentContract}`,
      false
    );

    setExcelLoading(true);

    try {
      const res = await axios.get(
        activeTab === "mainTab" ? realPersonUrl : subPersonUrl
      );
      const exportData = exportKeyIsJson ? res.data?.json : res.data?.export;

      if (exportData) {
        await handleClickExportExl(exportData, exportKeyIsJson, () =>
          setExcelLoading(false)
        );
      } else setExcelLoading(false);
    } catch (e) {
      console.log(e);
      setExcelLoading(false);
    }
  };

  ///////////////// EFFECTS ////////////////
  useEffect(() => {
    setSearchParamsFirst(qs.parse(location.search));
  }, []);

  useEffect(() => {
    if (!checkAccess(LIST_PERSON)) {
      setListLoading(false);
    }
    if (currentOffice && checkAccess(LIST_PERSON)) {
      setActiveTab("mainTab");
      getList(true);
    }

    return () => {
      new AbortController().abort();
    };

    // rest lastUpdated item
  }, [currentOffice, currentContract]);

  useEffect(() => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    timeout = setTimeout(() => {
      if (!tableInfo?.silentUpdate) {
        activeTab === "mainTab" ? getList() : getSubordinateList();
      }
    }, 500);

    return () => {
      new AbortController().abort();
    };
  }, [tableInfo]);

  // reset page, filters and sort on tab and office change
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    setList(null);
    setTableInfo((state) => ({
      ...state,
      sorter: null,
      filters: {},
      pagination: {
        current: 1,
        pageSize: window.localStorage.getItem("table_page_size") || 20,
      },
    }));
    history.replace({ search: null });

    return () => {
      new AbortController().abort();
    };
  }, [activeTab, currentOffice]);

  // set default filters if any, based on url search query params
  function getInitialFilters() {
    const filters = {};

    if (location.search) {
      const searchParams = qs.parse(location.search);
      if (searchParams) {
        for (let key in searchParams) {
          if (key !== "page" && key !== "sort" && key !== "sort_order") {
            filters[key] = searchParams[key];
          }
        }
      }
    }

    return filters;
  }

  if (listLoading) {
    return <LogoLoading />;
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRow(selectedRows);
    },
  };

  const handleDelete = (deleteList) => {
    setDeleteLoading(true);
    const deleteIds =
      typeof deleteList[0] === "object"
        ? deleteList.map((item) => item.id)
        : deleteList;

    (activeTab === "mainTab"
      ? deleteRealPerson(deleteIds)
      : deleteSubordinate(deleteIds)
    )
      .then((res) => {
        const dependency = res.data?.output?.[0]?.["depends"];

        if (Array.isArray(dependency) && dependency.length) {
          const errorMessage = (
            <>
              <span>
                فرد مورد نظر در بخش های دیگر دارای وابستگی میباشد، لازم است
                ابتدا موارد مرتبط در سایر بخش ها حذف گردد.
              </span>
              <br />
              <br />
              <span>بخش های مربوطه:</span>
              <br />
              <span>{dependency.join("، ")}</span>
            </>
          );

          Modal.error({
            title: "وابستگی فرد حقیقی",
            content: errorMessage,
          });
          setDeleteLoading(false);
          return;
        }

        activeTab === "mainTab" ? getList() : getSubordinateList();
        setSelectedRow([]);
      })
      .catch((err) => {
        message.error(err.data);
        console.log("error", err);
        setDeleteLoading(false);
      });
  };

  const deleteGroup = () => (
    <Popconfirm
      placement="leftTop"
      title={"آیا برای حذف اطمینان دارید ؟"}
      onConfirm={() => handleDelete(selectedRow)}
      okText="بله"
      cancelText="خیر"
    >
      <Button type="danger">حذف</Button>
    </Popconfirm>
  );

  const handleOnTabClick = (key) => {
    key === "mainTab" ? getList() : getSubordinateList();
    setTableInfo(null);
    setActiveTab(key);
  };

  const handleOnInsuranceBtnClick = () => {
    const personnelId = selectedRow[0]?.id;

    if (personnelId) {
      const newPath = getLink(
        pageNames.personnel.insurance.tamin.personnelReport,
        personnelId
      );

      history.push(newPath);
    }
  };

  const handleOnTableChange = (
    pagination,
    filters,
    sorter,
    { currentDataSource, action }
  ) => {
    console.log("filters:", filters);
    clearTimeout(tableDataTimeout.current);
    setTableLoading(true);

    //Rate limit on table filter
    tableDataTimeout.current = setTimeout(
      () => {
        //Reset current page on filter or sort
        if (action === "sort")
          pagination = {
            ...pagination,
            current: 1,
          };

        // save current page if it is updated as url query param so that the page would be loaded on back or refresh
        if (action === "sort" || action === "paginate") {
          const queryParams = qs.parse(location.search);

          const isDiffPage =
            pagination.current !== tableInfo.pagination.current;
          const isDiffSort =
            !queryParams?.sort ||
            (queryParams?.sort &&
              (sorter?.field !== queryParams.sort ||
                sorter?.order !== queryParams.sort_order));

          if (isDiffPage) {
            queryParams.page = pagination.current;
          }
          if (isDiffSort) {
            queryParams.sort = sorter.field;
            queryParams.sort_order = sorter.order;
          }
          if (!sorter.order) {
            delete queryParams.sort_order;
            delete queryParams.sort;
          }

          if (isDiffPage || isDiffSort) {
            history.replace({ search: qs.stringify(queryParams) });
          }
        }

        //Trigger changes on table info
        console.log("actions:", action);
        console.log("paginate:", pagination);
        setTableInfo((curr) => ({
          pagination,
          filters: curr.filters,
          sorter,
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

    //This state is passed to table columns
    setDisabledFilters(filtersToDisable);
  };

  const onDisplayUserModal = (value, id) => {
    setUserID(id);
    setAdditionalInfoModal(value);
  };

  const menuBtnList = [
    {
      url: pageNames.personnel.realPerson.add,
      label: "حقیقی جدید",
      id: "newRealPerson",
      permission: INSERT_PERSON,
      variant: "primary",
      icon: <UserAddOutlined />,
      // why? hidden:   currentContract === "-1",
    },
    {
      url: `${pageNames.personnel.realPerson.addGroup}?type=${activeTab}`,
      label: "ثبت گروهی",
      id: "newGroup",
    },
    !isMobile && (
      <CheckAccess permission={permission.SOCIAL_INSURANCE_REPORT}>
        <InsuranceBtn
          disabled={selectedRow?.length !== 1}
          onClick={handleOnInsuranceBtnClick}
        >
          گزارش بیمه تامین اجتماعی
        </InsuranceBtn>
      </CheckAccess>
    ),
    {
      url: getLink(
        pageNames.personnel.insurance.supplymentary.personnel.history,
        {
          id: selectedRow[0]?.id,
          personName:
            selectedRow[0]?.first_name + " " + selectedRow[0]?.last_name,
        }
      ),
      label: "سوابق بیمه تکمیلی",
      id: "suplymentInsuranceHistory",
      disabled: selectedRow?.length !== 1,
      hidden: isMobile,
    },
    {
      handleClick: () => {
        history.push(
          getLink(pageNames.personnel.realPerson.resume.list, selectedRow[0].id)
        );
      },
      label: "مشاغل و رزومه",
      id: "resume",
      disabled: selectedRow.length !== 1,
      hidden: isMobile,
    },
    {
      handleClick: () => {
        history.push(
          getLink(pageNames.personnel.realPerson.assignShift, {
            id: selectedRow[0].id,
          }),
          selectedRow[0].id
        );
      },
      label: "اختصاص شیفت",
      id: "assignShift",
      disabled: selectedRow.length !== 1,
      hidden: isMobile,
    },
    {
      handleClick: () => {
        onDisplayUserModal(additionalTypes.CONTACT, selectedRow[0].id);
      },
      label: "اطلاعات تماس ",
      id: "contactInfo",
      disabled: selectedRow.length !== 1,
      hidden: isMobile,
    },
    {
      handleClick: () => {
        onDisplayUserModal(additionalTypes.BANK_ACCOUNTS, selectedRow[0].id);
      },
      label: "حساب های بانکی",
      id: "bankInfo",
      disabled: selectedRow.length !== 1,
      hidden: isMobile,
    },
    {
      handleClick: () => {
        onDisplayUserModal(additionalTypes.DOCUMENTS, selectedRow[0].id);
      },
      label: "اسناد",
      id: "documents",
      disabled: selectedRow.length !== 1,
      hidden: isMobile,
    },
    {
      handleClick: () => {
        history.push(
          getLink(pageNames.permissions.person.list, selectedRow[0].id)
        );
      },
      label: "سطوح دسترسی",
      id: "accessList",
      disabled: selectedRow.length !== 1,
      hidden: isMobile,
    },
    {
      handleClick: () => {
        onDisplayUserModal(additionalTypes.USER_ACCOUNT, selectedRow[0].id);
      },
      label: "اطلاعات کاربری",
      id: "USER_ACCOUNT",
      disabled: selectedRow.length !== 1,
      hidden: isMobile,
    },
    {
      handleClick: () => {
        onDisplayUserModal(additionalTypes.INSURANCE_INFO, selectedRow[0].id);
      },
      label: "اطلاعات بیمه",
      id: "INSURANCE_INFO",
      disabled: selectedRow.length !== 1,
      hidden: isMobile,
    },
    {
      handleClick: () => {
        onDisplayUserModal(additionalTypes.OTHER_INFO, selectedRow[0].id);
      },
      label: "متفرقه",
      id: "OTHER_INFO",
      disabled: selectedRow.length !== 1,
      hidden: isMobile,
    },
    {
      handleClick: () => {
        history.push(
          getLink(pageNames.personnel.realPerson.salary, selectedRow[0].id)
        );
      },
      label: "دریافت فیش حقوقی",
      id: "salaryBill",
      disabled: selectedRow.length !== 1,
      hidden: isMobile,
    },
  ];

  // handle mobile page changes, as mobile list has a different view so pagination is handled slightly differently
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

  //prepare columns:
  const getColumns = () => {
    return tableColumns(
      handleDelete,
      history,
      list,
      tableSearch,
      tableInfo,
      setTableInfo,
      disabledFilters,
      qs.parse(location.search),
      onDisplayUserModal,
      getList,
      checkAccess,
      setList,
      setUserID,
      setFamilyModal
    );
  };

  const getActiveColumns = () => {
    let columns = getColumns();

    return columns.filter(
      (item) => selectedColumns.indexOf(item.dataIndex) !== -1
    );
  };

  const handleOnTableColumnsChange = (value) => {
    setSelectedColumns(value);
    localStorage.setItem("real_personnel_columns", value);
  };

  const getColumnListItems = () => {
    return getColumns().map((item) => ({
      title: item.placeholder,
      value: item.dataIndex,
    }));
  };

  // show mobile list if is mobile otherwise show table
  const mainTab = isMobile ? (
    <MobileList
      dataSource={list}
      pagination={tableInfo?.pagination}
      loading={tableLoading}
      selected={selectedRow}
      onSelectedChange={setSelectedRow}
      onPageChange={handleMobilePageChange}
      tableInfo={tableInfo}
      setTableInfo={setTableInfo}
      handleDelete={handleDelete}
      onDisplayUserModal={onDisplayUserModal}
      setUserID={setUserID}
      setFamilyModal={setFamilyModal}
    />
  ) : (
    <AppTable
      className={styles.mainTable}
      notMarginTop={true}
      rowSelection={{
        type: "checkbox",
        ...rowSelection,
      }}
      // columns={columns(
      //   handleDelete,
      //   history,
      //   list,
      //   tableSearch,
      //   tableInfo,
      //   setTableInfo,
      //   disabledFilters,
      //   qs.parse(location.search),
      //   onDisplayUserModal,
      //   getList,
      //   checkAccess,
      //   setList
      // )}

      columns={getActiveColumns()}
      rowKey={(record) => record.id}
      dataSource={list}
      footer={selectedRow.length > 0 && deleteGroup}
      onChange={handleOnTableChange}
      loading={tableLoading}
      pagination={tableInfo?.pagination}
      expandable={{ expandedRowRender }}
    />
  );

  const relationTab = isMobile ? (
    <MobileList
      dataSource={relationList}
      pagination={tableInfo?.pagination}
      loading={tableLoading}
      selected={selectedRow}
      onSelectedChange={setSelectedRow}
      onPageChange={handleMobilePageChange}
      tableInfo={tableInfo}
      setTableInfo={setTableInfo}
      handleDelete={handleDelete}
    />
  ) : (
    <AppTable
      notMarginTop={true}
      rowSelection={{
        type: "checkbox",
        ...rowSelection,
      }}
      columns={columnsRelation(
        handleDelete,
        history,
        relationList,
        tableSearch,
        tableInfo,
        disabledFilters
      )}
      rowKey={(record) => record.id}
      dataSource={relationList}
      footer={selectedRow.length > 0 && deleteGroup}
      onChange={handleOnTableChange}
      loading={tableLoading}
      pagination={tableInfo?.pagination}
    />
  );

  return (
    <>
      <UserInfoModal
        additionalInfoModal={additionalInfoModal}
        setAdditionalInfoModal={setAdditionalInfoModal}
        userID={userID}
      />
      {familyModal ? (
        <FamilyTreeModal
          setFamilyModal={setFamilyModal}
          visible={familyModal}
          userId={userID}
        />
      ) : (
        ""
      )}

      <ContentTop noBack title="لیست افراد حقیقی" />
      <div className="w-100 flex-wrap align-center mg-btm-15">
        <MenuInlineBtn
          list={
            isMobile
              ? menuBtnList.filter(
                  (btn) => btn.id === "newGroup" || btn.id === "newRealPerson"
                )
              : menuBtnList
          }
        />

        <ListActions
          className="mr-md-auto mt-lg-0"
          noPrint
          noFilter
          noSort
          excelLoading={excelLoading}
          actions={{
            excelExport: () =>
              downloadExcel(
                endpoint(
                  `/personnel/excel/list/${currentOffice}/${currentOffice}`
                )
              ),
          }}
        >
          {!isMobile ? (
            <DropdownButton
              defaultValue={getStoredColumns() || defaultColumns}
              onChange={handleOnTableColumnsChange}
              items={getColumnListItems()}
            >
              ستون‌های فعال جدول
            </DropdownButton>
          ) : (
            ""
          )}
        </ListActions>
      </div>

      <CheckAccess permission={LIST_PERSON}>
        <Spin spinning={deleteLoading}>
          <Tabs activeKey={activeTab} onTabClick={handleOnTabClick} type="card">
            <Tabs.TabPane tab="اصلی" key="mainTab">
              {mainTab}
            </Tabs.TabPane>

            {checkAccess(VIEWSUBORDINATE_PERSON) && (
              <Tabs.TabPane tab="تبعی" key="relationTab">
                {relationTab}
              </Tabs.TabPane>
            )}
          </Tabs>
        </Spin>
      </CheckAccess>
    </>
  );
};

export default RealPersonList;
