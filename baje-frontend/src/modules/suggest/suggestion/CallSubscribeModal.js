import React, { useEffect, useState } from "react";
import { Modal, Button, Table, notification, Spin } from "antd";
import AppButton from "components/general/AppButton";
import * as callApi from "../call/utils/api";
import { covetFormatDateToFA } from "_helpers";
import { _GET_UPCOMING_CALLS, _POST_SUBSCRIBE_CALL } from "./utils/api";
import { CheckOutlined } from "@ant-design/icons";

const CallSubscribeModal = (props) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "نام فراخوان",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "توضیحات",
      dataIndex: "w_name",
      key: "w_name",
    },
    {
      title: "بازه",
      dataIndex: "date",
      key: "date",
      render: (value, record) => {
        return (
          <p>
            {covetFormatDateToFA(record.start_date) +
              " تا " +
              covetFormatDateToFA(record.end_date)}
          </p>
        );
      },
    },
    {
      title: "اشتراک",
      dataIndex: "subscribe",
      key: "subscribe",
      render: (value, record) => {
        return (
          <AppButton
            variant={record.subscribed ? "success" : "primary"}
            disabled={record.subscribed}
            icon={record.subscribed && <CheckOutlined />}
            onClick={() => subscribeToCall(record.id)}
          >
            {record.subscribed ? "مشترک شده" : "اشتراک"}
          </AppButton>
        );
      },
    },
  ];

  function subscribeToCall(callId) {
    console.log(callId);
    setLoading(true);
    _POST_SUBSCRIBE_CALL({ call_id: callId })
      .then((res) => {
        setLoading(false);
        notification.success({ message: "با موفقیت مشترک شدید" });
        getCalls();
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        notification.error({ message: "عملیات ناموفق، لطفا مجددا تلاش کنید" });
      });
  }

  useEffect(() => getCalls(), []);

  function getCalls() {
    setLoading(true);
    _GET_UPCOMING_CALLS()
      .then((res) => {
        setLoading(false);

        if (res.data) {
          setRows(res.data);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }

  return (
    <Modal
      title="اشتراک در فراخوان"
      visible={props.status}
      width={720}
      onCancel={() => props.close()}
      footer={[
        <Button key="back" onClick={() => props.close()}>
          بستن
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        {rows.length ? (
          <>
            <Table columns={columns} dataSource={rows} pagination={false} />
          </>
        ) : (
          <h4 className="text-center">هیچ فراخوان آتی وجود ندارد</h4>
        )}
      </Spin>
    </Modal>
  );
};

export default CallSubscribeModal;
