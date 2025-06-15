import React, { useContext, useState } from "react";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import GoBackBtn from "components/GoBackBtn";
import Table from "./deductionsList/Table";
import { withRouter } from "react-router-dom";
import { getLink } from "_helpers";
import { useGetDeductions } from "./util/hooks";
import ContentTop from "components/general/ContentTop";
import { pageNames } from "constant";

const DeductionsList = ({ match }) => {
  const [selectedRow, setSleetedRow] = useState([]);

  const insuranceID = match.params.insuranceId;
  const userID = match.params.userId;
  const { data, loading, getList } = useGetDeductions(userID);

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSleetedRow(selectedRowKeys);
    },
  };

  if (loading) {
    return <LogoLoading />;
  }

  const menuBtnList = [
    {
      url: getLink(
        pageNames.personnel.insurance.supplymentary.personnel.deucation.add,
        {
          insuranceId: insuranceID,
          userId: userID,
        }
      ),
      label: "اضافه کردن کسورات بیمه شخص",
      id: pageNames.personnel.insurance.supplymentary.personnel.deucation.add,
      variant: "primary",
    },
  ];

  return (
    <>
      <GoBackBtn />

      <ContentTop
        title="کسورات بیمه"
        className="mt-3"
        breadcrumbItems={[
          // { text: "منابع انسانی" },
          {
            text: "لیست بیمه تکمیلی و حادثه",
            link: pageNames.personnel.insurance.supplymentary.list,
          },
          {
            text: "لیست افراد قرارداد",
            link: getLink(
              pageNames.personnel.insurance.supplymentary.personnel.list,
              insuranceID
            ),
          },
          { text: "کسورات بیمه" },
        ]}
      />

      <MenuInlineBtn list={menuBtnList} />
      <Table
        data={data}
        rowSelection={rowSelection}
        selectedRow={selectedRow}
        updateList={getList}
      />
    </>
  );
};

export default withRouter(DeductionsList);
