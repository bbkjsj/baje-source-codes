import React from "react";
import styled from "styled-components";

const SidebarCustomIcon = ({ alt, src }) => {
  return <CustomIcon className="sidebar-custom-icon" src={src} alt={alt} />;
};

//css
const CustomIcon = styled.img`
  width: 17px;
`;

export default SidebarCustomIcon;
