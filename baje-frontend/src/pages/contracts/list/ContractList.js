import React, { useEffect, useState, useContext } from "react";
import List from "./contractList/List";
import { getList } from "../utils/api";
import { message } from "antd";
import LoadingLogo from "../../../components/general/LoadingLogo";
import SelectType from "./contractList/SelectType";
import { LayoutContext } from "contex/Layout-context";
import MenuInlineBtn from "./../../../components/MenuInlineBtn";
import { TopOfTable } from "./contractList/StyledComponents";
import { getLink, handleClickExportExl } from "_helpers";
import { permission } from "json/Permission";
import useCheckAccess from "hooks/useCheckAccess";
import { CheckAccess } from "AuxComponent/CheckAccess";
import ListActions from "components/general/ListActions";
import ContentTop from "components/general/ContentTop";
import { PlusOutlined } from "@ant-design/icons";
import AppButton from "../../../components/general/AppButton";
import excel from "../../../assets/images/icons/excel.svg";
import InsuranceBtn from "../../../components/general/InsuranceBtn";
import { useHistory } from "react-router-dom";
import { pageNames } from "constant";
import { useSelector } from "react-redux";

const { INSERT_CONTRACT, LIST_CONTRACT } = permission;

const ContractList = () => {
  const [list, setList] = useState([]);
  const [contractType, setContractType] = useState("main");
  const [loading, setLoading] = useState(false);
  const [exportKey, setExportKey] = useState();
  const [selectedRow, setSelectedRow] = useState();
  const layoutContext = useContext(LayoutContext);
  const checkAccess = useCheckAccess();
  const history = useHistory();

  const currentOffice = useSelector((state) => state.currentOffice);

  const handleError = () => {
    message.error("مشکلی پیش آمده است");
  };

  const handleGetList = () => {
    getList(
      setList,
      handleError,
      layoutContext.contractTypeTab,
      setLoading,
      currentOffice,
      setExportKey
    );
  };

  const handleOnSelection = (rows) => {
    if (rows?.length === 1) setSelectedRow(rows[0]);
    else setSelectedRow(undefined);
  };

  const handleOnInsuranceBtnClick = () => {
    const contractId = selectedRow?.id;

    if (contractId) {
      const newPath =
        getLink(pageNames.personnel.insurance.tamin.list) +
        "?contract=" +
        contractId;
      history.push(newPath);
    }
  };

  useEffect(() => {
    if (currentOffice && checkAccess(LIST_CONTRACT)) {
      handleGetList();
    }
  }, [layoutContext.contractTypeTab, currentOffice]);

  if (!currentOffice) {
    return <LoadingLogo />;
  }

  const menuBtnList = [
    {
      url: pageNames.contract.add,
      label: "قرارداد جدید",
      id: "newContract",
      permission: INSERT_CONTRACT,
      variant: "primary",
      icon: <PlusOutlined />,
    },
    <InsuranceBtn
      disabled={!selectedRow}
      onClick={handleOnInsuranceBtnClick}
    />,
    // {
    //   handleClick: () => handleClickExportExl(exportKey),
    //   label: "خروجی اکسل",
    //   id: "exportExcel",
    // },
  ];

  return (
    <>
      <ContentTop noBack title="لیست قرارداد ها" />
      <div className="w-100 flex-wrap align-center">
        <MenuInlineBtn list={menuBtnList} />
        <ListActions
          className="mr-md-auto mt-3 mt-lg-0"
          noPrint
          noFilter
          noSort
          actions={{
            excelExport: () => handleClickExportExl(exportKey),
          }}
        />
      </div>

      <TopOfTable>
        <CheckAccess permission={LIST_CONTRACT}>
          <SelectType />
        </CheckAccess>
      </TopOfTable>

      <CheckAccess permission={LIST_CONTRACT}>
        <List
          data={list}
          loading={loading}
          getList={handleGetList}
          onSelection={handleOnSelection}
        />
      </CheckAccess>
    </>
  );
};

export default ContractList;
