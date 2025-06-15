import React from "react";
import { timeToFa, getLink, dateToInt } from "_helpers";
import TableChangeStatus from "components/general/TableChangeStatus";
import { pageNames } from "constant";
import { _UPDATE_PERSON_STATUS } from "modules/personnel/SupplementaryInsurance/person/util/api";
import TableActions from "components/general/TableActions";

const generateIcons = (
  record,
  history,
  deleteItem,
  setEditModal,
  insuranceID
) => {
  console.log("record", record);

  const detailOnClick = () =>
    history.push(
      getLink(pageNames.personnel.insurance.accident.personnel.history, {
        id: record.main_id,
      })
    );

  const editOnClick = () => {
    setEditModal(record.id);
  };
  const deleteOnClick = () => {
    deleteItem([record.id]);
  };

  return [
    {
      name: "detail",
      onClick: detailOnClick,
      hide: record.relation ? true : false,
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
        !record.relation &&
        "این فرد بیمه شده اصلی است و با حذف آن تمام افراد تبعی اش حذف می شوند. آیا همچنان تمایل به حذف دارید؟",
    },
  ];
};

export const renderColumns = (
  list,
  history,
  deleteItem,
  updateList,
  setLoadingList,
  setEditModal,
  insuranceID,
  tableSearch,
  tableDate,
  tableSelect,
  searchParams
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
      title: "کد ملی بیمه شده اصلی",
      align: "center",
      key: "insurer_main",
      dataIndex: "main_national_number",
      ...tableSearch("main_national_number", "کد ملی بیمه شده اصلی"),
      sorter: (a, b) =>
        a.main_national_number
          ? a.main_national_number.localeCompare(b.main_national_number)
          : false,
    },
    {
      // width: 100,
      title: "نام و نام خانوادگی",
      align: "center",
      key: "sub_name",
      dataIndex: "sub_name",
      ...tableSearch("main_name", "نام و نام خانوادگی"),
      render: (sub_name, record) => {
        if (!sub_name) {
          return record.main_name;
        }
        return sub_name;
      },
      sorter: (a, b) =>
        a.main_name ? a.main_name.localeCompare(b.main_name) : false,
    },
    {
      // width: 100,
      title: "کد ملی بیمه شده",
      align: "center",
      key: "sub_natinal_number",
      dataIndex: "sub_natinal_number",
      ...tableSearch("main_national_number", "کد ملی بیه شده"),
      render: (sub_natinal_number, record) => {
        if (!sub_natinal_number) {
          return record.main_national_number;
        }
        return sub_natinal_number;
      },
      sorter: (a, b) =>
        a.main_national_number
          ? a.main_national_number.localeCompare(b.main_national_number)
          : false,
    },
    {
      //  width: 100,
      title: "نسبت",
      align: "center",
      key: "relation",
      dataIndex: "relation",
      ...tableSelect("relation", "نسبت", {
        filters: [
          {
            text: "پدر",
            value: "پدر",
          },
          {
            text: "همسر",
            value: "همسر",
          },
          {
            text: "فرزند پسر",
            value: "فرزند پسر",
          },
          {
            text: "فرزند دختر",
            value: "فرزند دختر",
          },
        ],
      }),

      onFilter: (value, record) => record.relation.indexOf(value) === 0,
      render: (relation, record) => {
        if (!relation) {
          return "اصلی";
        } else if (relation === "father") return "پدر";
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
      key: "start_date",
      dataIndex: "start_date",
      ...tableDate("start_date", "از تاریخ"),
      render: (start_date) => {
        return timeToFa(start_date, false);
      },
      sorter: (a, b) =>
        a.start_date
          ? dateToInt(a.start_date) - dateToInt(b.start_date)
          : false,
    },
    {
      // width: 100,
      title: "تا تاریخ",
      align: "center",
      key: "end_date",
      dataIndex: "end_date",
      ...tableDate("end_date", "تا تاریخ"),
      render: (end_date) => {
        return timeToFa(end_date, false);
      },
      sorter: (a, b) =>
        a.end_date ? dateToInt(a.end_date) - dateToInt(b.end_date) : false,
    },
    {
      //  width: 30,
      align: "center",
      title: "وضعیت",
      dataIndex: "is_approved",
      key: "is_approved",

      ...tableSelect("is_approved", "وضعیت", {
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
      }),

      onFilter: (value, record) => {
        if (
          (record.is_approved === 0 && value === false) ||
          (record.is_approved === 1 && value === true)
        ) {
          return true;
        }
        return false;
      },
      render: (text, record) => {
        return (
          <TableChangeStatus
            value={text === 1 ? true : false}
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
              setEditModal,
              insuranceID
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
