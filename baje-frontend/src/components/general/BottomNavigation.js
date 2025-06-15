import { useEffect, useState } from "react";
import styled from "styled-components";
import React from "react";
import PropTypes from "prop-types";
import bp from "utils/breakpoints";

/**
 *BottomNavigation: a footer menu displayed in mobile layout View
 * @param {object} props component's all props
 * @param {array<{title:string,onClick:function,icon:React.FC , activeIcon:React.FC}>} props.items nav items
 * @param {number} props.defaultTab the number of default active tab
 * @returns
 */

const BottomNavigation = ({ items, defaultTab }) => {
  const [current, setCurrent] = useState(defaultTab || null);

  const navItems = items.map((item, idx) => {
    return (
      <div
        key={"nav-item-" + idx}
        id={"nav-item-" + idx}
        className={`bottom-nav-item ${current === idx && "active"}`}
        onClick={() => {
          if (item.onClick) {
            item.onClick();
          }
          setCurrent(idx);
        }}
      >
        {(current !== idx && item.icon) || ""}
        {current === idx && item.activeIcon}
        {item.title && (
          <p
            className={`bottom-nav-item--title ${
              current === idx ? "text-white" : "text-light-black"
            }`}
          >
            {item.title}
          </p>
        )}
      </div>
    );
  });
  return <StyledNav className="bottom-navigation">{navItems}</StyledNav>;
};

// types
BottomNavigation.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      onClick: PropTypes.func,
      icon: PropTypes.element,
      activeIcon: PropTypes.element,
      title: PropTypes.string,
    })
  ),
  defaultTab: PropTypes.number,
  onChange: PropTypes.func,
};

// css
const StyledNav = styled.div`
  position: fixed;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 5px 0px;
  bottom: 0;
  right: 0;
  background-color: white;
  z-index: 3;
  height: 56px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);

  .bottom-nav-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    width: 42px;
    height: 42px;
    cursor: pointer;

    &.active {
      background-color: ${({ theme }) => theme.primary};
      color: white;
    }
  }

  .bottom-nav-item--title {
    padding-top: 3.5px;
    font-size: 10px;
    margin-bottom: 0px !important;
  }

  @media (min-width: ${bp.lg}) {
    display: none;
  }
`;

export default BottomNavigation;
