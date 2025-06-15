import React, { useContext, useState, useEffect } from "react";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import {
  useSupplementaryInsuranceGet,
  useSupplementaryInsuranceGetFile,
} from "./util/hooks";
import Table from "./supplementaryInsuranceList/Table";
import SupplementaryInsuranceDetail from "./SupplementaryInsuranceDetail";
import { _GET_ExcelReport } from "./util/api";
import { notification } from "antd";
import { downloadExcelFromRawData, handleClickExportExl } from "_helpers";
import DeductionAddGroup from "./DeductionAddGroup";
import { Modal, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ContentTop from "components/general/ContentTop";
import ListActions from "components/general/ListActions";
import moment from "moment-jalaali";
import { getServerDateTime } from "utils/api";
import { pageNames } from "constant";
import useCheckAccess from "hooks/useCheckAccess";
import { permission as permissions } from "json/Permission";

const SupplementaryInsuranceList = () => {
  const { loading, getList, exportKey, data } = useSupplementaryInsuranceGet();
  const { getFile, loading: fileLoading } = useSupplementaryInsuranceGetFile();
  // let fromDate =
  // const serverDate = await getServerDateTime();
  // if (fromDate.isBefore(serverDate.data.date, "day")) {

  const [selectedRow, setSleetedRow] = useState([]);
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSleetedRow(selectedRowKeys);
    },
  };
  const [excelLoading, setExcelLoading] = useState(false);
  const [resultModal, setResultModal] = useState(false);
  const [resultList, setResultList] = useState([]);
  const [addGroupModal, setAddGroupModal] = useState(false);
  const [serverDate, setServerDate] = useState();
  const [detailView, setDetailView] = useState(false);
  const [detailId, setDetailId] = useState(-1);

  const checkAccess = useCheckAccess();

  useEffect(() => {
    (async function () {
      const time = await getServerDateTime();
      setServerDate(time.data.date);
    })();
  }, []);

  useEffect(() => {
    if (!detailView && detailId > -1) {
      setDetailView(true);
    }
  }, [detailId]);

  const handleDetail = (id) => {
    setDetailId(id);
  };

  if (loading || !serverDate) {
    return <LogoLoading />;
  }

  console.log("eopjge", selectedRow);

  const menuBtnList = [
    {
      url: pageNames.personnel.insurance.supplymentary.add,
      label: "بیمه نامه جدید",
      id: "SupplementaryInsuranceAdd",
      variant: "primary",
      icon: <PlusOutlined />,
      hidden: !checkAccess([permissions.SUPPLEMENTARY_CREATE]),
    },

    {
      handleClick: () => getFile(selectedRow[0]),
      // url: pageNames.personnel.insurance.supplymentary.add,
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
      disabled: selectedRow.length !== 1,
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
        title="لیست بیمه تکمیلی"
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
        detailView={handleDetail}
        data={data}
        updateList={getList}
        rowSelection={rowSelection}
        selectedRow={selectedRow}
        rowClassName={(record, index) => {
          let toDate = moment(record["to_date"], "YYYY/MM/DD");
          if (toDate.isAfter(serverDate, "day")) return "bg-active";
          else return "bg-diactive";
        }}
        setSelectedRow={setSleetedRow}
      />

      <Modal
        visible={detailView}
        width={820}
        onCancel={() => setDetailView(false)}
        footer={null}
        title="جزئیات"
      >
        <SupplementaryInsuranceDetail
          id={detailId}
          closeModal={() => {
            setDetailView(false);
          }}
        />
      </Modal>

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

export default SupplementaryInsuranceList;
