import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { LayoutContext } from "contex/Layout-context";
import useCheckAccess from "hooks/useCheckAccess";
import { permission } from "json/Permission";
import { pageNames } from "constant";
import {
  downloadExcel,
  getLink,
  handleClickExportExl,
  isDateBetween,
} from "_helpers";
import { CheckAccess } from "AuxComponent/CheckAccess";
import ContentTop from "components/general/ContentTop";
import MenuInlineBtn from "components/MenuInlineBtn";
import LoadingLogo from "components/general/LoadingLogo";
import ListActions from "components/general/ListActions";
import InsuranceBtn from "components/general/InsuranceBtn";
import { SelectType } from "./formItems";
import Table from "./Table";
import { getList } from "../utils/index";
import AppSwitch from "components/general/AppSwitch";
import { endpoints } from "../utils/constant";

//
const { INSERT_CONTRACT, LIST_CONTRACT } = permission;
//
const TopOfTable = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

//
export default function Index() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportKey, setExportKey] = useState();
  const [selectedRow, setSelectedRow] = useState();
  const [filterByOngoing, setFilterByOngoing] = useState(true);

  const layoutContext = useContext(LayoutContext);
  const checkAccess = useCheckAccess();
  const history = useHistory();

  const currentOffice = useSelector((state) => state.currentOffice);

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

  const handleError = () => {
    message.error("مشکلی پیش آمده است");
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
  const handleOnSelection = (rows) => {
    if (rows?.length === 1) setSelectedRow(rows[0]);
    else setSelectedRow(undefined);
  };

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
    {
      label: "گزارش کنترل پروژه",
      handleClick: () => {
        downloadExcel(
          endpoints.getExcel(currentOffice, layoutContext.contractTypeTab)
        );
      },
    },
    // {
    //   handleClick: () => handleClickExportExl(exportKey),
    //   label: "خروجی اکسل",
    //   id: "exportExcel",
    // },
  ];

  useEffect(() => {
    if (currentOffice && checkAccess(LIST_CONTRACT)) {
      handleGetList();
    }
  }, [layoutContext.contractTypeTab, currentOffice]);

  if (!currentOffice) {
    return <LoadingLogo />;
  }

  function filterOutOnGoings() {
    if (!list) return [];
    if (!filterByOngoing) return list;

    return list.filter((i) =>
      isDateBetween(i.startDate, i.endDate, new Date())
    );
  }

  return (
    <>
      <ContentTop noBack title="لیست قرارداد ها" />
      <div className="w-100 flex-wrap align-center">
        <MenuInlineBtn list={menuBtnList} />
        {/* <ListActions
          className="mr-md-auto mt-3 mt-lg-0"
          noPrint
          noFilter
          noSort
          actions={{
            excelExport: () => handleClickExportExl(exportKey),
          }}
        /> */}
      </div>

      <TopOfTable>
        <CheckAccess permission={LIST_CONTRACT}>
          <SelectType />
        </CheckAccess>
      </TopOfTable>

      <CheckAccess permission={LIST_CONTRACT}>
        <div className="flex mt-3">
          <span className="ml-2">فقط پروژه های جاری</span>
          <AppSwitch
            checked={filterByOngoing == true ? true : false}
            onChange={(e) => {
              setFilterByOngoing((curr) => !curr);
            }}
          />
        </div>
        <Table
          data={filterOutOnGoings()}
          loading={loading}
          getList={handleGetList}
          onSelection={handleOnSelection}
          setLoading={setLoading}
        />
      </CheckAccess>
    </>
  );
}
