import React, { useState, useContext, useEffect } from "react";
import { Form, Row, message } from "antd";
import { RenderInputs } from "../../../components/renderInput/RenderInputs";
import { addContactsFields } from "./inputsList";
import {
  onFinish,
  onValuesChange,
  constants,
  getOfficesList,
} from "../utils/_helpers";
import FetchDataWithCode from "components/renderInput/fetchDataWithCode/FetchDataWithCode";
import TextInput from "components/renderInput/textInput/TextInput";
import SelectMainContractInput from "components/contract/selectContract/SelectMainContractInput";
import GetContractList from "containers/contract/GetContractList";
import SelectDropDown from "components/renderInput/selectDropDown/SelectDropDown";
import GetPerson from "components/renderInput/fetchDataWithCode/GetPerson";
import { useHistory } from "react-router-dom";
import SubmitBtn from "components/general/SubmitBtn";
import { checkShamsi, national_id_normalize } from "_helpers";
import GoBackBtn from "components/GoBackBtn";
import ContentTop from "components/general/ContentTop";
import { NationalIdInput } from "modules/personnel/realPerson/service/formItems";
import { formItemLayout, pageNames } from "constant";
import { useSelector } from "react-redux";

const { MAIN_CONTRACT, SUBSIDIARY_CONTRACT } = constants;

const AddContract = () => {
  const history = useHistory();
  //get user data for check compony access
  const currentOffice = useSelector((state) => state.currentOffice);
  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(false);
  const [contractType, setContractType] = useState(null);
  const [form] = Form.useForm();
  const [contractModalListVisible, setContractModalListVisible] = useState(
    false
  );
  const [SUBJECT, setSubject] = useState(form.getFieldValue("subject"));

  // for data must be send but don't exist in form
  const [contractor, setContractor] = useState(null);
  const [employer, setEmployer] = useState(null);
  const [manager, setManager] = useState(null);
  const [boss, setBoss] = useState(null);

  //if set sub Contract check Date of Main Contract
  const [mainContractDate, setMainContractDate] = useState();
  const [mainContractFinishDate, setMainContractFinishDate] = useState();

  const dateRules = [
    {
      required: true,
      message: "فیلد تاریخ اجباری است",
    },
    () => ({
      validator(rule, value) {
        if (
          checkShamsi(value, false) &&
          contractType === SUBSIDIARY_CONTRACT &&
          mainContractDate &&
          mainContractFinishDate
        ) {
          if (value < mainContractDate || value > mainContractFinishDate) {
            return Promise.reject("تاریخ  با تاریخ قرارد اصلی مطابقت ندارد");
          }
        }

        if (!value || checkShamsi(value, false)) {
          return Promise.resolve();
        } else {
          return Promise.reject("فرمت تاریخ صحیح نیست");
        }
      },
    }),
  ];

  const finishDateRule = [
    {
      required: true,
      message: "فیلد تاریخ اجباری است",
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (checkShamsi(value, false) && getFieldValue("start_date") > value) {
          return Promise.reject("تاریخ پایان نباید قبل از تاریخ شروع باشد");
        }
        if (
          checkShamsi(value, false) &&
          contractType === SUBSIDIARY_CONTRACT &&
          mainContractDate &&
          mainContractFinishDate
        ) {
          if (value < mainContractDate || value > mainContractFinishDate) {
            return Promise.reject("تاریخ  با تاریخ قرارد اصلی مطابقت ندارد");
          }
        }

        if (!value || checkShamsi(value, false)) {
          return Promise.resolve();
        } else {
          return Promise.reject("فرمت تاریخ صحیح نیست");
        }
      },
    }),
  ];

  const startDateRule = [
    {
      required: true,
      message: "فیلد تاریخ اجباری است",
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        // if (
        //   checkShamsi(value, false) &&
        //   getFieldValue("contract_date") > value
        // ) {
        //   return Promise.reject(
        //     "تاریخ شروع قرارداد نباید قبل از تاریخ قرارداد باشد."
        //   );
        // }
        if (
          checkShamsi(value, false) &&
          contractType === SUBSIDIARY_CONTRACT &&
          mainContractDate &&
          mainContractFinishDate
        ) {
          if (value < mainContractDate || value > mainContractFinishDate) {
            return Promise.reject("تاریخ  با تاریخ قرارد اصلی مطابقت ندارد");
          }
        }

        if (!value || checkShamsi(value, false)) {
          return Promise.resolve();
        } else {
          return Promise.reject("فرمت تاریخ صحیح نیست");
        }
      },
    }),
  ];

  useEffect(() => {
    getOfficesList()
      .then((res) => {
        setCompanies(res.list);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    form.setFieldsValue({ contractor_id: currentOffice });
    form.setFieldsValue({ employer_id: currentOffice });
  }, [currentOffice]);

  const successFullMessage = (msg) => {
    message.success(msg);
    setTimeout(() => {
      history.go();
    }, 1000);
  };

  const errorMessage = (msg) => {
    message.error(msg);
    console.log("error in message", msg);
  };

  let employerInput = null;
  let contractorInput = null;
  let componyOptions = [];
  if (companies && companies.length > 0) {
    componyOptions = companies.map((el) => {
      return { ...el, label: el.name, value: el.id };
    });
  }

  if (true /*contractType === SUBSIDIARY_CONTRACT*/) {
    // must be list of office that user have access
    // employerInput = (
    //   <SelectDropDown
    //     // defaultValue={componyOptions[0]["value"]}
    //     options={componyOptions}
    //     name="employer_id"
    //     label="کارفرما"
    //     disabled={true}
    //   />
    // );

    employerInput = (
      <GetPerson
        type="send"
        codeInputName="employer_code"
        textInputName="employer_name"
        name="employer_filed"
        label="کارفرما"
        url="/contract/contractor/lookup"
        form={form}
        setContractor={setEmployer}
        normalize={national_id_normalize}
        codeInputRules={[
          { required: true, message: "فیلد کارفرما اجباری است" },
          () => ({
            validator(rule, value) {
              if (employer) {
                return Promise.resolve();
              } else {
                return Promise.reject("کد ملی یا شناسه ملی بررسی نشده است !");
              }
            },
          }),
        ]}
      />
    );

    contractorInput = (
      <GetPerson
        type="send"
        codeInputName="contractor_code"
        textInputName="contractor_name"
        name="contractor_filed"
        label="پیمان کار"
        normalize={national_id_normalize}
        url="/contract/contractor/lookup"
        form={form}
        setContractor={setContractor}
        codeInputRules={[
          { required: true, message: "فیلد پیمان کار اجباری است" },
          () => ({
            validator(rule, value) {
              if (contractor) {
                return Promise.resolve();
              } else {
                return Promise.reject("کد ملی یا شناسه ملی بررسی نشده است !");
              }
            },
          }),
        ]}
      />
    );
  } else if (/*contractType === MAIN_CONTRACT*/ false) {
    employerInput = (
      <TextInput name="employer" label="کارفرما" rules={[{ required: true }]} />
    );

    contractorInput = (
      <SelectDropDown
        options={componyOptions}
        name="contractor_id"
        label="پیمان کار"
        rules={[{ required: true }]}
        disabled={true}
      />
    );
  }

  return (
    <>
      <GoBackBtn />
      <GetContractList
        modalVisible={contractModalListVisible}
        modalOnCancel={() => setContractModalListVisible(false)}
        form={form}
        setContractDate={setMainContractDate}
        setFinishDate={setMainContractFinishDate}
        contractType={form.getFieldValue("type")} // check civil or non_civil fro get main contract List
      />

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
        {...formItemLayout}
        name="addContract"
        onFinish={(values) =>
          onFinish(
            values,
            contractor,
            manager,
            boss,
            contractType,
            setLoading,
            successFullMessage,
            errorMessage,
            currentOffice,
            employer
          )
        }
        style={{}}
        onValuesChange={(values) =>
          onValuesChange(values, setContractType, form, setSubject)
        }
        form={form}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <RenderInputs
            inputsFiled={addContactsFields}
            additionalData={{
              contract_date: {
                rules: dateRules,
                form: form,
                onChange: () => {
                  let contractDate = form.getFieldValue("contract_date");
                  form.setFieldsValue({ start_date: contractDate });
                },
              },
              start_date: {
                rules: startDateRule,
                form: form,
              },
              finish_date: {
                rules: finishDateRule,
                form: form,
              },
              manager: {
                component: (
                  // <FetchDataWithCode
                  //   type="send"
                  //   codeInputName="manager_national_ic"
                  //   codeInputRules={[{ len: 10, message: "کد ملی اشتباه است" }]}
                  //   textInputName="manager_name"
                  //   name="manager"
                  //   label="مدیر پروژه"
                  //   url="/api/admin/personnel/lookup"
                  //   form={form}
                  //   setData={setManager}
                  // />
                  <NationalIdInput
                    type="send"
                    noFocus
                    codeField="manager_national_ic"
                    nameField="manager_name"
                    name="manager"
                    defaultValue={false}
                    label="مدیر پروژه"
                    help="کد ملی مدیر پروژه"
                    url="/api/admin/personnel/lookup"
                    form={form}
                    setData={setManager}
                  />
                ),
                hidden:
                  contractType && contractType === MAIN_CONTRACT ? true : false,
              },
              boss: {
                component: (
                  // <FetchDataWithCode
                  //   type="send"
                  //   codeInputName="boss"
                  //   codeInputRules={[{ len: 10, message: "کد ملی اشتباه است" }]}
                  //   textInputName="boss_name"
                  //   name="boss"
                  //   label="رئیس کارگاه"
                  //   url="/api/admin/personnel/lookup"
                  //   form={form}
                  //   setData={setBoss}
                  // />
                  <NationalIdInput
                    type="send"
                    noFocus
                    codeField="boss"
                    nameField="boss_name"
                    name="boss"
                    defaultValue={false}
                    label="رئیس کارگاه"
                    url="/api/admin/personnel/lookup"
                    form={form}
                    setData={setBoss}
                  />
                ),
                hidden:
                  contractType && contractType === MAIN_CONTRACT ? true : false,
              },
              employer: {
                component: employerInput,
              },
              main_contract: {
                component: (
                  <SelectMainContractInput
                    onClick={() => setContractModalListVisible(true)}
                    name="main_contract"
                    label="قرارداد اصلی"
                    textInputName="main_contract_id"
                    rules={[
                      { required: true, message: "فیلد قرارداد اصلی اجباریست" },
                    ]}
                  />
                ),
                hidden:
                  contractType && contractType === SUBSIDIARY_CONTRACT
                    ? true
                    : false,
              },
              contractor: {
                component: contractorInput,
              },
              workshop_code: {
                hidden:
                  contractType && contractType === MAIN_CONTRACT ? true : false,
              },
              row: {
                hidden:
                  contractType && contractType === MAIN_CONTRACT ? true : false,
                disabled: SUBJECT && SUBJECT.trim() == "دفتر ستاد",
              },
            }}
          />

          <SubmitBtn loading={loading} />
        </Row>
      </Form>
    </>
  );
};

export default AddContract;
