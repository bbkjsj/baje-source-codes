import { Input, message, Select, Space, Spin, Table } from "antd";
import AppButton from "components/general/AppButton";
import React, { useState, useEffect } from "react";
import axios from "api/appAxios";
import AppTable from "./general/AppTable";

const NidModal = (props) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchBy, setSearchBy] = useState("last_name");
  const [searchText, setSearchText] = useState("");
  const [rows, setRows] = useState([]);

  const columns = [
    {
      width: 65,
      title: "",
      align: "center",
      key: "number",
      dataIndex: "number",
      render: (text, record) => {
        return rows.indexOf(record) + 1;
      },
    },
    {
      title: "نام",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "نام خانوادگی",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "نام پدر",
      dataIndex: "father_name",
      key: "father_name",
    },
  ];

  const rowSelection = {
    type: "checkbox",
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: false,
    }),
  };

  const searchUsers = (body) => {
    setLoading(true);
    axios
      .post("/api/admin/personnel/search/byname", body || undefined)
      .then((res) => {
        setRows(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        message.error("عملیات ناموفق، لطفا مجددا تلاش کنید");
      });
  };

  const onSearch = (val) => {
    const body = {};
    body[searchBy] = val;
    searchUsers(body);
  };

  return (
    <div className="nids-modal">
      <p className="text-12">جستجو بر اساس:</p>
      <div className="w-100 flex">
        <Select
          defaultValue="last_name"
          onChange={(val) => setSearchBy(val)}
          style={{ width: "150px" }}
          value={searchBy}
        >
          <Select.Option value="first_name">نام</Select.Option>
          <Select.Option value="last_name">نام خانوادگی</Select.Option>
          <Select.Option value="father_name">نام پدر</Select.Option>
        </Select>
        <Input.Search
          placeholder="جستجوی کاربران"
          allowClear
          onSearch={onSearch}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          enterButton
          className="flex-grow-1"
        />
      </div>
      <Spin spinning={loading}>
        <AppTable
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={rows}
          scrollX={1}
          rowSelection={{ ...rowSelection }}
        />

        <Space>
          <AppButton
            className="big-btn mt-3"
            size="large"
            variant="primary"
            htmlType="submit"
            disabled={selectedRows.length !== 1}
            onClick={() => {
              if (selectedRows[0] && selectedRows[0].national_number) {
                props.onConfirm(selectedRows[0].national_number);
                props.onCancel();
                setRows([]);
                setSelectedRows([]);
                setSearchBy("last_name");
                setSearchText("");
              }
            }}
          >
            تایید
          </AppButton>
          <AppButton
            className="big-btn mt-3"
            size="large"
            variant="text"
            onClick={() => props.onCancel()}
          >
            بستن
          </AppButton>
        </Space>
      </Spin>
    </div>
  );
};

export default NidModal;
