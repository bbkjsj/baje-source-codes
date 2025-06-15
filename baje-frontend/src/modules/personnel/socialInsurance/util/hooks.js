import { useState, useEffect, useContext } from "react";
import { message } from "antd";
import { handleErrorMessage } from "_helpers";
import {
  _POST,
  _PUT,
  _DELETE,
  _GET_SOCIALINSURANCE_LIST,
  _GET_PRINT_DATA,
  _GET_ERRORS,
  _GET_CONTRACT_LIST,
} from "./api";
import { useSelector } from "react-redux";

export const useGetContractList = (insuranceList) => {
  const [contractList, setContractList] = useState([]);
  const currentOffice = useSelector((state) => state.currentOffice);

  useEffect(() => {
    (async function () {
      const payload = { type: "main", id: currentOffice };
      const res = await _GET_CONTRACT_LIST(payload);
      if (res?.data?.list) {
        setContractList(res.data.list);
      } else setContractList([]);
    })();
  }, [insuranceList]);

  return {
    contractList,
  };
};

export const usePostSocialInsurance = (useForm, updateList) => {
  const [loading, setLoading] = useState(false);

  const submit = async (data) => {
    console.log(updateList, "!getlist");
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

export const usePutSocialInsurance = (getList, setVisible) => {
  const [loading, setLoading] = useState(false);

  const submit = async (id, data) => {
    try {
      setLoading(true);
      await _PUT(id, data);
      setLoading(false);
      getList();
      setVisible(false);
      message.success("با موفقیت انجام شد.");
    } catch (error) {
      let msg = handleErrorMessage(error);
      setLoading(false);
      message.error(msg);
      setVisible(false);
    }
  };

  return {
    submit,
    loading,
  };
};

export const useGetSocialInsuranceList = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [exportKey, setExportKey] = useState();
  const currentOffice = useSelector((state) => state.currentOffice);
  const currentContract = useSelector((state) => state.currentContract);
  const contractList = useSelector((state) => state.contractList);

  useEffect(() => {
    (async function () {
      await getList();
    })();
  }, [currentOffice, currentContract]);

  const contractsList = contractList;

  const getList = async () => {
    try {
      setLoading(true);
      let res = await _GET_SOCIALINSURANCE_LIST(currentOffice, currentContract);

      let mapToCOntract = res.data?.list?.map((item) => {
        let contract = contractsList.find(
          (el) => el.contract_id === item.contract_id_fk
        );
        return {
          ...item,
          contract_name: contract ? contract.subject : "تعریف نشده",
        };
      });
      // console.info(mapToCOntract, "!!");
      setData(mapToCOntract);
      setLoading(false);
      setExportKey(res.data?.hash);
    } catch (error) {
      let msg = handleErrorMessage(error);
      setLoading(false);
    }
  };

  return {
    getList,
    loading,
    setLoading,
    data,
    exportKey,
    setExportKey,
  };
};

export const useGetSocialInsuranceErrors = (id) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    getList(id);
  }, []);

  const getList = async (id) => {
    try {
      setLoading(true);
      let res = await _GET_ERRORS(id);
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

export const useGetSocialInsurancePrintList = (id) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    try {
      setLoading(true);
      let res = await _GET_PRINT_DATA(id);
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

export const useDeleteSocialInsurance = () => {
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

export const useDeleteSocialInsuranceInView = () => {
  const [loading, setLoading] = useState(false);

  const deleteItem = async (id, updateList, setVisible) => {
    try {
      setLoading(true);
      await _DELETE(id);
      await updateList();
      setLoading(false);
      setVisible(false);
      message.success("عملیات با موفقیت انجام شد.");
    } catch (error) {
      let msg = handleErrorMessage(error);
      setLoading(false);
      setVisible(false);
      message.error(msg);
    }
  };

  return {
    loading,
    deleteItem,
  };
};
