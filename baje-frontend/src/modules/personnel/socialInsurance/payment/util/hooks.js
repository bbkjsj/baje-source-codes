import { useState, useEffect, useContext } from "react";
import { message } from "antd";
import {
  handleErrorMessage,
  covetFormatDateToFA,
  setFileInputValue,
} from "_helpers";
import {
  _POST,
  _DELETE,
  _GET,
  _GET_BY_ID,
  _PUT,
  _GET_PERSON_CONTRACTS,
} from "./api";
import { useHistory } from "react-router-dom";

export const usePostPayment = (useForm, updateList) => {
  const [loading, setLoading] = useState(false);

  const submit = async (data) => {
    try {
      setLoading(true);
      await _POST(data);
      setLoading(false);
      message.success("با موفقیت انجام شد.");
      useForm.resetFields();
      updateList();
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

export const usePutPayment = (useForm) => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const submit = async (id, data) => {
    try {
      setLoading(true);
      await _PUT(id, data);
      setLoading(false);
      message.success("با موفقیت انجام شد.");
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

export const useGetPayment = (insuranceID) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    try {
      setLoading(true);
      let res = await _GET(insuranceID);
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
    setLoading,
    data,
  };
};

export const useGetPersonContract = (contractID) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    try {
      setLoading(true);
      let res = await _GET_PERSON_CONTRACTS(contractID);
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
    setLoading,
    data,
  };
};

export const useGetOnePayment = (id, useForm = null) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    getItem();
  }, []);

  const getItem = async () => {
    try {
      setLoading(true);
      let res = await _GET_BY_ID(id);
      setData(res.data);
      setLoading(false);

      let fileUrl = res.data.file_url
        ? setFileInputValue("file", res.data.file_url, "فایل")
        : null;

      if (useForm) {
        useForm.setFieldsValue({
          ...res.data,
          insurance_id: res.data.insurance_tamin_id_fk,
          file: fileUrl,
        });
      }
    } catch (error) {
      let msg = handleErrorMessage(error);
      setLoading(false);
      message.error(msg);
    }
  };

  return {
    getItem,
    loading,
    setLoading,
    data,
  };
};

export const useDeleteSocialInsurancePayment = () => {
  const [loading, setLoading] = useState(false);

  const deleteItem = async (id, updateList) => {
    try {
      setLoading(true);
      await _DELETE(id);
      await updateList();
      setLoading(false);
      message.success("با موفقیت انجام شد.");
    } catch (error) {
      let msg = handleErrorMessage(error);
      setLoading(false);
      message.error(msg);
    }
  };

  return {
    loading,
    deleteItem,
  };
};
