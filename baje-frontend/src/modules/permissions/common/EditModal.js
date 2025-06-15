import React, { useEffect, useState } from "react";
import { Form, message, Modal, Row } from "antd";
import { useParams } from "react-router-dom";
import * as fields from "./formItems";
import { convertDateToEN, convertDateToISO8601, timeToFa } from "_helpers";
import SubmitBtn from "components/general/SubmitBtn";
import { updateUserPermission } from "../utils/api";

function EditModal({ onCancel, permissionId, updateList }) {
  const { id, accessId, endDate, startDate } = permissionId;

  const routeParams = useParams();
  const [mainForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (endDate && !endDate.includes("2099")) {
      mainForm.setFieldsValue({ endDate: timeToFa(endDate, false) });
    }
  }, [endDate, mainForm]);

  function handleFinish(params) {
    const body = { ...params };

    if (body.endDate) {
      const fromDate = new Date(startDate);
      const toDate = new Date(convertDateToEN(body.endDate));

      console.log(fromDate, toDate);

      if (toDate < fromDate) {
        Modal.warn({ content: "تاریخ پایان نمی تواند قبل از تاریخ شروع باشد" });
        return;
      }

      body.endDate = convertDateToISO8601(body.endDate);

      setLoading(true);

      updateUserPermission(body, id)
        .then(() => {
          message.success("با موفقیت انجام شد");
          onCancel();
          updateList();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      Modal.warn({
        content: "لطفاً تاریخ را وارد نمایید",
      });
    }
  }

  return (
    <Form form={mainForm} onFinish={handleFinish}>
      <fields.EndDate useForm={mainForm} noCol />
      <SubmitBtn loading={loading} />
    </Form>
  );
}

export default EditModal;
