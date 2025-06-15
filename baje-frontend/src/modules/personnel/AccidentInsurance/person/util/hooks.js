import { useState, useContext, useEffect } from "react";
import { AccidentInsuranceContext } from "modules/personnel/AccidentInsurance/util/AccidentInsuranceContext";
import { getUserDataWithSubordinate } from "utils/api";
import { message } from "antd";
import { handleErrorMessage, covetFormatDateToFA } from "_helpers";
import { PersonStatusValue } from "../const";
import {
  _POST,
  _GET,
  _GET_BY_ID,
  _PUT,
  _DELETE,
  _GET_COMPANY_PERSONNEL,
  _UPDATE_PERSON_STATUS,
} from "./api";
import { checkBirthDateWithContractDate } from "./index";
import { insurancePolicyTypeValues } from "../../const";
import { useSelector } from "react-redux";

export const useGetUserAndSubordinate = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [userInfo, setUserInfo] = useState();
  const [personStatus, setPersonStatus] = useState();
  const [mainUserInfo, setMainUserInfo] = useState();

  const get = async (nationalId, useForm, insuranceInfo) => {
    setLoading(true);
    try {
      const { data } = await getUserDataWithSubordinate(
        nationalId,
        insuranceInfo.type
      );
      let startDate = covetFormatDateToFA(
        insuranceInfo.contract_date_from_date
      );
      let endDate = covetFormatDateToFA(insuranceInfo.to_date);
      console.log("eojgeoig", useForm.getFieldValue("end_date"));
      if (!useForm.getFieldValue("end_date")) {
        useForm.setFieldsValue({ end_date: endDate });
      }

      if (insuranceInfo.type === insurancePolicyTypeValues.LIFE_ACCIDENT) {
        data.subordinate = [];
      }

      // Main User
      if (
        data.person.length === 1 &&
        data.subordinate.length === 0 &&
        data.person[0].national_number === nationalId
      ) {
        // setPersonStatus(PersonStatusValue.MAIN);
        let newStartDate = checkBirthDateWithContractDate(
          data.person[0].birth_date,
          startDate
        );
        if (!useForm.getFieldValue("start_date")) {
          useForm.setFieldsValue({ start_date: newStartDate });
        }

        setUserInfo({ ...data.person[0], status: PersonStatusValue.MAIN });

        //subordinate User // check type of insurance
      } else if (data.person.length === 1 && data.subordinate.length === 1) {
        let newStartDate = checkBirthDateWithContractDate(
          data.subordinate[0].birth_date,
          startDate
        );

        if (!useForm.getFieldValue("start_date")) {
          useForm.setFieldsValue({ start_date: newStartDate });
        }

        setMainUserInfo(data.person[0]);
        setUserInfo({
          ...data.subordinate[0],
          status: PersonStatusValue.SUBORDINATE,
        });

        // setPersonStatus(PersonStatusValue.SUBORDINATE);
      } else if (data.person.length >= 2 && data.subordinate.length >= 1) {
        let newStartDate = checkBirthDateWithContractDate(
          data.subordinate[0].birth_date,
          startDate
        );
        if (!useForm.getFieldValue("start_date")) {
          useForm.setFieldsValue({ start_date: newStartDate });
        }

        setMainUserInfo(data.person);
        setUserInfo({
          ...data.subordinate[0],
          status: PersonStatusValue.SUBORDINATE_WITH_MAINS,
        });
      } else if (data.person.length === 0 && data.subordinate.length === 0) {
        message.error("کد ملی در سامانه ثبت نشده است.");
      }

      setLoading(false);
    } catch (error) {
      let msg = handleErrorMessage(error);
      console.log("error", msg);
      message.error(msg);
      setLoading(false);
      setErrorMsg(message);
    }
  };

  return {
    personStatus,
    get,
    userInfo,
    loading,
    errorMsg,
    mainUserInfo,
  };
};

export const useGetPersonnel = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const insuranceContext = useContext(AccidentInsuranceContext);

  const currentOffice = useSelector((state) => state.currentOffice);

  useEffect(() => {
    getPersonnel();
  }, [currentOffice]);

  const getPersonnel = async () => {
    try {
      setLoading(true);
      let res = await _GET_COMPANY_PERSONNEL(currentOffice);
      setData(res.data.list);
      setLoading(false);
    } catch (error) {
      let msg = handleErrorMessage(error);
      setLoading(false);
      message.error(msg);
    }
  };

  return {
    getPersonnel,
    loading,
    data,
  };
};

export const useAddPerson = (useForm, updateList) => {
  const [loading, setLoading] = useState(false);

  const submit = async (data) => {
    try {
      setLoading(true);
      await _POST(data);
      setLoading(false);
      message.success("با موفقیت انجام شد.");
      // useForm.resetFields();
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

export const useEditPerson = (useForm, updateList) => {
  const [loading, setLoading] = useState(false);

  const submit = async (id, data) => {
    try {
      setLoading(true);
      await _PUT(id, data);
      setLoading(false);
      message.success("با موفقیت انجام شد.");
      // useForm.resetFields();
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

export const useGetPerson = (id) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    getList(id);
  }, []);

  const getList = async () => {
    try {
      setLoading(true);
      let res = await _GET(id);
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

export const useGetPersonHistory = (id) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    getList(id);
  }, []);

  const getList = async () => {
    try {
      setLoading(true);
      let res = await _GET_BY_ID(id);
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

export const useDeletePerson = () => {
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

export const useApprovePerson = () => {
  const [loading1, setLoading] = useState(false);

  const approveItem = async (ids, updateList) => {
    try {
      setLoading(true);
      for (const val of ids) {
        const res = await _UPDATE_PERSON_STATUS(val, true);
      }
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
    loading1,
    approveItem,
  };
};
