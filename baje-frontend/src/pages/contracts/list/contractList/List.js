import React, { useState, useContext } from "react";
import { Table, Spin, Popconfirm, Button, message, Menu } from "antd";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { deleteContractor } from "../../utils/api";
import LoadingLogo from "../../../../components/general/LoadingLogo";
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
  const tableSearch = useTableSearch();
  const tableSelect = useTableSelectSearch();

  const contractList = useSelector((state) => state.contractList);
  const layoutContext = useContext(LayoutContext);
  const generateIcons = (record) => {
    const detailOnClick = () => {
      history.push(getLink(pageNames.contract.view, record.id));
    };

    const deleteOnClick = () => {
      return record.subject !== "دفتر ستاد"
        ? () => handleDelete([record.id])
        : false;
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
      },
      {
        title: "پیشرفت پروژه",
        onClick: () =>
          history.push(
            `${pageNames.dashboard.projectProgress}?contract=${record.id}`
          ),
      },
      {
        title: " گزارش تولید",
        onClick: () =>
          history.push(
            `${pageNames.dashboard.productionReport.list}?contract=${record.id}`
          ),
        hidden: record.activity !== "mineral",
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
      key: "number",
      dataIndex: "number",
      ...tableSearch("number", "شماره قرارداد"),
      sorter: (a, b) => (a.number ? a.number - b.number : false),
      render: (text, record) =>
        record.number ? (
          <StyledNumber>{record.number} </StyledNumber>
        ) : (
          wrongText
        ),
    },
    {
      // width: 100,
      title: "کد کارگاهی و ردیف پیمان",
      key: "workshop_code",
      dataIndex: "workshop_code",
      ...tableSearch("workshop_code", "کد کارگاهی و ردیف پیمان", {
        multipleColumn: ["workshop_code", "row"],
      }),
      sorter: (a, b) =>
        a.workshop_code ? a.workshop_code - b.workshop_code : false,
      render: (workshop_code, record) => {
        return workshop_code + "-" + record.row;
      },
    },
  ];

  const mainColumn = [
    {
      // width: 100,
      title: "کارفرما",
      key: "employer1",
      dataIndex: "employer1",
      ...tableSearch("employer1", "کارفرما", {
        multipleColumn: ["employer1", "employer"],
      }),

      sorter: (a, b) => {
        if (a.employer1) {
          return a.employer1 ? a.employer1.localeCompare(b.employer1) : false;
        } else if (a.employer) {
          return a.employer ? a.employer.localeCompare(b.employer) : false;
        }
      },

      render: (text, record) => {
        if (record.employer1) {
          return <p>{record.employer1}</p>;
        } else if (record.employer) {
          return <p>{record.employer}</p>;
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
      key: "mainPeyman",
      dataIndex: "mainPeyman",
      ...tableSearch("mainPeyman", "پیمان اصلی", {
        multipleColumn: ["mainPeyman", "mainPeyman"],
      }),
    },
    {
      // width: 100,
      title: "پیمانکار",
      key: "contactor",
      dataIndex: "contactor",
      ...tableSearch("contactor", "پیمانکار", {
        multipleColumn: ["contactor", "contactor"],
      }),
    },
    {
      // width: 80,
      align: "center",
      title: "تنظیمات",
      key: "action",
      render: (text, record) => {
        return <TableActions list={subTablegenerateIcons(record)} />;
      },
    },
  ];

  if (layoutContext.contractTypeTab === "main") {
    Array.prototype.push.apply(columns, mainColumn);
  } else {
    Array.prototype.push.apply(columns, subColumn);
  }

  const handleChange = (pagination, filters, sorter) => {
    if (pagination.current === 1 && count !== 1) setCount(1);
    else if (pagination.current > 1) setCount(pagination.current * 10 + 1);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSleetedRow(selectedRowKeys);
      props.onSelection && props.onSelection(selectedRows);
    },
  };

  const handleDelete = (list) => {
    deleteContractor(list, setDeleteLoading)
      .then(() => {
        props.getList();
        setSleetedRow([]);

        // remove item from contract list
        let copyContractList = [...contractList];

        for (let i = 0; i < list.length; i++) {
          let index = copyContractList.findIndex(
            (el) => el.contract_id === list[i]
          );
          if (index > -1) {
            copyContractList.splice(index, 1);
          }
        }
        dispatch(setContractList(copyContractList));
      })
      .catch((err) => {
        message.error(err.data);
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

  if (props.loading) {
    return <LoadingLogo />;
  }

  return (
    <>
      <AppTable
        onChange={handleChange}
        rowKey={(record) => record.id}
        onRow={() => false}
        columns={columns}
        dataSource={props.data}
        rowSelection={{ ...rowSelection }}
        // footer={selectedRow.length > 0 && deleteGroup}
      />
    </>
  );
};

export default List;
