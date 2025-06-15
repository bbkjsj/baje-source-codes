import { Divider, Form, Typography, message } from "antd";
import AppFormItem from "components/general/AppFormItem";
import AppModal from "components/general/AppModal";
import AppTextArea from "components/general/AppTextArea";
import SubmitBtn from "components/general/SubmitBtn";
import { postNotMyDuty } from "modules/task/api/task";
import React from "react";
import { taskDetailActions, useTaskDetailContext } from "./context";
import { useHistory } from "react-router-dom";

const NotMyDuty = () => {
  const { state, dispatch } = useTaskDetailContext();
  const { goBack } = useHistory();

  const handleFinish = async ({ description }) => {
    try {
      await postNotMyDuty({ taskId: state.task.id, description });
      dispatch({ type: taskDetailActions.toggleNotMyDuty });
      message.success({
        content: "با موفقیت ثبت شد",
      });
      goBack();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlClose = () => {
    dispatch({ type: taskDetailActions.toggleNotMyDuty });
  };

  return (
    <AppModal
      centered
      footer={null}
      closable={false}
      onCancel={handlClose}
      visible={state.notMyDutyModal}
    >
      <Typography.Title level={5}>وظیفه من نیست</Typography.Title>
      <Typography.Text level={5}>
        گزارش این مورد که وظیفه اطلاق شده، وظیفه شما نیست.
      </Typography.Text>
      <Divider />
      <Form onFinish={handleFinish}>
        <AppFormItem required label="توضیحات" name="description">
          <AppTextArea />
        </AppFormItem>
        <SubmitBtn />
      </Form>
    </AppModal>
  );
};

export default NotMyDuty;
