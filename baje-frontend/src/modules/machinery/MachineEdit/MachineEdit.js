import React, { useState, useEffect, useRef } from "react";
import { Form, Row, message, Modal } from "antd";
import { withRouter, useHistory } from "react-router-dom";
import {
  getContractList,
  getMachineData,
  onFinishUpdate,
  getRelatedSystemListHandler,
  getTypeListHandler,
  getTipListHandler,
  onTypeChange,
  onSystemChange,
} from "../utils/index";
import { plateStatusConstant } from "../constant";
import LoadingLogo from "components/general/LoadingLogo";
import GoBackBtn from "components/GoBackBtn";
import { getBase64Local, loadImage } from "_helpers";
import ContentTop from "components/general/ContentTop";
import SubmitBtn from "components/general/SubmitBtn";
import { formItemLayout, formRowGutter, pageNames } from "constant";
import { useSelector } from "react-redux";
import * as FormItem from "./formItems";
import { messages, showMessage } from "utils/message";

const MachineEdit = (props) => {
  const [loading, setLoading] = useState(false);
  const [plateStatus, setPlateStatus] = useState(
    plateStatusConstant.WITH_LICENSE_PLATE
  );

  const machineID = props.match.params.id;
  const [form] = Form.useForm();
  const [vehicleReferences, setVehicleReferences] = useState({});
  const [machineData, setMachineData] = useState();
  const [allMachineData, setAllMachineData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [owner, setOwner] = useState(null);
  const [defaultValue, setDefaultValue] = useState(null);

  const [typeList, setTypeList] = useState([]);
  const [systemList, setSystemList] = useState([]);
  const [tipList, setTipList] = useState([]);
  const [contractList, setContractList] = useState([]);

  const history = useHistory();
  const currentOffice = useSelector((state) => state.currentOffice);

  const systemRef = useRef();
  const tipRef = useRef();

  useEffect(() => {
    if (currentOffice) {
      form.setFieldsValue({ contractId: null });
      getContractList(currentOffice, setContractList);
    }
  }, [currentOffice]);

  useEffect(() => {
    getMachineData(machineID).then((data) => {
      if (data.pelak === 1) {
        setPlateStatus(plateStatusConstant.WITH_LICENSE_PLATE);
      } else {
        setPlateStatus(plateStatusConstant.WITHOUT_LICENSE_PLATE);
      }

      // console.log(data, form.getFieldsValue(), "data , fields");

      setMachineData(data);
      setAllMachineData(data);
      setDefaultValue(
        data.ownerType === "personnel" ? data.nationalNumber : data.nationalId
      );
      getRelatedSystemListHandler(data.typeId, setSystemList);
      getTipListHandler(data.systemId, setTipList);
      form.setFieldsValue({
        ...data,
        pelak1: data.pelak1,
        license_plate_status: plateStatus,
        owner_name: data.ownerCompanyName
          ? data.ownerCompanyName
          : `${data.ownerFirstName} ${data.ownerLastName}`,
        //styleId: data.style,
      });
    });

    getTypeListHandler(setTypeList);
  }, []);

  const onPhotoPreview = (file) => {
    setModalVisible(true);
    setImageUrl(null);
    if (file.hasOwnProperty("status") && file.status === "done") {
      loadImage(file.url).then((base64) => {
        setImageUrl(base64);
      });
    } else {
      getBase64Local(file.originFileObj).then((base64) => {
        setImageUrl(base64);
      });
    }
  };

  const typeChangeHandler = (typeId) =>
    onTypeChange(
      typeId,
      form,
      setPlateStatus,
      setSystemList,
      setTipList,
      typeList
    );

  const systemChangeHandler = (systemId) =>
    onSystemChange(systemId, form, setTipList);

  const successFulMessage = () => {
    showMessage(messages.editedSuccessfully("ماشین الات"), "success");
    history.push(pageNames.machinery.list);
  };

  const errorMessage = (msg) => {
    message.error(msg.data);
  };

  if (!machineData) {
    return <LoadingLogo />;
  }

  return (
    <>
      <GoBackBtn />

      <ContentTop
        title="ویرایش ماشین آلات"
        breadcrumbItems={[
          {
            text: "ماشین آلات",
            link: pageNames.machinery.list,
          },
          { text: "ویرایش ماشین آلات" },
        ]}
      />

      <h2>ویرایش ماشین آلات</h2>
      <Modal
        visible={modalVisible}
        title="اسکن"
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        {imageUrl && (
          <img alt="scan" style={{ width: "100%" }} src={imageUrl} />
        )}
      </Modal>
      <Form
        // initialValues={{
        //   vehicle_card: machineData.card_url,
        //   vehicle_green_card: machineData.green_card_url,
        //   own_doc: machineData.ownership_document_url,
        //   ...machineData,
        //   pelak1: machineData.pelak1,
        //   license_plate_status: plateStatus,
        //   owner_name: machineData.owner_compnay_name
        //     ? machineData.owner_compnay_name
        //     : `${machineData.owner_first_name} ${machineData.owner_last_name}`,
        // }}
        form={form}
        {...formItemLayout}
        onFinish={(values) => {
          setMachineData(values);
          onFinishUpdate(
            values,
            owner,
            plateStatus,
            setLoading,
            successFulMessage,
            machineID,
            currentOffice,
            allMachineData
          );
        }}
        style={{ backgroundColor: "#fff", padding: "20px" }}
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
    </>
  );
};

export default withRouter(MachineEdit);
