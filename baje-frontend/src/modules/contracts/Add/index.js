import React, { useState, useEffect, useReducer } from "react";
import { Form, Row } from "antd";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import GoBackBtn from "components/GoBackBtn";
import ContentTop from "components/general/ContentTop";
import SubmitBtn from "components/general/SubmitBtn";
import { pageNames, formItemLayout, formRowGutter } from "constant";
import * as FormItem from "../common/formItems";
import {
  onValuesChange,
  getOfficesList,
  AddContractHandler,
} from "../utils/index";
import { initialState } from "../utils/constant";
import reducer from "../utils/reducer";
import * as actions from "../utils/actions";
import { currJalaliYear } from "_helpers";
//
export default function Index() {
  const [form] = Form.useForm();
  const history = useHistory();
  const currentOffice = useSelector((state) => state.currentOffice);

  const [state, dispatch] = useReducer(reducer, initialState(form));
  const {
    loading,
    contractType,
    mainContractDate,
    mainContractFinishDate,
    SUBJECT,
    companies,
    contractor,
    manager,
    boss,
    employer,
  } = state;
  //
  useEffect(() => {
    getOfficesList()
      .then((res) => {
        dispatch(actions.setCompanies(res));
      })
      .catch((err) => console.log(err));
  }, []);
  //
  useEffect(() => {
    form.setFieldsValue({ contractorId: currentOffice });
    form.setFieldsValue({ employerId: currentOffice });
  }, [currentOffice]);

  return (
    <>
      <GoBackBtn />

      <ContentTop
        title="قرارداد جدید"
        breadcrumbItems={[
          {
            text: "قرارداد ها",
            link: pageNames.contract.list,
          },
          { text: "قرارداد جدید" },
        ]}
      />
      <Form
        form={form}
        {...formItemLayout}
        onValuesChange={(values) => onValuesChange(values, dispatch, form)}
        initialValues={{ price_list: currJalaliYear() }}
        onFinish={(values) =>
          AddContractHandler({
            values,
            contractor,
            manager,
            boss,
            contractType,
            dispatch,
            currentOffice,
            history,
            employer,
          })
        }
      >
        <Row gutter={formRowGutter}>
          <FormItem.Type />
          <FormItem.Activity />
          <FormItem.ContractNumber />
          <FormItem.MainContractName
            contractType={contractType}
            form={form}
            dispatch={dispatch}
          />
          <FormItem.ContractDate
            form={form}
            contractType={contractType}
            mainContractDate={mainContractDate}
            mainContractFinishDate={mainContractFinishDate}
          />
          <FormItem.ContractStartDate
            form={form}
            contractType={contractType}
            mainContractDate={mainContractDate}
            mainContractFinishDate={mainContractFinishDate}
          />
          <FormItem.ContractEndDate
            form={form}
            contractType={contractType}
            mainContractDate={mainContractDate}
            mainContractFinishDate={mainContractFinishDate}
          />
          {/* <FormItem.Employer
            contractType={contractType}
            companies={companies}
          /> */}
          <FormItem.EmployerNew
            contractType={contractType}
            companies={companies}
            form={form}
            contractor={employer}
            dispatch={dispatch}
          />
          <FormItem.Contractor
            contractType={contractType}
            companies={companies}
            form={form}
            contractor={contractor}
            dispatch={dispatch}
          />
          <FormItem.Subject />
          <FormItem.Price />
          <FormItem.WorkshopCode contractType={contractType} />
          <FormItem.PeymanRow contractType={contractType} subject={SUBJECT} />
          <FormItem.Manager
            form={form}
            contractType={contractType}
            dispatch={dispatch}
          />
          <FormItem.Boss
            form={form}
            contractType={contractType}
            dispatch={dispatch}
          />

          <FormItem.CompanyPath />
          <FormItem.ContractType />
          <FormItem.ProjectEnvironment contractType={contractType} />
          <FormItem.AdjustmentBasis />
          <FormItem.PriceList />
          <FormItem.PriceListParts />
          <FormItem.TimeWeight />
          <FormItem.RialWeight />

          <SubmitBtn loading={loading} />
        </Row>
      </Form>
    </>
  );
}
