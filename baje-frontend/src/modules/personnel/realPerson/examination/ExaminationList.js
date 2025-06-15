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
import { columns } from "./listColumnsExamination";
import ListActions from "components/general/ListActions";
import AppTable from "components/general/AppTable";
import ContentTop from "components/general/ContentTop";
import { FileAddOutlined } from "@ant-design/icons";
import useTableSearch from "hooks/useTableSearch";
import useDateFilterTable from "hooks/useDateFilterTable";
import { handleClickExportExl } from "_helpers";
import { pageNames } from "constant";
import qs from "query-string";
import ResponsiveList from "components/general/ResponsiveList";

const ExaminationList = (props) => {
  const [listLoading, setListLoading] = useState(true);
  const [list, setList] = useState([]);
  const [initialList, setInitialList] = useState();
  const [selectedRow, setSleetedRow] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const history = useHistory();
  const checkAccess = useCheckAccess();
  const layoutContext = useContext(LayoutContext);
  const itemId = props.match.params.id;
  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const dateFilterTable = useDateFilterTable();
  const [exportKey, setExportKey] = useState();

  const location = useLocation();

  const searchParams = qs.parse(location.search);

  const [tableInfo, setTableInfo] = useState({
    pagination: {
      current: searchParams.page ? +searchParams.page : 1,
    },
  });

  const menuBtnList = [
    {
      url: `${pageNames.personnel.realPerson.examination.add}/?person_id=${itemId}`,
      label: "ثبت معاینه",
      id: "newVisit",
      variant: "primary",
      icon: <FileAddOutlined />,
    },
  ];

  const handleDelete = (id) => {
    setDeleteLoading(true);

    axios
      .delete(`doctor`, { data: { data: id } })
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
      .get(`/api/visit/history/${itemId}`)
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

  return (
    <>
      <GoBackBtn link={pageNames.personnel.realPerson.examination.personList} />
      <ContentTop
        title="سابقه معاینات فرد"
        breadcrumbItems={[
          {
            text: "معاینات پزشکی",
            link: pageNames.personnel.realPerson.examination.personList,
          },
          { text: "سابقه معاینات فرد" },
        ]}
      />

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
          <ResponsiveList
            notMarginTop={true}
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
            rowKey={(record) => record.id}
            columns={columns(
              history,
              list,
              tableSearch,
              dateFilterTable,
              searchParams,
              qs.parse(location.search)
            )}
            dataSource={list}
            pagination={tableInfo.pagination}
            onChange={handleTableChange}
            tableInfo={tableInfo}
            setTableInfo={setTableInfo}
            filterMode="client"
            showFilters={true}
            titleKeys={["first_name", "last_name"]}
            initialData={initialList}
            setData={setList}
            scroll={{ y: 600, x: true }}
            bordered={true}
          />
        </div>
      </Spin>
    </>
  );
};

export default ExaminationList;
