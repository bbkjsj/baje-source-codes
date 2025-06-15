import React, { useState, useEffect } from "react";
import { Tabs, Row, Col, Upload, message } from "antd";
import { Form, Input, Button, Modal, Checkbox } from "antd";
import Styles from "../addRightFull.module.css";
import { UploadOutlined } from "@ant-design/icons";
import { utils } from "react-modern-calendar-datepicker";
import axios from "api/appAxios";
import {
  getCompony,
  finance_code_validation,
  national_ID_validation,
} from "../common/_helpers";
import {
  loadImage,
  getBase64Local,
  convertDateToEN,
  checkShamsi,
  numberNormalize,
  postal_code_normalize,
  national_id_normalize,
  nation_idNormalize,
  imageValidation,
  pngValidation,
  finance_code_normalize,
  mobile_numberNormalize,
} from "../../../../_helpers";
import { withRouter } from "react-router-dom";
import LogoLoading from "../../../../components/general/LoadingLogo";
import SubmitBtn from "../../../../components/general/SubmitBtn";
import CustomDatePicker from "../../../../components/renderInput/customDatePicker/CustomDatePicker";
import styled from "styled-components";
import InputMask from "react-input-mask";
import GoBackBtn from "./../../../../components/GoBackBtn";
import ContentTop from "components/general/ContentTop";
import AppFormItem from "components/general/AppFormItem";
import AppButton from "components/general/AppButton";
import AppInput from "components/general/AppInput";
import { config, pageNames } from "constant";
import AppSelect from "components/general/AppSelect";
import { convertDateToISO8601 } from "../../../../_helpers";

const StyledMaskInput = styled(InputMask)`
  padding: 4px 11px;
  width: 100%;
  border: 1px solid gray;
`;
const { TabPane } = Tabs;

const EditRightFull = React.memo((props) => {
  const [activeKey, setActiveKey] = useState("1");
  const [loadingCheckNationalId, setLoadingNationalID] = useState(false);
  const [managerData, setManagerData] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);

  const company_id = props.match.params.id;
  const [firstForm] = Form.useForm();

  const setManager = (data) => {
    setManagerData(data);

    firstForm.setFieldsValue({
      manager_name: `${data.first_name} ${data.last_name}`,
      phone: `${data.mobile}`,
      manager_national_id: data.national_number,
    });
  };

  useEffect(() => {
    getCompony(company_id).then((data) => {
      setCompanyData(data);
      // if (data.manager) {
      //   setManager(data.manager);
      // }
    });
  }, []);

  const onPreview = (file) => {
    setModalVisible(true);
    setImage(null);
    if (file.hasOwnProperty("status") && file.status === "done") {
      loadImage(file.url).then((base64) => {
        setImage(base64);
      });
    } else {
      getBase64Local(file.originFileObj).then((base64) => {
        setImage(base64);
      });
    }
  };

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
            //message.error(error?.response?.data);
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
        setActiveKey("1");
        message.error("مشکلی پیش آمده است دوباره تلاش کنید");
        return;
      }
    }
    const formData = new FormData();

    formData.append("id", company_id);
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
      //formData.append("seal_old", companyData.seal_url);
    }

    if (values.sign && values.sign.length > 0) {
      formData.append("sign", values.sign[0]["originFileObj"]);
      //formData.append("sign_old", companyData.sign_url);
    }

    if (values.logo && values.logo.length > 0) {
      formData.append("logo", values.logo[0]["originFileObj"]);
      //formData.append("logo_old", companyData.logo_url);
    } else {
      formData.append("logo", null);
      formData.append("removeLogo", true);
    }

    // if (managerDataLocal) formData.append("manager_id", managerDataLocal.id);
    // else formData.append("manager_id", "-1");
    console.info(values);
    axios({
      method: "put",
      url: "/api/v1/baje/company/" + company_id,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        message.success("با موفقیت انجام شد");
        setSubmitLoading(false);
        props.history.push(pageNames.personnel.rightFull.list);
      })
      .catch((error) => {
        if (error.response) {
          message.error(error?.response?.data);
          setSubmitLoading(false);
        }
      });
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 10 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 14 },
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

  if (!companyData) {
    return <LogoLoading />;
  }

  const typeOptions = [
    { label: "عمومی", value: "public" },
    { label: "شرکت (تجاری)", value: "company" },
    { label: "موسسه (غیر تجاری)", value: "organization" },
  ];

  return (
    <>
      <Modal
        visible={modalVisible}
        title="اسکن"
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        {image && <img alt="scan" style={{ width: "100%" }} src={image} />}
      </Modal>

      <GoBackBtn />
      <ContentTop
        title="فرد حقوقی"
        breadcrumbItems={[
          { text: "حقوقی", link: pageNames.personnel.rightFull.list },
          { text: "ویرایش" },
        ]}
      />

      <div>
        <Form
          onFinishFailed={onFinishFailedFirstForm}
          initialValues={{
            logo: companyData.logoUrl && [
              {
                uid: "logoUrl",
                name: "لوگو",
                status: "done",
                url: `${config.url.API_URL}/api/v1/baje/${companyData.logo_url}`,
              },
            ],
            seal: companyData.seal_url && [
              {
                uid: "sealUrl",
                name: "مهر شرکت",
                status: "done",
                url: companyData.seal_url,
              },
            ],
            sign: companyData.sign_url && [
              {
                uid: "sign_url",
                name: "امضا ",
                status: "done",
                url: companyData.sign_url,
              },
            ],
            ...companyData,
          }}
          {...formItemLayout}
          onFinish={onFinishFirstForm}
          name="Rightful"
          form={firstForm}
        >
          <Tabs
            type="card"
            activeKey={activeKey}
            onTabClick={(key) => setActiveKey(key)}
          >
            <TabPane tab="اطلاعات اولیه" key="1" className={Styles.tab}>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                  <AppFormItem
                    label="نوع"
                    name="type"
                    labelCol={{ span: 24 }}
                    colon={false}
                  >
                    <AppSelect options={typeOptions} />
                  </AppFormItem>
                </Col>

                <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                  <AppFormItem
                    label="شناسه ملی یکتا"
                    name="nationalId"
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
                      () => national_ID_validation("edit"),
                    ]}
                  >
                    <Input />
                  </AppFormItem>
                </Col>

                <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                  <AppFormItem
                    label="کد اقتصادی یکتا"
                    name="financeCode"
                    normalize={finance_code_normalize}
                    rules={[
                      { len: 12, message: "فرمت کد اقتصادی صحیح نیست" },
                      () => finance_code_validation("edit"),
                    ]}
                  >
                    <Input />
                  </AppFormItem>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                  <AppFormItem
                    label="نام شرکت"
                    name="name"
                    normalize={(value) => {
                      let officeName = value.replace("شرکت", "");
                      return officeName;
                    }}
                    rules={[
                      { required: true, message: "نام شرکت را وارد نمایید" },
                    ]}
                  >
                    <Input placeholder="نام شرکت را بدون پیشوند شرکت وارد کنید" />
                  </AppFormItem>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                  <AppFormItem
                    label="شماره ثبت"
                    name="registerNumber"
                    normalize={numberNormalize}
                  >
                    <Input />
                  </AppFormItem>
                </Col>

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
                    name="logo"
                    extra="حداکثر حجم فایل 80Kb برای فایل های png"
                    label="لوگو"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[imageValidation]}
                  >
                    <Upload
                      onPreview={(file) => onPreview(file)}
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
                      onPreview={(file) => onPreview(file)}
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
                      onPreview={(file) => onPreview(file)}
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
                    <AppInput type="number" />
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
                    rules={[{ len: 10, message: "فرمت اشتباه است" }]}
                  >
                    <Input />
                  </AppFormItem>
                </Col>

                <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                  <AppFormItem
                    label="آدرس ایمیل"
                    name="email"
                    rules={[
                      { type: "email", message: "فرمت ایمیل نادرست است" },
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

export default withRouter(EditRightFull);
