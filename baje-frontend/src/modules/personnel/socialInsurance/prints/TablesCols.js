export const disket = [
  {
    title: "ردیف",
    align: "center",
    key: "row",
    dataIndex: "row",
    render: (text, record, index) => {
      return index + 1;
    },
  },
  {
    title: "عنوان",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "مبلغ به ریال",
    dataIndex: "price",
    key: "price",
  },
];
