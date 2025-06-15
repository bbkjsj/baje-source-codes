import React, { useEffect, useState } from "react";
import { Col, Select, TreeSelect, Form } from "antd";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { ReportTypesAndLabels } from "modules/dashboard/const";
import { checkShamsi, getTodayDate } from "_helpers";
import { formColSpan } from "../../../constant";

export const ReportType = ({ onChange }) => {
  const Rules = [
    {
      required: true,
      message: "آنتخاب نوع گزارش الزامیست",
    },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item name="chart_type" label="نوع گزارش" rules={Rules}>
        <Select placeholder="انتخاب گزارش" onChange={onChange}>
          {ReportTypesAndLabels.map((el) => (
            <Select.Option key={el.value} value={el.value}>
              {el.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
  );
};

export const ReportDate = ({ mainForm, hidden, onChange, type }) => {
  const [hiddenItem, sethiddenItem] = useState(true);

  useEffect(() => {
    const dateArray = getTodayDate().split("/");
    dateArray[1] = dateArray[1].length < 2 ? `0${dateArray[1]}` : dateArray[1];
    dateArray[2] = dateArray[2].length < 2 ? `0${dateArray[2]}` : dateArray[2];
    let initialDate = dateArray.join("/");

    if (!hidden) {
      mainForm.setFieldsValue({
        report_date: initialDate,
      });
      onChange();
      sethiddenItem(false);
    } else sethiddenItem(true);
  }, [hidden, type]);

  const Rules = [
    {
      required: true,
      message: "تاریخ گزارش اجباری است",
    },
    () => ({
      validator(rule, value) {
        if (checkShamsi(value, false)) {
          return Promise.resolve();
        } else {
          return Promise.reject("فرمت تاریخ صحیح نیست");
        }
      },
    }),
  ];

  return (
    !hidden && (
      <CustomDatePicker
        form={mainForm}
        label="تاریخ گزارش"
        name="report_date"
        rules={Rules}
        onChange={onChange}
        // hidden={hiddenItem}
      />
    )
  );
};

export const StartDate = ({ mainForm, hidden, onChange }) => {
  const Rules = [
    {
      required: true,
      message: "تاریخ شروع دوره اجباری است",
    },
    () => ({
      validator(rule, value) {
        if (checkShamsi(value, false)) {
          return Promise.resolve();
        } else {
          return Promise.reject("فرمت تاریخ صحیح نیست");
        }
      },
    }),
  ];

  return (
    !hidden && (
      <CustomDatePicker
        form={mainForm}
        label="از تاریخ"
        name="start_date"
        rules={Rules}
        onChange={onChange}
        // hidden={hidden}
      />
    )
  );
};

export const EndDate = ({ mainForm, hidden, onChange, type }) => {
  const [hiddenItem, sethiddenItem] = useState(true);

  useEffect(() => {
    if (!hidden) {
      const dateArray = getTodayDate().split("/");
      dateArray[1] =
        dateArray[1].length < 2 ? `0${dateArray[1]}` : dateArray[1];
      dateArray[2] =
        dateArray[2].length < 2 ? `0${dateArray[2]}` : dateArray[2];
      let initialDate = dateArray.join("/");

      mainForm.setFieldsValue({
        end_date: initialDate,
      });
      sethiddenItem(false);
    } else sethiddenItem(true);
  }, [hidden, type]);

  const Rules = [
    {
      required: true,
      message: "تاریخ پایان دوره اجباری است",
    },
    () => ({
      validator(rule, value) {
        if (checkShamsi(value, false)) {
          return Promise.resolve();
        } else {
          return Promise.reject("فرمت تاریخ صحیح نیست");
        }
      },
    }),
  ];

  return (
    !hidden && (
      <CustomDatePicker
        form={mainForm}
        label=" تا تاریخ"
        name="end_date"
        rules={Rules}
        onChange={onChange}
        hidden={hiddenItem}
      />
    )
  );
};

export const Contracts = ({ hidden, list, strategy }) => {
  const Rules = [
    {
      required: true,
      message: "انتخاب  قرارداد/شرکت الزامیست",
    },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item
        name="contracts"
        label="قرارداد/ شرکت"
        hidden={hidden}
        rules={Rules}
      >
        <TreeSelect
          placeholder="قرارداد های مورد نظر را انتخاب کنید "
          treeData={list}
          treeCheckable={true}
          showCheckedStrategy={strategy}
          style={{ width: "100%" }}
          treeDefaultExpandAll
        />
      </Form.Item>
    </Col>
  );
};
