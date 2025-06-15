import { Checkbox, Col, Form, Input, Select, Spin } from "antd";
import React, { useState } from "react";
import { formColSpan, formColSpanFull } from "constant";
import {
  checkShamsi,
  priceNormalizer,
  countOfNumInp,
  currJalaliYear,
  convertDateToENProper,
  national_id_normalize,
} from "_helpers";
import GetContractList from "containers/contract/GetContractList";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import SelectMainContractInput from "components/contract/selectContract/SelectMainContractInput";
import GetPerson from "components/renderInput/fetchDataWithCode/GetPerson";
import {
  contractTypes,
  aliasContractTypes,
  actionTypes,
} from "../utils/constant";
import { NationalIdInput } from "modules/personnel/realPerson/service/formItems";
import * as actions from "../utils/actions";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { _GET } from "modules/environment/enviromentDefinition/utils/api";
import AppFormItem from "components/general/AppFormItem";
import moment from "moment-jalaali";
import adjustmentOptions from "./adjustmentBasisOptions";
import useWhoAmI from "hooks/useWhoAmI";
import { getOfficesList } from "pages/persons/realPerson/common/_helpers";

const Type = ({ disabled }) => {
  const options = [
    { label: "اصلی عمرانی", value: contractTypes.MAIN_CIVIL },
    { label: "اصلی غیر عمرانی", value: contractTypes.MAIN_NON_CIVIL },
    { label: "فرعی عمرانی", value: contractTypes.SUB_CIVIL },
    { label: "فرعی غیر عمرانی", value: contractTypes.SUB_NON_CIVIL },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item
        name="type"
        label="نوع قرارداد"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select options={options} disabled={disabled}></Select>
      </Form.Item>
    </Col>
  );
};

const Activity = () => {
  const options = [
    { label: "معدنی", value: "mineral" },
    { label: "غیرمعدنی", value: "non_mineral" },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item
        name="activity"
        label="نوع فعالیت"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select options={options}></Select>
      </Form.Item>
    </Col>
  );
};

const ContractNumber = ({ disabled }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item name="contractNumber" label="شماره قرارداد">
        <Input type="text" disabled={disabled} />
      </Form.Item>
    </Col>
  );
};

const MainContractName = ({ contractType, form, dispatch }) => {
  const [contractModalListVisible, setContractModalListVisible] = useState(
    false
  );

  const rules = [{ required: true, message: "فیلد قرارداد اصلی اجباریست" }];

  return contractType &&
    contractType === aliasContractTypes.SUBSIDIARY_CONTRACT ? (
    <>
      <GetContractList
        modalVisible={contractModalListVisible}
        modalOnCancel={() => setContractModalListVisible(false)}
        form={form}
        setContractDate={(payload) =>
          dispatch(actions.setMainContractDate(payload))
        }
        setFinishDate={(payload) =>
          dispatch(actions.setMainContractFinishDate(payload))
        }
        contractType={form.getFieldValue("type")}
        // check civil or non_civil fro get main contract List
      />

      <SelectMainContractInput
        onClick={() => setContractModalListVisible(true)}
        name="mainContractId"
        label="قرارداد اصلی"
        textInputName="mainContractId"
        rules={rules}
      ></SelectMainContractInput>
    </>
  ) : null;
};

const ContractDate = ({
  form,
  contractType,
  mainContractDate,
  mainContractFinishDate,
  disabled,
}) => {
  const rules = [
    {
      required: true,
      message: "فیلد تاریخ اجباری است",
    },
    () => ({
      validator(rule, value) {
        if (
          checkShamsi(value, false) &&
          contractType === aliasContractTypes.SUBSIDIARY_CONTRACT &&
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
  return (
    <CustomDatePicker
      name="date"
      label="تاریخ قرارداد"
      rules={rules}
      form={form}
      disabled={disabled}
      onChange={() => {
        let contractDate = form.getFieldValue("date");
        form.setFieldsValue({ startDate: contractDate });
      }}
    />
  );
};

const ContractStartDate = ({
  form,
  contractType,
  mainContractDate,
  mainContractFinishDate,
  disabled,
}) => {
  const rules = [
    {
      required: true,
      message: "فیلد تاریخ اجباری است",
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (checkShamsi(value, false) && getFieldValue("date") > value) {
          return Promise.reject(
            "تاریخ شروع قرارداد نباید قبل از تاریخ قرارداد باشد."
          );
        }
        if (
          checkShamsi(value, false) &&
          contractType === aliasContractTypes.SUBSIDIARY_CONTRACT &&
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

  return (
    <CustomDatePicker
      name="startDate"
      label="تاریخ شروع قرارداد"
      rules={rules}
      form={form}
      disabled={disabled}
    />
  );
};

const ContractEndDate = ({
  form,
  contractType,
  mainContractDate,
  mainContractFinishDate,
  disabled,
}) => {
  const rules = [
    {
      required: true,
      message: "فیلد تاریخ اجباری است",
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (checkShamsi(value, false) && getFieldValue("startDate") > value) {
          return Promise.reject("تاریخ پایان نباید قبل از تاریخ شروع باشد");
        }
        if (
          checkShamsi(value, false) &&
          contractType === aliasContractTypes.SUBSIDIARY_CONTRACT &&
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

  return (
    <CustomDatePicker
      name="endDate"
      label="تاریخ پایان قرارداد"
      rules={rules}
      form={form}
      disabled={disabled}
    />
  );
};

const Employer = ({ contractType, companies, disabled }) => {
  let componyOptions = [];
  if (companies && companies.length > 0) {
    componyOptions = companies.map((el) => {
      return { ...el, label: el.name, value: el.id };
    });
  }

  return contractType === aliasContractTypes.SUBSIDIARY_CONTRACT ? (
    <Col {...formColSpan}>
      <Form.Item name="employerId" label="کارفرما">
        <Select
          // defaultValue={componyOptions[0]["value"]}
          options={componyOptions}
          disabled={true}
        />
      </Form.Item>
    </Col>
  ) : contractType === aliasContractTypes.MAIN_CONTRACT ? (
    <Col {...formColSpan}>
      <Form.Item name="employer" label="کارفرما" rules={[{ required: true }]}>
        <Input disabled={disabled} />
      </Form.Item>
    </Col>
  ) : null;
};

const Contractor = ({
  contractType,
  companies,
  dispatch,
  form,
  contractor,
  contract,
}) => {
  let componyOptions = [];
  if (companies && companies.length > 0) {
    componyOptions = companies.map((el) => {
      return { ...el, label: el.name, value: el.id };
    });
  }

  return contractType ? (
    <GetPerson
      codeInputName="contractorCode"
      textInputName="contractorName"
      name="contractorFiled"
      label="پیمان کار"
      url="/contract/contractor/lookup"
      form={form}
      setContractor={(payload) => dispatch(actions.setContractor(payload))}
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
  ) : null;
};

const EmployerNew = ({
  contractType,
  companies,
  dispatch,
  form,
  contractor,
  contract,
}) => {
  let componyOptions = [];
  if (companies && companies.length > 0) {
    componyOptions = companies.map((el) => {
      return { ...el, label: el.name, value: el.id };
    });
  }

  return contractType ? (
    <GetPerson
      type={contract ? "edit" : "send"}
      codeInputName="employerCode"
      textInputName="employerName"
      name="employerFiled"
      label="کارفرما"
      url="/contract/contractor/lookup"
      form={form}
      setContractor={(payload) => dispatch(actions.setEmployer(payload))}
      codeInputRules={[
        { required: true, message: "فیلد کارفرما اجباری است" },
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
  ) : null;
};

const Subject = ({ disabled }) => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item name="subject" label="موضوع قرارداد" rules={rules}>
        <Input type="text" disabled={disabled} />
      </Form.Item>
    </Col>
  );
};

const Price = ({ disabled }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        name="initialAmount"
        label="مبلغ اولیه قراداد"
        normalize={priceNormalizer}
      >
        <Input type="text" disabled={disabled} />
      </Form.Item>
    </Col>
  );
};

const WorkshopCode = ({ contractType }) => {
  return contractType && contractType === aliasContractTypes.MAIN_CONTRACT ? (
    <Col {...formColSpan}>
      <Form.Item
        label="کد کارگاهی"
        name="workshopCode"
        normalize={(value, prevValue) => countOfNumInp(value, prevValue, 10)}
        rules={[
          {
            len: 10,
          },
        ]}
      >
        <Input type="text" />
      </Form.Item>
    </Col>
  ) : null;
};

const PeymanRow = ({ contractType, subject }) => {
  return contractType && contractType === aliasContractTypes.MAIN_CONTRACT ? (
    <Col {...formColSpan}>
      <Form.Item
        label="ردیف پیمان"
        name="row"
        normalize={(value, prevValue) => countOfNumInp(value, prevValue, 3)}
        rules={[
          {
            len: 3,
          },
        ]}
      >
        <Input
          type="text"
          disabled={subject && subject.trim() == "دفتر ستاد"}
        />
      </Form.Item>
    </Col>
  ) : null;
};

const SuperVision = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item name="supervision" label="دستگاه نظارت">
        <Input type="text" />
      </Form.Item>
    </Col>
  );
};

const Manager = ({ contractType, form, dispatch, contract }) => {
  return contractType && contractType === aliasContractTypes.MAIN_CONTRACT ? (
    <NationalIdInput
      type={contract?.manager ? "edit" : "send"}
      noFocus
      codeField="managerNationalId"
      nameField="managerName"
      name="manager"
      defaultValue={false}
      label="مدیر پروژه"
      help="کد ملی مدیر پروژه"
      url="/api/admin/personnel/lookup"
      form={form}
      setData={(payload) => dispatch(actions.setManager(payload))}
    />
  ) : null;
};

const Boss = ({ contractType, form, dispatch, contract }) => {
  return contractType && contractType === aliasContractTypes.MAIN_CONTRACT ? (
    <NationalIdInput
      type={contract?.boss ? "edit" : "send"}
      noFocus
      codeField="boss"
      nameField="bossName"
      name="boss"
      defaultValue={false}
      label="رئیس کارگاه"
      url="/api/admin/personnel/lookup"
      form={form}
      setData={(payload) => dispatch(actions.setBoss(payload))}
    />
  ) : null;
};

//////////////////////////////////////////////- new inputs -/////////////////////////////////////////////////////
const Consultant = () => {
  const user = useWhoAmI();
  const listLegal = user?.companies;

  return (
    <Col {...formColSpan}>
      <Form.Item label="مشاور" name="consultantCompanyId">
        <Select
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {listLegal.map((el) => (
            <Select.Option key={el.id} value={el.id} title={el.name}>
              {el.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <small style={{ marginTop: "-16px", display: "block" }}>
        برای جستجو عنوان را وارد کنید
      </small>
    </Col>
  );
};

const ContractType = ({ disabled }) => {
  const options = [
    { label: "دو عاملی", value: "twoOperators" },
    { label: "سه عاملی", value: "threeOperators" },
    { label: "EP", value: "EP" },
    { label: "EPC", value: "EPC" },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item
        name="contractType"
        label="نوع پیمان"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select options={options} disabled={disabled}></Select>
      </Form.Item>
    </Col>
  );
};

const ProjectEnvironment = ({ contractType }) => {
  const [environmentsList, setEnvironmentsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    _GET()
      .then((res) => {
        setLoading(false);
        let data = res?.data;
        if (data && data.length) {
          setEnvironmentsList(data);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("fetching environments error:", err);
      });
  }, []);

  const filterOptions = (input, option) => {
    let isCode = false;
    if (input.length === 5) {
      const sliceLength = 5 - String(option.value).length;

      isCode = String(option.value).includes(String(input).slice(sliceLength));
    }
    return (
      option.children.toLowerCase().includes(input.toLowerCase()) || isCode
    );
  };

  return contractType && contractType === aliasContractTypes.MAIN_CONTRACT ? (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Spin spinning={loading}>
        <AppFormItem name="environmentId" label="محیط پروژه">
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={filterOptions}
          >
            {environmentsList.map((el) => (
              <Select.Option key={el.id} value={el.id} title={el.title}>
                {el.title}
              </Select.Option>
            ))}
          </Select>
        </AppFormItem>
        <small style={{ marginTop: "-16px", display: "block" }}>
          برای جستجو عنوان یا کد پنج رقمی محیط را وارد کنید
        </small>
      </Spin>
    </Col>
  ) : null;
};

const PriceList = () => {
  const rules = [
    () => ({
      validator(rule, value) {
        if (
          !value ||
          (Number(value) >= 1350 && Number(value) <= Number(currJalaliYear()))
        ) {
          return Promise.resolve();
        } else {
          return Promise.reject("سال باید بین 1350 و سال جاری باشد");
        }
      },
    }),
  ];

  return (
    <Col {...formColSpan}>
      <AppFormItem
        name="priceListYear"
        label="فهرست بها"
        rules={rules}
        normalize={(value, prevValue) => countOfNumInp(value, prevValue, 4)}
      >
        <Input type="number" />
      </AppFormItem>
    </Col>
  );
};

const AdjustmentBasis = () => {
  const rules = [{ required: true }];

  const filterOptions = (input, option) => {
    return (
      option.children.toLowerCase().includes(input.toLowerCase()) ||
      input == option.value
    );
  };

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem name="adjustmentBaseIndex" label="شاخص مبنای تعدیل">
        <Select
          showSearch
          optionFilterProp="children"
          filterOption={filterOptions}
        >
          {adjustmentOptions.map((el) => (
            <Select.Option
              key={el.value}
              value={Number(el.value)}
              title={el.label}
            >
              {el.label}
            </Select.Option>
          ))}
        </Select>
      </AppFormItem>
      <small style={{ marginTop: "-16px", display: "block" }}>
        برای جستجو عنوان یا کد پنج رقمی را وارد کنید
      </small>
    </Col>
  );
};

const PriceListParts = () => {
  const rules = [{ required: true }];

  const filterOptions = (input, option) => {
    return option.children.toLowerCase().includes(input.toLowerCase());
  };

  let options = [];
  for (let i = 1; i <= 29; i++) {
    options.push(
      <Select.Option key={i} value={i}>
        {String(i)}
      </Select.Option>
    );
  }

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem name="priceListParts" label="فصل های فهرست بها">
        <Select
          mode="multiple"
          showSearch={false}
          showArrow
          optionFilterProp="children"
          filterOption={filterOptions}
        >
          {options}
        </Select>
      </AppFormItem>
    </Col>
  );
};

const TimeWeight = () => {
  const rules = [
    () => ({
      validator(rule, value) {
        if (!value || (Number(value) >= 0 && Number(value) <= 100)) {
          return Promise.resolve();
        } else {
          return Promise.reject("وزن زمانی باید بین 0 و 100 باشد");
        }
      },
    }),
  ];

  return (
    <Col {...formColSpan}>
      <AppFormItem name="timeWeight" label="وزن زمانی" rules={rules}>
        <Input type="number" />
      </AppFormItem>
    </Col>
  );
};

const RialWeight = () => {
  const rules = [
    () => ({
      validator(rule, value) {
        if (!value || (Number(value) >= 0 && Number(value) <= 100)) {
          return Promise.resolve();
        } else {
          return Promise.reject("وزن ریالی باید بین 0 و 100 باشد");
        }
      },
    }),
  ];

  return (
    <Col {...formColSpan}>
      <AppFormItem name="rialWeight" label="وزن ریالی" rules={rules}>
        <Input type="number" />
      </AppFormItem>
    </Col>
  );
};

//////////////////////////////////////////////- project status modal inputs -/////////////////////////////////////////////////////
function isDateOlderThanStart(start, value) {
  return (
    new Date(start).getTime() > new Date(convertDateToENProper(value)).getTime()
  );
}

function isDateOlderThanTempDelivery(tempDelivery, value) {
  return (
    new Date(convertDateToENProper(tempDelivery)).getTime() >
    new Date(convertDateToENProper(value)).getTime()
  );
}

export const FixDefectsDate = ({ useForm, enabled, onChange, data }) => {
  const rules = [
    {
      required: true,
    },
    () => ({
      validator(rule, value) {
        if (!checkShamsi(value, false)) {
          return Promise.reject("فرمت تاریخ صحیح نیست");
        }
        if (isDateOlderThanStart(data?.startDate, value)) {
          return Promise.reject("تاریخ باید بعد از تاریخ شروع قرارداد باشد");
        }
        return Promise.resolve();
      },
    }),
  ];
  return (
    <div className="input-wrapper">
      <Checkbox
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        className="ml-2"
      />
      <CustomDatePicker
        form={useForm}
        label="رفع نواقص"
        name="defectsFixedOn"
        rules={enabled ? rules : []}
        disabled={!enabled}
      />
    </div>
  );
};

export const TemporaryDelivery = ({ useForm, enabled, onChange, data }) => {
  const rules = [
    {
      required: true,
    },
    () => ({
      validator(rule, value) {
        if (!checkShamsi(value, false)) {
          return Promise.reject("فرمت تاریخ صحیح نیست");
        }
        if (isDateOlderThanStart(data?.startDate, value)) {
          return Promise.reject("تاریخ باید بعد از تاریخ شروع قرارداد باشد");
        }
        if (
          new Date(data?.endDate).setHours(0, 0, 0, 0) !==
          new Date(convertDateToENProper(value)).setHours(0, 0, 0, 0)
        ) {
          return Promise.reject(
            "تاریخ تحویل موقت باید مساوی با تاریخ پایان قرارداد باشد"
          );
        }
        return Promise.resolve();
      },
    }),
  ];
  return (
    <div className="input-wrapper">
      <Checkbox
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        className="ml-2"
      />

      <CustomDatePicker
        form={useForm}
        label="تحویل موقت"
        name="temporaryDeliveredOn"
        rules={enabled ? rules : []}
        disabled={!enabled}
      />
    </div>
  );
};

export const DefinitiveStatus = ({ useForm, enabled, onChange, data }) => {
  const rules = [
    {
      required: true,
    },
    () => ({
      validator(rule, value) {
        if (!checkShamsi(value, false)) {
          return Promise.reject("فرمت تاریخ صحیح نیست");
        }
        if (isDateOlderThanStart(data?.startDate, value)) {
          return Promise.reject("تاریخ باید بعد از تاریخ شروع قرارداد باشد");
        }
        return Promise.resolve();
      },
    }),
  ];
  return (
    <div className="input-wrapper">
      <Checkbox
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        className="ml-2"
      />

      <CustomDatePicker
        form={useForm}
        label="صورت وضعیت قطعی"
        name="definitiveStatementOn"
        rules={enabled ? rules : []}
        disabled={!enabled}
      />
    </div>
  );
};

export const DefinitiveAdjustments = ({ useForm, enabled, onChange, data }) => {
  const rules = [
    {
      required: true,
    },
    () => ({
      validator(rule, value) {
        if (!checkShamsi(value, false)) {
          return Promise.reject("فرمت تاریخ صحیح نیست");
        }
        if (isDateOlderThanStart(data?.startDate, value)) {
          return Promise.reject("تاریخ باید بعد از تاریخ شروع قرارداد باشد");
        }
        return Promise.resolve();
      },
    }),
  ];
  return (
    <div className="input-wrapper">
      <Checkbox
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        className="ml-2"
      />

      <CustomDatePicker
        form={useForm}
        label="تعدیل قطعی"
        name="definitiveAdjustmentOn"
        rules={enabled ? rules : []}
        disabled={!enabled}
      />
    </div>
  );
};

export const DefinitiveDelivery = ({ useForm, enabled, onChange, data }) => {
  const rules = [
    {
      required: true,
    },
    () => ({
      validator(rule, value) {
        if (!checkShamsi(value, false)) {
          return Promise.reject("فرمت تاریخ صحیح نیست");
        }
        if (isDateOlderThanStart(data?.startDate, value)) {
          return Promise.reject("تاریخ باید بعد از تاریخ شروع قرارداد باشد");
        }

        if (useForm.getFieldValue("temporaryDeliveredOn")) {
          if (
            isDateOlderThanTempDelivery(
              useForm.getFieldValue("temporaryDeliveredOn"),
              value
            )
          ) {
            return Promise.reject("تاریخ باید بعد از تاریخ تحویل موقت باشد");
          }
        }
        return Promise.resolve();
      },
    }),
  ];
  return (
    <div className="input-wrapper">
      <Checkbox
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        className="ml-2"
      />

      <CustomDatePicker
        form={useForm}
        label="تحویل قطعی"
        name="definitiveDeliveryOn"
        rules={enabled ? rules : []}
        disabled={!enabled}
      />
    </div>
  );
};

export const SettlementReceipt = ({ useForm, enabled, onChange, data }) => {
  const rules = [
    {
      required: true,
    },
    () => ({
      validator(rule, value) {
        if (!checkShamsi(value, false)) {
          return Promise.reject("فرمت تاریخ صحیح نیست");
        }
        if (isDateOlderThanStart(data?.startDate, value)) {
          return Promise.reject("تاریخ باید بعد از تاریخ شروع قرارداد باشد");
        }
        if (useForm.getFieldValue("temporaryDeliveredOn")) {
          if (
            isDateOlderThanTempDelivery(
              useForm.getFieldValue("temporaryDeliveredOn"),
              value
            )
          ) {
            return Promise.reject("تاریخ باید بعد از تاریخ تحویل موقت باشد");
          }
        }
        return Promise.resolve();
      },
    }),
  ];
  return (
    <div className="input-wrapper">
      <Checkbox
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        className="ml-2"
      />

      <CustomDatePicker
        form={useForm}
        label="دریافت مفاصاحساب"
        name="accountSettledOn"
        rules={enabled ? rules : []}
        disabled={!enabled}
      />
    </div>
  );
};

export const GuaranteesRelease = ({ useForm, enabled, onChange, data }) => {
  const rules = [
    {
      required: true,
    },
    () => ({
      validator(rule, value) {
        if (!checkShamsi(value, false)) {
          return Promise.reject("فرمت تاریخ صحیح نیست");
        }
        if (isDateOlderThanStart(data?.startDate, value)) {
          return Promise.reject("تاریخ باید بعد از تاریخ شروع قرارداد باشد");
        }
        if (useForm.getFieldValue("temporaryDeliveredOn")) {
          if (
            isDateOlderThanTempDelivery(
              useForm.getFieldValue("temporaryDeliveredOn"),
              value
            )
          ) {
            return Promise.reject("تاریخ باید بعد از تاریخ تحویل موقت باشد");
          }
        }
        return Promise.resolve();
      },
    }),
  ];
  return (
    <div className="input-wrapper">
      <Checkbox
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        className="ml-2"
      />

      <CustomDatePicker
        form={useForm}
        label="آزادسازی ضمانتنامه ها"
        name="warrantyReleasedOn"
        rules={enabled ? rules : []}
        disabled={!enabled}
      />
    </div>
  );
};

export const Checkout = ({ useForm, enabled, onChange, data }) => {
  const rules = [
    {
      required: true,
    },
    () => ({
      validator(rule, value) {
        if (!checkShamsi(value, false)) {
          return Promise.reject("فرمت تاریخ صحیح نیست");
        }
        if (isDateOlderThanStart(data?.startDate, value)) {
          return Promise.reject("تاریخ باید بعد از تاریخ شروع قرارداد باشد");
        }
        if (useForm.getFieldValue("temporaryDeliveredOn")) {
          if (
            isDateOlderThanTempDelivery(
              useForm.getFieldValue("temporaryDeliveredOn"),
              value
            )
          ) {
            return Promise.reject("تاریخ باید بعد از تاریخ تحویل موقت باشد");
          }
        }
        return Promise.resolve();
      },
    }),
  ];
  return (
    <div className="input-wrapper">
      <Checkbox
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        className="ml-2"
      />

      <CustomDatePicker
        form={useForm}
        label="تسویه حساب"
        name="checkoutOn"
        rules={enabled ? rules : []}
        disabled={!enabled}
      />
    </div>
  );
};

const CompanyPath = () => {
  const [companyList, setCompanyList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getOfficesList()
      .then((res) => {
        setCompanyList(res.list);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filterOptions = (input, option) => {
    let isCode = false;
    isCode = String(option.national_id).includes(String(input));

    return (
      option.children.toLowerCase().includes(input.toLowerCase()) || isCode
    );
  };

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Spin spinning={loading}>
        <AppFormItem name="consultantCompanyId" label="مشاور">
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={filterOptions}
          >
            {companyList.map((el) => (
              <Select.Option
                key={el.id}
                value={el.id}
                title={el.name}
                national_id={el.national_id}
              >
                {el.name}
              </Select.Option>
            ))}
          </Select>
        </AppFormItem>
        <small style={{ marginTop: "-16px", display: "block" }}>
          برای جستجو عنوان یا شناسه ملی شرکت را وارد کنید
        </small>
      </Spin>
    </Col>
  );
};

export {
  Type,
  Activity,
  ContractNumber,
  MainContractName,
  ContractDate,
  ContractStartDate,
  ContractEndDate,
  Employer,
  Contractor,
  Subject,
  Price,
  WorkshopCode,
  PeymanRow,
  SuperVision,
  Manager,
  Boss,
  Consultant,
  ContractType,
  ProjectEnvironment,
  PriceList,
  AdjustmentBasis,
  PriceListParts,
  TimeWeight,
  RialWeight,
  EmployerNew,
  CompanyPath,
};
