import React from "react";
import {
  nationalIdValidation,
  financeCodeValidation,
} from "../../utils/formUtils";
import { Col, Form, Input, Upload, Button, Modal } from "antd";
import {
  countOfNumInp,
  numberNormalize,
  checkShamsi,
  pngValidation,
} from "_helpers";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { utils } from "react-modern-calendar-datepicker";
import { UploadOutlined } from "@ant-design/icons";
import FetchDataWithCode from "components/renderInput/fetchDataWithCode/FetchDataWithCode";
import usePreviewImage from "hooks/usePreviewImage";

const FinanceCode = () => {
  const rules = [
    { len: 12, message: "فرمت کد اقتصادی صحیح نیست" },
    financeCodeValidation,
  ];
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item
        label="کد اقتصادی یکتا"
        name={"finance_code/initialDataTab"}
        validateFirst
        normalize={(value, prevValue) => countOfNumInp(value, prevValue, 12)}
        rules={rules}
      >
        <Input />
      </Form.Item>
    </Col>
  );
};

const NationalId = ({ useForm }) => {
  const rules = [
    {
      required: true,
      message: "شناسه ملی یکتا را وارد نمایید",
    },
    {
      len: 11,
      message: "فرمت شناسه ملی اشتباه است",
    },
    nationalIdValidation,
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item
        label="شناسه ملی یکتا"
        name={"national_id/initialDataTab"}
        validateFirst
        normalize={(value, prevValue) => countOfNumInp(value, prevValue, 11)}
        rules={rules}
      >
        <Input />
      </Form.Item>
    </Col>
  );
};

const Name = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item
        // extra="نام شرکت را بدون پسوند شرکت وارد کنید"
        label="نام شرکت"
        name="name/initialDataTab"
        normalize={(value) => {
          let officeName = value.replace("شرکت", "");
          return officeName;
        }}
        rules={[{ required: true, message: "نام شرکت را وارد نمایید" }]}
      >
        <Input placeholder="نام شرکت را بدون پیشوند شرکت وارد کنید" />
      </Form.Item>
    </Col>
  );
};

const RegisterNumber = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item
        label="شماره ثبت"
        name="register_number/initialDataTab"
        normalize={numberNormalize}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
    </Col>
  );
};

const RegisterDate = ({ useForm }) => {
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
      label="تاریخ ثبت"
      name="register_date/initialDataTab"
      maximumDate={utils("fa").getToday()}
      rules={rules}
    />
  );
};

const Manager = ({ useForm, setManager, formType, manager }) => {
  return (
    <FetchDataWithCode
      type={manager ? "edit" : "send"}
      codeInputName="manager_national_id/initialDataTab"
      //codeInputRules={}
      textInputName="manager_name"
      name="manager_national_id"
      label="مدیر عامل"
      url="/api/admin/personnel/lookup"
      form={useForm}
      setData={setManager}
    />
  );
};

const SignOwners = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="صاحبان امضا" name="sign_owners/initialDataTab">
        <Input />
      </Form.Item>
    </Col>
  );
};

const Description = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="توضیحات" name="description/initialDataTab">
        <Input.TextArea />
      </Form.Item>
    </Col>
  );
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

const Logo = () => {
  const [
    imageUrl,
    onPreview,
    modalVisible,
    setModalVisible,
    cancelModal,
  ] = usePreviewImage();

  return (
    <>
      <Modal
        title="نمایش تصویر"
        visible={modalVisible}
        onCancel={cancelModal}
        footer={null}
      >
        <img src={imageUrl} style={{ width: "100%" }} />
      </Modal>

      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          extra="حداکثر حجم فایل 80Kb برای فایل های png"
          name="logo/initialDataTab"
          label="لوگو"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[pngValidation]}
        >
          <Upload
            onPreview={onPreview}
            beforeUpload={(file) => {
              return false;
            }}
            accept=".jpg,.png"
          >
            <Button>
              <UploadOutlined /> انتخاب فایل
            </Button>
          </Upload>
        </Form.Item>
      </Col>
    </>
  );
};

const Sign = () => {
  const [
    imageUrl,
    onPreview,
    modalVisible,
    setModalVisible,
    cancelModal,
  ] = usePreviewImage();
  return (
    <>
      <Modal
        title="نمایش تصویر"
        visible={modalVisible}
        onCancel={cancelModal}
        footer={null}
      >
        <img src={imageUrl} style={{ width: "100%" }} />
      </Modal>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          extra="حداکثر حجم فایل 80Kb برای فایل های png"
          name="sign/initialDataTab"
          label="اسکن امضا"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[pngValidation]}
        >
          <Upload
            onPreview={onPreview}
            beforeUpload={(file) => {
              return false;
            }}
            accept=".jpg,.png"
          >
            <Button>
              <UploadOutlined /> انتخاب فایل
            </Button>
          </Upload>
        </Form.Item>
      </Col>
    </>
  );
};

const Seal = () => {
  const [
    imageUrl,
    onPreview,
    modalVisible,
    setModalVisible,
    cancelModal,
  ] = usePreviewImage();
  return (
    <>
      <Modal
        title="نمایش تصویر"
        visible={modalVisible}
        onCancel={cancelModal}
        footer={null}
      >
        <img src={imageUrl} style={{ width: "100%" }} />
      </Modal>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          extra="حداکثر حجم فایل 80Kb برای فایل های png"
          name="seal/initialDataTab"
          label="اسکن مهر شرکت"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[pngValidation]}
        >
          <Upload
            onPreview={onPreview}
            beforeUpload={(file) => {
              return false;
            }}
            accept=".jpg,.png"
          >
            <Button>
              <UploadOutlined /> انتخاب فایل
            </Button>
          </Upload>
        </Form.Item>
      </Col>
    </>
  );
};

export {
  NationalId,
  FinanceCode,
  Name,
  RegisterNumber,
  RegisterDate,
  SignOwners,
  Description,
  Logo,
  Sign,
  Seal,
  Manager,
};
