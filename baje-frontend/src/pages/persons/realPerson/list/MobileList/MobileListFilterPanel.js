import React, { useState } from "react";
import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";
import { Divider, Form, Modal } from "antd";
import AppButton from "components/general/AppButton";
import * as fields from "./formItems";
import { useHistory, useLocation } from "react-router-dom";
import qs from "query-string";
import AppInput from "components/general/AppInput";
import { toCleanPersian } from "_helpers";
const { useForm } = Form;

export default function MobileListFilterPanel({
  onClose,
  tableInfo,
  setTableInfo,
  onReset,
  noActions,
}) {
  const location = useLocation();
  const history = useHistory();
  const [form] = useForm();

  const [showMore, setShowMore] = useState(false);

  // apply filters
  function handleOnFinish(values) {
    const newTableInfo = {
      ...tableInfo,
      silentUpdate: false,
      pagination: { ...tableInfo.pagination, current: 1 },
    };

    // update search params and table info for multiple filters
    const searchParams = qs.parse(location.search);

    for (let key in values) {
      if (key === "page" || key === "per_page") {
        delete searchParams[key];
      } else if (key !== "sortType" && key !== "sortOrder") {
        if (values[key] && values[key].trim() !== "") {
          searchParams[key] = values[key];
          newTableInfo.filters[key] = toCleanPersian(values[key]);
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

    //if (!noActions) {
    history.replace({ search: qs.stringify(searchParams) });
    //}
    setTableInfo(newTableInfo);
    onClose();
  }

  function resetForm() {
    form.setFieldsValue({
      sortType: "last_name",
      sortOrder: "ascend",
      first_name: "",
      last_name: "",
      national_number: "",
      mobile1: "",
      insurance_number: "",
      father_name: "",
      id_number: "",
    });
    const queryParams = qs.parse(location.search);

    // delete all queryParams except page
    for (let key in queryParams) {
      delete queryParams[key];
    }

    history.replace({ search: qs.stringify(queryParams) });
  }

  function getDefaultValues() {
    const defaultValues = {
      sortType: "last_name",
      sortOrder: "ascend",
    };

    const queryParams = qs.parse(location.search);

    for (let key in queryParams) {
      if (key === "sort") {
        defaultValues.sortType = queryParams[key];
      } else if (key === "sort_order") {
        defaultValues.sortOrder = queryParams[key];
      } else {
        if (key !== "page") {
          defaultValues[key] = queryParams[key];
        }
      }
    }

    return defaultValues;
  }

  // UPDATE: multiple filters are now possible
  const filters = {
    first_name: "نام",
    last_name: "نام خانوادگی",
    ...(!noActions && { national_number: "کد ملی" }),
    ...(!noActions && { father_name: "نام پدر" }),
    id_number: "شماره شناسنامه",
    ...(!noActions && { mobile1: "شماره همراه" }),
    ...(!noActions && { insurance_number: "شماره بیمه" }),
  };

  console.log("filters:", filters);

  function isNumericType(filter) {
    const numerics = [
      "national_number",
      "id_number",
      "insurance_number",
      "mobile1",
    ];
    return numerics.includes(filter);
  }

  const filterInputs = Object.keys(filters).map((key) => (
    <Form.Item
      name={key}
      key={key}
      label={filters[key]}
      labelCol={{ span: 24 }}
      colon={false}
    >
      <AppInput allowClear type={isNumericType(key) ? "number" : "text"} />
    </Form.Item>
  ));

  // template
  return (
    <Container>
      <div className="header">
        <div className="title">
          {noActions ? "جستجو" : "جستجو و مرتب‌ سازی"}
        </div>
        <CloseOutlined className="close-button" onClick={() => onClose()} />
      </div>

      <Form
        form={form}
        name="filters"
        onFinish={handleOnFinish}
        className="my-3"
        layout="vertical"
        initialValues={getDefaultValues()}
      >
        {!noActions && <Divider orientation="right">جستجو</Divider>}
        {filterInputs[0]}
        {filterInputs[1]}
        {filterInputs[2]}
        <div className={showMore ? "d-block" : "d-none"}>
          {filterInputs.slice(3)}
        </div>
        {!noActions && (
          <>
            <AppButton
              onClick={() => setShowMore(!showMore)}
              className="text-18"
            >
              {showMore ? "- نمایش کمتر" : "+ نمایش بیشتر"}
            </AppButton>
            <Divider orientation="right">مرتب سازی</Divider>
            <fields.SortType />
            <fields.SortOrder />
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
            {noActions ? "جستجو" : "اعمال فیلتر"}
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
  z-index: 20;
  overflow-y: auto;
  padding-bottom: 75px;
  padding-top: 64px;

  .header {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    align-items: center;
    margin-bottom: 24px;
    padding: 16px;
    z-index: 5;
    background: #fff;
    border-bottom: 1px solid #e9dbdb;

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
