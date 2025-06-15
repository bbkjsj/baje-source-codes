import React, { useState, useEffect, useContext } from "react";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import Table from "./socialInsuranceList/Table";
import SocialInsuranceAdd from "./SocialInsuranceAdd";
import { getLink } from "_helpers";
import { _PUT_STATUS } from "./util/api";
import { message, Modal } from "antd";
import { handleErrorMessage, handleClickExportExl } from "_helpers";
import SocialInsuranceTotal from "./SocialInsuranceTotal";
import { disket } from "./prints/TablesCols";
import { _POST_GET_DISKET } from "./util/api";
import { notification } from "antd";
import SocialInsuranceCompare from "./SocialInsuranceCompare";
import ListActions from "components/general/ListActions";
import ContentTop from "components/general/ContentTop";
import InsuranceDBF from "./components/InsuranceDBF";
import { useGetSocialInsuranceList } from "./util/hooks";
import { LayoutContext } from "contex/Layout-context";
import DetailsModal from "./socialInsuranceList/DetailsModal";
import EditModal from "./socialInsuranceList/EditModal";
import { useLocation } from "react-router-dom";
import { CheckAccess } from "AuxComponent/CheckAccess";
import { permission } from "json/Permission";
import { pageNames } from "constant";
import { useDispatch } from "react-redux";
import { setCurrentContract } from "store/action/currentContract";

const SocialInsuranceList = () => {
  const dispatch = useDispatch();
  const layoutContext = useContext(LayoutContext);
  const {
    getList,
    loading: listLoading,
    setLoading,
    data: insuranceList,
    exportKey,
    setExportKey,
  } = useGetSocialInsuranceList();

  const [selectedRow, setSlectedRow] = useState([]);
  const [totalListModal, setTotalListModal] = useState(false);
  const [selectedRowInfo, setSelectedRowInfo] = useState([]);
  const [compareTwoListModal, setCompareTwoListModal] = useState(false);
  const [dbfListModal, setDbfListModal] = useState(false);
  const [currentDbfId, setCurrentDbfId] = useState(null);

  const [disketLoading, setDisketLoading] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [singleInsurance, setSingleInsurance] = useState({});

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const contractId = query.get("contract");

  const menuBtnList = [
    {
      url: selectedRowInfo.length
        ? getLink(pageNames.personnel.insurance.tamin.payment.list, {
            contractID: selectedRowInfo[0].contract_id_fk,
            insuranceID: selectedRowInfo[0].id,
          })
        : null,

      label: "وضعیت پرداختی",
      id: "payment",
      disabled: selectedRowInfo.length !== 1,
    },
    {
      handleClick: () => setTotalListModal(true),
      label: "جمع لیست",
      id: "totalList",
    },
    // {
    //   handleClick: () => setCompareTwoListModal(true),
    //   label: "مقایسه لیست",
    //   id: "comparisonList",
    // },

    // {
    //   handleClick: () => setDbfListModal(true),
    //   label: "فایل لیست dbf",
    //   id: "dbfList",
    // },
    // {
    //   handleClick: () => {
    //     const printLink = getLink(
    //       pageNames.personnel.insurance.tamin.print,
    //       selectedRow[0]
    //     );
    //     window.open(printLink, "_blank");
    //   },
    //   label: "پرینت لیست",
    //   id: "printlist",
    //   disabled: selectedRow.length !== 1,
    // },
    // {
    //   handleClick: () => getDisket(selectedRow[0]),
    //   label: "چاپ رسید دیسکت",
    //   id: "disket",
    //   disabled: selectedRow.length !== 1,
    //   loading: disketLoading,
    // },
    // {
    //   handleClick: () => getFile(selectedRow[0]),
    //   // url: pageNames.personnel.insurance.supplymentary.add,
    //   label: "دریافت تعهدات بیمه",
    //   id: "getrthrt",
    //   disabled: selectedRow.length !== 1,
    //   loading: fileLoading,
    // },
    // {
    //   handleClick: () => getExcelList(),
    //   label: "گزارش لیست جامع اطلاعات",
    //   id: "getExcel",
    //   //disabled: selectedRow.length !== 1,
    //   loading: excelLoading,
    // },
    // {
    //   handleClick: () => setAddGroupModal(true),
    //   label: "ورود گروهی کسورات بیمه",
    //   id: "getExcel",
    // },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRow) => {
      setSlectedRow(selectedRowKeys);
      setSelectedRowInfo(selectedRow);
    },
  };

  async function getDisket(id) {
    try {
      setDisketLoading(true);
      const res = await _POST_GET_DISKET({ id });
      setDisketLoading(false);
      if (res.data.id) {
        const printLink = getLink(
          pageNames.personnel.insurance.tamin.printDisket,
          res.data.id
        );
        window.open(printLink, "_blank");
      }
    } catch (err) {
      setDisketLoading(false);
      notification.error({
        message: "عملیات ناموفق، لطفا مجددا تلاش کنید",
      });
      console.log(err);
    }
  }

  const onViewHandler = (record) => {
    const data = insuranceList.find((el) => el.id === record.id);
    setSingleInsurance(data);
    setDetailsVisible(true);
  };

  const onEditHandler = (record) => {
    const data = insuranceList.find((el) => el.id === record.id);

    setSingleInsurance(data);
    setEditVisible(true);
  };

  useEffect(() => {
    if (contractId) dispatch(setCurrentContract(contractId | 0));
    layoutContext.setDisableHeaderSelects(false);
  }, []);

  if (listLoading) {
    return <LogoLoading />;
  }
  return (
    <>
      <EditModal
        insurance={singleInsurance}
        visible={editVisible}
        setVisible={setEditVisible}
        getList={getList}
      />
      <DetailsModal
        insurance={singleInsurance}
        visible={detailsVisible}
        setVisible={setDetailsVisible}
        getList={getList}
        onEditHandler={onEditHandler}
      />
      <InsuranceDBF
        visible={dbfListModal}
        setVisible={setDbfListModal}
        listId={currentDbfId}
      />

      <SocialInsuranceTotal
        insuranceList={insuranceList}
        modalVisible={totalListModal}
        onCancel={() => setTotalListModal(false)}
      />

      <Modal
        visible={compareTwoListModal}
        onCancel={() => setCompareTwoListModal(false)}
        footer={null}
        title="مقایسه دو لیست"
      >
        <SocialInsuranceCompare
          closeModal={() => setCompareTwoListModal(false)}
        />
      </Modal>

      <ContentTop noBack title="لیست بیمه تامین اجتماعی" />
      <div className="w-100 flex-wrap align-center">
        <MenuInlineBtn list={menuBtnList} />
        <CheckAccess permission={permission.SOCIAL_INSURANCE_LIST_EXCEL_EXPORT}>
          <ListActions
            className="mr-md-auto mt-3 mt-lg-0"
            noPrint
            noFilter
            noSort
            actions={{
              excelExport: () => handleClickExportExl(exportKey),
            }}
          />
        </CheckAccess>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <SocialInsuranceAdd data={insuranceList} updateList={getList} />
      </div>

      <Table
        data={insuranceList}
        updateList={getList}
        rowSelection={rowSelection}
        selectedRow={selectedRow}
        setSelectedRow={setSlectedRow}
        setLoading={setLoading}
        onDbfModal={(id) => {
          setCurrentDbfId(id);
          setDbfListModal(true);
        }}
        onViewHandler={onViewHandler}
        onEditHandler={onEditHandler}
      />
    </>
  );
};

export default SocialInsuranceList;
