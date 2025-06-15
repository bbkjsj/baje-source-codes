import AddPerson from "modules/personnel/realPerson/users/AddUser";
import React from "react";

const NewPersonModal = ({ onFinish, form, nationalNumber }) => {
  return (
    <>
      <AddPerson
        hideBreadCrumb
        onFinish={onFinish}
        form={form}
        nationalNumber={nationalNumber}
      />
    </>
  );
};

export default NewPersonModal;
