import axios from "api/appAxios";
import React, { useState, useEffect } from "react";
import { notice } from "../_helpers";
import { sampleShift } from "../modules/personnel/shiftwork/data";

export const UserContext = React.createContext({
  userData: null,
  surveyAccess: null,
  suggestUserData: null,
  listLegal: null,
  currentOffice: null,
  contractList: [],
  shiftList: [],
  currentContract: null,
  setToken: () => {},
  removeToken: () => {},
  checkToken: () => {},
  getInfo: () => {},
  getLegal: () => {},
  setCurrentOffice: () => {},
  getContractList: () => {},
  getShiftList: () => {},
  setCurrentContract: () => {},
  setShiftWorkList: () => {},
  isPublicSuggestion: () => {},
  setContractList: () => {},
  setShiftList: () => {},
});

const UserContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [surveyAccess, setSurveyAccess] = useState();
  const [suggestUserData, setSuggestUserData] = useState(null);
  const [listLegal, setListLegal] = useState(null);
  const [currentOffice, setCurrentOffice] = useState();
  const [contractList, setContractList] = useState([]);
  const [shiftList, setShiftList] = useState([]);
  const [currentContract, setCurrentContract] = useState();

  const setToken = (data) => {
    if (data.user) {
      //setCurrentOffice(localStorage.getItem("office") || "-1");
      //setCurrentContract(localStorage.getItem("contract") || "-1");
      setUserData(data.user);
      setListLegal(data.user?.company);
      localStorage.setItem("token", data.token);
    } else if (data.fullname) {
      console.table(data);
      localStorage.setItem("token_suggest", data.token);
      data["token"] && delete data["token"];
      setSuggestUserData(data);
      localStorage.setItem("suggest_info", JSON.stringify(data));
    }

    notice(data);

    if (data.survey_access) setSurveyAccess(data.survey_access);
  };

  const getContractList = (
    officeID,
    fullContractList = null,
    notSet = false
  ) => {
    let list = fullContractList ? fullContractList : userData?.contract;

    if (list) {
      let contractList = null;

      if (officeID >= 0)
        contractList = list.filter(
          (item) => parseInt(item.company_id) === parseInt(officeID)
        );
      else contractList = list;

      if (contractList && !notSet) {
        setContractList(contractList);
      } else if (contractList && notSet) {
        return contractList;
      }
    }
  };

  const getShiftWorkList = (fullList = null) => {
    let list = fullList;

    if (list) {
      let shiftList = null;
      shiftList = list;
      setShiftList(shiftList);
    }
  };

  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (token) return true;
    else return false;
  };

  const removeToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token_suggest");
    localStorage.removeItem("suggest_info");
    localStorage.removeItem("last_suggest_cartable_filter");
    localStorage.removeItem("office");
    localStorage.removeItem("officeLogo");
    localStorage.removeItem("contract");
  };

  const isPublicSuggestion = () => {
    return userData?.fullname && !userData?.currentOffice;
  };

  const getLegal = async () => {
    try {
      const response = await axios.get("/api/admin/personnel/legal/list");
      setListLegal(response.data.list);
    } catch (err) {
      console.log(err.message);
      //throw new Error("somethings Wrong");
    }
  };

  const getShiftList = async () => {
    try {
      const res = await axios.get("/api/v1/baje/auth/who-am-i");

      getShiftWorkList(sampleShift);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const res = await axios.get("/api/v1/baje/auth/who-am-i");
      const officeId = localStorage.getItem("office") || "-1";

      setUserData(res.data);
      setListLegal(res.data.company);
      getShiftList();
      getContractList(officeId, res.data.contract);

      if (res.data.survey_access) setSurveyAccess(res.data.survey_access);
    } catch (error) {
      const suggestInfo = localStorage.getItem("suggest_info");

      if (suggestInfo) {
        setUserData(JSON.parse(suggestInfo));
      } else {
        // if (error?.response?.status === 401) localStorage.removeItem("token");
      }
    }
  };

  const getInfo = async () => Promise.all([fetchUserInfo()]);

  // if (!currentOffice || !currentContract) {
  //   let currOffice = localStorage.getItem("office") || "-1";
  //   let currContract = localStorage.getItem("contract") || "-1";

  //   if (currOffice > 0) currOffice = currOffice | 0;
  //   if (currContract > 0) currContract = currContract | 0;

  //   setCurrentOffice(currOffice);
  //   setCurrentContract(currContract);

  //   getInfo().then(() => getContractList(currOffice));
  // }

  return (
    <UserContext.Provider
      value={{
        setToken,
        checkToken,
        removeToken,
        userData,
        surveyAccess,
        getLegal,
        getInfo,
        listLegal,
        currentOffice,
        getShiftList,
        setCurrentOffice,
        getContractList,
        contractList,
        shiftList,
        currentContract,
        setCurrentContract,
        isPublicSuggestion,
        setContractList,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
