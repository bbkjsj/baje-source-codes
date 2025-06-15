import React, { useContext, useState } from "react";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import {
  useAccidentInsuranceGet,
  useAccidentInsuranceGetFile,
} from "./util/hooks";
import Table from "./accidentInsuranceList/Table";
import { AccidentInsuranceContext } from "modules/personnel/AccidentInsurance/util/AccidentInsuranceContext";
import { _GET_ExcelReport } from "./util/api";
import { notification } from "antd";
import { downloadExcelFromRawData, handleClickExportExl } from "_helpers";
import DeductionAddGroup from "./DeductionAddGroup";
import { Modal, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ContentTop from "components/general/ContentTop";
import ListActions from "components/general/ListActions";
import { pageNames } from "constant";

const AccidentInsuranceList = () => {
  const { loading, getList, exportKey, data } = useAccidentInsuranceGet();
  const { getFile, loading: fileLoading } = useAccidentInsuranceGetFile();
  const [selectedRow, setSleetedRow] = useState([]);
  const insuranceContext = useContext(AccidentInsuranceContext);
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSleetedRow(selectedRowKeys);
    },
  };
  const [excelLoading, setExcelLoading] = useState(false);
  const [resultModal, setResultModal] = useState(false);
  const [resultList, setResultList] = useState([]);
  const [addGroupModal, setAddGroupModal] = useState(false);

  if (loading) {
    return <LogoLoading />;
  }

  console.log("eopjge", selectedRow);

  const menuBtnList = [
    {
      url: pageNames.personnel.insurance.accident.add,
      label: "بیمه نامه جدید",
      id: "AccidentInsuranceAdd",
      variant: "primary",
      icon: <PlusOutlined />,
    },

    {
      handleClick: () => getFile(selectedRow[0]),
      // url: pageNames.personnel.insurance.accident.add,
      label: "دریافت تعهدات بیمه",
      id: "getrthrt",
      disabled: selectedRow.length !== 1,
      loading: fileLoading,
    },
    {
      handleClick: () => getExcelList(),
      label: "گزارش لیست جامع اطلاعات",
      id: "getExcel",
      //disabled: selectedRow.length !== 1,
      loading: excelLoading,
    },
    {
      handleClick: () => setAddGroupModal(true),
      label: "ورود گروهی کسورات بیمه",
      id: "getExcel",
    },
  ];

  // get and download insurance members info as an excel file
  async function getExcelList() {
    setExcelLoading(true);
    try {
      const response = await _GET_ExcelReport();
      setExcelLoading(false);
      if (response) {
        console.log("excel:", response.data);
        downloadExcelFromRawData(response.data, "report");
      } else {
        notification.warning({
          message: "عملیات ناموفق",
        });
      }
    } catch (err) {
      console.error(err);
      setExcelLoading(false);
      notification.warning({
        message: "عملیات ناموفق",
      });
    }
  }

  const results = resultList.map((i, idx) => {
    if (i.message && i.message !== "ثبت شد") {
      return (
        <p key={"result-" + idx}>
          <span>ردیف {i.index}: </span>
          <span>{i.message || "-"}</span>
        </p>
      );
    }
  });

  return (
    <>
      <ContentTop
        noBack
        title="لیست بیمه عمر و حادثه"
        className="mt-3"
        // breadcrumbItems={[
        //   { text: "منابع انسانی" },
        //   { text: "افراد حقوقی" },
        //   { text: "بیمه تکمیلی و حوادث" },
        // ]}
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
      <Table
        data={data}
        updateList={getList}
        rowSelection={rowSelection}
        selectedRow={selectedRow}
      />

      <Modal
        visible={addGroupModal}
        onCancel={() => setAddGroupModal(false)}
        footer={null}
        title="ورود گروهی کسورات بیمه"
      >
        <DeductionAddGroup
          setModal={(modal) => setResultModal(modal)}
          setList={(list) => setResultList(list)}
        />
      </Modal>

      <Modal
        visible={resultModal}
        closable={false}
        title=" خطاهای اظافه کردن گروهی کسورات"
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={() => window.location.reload(false)}
          >
            تایید
          </Button>,
        ]}
      >
        <div>{results}</div>
      </Modal>
    </>
  );
};

export default AccidentInsuranceList;
