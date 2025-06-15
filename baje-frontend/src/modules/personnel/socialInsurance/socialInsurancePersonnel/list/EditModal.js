import React from "react";
import { Modal, Form } from "antd";
import NewForm from "../common/NewForm";
import { updateMemberHandler } from "../utils/index";

function EditModal({ visible, setVisible, data }) {
  const mode = "edit";
  const pageTitle = "ویرایش فرد";
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
        submitForm={updateMemberHandler}
        //
        modalVisible={visible}
        setModalVisible={setVisible}
        mainId={data?.id}
        initialData={data}
      ></NewForm>
    </Modal>
  );
}

export default EditModal;
