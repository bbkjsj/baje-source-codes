import React, { useState } from "react";
import { useGetAccidentReport } from "./utils/hooks";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import AccidentReportTable from "./accidentReportList/AccidentReportTable";
import GoBackBtn from "components/GoBackBtn";
import { PlusOutlined } from "@ant-design/icons";
import { handleClickExportExl } from "_helpers";
import ContentTop from "components/general/ContentTop";
import ListActions from "components/general/ListActions";
import { pageNames } from "constant";

const menuBtnList = [
  {
    url: pageNames.personnel.realPerson.accidentReport.add,
    label: "گزارش حادثه",
    id: "accident",
    variant: "primary",
    icon: <PlusOutlined />,
  },
];

const AccidentReportList = () => {
  const { list, loading } = useGetAccidentReport();
  const [exportKey, setExportKey] = useState();

  if (loading) {
    return <LogoLoading />;
  }

  return (
    <>
      <ContentTop
        noBack
        title="لیست حوادث"
        className="mt-3"
        // breadcrumbItems={[{ text: "منابع انسانی" }, { text: "حوادث" }]}
      />
      <div className="w-100 flex-wrap align-center mb-3">
        <MenuInlineBtn list={menuBtnList} />
        <ListActions
          className="mr-md-auto mt-lg-0"
          noPrint
          noFilter
          noSort
          actions={{
            excelExport: () => handleClickExportExl(exportKey),
          }}
        />
      </div>

      <AccidentReportTable data={list} />
    </>
  );
};

export default AccidentReportList;
