import React from "react";
import { Modal, Form } from "antd";
import NewForm from "../common/NewForm";

function DetailModal({ visible, setVisible, data }) {
  const mode = "detail";
  const pageTitle = "مشاهده اطلاعات فرد";
  const [mainForm] = Form.useForm();

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      width={800}
      maskClosable={true}
      footer={null}
    >
      <NewForm
        mode={mode}
        pageTitle={pageTitle}
        mainForm={mainForm}
        submitForm={() => {}}
        //
        modalVisible={visible}
        setModalVisible={setVisible}
        mainId={data?.id}
        initialData={data}
      />
    </Modal>
  );
}

export default DetailModal;
