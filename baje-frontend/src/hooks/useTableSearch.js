import React, { useRef } from "react";
import { Input, Button, Space, Checkbox } from "antd";

import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { convertToShamsi, normalizeArabic, toCleanPersian } from "_helpers";
import AppButton from "components/general/AppButton";
import { useHistory, useLocation } from "react-router-dom";
import qs from "query-string";

export default function useTableSearch(
  options = { saveParams: false, filterMultiple: false }
) {
  const [state, setState] = useState({
    searchText: "",
    searchedColumn: "",
  });
  const location = useLocation();
  const history = useHistory();

  const searchInput = useRef(null);
  const [textInput, setTextInput] = useState(null);

  let timeout;
  let timeout2;

  const getColumnSearchProps = (dataIndex, title, config = {}) => ({
    textFilter: true,
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => {
      // set params if first load
      // if (options.saveParams) {
      //  const searchParams = qs.parse(location.search);
      //   if (searchParams[dataIndex]) {
      //     setSelectedKeys([searchParams[dataIndex]]);
      //   }
      // }

      return (
        <div style={{ padding: 8 }}>
          <form
            autoComplete="on"
            onSubmit={(e) => {
              e.preventDefault();
              confirm({ closeDropdown: false });
            }}
          >
            <Input
              ref={searchInput}
              placeholder={`جستجو ${title || ""}`}
              value={selectedKeys[0]}
              autoComplete="on"
              type="search"
              onChange={(e) => {
                setTextInput(e.target.value);
                if (timeout) {
                  clearTimeout(timeout);
                  timeout = null;
                }
                let val = normalizeArabic(e.target.value);
                if (e.target === undefined) return;
                setSelectedKeys(val ? [val] : []);

                function fake() {
                  handleSearch(
                    typeof val === "string" ? val.toLowerCase() : val,
                    confirm,
                    dataIndex
                  );
                }
                timeout = setTimeout(fake, 1000);
              }}
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              style={{ width: 188, marginBottom: 8, display: "block" }}
              className="table-search-input"
              id={`tableSearchInput${dataIndex || "Search"}`}
            />

            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <AppButton
                disabled={
                  /*!textInput || textInput.length === 0 ? true :*/ false
                }
                variant="danger"
                onClick={() => {
                  handleReset(clearFilters);
                  const queryParams = qs.parse(location.search);
                  if (queryParams[dataIndex]) {
                    delete queryParams[dataIndex];
                    history.replace({ search: qs.stringify(queryParams) });
                  }
                }}
                // style={{ marginLeft: "3px" }}
              >
                پاک کردن
              </AppButton>
              <span> </span>
              <AppButton
                variant="info"
                onClick={() => {
                  const val = null;
                  setTextInput("-");
                  setSelectedKeys(val ? [val] : [null]);
                  handleSearch(selectedKeys, confirm, dataIndex);

                  // const queryParams = qs.parse(location.search);

                  // for (let key in queryParams) {
                  //   if (
                  //     key !== "page" &&
                  //     key !== "sort" &&
                  //     key !== "sort_order"
                  //   ) {
                  //     delete queryParams[key];
                  //   }
                  // }

                  // const newQueries = { ...queryParams, [dataIndex]: "null" };
                  // history.replace({ search: qs.stringify(newQueries) });
                  // form.setFieldsValue({ date: null });
                }}
                // style={{ marginLeft: "3px" }}
              >
                بدون مقدار
              </AppButton>
              {/* <AppButton onClick={() => confirm()} block>
            بستن
          </AppButton> */}
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
          </form>
        </div>
      );
    },
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#f5222d" : "#bfbfbf" }} />
    ),
    onFilter: (value, record) => {
      if (value !== null) {
        value = value.replace(/\s/g, "");
        //value = value.replace("-", "");
      }
      // record[dataIndex] =

      if (config && config.hasOwnProperty("multipleColumn")) {
        let fullText = "";
        for (let i = 0; i < config.multipleColumn.length; i++) {
          fullText += record[config.multipleColumn[i]];
          fullText = fullText.replace(/\s/g, "");
        }
        return fullText ? fullText.includes(value) : "";
      }

      let trimmedRecord = null;
      if (value === null) {
        trimmedRecord = record[dataIndex] === null ? "-" : "";
      } else {
        trimmedRecord =
          record[dataIndex] && record[dataIndex] !== null
            ? toCleanPersian(record[dataIndex])
            : "";
      }

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

      if (value === null && trimmedRecord.toString() === "-")
        return trimmedRecord.toString();
      return trimmedRecord
        ? trimmedRecord.toString().toLowerCase().includes(value.toLowerCase())
        : "";
    },

    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput?.current?.focus(), 100);
      }
      // return false;
    },
    render: (text) => (state.searchedColumn === dataIndex ? text : text),
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
      if (selectedKeys && options.saveParams) {
        const queryParams = qs.parse(location.search);

        // temp fix since the api doesn't support multiple search params
        if (!options.filterMultiple) {
          for (let key in queryParams) {
            if (key !== "page" && key !== "sort" && key !== "sort_order") {
              delete queryParams[key];
            }
          }
        }

        queryParams[dataIndex] = selectedKeys;
        history.replace({ search: qs.stringify(queryParams) });
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
    clearFilters({ closeDropdown: false });
    setState({ ...state, searchText: "" });
  };

  return getColumnSearchProps;
}
