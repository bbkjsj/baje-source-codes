import React from "react";
import { message } from "antd";
import axios from "api/appAxios";
import { getLink, notice } from "../_helpers";
import { useSelector, useDispatch } from "react-redux";

//
import { setToken } from "../store/action/token";
import { setSuggestToken } from "../store/action/suggestToken";
import { setUser } from "../store/action/user";
import { setCurrentOffice } from "../store/action/currentOffice";
import { setCurrentContract } from "../store/action/currentContract";

import { setContractList } from "../store/action/contractList";
import { setOfficeLogo } from "store/action/officeLogo";
import { setLastSuggestFilter } from "store/action/lastSuggestFilter";
//
import { useHistory } from "react-router-dom";
import { pageNames } from "constant";
import { GET_LIST } from "modules/contracts/utils/api";
import useWhoAmI from "hooks/useWhoAmI";
import { useState } from "react";

export const NewContext = React.createContext({
  signIn: () => {},
  signOut: () => {},
  getContractList: () => {},
  getInfo: () => {},
  fetchUserInfo: () => {},
  isPublicSuggestion: () => {},
});

function NewContextProvider({ children }) {
  const dispatch = useDispatch();
  const currentOffice = useSelector((state) => state.currentOffice);
  const history = useHistory();
  const [data, setData] = useState();

  //

  //
  const signIn = async (data) => {
    signOut();
    if (data.user) {
      dispatch(setToken(data.token));
      dispatch(setUser(data.user));
      dispatch(setCurrentContract("-1"));
      dispatch(setCurrentOffice("-1"));
      const officeId = data.user?.defaultCompany ?? "-1";
      getContractList();
      await getInfo();
    } else {
      dispatch(setSuggestToken(data.token));
      data["token"] && delete data["token"];
      dispatch(setUser(data));
      setData(data);
    }

    notice(data);
  };
  //
  const signOut = () => {
    dispatch(setToken(""));
    dispatch(setSuggestToken(""));
    dispatch(setCurrentOffice(""));
    dispatch(setCurrentContract(""));
    dispatch(setUser(""));
    dispatch(setOfficeLogo(""));
    dispatch(setLastSuggestFilter(""));

    if (
      !window.location.href.includes(pageNames.suggest.auth.intro) &&
      !window.location.href.includes(getLink(pageNames.suggest.auth.signUp)) &&
      !window.location.href.includes(getLink(pageNames.auth.login))
    )
      window.location.href = pageNames.auth.login;
  };

  const getContractList = (
    officeID,
    fullContractList = null,
    notSet = false
  ) => {
    // let list = fullContractList ? fullContractList : user?.contract;

    // if (list) {
    //   let contractList = null;

    //   if (officeID >= 0) {
    //     //// if one company is selected in header then get one company's contracts to show in header
    //     contractList = list.filter(
    //       (item) => parseInt(item.company_id) === parseInt(officeID)
    //     );
    //   } else {
    //     //// if no company is selected in header then dispaly all the user's contracts in the header
    //     contractList = list;
    //   }

    //   if (contractList && !notSet) {

    GET_LIST({
      id: "-1",
      type: "main",
    }).then((res) => {
      dispatch(setContractList(res.data));
    });
    // } else if (contractList && notSet) {
    //   return contractList;
    // }
  };
  //
  const fetchUserInfo = () => {
    axios
      .get("/api/v1/baje/auth/who-am-i")
      .then((res) => {
        if (res.status == 401) {
          signOut();
          return;
        }
        const officeId = currentOffice || "-1";

        dispatch(setUser(res.data));
        getContractList(officeId, res.data.contract);
      })
      .catch((error) => {
        if (error?.response?.status == 401) {
          signOut();
        } else {
          message.error("مشکلی پیش آمده است دوباره تلاش کنید");
        }
      });
  };
  //
  const getInfo = async () => Promise.all([fetchUserInfo()]);
  //
  const isPublicSuggestion = () => {
    return data && !data?.user;
  };
  //
  return (
    <NewContext.Provider
      value={{
        signIn,
        signOut,
        getContractList,
        getInfo,
        fetchUserInfo,
        isPublicSuggestion,
      }}
    >
      {children}
    </NewContext.Provider>
  );
}

export default NewContextProvider;
