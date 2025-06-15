import React from "react";
import { Row } from "antd";
import { sixthTabTab } from "../inputsList";
import { RenderInputs } from "../../../../../components/renderInput/RenderInputs";

const SixthTab = (props) => {
  return (
    <>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <RenderInputs inputsFiled={sixthTabTab} />
      </Row>
    </>
  );
};

export default SixthTab;
