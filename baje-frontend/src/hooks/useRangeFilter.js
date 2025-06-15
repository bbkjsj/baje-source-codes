import React from "react";
import { Input, Button, Space, Checkbox, Form, Row, Col } from "antd";
import Highlighter from "react-highlight-words";
import { CalendarOutlined, FilterFilled } from "@ant-design/icons";
import { useState } from "react";
import { convertToShamsi, numberNormalize } from "_helpers";
import AppButton from "components/general/AppButton";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import AppNumInput from "components/general/AppNumInput";
import qs from "query-string";
import { useHistory, useLocation } from "react-router-dom";

export default function useRangeFilter(
  options = { saveParams: false, filterMultiple: false }
) {
  const [state, setState] = useState({
    searchText: "",
    searchedColumn: "",
  });

  const location = useLocation();
  const history = useHistory();

  const [form] = Form.useForm();

  let searchInput;
  let timeout;
  let timeout2;

  const onChangeForm = (allValues, setValue) => {
    setValue([allValues.from + "," + allValues.to]);
  };

  const getColumnSearchProps = (dataIndex, title, config = {}) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Form
          form={form}
          name="filter"
          initialValues={{ from: 0 }}
          onValuesChange={(value, allValue) =>
            onChangeForm(allValue, setSelectedKeys)
          }
          onFinish={() => {
            handleSearch(selectedKeys, confirm, dataIndex);
          }}
        >
          <Row>
            <Col span={24}>
              <Form.Item name="from" normalize={numberNormalize}>
                <AppNumInput placeholder="از" type="search" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="to" normalize={numberNormalize}>
                <AppNumInput placeholder="تا" type="search" />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: "flex" }}>
            <AppButton
              variant="danger"
              onClick={() => {
                handleReset(clearFilters, dataIndex);
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
              // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              htmlType="submit"
            >
              تایید
            </AppButton>
          </div>
        </Form>

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
      <FilterFilled style={{ color: filtered ? "#f5222d" : "#bfbfbf" }} />
    ),
    onFilter: (value, record) => {
      let [from, to] = value.split(",");

      const check = (number) => {
        if (to && from && to !== "undefined" && from !== "undefined") {
          if (
            parseFloat(number) >= parseFloat(from) &&
            parseFloat(number) <= parseFloat(to)
          ) {
            return number;
          }
        } else if (from && from !== "undefined") {
          if (parseFloat(number) >= parseFloat(from)) {
            return number;
          }
        } else if (to && to !== "undefined") {
          if (parseFloat(number) <= parseFloat(to)) {
            return number;
          }
        }
      };

      if (config.hasOwnProperty("customConvert")) {
        let converted = config.customConvert(record[dataIndex]);
        return check(converted);
      } else {
        return check(record[dataIndex]);
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
    console.log("selectedKeys", selectedKeys);

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

    // add to query params
    if (selectedKeys[0] && options.saveParams) {
      const queryParams = qs.parse(location.search);

      // temp fix since the api doesn't support multiple search params
      if (!options.filterMultiple) {
        for (let key in queryParams) {
          if (key !== "page" && key !== "sort" && key !== "sort_order") {
            delete queryParams[key];
          }
        }
      }

      const newQueries = { ...queryParams, [dataIndex]: selectedKeys[0] };
      history.replace({ search: qs.stringify(newQueries) });
    } else {
      const queryParams = qs.parse(location.search);
      if (queryParams[dataIndex]) {
        delete queryParams[dataIndex];
        history.replace({ search: qs.stringify(queryParams) });
      }
    }
  };

  const handleReset = (clearFilters, dataIndex) => {
    form.resetFields();
    clearFilters();
    setState({ ...state, searchText: "" });
    const queryParams = qs.parse(location.search);
    if (queryParams[dataIndex]) {
      delete queryParams[dataIndex];
      history.replace({ search: qs.stringify(queryParams) });
    }
  };

  return getColumnSearchProps;
}
