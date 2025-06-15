import React, { useState, useEffect, useRef } from "react";
import { Form, Row, message } from "antd";

import {
  addMachineHandler,
  getTypeListHandler,
  getContractList,
  onTypeChange,
  onSystemChange,
  getDefaultOwner,
} from "../utils/index.js";
import ContentTop from "components/general/ContentTop";
import SubmitBtn from "components/general/SubmitBtn";
import GoBackBtn from "components/GoBackBtn";
import { formItemLayout, formRowGutter, pageNames } from "constant";
import { useSelector } from "react-redux";
//
import * as FormItem from "./formItems";
import { plateStatusConstant } from "../constant";
import { useHistory } from "react-router";
import { messages } from "utils/message.js";

const MachineAdd = () => {
  const history = useHistory();
  const currentOffice = useSelector((state) => state.currentOffice);
  const [loading, setLoading] = useState(false);
  const [plateStatus, setPlateStatus] = useState(
    plateStatusConstant.WITH_LICENSE_PLATE
  );
  const [form] = Form.useForm();
  const [typeList, setTypeList] = useState([]);
  const [systemList, setSystemList] = useState([]);
  const [tipList, setTipList] = useState([]);
  const [contractList, setContractList] = useState([]);
  const [owner, setOwner] = useState(null);
  const [defaultValue, setDefaultValue] = useState(null);

  const systemRef = useRef();
  const tipRef = useRef();

  useEffect(() => {
    getTypeListHandler(setTypeList);
    if (currentOffice !== "-1") {
      getDefaultOwner(currentOffice, setDefaultValue);
    }
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      contractId: null,
    });
    if (currentOffice) {
      getContractList(currentOffice, setContractList);
    }
  }, [currentOffice]);

  const successFulMessage = () => {
    message.success(messages.createdSuccessfully(), "ماشین آلات");
    form.resetFields();
  };

  const typeChangeHandler = (typeId) => {
    onTypeChange(
      typeId,
      form,
      setPlateStatus,
      setSystemList,
      setTipList,
      typeList,
      systemList
    );

    systemRef.current.focus();
  };

  const systemChangeHandler = (systemId) =>
    onSystemChange(systemId, form, setTipList);

  return (
    <div>
      <GoBackBtn />

      <ContentTop
        title="ماشین آلات - جدید"
        breadcrumbItems={[
          {
            text: "ماشین آلات",
            link: pageNames.machinery.list,
          },
          { text: "ماشین آلات - جدید" },
        ]}
      />

      <Form
        form={form}
        {...formItemLayout}
        onFinish={(values) =>
          addMachineHandler(
            values,
            owner,
            currentOffice,
            plateStatus,
            setLoading,
            successFulMessage,
            history
          )
        }
        initialValues={{
          license_plate_status: "with_license_plate",
          dateType: "shamsi",
        }}
      >
        <Row gutter={formRowGutter}>
          <FormItem.Owner
            form={form}
            setOwner={setOwner}
            defaultValue={defaultValue}
          />
          <FormItem.Type
            systemRef={systemRef}
            options={typeList}
            onChange={typeChangeHandler}
          />
          <FormItem.System
            options={systemList}
            onChange={systemChangeHandler}
            systemRef={systemRef}
            tipRef={tipRef}
          />
          <FormItem.Tip options={tipList} tipRef={tipRef} />
          <FormItem.Plaque plateStatus={plateStatus} form={form} />
          <FormItem.Status />
          <FormItem.OrganizationCode />
          <FormItem.EngineNumber />
          <FormItem.ChassiNumber />
          <FormItem.VIN />
          <FormItem.SerialNumber />
          <FormItem.MadeYear />
          <FormItem.DateType />
          <FormItem.Color />
          <FormItem.Gearbox />
          <FormItem.Price />
          {/* <FormItem.ContractId options={contractList} /> */}
          <FormItem.Environment />
          <FormItem.Description />
          <SubmitBtn loading={loading} />
        </Row>
      </Form>
    </div>
  );
};

export default MachineAdd;
