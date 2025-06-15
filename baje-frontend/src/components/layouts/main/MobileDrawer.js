import React from "react";
import MobileMenu from "modules/home/mobile/components/MobileMenu";
import styled from "styled-components";

function MobileDrawer({ show, setShowDrawer }) {
  return (
    <StyledDrawer className="mobile-drawer" show={show}>
      <MobileMenu setShowDrawer={setShowDrawer} />
    </StyledDrawer>
  );
}

//css
const StyledDrawer = styled.div`
  position: fixed;
  height: calc(100% - 56px);
  width: 90%;
  top: 0;
  right: ${(props) => (props.show ? "0%" : "-100%")};
  transition: all 0.3s ease;
  background: white;
  padding: 16px;
  overflow-y: auto;
  box-shadow: -5px 0px 50px 0px rgba(0, 0, 0, 0.4);
  z-index: 1;
`;

export default MobileDrawer;
