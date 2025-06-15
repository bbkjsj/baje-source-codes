import React from "react";
import { Select, Col, Form, Input, Upload, Button } from "antd";
import { formColSpan } from "constant";
import { imageValidation } from "_helpers";
import { UploadOutlined } from "@ant-design/icons";
import AppFormItem from "components/general/AppFormItem";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  if (e.fileList.length > 1) {
    e.fileList.shift();
  }

  return e && e.fileList;
};

const Title = ({ md, sm, xs }) => {
  const Rules = [{ required: true }];

  return (
    <Col {...formColSpan}>
      <AppFormItem name="title" label="عنوان فارسی" rules={Rules}>
        <Input type="text" />
      </AppFormItem>
    </Col>
  );
};

const LatinTitle = ({ md, sm, xs }) => {
  const Rules = [];
  return (
    <Col {...formColSpan}>
      <AppFormItem name="enTitle" label=" عنوان لاتین" rules={Rules}>
        <Input type="text" />
      </AppFormItem>
    </Col>
  );
};

const Logo = ({ defaultFileList }) => {
  return (
    <Col {...formColSpan}>
      <AppFormItem
        name="file"
        valuePropName="fileList"
        label="لوگو"
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

const Type = ({ options, md, sm, xs }) => {
  const Rules = [{ required: true }];
  return (
    <Col
      md={md || formColSpan.md}
      sm={sm || formColSpan.sm}
      xs={xs || formColSpan.xs}
    >
      <AppFormItem name="typeId" label="نوع" rules={Rules}>
        <Select options={options} />
      </AppFormItem>
    </Col>
  );
};

export { Title, LatinTitle, Logo, Type };
