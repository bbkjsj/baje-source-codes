import React, { useState, useContext, useEffect } from "react";
import { Form, Row, message } from "antd";
import { RenderInputs } from "../../../components/renderInput/RenderInputs";
import { updateContactsFields } from "./inputList";
import {
  constants,
  getOfficesList,
  onValuesChange,
  handleTypeOfContract,
  onFinishUpdate,
} from "../utils/_helpers";
import FetchDataWithCode from "../../../components/renderInput/fetchDataWithCode/FetchDataWithCode";
import TextInput from "../../../components/renderInput/textInput/TextInput";
import SelectMainContractInput from "../../../components/contract/selectContract/SelectMainContractInput";
import GetContractList from "../../../containers/contract/GetContractList";
import SelectDropDown from "../../../components/renderInput/selectDropDown/SelectDropDown";
import GetPerson from "../../../components/renderInput/fetchDataWithCode/GetPerson";
import { useHistory, withRouter } from "react-router-dom";
import SubmitBtn from "../../../components/general/SubmitBtn";
import { checkShamsi } from "../../../_helpers";
import GoBackBtn from "../../../components/GoBackBtn";
import { getSingleContract } from "../utils/api";
import LoadingLogo from "../../../components/general/LoadingLogo";
import ContentTop from "components/general/ContentTop";
import { NationalIdInput } from "modules/personnel/realPerson/service/formItems";
import { formItemLayout, pageNames } from "constant";
import { useSelector } from "react-redux";

const { MAIN_CONTRACT, SUBSIDIARY_CONTRACT } = constants;

const UpdateContract = (props) => {
  const contractID = props.match.params.id;
  const history = useHistory();
  //get user data for check compony access
  const currentOffice = useSelector((state) => state.currentOffice);

  const [companies, setCompanies] = useState([]);
  const [contract, setContract] = useState();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [contractType, setContractType] = useState(null);
  const [form] = Form.useForm();
  const [contractModalListVisible, setContractModalListVisible] = useState(
    false
  );
  // for data must be send but don't exist in form
  const [contractor, setContractor] = useState(null);
  const [manager, setManager] = useState(null);
  const [boss, setBoss] = useState(null);

  //if set sub Contract check Date of Main Contract
  const [mainContractDate, setMainContractDate] = useState();
  const [mainContractFinishDate, setMainContractFinishDate] = useState();

  const [canNotEdit, setCanNotEdit] = useState(false);

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
        if (
          checkShamsi(value, false) &&
          getFieldValue("contract_date") > value
        ) {
          return Promise.reject(
            "تاریخ شروع قرارداد نباید قبل از تاریخ قرارداد باشد."
          );
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

  const errorMessage = (msg = "مشکلی پیش آمده است") => {
    message.error(msg);
    console.log("error in message", msg);
  };

  // check type of contract
  const handleSetContract = (data) => {
    console.log("hiiiii");
    const contractorID = data.contractor_id;

    if (!data.employer) {
      if (contractorID == currentOffice) {
        setCanNotEdit(true);
      } else {
        setCanNotEdit(false);
      }
      console.log("idso", currentOffice, data.employer1);
      data.employer = data.employer1;
    }

    if (contractorID == currentOffice) {
      let contractType = handleTypeOfContract(data.type);
      setContractor({ id: data.contractor_id, type: data.contractor_type });
      setContract(data);
      form.setFieldsValue({ type: `main_${contractType}` });
      setContractType(`main`);
    } else {
      let contractType = handleTypeOfContract(data.type);
      setContract(data);
      form.setFieldsValue({ type: `sub_${contractType}` });
      setContractType(`subsidiary`);
    }
  };

  useEffect(() => {
    form.setFieldsValue({ contractor_id: currentOffice });
    form.setFieldsValue({ employer_id: currentOffice });
    if (currentOffice) {
      getSingleContract(
        handleSetContract,
        errorMessage,
        contractID,
        setLoading,
        setBoss,
        setContractor,
        setManager
      );
    }
  }, [currentOffice]);

  useEffect(() => {
    getOfficesList()
      .then((res) => {
        setCompanies(res.list);
      })
      .catch((err) => console.log(err));
  }, []);

  let employerInput = null;
  let contractorInput = null;
  let componyOptions = [];
  if (companies && companies.length > 0) {
    componyOptions = companies.map((el) => {
      return { ...el, label: el.name, value: el.id };
    });
  }

  if (contractType === SUBSIDIARY_CONTRACT) {
    // must be list of office that user have access
    employerInput = (
      <SelectDropDown
        // defaultValue={componyOptions[0]["value"]}
        options={componyOptions}
        name="employer_id"
        label="کارفرما"
        disabled={true}
      />
    );

    contractorInput = (
      <GetPerson
        codeInputName="contractor_code"
        textInputName="contractor_name"
        type="edit"
        name="contractor_filed"
        label="پیمان کار"
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
  } else if (contractType === MAIN_CONTRACT) {
    employerInput = (
      <TextInput
        name="employer"
        label="کارفرما"
        rules={[{ required: true }]}
        disabled={canNotEdit}
      />
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

  const successFullMessage = (msg) => {
    message.success(msg);
    history.push(pageNames.contract.list);
  };

  if (loading || !contract) {
    return <LoadingLogo />;
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
        title="ویرایش قراداد"
        breadcrumbItems={[
          {
            text: "قرارداد ها",
            link: pageNames.contract.list,
          },
        ]}
      />

      <Form
        {...formItemLayout}
        name="addContract"
        onFinish={(values) =>
          onFinishUpdate(
            values,
            contractor,
            manager,
            boss,
            contractType,
            setSubmitLoading,
            successFullMessage,
            errorMessage,
            contractID,
            contract.contractor_id,
            contract.employer1_id,
            contract.main_contract_id
          )
        }
        initialValues={contract}
        style={{}}
        onValuesChange={(values) => onValuesChange(values, setContractType)}
        form={form}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <RenderInputs
            inputsFiled={updateContactsFields}
            additionalData={{
              contract_number: {
                disabled: canNotEdit,
              },
              type: {
                disabled: canNotEdit,
              },
              subject: {
                disabled: canNotEdit,
              },
              initial_amount: {
                disabled: canNotEdit,
              },
              contract_date: {
                disabled: canNotEdit,
                rules: dateRules,
                form: form,
                onChange: () => {
                  let contractDate = form.getFieldValue("contract_date");
                  form.setFieldsValue({ start_date: contractDate });
                },
              },
              start_date: {
                disabled: canNotEdit,
                rules: startDateRule,
                form: form,
              },
              finish_date: {
                disabled: canNotEdit,
                rules: finishDateRule,
                form: form,
              },
              manager: {
                component: (
                  <NationalIdInput
                    type={contract.manager ? "edit" : "send"}
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
                  <NationalIdInput
                    type={contract.boss ? "edit" : "send"}
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
              },
            }}
          />

          <SubmitBtn loading={submitLoading} />
        </Row>
      </Form>
    </>
  );
};

export default withRouter(UpdateContract);
