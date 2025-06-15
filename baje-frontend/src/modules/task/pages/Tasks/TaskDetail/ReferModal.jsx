import { Button, Divider, Form, Typography, Upload, message } from "antd";
import AppFormItem from "components/general/AppFormItem";
import AppModal from "components/general/AppModal";
import AppTextArea from "components/general/AppTextArea";
import SubmitBtn from "components/general/SubmitBtn";
import { patchTask, postForwardTask, postNotMyDuty } from "modules/task/api/task";
import React, { useState } from "react";
import { taskDetailActions, useTaskDetailContext } from "./context";
import { useHistory, useRouteMatch } from "react-router-dom";
import { constant, taskStatus } from "modules/task/constant";
import { UploadOutlined } from "@ant-design/icons";
import AppSelect from "components/general/AppSelect";
import { useCreateTaskConditionContext } from "../../TaskCondition/CreateTaskCondition/context";
import { useEffect } from "react";
import { getPersonnel } from "modules/task/api/general";

const ReferModal = () => {
  const { state, dispatch } = useTaskDetailContext();
  const { params } = useRouteMatch();
  const { goBack } = useHistory();
  const { role, id } = params;
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [personLoading, setPersonLoading] = useState(false);
  const [personnel, setPersonnel] = useState([]);

  useEffect(() => {
    setPersonLoading(true);
    getPersonnel()
      .then((res) => {
        setPersonnel(res.data.list);
      })
      .finally(() => {
        setPersonLoading(false);
      });
  }, []);

  const handleFinish = async (data) => {
    console.log(data);
    try {
      setLoading(true);
      await postForwardTask(params.id, data);
      setLoading(false);
      history.goBack();
      message.success("با موفقیت ارجاع شد")
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  const handleClose = () => {
    dispatch({ type: taskDetailActions.toggleReferModal });
  };

  return (
    <AppModal
      centered
      footer={null}
      closable={true}
      onCancel={handleClose}
      visible={state.referModal}
    >
      <Typography.Title level={5}>ارجاع وظیفه</Typography.Title>
      <Divider />
      <Form onFinish={handleFinish}>
        <AppFormItem
          required
          label="افراد جهت ارجاع"
          name="forwardTo"
          extra="جستجو بر اساس کد ملی و نام و نام خانوادگی"
        >
          <AppSelect
            placeholder="انتخاب نمایید"
            filterOption={(search, { nationNumber, label }) =>
              nationNumber.includes(search) || label.includes(search)
            }
            showSearch
            mode="multiple"
            options={personnel.map(
              ({ first_name, last_name, id: value, national_number }) => ({
                label: `${first_name} ${last_name} - ${national_number}`,
                value,
                nationNumber: national_number,
              })
            )}
            loading={personLoading}
          />
        </AppFormItem>
        <AppFormItem label="توضیحات" name="forwardDescription">
          <AppTextArea />
        </AppFormItem>
        <SubmitBtn loading={loading} />
      </Form>
    </AppModal>
  );
};

export default ReferModal;
