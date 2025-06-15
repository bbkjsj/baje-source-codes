import React, { useState } from "react";

export const LayoutContext = React.createContext({
  drawerVisible: false,
  contractTypeTab: "main",
  toggleDrawer: () => {},
  setContractTab: () => {},
  tablePage: 1,
  setTablePage: () => {},
  lastItemUpdated: null,
  setLastItemUpdated: () => {},
  disableHeaderSelects: false,
  setDisableHeaderSelects: () => {},
  hideMainHeader: false,
  setHideMainHeader: () => {},
});

const LayoutContextProvider = (props) => {
  const [hideMainHeader, setHideMainHeader] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [contractTypeTab, setContractTab] = useState("main");
  const [tablePage, setTablePage] = useState(1);
  const [lastItemUpdated, setLastItemUpdated] = useState();
  const [disableHeaderSelects, setDisableHeaderSelects] = useState(false);

  const toggleDrawer = () => {
    setDrawerVisible((preState) => {
      return !preState;
    });
  };

  return (
    <LayoutContext.Provider
      value={{
        drawerVisible,
        toggleDrawer,
        contractTypeTab,
        setContractTab,
        setTablePage,
        tablePage,
        lastItemUpdated,
        setLastItemUpdated,
        disableHeaderSelects,
        setDisableHeaderSelects,
        hideMainHeader,
        setHideMainHeader,
      }}
    >
      {props.children}
    </LayoutContext.Provider>
  );
};

export default LayoutContextProvider;
