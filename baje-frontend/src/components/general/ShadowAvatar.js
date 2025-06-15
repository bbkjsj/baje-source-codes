import { Avatar } from "antd";
import styled from "styled-components";
import { UserOutlined } from "@ant-design/icons";
import React from "react";

/**
 *
 * @param {object} params - all component props
 * @returns
 */

const ShadowAvatar = (props) => {
  return (
    <StyledAvatar
      {...props}
      src={props.src}
      icon={<UserOutlined />}
      shape="square"
    >
      {props.children}
    </StyledAvatar>
  );
};

ShadowAvatar.propTypes = Avatar.propTypes;

// css
const StyledAvatar = styled(Avatar)`
  box-shadow: 0px 2px 8px rgba(22, 25, 49, 0.15);
  border-radius: 4px;
  border: 2px solid #ffffff;
`;

export default ShadowAvatar;
