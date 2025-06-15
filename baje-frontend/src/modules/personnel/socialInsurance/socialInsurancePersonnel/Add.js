import React, { useState } from "react";
import { Form } from "antd";
import NewForm from "./common/NewForm";
import { addMemberHandler } from "./utils/index";

function Add() {
  const mode = "add";
  const pageTitle = "مشاهده اطلاعات فرد";
  const [mainForm] = Form.useForm();

  return (
    <NewForm
      mode={mode}
      pageTitle={pageTitle}
      mainForm={mainForm}
      submitForm={addMemberHandler}
      //
      modalVisible={null}
      setModalVisible={() => {}}
      mainId={null}
      initialData={null}
    />
  );
}

export default Add;
