import React, { useContext, useEffect, useState } from "react";
import { message, Spin } from "antd";
import axios from "api/appAxios";
import { useHistory, useLocation } from "react-router-dom";
import useCheckAccess from "hooks/useCheckAccess";
import { LayoutContext } from "contex/Layout-context";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import { columns } from "./utils/listColumns";
import ContentTop from "components/general/ContentTop";
import ListActions from "components/general/ListActions";
import useTableSearch from "hooks/useTableSearch";
import { handleClickExportExl } from "_helpers";
import { pageNames } from "constant";
import qs from "query-string";
import { getLink } from "_helpers";
import ResponsiveList from "components/general/ResponsiveList";

const DoctorList = () => {
  const [listLoading, setListLoading] = useState(true);
  const [list, setList] = useState([]);
  const [initialList, setInitialList] = useState();
  const [selectedRow, setSleetedRow] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const history = useHistory();
  const checkAccess = useCheckAccess();
  const layoutContext = useContext(LayoutContext);
  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const [exportKey, setExportKey] = useState();
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
      url: pageNames.personnel.doctor.add,
      label: "افزودن پزشک",
      id: "newDoctor",
      variant: "primary",
    },
  ];

  const handleDelete = (id) => {
    setDeleteLoading(true);

    axios
      .delete(`/api/admin/doctor`, { data: { id: id[0].toString() } })
      .then((res) => {
        getList();
        setSleetedRow([]);
        message.success("آیتم مورد نظر پاک شد");
      })
      .catch((err) => {
        message.error(err.data);
        setDeleteLoading(false);
      });
  };

  const getList = () => {
    setListLoading(true);

    axios
      .get(`/api/admin/doctor`)
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
        history.push(getLink(pageNames.personnel.doctor.edit, record.id)),
    },
    {
      name: "حذف",
      onClick: (record) => handleDelete([record.id]),
    },
  ];

  return (
    <>
      <ContentTop
        noBack
        title="پزشکان"
        breadcrumbItems={[
          { text: "منابع انسانی", link: pageNames.home.web },
          { text: "پزشکان" },
        ]}
      />

      <div className="w-100 flex-wrap align-center">
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
          <ResponsiveList
            rowKey={(record) => record.id}
            columns={columns(
              handleDelete,
              history,
              list,
              tableSearch,
              qs.parse(location.search)
            )}
            dataSource={list}
            rowSelection={{ ...rowSelection }}
            pagination={tableInfo?.pagination}
            tableInfo={tableInfo}
            setTableInfo={setTableInfo}
            filterMode="client"
            itemActions={mobileItemActions}
            showFilters={true}
            viewLink={(record) =>
              getLink(pageNames.personnel.realPerson.mission.view, {
                id: record.id,
              })
            }
            titleKeys={["first_name", "last_name"]}
            initialData={initialList}
            setData={setList}
            bordered={true}
            onChange={handleTableChange}
          />
        </div>
      </Spin>
    </>
  );
};

export default DoctorList;
