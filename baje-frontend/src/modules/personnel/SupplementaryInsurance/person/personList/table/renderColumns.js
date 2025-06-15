import React from "react";
import { Menu } from "antd";
import AppMenuItem from "components/general/AppMenuItem";
import { timeToFa, getLink, dateToInt } from "_helpers";
import { pageNames } from "constant";
import { _UPDATE_PERSON_STATUS } from "modules/personnel/SupplementaryInsurance/person/util/api";
import TableChangeStatus from "components/general/TableChangeStatus";
import TableActions from "components/general/TableActions";

const generateIcons = (record, history, deleteItem, onEdit, insuranceID) => {
  const detailOnClick = () => {
    console.info(record.main_name);
    history.push(
      getLink(pageNames.personnel.insurance.supplymentary.personnel.history, {
        id: record.main_id,
        insuranceID: insuranceID,
        personName: record.main_name,
      })
    );
  };

  const editOnClick = () => {
    // console.log(record, "!record");
    onEdit(record);
  };
  const deleteOnClick = () => {
    deleteItem([record.id], record.relation);
  };

  return [
    {
      name: "detail",
      onClick: detailOnClick,
      hide: true,
    },
    {
      name: "edit",
      onClick: editOnClick,
      hide: record.is_approved == 1,
    },
    {
      name: "delete",
      onClick: deleteOnClick,
      hide: record.is_approved == 1,
      warningText:
        (!record.relation || record.relation === "main") &&
        "این فرد بیمه شده اصلی است و با حذف آن تمام افراد تبعی اش حذف می شوند. آیا همچنان تمایل به حذف دارید؟",
    },
  ];
};
const otherActions = (
  record,
  history,
  insuranceID,
  onClickAddSubordiante,
  displayAddPerson
) => {
  const actionItems = [
    {
      title: "مشاهده سوابق",
      onClick: () => {
        history.push(
          getLink(
            pageNames.personnel.insurance.supplymentary.personnel.history,
            {
              id: record.main_id,
              personName: record.main_name,
            }
          )
        );
      },

      hidden: !(!record.relation || record.relation === "main"),
    },
    {
      title: "افزودن تبعی ",
      onClick: () => {
        onClickAddSubordiante(record);
      },

      hidden:
        !(!record.relation || record.relation === "main") || !displayAddPerson
          ? true
          : false,
      // hidden: false,
    },
  ];

  return actionItems.filter((item) => !item.hidden).length ? (
    <Menu>
      {actionItems.map((item) => (
        <AppMenuItem
          key={item.title}
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

export const renderColumns = (
  list,
  history,
  deleteItem,
  updateList,
  setLoadingList,
  onEdit,
  insuranceID,
  tableSearch,
  tableDate,
  tableSelect,
  onClickAddSubordiante,
  displayAddPerson,
  searchParams,
  disabledFilters
) => {
  let columns = [
    {
      width: 65,
      title: "",
      align: "center",
      key: "count",
      dataIndex: "count",
      render: (text, record, index) => {
        return list.indexOf(record) + 1;
      },
    },
    {
      // width: 100,
      title: "نام بیمه شده ",
      align: "center",
      key: "sub_name",
      dataIndex: "sub_name",
      ...(!disabledFilters.includes("sub_name")
        ? tableSearch("sub_name", "نام و نام خانوادگی")
        : []),
      sorter: (a, b) =>
        a.sub_name ? a.sub_name.localeCompare(b.sub_name) : false,
      render: (_, record) => {
        return record.personnelFirstName + " " + record.personnelLastName;
      },
    },
    {
      // width: 100,
      title: "کد ملی بیمه شده",
      align: "center",
      key: "personnelNationalNumber",
      dataIndex: "personnelNationalNumber",
      ...(!disabledFilters.includes("personnelNationalNumber")
        ? tableSearch("personnelNationalNumber", "کد ملی بیمه شده")
        : []),
      sorter: (a, b) =>
        a.personnelNationalNumber
          ? a.personnelNationalNumber.localeCompare(b.personnelNationalNumber)
          : false,
    },
    {
      // width: 100,
      title: "نام  بیمه شده اصلی",
      align: "center",
      key: "main_name",
      dataIndex: "main_name",
      ...(!disabledFilters.includes("main_name")
        ? tableSearch("main_name", "نام و نام خانوادگی")
        : []),
      // render: (sub_name, record) => {
      //   if (!sub_name) {
      //     return record.main_name;
      //   }
      //   return sub_name;
      // },
      sorter: (a, b) =>
        a.main_name ? a.main_name.localeCompare(b.main_name) : false,
      render: (_, record) => {
        return (
          record.mainPersonnelFirstName + " " + record.mainPersonnelLastName
        );
      },
    },
    {
      // width: 100,
      title: "کد ملی بیمه شده اصلی",
      align: "center",
      key: "mainPersonnelNationalNumber",
      dataIndex: "mainPersonnelNationalNumber",
      ...(!disabledFilters.includes("mainPersonnelNationalNumber")
        ? tableSearch("mainPersonnelNationalNumber", "کد ملی بیمه شده اصلی")
        : []),
      sorter: (a, b) =>
        a.mainPersonnelNationalNumber
          ? a.mainPersonnelNationalNumber.localeCompare(
              b.mainPersonnelNationalNumber
            )
          : false,
    },

    {
      //  width: 100,
      title: "نسبت",
      align: "center",
      key: "relation",
      dataIndex: "relation",
      ...(!disabledFilters.includes("relation")
        ? tableSelect("relation", "نسبت", {
            filters: [
              {
                text: "پدر",
                value: "father",
              },
              {
                text: "مادر",
                value: "mother",
              },
              {
                text: "همسر",
                value: "spouse",
              },
              {
                text: "فرزند پسر",
                value: "son",
              },
              {
                text: "فرزند دختر",
                value: "daughter",
              },
              {
                text: "اصلی",
                value: "main",
              },
            ],
          })
        : []),

      onFilter: (value, record) => record.relation.indexOf(value) === 0,
      render: (relation, record) => {
        if (!relation || relation === "main") {
          return "اصلی";
        } else if (relation === "father") return "پدر";
        else if (relation === "mother") return "مادر";
        else if (relation === "daughter") return "فرزند دختر";
        else if (relation === "wife") return "همسر";
        else if (relation === "son") return "فرزند پسر";
        return relation;
      },
    },
    {
      //  width: 100,
      title: "از تاریخ",
      align: "center",
      key: "fromDate",
      dataIndex: "fromDate",
      //...tableDate("fromDate", "از تاریخ"),
      render: (fromDate) => {
        return fromDate ? timeToFa(fromDate, false) : "-";
      },
      sorter: (a, b) =>
        a.fromDate ? dateToInt(a.fromDate) - dateToInt(b.fromDate) : false,
    },
    {
      // width: 100,
      title: "تا تاریخ",
      align: "center",
      key: "toDate",
      dataIndex: "toDate",
      //...tableDate("toDate", "تا تاریخ"),
      render: (toDate) => {
        return toDate ? timeToFa(toDate, false) : "-";
      },
      sorter: (a, b) =>
        a.toDate ? dateToInt(a.toDate) - dateToInt(b.toDate) : false,
    },
    {
      //  width: 30,
      align: "center",
      title: "وضعیت",
      dataIndex: "isApproved",
      key: "isApproved",

      ...(!disabledFilters.includes("isApproved")
        ? tableSelect("isApproved", "وضعیت", {
            filters: [
              {
                text: "تایید نهایی",
                value: true,
              },
              {
                text: "عدم تایید",
                value: false,
              },
            ],
          })
        : []),

      onFilter: (value, record) => {
        if (
          (record.isApproved === 0 && value === false) ||
          (record.isApproved === 1 && value === true)
        ) {
          return true;
        }
        return false;
      },
      render: (text, record) => {
        return (
          <TableChangeStatus
            value={record.isApproved == 1 ? true : false}
            options={[
              { label: "تایید نهایی", value: true },
              { label: "عدم تایید", value: false },
            ]}
            id={record.id}
            requestApi={_UPDATE_PERSON_STATUS}
            afterChange={updateList}
            setLoadingList={setLoadingList}
          />
        );
      },
    },

    {
      //  width: 80,
      align: "center",
      title: "تنظیمات",
      key: "action",
      render: (text, record) => {
        return (
          <TableActions
            list={generateIcons(
              record,
              history,
              deleteItem,
              onEdit,
              insuranceID
            )}
            moreMenu={otherActions(
              record,
              history,
              insuranceID,
              onClickAddSubordiante,
              displayAddPerson
            )}
          />
        );
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
  return columns;
};
