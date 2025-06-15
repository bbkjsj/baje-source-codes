import { Form } from "antd";
import React, { useEffect, useState } from "react";
import AppInput from "components/general/AppInput";
import AppSelect from "components/general/AppSelect";

const FilterValue = ({ filterType, form }) => {
  // function isNumericType() {
  //   const filter = filterType || form.getFieldValue("filterType");
  //   return (
  //     filter === "national_number" ||
  //     filter === "id_number" ||
  //     filter === "insurance_number" ||
  //     filter === "mobile1"
  //   );
  // }

  return (
    <Form.Item
      name="filterValue"
      label="مقدار جستجو"
      labelCol={{ span: 24 }}
      colon={false}
    >
      <AppInput allowClear /* type={isNumericType() ? "number" : "text"} */ />
    </Form.Item>
  );
};

////////////////////////////////////////////////////

const FilterType = ({ onChange, tableData }) => {
  const options = tableData.map((i) => {
    return {
      value: i.filterIndex,
      label: i.title,
    };
  });

  return (
    <Form.Item
      label="جستجو بر اساس"
      name="filterType"
      labelCol={{ span: 24 }}
      colon={false}
    >
      <AppSelect options={options} onChange={onChange} />
    </Form.Item>
  );
};

////////////////////////////////////////////////////

const SortType = ({ tableData }) => {
  const options = tableData.map((i) => {
    return {
      value: i.filterIndex,
      label: i.title,
    };
  });

  return (
    <Form.Item
      label="مرتب سازی بر اساس"
      name="sortType"
      labelCol={{ span: 24 }}
      colon={false}
    >
      <AppSelect options={options} />
    </Form.Item>
  );
};

////////////////////////////////////////////////////

const SortOrder = () => {
  const options = [
    { label: "صعودی", value: "ascend" },
    { label: "نزولی", value: "descend" },
  ];

  return (
    <Form.Item
      label="جهت مرتب سازی"
      name="sortOrder"
      labelCol={{ span: 24 }}
      colon={false}
    >
      <AppSelect options={options} />
    </Form.Item>
  );
};

export { FilterValue, FilterType, SortType, SortOrder };
