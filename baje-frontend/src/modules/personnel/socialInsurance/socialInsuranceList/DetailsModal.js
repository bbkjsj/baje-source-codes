import React, { useEffect, useState } from "react";
import { Descriptions, Space, Popconfirm, Button, Spin } from "antd";
import { useDeleteSocialInsuranceInView } from "../util/hooks";
import { Modal } from "antd";

function SocialInsuranceDetail({
  insurance,
  visible,
  setVisible,
  onEditHandler,
  getList,
}) {
  const [showButtons, setShowButtons] = useState(false);
  const { deleteItem, loading } = useDeleteSocialInsuranceInView();

  const onDelete = () => {
    deleteItem([insurance.id], getList, setVisible);
  };

  const onEdit = () => {
    setVisible(false);
    onEditHandler(insurance);
  };

  useEffect(() => {
    if (visible) {
      setShowButtons(!insurance.status || insurance.status === "عدم تایید");
    }
  }, [visible]);

  let buttons = null;
  if (showButtons) {
    buttons = (
      <Space>
        <Button onClick={onDelete} style={{ marginTop: "32px" }} type="danger">
          حذف
        </Button>

        <Button
          onClick={onEdit}
          style={{ marginTop: "32px", marginLeft: "15px" }}
          type="primary"
        >
          ویرایش
        </Button>
      </Space>
    );
  }

  return (
    <Modal
      visible={visible}
      maskClosable={true}
      footer={null}
      onCancel={() => setVisible(false)}
      title="اطلاعات لیست بیمه"
    >
      <>
        {/* <Space direction="vertical" size={32}> */}
        <Spin spinning={loading}>
          <Descriptions
            bordered={true}
            column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
          >
            <Descriptions.Item label="شماره قرارداد">
              {insurance.contract_id_fk}
            </Descriptions.Item>
            <Descriptions.Item label="شماره لیست">
              {insurance.list_number}
            </Descriptions.Item>
            <Descriptions.Item label="ماه">{insurance.month}</Descriptions.Item>
            <Descriptions.Item label="سال">{insurance.year}</Descriptions.Item>
            <Descriptions.Item label="تعداد نفرات">
              {insurance.personnel_count}
            </Descriptions.Item>
            <Descriptions.Item label="کد کارگاهی و ردیف پیمان">
              {insurance.workshop_code + "-" + insurance.row}
            </Descriptions.Item>
            <Descriptions.Item label="جمع حق بیمه">
              {insurance.total_insured}
            </Descriptions.Item>
            <Descriptions.Item label="توضیحات">
              {insurance.description}
            </Descriptions.Item>
          </Descriptions>
          {/* </Space> */}

          {showButtons ? buttons : null}
        </Spin>
      </>
    </Modal>
  );
}

export default SocialInsuranceDetail;
