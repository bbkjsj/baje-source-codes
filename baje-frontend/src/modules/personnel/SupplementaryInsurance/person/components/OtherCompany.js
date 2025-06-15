import React from "react";
import { Modal } from "antd";

function OtherCompany({ visible, onOk, onCancle }) {
  return (
    <>
      <Modal
        title="هشدار"
        okText="بله"
        cancelText="خیر"
        visible={visible}
        onOk={onOk}
        onCancel={onCancle}
      >
        <p>
          این شخص متعلق به شرکت دیگری می باشد .آیا می خواهید در هر صورت آن را
          اضافه کنید ؟
        </p>
      </Modal>
    </>
  );
}

export default OtherCompany;
