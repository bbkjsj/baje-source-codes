import { Dropdown, Input, Form } from "antd";
import React, { useEffect } from "react";
import {
  CloseOutlined,
  DeleteFilled,
  CaretUpOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import AppButton from "components/general/AppButton";
import styles from "./TableHeaderInput.module.css";
import excel from "../../../../assets/images/icons/excel.svg";
import { convertToShamsi, normalizeArabic, toCleanPersian } from "_helpers";
import qs from "query-string";
import { useHistory, useLocation } from "react-router-dom";

const SortIcons = ({ onUpIconClick, onDownIconClick }) => {
  return (
    <div className="mr-1">
      <CaretUpOutlined onClick={onUpIconClick} />
      <CaretDownOutlined onClick={onDownIconClick} />
    </div>
  );
};

export default function TableHeaderInput({
  placeholder,
  dataIndex,
  setTableInfo,
  tableInfo,
  noDropDown,
}) {
  const location = useLocation();
  const history = useHistory();
  const [form] = Form.useForm();

  const Params = qs.parse(location.search);
  // let timeout;

  const updateQueries = (val) => {
    if (val) {
      const newQueries = { ...Params, [dataIndex]: val };

      history.replace({ search: qs.stringify(newQueries) });

      setTableInfo((oldInfo) => ({
        ...oldInfo,
        pagination: {
          ...oldInfo.pagination,
          current: 1,
        },
        filters: { ...oldInfo.filters, [dataIndex]: toCleanPersian(val) },
        silentUpdate: false,
      }));
      console.log(tableInfo.filters);
    } else {
      form.resetFields();

      if (Params[dataIndex]) {
        delete Params[dataIndex];

        const newFilters = { ...tableInfo.filters };

        if (dataIndex in newFilters) {
          delete newFilters[dataIndex];
        }

        setTableInfo((oldInfo) => ({
          ...oldInfo,
          filters: newFilters,
          silentUpdate: false,
        }));

        history.replace({ search: qs.stringify(Params) });
      }
    }
  };

  const search = (v) => {
    if (v === undefined) return;
    updateQueries(v);
  };

  useEffect(() => {
    form.setFieldsValue({
      [dataIndex]: tableInfo.filters[dataIndex] ?? null,
    });
  }, []);

  const buttons = (
    <div className="flex align-center">
      <AppButton className={styles.icon_btn} onClick={() => search(null)}>
        بدون مقدار
      </AppButton>
      <AppButton
        icon={<img src={excel} alt="excel" className="ml-1" />}
        className={`${styles.excel_btn} excel-btn `}
      />
    </div>
  );

  return (
    <div
      className="flex align-start  saeede"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Dropdown overlay={noDropDown ? "" : buttons} trigger={["click"]}>
        <Form form={form} style={{ minWidth: "120px", marginLeft: "5px" }}>
          <Form.Item name={dataIndex} style={{ marginBottom: 0 }}>
            <Input
              placeholder={placeholder}
              suffix={
                <CloseOutlined
                  style={{ color: "red" }}
                  onClick={() => search(null)}
                />
              }
              onChange={(e) => search(e.target.value)}
              style={{ fontSize: "8px", height: "35px", marginLeft: "5px" }}
              // disabled={
              //   Object.keys(tableInfo.filters).length > 0 &&
              //   !tableInfo.filters[dataIndex]
              // }
            />
          </Form.Item>
        </Form>
      </Dropdown>
    </div>
  );
}
