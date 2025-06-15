import { useState, useEffect } from "react";
import {
  getUserApi,
  postAccidentReport,
  getMachineApi,
  getAccidentReport,
  getSingleAccidentReport,
  editAccidentReport,
  deleteAccidentReport,
} from "./api";
import { handleErrorMessage } from "_helpers";
import { message } from "antd";
import { useHistory } from "react-router-dom";
import { prepareDataForForm } from "./index";
import { pageNames } from "constant";

const useGetUserInfo = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [userInfo, setUserInfo] = useState();

  const getUserInfo = (nationalId) => {
    setLoading(true);
    setErrorMsg(null);
    getUserApi(nationalId)
      .then((data) => {
        setUserInfo(data);
        setLoading(false);
      })
      .catch((err) => {
        let message = handleErrorMessage(err);
        console.log("error", message);
        setLoading(false);
        setErrorMsg(message);
      });
  };
  return {
    getUserInfo,
    userInfo,
    loading,
    errorMsg,
  };
};

const useGetMachineInfo = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [machineInfo, setMachineInfo] = useState();

  const getMachineInfo = (machineCode) => {
    setLoading(true);
    setErrorMsg(null);
    getMachineApi(machineCode)
      .then((data) => {
        setMachineInfo(data);
        setLoading(false);
      })
      .catch((err) => {
        let message = handleErrorMessage(err);
        setLoading(false);
        setErrorMsg(message);
      });
  };
  return {
    getMachineInfo,
    machineInfo,
    loading,
    errorMsg,
  };
};

const useSendAccidentReport = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const history = useHistory();

  const submitForm = (values) => {
    setLoading(true);
    postAccidentReport(values)
      .then(() => {
        // rest from
        // show message
        message.success("با موفقیت انجام شد.");
        setTimeout(() => {
          setLoading(false);
          history.goBack();
        }, 1000);
      })
      .catch((err) => {
        let msg = handleErrorMessage(err);
        setLoading(false);
        setErrorMsg(msg);
        message.error(msg);
      });
  };

  return {
    loading,
    errorMsg,
    submitForm,
  };
};

const useEditAccidentReport = () => {
  const [loading, setLoading] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const history = useHistory();

  const submitForm = (values) => {
    setLoading(true);
    editAccidentReport(values)
      .then(() => {
        // rest from
        // show message
        message.success("با موفقیت انجام شد.");
        setTimeout(() => {
          history.push(pageNames.personnel.realPerson.accidentReport.list);
        }, 1000);
      })
      .catch((err) => {
        let msg = handleErrorMessage(err);
        setLoading(false);
        setErrorMsg(msg);
        message.error(msg);
      });
  };

  return {
    loading,
    errorMsg,
    submitForm,
  };
};

const useDeleteAccidentReport = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const history = useHistory();

  const deleteItem = (values) => {
    setLoading(true);
    deleteAccidentReport(values)
      .then(() => {
        // rest from
        // show message
        message.success("با موفقیت انجام شد.");
        setTimeout(() => {
          history.go();
        }, 1000);
      })
      .catch((err) => {
        let msg = handleErrorMessage(err);
        setLoading(false);
        setErrorMsg(msg);
        message.error(msg);
      });
  };

  return {
    loading,
    errorMsg,
    deleteItem,
  };
};

const useGetAccidentReport = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState();

  useEffect(() => {
    getAccidentReport()
      .then((data) => {
        console.log("data", data);
        setList(data.data);
        setLoading(false);
      })
      .catch((err) => {
        let msg = handleErrorMessage(err);
        setLoading(false);
        setErrorMsg(msg);
        message.error(msg);
      });
  }, []);

  return {
    list,
    loading,
  };
};

const useGetSingleAccidentReport = (id, useForm) => {
  const [accidentReport, setAccidentReport] = useState();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState();

  useEffect(() => {
    getSingleAccidentReport(id)
      .then((data) => {
        console.log("accident data:", data);
        setAccidentReport(data.data);
        setLoading(false);
        let newData = prepareDataForForm(data.data);
        console.log("new data:", newData);
        useForm.setFieldsValue(newData);
      })
      .catch((err) => {
        let msg = handleErrorMessage(err);
        setLoading(false);
        setErrorMsg(msg);
        message.error(msg);
        console.error("Errrrrrrrrrrrrrrrrr:", err);
      });
  }, []);

  return {
    accidentReport,
    loading,
    errorMsg,
  };
};

export {
  useGetUserInfo,
  useGetMachineInfo,
  useSendAccidentReport,
  useGetAccidentReport,
  useGetSingleAccidentReport,
  useEditAccidentReport,
  useDeleteAccidentReport,
};
