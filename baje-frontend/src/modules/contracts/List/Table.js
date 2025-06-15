import React, { useState, useContext, useEffect } from "react";
import { Table, Spin, Popconfirm, Button, message, Menu } from "antd";
import styled from "styled-components";
import { useHistory, useLocation } from "react-router-dom";
import { deleteContract } from "../utils/index";
import LoadingLogo from "components/general/LoadingLogo";
import AppTable from "components/general/AppTable";
import useTableSearch from "hooks/useTableSearch";
import useTableSelectSearch from "hooks/useTableSelectSearch";
import { permission } from "json/Permission";
import { LayoutContext } from "contex/Layout-context";
import AppMenuItem from "components/general/AppMenuItem";
import { pageNames } from "constant";
import { getLink } from "_helpers";
import { useSelector, useDispatch } from "react-redux";
import { setContractList } from "store/action/contractList";
import TableActions from "components/general/TableActions";
import qs from "query-string";
import useIsMobile from "hooks/useIsMobile";
import MobileList from "components/mobileList/MobileList";
import ResponsiveList from "./../../../components/general/ResponsiveList";
import AppModal from "components/general/AppModal";
import ProjectStatusModal from "./ProjectStatusModal";

const { EDIT_CONTRACT, DELETE_CONTRACT } = permission;

const StyledHeader = styled(Table)`
  .ant-table-thead > tr > th {
    background-color: #8395a7;
    color: #fff;
  }
  background-color: #fff;
`;

const MainText = styled.p`
  color: #27ae60;
  // white-space: noWrap;
`;

const SubsidiaryText = styled.p`
  color: #f39c12;
  // white-space: noWrap;
`;

const StyledNumber = styled.p`
  padding-left: 60px;
`;

const wrongText = <p className="wrong-text-info">ثبت نشده است</p>;

const typeRender = (text, record) => {
  if (record.type.substr(5) === "civil" || record.type.substr(4) === "civil") {
    return <MainText>قرارداد عمرانی</MainText>;
  } else {
    return <SubsidiaryText>قرارداد غیر عمرانی</SubsidiaryText>;
  }
};

const List = (props) => {
  const dispatch = useDispatch();
  const [selectedRow, setSleetedRow] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [count, setCount] = useState(1);
  const history = useHistory();
  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const tableSelect = useTableSelectSearch({
    saveParams: true,
    filterMultiple: true,
  });

  const contractList = useSelector((state) => state.contractList);
  const layoutContext = useContext(LayoutContext);
  const [list, setList] = useState(props.data);
  const [current, setCurrent] = useState(null);
  ////
  const location = useLocation();
  const isMobile = useIsMobile();

  const searchParams = qs.parse(location.search);

  const [tableInfo, setTableInfo] = useState({
    pagination: {
      current: searchParams.page ? +searchParams.page : 1,
      defaultPageSize: 20,
    },
  });

  const [projectStatusModal, setProjectStatusModal] = useState(false);

  useEffect(() => {
    setList(props.data);
  }, [props.data]);

  const generateIcons = (record) => {
    const detailOnClick = () => {
      history.push(getLink(pageNames.contract.view, record.id));
    };

    const deleteOnClick = () => {
      if (record.subject !== "دفتر ستاد") {
        handleDelete([record.id]);
      }
    };

    const editOnClick = () => {
      history.push(getLink(pageNames.contract.edit, record.id));
    };

    return [
      {
        name: "detail",
        onClick: detailOnClick,
      },
      {
        name: "edit",
        onClick: editOnClick,
        permission: EDIT_CONTRACT,
      },
      {
        name: "delete",
        onClick: deleteOnClick,
        permission: DELETE_CONTRACT,
      },
    ];
  };

  const otherActions = (record) => {
    const actions = [
      {
        title: "مدیریت پیمان",
        onClick: () =>
          history.push(
            `${pageNames.dashboard.peymanManagement.list}?contract=${record.id}`
          ),
        hidden: layoutContext.contractTypeTab === "sub",
      },
      {
        title: "پیشرفت پروژه",
        onClick: () =>
          history.push(
            `${pageNames.dashboard.projectProgress}?contract=${record.id}`
          ),
        hidden: layoutContext.contractTypeTab === "sub",
      },
      {
        title: " گزارش تولید",
        onClick: () =>
          history.push(
            `${pageNames.dashboard.productionReport.list}?contract=${record.id}`
          ),
        hidden:
          record.activity !== "mineral" ||
          layoutContext.contractTypeTab === "sub",
      },
      {
        title: "وضعیت پروژه",
        onClick: () => {
          setProjectStatusModal(true);
          setCurrent(record.id);
        },
      },
    ];
    return actions.filter((el) => !el.hidden).length > 0 ? (
      <Menu>
        {actions.map((item) => (
          <AppMenuItem
            key={item.id}
            onClick={item.onClick}
            hidden={item.hidden}
          >
            {item.title}
          </AppMenuItem>
        ))}
      </Menu>
    ) : (
      false
    );
  };

  const subTablegenerateIcons = (record) => {
    const list = [
      {
        name: "detail",
        onClick: () =>
          history.push(getLink(pageNames.contract.view, record.id)),
      },
      {
        name: "edit",
        onClick: () =>
          history.push(getLink(pageNames.contract.edit, record.id)),
        permission: EDIT_CONTRACT,
      },
      {
        name: "delete",
        onClick: () => handleDelete([record.id]),
        permission: DELETE_CONTRACT,
        hide: record.subject === "دفتر ستاد",
      },
    ];
    return list;
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

    if (pagination.current === 1 && count !== 1) setCount(1);
    else if (pagination.current > 1) setCount(pagination.current * 10 + 1);

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

  let columns = [
    {
      width: 65,
      title: "",
      align: "center",
      key: "count",
      dataIndex: "count",
      render: (text, record, index) => {
        return index + count;
      },
    },
    {
      // width: 130,
      title: "موضوع قرارداد",
      key: "subject",
      dataIndex: "subject",
      ...tableSearch("subject", "موضوع قرارداد"),
      sorter: (a, b) =>
        a.subject ? a.subject.localeCompare(b.subject) : false,
      render: (text, record) => (
        <p className="tabel-big-text">{record.subject}</p>
      ),
    },
    {
      // width: 100,
      title: "نوع قرارداد",
      key: "type",
      dataIndex: "type",
      ...tableSelect("type", "نوع قرارداد", {
        filters: [
          {
            text: "قرارداد عمرانی",
            value: "main_civil",
          },
          {
            text: "قرارداد غیر عمرانی",
            value: "main_non_civil",
          },
        ],
      }),
      render: typeRender,
      sorter: (a, b) => (a.type ? a.type.localeCompare(b.type) : false),
      onFilter: (value, record) => record.type.indexOf(value) === 0,
    },
    {
      // width: 100,
      title: "شماره قرارداد",
      key: "contractNumber",
      dataIndex: "contractNumber",
      ...tableSearch("contractNumber", "شماره قرارداد"),
      sorter: (a, b) =>
        a.contractNumber ? a.contractNumber - b.contractNumber : false,
      render: (text, record) =>
        record.contractNumber ? (
          <StyledNumber>{record.contractNumber} </StyledNumber>
        ) : (
          wrongText
        ),
    },
    {
      // width: 100,
      title: "کد کارگاهی و ردیف پیمان",
      key: "workshopCode",
      dataIndex: "workshopCode",
      ...tableSearch("workshopCode", "کد کارگاهی و ردیف پیمان", {
        multipleColumn: ["workshopCode", "row"],
      }),
      sorter: (a, b) =>
        a.workshopCode ? a.workshopCode - b.workshopCode : false,
      render: (workshopCode, record) => {
        return (workshopCode || "نامشخص") + "  -  " + (record.row || " نامشخص");
      },
    },
  ];

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

  const mainColumn = [
    {
      // width: 100,
      title: "کارفرما",
      key: "employer1",
      dataIndex: "employer",
      ...tableSearch("employer", "کارفرما", {
        multipleColumn: ["employer", "employer"],
      }),

      sorter: (a, b) => {
        if (a.employer) {
          return a.employer ? a.employer.localeCompare(b.employer) : false;
        } else if (a.employer) {
          return a.employer ? a.employer.localeCompare(b.employer) : false;
        }
      },

      render: (text, record) => {
        if (record.employer) {
          return <p>{record.employer}</p>;
        } else if (record.employerId) {
          return <p>{record.employerId}</p>;
        } else {
          return wrongText;
        }
      },
    },
    {
      // width: 100,
      title: "نوع فعالیت",
      key: "activity",
      dataIndex: "activity",
      ...tableSelect("activity", "نوع قرارداد", {
        filters: [
          {
            text: " معدنی",
            value: "mineral",
          },
          {
            text: " غیر معدنی",
            value: "non_mineral",
          },
        ],
      }),
      render: (activity) => (activity === "mineral" ? "معدنی" : "غیرمعدنی"),
      sorter: (a, b) =>
        a.activity ? a.activity.localeCompare(b.activity) : false,
      onFilter: (value, record) => {
        return value === "mineral"
          ? record.activity?.indexOf(value) === 0
          : record.activity !== "mineral";
      },
    },

    {
      // width: 80,
      align: "center",
      title: "تنظیمات",
      key: "action",
      render: (text, record) => {
        return (
          <TableActions
            list={generateIcons(record)}
            moreMenu={otherActions(record)}
          />
        );
      },
    },
  ];

  const subColumn = [
    {
      // width: 100,
      title: "پیمان اصلی",
      key: "mainContractId",
      dataIndex: "mainContractId",
      ...tableSearch("mainContractId", "پیمان اصلی"),
    },
    {
      // width: 100,
      title: "پیمانکار",
      key: "contractorId",
      dataIndex: "contractorId",
      ...tableSearch("contractorId", "پیمانکار"),
    },
    {
      // width: 80,
      align: "center",
      title: "تنظیمات",
      key: "action",
      render: (text, record) => {
        return (
          <TableActions
            list={subTablegenerateIcons(record)}
            moreMenu={otherActions(record)}
          />
        );
      },
    },
  ];

  if (layoutContext.contractTypeTab === "main") {
    Array.prototype.push.apply(columns, mainColumn);
  } else {
    Array.prototype.push.apply(columns, subColumn);
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSleetedRow(selectedRowKeys);
      props.onSelection && props.onSelection(selectedRows);
    },
  };

  const handleDelete = (list) => {
    props.setLoading(true);
    deleteContract(list, setDeleteLoading)
      .then(() => {
        props.setLoading(false);
        props.getList();
        setSleetedRow([]);

        // remove item from contract list
        let copyContractList = [...contractList];

        for (let i = 0; i < list.length; i++) {
          let index = copyContractList.findIndex((el) => el.id === list[i]);
          if (index > -1) {
            copyContractList.splice(index, 1);
          }
        }
        dispatch(setContractList(copyContractList));
      })
      .catch((err) => {
        props.setLoading(false);
        message.error(err.data);
      });
  };

  // const deleteGroup = () => (
  //   <Popconfirm
  //     placement="leftTop"
  //     title={"آیا برای حذف اطمینان دارید ؟"}
  //     onConfirm={() => handleDelete(selectedRow)}
  //     okText="بله"
  //     cancelText="خیر"
  //   >
  //     <Button type="danger">حذف</Button>
  //   </Popconfirm>
  // );

  const handleOnInsuranceBtnClick = (record) => {
    const contractId = record?.id;

    if (contractId) {
      const newPath =
        getLink(pageNames.personnel.insurance.tamin.list) +
        "?contract=" +
        contractId;
      history.push(newPath);
    }
  };

  const mobileItemActions = [
    {
      name: "ویرایش",
      onClick: (record) =>
        history.push(getLink(pageNames.contract.edit, record.id)),
      permission: EDIT_CONTRACT,
    },
    {
      name: "حذف",
      onClick: (record) => handleDelete([record.id]),
      permission: DELETE_CONTRACT,
      hide: (record) => record.subject === "دفتر ستاد",
    },
    {
      name: "بیمه تامین اجتماعی",
      onClick: handleOnInsuranceBtnClick,
    },
    {
      name: "مدیریت پیمان",
      onClick: (record) =>
        history.push(
          `${pageNames.dashboard.peymanManagement.list}?contract=${record.id}`
        ),
    },
    {
      name: "پیشرفت پروژه",
      onClick: (record) =>
        history.push(
          `${pageNames.dashboard.projectProgress}?contract=${record.id}`
        ),
    },
    {
      name: " گزارش تولید",
      onClick: (record) =>
        history.push(
          `${pageNames.dashboard.productionReport.list}?contract=${record.id}`
        ),
      hide: (record) => record.activity !== "mineral",
    },
    {
      name: "وضعیت پروژه",
      onClick: (record) => {
        setProjectStatusModal(true);
        setCurrent(record.id);
      },
    },
  ];

  if (props.loading) {
    return <LoadingLogo />;
  }

  return (
    <>
      <ResponsiveList
        dataSource={list}
        pagination={tableInfo?.pagination}
        tableInfo={tableInfo}
        selected={selectedRow}
        setSelected={setSleetedRow}
        setTableInfo={setTableInfo}
        filterMode="client"
        itemActions={mobileItemActions}
        showFilters={true}
        columns={columns}
        viewLink={(record) => getLink(pageNames.contract.view, record.id)}
        titleKeys={["subject"]}
        initialData={props.data}
        setData={setList}
        rowKey={(record) => record.id}
        onRow={() => false}
        rowSelection={{ ...rowSelection }}
        onChange={handleTableChange}
        // footer={selectedRow.length > 0 && deleteGroup}
      />
      {projectStatusModal ? (
        <AppModal
          visible={projectStatusModal}
          onCancel={() => setProjectStatusModal(false)}
          footer={null}
          title="وضعیت پروژه"
        >
          <ProjectStatusModal
            id={current}
            onCancel={() => setProjectStatusModal(false)}
          />
        </AppModal>
      ) : (
        ""
      )}
    </>
  );
};

export default List;
