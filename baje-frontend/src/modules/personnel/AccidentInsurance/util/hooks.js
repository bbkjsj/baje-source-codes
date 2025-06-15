import { useState, useEffect, useContext } from "react";
import {
  _POST,
  _GET,
  _DELETE,
  _GET_BY_ID,
  _PUT,
  _GET_FILE,
  _GET_GENERAL_INFO,
} from "./api";
import { _GET as hasPerson } from "../person/util/api";
import { handleErrorMessage } from "_helpers";
import { message } from "antd";
import { useHistory } from "react-router-dom";
import { convertDataForm } from "./index";
import { AccidentInsuranceContext } from "modules/personnel/AccidentInsurance/util/AccidentInsuranceContext";
import { pageNames } from "constant";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

export const useAccidentInsuranceAdd = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const submit = async (data) => {
    try {
      setLoading(true);
      console.info("post data", data);
      await _POST(data);
      setLoading(false);
      message.success("با موفقیت انجام شد.");

      setTimeout(() => {
        history.go();
      }, 1000);
    } catch (error) {
      let msg = handleErrorMessage(error);
      setLoading(false);
      message.error(msg);
    }
  };

  return {
    submit,
    loading,
  };
};

export const useAccidentInsuranceEdit = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const submit = async (data, id) => {
    try {
      setLoading(true);
      await _PUT(data, id);
      message.success("با موفقیت انجام شد.");
      setLoading(false);
      history.push(pageNames.personnel.insurance.accident.list);
    } catch (error) {
      let msg = handleErrorMessage(error);
      setLoading(false);
      message.error(msg);
    }
  };

  return {
    submit,
    loading,
  };
};

export const useAccidentInsuranceGet = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [exportKey, setExportKey] = useState();
  const insuranceContext = useContext(AccidentInsuranceContext);
  const currentOffice = useSelector((state) => state.currentOffice);

  useEffect(() => {
    getList();
  }, [currentOffice]);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    try {
      let res = await _GET(currentOffice, "other");
      let accidentData = res?.data?.list;
      setData(accidentData);
      setExportKey(res?.data?.hash);
      insuranceContext.setInsuranceList(accidentData);
      setLoading(false);
    } catch (error) {
      let msg = handleErrorMessage(error);
      setLoading(false);
      message.error(msg);
    }
  };

  return {
    getList,
    loading,
    data,
    exportKey,
  };
};

export const useAccidentInsuranceGetGeneralInfo = (id) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    getList(id);
  }, []);

  const getList = async (id) => {
    try {
      let res = await _GET_GENERAL_INFO(id);
      setData(res.data);
      setLoading(false);
    } catch (error) {
      let msg = handleErrorMessage(error);
      setLoading(false);
      message.error(msg);
    }
  };

  return {
    getList,
    loading,
    data,
  };
};

export const useAccidentInsuranceGetById = (id, form) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const user = useWhoAmI();
  const listLegal = user?.companies;

  useEffect(() => {
    getItem();
  }, []);

  const getItem = async () => {
    try {
      let res = await _GET_BY_ID(id);
      const removedMinuses = res.data;
      for (let property in removedMinuses) {
        if (removedMinuses[property] == "-1") {
          removedMinuses[property] = "";
        }
      }
      setData(removedMinuses);
      setLoading(false);
      let data = convertDataForm(res.data);
      let obj = listLegal.find((el) => el.name === data.insurer_main);
      data.insurer_main_company_id = obj.id;
      data.insurer_main = obj.name;
      // console.info(data);
      form.setFieldsValue(data);
    } catch (error) {
      let msg = handleErrorMessage(error);
      setLoading(false);
      message.error(msg);
    }
  };
  return {
    getItem,
    loading,
    data,
  };
};

export const useAccidentInsuranceGetFile = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  const getFile = async (id) => {
    setLoading(true);
    try {
      let res = await _GET_FILE(id);
      setLoading(false);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.pdf");
      document.body.appendChild(link);
      link.click();
      message.success("با موفقیت انجام شد.");
    } catch (error) {
      console.log("ewpogfwej", error.response);
      if (!error.response) {
        message.success("با موفقیت انجام شد.");
        setLoading(false);
        return;
      }

      if (error.response.status === 403) {
        message.error("فایل وجود ندارد.");
        setLoading(false);
        return;
      }

      let msg = handleErrorMessage(error);
      setLoading(false);
      message.error(msg);
    }
  };
  return {
    getFile,
    loading,
    data,
  };
};

export const useAccidentInsuranceDelete = () => {
  const [loading, setLoading] = useState(false);

  const deleteItem = async (id, updateList) => {
    try {
      setLoading(true);
      const res = await hasPerson(id);
      console.info();
      if (res.data.length > 0) {
        message.warning(
          "این بیمه دارای ریز اسامی می باشد. ابتدا نسبت به حذف آنها اقدام کنید!"
        );
      } else {
        await _DELETE(id);
        await updateList();
        message.success("با موفقیت انجام شد.");
      }

      setLoading(false);
    } catch (error) {
      let msg = handleErrorMessage(error);
      setLoading(false);
      message.error(msg);
    }
    // console.info(id);
  };

  return {
    loading,
    deleteItem,
  };
};
