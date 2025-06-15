import React, { useRef } from "react";
import { Input, Form } from "antd";

import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { convertToShamsi, normalizeArabic, toCleanPersian } from "_helpers";
import AppButton from "components/general/AppButton";
import { useHistory, useLocation } from "react-router-dom";
import qs from "query-string";
import { NationalIdInput } from "modules/personnel/realPerson/service/formItems";
import styled from "styled-components";

export default function useTablePersonFilter(options = { saveParams: false }) {
  const [state, setState] = useState({
    searchText: "",
    searchedColumn: "",
  });
  const location = useLocation();
  const history = useHistory();
  const [form] = Form.useForm();
  const searchInput = useRef(null);
  const [textInput, setTextInput] = useState(null);

  let timeout;
  let timeout2;

  const getColumnSearchProps = (dataIndex, title) => ({
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

      function handleSetData({ id }) {
        setTextInput(String(id));
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        if (id === undefined) return;
        setSelectedKeys(id ? [String(id)] : []);

        function fake() {
          handleSearch(String(id), confirm, dataIndex);
        }
        timeout = setTimeout(fake, 1000);
      }

      return (
        <StyledContainer>
          <Form
            autoComplete="on"
            onSubmit={(e) => {
              e.preventDefault();
              confirm({ closeDropdown: false });
            }}
            form={form}
          >
            <NationalIdInput
              type="send"
              codeField="person_personnel_id"
              nameField="person_name"
              name="personnel_id"
              url="/api/admin/personnel/lookup"
              setData={handleSetData}
              isRequired={false}
              disabled={false}
              plain
              form={form}
              id={`tableSearchInput${dataIndex || "Search"}`}
              onReset={() => handleReset(clearFilters)}
            />

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
          </Form>
        </StyledContainer>
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

      let trimmedRecord = null;
      if (value === null) {
        trimmedRecord = record[dataIndex] === null ? "-" : "";
      } else {
        trimmedRecord =
          record[dataIndex] && record[dataIndex] !== null
            ? toCleanPersian(record[dataIndex])
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

const StyledContainer = styled.div`
  padding: 10px;
  .ant-form-item {
    margin-bottom: 0px !important;
  }
`;
