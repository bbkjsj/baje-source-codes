import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router";
import { message } from "antd";
import { LayoutContext } from "contex/Layout-context";
import * as api from "./api";
import { allowedContractsTypes } from "modules/dashboard/const";
import { useSelector } from "react-redux";
import { GET_LIST } from "modules/contracts/utils/api";

export const useGetContarctList = (
  type,
  searchForm,
  setDisableContractList
) => {
  const currentOffice = useSelector((state) => state.currentOffice);
  const { setDisableHeaderSelects } = useContext(LayoutContext);
  //
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [contractList, setContractList] = useState([]);
  //
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const c_id = query.get("contract");

  useEffect(() => {
    if (currentOffice === "-1") {
      message.error("شما میبایست ابتدا یک شرکت انتخاب کنید ");
      setLoading(false);
    } else
      (async function () {
        setLoading(true);
        try {
          const payload = {
            type,
            id: currentOffice,
          };
          if (type === allowedContractsTypes.production) {
            payload.activity = "mineral";
          }
          const res = await GET_LIST(payload);
          setLoading(false);
          if (res?.data) {
            // console.log(
            //   res.data.map((el) => el.id),
            //   "!c"
            // );
            setContractList(res.data);
          }
        } catch (error) {
          setLoading(false);
          message.error("دریافت لیست قراردادها با مشکل مواجه شد!");
        }
      })();
  }, [currentOffice]);

  useEffect(() => {
    if (c_id) {
      searchForm.setFieldsValue({
        contarct_id: c_id,
      });

      setDisableHeaderSelects(true);
      setDisableContractList(true);
      searchForm.submit();
      setHidden(true);
    } else {
      // console.log(c_id, "!no");
    }

    return () => {
      if (searchForm) {
        searchForm.resetFields();
        setDisableHeaderSelects(false);
        setDisableContractList(false);
        setHidden(false);
      }
    };
  }, []);

  return {
    contractList,
    loading,
    hidden,
    c_id,
    setLoading,
  };
};
