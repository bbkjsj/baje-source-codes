import React, { useContext, useContexts } from "react";
import { Radio } from "antd";
import { LayoutContext } from "contex/Layout-context";

export const SelectType = (props) => {
  const layoutContext = useContext(LayoutContext);

  return (
    <Radio.Group
      defaultValue={layoutContext.contractTypeTab}
      buttonStyle="solid"
      onChange={(e) => layoutContext.setContractTab(e.target.value)}
      className="mt-4"
    >
      <Radio.Button value="main">قراردادهای اصلی</Radio.Button>
      <Radio.Button value="sub">قراردادهای فرعی</Radio.Button>
    </Radio.Group>
  );
};
