import { timeToFa, dateToInt, convertToShamsi } from "_helpers";

export const renderColumns = (
  list,
  history,
  tableSearch,
  tableDate,
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
      title: "نام و نام خانوادگی",
      align: "center",
      key: "personName", // sub_name
      dataIndex: "personName",
      ...tableSearch("personName", "نام و نام خانوادگی"),
      render: (personName, record) => {
        if (!personName) {
          return record.personName;
        }
        return personName;
      },
      sorter: (a, b) =>
        a.personName ? a.personName.localeCompare(b.personName) : false,
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
      title: "شماره قرارداد",
      align: "center",
      key: "contract_number",
      dataIndex: "contract_number",
      ...tableSearch("contract_number", "شماره قرارداد"),
      sorter: (a, b) =>
        a.contract_number
          ? a.contract_number.localeCompare(b.contract_number)
          : false,
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
