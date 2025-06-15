import React, { useState, useContext, useEffect } from "react";
import {
  Form,
  Row,
  notification,
  Descriptions,
  Space,
  Modal,
  message,
  Spin,
} from "antd";
import * as FormItems from "./components/FormItems";
import SubmitBtn from "components/general/SubmitBtn";
import { _POST_TOTAL } from "./util/api";
import { priceNormalizer } from "_helpers";
import { useSelector } from "react-redux";

const formItemLayout = {
  labelCol: { span: 24 },
  colon: false,
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    lg: { span: 22 },
  },
};

const formGutter = { xs: 8, sm: 16, md: 24, lg: 32 };

const SocialInsuranceTotal = ({ onCancel, insuranceList, modalVisible }) => {
  const currentOffice = useSelector((state) => state.currentOffice);
  const currentContract = useSelector((state) => state.currentContract);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState();
  const [total, setTotal] = useState();

  const handleOnFinish = (values) => {
    const item1 = insuranceList.find((el) => el.id == values.list1_id);
    const item2 = insuranceList.find((el) => el.id == values.list2_id);
    let data = {
      fromMonth: item1.month,
      fromYear: item1.year,
      toMonth: item2.month,
      toYear: item2.year,
      contractId: currentContract,
      companyId: currentOffice,
    };
    console.log("!data in on finish", data);
    postData(data);
  };

  async function postData(value) {
    setLoading(true);
    try {
      const response = await _POST_TOTAL(value);
      setLoading(false);
      if (response) {
        setTotal(response?.data?.total);
      } else {
        notification.warning({
          message: "عملیات ناموفق",
        });
      }
    } catch (err) {
      //console.error(err.response.data);
      setLoading(false);
      notification.error({
        message:
          err?.response?.data && err.response.status < 500
            ? err.response.data
            : "عملیات ناموفق",
      });
    }
  }
  const calcHandler = () => {
    const list1 = form.getFieldValue("list1_id");
    const list2 = form.getFieldValue("list2_id");
    if (list1 && list2) {
      if (list1 != list2) {
        console.log("!submit");
        form.submit();
      } else {
        form.setFieldsValue({ list1_id: null, list2_id: null });
        setTotal(null);
        message.error(
          "برای محاسبه جمع لیست، لیست اول و آخر می بایست باید متفاوت باشند."
        );
      }
    }
  };

  const onChange = () => {
    calcHandler();
  };

  useEffect(() => {
    if (modalVisible && insuranceList?.length > 0) {
      form.setFieldsValue({
        list1_id: insuranceList[insuranceList.length - 1].id,
        list2_id: insuranceList[0].id,
      });

      calcHandler();
    }
  }, [modalVisible]);

  return (
    <Modal
      visible={modalVisible}
      maskClosable={true}
      onCancel={onCancel}
      footer={null}
      title="جمع لیست های ارسال شده"
    >
      <Spin spinning={loading}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Form
            {...formItemLayout}
            form={form}
            name="SocialInsuranceTotal"
            scrollToFirstError
            onFinish={handleOnFinish}
          >
            <Row gutter={formGutter}>
              <FormItems.FirstInsuranceList
                label="لیست اول"
                name="list1_id"
                insuranceList={insuranceList}
                form={form}
                onChange={onChange}
              />
              <FormItems.LastInsuranceList
                label="لیست آخر"
                name="list2_id"
                insuranceList={insuranceList}
                form={form}
                onChange={onChange}
              />
            </Row>
          </Form>

          {total && (
            <Descriptions bordered>
              <Descriptions.Item
                label="جمع لیست های ارسال شده "
                labelStyle={{ color: "red", fontWeight: "bold" }}
                contentStyle={{ color: "red", fontWeight: "bold" }}
              >
                {priceNormalizer(total.toString())}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Space>
      </Spin>
    </Modal>
  );
};

export default SocialInsuranceTotal;
