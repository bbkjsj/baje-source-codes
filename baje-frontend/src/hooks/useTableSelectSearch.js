import React, { useRef } from "react";
import { Input, Button, Space, Checkbox } from "antd";
import Highlighter from "react-highlight-words";
import { FilterFilled } from "@ant-design/icons";
import { useState } from "react";
import { convertToShamsi } from "_helpers";
import AppButton from "components/general/AppButton";
import { Select } from "antd";
import qs from "query-string";
import { useHistory, useLocation } from "react-router-dom";

const { Option } = Select;

export default function useTableSearch(options = { saveParams: false }) {
  const [state, setState] = useState({
    searchText: "",
    searchedColumn: "",
  });
  const location = useLocation();
  const history = useHistory();
  const [searchVal, setSearchVal] = useState("");

  let timeout;
  let timeout2;

  const getColumnSearchProps = (dataIndex, title, config = {}) => ({
    selectFilter: true,
    configFilters: config.filters || null,
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        {config.filters.length > 5 ? (
          <Select
            style={{ width: "100%" }}
            placeholder={title ? `جستجو ${title}` : "جستجو"}
            mode="multiple"
            allowClear
            //defaultOpen
            value={selectedKeys}
            showArrow
            onChange={(val) => {
              if (val === undefined) return;
              setSelectedKeys(val ? val : []);
              handleSearch(val ? val : [], confirm, dataIndex);
            }}
          >
            {config.filters &&
              config.filters.map((item, idx) => (
                <Option value={item.value} key={idx}>
                  {item.text}
                </Option>
              ))}
          </Select>
        ) : (
          <Checkbox.Group
            className="table-filter-checkboxes"
            options={config.filters.map((item) => {
              return { label: item.text, value: item.value };
            })}
            value={selectedKeys}
            onChange={(val) => {
              if (timeout) {
                clearTimeout(timeout);
                timeout = null;
              }
              if (val === undefined) return;
              setSelectedKeys(val ? val : []);

              function fake() {
                handleSearch(val ? val : [], confirm, dataIndex);
              }

              timeout = setTimeout(fake, 100);
            }}
          />
        )}

        {config.filters.length < 6 && (
          <AppButton
            variant="danger"
            onClick={() => {
              setSelectedKeys([]);
              handleReset(clearFilters);
              const queryParams = qs.parse(location.search);
              if (queryParams[dataIndex]) {
                delete queryParams[dataIndex];
                history.push({ search: qs.stringify(queryParams) });
              }
            }}
            block
            className="mt-2"
            disabled={!selectedKeys.length}
          >
            پاک کردن
          </AppButton>
        )}

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
      value = value.replace(/\s/g, "");

      // record[dataIndex] =
      if (config && config.hasOwnProperty("multipleColumn")) {
        let fullText = "";
        for (let i = 0; i < config.multipleColumn.length; i++) {
          fullText += record[config.multipleColumn[i]];
          fullText = fullText.replace(/\s/g, "");
        }
        return fullText ? fullText.includes(value) : "";
      }

      let trimmedRecord =
        record[dataIndex] && record[dataIndex] !== null
          ? record[dataIndex].toString().replace(/\s/g, "")
          : "";

      console.log("opejkgoew", trimmedRecord, record[dataIndex]);

      if (config && config.hasOwnProperty("customConvert")) {
        return trimmedRecord
          ? config.customConvert(trimmedRecord).includes(value)
          : "";
      }

      if (config && config.hasOwnProperty("beDate")) {
        return trimmedRecord
          ? convertToShamsi(trimmedRecord).includes(value)
          : "";
      }

      return trimmedRecord ? trimmedRecord.toString().includes(value) : "";
    },

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
    const allRows = document.getElementsByClassName("ant-table-row");
    for (let tr of allRows) {
      tr.classList.add("removing");
    }
    if (timeout2) {
      clearTimeout(timeout2);
      timeout2 = null;
    }
    const search = () => {
      confirm({ closeDropdown: false });
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
      if (selectedKeys && selectedKeys.length && options.saveParams) {
        const queryParams = qs.parse(location.search);

        // temp fix since the api doesn't support multiple search params
        if (!options.filterMultiple) {
          for (let key in queryParams) {
            if (key !== "page" && key !== "sort" && key !== "sort_order") {
              delete queryParams[key];
            }
          }
        }

        const newQueries = {
          ...queryParams,
          [dataIndex]: selectedKeys.join(","),
        };
        history.replace({ search: qs.stringify(newQueries) });
      } else {
        const queryParams = qs.parse(location.search);
        if (queryParams[dataIndex]) {
          delete queryParams[dataIndex];
          history.replace({ search: qs.stringify(queryParams) });
        }
      }
    };
    setTimeout(search, 300);
  };

  const handleReset = (clearFilters) => {
    setSearchVal("");
    clearFilters({ closeDropdown: false });
    setState({ ...state, searchText: "" });
  };

  return getColumnSearchProps;
}
