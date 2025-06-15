import { useState, useEffect } from "react";
import { message } from "antd";
import { handleErrorMessage, covetFormatDateToFA } from "_helpers";
import { _POST, _GET, _GET_BY_ID, _PUT, _DELETE } from "./api";

export const usePostDeductions = (useForm) => {
  const [loading, setLoading] = useState(false);

  const submit = async (data) => {
    try {
      setLoading(true);
      await _POST(data);
      setLoading(false);
      message.success("با موفقیت انجام شد.");
      useForm.resetFields();
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

export const useEditDeductions = (useForm) => {
  const [loading, setLoading] = useState(false);

  const submit = async (id, data) => {
    try {
      setLoading(true);
      await _PUT(id, data);
      setLoading(false);
      message.success("با موفقیت انجام شد.");
      // useForm.resetFields();
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

export const useGetDeductions = (personnel_id) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    try {
      setLoading(true);
      let res = await _GET(personnel_id);
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

export const useGetSingleDeductions = (id, useForm) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    get();
  }, []);

  const get = async () => {
    try {
      setLoading(true);
      let res = await _GET_BY_ID(id);

      const data = { ...res.data };
      data.payment_date = covetFormatDateToFA(data.payment_date);
      data.document_date = covetFormatDateToFA(data.document_date);
      if (data.month && data.year) {
        const month = data.month.length < 2 ? `0${data.month}` : data.month;

        data.salary_period = data.year + "-" + month;
      }

      useForm.setFieldsValue(data);
      setData(res.data);
      setLoading(false);
    } catch (error) {
      let msg = handleErrorMessage(error);
      setLoading(false);
      message.error(msg);
    }
  };

  return {
    get,
    loading,
    setLoading,
    data,
  };
};

export const useDeleteDeductions = () => {
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
