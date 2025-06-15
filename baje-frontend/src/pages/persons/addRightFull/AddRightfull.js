import React, { useState } from "react";
import { Tabs, Row, Col, Upload, message, Spin, Checkbox } from "antd";
import { Form, Input, Button } from "antd";
import Styles from "./addRightFull.module.css";
import { UploadOutlined } from "@ant-design/icons";
import axios from "api/appAxios";
import InputMask from "react-input-mask";
import SubmitBtn from "../../../components/general/SubmitBtn";
import CustomDatePicker from "../../../components/renderInput/customDatePicker/CustomDatePicker";
import styled from "styled-components";
import { utils } from "react-modern-calendar-datepicker";
import { useHistory } from "react-router-dom";
import ContentTop from "components/general/ContentTop";
import AppFormItem from "components/general/AppFormItem";
import AppButton from "components/general/AppButton";
import { withRouter } from "react-router-dom";
import {
  checkShamsi,
  convertDateToEN,
  numberNormalize,
  postal_code_normalize,
  national_id_normalize,
  nation_idNormalize,
  finance_code_normalize,
  imageValidation,
  pngValidation,
  mobile_numberNormalize,
  convertDateToISO8601,
} from "../../../_helpers";
import {
  finance_code_validation,
  national_ID_validation,
} from "./common/_helpers";
import GoBackBtn from "./../../../components/GoBackBtn";
import AppInput from "components/general/AppInput";
import { pageNames } from "constant";
import AppSelect from "components/general/AppSelect";

const StyledMaskInput = styled(InputMask)`
  padding: 4px 11px;
  width: 100%;
  border: 1px solid gray;
`;

const { TabPane } = Tabs;

const AddRightFull = React.memo((props) => {
  const [activeKey, setActiveKey] = useState("1");
  const [loadingCheckNationalId, setLoadingNationalID] = useState(false);
  const [managerData, setManagerData] = useState(null);
  const [LoadingWholePage, setLoadingWholePage] = useState(false);
  const [
    serverInputsErrorFinanceCode,
    setServerInputsErrorFinanceCode,
  ] = useState([]);

  const [firstForm] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const history = useHistory();

  const handleCheckNationalId = () => {
    return new Promise((resolve, reject) => {
      let error = firstForm.getFieldError("manager_national_id");
      let national_id = firstForm.getFieldValue("manager_national_id");
      if (error.length == 0 && national_id) {
        setLoadingNationalID(true);
        axios
          .get(`/api/admin/personnel/lookup/${national_id}`)
          .then((res) => {
            setLoadingNationalID(false);
            setManagerData(res.data);

            firstForm.setFieldsValue({
              manager_name: `${res.data.first_name} ${res.data.last_name}`,
              phone: `${res.data.mobile}`,
            });
            resolve(res.data);
          })
          .catch((error) => {
            setLoadingNationalID(false);
            // message.error(error?.response?.data);
            // form.setFieldsValue({
            //   manager_national_id: ``,
            // });
            firstForm.setFields([
              {
                name: "manager_national_id",
                errors: [error?.response?.data],
              },
            ]);
            firstForm.scrollToField("manager_national_id");
            reject(error?.response?.data);
          });
      } else if (!national_id) {
        resolve(null);
      }
    });
  };

  const submitToServer = () => {
    setSubmitLoading(true);
    firstForm.submit();
  };

  const onFinishFirstForm = (values) => {
    sendToServer(values);
  };

  const onFinishFailedFirstForm = (vals) => {
    let secondTab = false;
    setSubmitLoading(false);
    message.error("خطا: لطفا همه ی ورودی های خود را چک کنید و مجددا تلاش کنید");

    if (vals && vals.errorFields) {
      for (let err of vals.errorFields) {
        if (
          err.name.includes("phone") ||
          err.name.includes("postalCode") ||
          err.name.includes("email")
        ) {
          secondTab = true;
        }
      }
    }
    if (secondTab) {
      setActiveKey("2");
    } else {
      setActiveKey("1");
    }
  };

  const sendToServer = async (values) => {
    setSubmitLoading(true);

    // check manager data
    let managerDataLocal = managerData ? managerData : null;
    if (!managerDataLocal) {
      try {
        managerDataLocal = await handleCheckNationalId();
      } catch (err) {
        setSubmitLoading(false);
        message.error("مشکلی پیش آمده است دوباره تلاش کنید");
        setActiveKey("1");
        return;
      }
    }

    const formData = new FormData();

    for (const property in values) {
      if (values[property]) {
        if (
          property !== "seal" &&
          property !== "sign" &&
          property !== "logo" &&
          property !== "registerDate"
        ) {
          formData.append(property, values[property]);
        }
      }
    }
    if (values.registerDate) {
      formData.append(
        "registerDate",
        convertDateToISO8601(values.registerDate)
      );
    }

    if (values.seal && values.seal.length > 0) {
      formData.append("seal", values.seal[0]["originFileObj"]);
    }

    if (values.sign && values.sign.length > 0) {
      formData.append("sign", values.sign[0]["originFileObj"]);
    }

    if (values.logo && values.logo.length > 0) {
      formData.append("logo", values.logo[0]["originFileObj"]);
    }

    if (values.hasOwnProperty("type")) {
      formData.append("type", values.type || "company");
    }

    // if (managerDataLocal) formData.append("manager_id", managerDataLocal.id);
    // else formData.append("manager_id", "-1");

    console.log("values", formData);

    axios
      .post("/api/v1/baje/company", formData)
      .then((res) => {
        message.success("با موفقیت انجام شد");
        setSubmitLoading(false);
        props.history.push(pageNames.personnel.rightFull.list);
        // setTimeout(() => {
        //   history.go();
        // }, 1000);
      })
      .catch((error) => {
        if (error.response) {
          message.error(error?.response?.data);
          setSubmitLoading(false);
        }
      });
  };
  const formItemLayout = {
    labelCol: { span: 24 },
    colon: false,
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      lg: { span: 22 },
    },
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }

    if (e.fileList.length > 1) {
      e.fileList.shift();
    }

    return e && e.fileList;
  };

  const typeOptions = [
    { label: "عمومی", value: "public" },
    { label: "شرکت (تجاری)", value: "company" },
    { label: "موسسه (غیر تجاری)", value: "organization" },
  ];

  return (
    <>
      <GoBackBtn />

      <ContentTop
        title="فرد حقوقی جدید"
        breadcrumbItems={[
          { text: "حقوقی", link: pageNames.personnel.rightFull.list },
          { text: "جدید" },
        ]}
      />

      <div>
        <Form
          {...formItemLayout}
          name="Rightful"
          form={firstForm}
          onFinish={onFinishFirstForm}
          onFinishFailed={onFinishFailedFirstForm}
        >
          <Tabs
            type="card"
            activeKey={activeKey}
            onTabClick={(key) => setActiveKey(key)}
          >
            <TabPane tab="اطلاعات اولیه" key="1" className={Styles.tab}>
              <Spin spinning={LoadingWholePage}>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                    <AppFormItem
                      label="نوع"
                      name="type"
                      labelCol={{ span: 24 }}
                      colon={false}
                      defaultValue="company"
                    >
                      <AppSelect options={typeOptions} defaultValue="company" />
                    </AppFormItem>
                  </Col>

                  <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                    <AppFormItem
                      label="شناسه ملی یکتا"
                      name="nationalId"
                      validateFirst
                      normalize={national_id_normalize}
                      rules={[
                        {
                          required: true,
                          message: "شناسه ملی یکتا را وارد نمایید",
                        },
                        {
                          len: 11,
                          message: "فرمت شناسه ملی اشتباه است",
                        },
                        () => national_ID_validation("add"),
                      ]}
                    >
                      <Input />
                    </AppFormItem>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                    <AppFormItem
                      label="کد اقتصادی یکتا"
                      name="financeCode"
                      validateFirst
                      normalize={finance_code_normalize}
                      rules={[
                        { len: 12, message: "فرمت کد اقتصادی صحیح نیست" },
                        () => finance_code_validation("add"),
                      ]}
                    >
                      <Input />
                    </AppFormItem>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                    <AppFormItem
                      // extra="نام شرکت را بدون پسوند شرکت وارد کنید"
                      label="نام"
                      name="name"
                      // normalize={(value) => {
                      //   let officeName = value.replace("شرکت", "");
                      //   return officeName;
                      // }}
                      rules={[
                        { required: true, message: "نام را وارد نمایید" },
                      ]}
                    >
                      <Input />
                    </AppFormItem>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                    <AppFormItem
                      label="شماره ثبت"
                      name="registerNumber"
                      normalize={numberNormalize}
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </AppFormItem>
                  </Col>
                  {/* <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                  <AppFormItem
                    label="تاریخ ثبت"
                    name="register_date"
                    rules={[
                      { required: true, message: "تاریخ ثبت را وارد نمایید" },
                    ]}
                  >
                    <DatePicker locale="fa" />
                  </AppFormItem>
                </Col> */}

                  <CustomDatePicker
                    form={firstForm}
                    label="تاریخ ثبت"
                    name="registerDate"
                    maximumDate={utils("fa").getToday()}
                    rules={[
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
                    ]}
                  />

                  {/* <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                    <AppFormItem
                      label="کد ملی مدیر عامل"
                      name="manager"
                      style={{ marginBottom: "0" }}
                    > */}
                  {/* //after check national id covert to text filed  */}
                  {/* {managerData ? (
                        <Row>
                          <Col span={18}>
                            <AppFormItem name="manager_name">
                              <Input disabled />
                            </AppFormItem>
                          </Col>
                          <Col span={6}>
                            <AppButton
                              size="large"
                              block
                              onClick={() => {
                                setManagerData(null);
                                firstForm.setFieldsValue({
                                  manager_national_id: "",
                                });
                              }}
                            >
                              تغییر
                            </AppButton>
                          </Col>
                        </Row>
                      ) : (
                        <Row>
                          <Col span={18}>
                            <AppFormItem
                              name="manager_national_id"
                              normalize={nation_idNormalize}
                              rules={[{ len: 10, message: "کد ملی صحیح نیست" }]}
                            >
                              <Input
                                onChange={(e) => {
                                  if (e.target.value.length === 10) {
                                    handleCheckNationalId();
                                  }
                                }}
                              /> */}

                  {/* //after check national id covert to text filed  */}
                  {/* </AppFormItem>
                          </Col>
                          <Col span={6}>
                            <AppButton
                              size="large"
                              disabled={managerData ? true : false}
                              loading={loadingCheckNationalId}
                              block
                              onClick={handleCheckNationalId}
                            >
                              بررسی
                            </AppButton>
                          </Col>
                        </Row>
                      )}
                    </AppFormItem>
                  </Col> */}

                  {/* <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                    <AppFormItem label="صاحبان امضا" name="sign_owners">
                      <Input />
                    </AppFormItem>
                  </Col> */}
                  <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                    <AppFormItem label="توضیحات" name="description">
                      <Input.TextArea />
                    </AppFormItem>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                    <AppFormItem
                      extra="حداکثر حجم فایل 80Kb برای فایل های png"
                      name="logo"
                      label="لوگو"
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                      rules={[pngValidation]}
                    >
                      <Upload
                        beforeUpload={(file) => {
                          return false;
                        }}
                        accept=".jpg,.png"
                      >
                        <Button>
                          <UploadOutlined /> انتخاب فایل
                        </Button>
                      </Upload>
                    </AppFormItem>
                  </Col>
                  {/* <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                    <AppFormItem
                      extra="حداکثر حجم فایل 80Kb برای فایل های png"
                      name="sign"
                      label="اسکن امضا"
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                      rules={[pngValidation]}
                    >
                      <Upload
                        beforeUpload={(file) => {
                          return false;
                        }}
                        accept=".jpg,.png"
                      >
                        <Button>
                          <UploadOutlined /> انتخاب فایل
                        </Button>
                      </Upload>
                    </AppFormItem>
                  </Col> */}
                  <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                    <AppFormItem
                      extra="حداکثر حجم فایل 80Kb برای فایل های png"
                      name="seal"
                      label="اسکن مهر شرکت"
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                      rules={[pngValidation]}
                    >
                      <Upload
                        beforeUpload={(file) => {
                          return false;
                        }}
                        accept=".jpg,.png"
                      >
                        <Button>
                          <UploadOutlined /> انتخاب فایل
                        </Button>
                      </Upload>
                    </AppFormItem>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                    <AppFormItem name="isGroup" valuePropName="checked">
                      <Checkbox>عضو شرکت گروه</Checkbox>
                    </AppFormItem>
                  </Col>
                </Row>
              </Spin>
            </TabPane>

            {/* ///second tab            */}

            <TabPane tab="اطلاعات تماس" key="2" className={Styles.tab}>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                  <AppFormItem
                    label="شماره تماس"
                    name="phone"
                    normalize={national_id_normalize}
                    rules={[
                      {
                        len: 11,
                        message: "شماره تماس باید 11 رقم باشد",
                      },
                      {
                        pattern: /^0/,
                        message:
                          "شماره تماس باید با 0 شروع شود (کد شهر را وارد کنید)",
                      },
                    ]}
                  >
                    <Input type="number" />
                  </AppFormItem>
                </Col>

                {/* <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                  <Form.Item
                    name="mobile"
                    label="شماره موبایل"
                    rules={[
                      {
                        pattern: /(\+98|0)?9\d{9}/,

                        message: "شماره موبایل وارد شده معتبر نیست",
                      },
                    ]}
                    labelCol={{ span: 24 }}
                    colon={false}
                  >
                    <AppInput type="number" />
                  </Form.Item>
                </Col> */}

                <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                  <AppFormItem
                    label="کد پستی"
                    name="postalCode"
                    normalize={postal_code_normalize}
                    rules={[{ len: 10 }]}
                  >
                    <Input />
                  </AppFormItem>
                </Col>

                <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                  <AppFormItem
                    label="آدرس ایمیل"
                    name="email"
                    rules={[
                      {
                        type: "email",
                        message: "فرمت ایمیل نادرست است",
                      },
                    ]}
                  >
                    <Input />
                  </AppFormItem>
                </Col>

                <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                  <AppFormItem label="آدرس " name="address">
                    <Input.TextArea />
                  </AppFormItem>
                </Col>

                {/* <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                  <AppFormItem label="توضیحات" name="contact_description">
                    <Input.TextArea />
                  </AppFormItem>
                </Col> */}
              </Row>
            </TabPane>
          </Tabs>
          <SubmitBtn customFunction={submitToServer} loading={submitLoading} />
        </Form>
      </div>
    </>
  );
});

export default withRouter(AddRightFull);
