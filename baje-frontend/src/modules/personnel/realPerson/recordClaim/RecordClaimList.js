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
import { deleteRecordClaim } from "./api";
import { PlusOutlined } from "@ant-design/icons";
import ContentTop from "components/general/ContentTop";
import AppTable from "components/general/AppTable";
import useTableSearch from "hooks/useTableSearch";
import useTableSelectSearch from "hooks/useTableSelectSearch";
import useRangeFilter from "hooks/useRangeFilter";
import { handleClickExportExl } from "_helpers";
import ListActions from "components/general/ListActions";
import { pageNames } from "constant";
import qs from "query-string";
import { getLink } from "_helpers";
import ResponsiveList from "components/general/ResponsiveList";

const RecordClaimList = (props) => {
  const [listLoading, setListLoading] = useState(true);
  const [list, setList] = useState([]);
  const [initialList, setInitialList] = useState();
  const [selectedRow, setSleetedRow] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const history = useHistory();
  const [exportKey, setExportKey] = useState();
  const checkAccess = useCheckAccess();
  const layoutContext = useContext(LayoutContext);
  const itemId = props.match.params.id;
  const tableSearch = useTableSearch({ saveParams: true, searchParams: true });
  const tableSelect = useTableSelectSearch({
    saveParams: true,
    searchParams: true,
  });
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
      url: pageNames.personnel.realPerson.recordClaim.add,
      label: "ثبت ادعای سابقه",
      id: "newClaim",
      variant: "primary",
      icon: <PlusOutlined />,
    },
  ];

  // const handleDelete = (id) => {
  //   setDeleteLoading(true);

  //   axios
  //     .delete(`doctor`, { data: { data: id } })
  //     .then((res) => {
  //       getList();
  //       setSleetedRow([]);
  //       message.success("آیتم مورد نظر پاک شد");
  //     })
  //     .catch((err) => {
  //       message.error(err.data);
  //       setDeleteLoading(false);
  //     });
  // };

  const getList = () => {
    setListLoading(true);
    axios
      .get(`/api/hclaim`)
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
  }, []);

  const handleDeleteRecordClaim = async (ids) => {
    setListLoading(true);

    try {
      await deleteRecordClaim(ids);
      getList();
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleDelete = () => {
    handleDeleteRecordClaim(selectedRow, getList);
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
          getLink(pageNames.personnel.realPerson.recordClaim.edit, record.id)
        ),
    },
    {
      name: "حذف",
      onClick: (record) => deleteRecordClaim([record.id]),
    },
  ];

  return (
    <div>
      <ContentTop
        noBack
        title="درخواست های ادعای سابقه"
        className="mt-3"
        // breadcrumbItems={[
        //   // { text: "منابع انسانی" },
        //   // { text: "افراد حقیقی" },
        //   { text: "ادعای سابقه" },
        // ]}
      />

      <div className="w-100 flex-wrap align-center mb-3">
        <MenuInlineBtn list={menuBtnList} />
        <ListActions
          className="mr-md-auto mt-lg-0"
          noPrint
          noFilter
          noSort
          actions={{
            excelExport: () => handleClickExportExl(exportKey.length.shit),
          }}
        />
      </div>
      <Spin spinning={deleteLoading}>
        <div className="mt-4">
          <ResponsiveList
            rowKey={(record) => record.id}
            onRow={() => false}
            columns={columns(
              history,
              list,
              handleDeleteRecordClaim,
              tableSearch,
              tableSelect,
              rangeFilter,
              setListLoading,
              getList,
              qs.parse(location.search)
            )}
            dataSource={list}
            rowSelection={{ ...rowSelection }}
            footer={selectedRow.length > 0 && deleteGroup}
            scrollX={1580}
            pagination={tableInfo?.pagination}
            tableInfo={tableInfo}
            setTableInfo={setTableInfo}
            filterMode="client"
            itemActions={mobileItemActions}
            showFilters={true}
            viewLink={(record) =>
              getLink(
                pageNames.personnel.realPerson.recordClaim.view,
                record.id
              )
            }
            titleKeys={["first_name", "last_name"]}
            initialData={initialList}
            setData={setList}
            size="small"
            scroll={{ y: 600, x: true }}
            bordered={true}
            onChange={handleTableChange}
          />
        </div>
      </Spin>
    </div>
  );
};

export default RecordClaimList;
