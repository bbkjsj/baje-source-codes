import React, { useEffect } from "react";
import { Modal, Form, message } from "antd";
import { systemStatus } from "modules/dashboard/const";
import { getTableData } from "modules/dashboard/utils/index";
import { updateProgress } from "../utils/index";
import { _GET_PROGRESS } from "../utils/api";
import * as FormItem from "./formItems";
import { formItemLayout } from "../../../../constant";

function ProgressModal({
  modalVisible,
  record,
  hideModal,
  setModalVisible,
  setDisableBtn,
  setTableData,
  setHash,
  setOperator,
  setManager,
  setCurrent,
  setLoading,
}) {
  const [mainForm] = Form.useForm();

  const onSuccess = () => {
    getTableData(
      _GET_PROGRESS,
      record.contract_id_fk,
      setDisableBtn,
      setTableData,
      setHash,
      setOperator,
      setManager,
      setCurrent,
      setLoading
    );
    message.success("اطلاعات با موفقیت ثبت شد!");
    setModalVisible(false);
  };

  const onError = () => {
    message.error("خطایی در ثبت اطلاعات رخ داده است!");
    setModalVisible(false);
  };
  const onFinishHandler = (values) => {
    const data = [
      {
        ...values,
        status: record.status ? record.status : systemStatus.not_approved,
        id: record.id,
      },
    ];
    const payload = {
      contractId: record.contract_id_fk,
      data,
    };
    updateProgress(payload, onSuccess, onError);
  };

  useEffect(() => {
    if (record?.real_progress && record?.program_progress) {
      mainForm.setFieldsValue({
        real_progress: record.real_progress,
        program_progress: record.program_progress,
      });
    }
  }, [modalVisible]);
  return (
    <Modal
      title="ورورد اطلاعات "
      visible={modalVisible}
      okText="ثبت"
      cancelText="انصراف"
      onCancel={() => {
        hideModal();
      }}
      onOk={() => mainForm.submit()}
    >
      <Form form={mainForm} {...formItemLayout} onFinish={onFinishHandler}>
        <FormItem.RealProgress />
        <FormItem.ProgramProgress />
      </Form>
    </Modal>
  );
}

export default ProgressModal;
