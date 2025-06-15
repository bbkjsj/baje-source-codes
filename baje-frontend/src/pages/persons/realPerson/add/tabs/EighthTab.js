import React from "react";
import { Row, Button } from "antd";
import { eightTab } from "../inputsList";
import { RenderInputs } from "../../../../../components/renderInput/RenderInputs";
import FormItem from "../../../../../components/renderInput/formItem/FormItem";
import SubmitBtn from "../../../../../components/general/SubmitBtn";

const EighthTab = (props) => {
  return (
    <>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <RenderInputs inputsFiled={eightTab} />
      </Row>
    </>
  );
};

export default EighthTab;
