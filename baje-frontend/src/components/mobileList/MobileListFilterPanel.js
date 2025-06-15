import * as fields from "./formItems";

import { Divider, Form } from "antd";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import AppButton from "components/general/AppButton";
import AppSelect from "components/general/AppSelect";
import { CloseOutlined } from "@ant-design/icons";
import { isArray } from "lodash";
import qs from "query-string";
import styled from "styled-components";
import { NationalIdInput } from "modules/personnel/realPerson/service/formItems";
import { toCleanPersian } from "_helpers";
import AppInput from "components/general/AppInput";

const { useForm } = Form;

export default function MobileListFilterPanel({
  onClose,
  tableInfo,
  setTableInfo,
  tableData,
  noSearch,
  noSort,
  onReset,
  filterPaneLTitle,
  personFilters,
}) {
  const location = useLocation();
  const history = useHistory();
  const [form] = useForm();
  const [filterType, setFilterType] = useState();
  const [personFilter, setPersonFilter] = useState();
  const [showMore, setShowMore] = useState(false);

  const searchFilterKeys = tableData
    .filter((i) => i.filter === "search")
    .map((i) => i.filterIndex);

  // apply filters
  function handleOnFinish(values, reset) {
    const newTableInfo = reset
      ? {
          silentUpdate: false,
          pagination: 1,
          filters: {},
        }
      : {
          ...tableInfo,
          silentUpdate: false,
          pagination: { ...tableInfo.pagination, current: 1 },
          filters: { ...(tableInfo.filters || {}) },
        };
    // update search params
    const searchParams = qs.parse(location.search);

    if (reset) {
      for (let key in searchParams) {
        delete searchParams[key];
      }
    }

    for (let key in values) {
      if (key === "page" || key === "per_page") {
        delete searchParams[key];
      } else if (key !== "sortType" && key !== "sortOrder") {
        if (values[key] && values[key].length) {
          if (searchFilterKeys.length && searchFilterKeys.includes(key)) {
            searchParams[key] = values[key];
            newTableInfo.filters[key] = toCleanPersian(values[key]);
          } else {
            newTableInfo.filters[key] = values[key].join(",");
            searchParams[key] = values[key].join(",");
          }
        } else {
          if (key in newTableInfo.filters) delete newTableInfo.filters[key];
          if (key in searchParams) delete searchParams[key];
        }
      }
    }

    if (values.sortType) {
      // update search params
      searchParams.sort = values.sortType;
      searchParams.sort_order = values.sortOrder;

      // update table info
      newTableInfo.sorter = {
        ...newTableInfo.sorter,
        columnKey: values.sortType,
        field: values.sortType,
        order: values.sortOrder,
      };
    } else {
      delete searchParams.sort;
      delete searchParams.sort_order;
      newTableInfo.sorter = null;
    }

    // handle person filter
    if (values.person_name) {
      delete values.person_name;
    }
    if (values.person_national_code) {
      delete values.person_national_code;
    }
    if (personFilters) {
      for (let item of personFilters) {
        if (values[item.id]) {
          values[item.id] = [values[item.id]];
        }
      }
    }

    // set dynamic filters, if any
    // for (let key in values) {
    //   if (key !== "sortType" && key !== "sortOrder") {
    //     if (values[key] && values[key].length) {
    //       newTableInfo.filters[key] = values[key].join(",");
    //       searchParams[key] = values[key].join(",");
    //     } else if (searchParams[key]) {
    //       delete searchParams[key];
    //       if (newTableInfo.filters[key]) {
    //         delete newTableInfo.filters[key];
    //       }
    //     }
    //   }
    // }

    history.replace({ search: qs.stringify(searchParams) });
    setTableInfo(newTableInfo);
    onClose(searchParams);
  }

  function resetForm() {
    form.setFieldsValue({
      sortType: null,
      sortOrder: null,
      ...searchFilterKeys,
    });
    form.resetFields();

    handleOnFinish({}, true);
  }

  function getDefaultValues() {
    const defaultValues = {
      sortType: null,
      sortOrder: null,
    };

    const queryParams = qs.parse(location.search);
    let searchFilters;
    const searchFiltersFilter = tableData.filter((i) => i.filter === "search");
    if (searchFiltersFilter.length) {
      searchFilters = searchFiltersFilter.map((i) => i.filterIndex);
    }

    for (let key in queryParams) {
      if (key === "sort") {
        defaultValues.sortType = queryParams[key];
      } else if (key === "sort_order") {
        defaultValues.sortOrder = queryParams[key];
      } else {
        if (key !== "page") {
          if (searchFilters && searchFilters.includes(key)) {
            defaultValues[key] = queryParams[key];
          } else {
            defaultValues[key] = queryParams[key].split(",");
          }
        }
      }
    }

    return defaultValues;
  }

  // generate dynamic filters
  const dynamicFilters = tableData.filter(
    (i) => i.filter && isArray(i?.filter) && i?.filter?.length
  );

  let filterItems;

  if (dynamicFilters.length) {
    filterItems = dynamicFilters.map((item, idx) => {
      const options = item.filter.map((option) => ({
        label: option.text,
        value: option.value,
      }));

      return (
        <Form.Item
          label={item.title}
          name={item.filterIndex}
          labelCol={{ span: 24 }}
          colon={false}
          key={idx}
        >
          <AppSelect
            mode="multiple"
            maxTagCount="responsive"
            showArrow
            options={options}
            showSearch={false}
          />
        </Form.Item>
      );
    });
  }

  function getPersonFilters() {
    tableData.filter((i) => i.filter === "search");
    if (personFilters) {
      const personFiltersItems = personFilters.map((item, idx) => {
        return (
          <NationalIdInput
            codeField={item.id}
            nameField="person_name"
            name="person_national_code"
            label={item.label}
            url="/api/admin/personnel/lookup"
            form={form}
            setData={setPersonFilter}
            isRequired={false}
            defaultValues={false}
            key={idx}
          />
        );
      });
      return personFiltersItems;
    }
    return;
  }

  const searchFilters = tableData.filter((i) => i.filter === "search");

  const searchFilterInputs = searchFilters.map((i) => (
    <Form.Item
      key={i.filterIndex}
      name={i.filterIndex}
      label={i.title}
      labelCol={{ span: 24 }}
      colon={false}
    >
      <AppInput allowClear type="text" />
    </Form.Item>
  ));

  // template
  return (
    <Container className="mobile-filter-panel">
      <div className="header">
        <div className="title">{filterPaneLTitle || "جستجو و مرتب سازی"}</div>
        <CloseOutlined
          className="close-button"
          style={{ zIndex: "11" }}
          onClick={() => {
            const queryParams = qs.parse(location.search);
            onClose(queryParams);
          }}
        />
      </div>

      <Form
        form={form}
        name="filters"
        onFinish={handleOnFinish}
        className="my-3"
        layout="vertical"
        initialValues={getDefaultValues()}
        onFieldsChange={(changed) => {
          if (changed.length) {
            if (changed[0].name[0] === "filterType") {
              setFilterType(changed[0].value);
            }
          }
        }}
      >
        {!noSearch && searchFilterInputs.length ? (
          <>
            <Divider orientation="right">جستجو</Divider>
            {searchFilterInputs[0]}
            {searchFilterInputs.length >= 2 ? searchFilterInputs[1] : ""}

            {searchFilterInputs.length > 2 ? (
              <>
                <div className={showMore ? "d-block" : "d-none"}>
                  {searchFilterInputs.slice(2)}
                </div>
                <AppButton
                  onClick={() => setShowMore(!showMore)}
                  className="text-18"
                >
                  {showMore ? "- نمایش کمتر" : "+ نمایش بیشتر"}
                </AppButton>
              </>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
        {!noSort && (
          <>
            <Divider orientation="right">مرتب سازی</Divider>
            <fields.SortType
              tableData={tableData && tableData.filter((i) => i.sorter)}
            />
            <fields.SortOrder />
          </>
        )}

        {((filterItems && filterItems?.length) ||
          (personFilters && personFilters?.length)) && (
          <>
            <Divider orientation="right">فیلتر ها</Divider>
            {filterItems ? filterItems : ""}
            {personFilters ? getPersonFilters() : ""}
          </>
        )}
      </Form>

      <MobileActionBar>
        <div className="buttons">
          <AppButton size="large" onClick={resetForm} block>
            بازنشانی
          </AppButton>
          <AppButton
            size="large"
            onClick={() => form.submit()}
            variant="primary"
            block
          >
            اعمال فیلتر
          </AppButton>
        </div>
      </MobileActionBar>
    </Container>
  );
}

// styles
const Container = styled("div")`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 20px;
  background: #fefefe;
  z-index: 4;
  padding-bottom: 80px;
  overflow-y: auto;

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;

    .title {
      flex-grow: 1;
      font-size: 1.2em;
    }
  }

  .close-button {
    font-size: 26px;
  }
`;

const MobileActionBar = styled("div")`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: #fff;
  box-shadow: 0px -2px 4px rgba(22, 25, 49, 0.1);
  z-index: 5;

  .buttons {
    display: flex;

    > * {
      flex-grow: 1;
    }

    > *:not(:last-of-type) {
      margin-left: 20px;
    }
  }
`;
