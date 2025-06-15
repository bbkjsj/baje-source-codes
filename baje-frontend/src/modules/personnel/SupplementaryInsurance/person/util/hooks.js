import { useEffect, useState } from "react";
import { getUserDataWithSubordinate } from "utils/api";
import { message } from "antd";
import { covetFormatDateToFA, handleErrorMessage } from "_helpers";

import {
  _DELETE,
  _DELETE_SUBORDINATE,
  _GET,
  _GET_BY_ID,
  _GET_COMPANY_PERSONNEL,
  _POST,
  _PUT,
} from "./api";
import { checkBirthDateWithContractDate } from "./index";
import { insurancePolicyTypeValues } from "../../const";
import { _UPDATE_PERSON_STATUS } from "modules/personnel/SupplementaryInsurance/person/util/api";
import { useSelector } from "react-redux";

export const useGetUserAndSubordinate = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [sub, setSub] = useState([]);
  const [mainUserInfo, setMainUserInfo] = useState();

  const get = async (
    nationalId,
    useForm,
    insuranceInfo,
    setOtherCompanyVisible
  ) => {
    setLoading(true);
    try {
      const { data } = await getUserDataWithSubordinate(
        nationalId,
        insuranceInfo.type
      );
      //*1
      let startDate = covetFormatDateToFA(
        insuranceInfo.contract_date_from_date
      );
      //*2
      let endDate = covetFormatDateToFA(insuranceInfo.to_date);
      //*3
      if (!useForm.getFieldValue("end_date")) {
        useForm.setFieldsValue({ end_date: endDate });
      }

      if (insuranceInfo.type === insurancePolicyTypeValues.LIFE_ACCIDENT) {
        data.subordinate = [];
      }

      // Main User
      if (data.person.length === 0) {
        message.error("کد ملی در سامانه ثبت نشده است.");
      } else if (
        data.person.length === 1 &&
        data.person[0].national_number === nationalId
      ) {
        //*4
        // if (data.person[0].company_id !== currentOffice) {
        //   setOtherCompanyVisible(true);
        // }
        //*5
        useForm.setFieldsValue({
          bank_account1: data?.person[0]?.bank_account1,
          sheba1: data?.person[0]?.sheba1,
          bank_name1: data?.person[0]?.bank_name1,
          mobile_number: data?.person[0].mobile_number,
        });

        let newStartDate = checkBirthDateWithContractDate(
          data.person[0].birth_date,
          insuranceInfo.contract_date_from_date
        );

        if (!useForm.getFieldValue("start_date")) {
          useForm.setFieldsValue({ start_date: newStartDate });
        }
        setMainUserInfo(data.person[0]);

        //subordinate User // check type of insurance
        if (data.subordinate.length > 0) {
          const newSub = data.subordinate.map((item) => {
            let newStartDate = checkBirthDateWithContractDate(
              item.birth_date,
              insuranceInfo.contract_date_from_date
            );
            return { ...item, newStartDate };
          });

          setSub(newSub);
        } else setSub([]);
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

  const getSubordinates = async (nationalId, insuranceInfo) => {
    //
    const { data } = await getUserDataWithSubordinate(
      nationalId,
      insuranceInfo.type
    );
    //
    if (data.person.length === 0) {
      message.error("کد ملی در سامانه ثبت نشده است.");
      return false;
    } else if (
      data.person.length === 1 &&
      data.person[0].national_number === nationalId
    ) {
      // set subordinate
      // *6 convert start Date for subordinate

      if (insuranceInfo.type === insurancePolicyTypeValues.LIFE_ACCIDENT) {
        data.subordinate = [];
      }
      if (data.subordinate.length > 0) {
        const newSub = data.subordinate.map((item) => {
          let newStartDate = checkBirthDateWithContractDate(
            item.birth_date,
            insuranceInfo.contract_date_from_date
          );
          return { ...item, newStartDate };
        });
        // set sub
        setSub(newSub);
      } else setSub([]);

      return data;
    }
  };

  const formAssignment = (data, useForm, insuranceInfo) => {
    useForm.setFieldsValue({
      bank_account1: data?.person[0]?.bank_account1,
      sheba1: data?.person[0]?.sheba1,
      bank_name1: data?.person[0]?.bank_name1,
      mobile_number: data?.person[0].mobile1,
    });
    //
    let endDate = covetFormatDateToFA(insuranceInfo.to_date);
    if (!useForm.getFieldValue("end_date")) {
      useForm.setFieldsValue({ end_date: endDate });
    }

    // check bithday
    let newStartDate = checkBirthDateWithContractDate(
      data.person[0].birth_date,
      insuranceInfo.contract_date_from_date
    );

    if (!useForm.getFieldValue("start_date")) {
      useForm.setFieldsValue({ start_date: newStartDate });
    }
    setMainUserInfo(data.person[0]);

    // if (data.person[0].company_id !== currentOffice) {
    //   setOtherCompanyVisible(true);
    // }
  };

  return {
    get,
    getSubordinates,
    formAssignment,
    sub,
    loading,
    errorMsg,
    mainUserInfo,
  };
};

export const useGetPersonnel = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
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
      // console.log(data, "!!data");
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
      setData(prepareList(res.data));
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

const prepareList = (data) => {
  data.list = data.list.map((item) => {
    item.sub_national_number =
      item.sub_natinal_number || item.main_national_number;
    item.sub_name = item.sub_name || item.main_name;
    item.is_main = item.relation || "main";
    return item;
  });

  return data;
};

export const useGetPersonHistory = (id, type) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    getList(id);
  }, []);

  const getList = async () => {
    try {
      setLoading(true);
      let res = await _GET_BY_ID(id, type);
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

  const deleteItem = async (ids, updateList, relation) => {
    try {
      setLoading(true);
      const request = relation ? _DELETE_SUBORDINATE : _DELETE;
      await request(ids);
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
