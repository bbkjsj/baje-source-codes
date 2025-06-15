import React, { useEffect, useState } from "react";
import { Table, Button, Tooltip, Popconfirm, Spin, message, Modal } from "antd";
import axios from "api/appAxios";
import { Link, useHistory, useLocation } from "react-router-dom";
import { deleteRightFull } from "../common/_helpers";
import LogoLoading from "../../../../components/general/LoadingLogo";
import { getLink, handleClickExportExl } from "_helpers";
import MenuInlineBtn from "components/MenuInlineBtn";
import { permission } from "json/Permission";
import useCheckAccess from "hooks/useCheckAccess";
import { CheckAccess } from "AuxComponent/CheckAccess";
import { UserAddOutlined } from "@ant-design/icons";
import ListActions from "components/general/ListActions";
import AppTable from "components/general/AppTable";
import ContentTop from "components/general/ContentTop";
import useTableSearch from "hooks/useTableSearch";
import { config, pageNames } from "constant";
import TableActions from "components/general/TableActions";
import qs from "query-string";
import useIsMobile from "hooks/useIsMobile";
import MobileList from "components/mobileList/MobileList";
import ResponsiveList from "components/general/ResponsiveList";
import useTableSelectSearch from "hooks/useTableSelectSearch";

const { INSERT_LEGAL, DELETE_LEGAL, EDIT_LEGAL, LIST_LEGAL } = permission;

const RightFullList = () => {
  const [list, setList] = useState([]);
  // needed for mobile view client side filtering
  const [initialList, setInitialList] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [exportKey, setExportKey] = useState();
  const history = useHistory();
  const checkAccess = useCheckAccess();
  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const location = useLocation();
  const isMobile = useIsMobile();
  const tableSelect = useTableSelectSearch({
    saveParams: true,
    filterMultiple: true,
  });

  const searchParams = qs.parse(location.search);

  const [tableInfo, setTableInfo] = useState({
    pagination: {
      current: searchParams.page ? +searchParams.page : 1,
    },
    filters: {},
    sorter: {},
  });

  const menuBtnList = [
    {
      url: pageNames.personnel.rightFull.add,
      label: "حقوقی جدید",
      id: "newRealPerson",
      permission: INSERT_LEGAL,
      variant: "primary",
      icon: <UserAddOutlined />,
    },
    {
      handleClick: () => {
        history.push(
          getLink(pageNames.personnel.orgCharts.list, {
            id: selectedRow[0],
          })
        );
      },
      label: "چارت سازمانی",
      id: "orgChart",
      disabled: selectedRow.length !== 1,
    },
    {
      handleClick: () => {
        history.push(
          getLink(pageNames.personnel.boardMembers.list, {
            id: selectedRow[0],
          })
        );
      },
      label: "اعضای هیئت مدیره",
      id: "boardMembers",
      disabled: selectedRow.length !== 1,
    },
    // {
    //   handleClick: () => handleClickExportExl(exportKey),
    //   label: "خروجی اکسل",
    //   id: "exportExcel",
    // },
  ];

  const getList = () => {
    axios
      .get("/api/v1/baje/company")
      .then((res) => {
        // convertUrlToBase64(res.data.list).then((newList) => {
        //   setList(newList);
        // });
        setExportKey(res?.data?.export);
        setTimeout(() => {
          setList(res.data);
          setInitialList(res.data);
        }, 200);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = (list) => {
    deleteRightFull(list, setDeleteLoading)
      .then(() => {
        message.success({ content: "با موفقیت حذف شد" });
        getList();
      })
      .catch((err) => {
        message.error(err.data);
      });
  };

  useEffect(() => {
    if (!checkAccess(LIST_LEGAL)) {
      setListLoading(false);
      console.log("&&&&&&&&&&&");
    }

    console.log("&&&&&&&&&&&", checkAccess(LIST_LEGAL));

    if (checkAccess(LIST_LEGAL)) {
      getList();
    } else {
      setList([]);
    }
  }, []);

  const generateIcons = (record) => {
    const list = [
      {
        name: "detail",
        onClick: () =>
          history.push(getLink(pageNames.personnel.rightFull.view, record.id)),
      },
      {
        name: "edit",
        onClick: () =>
          history.push(getLink(pageNames.personnel.rightFull.edit, record.id)),
        permission: EDIT_LEGAL,
      },
      {
        name: "delete",
        onClick: () => handleDelete([record.id]),
        permission: DELETE_LEGAL,
      },
    ];
    return list;
  };
  let columns = [
    {
      width: 60,
      title: "",
      align: "center",
      key: "number",
      dataIndex: "number",
      render: (text, record) => {
        return list.indexOf(record) + 1;
      },
    },
    {
      title: "لوگو",
      align: "center",
      key: "logoUrl",
      dataIndex: "logoUrl",
      render: (logoUrl) => {
        if (logoUrl) {
          return (
            <img
              src={`${config.url.API_URL}/api/v1/baje/${logoUrl}`}
              alt="logo"
              style={{ height: "40px", maxWidth: "100%", objectFit: "contain" }}
            />
          );
        } else {
          return "-";
        }
      },
    },
    {
      title: "نام",
      dataIndex: "name",
      key: "name",
      ...tableSearch("name", "نام"),
      sorter: (a, b) => (a.name ? a.name.localeCompare(b.name) : false),
    },
    {
      title: "نوع",
      dataIndex: "type",
      key: "type",
      ...tableSelect("type", "نوع", {
        filters: [
          {
            text: "شرکت (تجاری)",
            value: "company",
          },
          {
            text: "عمومی",
            value: "public",
          },
          {
            text: "موسسه (غیر تجاری)",
            value: "organization",
          },
        ],
      }),
      render: (text) => {
        const translate = {
          public: "عمومی",
          company: "شرکت (تجاری)",
          organization: "موسسه (غیر تجاری)",
        };

        return translate[text];
      },

      sorter: (a, b) => (a.type ? a.type.localeCompare(b.type) : false),
    },
    {
      title: "شماره ثبت",
      dataIndex: "registerNumber",
      key: "registerNumber",
      ...tableSearch("registerNumber", "شماره ثبت"),
      sorter: (a, b) =>
        a.registerNumber
          ? a.registerNumber.localeCompare(b.registerNumber)
          : false,
    },
    {
      title: "کد اقتصادی",
      dataIndex: "financeCode",
      key: "financeCode",
      ...tableSearch("financeCode", "کد اقتصادی"),
      sorter: (a, b) =>
        a.financeCode ? a.financeCode.localeCompare(b.financeCode) : false,
      render: (text, record) => {
        if (record.financeCode) {
          return record.financeCode;
        } else {
          return <p style={{ color: "#ff4757" }}>ثبت نشده است</p>;
        }
      },
    },
    // {
    //   title: "مدیر عامل",
    //   dataIndex: "firstName",
    //   key: "firstName",
    //   ...tableSearch("firstName", "مدیر عامل"),
    //   sorter: (a, b) =>
    //     a.firstName ? a.firstName.localeCompare(b.firstName) : false,
    //   render: (text, record) => {
    //     if (record.firstName) {
    //       return `${record.firstName} ${record.last_name}`;
    //     } else {
    //       return <p style={{ color: "#ff4757" }}>ثبت نشده است</p>;
    //     }
    //   },
    // },
    {
      title: "شناسه ملی",
      dataIndex: "nationalId",
      key: "nationalId",
      ...tableSearch("nationalId", "شناسه ملی"),
      sorter: (a, b) =>
        a.nationalId ? a.nationalId.localeCompare(b.nationalId) : false,
    },

    {
      align: "center",
      title: "تنظیمات",
      key: "action",
      render: (text, record) => {
        return <TableActions list={generateIcons(record)} />;
      },
    },
  ];

  // dynamically add default filters and sorts to columns based on search params
  columns = columns.map((column) => {
    return {
      ...column,
      defaultFilteredValue:
        searchParams && searchParams[column?.dataIndex]
          ? [searchParams[column?.dataIndex]]
          : null,
      defaultSortOrder:
        searchParams && searchParams.sort === column?.dataIndex
          ? searchParams?.sort_order || "ascend"
          : null,
    };
  });

  const mobileItemActions = [
    {
      name: "ویرایش",
      onClick: (record) =>
        history.push(getLink(pageNames.personnel.rightFull.edit, record.id)),
      permission: EDIT_LEGAL,
    },
    {
      name: "حذف",
      onClick: (record) =>
        Modal.confirm({
          onOk: () => handleDelete([record.id]),
          content: "آیا از حذف این شرکت اطمینان دارید؟",
        }),
      permission: DELETE_LEGAL,
    },
    {
      name: "چارت سازمانی",
      onClick: (record) => {
        history.push(
          getLink(pageNames.personnel.orgCharts.list, {
            id: record.id,
          })
        );
      },
    },
    {
      name: "اعضای هیئت مدیره",
      onClick: (record) => {
        history.push(
          getLink(pageNames.personnel.boardMembers.list, {
            id: record.id,
          })
        );
      },
    },
  ];

  ////////

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedRow(selectedRowKeys);
    },
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

  if (!list && listLoading) {
    return <LogoLoading />;
  }
  // else if (list.length === 0) {
  //   return <p>هیچ فرد حقوقی یافت نشد. !!</p>;
  // }

  const menuBtnStyle = {
    margin: "10px",
    marginRight: "0",
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

  return (
    <>
      <ContentTop noBack title=" افراد حقوقی" />
      <div className="w-100 flex-wrap align-center">
        <MenuInlineBtn list={menuBtnList} />
        <ListActions
          className="mr-md-auto mt-3 mt-lg-0"
          noPrint
          noFilter
          noSort
          actions={{
            excelExport: () => handleClickExportExl(exportKey),
          }}
        />
      </div>

      <Spin spinning={deleteLoading}>
        <CheckAccess permission={LIST_LEGAL}>
          <ResponsiveList
            dataSource={list}
            pagination={tableInfo?.pagination}
            selected={selectedRow}
            onSelectedChange={setSelectedRow}
            tableInfo={tableInfo}
            setTableInfo={setTableInfo}
            filterMode="client"
            showFilters={true}
            itemActions={mobileItemActions}
            columns={columns}
            viewLink={(record) =>
              getLink(pageNames.personnel.rightFull.view, record.id)
            }
            titleKeys={["name"]}
            initialData={initialList}
            setData={setList}
            rowKey={(record) => record.id}
            rowSelection={{ ...rowSelection }}
            footer={selectedRow.length > 0 && deleteGroup}
            onChange={handleTableChange}
          />
        </CheckAccess>
      </Spin>
    </>
  );
};

export default RightFullList;
