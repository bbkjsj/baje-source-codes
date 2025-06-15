import React, { useState, useContext, useEffect } from "react";
import { Form, Row, Divider, Button, message } from "antd";
import * as FormItems from "./components/FormItems";
import SubmitBtn from "components/general/SubmitBtn";
import * as api from "./util/api";
import { usePostSocialInsurance, useGetContractList } from "./util/hooks";
import { defaultDate, getContract } from "./util/index";
import {
  covetFormatDateToFA,
  convertDateToEN,
  getMonthDaysByMonth,
} from "_helpers";
import { useSelector } from "react-redux";

const formItemLayout = {
  labelCol: { span: 24 },
  colon: false,
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    lg: { span: 22 },
  },
};

const formGutter = { xs: 8, sm: 16, md: 24, lg: 32 };

const SocialInsuranceAdd = (props) => {
  const currentOffice = useSelector((state) => state.currentOffice);
  const [isMonthSet, setIsMonthSet] = useState(false);
  const [form] = Form.useForm();
  const { submit, loading } = usePostSocialInsurance(form, props.updateList);
  const { contractList } = useGetContractList(props.data);
  const [getContractLoading, setGetContractLoading] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const handleOnFinish = (values) => {
    if (values.month === "0" || values.month === "00") {
      values.month = "1";
    }
    while (values.month.length < 2) {
      values.month = "0" + values.month;
    }
    let data = { ...values };

    let checkDuplicateList = props.data.filter(
      (item) =>
        item.workshop_code === data.work_shop + "" &&
        item.row === data.row + "" &&
        item.year === data.year + "" &&
        parseInt(item.month) === parseInt(data.month + "") &&
        item.list_number === data.list_number + ""
    );
    if (checkDuplicateList.length > 0) message.error("لیست بیمه تکراری است");
    if (!checkDates(values)) {
      message.error("لیست مورد نظر در دوره قرارداد نمیباشد");
    } else submit(data);
  };

  const checkDates = (values) => {
    const contractStartMonth =
      new Date(covetFormatDateToFA(startDate)).getMonth() + 1;

    const contractEndMonth =
      new Date(covetFormatDateToFA(endDate)).getMonth() + 1;

    const contractStartYear = new Date(
      covetFormatDateToFA(startDate)
    ).getFullYear();

    const ContractEndYear = new Date(
      covetFormatDateToFA(endDate)
    ).getFullYear();

    const contractIdealStart = new Date(
      convertDateToEN(`${contractStartYear}/${contractStartMonth}/01`)
    ).getTime();

    const contractIdealEnd = new Date(
      convertDateToEN(
        `${ContractEndYear}/${contractEndMonth}/${getMonthDaysByMonth(
          contractEndMonth
        )}`
      )
    ).getTime();
    //

    const insuranceStart = new Date(
      convertDateToEN(`${values.year}/${values.month}/01`)
    ).getTime();

    const insuranceEnd = new Date(
      convertDateToEN(
        `${values.year}/${values.month}/${getMonthDaysByMonth(values.month)}`
      )
    ).getTime();

    console.log("!!!!!!!!!**");
    return !(
      insuranceStart < contractIdealStart || insuranceEnd > contractIdealEnd
    );
  };

  const onChangeValues = (_, allValues) => {
    if (
      allValues.row &&
      allValues.row.length === 3 &&
      allValues.work_shop &&
      allValues.work_shop.length === 10
    ) {
      getContract(
        form,
        setGetContractLoading,
        isMonthSet,
        setIsMonthSet,
        currentOffice,
        setStartDate,
        setEndDate
      );
    }
    if (allValues.month && parseFloat(allValues.month) > 12) {
      message.warning("حداکثر ماه قابل انتخاب 12 است");
      form.setFieldsValue({ month: "01" });
    }
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        name="SocialInsuranceAdd"
        scrollToFirstError
        onFinish={handleOnFinish}
        onValuesChange={onChangeValues}
        initialValues={{
          list_number: "001",
        }}
        className="mt-3"
      >
        <Row gutter={formGutter}>
          <FormItems.ContractID />
          <FormItems.WorkShopCode useForm={form} contractList={contractList} />
          <FormItems.RowCode useForm={form} contractList={contractList} />
          <FormItems.ContractSubject />
          <FormItems.GetContract
            useForm={form}
            loading={getContractLoading}
            onClick={() =>
              getContract(
                form,
                setGetContractLoading,
                isMonthSet,
                setIsMonthSet,
                currentOffice
              )
            }
            onAllChange={() => {
              setIsMonthSet(false);
            }}
          />
          <Divider />
          <FormItems.Year />
          <FormItems.Month useForm={form} />
          <FormItems.ListNumber useForm={form} />
          <FormItems.Description />
        </Row>
        <SubmitBtn loading={loading} />
      </Form>
    </>
  );
};

export default SocialInsuranceAdd;
