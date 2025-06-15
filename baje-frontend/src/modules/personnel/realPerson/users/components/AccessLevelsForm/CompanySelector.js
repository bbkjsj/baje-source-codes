import React, { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { Form, Row } from "antd";
import * as FormItems from "../formItems";
import { NewContext } from "contex/New-Context";
import { getUserAccess } from "../../utils/index";
import { ACCESS_SECTIONS } from "../../const";
import { formRowGutter } from "constant";
import useWhoAmI from "hooks/useWhoAmI";

export default function CompanySelector({
  setShowPermissions,
  setLoading,
  form,
  totalAccess,
  selectedOffice,
  selectedContract,
  setSelectedOffice,
  setSelectedContract,
}) {
  const user = useWhoAmI();
  const listLegal = user?.companies;
  const { getContractList } = useContext(NewContext);
  const [contracts, setContracts] = useState([]);

  const handleOnChangeOffice = (officeID) => {
    form.setFieldsValue({ selectContract: null });
    let relatedContracts = getContractList(officeID, null, true);
    setContracts(relatedContracts);
    setShowPermissions(false);
    setSelectedOffice(officeID);
  };

  const handleOnchangeContract = (contractID) => {
    setShowPermissions(true);
    const companyID = form.getFieldValue("selectOffice");
    form.resetFields();
    setOldPermissions(form, contractID, companyID);
    setSelectedContract(contractID);
  };

  const setOldPermissions = (form, contractID, companyID) => {
    const AccessToCurrentContract = totalAccess.filter(
      (el) => el.contractId == contractID && el.companyId == companyID
    );

    const relatedPermissions =
      AccessToCurrentContract.length > 0
        ? AccessToCurrentContract[0].access
        : AccessToCurrentContract;

    const formVlaues = { selectOffice: companyID, selectContract: contractID };

    ACCESS_SECTIONS.forEach((element) => {
      if (relatedPermissions.length) {
        formVlaues[element] = relatedPermissions.filter(
          (el) => el && el.toString().startsWith(`${element}/`)
        );
      }
    });

    form.setFieldsValue(formVlaues);
  };

  useEffect(() => {
    if (selectedOffice) {
      handleOnChangeOffice(selectedOffice);

      if (selectedContract) {
        handleOnchangeContract(selectedContract);
      }
    }
  }, []);

  return (
    <Row gutter={formRowGutter}>
      <FormItems.SelectOffice
        option={listLegal}
        onChange={handleOnChangeOffice}
      />
      <FormItems.SelectContract
        option={contracts}
        onChange={handleOnchangeContract}
      />
    </Row>
  );
}
