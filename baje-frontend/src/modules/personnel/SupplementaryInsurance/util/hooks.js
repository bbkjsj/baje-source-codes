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
import { handleErrorMessage, notice } from "_helpers";
import { message } from "antd";
import { useHistory } from "react-router-dom";
import { convertDataForm } from "./index";
import { config, pageNames } from "constant";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

export const useSupplementaryInsuranceAdd = () => {
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
        history.goBack();
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

export const useSupplementaryInsuranceEdit = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const submit = async (data, id) => {
    try {
      setLoading(true);
      await _PUT(data, id);
      message.success("با موفقیت انجام شد.");
      setLoading(false);
      history.push(pageNames.personnel.insurance.supplymentary.list);
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

export const useSupplementaryInsuranceGet = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [exportKey, setExportKey] = useState();
  const currentOffice = useSelector((state) => state.currentOffice);

  useEffect(() => {
    getList();
  }, [currentOffice]);

  const getList = async () => {
    try {
      setLoading(true);
      let res = await _GET(currentOffice, "takmili");
      const supplementaryData = res?.data?.list;
      setData(supplementaryData);
      setExportKey(res?.data?.hash);

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

export const useSupplementaryInsuranceGetGeneralInfo = (id) => {
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

export const useSupplementaryInsuranceGetById = (id, form) => {
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
      console.info(obj, data, listLegal);
      data.insurer_main_company_id = obj.id;
      data.insurer_main = obj.name;
      form.setFieldsValue(data);

      if (data.pdf_file_url) {
        const initialFile = [
          {
            name: "فایل پیوست شده",
            status: "done",
            url: config.url.API_URL + data.pdf_file_url,
          },
        ];

        notice(initialFile);
        form.setFieldsValue({
          file: initialFile,
        });
      }
    } catch (error) {
      let msg = handleErrorMessage(error);
      console.info(error);
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

export const useSupplementaryInsuranceGetFile = () => {
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

export const useSupplementaryInsuranceDelete = () => {
  const [loading, setLoading] = useState(false);

  const deleteItem = async (ids, updateList) => {
    try {
      setLoading(true);
      let canDelete = true;

      for (let index = 0; index < ids.length; index++) {
        const id = ids[index];

        if (canDelete) {
          const res = await hasPerson(id);
          if (res.data.list.length > 0) {
            message.warning(
              "این قرارداد بیمه دارای ریز اسامی می باشد. ابتدا نسبت به حذف آنها اقدام کنید!"
            );
            canDelete = false;
          }
        }
      }

      if (canDelete) {
        await _DELETE(ids);
        await updateList();
        message.success("با موفقیت انجام شد.");
      }
      setLoading(false);
    } catch (error) {
      let msg = handleErrorMessage(error);
      setLoading(false);
      message.error(msg);
    }
  };

  return {
    loading,
    deleteItem,
    setLoading,
  };
};
