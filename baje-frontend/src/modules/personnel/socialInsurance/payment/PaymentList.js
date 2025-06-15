import React, { useContext, useState } from "react";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import GoBackBtn from "components/GoBackBtn";
import Table from "./paymentList/Table";
import PaymentAdd from "./PaymentAdd";
import { withRouter } from "react-router-dom";
import { useGetPayment } from "./util/hooks";
import ContentTop from "components/general/ContentTop";
import { pageNames } from "constant";

const PaymentList = ({ match }) => {
  const insuranceID = match.params.insuranceID;
  const { getList, data, loading, setLoading } = useGetPayment(insuranceID);

  const [selectedRow, setSleetedRow] = useState([]);
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSleetedRow(selectedRowKeys);
    },
  };

  if (loading) {
    return <LogoLoading />;
  }

  const menuBtnList = [
    // {
    //   url: pageNames.personnel.insurance.tamin.add,
    //   label: "ایجاد لیست",
    //   id: "socialInsurance",
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

  return (
    <>
      <GoBackBtn />

      <ContentTop
        title="لیست پرداختی های بیمه"
        className="mt-3"
        breadcrumbItems={[
          {
            text: "بیمه تامین اجتماعی",
            link: pageNames.personnel.insurance.tamin.list,
          },

          { text: "لیست پرداختی های بیمه" },
        ]}
      />

      <MenuInlineBtn list={menuBtnList} />
      <div style={{ marginBottom: "10px" }}>
        <PaymentAdd updateList={getList} />
      </div>

      <Table
        data={data}
        updateList={getList}
        rowSelection={rowSelection}
        selectedRow={selectedRow}
        setLoading={setLoading}
      />
    </>
  );
};

export default withRouter(PaymentList);
