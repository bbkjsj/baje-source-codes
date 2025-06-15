import { Button, Form, Input, message, Modal, Space, Spin } from "antd";
import AppButton from "components/general/AppButton";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import {
  getJobInsuranceCodes,
  getInsuranceJobCode,
  handleExceptions,
  handleSuccess,
  submitJobInsuranceCodes,
} from "./common/api";
import { countOfNumInp } from "_helpers";

const JobCodesModal = ({ onCancel, jobId, visible }) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobNames, setJobNames] = useState({});
  const [form] = Form.useForm();

  // get job codes whenever job id changes
  useEffect(() => {
    setLoading(true);
    form.resetFields();
    getJobInsuranceCodes(jobId)
      .then((res) => {
        if (res?.data) {
          const codes = res?.data?.map((i) => i.code);
          if (codes.length) {
            // get code names
            const queue = codes.map((code) => getInsuranceJobCode(code));
            Promise.all(queue)
              .then((res) => {
                setLoading(false);
                if (res) {
                  let codeNames = {};

                  for (let i of res) {
                    const codeName = i.config.url.split("/")[2];
                    if (i?.data?.title && codeName) {
                      codeNames[codeName] = i.data.title;
                    }
                  }

                  setJobNames(codeNames);
                }
              })
              .catch((err) => {
                setLoading(false);
                console.error(err);
                handleExceptions(err);
              });

            form.setFieldsValue({ codes });
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        handleExceptions(err);
      });
  }, [jobId]);

  // submit codes
  const submitCodes = (vals) => {
    if (!vals.codes.length) {
      Modal.warning({
        content: "لطفا کد شغل ها را اضافه نمایید",
        okText: "تایید",
        closable: true,
      });
    } else {
      let allValid = true;
      for (let i of vals.codes) {
        if (!jobNames[i]) {
          allValid = false;
          break;
        }
      }
      if (allValid) {
        setBtnLoading(true);
        const body = {
          jobId: jobId,
          codes: vals.codes,
        };
        submitJobInsuranceCodes(body)
          .then((res) => {
            setBtnLoading(false);
            handleSuccess(res);
            onCancel();
          })
          .catch((err) => {
            setBtnLoading(false);
            handleExceptions(err);
          });
      } else {
        Modal.warning({
          content: "لطفا کد شغل های معتبر وارد نمایید",
          okText: "تایید",
          closable: true,
        });
      }
    }
  };

  return (
    <StyledModal className="codes-modal">
      <Spin spinning={loading}>
        <p className="mb-4">
          لطفا کد شغل های قابل قبول تامین اجتماعی برای این شغل را وارد نمایید
        </p>

        <Form
          name="dynamic_form_nest_item"
          form={form}
          onFinish={submitCodes}
          autoComplete="off"
          labelCol={{
            xs: { span: 24 },
            sm: { span: 24 },
          }}
        >
          <Form.List name="codes">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }, idx) => (
                  <div>
                    <Space
                      style={{ display: "flex", marginBottom: 0 }}
                      key={key}
                      align="center"
                    >
                      <Form.Item
                        {...restField}
                        name={[name]}
                        fieldKey={[fieldKey]}
                        label="کد شغل (6 رقمی)"
                        rules={[
                          {
                            required: true,
                            message: "لطفا کد شغل را وارد کنید",
                          },
                          { len: 6, message: "کد شغل باید 6 رقم باشد" },
                        ]}
                        normalize={(value, prevValue) =>
                          countOfNumInp(value, prevValue, 6)
                        }
                      >
                        <Input
                          type="number"
                          placeholder="کد شغل"
                          onChange={(e) => {
                            const val = e.target.value;

                            if (val.length === 6) {
                              getInsuranceJobCode(val).then((res) => {
                                if (res?.data) {
                                  setJobNames({
                                    ...jobNames,
                                    [val]: res?.data?.title,
                                  });
                                } else {
                                  setJobNames({
                                    ...jobNames,
                                    [val]: null,
                                  });
                                }
                              });
                            } else {
                              setJobNames({
                                ...jobNames,
                                [val]: null,
                              });
                            }
                          }}
                        />
                      </Form.Item>
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        className="mt-3"
                      />

                      {jobNames[form.getFieldValue("codes")[idx]] && (
                        <p className="text-13 mt-3 mr-3">
                          {jobNames[form.getFieldValue("codes")[idx]]}
                        </p>
                      )}
                    </Space>
                  </div>
                ))}

                <Button
                  type="primary"
                  shape="circle"
                  className="mt-2"
                  onClick={add}
                  icon={<PlusOutlined />}
                  size="large"
                />
              </>
            )}
          </Form.List>

          <div className="flex mt-4">
            <AppButton
              className="big-btn"
              variant="primary"
              size="large"
              loading={btnLoading}
              htmlType="submit"
              disabled={btnLoading}
            >
              تایید
            </AppButton>
            <AppButton
              className="big-btn mr-1"
              size="large"
              variant="text"
              onClick={() => onCancel()}
              disabled={btnLoading}
            >
              انصراف
            </AppButton>
          </div>
        </Form>
      </Spin>
    </StyledModal>
  );
};

const StyledModal = styled.div``;

export default JobCodesModal;
