import React from "react";
import { Upload, Button } from "antd";
import FormItem from "../formItem/FormItem";
import { UploadOutlined } from "@ant-design/icons";

const UploadInput = (props) => {
  const formItemProps = { ...props };
  return (
    <>
      <FormItem {...formItemProps}>
        <Upload
          onChange={props.onChange && props.onChange}
          onPreview={props.onPreview && props.onPreview}
          listType={props.listType && props.listType}
          beforeUpload={props.inputProps.beforeUpload}
          accept={props.inputProps.accept}
          multiple={false}
          showUploadList={{
            showDownloadIcon: false,
          }}
        >
          <Button>
            <UploadOutlined /> {props.inputProps.btnText}
          </Button>
        </Upload>
      </FormItem>
    </>
  );
};

export default UploadInput;
