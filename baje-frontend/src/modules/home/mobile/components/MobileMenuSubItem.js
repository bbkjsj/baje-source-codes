import React, { useState } from "react";
import styled from "styled-components";
import chevronLeftBlue from "assets/images/icons/checvron-left-blue.svg";
import chevronLeftBrown from "assets/images/icons/checvron-left-brown.svg";
import { useHistory } from "react-router-dom";

const MobileMenuSubItem = ({
  title,
  items = [],
  gold,
  link,
  setShowDrawer,
}) => {
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const handleItemClick = () => {
    if (link) {
      history.push(link);
      if (setShowDrawer) {
        setShowDrawer(false);
      }
    } else {
      setOpen(open ? false : true);
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
    <MenuItemContainer className={`menu-sub-item fade-in ${gold && "gold"}`}>
      <div className="flex menu-item--top" onClick={handleItemClick}>
        <span className="text-14 text-mid-black mr-1 text-medium flex align-center">
          <span className="text-20 ml-2">•</span> {title}
        </span>
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
  padding: 8px 0px;
  width: 100%;
  border-bottom: 1px solid rgba(194, 0, 0, 0.05);

  &.gold {
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
`;

export default MobileMenuSubItem;
