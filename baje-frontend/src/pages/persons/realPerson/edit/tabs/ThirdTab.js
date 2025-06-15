import React from "react";
import { Row } from "antd";
import { thirdTab } from "../inputsList";
import { RenderInputs } from "../../../../../components/renderInput/RenderInputs";

const ThirdTab = (props) => {
  return (
    <>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <RenderInputs inputsFiled={thirdTab} />
      </Row>
    </>
  );
};

export default ThirdTab;
