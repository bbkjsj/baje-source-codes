import React, { useEffect, useState } from "react";
import { Form, notification, Spin } from "antd";
import SubmitBtn from "components/general/SubmitBtn";
import {
  Checkout,
  DefinitiveAdjustments,
  DefinitiveDelivery,
  DefinitiveStatus,
  FixDefectsDate,
  GuaranteesRelease,
  SettlementReceipt,
  TemporaryDelivery,
} from "../common/formItems";
import styled from "styled-components";
import { convertDateToISO8601, timeToFa } from "_helpers";
import { EDIT_CONTRACT_STATUS, GET_CONTRACT } from "../utils/api";

const ProjectStatusModal = ({ id, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState();
  const [enables, setEnables] = useState({
    defectsFixedOn: false,
    temporaryDeliveredOn: false,
    definitiveStatementOn: false,
    definitiveAdjustmentOn: false,
    definitiveDeliveryOn: false,
    accountSettledOn: false,
    warrantyReleasedOn: false,
    checkoutOn: false,
  });

  ////////////////////////////////////////////////////

  useEffect(() => {
    setLoading(true);
    GET_CONTRACT(id)
      .then((res) => {
        setLoading(false);
        setData(res.data);
        const {
          defectsFixedOn,
          temporaryDeliveredOn,
          definitiveStatementOn,
          definitiveAdjustmentOn,
          definitiveDeliveryOn,
          accountSettledOn,
          warrantyReleasedOn,
          checkoutOn,
        } = res.data;

        setEnables({
          defectsFixedOn: defectsFixedOn ? true : false,
          temporaryDeliveredOn: temporaryDeliveredOn ? true : false,
          definitiveStatementOn: definitiveStatementOn ? true : false,
          definitiveAdjustmentOn: definitiveAdjustmentOn ? true : false,
          definitiveDeliveryOn: definitiveDeliveryOn ? true : false,
          accountSettledOn: accountSettledOn ? true : false,
          warrantyReleasedOn: warrantyReleasedOn ? true : false,
          checkoutOn: checkoutOn ? true : false,
        });

        form.setFieldsValue({
          defectsFixedOn: defectsFixedOn && timeToFa(defectsFixedOn, false),
          temporaryDeliveredOn:
            temporaryDeliveredOn && timeToFa(temporaryDeliveredOn, false),
          definitiveStatementOn:
            definitiveStatementOn && timeToFa(definitiveStatementOn, false),
          definitiveAdjustmentOn:
            definitiveAdjustmentOn && timeToFa(definitiveAdjustmentOn, false),
          definitiveDeliveryOn:
            definitiveDeliveryOn && timeToFa(definitiveDeliveryOn, false),
          accountSettledOn:
            accountSettledOn && timeToFa(accountSettledOn, false),
          warrantyReleasedOn:
            warrantyReleasedOn && timeToFa(warrantyReleasedOn, false),
          checkoutOn: checkoutOn && timeToFa(checkoutOn, false),
        });
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, [id]);

  ////////////////////////////////////////////////////////////

  function handleOnFinish(values) {
    const body = {};

    for (let key in values) {
      if (values[key] && enables[key]) {
        body[key] = convertDateToISO8601(values[key]);
      }
    }

    if (Object.keys(body).length && data.id) {
      setLoading(true);
      EDIT_CONTRACT_STATUS(data.id, body)
        .then((res) => {
          setLoading(false);
          notification.success({
            message: "با موفقیت ذخیره شد",
          });
          form.resetFields();
          onCancel();
        })
        .catch((err) => {
          setLoading(false);
          console.error(err);
        });
    }
  }

  ///////////////////////////////////////////////////

  return (
    <Spin spinning={loading}>
      <StyledContainer>
        <Form form={form} onFinish={handleOnFinish}>
          <FixDefectsDate
            enabled={enables.defectsFixedOn}
            onChange={(val) =>
              setEnables((curr) => ({ ...curr, defectsFixedOn: val }))
            }
            useForm={form}
            data={data}
          />
          <TemporaryDelivery
            enabled={enables.temporaryDeliveredOn}
            onChange={(val) =>
              setEnables((curr) => ({ ...curr, temporaryDeliveredOn: val }))
            }
            useForm={form}
            data={data}
          />
          <DefinitiveStatus
            enabled={enables.definitiveStatementOn}
            onChange={(val) =>
              setEnables((curr) => ({ ...curr, definitiveStatementOn: val }))
            }
            useForm={form}
            data={data}
          />
          <DefinitiveAdjustments
            enabled={enables.definitiveAdjustmentOn}
            onChange={(val) =>
              setEnables((curr) => ({ ...curr, definitiveAdjustmentOn: val }))
            }
            useForm={form}
            data={data}
          />
          <DefinitiveDelivery
            enabled={enables.definitiveDeliveryOn}
            onChange={(val) =>
              setEnables((curr) => ({ ...curr, definitiveDeliveryOn: val }))
            }
            useForm={form}
            data={data}
          />
          <SettlementReceipt
            enabled={enables.accountSettledOn}
            onChange={(val) =>
              setEnables((curr) => ({ ...curr, accountSettledOn: val }))
            }
            useForm={form}
            data={data}
          />
          <GuaranteesRelease
            enabled={enables.warrantyReleasedOn}
            onChange={(val) =>
              setEnables((curr) => ({ ...curr, warrantyReleasedOn: val }))
            }
            useForm={form}
            data={data}
          />
          <Checkout
            enabled={enables.checkoutOn}
            onChange={(val) =>
              setEnables((curr) => ({ ...curr, checkoutOn: val }))
            }
            useForm={form}
            data={data}
          />
          <SubmitBtn loading={loading} />
        </Form>
      </StyledContainer>
    </Spin>
  );
};

// css
const StyledContainer = styled.div`
  .ant-col {
    max-width: 100% !important;
    flex: 0 0 100% !important;
  }

  .ant-row {
    margin-bottom: 8px !important;
    max-width: 250px;
  }

  .ant-col {
    margin-right: 12px;
  }

  .ant-checkbox-wrapper {
    transform: translateY(70px);
    z-index: 1;
  }

  .input-wrapper:not(:first-of-type) {
    margin-top: -32px;
  }
`;

export default ProjectStatusModal;
