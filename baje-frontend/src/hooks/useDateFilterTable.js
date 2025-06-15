import React from "react";
import { Input, Button, Space, Checkbox, Form, Row, Col } from "antd";
import Highlighter from "react-highlight-words";
import { CalendarOutlined } from "@ant-design/icons";
import { useState } from "react";
import { dateToJalali } from "_helpers";
import AppButton from "components/general/AppButton";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";

export default function useDateFilterTable() {
  const [state, setState] = useState({
    searchText: "",
    searchedColumn: "",
  });

  const [form] = Form.useForm();

  let searchInput;
  let timeout;
  let timeout2;

  const getColumnSearchProps = (dataIndex, title, config = {}) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Form form={form} name="filter">
          <Row>
            <Col span={24}>
              <CustomDatePicker
                form={form}
                label="تاریخ"
                name="date"
                plain
                onChange={() => {
                  setSelectedKeys([form.getFieldValue("date")]);
                }}
                //   rules={rules}
                //   disabled={detail}
              />
            </Col>
          </Row>
        </Form>

        <div style={{ display: "flex" }}>
          <AppButton
            variant="danger"
            onClick={() => {
              handleReset(clearFilters);
              form.setFieldsValue({ date: null });
            }}
            block
            style={{ marginLeft: "3px" }}
          >
            پاک کردن
          </AppButton>
          <AppButton
            block
            variant="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          >
            فیلتر
          </AppButton>
        </div>

        {/* <Checkbox.Group
          options={[
            { label: "علی", value: "علی" },
            { label: "حسن", value: "حسن" },
            { label: "عباس", value: "عباس" },
          ]}
          onChange={(v) => {
            // let value = v[0];
            // console.log("oihigweg", v);
            // let arrValues = [...selectedKeys];
            // arrValues.push(value);

            setSelectedKeys(v ? v : []);
            handleSearch(v ? v : [], confirm, dataIndex);
          }}
        /> */}

        {/* <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{width: 90}}
          >
            جستجو
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{width: 90}}
          >
            ریست
          </Button>
        </Space> */}
      </div>
    ),
    filterIcon: (filtered) => (
      <CalendarOutlined
        style={{ color: filtered ? "#f5222d" : "#bfbfbf", fontSize: 13 }}
      />
    ),
    onFilter: (value, record) => {
      if (config.hasOwnProperty("period")) {
        let fullDate =
          dateToJalali(record.from_date) + " " + dateToJalali(record.to_date);

        return fullDate ? fullDate.toString().includes(value) : "";
      } else {
        return record[dataIndex]
          ? dateToJalali(record[dataIndex]).toString().includes(value)
          : "";
      }
    },

    // onFilterDropdownVisibleChange: (visible) => {
    //   if (visible) {
    //     setTimeout(() => searchInput.select(), 100);
    //   }
    //   // return false;
    // },
    render: (text) =>
      state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    // console.log("selectedKeys", selectedKeys);

    const allRows = document.getElementsByClassName("ant-table-row");
    for (let tr of allRows) {
      tr.classList.add("removing");
    }

    confirm();
    setState({
      ...state,
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
    const filteredRows = document.getElementsByClassName("ant-table-row");
    for (let tr of filteredRows) {
      tr.classList.remove("removing");
    }
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setState({ ...state, searchText: "" });
  };

  return getColumnSearchProps;
}
