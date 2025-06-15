import React, { useContext, useState } from "react";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import GoBackBtn from "components/GoBackBtn";
import Table from "./deductionsList/Table";
import { AccidentInsuranceContext } from "modules/personnel/AccidentInsurance/util/AccidentInsuranceContext";
import { Redirect, withRouter } from "react-router-dom";
import { getLink } from "_helpers";
import { useGetDeductions } from "./util/hooks";
import ContentTop from "components/general/ContentTop";
import { pageNames } from "constant";

const DeductionsList = ({ match }) => {
  const [selectedRow, setSleetedRow] = useState([]);
  const insuranceContext = useContext(AccidentInsuranceContext);
  const { insurance } = insuranceContext;
  const insuranceID = match.params.insuranceId;
  const userID = match.params.userId;
  const { data, loading, getList } = useGetDeductions(userID);

  if (!insurance) {
    return <Redirect to={pageNames.personnel.insurance.accident.list} />;
  }

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
        pageNames.personnel.insurance.accident.personnel.deducation.add,
        {
          insuranceId: insuranceID,
          userId: userID,
        }
      ),
      label: "اضافه کردن کسورات بیمه شخص",
      id: pageNames.personnel.insurance.accident.personnel.deducation.add,
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
            text: "لیست بیمه عمر و حادثه",
            link: pageNames.personnel.insurance.accident.list,
          },
          {
            text: "لیست افراد قرارداد",
            link: getLink(
              pageNames.personnel.insurance.accident.personnel.list,
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
