import React, { useState } from "react";
import { Modal, Form, message, Upload, Button, Col, Tabs } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { dbfValidation } from "_helpers";

//import { _PUT_INSURANCE_NUMBER } from "../utils/api";

const { TabPane } = Tabs;

function InsuranceDBF(props) {
  const [dbfListForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onCancel = () => {
    dbfListForm.resetFields();
    props.setVisible(false);
  };

  const onOk = () => {
    dbfListForm.submit();
  };

  const onFinish = (values) => {
    setLoading(true);

    message.warning("در حال حاضر این بخش در دسترس نیست!");

    // _PUT_INSURANCE_NUMBER({ id: props.id, payload: values })
    //   .then((res) => {
    //     message.success("ثبت با موفقیت انجام شد");
    //     setLoading(false);
    //     props.setVisible(false);
    //     addNumberForm.resetFields();
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     message.error("خطایی رخ داده است. دوباره تلاش کنید");
    //     setLoading(false);
    //   });

    setLoading(false);
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

  return (
    <>
      <Modal
        title="توجه"
        okText="ثبت"
        cancelText="انصراف"
        visible={props.visible}
        onOk={onOk}
        onCancel={onCancel}
        confirmLoading={loading}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="فایل DBF" key="1">
            {props.listId}
            <p>لطفا فایل لیست بیمه را در قالب DBF تهیه و آپلود فرمایید:</p>
            <Form form={dbfListForm} onFinish={onFinish}>
              <Col xs={24} sm={24} md={24} lg={6} xl={12}>
                <Form.Item
                  extra="8Mb برای فایل های dbf"
                  name="dbfList"
                  label="فایل DBF"
                  getValueFromEvent={normFile}
                  rules={[
                    {
                      required: true,
                      message: "فایلی انتخاب نشده است",
                    },
                    () => ({
                      validator(rule, value) {
                        let file = value[0]["name"].split(".");
                        let fileExtension = file[file.length - 1];
                        let allowedExtensions = ["dbf"];
                        if (allowedExtensions.includes(fileExtension)) {
                          if (fileExtension === "dbf") {
                            if (value.size > 8000000) {
                              return Promise.reject(
                                "حجم فایل بیشتر از 8 مگابایت است !"
                              );
                            }
                          }
                          return Promise.resolve();
                        } else {
                          return Promise.reject("فرمت فایل صحیح نمی باشد");
                        }
                      },
                    }),
                  ]}
                >
                  <Upload
                    beforeUpload={(file) => {
                      return false;
                    }}
                    accept=".dbf"
                  >
                    <Button>
                      <UploadOutlined /> انتخاب فایل
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Form>
          </TabPane>
          <TabPane tab="فایل EXCEL" key="2">
            Content of Tab Pane 2
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
}

export default InsuranceDBF;
