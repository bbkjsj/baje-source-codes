import React, { useContext, useState } from "react";
import LogoLoading from "components/general/LoadingLogo";
import Table from "./socialInsuranceErrors/Table";
import { useGetSocialInsuranceErrors } from "./util/hooks";
import { useParams } from "react-router-dom";

const SocialInsuranceErrors = () => {
  const routeParams = useParams();
  const { loading, data } = useGetSocialInsuranceErrors(routeParams.id);

  console.log("data", data);

  if (loading) {
    return <LogoLoading />;
  }

  return (
    <>
      {/* <GoBackBtn /> */}

      <Table data={data} />
    </>
  );
};

export default SocialInsuranceErrors;
