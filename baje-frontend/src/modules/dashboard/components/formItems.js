import React from "react";
import { Form, Input, Select } from "antd";
import Col from "antd/es/grid/col";
import { Option } from "antd/lib/mentions";
import AppButton from "components/general/AppButton";
import ListActions from "components/general/ListActions";
import { handleClickExportExl } from "_helpers";
import { formColSpan } from "../../../constant";

export const ContractList = ({ list, onChange, disabled, hidden }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        hidden={hidden}
        name="contarct_id"
        label="انتخاب قرارداد اصلی "
      >
        <Select
          disabled={disabled}
          placeholder="قرارداد موردنظر را انتخاب نمایید..."
          onChange={onChange}
        >
          {list.map((el) => (
            <Option value={el.id} key={el.id}>
              {el.subject}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
  );
};

export const SearchBtn = ({ onClick, disabled, searchBtnText, hidden }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item hidden={hidden} className="mg-right-10">
        <AppButton
          size="large"
          type="primary"
          onClick={onClick}
          disabled={disabled}
        >
          {searchBtnText}
        </AppButton>
      </Form.Item>
    </Col>
  );
};

export const Actions = ({ hash }) => {
  return (
    <Col {...formColSpan} className="flex-wrap justify-end">
      <Form.Item>
        <ListActions
          actions={{
            excelExport: () => {
              handleClickExportExl(hash);
            },
          }}
          noPrint={true}
          noFilter={true}
          noSort={true}
        />
      </Form.Item>
    </Col>
  );
};
