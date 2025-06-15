import {
  Col,
  Form,
  Input,
  Select,
  Checkbox,
  message,
  Row,
  Button,
  Spin,
  Radio,
  Upload,
} from "antd";
import React, { forwardRef, useEffect, useState } from "react";
import moment from "moment-jalaali";
import {
  checkShamsi,
  convertDateToEN,
  covetFormatDateToEn,
  imageValidation,
} from "_helpers";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { NationalIdInput } from "modules/personnel/realPerson/service/formItems";
import AppFormItem from "components/general/AppFormItem";
import useIsMobile from "hooks/useIsMobile";
import { CloseOutlined } from "@ant-design/icons";
import MachineSearchModal from "components/MachineAdvancedSearchModal";
import AppButton from "components/general/AppButton";
import { showMessage } from "utils/message";
import { getVehicles } from "modules/hse/api/genraal";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { UploadOutlined } from "@ant-design/icons";
import AppNumInput from "components/general/AppNumInput";
import useWhoAmI from "hooks/useWhoAmI";
///////////////////////////////////////////////////

const InsuranceNumber = ({ defaultValue = "", onInquiryButton, machine }) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const rules = [
    {
      required: true,
    },
  ];

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem
        label="شناسه یکتای بیمه مرکزی"
        name="insuranceIdentification"
        required
      >
        <div className="flex">
          <Input
            type="number"
            defaultValue={defaultValue}
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
          />
          <AppButton
            disabled={!machine || !inputValue}
            style={{ height: "40px" }}
            onClick={onInquiryButton}
          >
            استعلام
          </AppButton>
        </div>
      </AppFormItem>
    </Col>
  );
};

///////////////////////////////////////////////////

const InsuranceLetterNumber = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem label="شماره بیمه نامه" name="insuranceNumber" required>
        <Input />
      </AppFormItem>
    </Col>
  );
};

///////////////////////////////////////////////////

const DamageHistory = () => {
  const rules = [
    {
      asyncValidator: (rule, value) => {
        return new Promise((resolve, reject) => {
          if (value < 0 || value > 99) {
            reject("سابقه عدم خسارت باید بین 0 و 99 باشد");
          } else {
            resolve();
          }
        });
      },
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem
        label="سابقه عدم خسارت (سال)"
        name="noDamageHistory"
        required
        rules={rules}
      >
        <Input type="number" />
      </AppFormItem>
    </Col>
  );
};

///////////////////////////////////////////////////

const InsuranceRight = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem label="حق بیمه (ریال)" name="insurance" required>
        <AppNumInput inputmode="numeric" />
      </AppFormItem>
    </Col>
  );
};

///////////////////////////////////////////////////

const MaxInsPerAccident = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem
        label="حداكثر تعهد خسارت مالي در هر حادثه (ریال)"
        name="maxCommitmentFinancialDamages"
      >
        <AppNumInput inputmode="numeric" />
      </AppFormItem>
    </Col>
  );
};

///////////////////////////////////////////////////

const MaxInsPerCasualty = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem
        label="حداكثر تعهد صدمات جاني در هر حادثه براي هر نفر (ریال)"
        name="maxCommitmentInjury"
      >
        <AppNumInput inputmode="numeric" />
      </AppFormItem>
    </Col>
  );
};

///////////////////////////////////////////////////

const MaxInsDriver = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem
        label="حداكثر تعهد حوادث راننده (ریال)"
        name="maxCommitmentDriver"
      >
        <AppNumInput inputmode="numeric" />
      </AppFormItem>
    </Col>
  );
};

////////////////////////////////////////////////////

const InsurerCompanyID = ({ disabled }) => {
  const rules = [{ required: true }];
  const user = useWhoAmI();
  const listLegal = user?.companies;

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem label="شرکت بیمه گر" name="insuranceCompanyId" required>
        <Select
          disabled={disabled}
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
      </AppFormItem>
    </Col>
  );
};

////////////////////////////////////////////////////
// can be either a person or a company
const StyledNIdInput = styled.div`
  width: 100%;
  max-width: 100%;
  & > .ant-col {
    width: 100%;
    max-width: 100%;
  }
`;

const Insurer = ({
  useForm,
  setPerson,
  defaultValue = false,
  defaultCompanyValue = false,
  edit = false,
  button = true,
  disabled = false,
  insurerMode,
  setInsurerMode,
}) => {
  const rules = [{ required: true }];
  const user = useWhoAmI();
  const listLegal = user?.companies;

  const onRadioChange = (e) => {
    setInsurerMode(e.target.value);
  };

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <label className="ant-form-item-no-colon d-block required-label">
        بیمه گذار
      </label>
      <Radio.Group
        onChange={onRadioChange}
        value={insurerMode}
        className="my-2"
      >
        <Radio value="person">شخص حقیقی</Radio>
        <Radio value="company">شخص حقوقی</Radio>
      </Radio.Group>

      {insurerMode === "company" ? (
        <AppFormItem name="insurerCompanyId" rules={rules} required>
          <Select
            disabled={disabled}
            showSearch
            defaultValue={defaultCompanyValue}
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
        </AppFormItem>
      ) : (
        <StyledNIdInput>
          <NationalIdInput
            type={edit ? "edit" : "send"}
            codeField="insurerPersonnelId"
            nameField="person_name"
            name="person_national_code"
            url="/api/admin/personnel/lookup"
            form={useForm}
            setData={setPerson}
            isRequired={true}
            defaultValue={defaultValue}
            disabled={button}
          />
        </StyledNIdInput>
      )}
    </Col>
  );
};

///////////////////////////////////////////////////

const InsuranceReceiver = ({
  useForm,
  setPerson,
  defaultValue = false,
  edit = false,
  button = true,
}) => {
  return (
    <NationalIdInput
      type={edit ? "edit" : "send"}
      codeField="deliverToPersonnelId"
      nameField="receiver_name"
      name="receiver_national_code"
      label="تحویل گیرنده بیمه نامه"
      url="/api/admin/personnel/lookup"
      form={useForm}
      setData={setPerson}
      isRequired={true}
      defaultValue={defaultValue}
      disabled={button}
    />
  );
};

////////////////////////////////////////////////////
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  if (e.fileList.length > 1) {
    e.fileList.shift();
  }

  return e && e.fileList;
};

const InsuranceLetterScan = ({ defaultFileList }) => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem
        name="file"
        valuePropName="fileList"
        label="اسکن بیمه نامه"
        getValueFromEvent={normFile}
        rules={[imageValidation]}
      >
        <Upload
          defaultFileList={defaultFileList ? defaultFileList : []}
          beforeUpload={(file) => {
            return false;
          }}
          accept=".jpg,.jpeg,.gif,.png"
        >
          <Button>
            <UploadOutlined /> انتخاب فایل
          </Button>
        </Upload>
      </AppFormItem>
    </Col>
  );
};

///////////////////////////////////////////////////

// Added Validation for start and end date
const StartDate = ({ useForm, onChange }) => {
  // const checkStartDate = ({ getFieldValue }) => ({
  //   validator(rule, value) {
  //     var startTime = convertDateToEN(getFieldValue("start_date"));

  //     var currentTime = moment().format("YYYY/M/D");
  //     console.info(startTime + "   " + currentTime);

  //     if (checkShamsi(value, false) && currentTime > startTime) {
  //       return Promise.reject("تاریخ نباید برای قبل باشد.");
  //     }
  //     return Promise.resolve();
  //   },
  // });
  const rules = [
    {
      required: true,
      // message: "فیلد زمان پایان اجباریست",
    },
    //checkStartDate,
  ];

  return (
    <CustomDatePicker
      form={useForm}
      label="اعتبار بیمه نامه از تاریخ"
      name="fromDate"
      rules={rules}
      onChange={onChange}
      required
    />
  );
};

const EndDate = forwardRef(({ useForm, onChange }, ref) => {
  const checkEndDate = ({ getFieldValue }) => ({
    validator(rule, value) {
      var startTime = convertDateToEN(getFieldValue("fromDate"));
      var endTime = convertDateToEN(getFieldValue("toDate"));

      console.info(startTime + "   " + endTime);

      if (checkShamsi(value, false) && endTime < startTime) {
        return Promise.reject("نباید قبل از تاریخ شروع باشد.");
      }
      return Promise.resolve();
    },
  });
  const rules = [
    {
      required: true,
      message: "تاریخ اتمام اجباری است",
    },
    checkEndDate,
  ];

  return (
    <CustomDatePicker
      form={useForm}
      label="تا تاریخ"
      name="toDate"
      ref={ref}
      rules={rules}
      required
    />
  );
});

const Description = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="توضیحات" name="description">
        <Input.TextArea />
      </Form.Item>
    </Col>
  );
};

//////////////////////////////////////////////////

const MachineSelector = ({
  disabled,
  machine,
  setMachine,
  form,
  setInsurerMode,
  updating,
  machineSpecificCode,
  setDefaultInsurer,
}) => {
  const [state, setState] = useState({
    loading: false,
    searchContent: machine?.organization_code || null,
    searchModal: false,
  });
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!updating && machineSpecificCode) {
      setState((s) => ({ ...s, searchContent: machineSpecificCode }));
      handleSearch(machineSpecificCode);
    }
  }, [machineSpecificCode]);

  function handleChangeSearch({ target }) {
    setState((s) => ({ ...s, searchContent: target.value }));
  }

  function handleSubmit() {
    if (!machine && state.searchContent) {
      handleSearch();
    } else if (machine) {
      setMachine(null);
      setState((s) => ({ ...s, searchContent: null }));
    } else {
      setState((s) => ({ ...s, searchModal: true }));
    }
  }

  async function handleSearch(orgCode) {
    if (!state.searchContent && !orgCode) {
      return showMessage("مقداری برای جستجو وارد نکرده اید", "error");
    } else {
      setState((s) => ({ ...s, loading: true }));
      try {
        const { data } = await getVehicles({
          organization_code: orgCode || state.searchContent,
        });

        if (data[0]) {
          const newMachine = data[0];
          console.info("got machine:", newMachine);
          setMachine(newMachine);
          form.setFieldsValue({
            machineOrganizationCode: newMachine?.organization_code,
          });
          setState((s) => ({ ...s, loading: false }));

          // set insurer
          if (newMachine.owner_type && newMachine.owner_id_fk) {
            if (newMachine.owner_type === "company") {
              setInsurerMode("company");
              form.setFieldsValue({ insurerCompanyId: newMachine.owner_id_fk });
            } else {
              setInsurerMode("person");
              form.setFieldsValue({
                insurerPersonnelId: newMachine.owner_id_fk,
              });
              setDefaultInsurer(newMachine.owner_id_fk);
            }
          }
        } else {
          return showMessage("ماشینی یافت نشد", "error");
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setState((s) => ({ ...s, loading: false }));
      }
    }
  }

  return (
    <>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <AppFormItem
          name="machineOrganizationCode"
          label={!isMobile && "کد ماشین"}
          required
        >
          <div className="flex">
            <Input
              placeholder="کد ماشین"
              onChange={handleChangeSearch}
              disabled={disabled || machine}
              prefix={
                state.loading ? (
                  <Spin />
                ) : (
                  <CloseOutlined
                    style={{
                      color: "red",
                      fontSize: 10,
                      cursor: !(disabled || machine)
                        ? "pointer"
                        : "not-allowed",
                    }}
                    onClick={() => {
                      if (!(disabled || machine))
                        handleChangeSearch({ target: { value: "" } });
                    }}
                  />
                )
              }
              value={state.searchContent}
              //className="text-xs-center"
            />
            <AppButton onClick={handleSubmit} style={{ height: "40px" }}>
              {machine ? "تغییر" : state.searchContent ? "بررسی" : "جستجو"}
            </AppButton>
          </div>
        </AppFormItem>
        {machine ? (
          <p>{`${machine.type || ""} ${machine.system || ""} ${
            machine.style || ""
          }`}</p>
        ) : (
          ""
        )}
      </Col>

      <MachineSearchModal
        visible={state.searchModal}
        handleCancel={() => setState((s) => ({ ...s, searchModal: false }))}
        onChoose={(item) => {
          setState((s) => ({
            ...s,
            searchContent: item.organizationCode,
            searchModal: false,
          }));
          handleSearch(item.organizationCode);
        }}
      />
    </>
  );
};

////////////////////// INQUIRY INPUTS //////////////////////
const InsuranceUniqueNumber = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem label="کد یکتای بیمه" name="UniqPolicyNo" required>
        <Input type="number" />
      </AppFormItem>
    </Col>
  );
};

const InsurerNationalNumber = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem
        label="کد ملی/شناسه ملی بیمه گذار"
        name="NationalCode"
        required
      >
        <Input inputMode="numeric" />
      </AppFormItem>
    </Col>
  );
};

const InquirerNationalCode = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem
        label="کد ملی استعلام گیرنده"
        name="InquirarNationalId"
        required
      >
        <Input inputMode="numeric" disabled />
      </AppFormItem>
    </Col>
  );
};

const CaptchaCode = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem label="کد امنیتی" name="SentCaptcha" required>
        <Input />
      </AppFormItem>
    </Col>
  );
};

export {
  MachineSelector,
  InsuranceNumber,
  InsuranceLetterNumber,
  InsurerCompanyID,
  Insurer,
  StartDate,
  EndDate,
  DamageHistory,
  InsuranceRight,
  MaxInsPerAccident,
  MaxInsPerCasualty,
  MaxInsDriver,
  InsuranceReceiver,
  InsuranceLetterScan,
  Description,
  // inquiry Inputs
  InsuranceUniqueNumber,
  InsurerNationalNumber,
  InquirerNationalCode,
  CaptchaCode,
};
