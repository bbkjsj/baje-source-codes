import React, { useContext } from "react";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import GoBackBtn from "components/GoBackBtn";
import { withRouter, useHistory, Redirect } from "react-router-dom";
import Table from "./PersonHistory/Table";
import { useGetPersonHistory } from "./util/hooks";
import ContentTop from "components/general/ContentTop";
import { getLink } from "_helpers";
import { pageNames } from "constant";

const PersonList = ({ match }) => {
  const history = useHistory();
  const personId = match.params.id;
  const insuranceID = match.params.insuranceID;
  const { data, loading } = useGetPersonHistory(personId);
  //   const insuranceDetail = useContext(AccidentInsuranceContext);
  //   const { insurance } = insuranceDetail;

  //   if (!insurance) {
  //     return <Redirect to={pageNames.personnel.insurance.supplymentary.list} />;
  //   }

  if (loading) {
    return <LogoLoading />;
  }

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="سوابق بیمه تکمیلی و حادثه"
        className="mt-3"
        breadcrumbItems={[
          {
            text: "بیمه تکمیلی و حوادث",
            link: pageNames.personnel.insurance.accident.list,
          },
          {
            text: "لیست افراد قرارداد",
            link: getLink(
              pageNames.personnel.insurance.accident.personnel.list,
              insuranceID
            ),
          },
          { text: "سوابق بیمه تکمیلی و حادثه" },
        ]}
      />

      <Table data={data} updateList={() => console.log("log")} />
    </>
  );
};

export default withRouter(PersonList);
