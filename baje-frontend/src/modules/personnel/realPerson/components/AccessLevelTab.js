import React, { useState, useContext, useEffect } from "react";
import { Row, message } from "antd";
import { handleGetPermission, addPermissionToList } from "../utils/index";
import {
  handleRestCheckBox,
  selectCheckBoxPermission,
} from "../utils/formUtils";
import {
  SelectOffice,
  SelectContract,
  SelectPermission,
} from "./accessLevelTab/FormItems";
import SubmitBtn from "components/general/SubmitBtn";
import TextLoading from "./accessLevelTab/TextLoading";
import { formRowGutter } from "../../../../constant";
import { useSelector } from "react-redux";
import { NewContext } from "contex/New-Context";
import useWhoAmI from "hooks/useWhoAmI";

const AccessLevelTab = ({
  onSubmit,
  loading,
  useForm,
  permissionsSelected,
  setPermissionsSelected,
}) => {
  const user = useWhoAmI();
  const listLegal = user?.companies;
  const { getContractList } = useContext(NewContext);

  const [contractSelect, setContractSelect] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPermissions, setShowPermissions] = useState(false);

  const handleOnChangeOffice = (officeID) => {
    //- remove current contract List
    useForm.setFieldsValue({ "selectContract/accessLevelTab": null });
    //- get contract current office
    let contracts = getContractList(officeID, null, true);
    console.log("fewof", contracts);
    setContractSelect(contracts);
    //- hide checkbox permissions
    setShowPermissions(false);
  };

  const handleOnchangeContract = (contractID) => {
    //- show checkbox permissions
    setShowPermissions(true);
    //- rest checkBox permissions
    const companyID = useForm.getFieldValue("selectOffice/accessLevelTab");
    handleRestCheckBox(contractID, companyID, useForm);
    //- select permission that saved in selected permission
    selectCheckBoxPermission(permissionsSelected, contractID, useForm);
  };

  // useEffect(() => {
  //   setContractSelect(contractList);
  // }, [contractList]);

  useEffect(() => {
    handleGetPermission(handleSetPermissions, handleError);
  }, []);

  const handleSetPermissions = (data) => {
    // console.log(data, "data permission!");
    setPermissions(data);
    setInitialLoading(false);
  };

  const handleError = (msg) => {
    message.error(msg);
    setInitialLoading(false);
  };

  const handleOnConfirm = () => {
    //- set permission to state
    addPermissionToList(useForm, permissionsSelected, setPermissionsSelected);
    message.success("پرمیشن ها اضافه شد.");
  };

  if (initialLoading) {
    return <TextLoading />;
  }

  return (
    <Row gutter={formRowGutter}>
      <SelectOffice option={listLegal} onChange={handleOnChangeOffice} />

      <SelectContract
        option={contractSelect}
        onChange={handleOnchangeContract}
      />

      {initialLoading === false && showPermissions && (
        <SelectPermission
          permissions={permissions}
          useForm={useForm}
          onConfirm={handleOnConfirm}
        />
      )}

      <SubmitBtn customFunction={onSubmit} loading={loading} />
    </Row>
  );
};

export default AccessLevelTab;
