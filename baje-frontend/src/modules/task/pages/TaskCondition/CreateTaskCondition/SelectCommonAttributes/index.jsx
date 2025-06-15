import React from "react";
import { Button, Col, Form, Row, Upload } from "antd";
import AppButton from "components/general/AppButton";
import AppFormItem from "components/general/AppFormItem";
import AppInput from "components/general/AppInput";
import AppNumInput from "components/general/AppNumInput";
import AppSelect from "components/general/AppSelect";
import AppTextArea from "components/general/AppTextArea";
import {
  createTaskConditionActions,
  useCreateTaskConditionContext,
} from "../context";
import {
  ifTaskFailed,
  taskCreateType,
  taskPriority,
  taskPunishment,
} from "../../../../constant";
import AppRadioGroup from "components/general/AppRadioGroup";
import { config } from "constant";
import MenuInlineBtn from "components/MenuInlineBtn";
import ApproveCondition from "./ApproveCondition";
import { UploadOutlined } from "@ant-design/icons";
import { normFile } from "_helpers";
import useWhoAmI from "hooks/useWhoAmI";
import { useParams } from "react-router-dom";
import { downloadFile } from "modules/task/api/taskCondition";
import fileDownload from "js-file-download";

const CreateTaskConditionStep1 = () => {
  const { dispatch, state } = useCreateTaskConditionContext();
  const { id } = useWhoAmI();
  const params = useParams();

  const handleFinish = (payload) => {
    dispatch({ type: createTaskConditionActions.handleSecondStep, payload });
  };

  const onClickSMSTemplateModal = () => {
    dispatch({
      type: createTaskConditionActions.changeAttribute,
      payload: { value: true, attribute: "smsNotificationModal" },
    });
  };

  const handleChangeTaskCreateType = ({ target }) => {
    dispatch({
      type: createTaskConditionActions.changeAttribute,
      payload: { value: target.value, attribute: "taskCreateType" },
    });
  };

  const toggleDueDateModal = () => {
    dispatch({ type: createTaskConditionActions.toggleDueDateModal });
  };

  const downloadConditionFile = () => {
    downloadFile(state.attachment).then((res) => {
      fileDownload(res.data, state.attachment.split("/")[1]);
    });
  };

  return (
    <>
      <Form
        initialValues={{
          ...state,
          personnelToInform: state?.personnelToInform?.length
            ? state?.personnelToInform
            : [id],
        }}
        onFinish={handleFinish}
      >
        <Row gutter={16}>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem
              name="taskCreateType"
              label="نحوه ایجاد وظیفه"
              required
            >
              <AppRadioGroup
                onChange={handleChangeTaskCreateType}
                options={taskCreateType}
              />
            </AppFormItem>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem
              tooltip="وظیفه ها با این عنوان ساخته خواهد شد"
              name="title"
              label="نام وظیفه"
              required
            >
              <AppInput />
            </AppFormItem>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem label="اهمیت وظیفه" name="priority">
              <AppSelect options={taskPriority} />
            </AppFormItem>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem
              name="point"
              required
              label="امتیاز مثبت"
              tooltip="امتیاز مثبت در صورت انجام وظیفه در زمان مشخص شده"
            >
              <AppNumInput min={0} />
            </AppFormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem
              name="negativePoint"
              required
              label="امتیاز منفی"
              tooltip="امتیاز منفی در صورت رد شدن زمان انجام وظیفه"
            >
              <AppNumInput min={0} />
            </AppFormItem>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem
              name="ifTaskFailed"
              required
              label="درصورت عدم انجام"
              tooltip="در صورت عدم انجام وظیفه، اتفاق انتخاب شده این قسمت خواهد افتاد"
            >
              <AppSelect options={ifTaskFailed} />
            </AppFormItem>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem
              label="تنبیه در صورت عدم انجام وظیفه"
              name="punishment"
            >
              <AppSelect options={taskPunishment} />
            </AppFormItem>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem label="امکان انتقال وظیفه به دیگری" name="referable">
              <AppRadioGroup
                options={[
                  {
                    label: "خیر",
                    value: 0,
                  },
                  {
                    label: "بله",
                    value: 1,
                  },
                ]}
              />
            </AppFormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col md={12} sm={24} xs={24}>
            <AppFormItem name="pageUrl" label="صفحه مرتبط با وظیفه">
              <AppInput
                style={{ textAlign: "end" }}
                addonAfter={config.url.API_URL}
              />
            </AppFormItem>
          </Col>

          <Col md={12} sm={24} xs={24}>
            <AppFormItem
              label="افراد جهت اطلاع"
              name="personnelToInform"
              extra="جستجو بر اساس کد ملی و نام و نام خانوادگی"
            >
              <AppSelect
                placeholder="انتخاب نمایید"
                filterOption={(search, { nationNumber, label }) =>
                  nationNumber.includes(search) || label.includes(search)
                }
                showSearch
                allowClear
                mode="multiple"
                options={state.personnels.map(
                  ({ first_name, last_name, id: value, national_number }) => ({
                    label: `${first_name} ${last_name} - ${national_number}`,
                    value,
                    nationNumber: national_number,
                  })
                )}
                loading={state.personnelLoading}
                defaultValue={[id]}
              />
            </AppFormItem>
          </Col>
        </Row>

        <ApproveCondition />

        <Row gutter={16}>
          <Col md={12} sm={24} xs={24}>
            <AppFormItem
              required
              label="شرح وظیفه"
              name="description"
              tooltip="این توضیحات برای وظیفه قرار خواهد گرفت"
            >
              <AppTextArea />
            </AppFormItem>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col md={4} sm={24} xs={24}>
            <AppFormItem
              name="file"
              label="فایل پیوستی"
              valuePropName="file"
              getValueFromEvent={normFile}
              tooltip="حداکثر 1 مگابایت"
              rules={[
                () => ({
                  validator(rule, value) {
                    if (!value?.length || typeof value === "string")
                      return Promise.resolve();
                    let file = value[0]["name"].split(".");
                    let fileExtension = file[file.length - 1];
                    let allowedExtensions = [
                      "jpg",
                      "jpeg",
                      "png",
                      "doc",
                      "docx",
                      "xlsx",
                      "xls",
                      "xlsm",
                    ];
                    if (
                      allowedExtensions.includes(
                        fileExtension ? fileExtension.toLowerCase() : ""
                      )
                    ) {
                      if (value[0].size > 1000000) {
                        return Promise.reject(
                          "حجم فایل بیشتر از 1 مگابایت است!"
                        );
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
                accept=".jpg,.jpeg,.png,.doc,.docx,.xlsx,.xls,.xlsm"
                defaultFileList={state.file}
              >
                <Button>
                  <UploadOutlined /> انتخاب فایل
                </Button>
              </Upload>
            </AppFormItem>
            {state?.attachment && typeof state.attachment === "string" ? (
              <div className="flex">
                <p>فایل: {state.attachment}</p>
                <AppButton className="mr-2" onClick={downloadConditionFile}>
                  دانلود
                </AppButton>
              </div>
            ) : (
              ""
            )}
          </Col>
        </Row>

        {/* <Divider /> */}
        <Row justify="end">
          <MenuInlineBtn
            list={[
              {
                label: "تعیین تنظیمات پیامک یادآور",
                handleClick: onClickSMSTemplateModal,
              },
              {
                label: "مهلت انجام وظیفه",
                handleClick: toggleDueDateModal,
              },
              <AppButton className="mx-2" htmlType="submit">
                مرحله بعد
              </AppButton>,
            ]}
          />
        </Row>
      </Form>
    </>
  );
};

export default CreateTaskConditionStep1;
