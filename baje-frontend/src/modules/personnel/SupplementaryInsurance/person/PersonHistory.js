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

const PersonHistory = ({ match }) => {
  const history = useHistory();
  const personId = match.params.id;
  const insuranceID = match.params.insuranceID;
  const personName = match.params.personName;
  const { data, loading } = useGetPersonHistory(personId, "takmili");

  if (loading) {
    return <LogoLoading />;
  }

  let dataWithName = data.map((item) => ({
    ...item,
    personName: personName.trim(),
  }));
  console.info(dataWithName);

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="سوابق بیمه تکمیلی"
        className="mt-3"
        breadcrumbItems={[
          {
            text: "بیمه تکمیلی ",
            link: pageNames.personnel.insurance.supplymentary.list,
          },
          {
            text: "لیست افراد قرارداد",
            link: getLink(
              pageNames.personnel.insurance.supplymentary.personnel.list,
              insuranceID
            ),
          },
          { text: "سوابق بیمه تکمیلی " },
        ]}
      />

      <Table data={dataWithName} updateList={() => console.log("log")} />
    </>
  );
};

export default withRouter(PersonHistory);
