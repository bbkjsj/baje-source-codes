import React from "react";
import { timeToFa, getLink, covetFormatDateToFA } from "_helpers";
import TableChangeStatus from "components/general/TableChangeStatus";
import { pageNames } from "constant";
import { _CHANGE_STATUS } from "modules/personnel/realPerson/mission/utils/api";
import TableActions from "components/general/TableActions";
const generateIcons = (record, history, deleteItem) => {
  const detailOnClick = () => {
    history.push(
      getLink(pageNames.personnel.realPerson.mission.view, {
        id: record.id,
      })
    );
  };

  const editOnClick = () => {
    history.push(
      getLink(pageNames.personnel.realPerson.mission.edit, {
        id: record.id,
      })
    );
  };
  const deleteOnClick = () => {
    deleteItem([record.id]);
  };

  var option = [
    {
      name: "detail",
      onClick: detailOnClick,
      hide: record.relation ? true : false,
    },
  ];
  // if status equals to confirm or not Option in table will be changed
  option =
    record.status === "جدید"
      ? [
          ...option,
          { name: "edit", onClick: editOnClick, title: "ویرایش" },
          {
            name: "delete",
            onClick: deleteOnClick,
            title: "حذف",
            warningText:
              !record.relation && "آیا از حذف این مورد اطمینان دارید؟",
          },
        ]
      : option;

  console.info(option);
  return option;
};

export const renderColumns = (
  list,
  history,
  deleteItem,
  updateList,
  setLoadingList,
  tableSearch,
  tableDateFilter,
  tableSelect,
  searchParams
) => {
  let columns = [
    {
      width: 65,
      title: "",
      align: "center",
      key: "number",
      dataIndex: "number",
      render: (text, record) => {
        return list.indexOf(record) + 1;
      },
    },
    {
      //  width: 100,
      title: "نام و نام خانوادگی",
      dataIndex: "name",
      ///multiple
      ...tableSearch("full_name", "نام و نام خانوادگی", {
        multipleColumn: ["first_name", "last_name"],
      }),
      sorter: (a, b) =>
        a.first_name ? a.first_name.localeCompare(b.first_name) : false,
      render: (text, record) => {
        return <span>{`${record.first_name} ${record.last_name}`}</span>;
      },
    },
    {
      //  width: 100,
      title: "دوره",
      dataIndex: "period",
      ...tableDateFilter("period", "دوره", { period: true }),
      render: (text, record) => {
        return (
          <span>{`از ${
            covetFormatDateToFA(record.from_date).split(" ")[0]
          } تا ${covetFormatDateToFA(record.to_date).split(" ")[0]}`}</span>
        );
      },
    },
    {
      //  width: 100,
      title: "محل ماموریت",
      dataIndex: "location",
      ...tableSearch("location", "محل ماموریت"),
      sorter: (a, b) =>
        a.location ? a.location.localeCompare(b.location) : false,
    },
    {
      //  width: 100,
      title: "موضوع ماموریت",
      dataIndex: "subject",
      ...tableSearch("subject", "موضوع ماموریت"),
      sorter: (a, b) =>
        a.subject ? a.subject.localeCompare(b.subject) : false,
    },
    {
      //  width: 30,
      align: "center",
      title: "وضعیت",
      dataIndex: "status",
      key: "status",

      ...tableSelect("status", "وضعیت", {
        filters: [
          {
            text: "تایید نهایی",
            value: "تایید نهایی",
          },
          {
            text: "عدم تایید",
            value: "عدم تایید",
          },
        ],
      }),

      onFilter: (value, record) => {
        if (
          (record.status === "تایید نهایی" && value === "تایید نهایی") ||
          (record.status === "عدم تایید" && value === "عدم تایید")
        ) {
          return true;
        }
        return false;
      },
      render: (status, record) => {
        return (
          <TableChangeStatus
            value={status === null || !status ? "در انتظار تایید" : status}
            options={[
              { label: "تایید نهایی", value: "تایید نهایی" },
              { label: "عدم تایید", value: "عدم تایید" },
            ]}
            id={record.id}
            requestApi={_CHANGE_STATUS}
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
          <TableActions list={generateIcons(record, history, deleteItem)} />
        );
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

  return columns;
};
