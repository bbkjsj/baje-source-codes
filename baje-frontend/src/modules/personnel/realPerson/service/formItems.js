import {
  Col,
  Form,
  Input,
  Select,
  Checkbox,
  message,
  Row,
  Button,
  notification,
  Modal,
  Spin,
  Upload,
  List,
} from "antd";
import React, { useEffect, useState, useRef } from "react";
import { checkShamsi, countOfNumInp, numberNormalize } from "_helpers";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { utils } from "react-modern-calendar-datepicker";
import PeriodTime from "components/PeriodTime";
import axios from "api/appAxios";
import AppFormItem from "components/general/AppFormItem";
import AppButton from "components/general/AppButton";
import scuredAxios from "api/appAxios";
import AppNumInput from "components/general/AppNumInput";
import NidSearchModal from "components/NidAdvancedSearchModal";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { getOfficesList } from "pages/persons/realPerson/common/_helpers";
import NewPersonModal from "pages/persons/realPerson/list/NestedTable/components/NewPersonModal";
import { handleValidateNationalNumber } from "_helpers";
import { stringify } from "query-string";
import ExcelBtn from "components/general/ExcelBtn";
import GeneralInputSearchModal from "components/GeneralInputSearchModal/GeneralInputSearchModal";
import readXlsxFile from "read-excel-file";
import endpoints from "modules/personnel/endpoints";

const itemTypes = {
  SERVICE: "خدمت",
  DAMAGE: "خسارت",
};

const serviceDamageTypes = {
  FINANCE: "مالی",
  BODY: "جانی",
  PRESTIGE: "حیثیتی",
};

const rewardTypes = {
  CASH: "نقدی",
  NON_CASH_COUPON: "بن غیرنقدی",
  INCENTIVE_LEAVE: "مرخصی تشویقی",
  JOB_PROMOTION: "ترفیع شغلی",
};

const penaltyTypes = {
  CASH: "نقدی",
  SUSPENSION: "تعلیق",
  JOB_DEGRADATION: "تنزیل شغلی",
  DISCIPLINARY_INTRODUCTION: "معرفی به کمیته انضباطی",
  DISMISSAL: "اخراج",
};

const Person = ({
  useForm,
  setPerson,
  edit = false,
  defaultValue = false,
  button = true,
}) => {
  return (
    <NationalIdInput
      type={edit ? "edit" : "send"}
      codeField="person_personnel_id"
      nameField="person_name"
      name="personnel_id"
      label="انتخاب شخص"
      url="/api/admin/personnel/lookup"
      form={useForm}
      defaultValue={defaultValue}
      setData={setPerson}
      isRequired={true}
      disabled={button}
    />
  );
};

const Type = ({ onChange }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    { label: itemTypes.SERVICE, value: itemTypes.SERVICE },
    { label: itemTypes.DAMAGE, value: itemTypes.DAMAGE },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem label="نوع" name="type" rules={rules}>
        <Select options={options} onChange={onChange}></Select>
      </AppFormItem>
    </Col>
  );
};

const ItemDate = ({ useForm, onChange }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ ثبت اجباری است",
    },
    () => ({
      validator(rule, value) {
        if (checkShamsi(value)) {
          return Promise.resolve();
        } else {
          return Promise.reject("فرمت تاریخ صحیح نیست");
        }
      },
    }),
  ];

  return (
    <CustomDatePicker
      form={useForm}
      label="تاریخ"
      name="date"
      maximumDate={utils("fa").getToday()}
      rules={rules}
    />
  );
};

const Description = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem label="شرح" name="description">
        <Input.TextArea />
      </AppFormItem>
    </Col>
  );
};

const TypeServiceDamage = () => {
  const rules = [
    {
      required: true,
    },
  ];
  const options = [
    { label: serviceDamageTypes.FINANCE, value: serviceDamageTypes.FINANCE },
    { label: serviceDamageTypes.BODY, value: serviceDamageTypes.BODY },
    { label: serviceDamageTypes.PRESTIGE, value: serviceDamageTypes.PRESTIGE },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem
        label="نوع خدمت / خسارت"
        name="type_service_damage"
        rules={rules}
      >
        <Select
          options={options}
          onChange={(value) => console.log(value, "!value")}
        ></Select>
      </AppFormItem>
    </Col>
  );
};

const TypeRewardPenalty = ({ type, onChange }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const rewardOptions = [
    { label: rewardTypes.CASH, value: rewardTypes.CASH },
    { label: rewardTypes.NON_CASH_COUPON, value: rewardTypes.NON_CASH_COUPON },
    { label: rewardTypes.INCENTIVE_LEAVE, value: rewardTypes.INCENTIVE_LEAVE },
    { label: rewardTypes.JOB_PROMOTION, value: rewardTypes.JOB_PROMOTION },
  ];

  const penaltyOptions = [
    { label: penaltyTypes.CASH, value: penaltyTypes.CASH },
    { label: penaltyTypes.SUSPENSION, value: penaltyTypes.SUSPENSION },
    {
      label: penaltyTypes.JOB_DEGRADATION,
      value: penaltyTypes.JOB_DEGRADATION,
    },
    {
      label: penaltyTypes.DISCIPLINARY_INTRODUCTION,
      value: penaltyTypes.DISCIPLINARY_INTRODUCTION,
    },
    { label: penaltyTypes.DISMISSAL, value: penaltyTypes.DISMISSAL },
  ];

  let options = type === itemTypes.SERVICE ? rewardOptions : penaltyOptions;

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem label="نوع پاداش / جریمه" name="type_reward_penalty">
        <Checkbox.Group options={options} onChange={onChange} />
      </AppFormItem>
    </Col>
  );
};

const AmountRewardPenalty = ({
  type,
  onChange,
  useForm,
  isReward = false,
  name = "amount_reward_penalty",
}) => {
  const rules = [
    {
      required: true,
    },
  ];

  let values = null;

  const handleChanges = () => {
    const rewardFields = [
      "cash",
      "coupon",
      "incentive_duration_year",
      "incentive_duration_month",
      "incentive_duration_day",
      "promotion_job_id",
    ];
    const penaltyFields = [
      "cash",
      "suspension_duration_year",
      "suspension_duration_month",
      "suspension_duration_day",
      "degradation_job_id",
    ];
    const fieldsToRemove = [
      ...rewardFields,
      ...penaltyFields,
      "promotion_job",
      "degradation_job",
      "promotion_job_name",
      "degradation_job_name",
    ];

    values = useForm.getFieldsValue(isReward ? rewardFields : penaltyFields);
    Object.keys(values).map((key) => {
      if (values[key] === undefined) delete values[key];
    });

    useForm.setFieldsValue({ [name]: JSON.stringify(values) });
    onChange(values, fieldsToRemove);
  };

  if (!type || !type.length) return null;

  return (
    <AppFormItem name={name} noStyle={true}>
      {type.includes(rewardTypes.CASH) && (
        <Col xs={24} sm={24} md={24} lg={12} xl={6}>
          <AppFormItem
            label={"مبلغ " + (isReward ? "پاداش" : "جریمه")}
            name="cash"
            normalize={numberNormalize}
            rules={rules}
          >
            <AppNumInput onChange={handleChanges} />
          </AppFormItem>
        </Col>
      )}

      {type.includes(rewardTypes.NON_CASH_COUPON) && (
        <Col xs={24} sm={24} md={24} lg={12} xl={6}>
          <AppFormItem label="نوع بن غیر نقدی" name="coupon" rules={rules}>
            <Input onChange={handleChanges} />
          </AppFormItem>
        </Col>
      )}

      {type.includes(rewardTypes.INCENTIVE_LEAVE) && (
        <PeriodTime
          label="مدت مرخصی تشویقی"
          year="incentive_duration_year"
          month="incentive_duration_month"
          day="incentive_duration_day"
          onChange={handleChanges}
          required={true}
          useForm={useForm}
        />
      )}

      {type.includes(penaltyTypes.SUSPENSION) && (
        <PeriodTime
          label="مدت تعلیق"
          year="suspension_duration_year"
          month="suspension_duration_month"
          day="suspension_duration_day"
          onChange={handleChanges}
          required={true}
          useForm={useForm}
        />
      )}

      {type.includes(rewardTypes.JOB_PROMOTION) && (
        <JobCodeInput
          label="شغل جدید (ترفیع)"
          name="promotion_job"
          codeField="promotion_job_code"
          nameField="promotion_job_name"
          idField="promotion_job_id"
          useForm={useForm}
          onChange={handleChanges}
          fieldRules={rules}
        />
      )}

      {type.includes(penaltyTypes.JOB_DEGRADATION) && (
        <JobCodeInput
          label="شغل جدید (تنزیل)"
          name="degradation_job"
          codeField="degradation_job_code"
          nameField="degradation_job_name"
          idField="degradation_job_id"
          useForm={useForm}
          onChange={handleChanges}
          fieldRules={rules}
        />
      )}
    </AppFormItem>
  );
};

const JobCodeInput = (props) => {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(true);

  useEffect(() => {
    if (props.defaultValue) {
      props.useForm.setFieldsValue({ [props.codeField]: props.defaultValue });
      handleSearch();
    }
  }, [props.defaultValue]);

  const handleSearch = () => {
    setLoading(true);
    if (typeof props.searchHandler === "function") {
      props.searchHandler();
      return;
    }

    getJobInfo(
      props.useForm.getFieldValue(props.codeField),
      (info) => {
        props.useForm.setFieldsValue({ [props.idField]: info.id });
        props.useForm.setFieldsValue({ [props.nameField]: info.title });
        props.onChange({ id: info.id, name: info.name });

        setLoading(false);
        setEditMode(false);
      },
      () => null,
      (err) => {
        setLoading(false);
        setEditMode(true);
        notification.error({ message: err });
      }
    );
  };

  const handleOnChange = (e) => {
    if (e.target.value.length === 6) {
      handleSearch();
    }
  };
  const handleEdit = () => {
    setEditMode(true);
  };

  useEffect(() => {
    window.checkJobCode = handleSearch;
    return () => {
      if (window.checkJobCode) {
        delete window.checkJobCode;
      }
    };
  }, []);

  return (
    <>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <AppFormItem
          name={props.name}
          style={{ marginBottom: "0" }}
          label={props.label}
        >
          {editMode ? (
            <Row>
              <Col span={18}>
                <AppFormItem
                  name={props.codeField}
                  rules={[
                    {
                      required: true,
                      message: "فیلد شغل جدید اجباری است",
                    },
                  ]}
                  initialValue={props.jobCode && props.jobCode}
                  // label={props.label}
                  labelCol={{ span: 0 }}
                  // normalize={(value, prevValue) =>
                  //   countOfNumInp(value, prevValue, 6)
                  // }
                  disabled={props.disabled}
                >
                  {props.children || <Input onChange={handleOnChange} />}
                </AppFormItem>
              </Col>
              <Col span={6}>
                <AppButton
                  loading={loading}
                  block
                  size="large"
                  onClick={handleSearch}
                  hidden={props.disabled}
                >
                  بررسی
                </AppButton>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col span={18}>
                <AppFormItem
                  name={props.nameField}
                  initialValue={props.jobTitle && props.jobTitle}
                  disabled={props.disabled}
                >
                  <Input disabled />
                </AppFormItem>
              </Col>
              <Col span={6}>
                <AppButton
                  size="large"
                  block
                  onClick={props.editHandler || handleEdit}
                  hidden={props.disabled}
                >
                  تغییر
                </AppButton>
              </Col>
            </Row>
          )}
        </AppFormItem>
      </Col>
    </>
  );
};

const NationalIdInput = ({
  inputType = "person",
  groupInput = false,
  groupInputName,
  ...props
}) => {
  // type inputType = "person" | "company" | "both"
  const [loading, setLoading] = useState(false);
  const [inputLoading, setInputLoading] = useState(false);
  const [companiesList, setCompaniesList] = useState([]);
  const [action, setAction] = useState(props.type);
  const { form, onReset, onCheck = (data) => null } = props;
  const [searchModal, setSearchModal] = useState(false);
  const searchInput = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [newPersonModal, setNewPersonModal] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [excelList, setExcelList] = useState({
    existing: [],
    nonExisting: [],
  });
  const [excelTotal, setExcelTotal] = useState(0);
  const [showExcelReportModal, setShowExcelReportModal] = useState(false);

  useEffect(() => {
    setAction(props.type);
  }, [props.type]);

  useEffect(() => {
    if (props.rest) {
      setAction("send");
    }
  }, [props.rest]);

  useEffect(() => {
    // console.table(props);
    if (props.defaultValue) {
      form.setFieldsValue({
        [props.codeField]: props.defaultValue,
        [props.name]: props.defaultValue,
      });
      setSearchValue(props.defaultValue);
      checkCode();
    }
  }, [props.defaultValue]);

  useEffect(() => {
    if (searchInput && searchInput.current && !props.noFocus) {
      searchInput.current.focus();
    }
  }, [searchInput.current]);

  useEffect(() => {
    if (inputType === "company" || inputType === "both") {
      setInputLoading(true);
      getOfficesList()
        .then((res) => {
          setCompaniesList(res.list);
        })
        .finally(() => {
          setInputLoading(false);
        });
    }
  }, [inputType]);

  /////////////////////////////////////////////////

  const checkCode = () => {
    let code = form.getFieldValue(props.codeField);
    if (code) {
      setLoading(true);

      if (code.length === 10) {
        axios
          .get(`${props.url}/${code}`)
          .then((res) => {
            setLoading(false);
            const info = Array.isArray(res.data) ? res.data[0] : res.data;
            const fields = {};

            if (info.first_name)
              fields[props.nameField] = `${info.first_name} ${info.last_name}`;

            if (info.id) fields[props.codeField] = info.id;

            form.setFieldsValue(fields);
            props.setData(info);
            setAction("edit");

            onCheck({ ...info, national_id: code });
          })
          .catch((error) => {
            setLoading(false);

            onCheck(false);

            if (
              error?.response?.data === "کد ملی وارد شده در سامانه ثبت نشده است"
            ) {
              Modal.confirm({
                content:
                  "شخص مورد نظر پیدا نشد، آیا مایل به نام نویسی ایشان هستید؟",
                okText: "بله",
                cancelText: "انصراف",
                onOk: () => setNewPersonModal(true),
              });
            } else {
              setSearchValue("");
              form.setFieldsValue({
                [props.codeField]: ``,
              });
            }
          });
      } else {
        axios
          .get(`/api/v1/baje/personnel/${code}`)
          .then((res) => {
            setLoading(false);

            let resObj = {
              first_name: res.data.first_name,
              last_name: res.data.last_name,
              id: code,
            };

            const fields = {};

            if (resObj.first_name)
              fields[
                props.nameField
              ] = `${resObj.first_name} ${resObj.last_name}`;

            if (resObj.id) fields[props.codeField] = resObj.id;

            form.setFieldsValue(fields);
            props.setData(resObj);
            setAction("edit");
          })
          .catch((error) => {
            setLoading(false);
            message.error(error?.response?.data);
            form.setFieldsValue({
              [props.codeField]: ``,
            });
            setSearchValue("");
          });
      }
    }
  };

  const checkCompanyCode = () => {
    let code = form.getFieldValue(props.codeField);
    if (code) {
      if (code.length === 11) {
        const findCompany = companiesList.find((i) => code == i.national_id);

        if (findCompany) {
          const fields = {};
          if (findCompany.name)
            fields[props.nameField] = findCompany?.name || "شرکت";

          if (findCompany.id) fields[props.codeField] = findCompany.id;

          alert(JSON.stringify(fields));
          form.setFieldsValue(fields);
          props.setData(findCompany);
          setAction("edit");

          onCheck({ ...findCompany, national_id: code });
        } else {
          message.warn({
            content: "شرکت یافت نشد",
          });
        }
      }
    }
  };

  const edit = () => {
    setAction("send");
    form.setFieldsValue({
      [props.codeField]: null,
      [props.name]: null,
    });
    setSearchValue("");

    if (onReset) onReset();
  };

  function handlePaste() {
    navigator.clipboard
      .readText()
      .then((text) => {
        if (
          text &&
          (text?.length === 10 || text?.length === 11) &&
          !isNaN(text)
        ) {
          if (inputType === "person") {
            form.setFieldsValue({
              [props.codeField]: text,
              [props.name]: text,
            });
            setSearchValue(text);
            setTimeout(() => {
              checkCode();
            }, 100);
          } else if (inputType === "company") {
            form.setFieldsValue({
              [props.codeField]: text,
              [props.name]: text,
            });
            setSearchValue(text);
            setTimeout(() => {
              checkCompanyCode();
            }, 100);
          }
        } else {
          message.warn({ content: "متن جایگذاری شده معتبر نیست" });
        }
      })
      .catch((err) => {
        // Handle any errors
        console.error("Failed to read clipboard contents: ", err);
        message.warn({ content: "کلیپبورد خالی است" });
      });
  }

  function handleExcelChange(file) {
    // the library doesn't handle errors properly so a try/catch is necessary to avoid crash
    if (file?.fileList?.length) {
      console.log("file:", file);
      try {
        readXlsxFile(file.file)
          .then((rows) => {
            if (rows?.length > 1) {
              console.log("rows:", rows);
              // check excel headers, the correct format is 1 column of codes
              if (rows[0].length === 1) {
                setExcelTotal(rows.length - 1);
                const codes = rows.slice(1).map((i) => String(i[0]));
                setExcelLoading(true);

                axios
                  .post(endpoints.realPerson.verifyNationalIds, { codes })
                  .then((res) => {
                    if (res?.data?.length) {
                      const nonExistingCodes = codes.filter(
                        (i) => !res.data.map((j) => j.nationalCode).includes(i)
                      );
                      setExcelList({
                        existing: res.data,
                        nonExisting: nonExistingCodes,
                      });
                      props.setData(res.data);
                      if (nonExistingCodes.length) {
                        setShowExcelReportModal(true);
                      }
                    } else {
                      message.warn({
                        content: "هیچکدام از کد‌های موجود در فایل معتبر نیستند",
                      });
                    }
                  })
                  .finally(() => {
                    setExcelLoading(false);
                  });
              } else {
                message.warn({
                  content: "فرمت فایل انتخاب شده نادرست است",
                });
              }
            } else {
              message.warn({
                content: "فرمت فایل انتخاب شده نادرست است",
              });
            }
          })
          .catch((err) => {
            console.error("excel file error:", err);
            message.error({
              content: "فایل انتخاب شده نامعتبر است",
            });
          });
      } catch (err) {
        console.error("excel file error:", err);
        message.error({
          content: "فایل انتخاب شده نامعتبر است",
        });
      }
    } else {
      setExcelTotal(0);
      setExcelList({
        existing: [],
        nonExisting: [],
      });
    }
  }

  //////////////////////////////////////////////////

  const inputRules = [
    () => ({
      validator(rule, value) {
        if (value && action === "send") {
          return Promise.reject("ورودی بررسی نشده است");
        } else {
          return Promise.resolve();
        }
      },
    }),
    ...(props.fieldRules || []),
  ];

  if (inputType !== "both") {
    inputRules.unshift({
      len: inputType === "person" ? 10 : 11,
      message: "ورودی اشتباه است",
    });
  }

  let inputCode = (
    <Col span={18}>
      <AppFormItem
        // style={{ marginBottom: "0px" }}
        name={props.codeField}
        validateFirst={true}
        rules={inputRules}
        normalize={(value, prevValue) =>
          countOfNumInp(value, prevValue, inputType === "person" ? 10 : 11)
        }
      >
        <Input
          disabled={props.disabled}
          ref={searchInput}
          allowClear
          inputMode="numeric"
          prefix={
            inputType === "person" ? (
              <SearchOutlined
                className="pointer"
                title="جستجو"
                onClick={() => {
                  if (inputType === "person") {
                    setSearchModal(true);
                  }
                }}
              />
            ) : (
              ""
            )
          }
          onChange={(e) => {
            if (
              inputType === "person" &&
              e.target.value.toString().length === 10
            ) {
              checkCode();
            } else if (
              (inputType === "company" || inputType === "both") &&
              e.target.value.toString().length === 11
            ) {
              checkCompanyCode();
            }
            setSearchValue(e.target.value);
          }}
        />
      </AppFormItem>
    </Col>
  );

  let inputName = (
    <Col span={18}>
      <AppFormItem name={props.nameField} style={{ marginBottom: "0px" }}>
        <Input disabled />
      </AppFormItem>
    </Col>
  );

  let inputPersonId = (
    <AppFormItem name={props.codeField} hidden={true}>
      <Input disabled={props.disabled} />
    </AppFormItem>
  );

  let btnSend = (
    <Col span={6}>
      <AppButton
        size="large"
        loading={loading}
        block
        onClick={checkCode}
        disabled={props.disabled}
      >
        بررسی
      </AppButton>
    </Col>
  );

  let btnEdit = (
    <Col span={6}>
      <AppButton size="large" block onClick={edit} disabled={props.disabled}>
        تغییر
      </AppButton>
    </Col>
  );

  let btnSearch = (
    <Col span={6}>
      <AppButton
        size="large"
        block
        onClick={() => setSearchModal(true)}
        disabled={props.disabled}
      >
        جستجو
      </AppButton>
    </Col>
  );

  let btnPaste = navigator.clipboard ? (
    <Col span={6}>
      <AppButton
        size="large"
        block
        onClick={handlePaste}
        disabled={props.disabled}
      >
        جایگذاری
      </AppButton>
    </Col>
  ) : (
    ""
  );

  const formItem = (
    <Spin spinning={inputLoading}>
      <Form.Item
        name={props.name}
        style={{ marginBottom: "0px" }}
        label={props.label || null}
        rules={props.isRequired && [{ required: true }]}
      >
        <Row gutter={4}>
          {action === "send" ? inputCode : inputName}
          {inputPersonId}
          {!props.disabled &&
            (action === "send"
              ? searchValue.length
                ? btnSend
                : btnPaste
              : btnEdit)}
        </Row>
      </Form.Item>
    </Spin>
  );

  let excelInput;

  if (groupInput && groupInputName) {
    const normFile = (e) => {
      if (Array.isArray(e)) {
        return e;
      }

      if (e.fileList.length > 1) {
        e.fileList.shift();
      }

      return e && e.fileList;
    };

    excelInput = (
      <Spin spinning={excelLoading}>
        <Form.Item
          name={groupInputName}
          label="انتخاب از فایل اکسل"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            beforeUpload={(file) => {
              return false;
            }}
            accept=".XLSX,.XLS,.XLSM"
            onChange={handleExcelChange}
          >
            <ExcelBtn>انتخاب فایل</ExcelBtn>
          </Upload>
        </Form.Item>
        {excelTotal > 0 ? (
          <p style={{ transform: "translateY(-20px)" }}>
            {`${excelList.existing.length} مورد از ${excelTotal} مورد انتخاب شدند`}
          </p>
        ) : (
          ""
        )}
      </Spin>
    );
  }

  ////////////////////////////////////////////////

  return (
    <>
      {props.plain ? (
        formItem
      ) : (
        <Col
          xs={props.size?.xs ? props.size.xs : 24}
          sm={props.size?.sm ? props.size.sm : 24}
          md={props.size?.md ? props.size.md : 12}
          lg={props.size?.lg ? props.size.lg : 12}
          xl={props.size?.xl ? props.size.xl : 6}
        >
          {groupInput && excelInput ? excelInput : formItem}
        </Col>
      )}
      {searchModal ? (
        <Modal
          visible={searchModal}
          onCancel={() => setSearchModal(false)}
          footer={null}
          title="جستجو"
          width={720}
        >
          <GeneralInputSearchModal
            visible={searchModal}
            onCancel={() => setSearchModal(false)}
            onConfirm={(nid) => {
              form.setFieldsValue({
                [props.codeField]: nid,
                [props.name]: nid,
              });
              setSearchValue(nid);
              setTimeout(() => {
                checkCode();
              }, 100);
            }}
          />
        </Modal>
      ) : (
        ""
      )}
      {newPersonModal ? (
        <Modal
          visible={newPersonModal}
          onCancel={() => setNewPersonModal(false)}
          footer={null}
          title="فرد حقیقی جدید"
          width={960}
        >
          <NewPersonModal
            nationalNumber={searchValue}
            onFinish={(nid) => {
              setNewPersonModal(false);
              form.setFieldsValue({
                [props.codeField]: nid,
                [props.name]: nid,
              });
              setSearchValue(nid);
              setTimeout(() => {
                checkCode();
              }, 200);
            }}
          />
        </Modal>
      ) : (
        ""
      )}
      {showExcelReportModal ? (
        <Modal
          visible={showExcelReportModal}
          onCancel={() => setShowExcelReportModal(false)}
          onOk={() => setShowExcelReportModal(false)}
          title="گزارش فایل اکسل"
          width={960}
        >
          <p className="text-12">
            کد‌های ملی زیر به دلیل نبودن در دیتابیس انتخاب نشدند:
          </p>
          <List>
            {excelList.nonExisting.map((i) => (
              <List.Item>{i}</List.Item>
            ))}
          </List>
        </Modal>
      ) : (
        ""
      )}
    </>
  );
};

const getJobInfo = (
  jobCode,
  onFinishLoading = () => false,
  onStartLoading = () => false,
  onError = () => false
) => {
  onStartLoading();

  axios
    .get(`/api/jobtitle/${jobCode}`)
    .then((res) => {
      const result = {
        title: res.data.title,
        id: res.data.id,
        code: jobCode,
      };

      onFinishLoading(result);
    })
    .catch((error) => {
      onFinishLoading(false);
      onError(error?.response?.data);
    });
};

export {
  itemTypes,
  serviceDamageTypes,
  rewardTypes,
  penaltyTypes,
  Person,
  Type,
  ItemDate,
  Description,
  TypeServiceDamage,
  TypeRewardPenalty,
  AmountRewardPenalty,
  JobCodeInput,
  NationalIdInput,
};
