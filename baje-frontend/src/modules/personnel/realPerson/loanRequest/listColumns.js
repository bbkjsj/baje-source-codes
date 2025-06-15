import React from "react";
import { getLink, priceNormalizer, commaPriceToInt } from "_helpers";
import { pageNames } from "constant";
import TableChangeStatus from "components/general/TableChangeStatus";
import TableActions from "components/general/TableActions";

const generateIcons = (record, history, deleteItem) => {
  const detailOnClick = () => {
    history.push(
      getLink(pageNames.personnel.realPerson.loanRequest.view, {
        id: record.id,
        nid: record.national_number,
      })
    );
  };

  const editOnClick = () => {
    history.push(
      getLink(pageNames.personnel.realPerson.loanRequest.edit, {
        id: record.id,
        nid: record.national_number,
      })
    );
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
    { name: "edit", onClick: editOnClick },
    {
      name: "delete",
      onClick: deleteOnClick,
      warningText: !record.relation && "آیا از حذف این مورد اطمینان دارید؟",
    },
  ];
};

export const renderColumns = (
  list,
  history,
  deleteItem,
  updateList,
  setLoadingList,
  tableSearch
) => {
  return [
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
      width: 200,
      title: "نام و نام خانوادگی",
      dataIndex: "name",
      ...tableSearch("full_name", "نام و نام خانوادگی", {
        multipleColumn: ["first_name", "last_name"],
      }),
      sorter: (a, b) =>
        a.first_name ? a.first_name.localeCompare(b.first_name) : false,
      render: (text, record) => {
        return <span>{record.first_name + " " + record.last_name}</span>;
      },
    },
    {
      //  width: 100,
      title: "کد ملی",
      dataIndex: "national_number",
      ...tableSearch("national_number", "کد ملی"),
      sorter: (a, b) =>
        a.national_number ? a.national_number - b.national_number : false,
    },
    {
      //  width: 100,
      title: "مبلغ مساعده",
      dataIndex: "amount",
      render: (text) => {
        return priceNormalizer(text);
      },
    },
    {
      //  width: 100,
      title: "تعداد اقساط",
      dataIndex: "number_of_installment",
      ...tableSearch("number_of_installment", "تعداد اقساط"),
      sorter: (a, b) =>
        a.number_of_installment
          ? a.number_of_installment - b.number_of_installment
          : false,
    },
    {
      //  width: 100,
      title: "مبلغ پرداختی",
      dataIndex: "paid_amount",
      ...tableSearch("paid_amount", "مبلغ پرداختی"),
      sorter: (a, b) =>
        a.number_of_installment
          ? priceNormalizer(a.paid_amount) - priceNormalizer(b.paid_amount)
          : false,
      render: (text, record) => {
        return (
          <span>
            {record.paid_amount ? priceNormalizer(record.paid_amount) : 0}
          </span>
        );
      },
    },
    {
      //  width: 100,
      title: "مانده",
      dataIndex: "remained",
      ...tableSearch("remained", "مانده"),
      // sorter: (a, b) =>
      //   a.number_of_installment
      //     ? priceNormalizer(a.remained) - priceNormalizer(b.remained)
      //     : false,
      render: (text, record) => {
        return (
          <span>
            {record.paid_amount
              ? priceNormalizer(
                  parseFloat(record.amount) - parseFloat(record.paid_amount)
                )
              : priceNormalizer(record.amount)}
          </span>
        );
      },
    },
    // {
    //   //  width: 60,
    //   align: "center",
    //   title: "وضعیت",
    //   dataIndex: "is_approved",
    //   key: "is_approved",
    //   render: (text, record) => {
    //     return (
    //       <TableChangeStatus
    //         value={text === 1 ? true : false}
    //         options={[
    //           { label: "تایید نهایی", value: true },
    //           { label: "عدم تایید", value: false },
    //         ]}
    //         id={record.id}
    //         requestApi={null}
    //         afterChange={updateList}
    //         setLoadingList={setLoadingList}
    //         disabled={true}
    //       />
    //     );
    //   },
    // },

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
};
