import React from "react";
import { Col, Form, Input, Upload, Button, Modal } from "antd";
import {
  pngValidation,
  imageValidation,
  birthCertificateValidation,
} from "_helpers";
import { UploadOutlined } from "@ant-design/icons";
import usePreviewImage from "hooks/usePreviewImage";
import { formColSpan } from "../../../../../constant";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  if (e.fileList.length > 1) {
    e.fileList.shift();
  }

  return e && e.fileList;
};

const BirthCertificate = () => {
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
      <Col {...formColSpan}>
        <Form.Item
          name="birth_certificate/uploadDocTab"
          label="اسکن شناسنامه"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[birthCertificateValidation]}
        >
          <Upload
            onPreview={onPreview}
            beforeUpload={(file) => {
              return false;
            }}
            accept=".jpg , .zip , .rar"
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

const NationalCardFront = () => {
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
      <Col {...formColSpan}>
        <Form.Item
          name="national_card_front/uploadDocTab"
          label="اسکن روی کارت ملی"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[imageValidation]}
        >
          <Upload
            onPreview={onPreview}
            beforeUpload={(file) => {
              return false;
            }}
            accept=".jpg"
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

const NationalCardRear = () => {
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
      <Col {...formColSpan}>
        <Form.Item
          name="national_card_rear/uploadDocTab"
          label="اسکن پشت کارت ملی"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[imageValidation]}
        >
          <Upload
            onPreview={onPreview}
            beforeUpload={(file) => {
              return false;
            }}
            accept=".jpg"
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

const ArmyServiceCard = () => {
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
      <Col {...formColSpan}>
        <Form.Item
          name="army_service_card/uploadDocTab"
          label="اسکن کارت پایان خدمت"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[imageValidation]}
        >
          <Upload
            onPreview={onPreview}
            beforeUpload={(file) => {
              return false;
            }}
            accept=".jpg"
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

const Person = () => {
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
      <Col {...formColSpan}>
        <Form.Item
          name="person_img/uploadDocTab"
          label="عکس پرسنلی"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[imageValidation]}
        >
          <Upload
            onPreview={onPreview}
            beforeUpload={(file) => {
              return false;
            }}
            accept=".jpg"
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

const EducationalDocument = () => {
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
      <Col {...formColSpan}>
        <Form.Item
          name="‌latest_educational_document/uploadDocTab"
          label="اخرین مدرک تحصیلی"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[pngValidation]}
        >
          <Upload
            onPreview={onPreview}
            beforeUpload={(file) => {
              return false;
            }}
            accept=".jpg"
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
      <Col {...formColSpan}>
        <Form.Item
          extra="حداکثر حجم فایل 80Kb برای فایل های png"
          name="sign/uploadDocTab"
          label="امضا"
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
  BirthCertificate,
  NationalCardFront,
  NationalCardRear,
  Sign,
  Person,
  ArmyServiceCard,
  EducationalDocument,
};
