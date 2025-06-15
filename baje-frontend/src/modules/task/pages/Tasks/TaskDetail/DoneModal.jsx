import { Button, Divider, Form, Typography, Upload, message } from "antd";
import AppFormItem from "components/general/AppFormItem";
import AppModal from "components/general/AppModal";
import AppTextArea from "components/general/AppTextArea";
import SubmitBtn from "components/general/SubmitBtn";
import { patchTask, postNotMyDuty } from "modules/task/api/task";
import React, { useState } from "react";
import { taskDetailActions, useTaskDetailContext } from "./context";
import { useHistory, useRouteMatch } from "react-router-dom";
import { constant, taskStatus } from "modules/task/constant";
import { UploadOutlined } from "@ant-design/icons";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  if (e.fileList.length > 1) {
    e.fileList.shift();
  }

  return e && e.fileList;
};

const DoneModal = () => {
  const { state, dispatch } = useTaskDetailContext();
  const { params } = useRouteMatch();
  const { goBack } = useHistory();
  const { role, id } = params;
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleFinish = async (data) => {
    const formData = new FormData();
    formData.append("id", state.task.id);
    formData.append("status", constant.done);
    if (data.description) {
      formData.append("attachmentDescription", data.description);
    }
    if (data?.attachment?.length) {
      formData.append("attachment", data.attachment[0].originFileObj);
    }

    setLoading(true);
    patchTask(state.task.id, formData)
      .then((res) => {
        message.success("با موفقیت انجام شد");
        history.goBack();
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClose = () => {
    dispatch({ type: taskDetailActions.toggleDoneModal });
  };

  const uploadRules = [
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
            return Promise.reject("حجم فایل بیشتر از 1 مگابایت است!");
          }

          return Promise.resolve();
        } else {
          return Promise.reject("فرمت فایل صحیح نمی باشد");
        }
      },
    }),
  ];

  return (
    <AppModal
      centered
      footer={null}
      closable={true}
      onCancel={handleClose}
      visible={state.doneModal}
    >
      <Typography.Title level={5}>انجام وظیفه</Typography.Title>
      <Divider />
      <Form onFinish={handleFinish}>
        <AppFormItem label="توضیحات" name="description">
          <AppTextArea />
        </AppFormItem>
        <AppFormItem
          name="attachment"
          label="فایل پیوستی"
          valuePropName="attachment"
          getValueFromEvent={normFile}
          tooltip="حداکثر 1 مگابایت"
          rules={uploadRules}
        >
          <Upload
            beforeUpload={(file) => {
              return false;
            }}
            accept=".jpg,.jpeg,.png,.doc,.docx,.xlsx,.xls,.xlsm"
          >
            <Button>
              <UploadOutlined /> انتخاب فایل
            </Button>
          </Upload>
        </AppFormItem>
        <SubmitBtn loading={loading} />
      </Form>
    </AppModal>
  );
};

export default DoneModal;
