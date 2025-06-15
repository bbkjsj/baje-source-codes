import { timeToFa, dateToInt, convertToShamsi } from "_helpers";

export const renderColumns = (
  list,
  history,
  handleDeleteById,
  tableSearch,
  tableDate
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
      title: "نام و نام خانوادگی",
      align: "center",
      key: "sub_name",
      dataIndex: "sub_name",
      ...tableSearch("sub_name", "نام و نام خانوادگی"),
      render: (sub_name, record) => {
        if (!sub_name) {
          return record.sub_name;
        }
        return sub_name;
      },
      sorter: (a, b) =>
        a.sub_name ? a.sub_name.localeCompare(b.sub_name) : false,
    },
    {
      // width: 100,
      title: "کد ملی",
      align: "center",
      key: "national_number",
      dataIndex: "national_number",
      ...tableSearch("national_number", "کد ملی"),
      sorter: (a, b) =>
        a.national_number
          ? a.national_number.localeCompare(b.national_number)
          : false,
    },
    {
      // width: 100,
      title: "نسبت",
      align: "center",
      key: "relation",
      dataIndex: "relation",
      render: (relation, record) => {
        if (!relation) {
          return "اصلی";
        } else if (relation === "father") return "پدر";
        else if (relation === "daughter") return "فرزند دختر";
        else if (relation === "main") return "اصلی";
        else if (relation === "wife") return "همسر";
        else if (relation === "son") return "فرزند پسر";
        return relation;
      },
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

      onFilter: (value, record) => record.relation.indexOf(value) === 0,
    },

    {
      // width: 100,
      title: "بیمه گر",
      align: "center",
      key: "insurer",
      dataIndex: "insurer",
      ...tableSearch("insurer", "بیمه گر"),
      sorter: (a, b) =>
        a.insurer ? a.insurer.localeCompare(b.insurer) : false,
    },
    {
      // width: 100,
      title: "نوع بیمه",
      align: "center",
      key: "insurance_type",
      dataIndex: "insurance_type",
      sorter: (a, b) =>
        a.insurance_type
          ? a.insurance_type.localeCompare(b.insurance_type)
          : false,

      filters: [
        {
          text: "تکمیلی",
          value: "تکمیلی",
        },
        {
          text: "عمر و حادثه",
          value: "عمر و حادثه",
        },
      ],

      onFilter: (value, record) => record.insurance_type.indexOf(value) === 0,
    },

    {
      // width: 100,
      title: "ازتاریخ",
      align: "center",
      key: "start_date",
      dataIndex: "start_date",
      ...tableDate("start_date", "ازتاریخ"),
      render: (start_date) => {
        return timeToFa(start_date, false);
      },
      sorter: (a, b) =>
        a.start_date
          ? dateToInt(timeToFa(a.start_date, false)) -
            dateToInt(timeToFa(b.start_date, false))
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
        a.end_date
          ? dateToInt(timeToFa(a.end_date, false)) -
            dateToInt(timeToFa(b.end_date, false))
          : false,
    },

    {
      // width: 100,
      title: "توضیحات",
      align: "center",
      key: "description",
      dataIndex: "description",
    },
  ];
  return columns;
};
