import React, { useState } from "react";
import styled from "styled-components";
import chevronLeftBlue from "assets/images/icons/checvron-left-blue.svg";
import chevronLeftBrown from "assets/images/icons/checvron-left-brown.svg";
import { useHistory } from "react-router-dom";
import MobileMenuSubItem from "./MobileMenuSubItem";

const MobileMenuItem = ({
  title,
  icon,
  items = [],
  gold,
  link,
  onClick,
  setShowDrawer,
}) => {
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const handleItemClick = () => {
    if (onClick) {
      onClick();
    } else {
      if (link) {
        history.push(link);
        if (setShowDrawer) {
          setShowDrawer(false);
        }
      } else {
        setOpen(open ? false : true);
      }
    }
  };

  const subItems = items.map((i, idx) => {
    if (!i.hidden) {
      return (
        <MobileMenuSubItem
          key={idx}
          icon={i?.icon}
          title={i?.title}
          link={i?.link}
          items={i?.items}
          gold={gold}
          setShowDrawer={setShowDrawer}
        />
      );
    }
  });

  return (
    <MenuItemContainer
      className={`menu-item fade-in ${gold && "gold"} ${
        !items.length && "single"
      }`}
    >
      <div className="flex menu-item--top" onClick={handleItemClick}>
        {icon && icon}
        <span className="text-14 text-mid-black mr-2 text-medium">{title}</span>
        <img
          src={gold ? chevronLeftBrown : chevronLeftBlue}
          width="6"
          className={`menu-item--arrow mr-auto ${open && "open"}`}
        />
      </div>

      {open && <div className="menu-item--items mt-2 pr-2">{subItems}</div>}
    </MenuItemContainer>
  );
};

// css
const MenuItemContainer = styled.div`
  background-color: white;
  padding: 10px 12px;
  box-shadow: 1px 0px 4px rgba(22, 25, 49, 0.1);
  border: 1px solid #7dafdd;
  border-radius: 12px;
  width: 100%;
  margin-bottom: 8px;
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;

  &.single:active {
    background-color: #f6f6f6;
  }

  &.gold {
    border: 1px solid rgba(243, 161, 50, 0.6);
    box-shadow: 2px 0px 4px rgba(22, 25, 49, 0.15);
  }

  .menu-item {
    &--arrow {
      transform: rotate(0deg);
      transition: all 0.2s linear;
      transform-origin: center center;
      &.open {
        transform: rotate(90deg);
      }
    }

    &--top {
      & > .anticon {
        font-size: 18px;
        color: #f3a132;
      }
    }
  }

  .menu-sub-item {
    &:last-of-type {
      padding-bottom: 0px;
      border-bottom: none;
    }
  }
`;

export default MobileMenuItem;
