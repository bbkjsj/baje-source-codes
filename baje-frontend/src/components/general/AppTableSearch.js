import React, { useState } from "react";
import AppButton from "./AppButton";
import AppInput from "./AppInput";
import { SearchOutlined } from "@ant-design/icons";
import { Space } from "antd";
import PropTypes from "prop-types";

/**
 *
 * @param {object} params - all props of component
 * @param {function} params.onSearch - search handler
 * @param {function} params.onReset - reset search
 * @returns
 */

const AppTableSearch = ({ onSearch, onReset, placeholder = "جستجو" }) => {
  const [state, setState] = useState({ searchContent: "" });
  return (
    <div style={{ padding: 8 }}>
      <AppInput
        value={state.searchContent}
        placeholder={placeholder}
        onChange={({ target }) => {
          setState((s) => ({ ...s, searchContent: target.value }));
        }}
        style={{ marginBottom: 8, display: "block" }}
      />
      <Space>
        <AppButton
          type="primary"
          onClick={() => onSearch(state.searchContent)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          جستجو
        </AppButton>
        <AppButton onClick={() => onReset()} size="small" style={{ width: 90 }}>
          حذف فیلتر
        </AppButton>
      </Space>
    </div>
  );
};

AppTableSearch.propTypes = {
  onSearch: PropTypes.func,
};

export default AppTableSearch;
