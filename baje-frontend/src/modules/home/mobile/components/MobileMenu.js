import React from "react";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import items from "utils/sidebarItems";
import MobileMenuItem from "./MobileMenuItem";
import { NewContext } from "contex/New-Context";
import { pageNames } from "constant";
import { HomeOutlined, LogoutOutlined } from "@ant-design/icons";

const MobileMenu = ({ setShowDrawer }) => {
  const history = useHistory();
  const newContext = useContext(NewContext);

  // items loop
  const menuItems = items().map((i, idx) => {
    if (!i.hidden) {
      return (
        <MobileMenuItem
          key={idx}
          icon={i.icon}
          title={i.title}
          link={i.link}
          items={i.items}
          gold={i.top || false}
          setShowDrawer={setShowDrawer}
        />
      );
    }
  });

  return (
    <>
      {/* <MobileMenuItem
        title="خانه"
        icon={<HomeOutlined />}
        onClick={() => {
          history.replace("/mobile-home");
          if (setShowDrawer) {
            setShowDrawer(false);
          }
        }}
      /> */}
      {menuItems}
      <MobileMenuItem
        title="خروج"
        icon={<LogoutOutlined />}
        onClick={() => {
          newContext.signOut();
          history.replace(pageNames.auth.login);
          if (setShowDrawer) {
            setShowDrawer(false);
          }
        }}
      />
    </>
  );
};

export default MobileMenu;
