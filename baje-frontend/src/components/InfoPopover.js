import React from "react";
import { Popover } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const InfoPopover = ({ placement = "top", children }) => {
  return (
    <Popover placement={placement} content={<span>{children}</span>}>
      <QuestionCircleOutlined
        className="mr-1 text-16"
        style={{ cursor: "help" }}
      />
    </Popover>
  );
};

export default InfoPopover;
