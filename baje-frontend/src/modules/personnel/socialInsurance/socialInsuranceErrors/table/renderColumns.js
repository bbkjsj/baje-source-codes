export const renderColumns = (list) => {
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
      title: "کاربر",
      key: "personnel_id",
      dataIndex: "personnel_id",
    },
    {
      // width: 100,
      title: "خطا",
      key: "message",
      dataIndex: "message",
    },
  ];
  return columns;
};
