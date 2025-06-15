import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import GoBackBtn from "./../../../components/GoBackBtn";
import { ContractContainer } from "./contractView/StyledComponents";
import { Row } from "antd";
import LoadingLogo from "../../../components/general/LoadingLogo";
import { getSingleContract } from "../utils/api";
import RenderField from "./contractView/RenderField";
import ContentTop from "components/general/ContentTop";
import { pageNames } from "constant";

const rowGutter = { xs: 8, sm: 16, md: 24, lg: 32 };

const ContractView = (props) => {
  const contractID = props.match.params.id;
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState();

  const handleError = () => {
    console.log("error");
  };

  useEffect(() => {
    getSingleContract(setContract, handleError, contractID, setLoading);
  }, []);

  if (loading) {
    return <LoadingLogo />;
  }

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="مشاهده قرارداد"
        breadcrumbItems={[
          {
            text: "قرارداد ها",
            link: pageNames.contract.list,
          },
        ]}
      />
      <ContractContainer>
        <Row gutter={rowGutter}>
          <RenderField data={contract} />
        </Row>
      </ContractContainer>
    </>
  );
};

export default withRouter(ContractView);
