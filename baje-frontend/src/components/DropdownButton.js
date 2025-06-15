import React, { useRef, useState } from "react";
import styled from "styled-components";
import { Button, Select } from "antd";
import { DownOutlined } from "@ant-design/icons";

const DropdownButton = (props) => {
  const selectBox = useRef();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <Container>
      <Button
        icon={props.icon}
        className="dropdown-trigger"
        onClick={(e) => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>{props.children}</span>
          <DownOutlined style={{ marginRight: "6px", fontSize: "0.9em" }} />
        </div>
      </Button>
      <Select
        dropdownMatchSelectWidth={false}
        mode="multiple"
        ref={selectBox}
        open={isDropdownOpen}
        tagRender={(props) => <div />}
        {...props}
      >
        {props.items.map((item) => (
          <Select.Option key={item.value} value={item.value}>
            {item.title}
          </Select.Option>
        ))}
      </Select>
    </Container>
  );
};

const Container = styled("div")`
  margin-bottom: 6px;
  .ant-select-selector {
    box-sizing: border-box;
    width: 0;
    height: 10px;
    overflow: hidden;
  }

  .dropdown-trigger {
    position: relative;
    top: 14px;
    z-index: 3;
  }
`;

export default DropdownButton;
