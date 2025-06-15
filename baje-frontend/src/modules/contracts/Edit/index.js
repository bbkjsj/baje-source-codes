import React, { useState, useEffect, useReducer } from "react";
import { Form, Row, Spin } from "antd";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import GoBackBtn from "components/GoBackBtn";
import ContentTop from "components/general/ContentTop";
import SubmitBtn from "components/general/SubmitBtn";
import { pageNames, formItemLayout, formRowGutter } from "constant";
import * as FormItem from "../common/formItems";
import {
  onValuesChange,
  getOfficesList,
  AddContractHandler,
  getContractHandler,
  handleTypeOfContract,
} from "../utils/index";
import { initialState } from "../utils/constant";
import reducer from "../utils/reducer";
import * as actions from "../utils/actions";
import * as api from "../utils/api";
import { timeToFa } from "_helpers";
//
export default function Index(props) {
  const contractID = props.match.params.id;
  const [form] = Form.useForm();
  const history = useHistory();
  const currentOffice = useSelector((state) => state.currentOffice);
  const [state, dispatch] = useReducer(reducer, initialState(form));
  const params = useParams();

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
    canNotEdit,
    contract,
    employer,
  } = state;

  // check type of contract
  const handleSetContract = (data) => {
    dispatch(actions.setLoading(true));
    const res = api.GET_CONTRACT(contractID).then((res) => {
      dispatch(
        actions.setContract({
          ...res.data,
          startDate: timeToFa(res?.data?.startDate, false),
          endDate: timeToFa(res?.data?.endDate, false),
          date: timeToFa(res?.data?.date, false),
          employerCode: res?.data?.employer,
          contractorCode: res?.data?.contractor,
          priceListParts: res?.data?.priceListParts || [],
        })
      );
      dispatch(actions.setContractType(res?.data?.type));
    });
    dispatch(actions.setLoading(false));
    // const contractorID = data.contractorId;
    // if (!data.employer) {
    //   if (contractorID == currentOffice) {
    //     dispatch(actions.setCanNotEdit(true));
    //   } else {
    //     dispatch(actions.setCanNotEdit(false));
    //   }
    //   data.employer = data.employer1;
    // }

    // if (contractorID == currentOffice) {
    //   let contractType = handleTypeOfContract(data.type);
    //   dispatch(
    //     actions.setContractor({
    //       id: data.contractorId,
    //       type: data.contractorType,
    //     })
    //   );

    //   dispatch(actions.setContract(data));
    //   form.setFieldsValue({ type: `main_${contractType}` });
    //   dispatch(actions.setContractType("main"));
    // } else {
    //   let contractType = handleTypeOfContract(data.type);
    //   dispatch(actions.setContract(data));
    //   form.setFieldsValue({ type: `sub_${contractType}` });
    //   dispatch(actions.setContractType("maisubsidiaryn"));
    // }
  };

  useEffect(() => {
    form.setFieldsValue({
      contractorId: currentOffice,
      employerId: currentOffice,
    });

    if (currentOffice) {
      // getContractHandler(handleSetContract, contractID, dispatch);
      handleSetContract();
    }
  }, [currentOffice]);
  //

  useEffect(() => {
    getOfficesList()
      .then((res) => {
        dispatch(actions.setCompanies(res.list));
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    for (const key in contract) {
      if (Object.hasOwnProperty.call(contract, key)) {
        if (key !== "date") {
          form.setFieldsValue({ [key]: contract[key] });
        }
      }
    }
  }, [contract]);

  return (
    <>
      <GoBackBtn />

      <ContentTop
        title="ویرایش قراداد"
        breadcrumbItems={[
          {
            text: "قرارداد ها",
            link: pageNames.contract.list,
          },
        ]}
      />
      <Spin spinning={loading}>
        <Form
          form={form}
          initialValues={contract}
          {...formItemLayout}
          onValuesChange={(values) => onValuesChange(values, dispatch, form)}
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
              edit: true,
              id: contractID,
            })
          }
        >
          <Row gutter={formRowGutter}>
            <FormItem.Type disabled={canNotEdit} />
            <FormItem.Activity />
            <FormItem.ContractNumber disabled={canNotEdit} />
            <FormItem.MainContractName
              contractType={contractType}
              form={form}
              dispatch={dispatch}
            />
            {/* <FormItem.ContractDate
              form={form}
              contractType={contractType}
              mainContractDate={mainContractDate}
              mainContractFinishDate={mainContractFinishDate}
              disabled={canNotEdit}
            /> */}
            <FormItem.ContractStartDate
              form={form}
              contractType={contractType}
              mainContractDate={mainContractDate}
              mainContractFinishDate={mainContractFinishDate}
              disabled={canNotEdit}
            />
            <FormItem.ContractEndDate
              form={form}
              contractType={contractType}
              mainContractDate={mainContractDate}
              mainContractFinishDate={mainContractFinishDate}
              disabled={canNotEdit}
            />
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
            <FormItem.Subject disabled={canNotEdit} />
            <FormItem.Price disabled={canNotEdit} />
            <FormItem.WorkshopCode contractType={contractType} />
            <FormItem.PeymanRow contractType={contractType} subject={SUBJECT} />
            <FormItem.Manager
              form={form}
              contractType={contractType}
              dispatch={dispatch}
              contract={contract}
            />
            <FormItem.Boss
              form={form}
              contractType={contractType}
              dispatch={dispatch}
              contract={contract}
            />

            <FormItem.Consultant />
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
      </Spin>
    </>
  );
}
