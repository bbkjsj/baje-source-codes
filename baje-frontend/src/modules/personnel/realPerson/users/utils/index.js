import { checkShamsi } from "_helpers";
import ListOfCity from "json/ListofCity";
import * as api from "./api";
import { pageNames } from "constant";
import {
  PermissionsFarsiLabels,
  PermissionsSectionsFarsiLabels,
} from "json/Permission";
import { notification } from "antd";

const setIDNumber = (dateBirthday, idNumber, nationalID, form) => {
  if (
    dateBirthday &&
    checkShamsi(dateBirthday) &&
    dateBirthday.split("/")[0] > 1368
  ) {
    form.setFieldsValue({
      id_number: nationalID,
    });
  } else {
    form.setFieldsValue({
      id_number: idNumber ? idNumber : ``,
    });
  }
};

const findPlaceName = (nationalNumber) => {
  let code = nationalNumber.slice(0, 3);
  if (ListOfCity.hasOwnProperty(code)) {
    return ListOfCity[code];
  } else {
    return "";
  }
};

export const ValidateNationalNumberFormat = async (event, form) => {
  let code = event.target.value;
  if (code && code.length === 10) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = (code) => {
          var L = code.length;
          if (L < 8 || parseInt(code, 10) == 0) return false;
          code = ("0000" + code).substr(L + 4 - 10);
          if (parseInt(code.substr(3, 6), 10) == 0) return false;
          var c = parseInt(code.substr(9, 1), 10);
          var s = 0;
          for (var i = 0; i < 9; i++)
            s += parseInt(code.substr(i, 1), 10) * (10 - i);
          s = s % 11;
          return (s < 2 && c == s) || (s >= 2 && c == 11 - s);
          return true;
        };
        if (res(code)) {
          resolve(res);
        } else {
          form.setFields([
            {
              name: "national_number",
              errors: ["کد ملی نامعتبر است"],
            },
          ]);

          reject();
        }
      } catch (error) {
        form.setFields([
          {
            name: "national_number",
            errors: ["کد ملی نامعتبر است"],
          },
        ]);
        reject();
      }
    });
  }
};

export const checkDuplicateHandher = async (event, form) => {
  let value = event.target.value;
  if (value && value.length === 10) {
    try {
      const res = await api.GET_USER_WITH_NATIONAL_NUMBER(value);
      form.setFields([
        {
          name: "national_number",
          errors: ["کد ملی تکراری است"],
        },
      ]);
      return res;
    } catch (error) {
      return;
    }
  }
};

export const handleSetIssuePlace = (nationalNumber, form) => {
  console.log(nationalNumber);
  let cityName = findPlaceName(nationalNumber);
  form.setFieldsValue({
    id_issue_place: cityName,
    birth_place: cityName,
  });
};

export const handleSetIDNumber = (form) => {
  const dateBirthday = form.getFieldValue("birth_date");
  const nationalID = form.getFieldValue("national_number");
  const idNumber = form.getFieldValue("id_number");
  setIDNumber(dateBirthday, idNumber, nationalID, form);
};

export const AddUser = async (payload, setLoading, history, onFinish) => {
  try {
    setLoading(true);
    await api.ADD_USER(payload);
    setLoading(false);
    notification.success({ message: "فرد حقیقی با موفقیت ایجاد شد" });
    if (onFinish) {
      onFinish(payload.national_number);
    } else {
      history.push(pageNames.personnel.realPerson.list);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const UpdateUser = async (payload, id, setLoading, history) => {
  try {
    setLoading(true);
    await api.UPDATE_USER(id, payload);
    setLoading(false);
    history.push(pageNames.personnel.realPerson.list);
  } catch (error) {
    setLoading(false);
  }
};

export const handleCheckInsuranceNumber = (useForm, value) => {
  if (value && value.length === 8) {
    api
      .CHECK_INSURANCE_NUMBER(value)
      .then(() => {})
      .catch(() => {
        useForm.setFields([
          {
            name: "insurance_number",
            errors: ["شماره بیمه تکراری است"],
          },
        ]);
      });
  }
};

export const getStaticPrmissions = async (setLoading, setList) => {
  try {
    setLoading(true);
    const res = await api.GET_NEW_PERMISSIONS();
    const sections = Object.keys(res.data);
    const newPermissions = [];
    sections.map((sec) => {
      newPermissions.push({
        section: sec,
        label: PermissionsSectionsFarsiLabels[sec] ?? "farsi-section-name",
        permissions: Object.keys(res.data[sec]).map((perm) => ({
          label: PermissionsFarsiLabels[perm]
            ? PermissionsFarsiLabels[perm].label
            : "null",
          value: res.data[sec][perm],
        })),
      });
    });

    setList(newPermissions);

    setLoading(false);
  } catch (error) {
    setLoading(true);
  }
};

export const getUser = async (id) => {
  try {
    const res = await api.GET_USER(id);
    return res.data;
  } catch (error) {}
};

export const getUserAccess = async (id) => {
  try {
    const res = await api.GET_USER_ACCESS(id);
    return res.data;
    // return [];
  } catch (error) {}
};

export const getInitialPermissions = async (
  setLoading,
  setTotalAccess,
  setStaticPermissions,
  userId
) => {
  setLoading(true);
  await getStaticPrmissions(setLoading, setStaticPermissions);
  const res = await getUserAccess(userId);
  const access = [];
  res.forEach((element) => {
    const relatedPermissions = res.filter(
      (el) =>
        el.companyId === element.companyId &&
        el.contractId === element.contractId
    );

    const index = access.findIndex(
      (el) =>
        el.companyId === element.companyId &&
        el.contractId === element.contractId
    );

    if (index !== -1) {
      access.splice(index, 1);
    }
    access.push({
      contractId: element.contractId,
      companyId: element.companyId,
      access: relatedPermissions.map((el) => el.access),
    });
  });

  setTotalAccess(access);
  setLoading(false);
};
