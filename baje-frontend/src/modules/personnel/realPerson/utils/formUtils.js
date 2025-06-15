import { checkShamsi } from "_helpers";
import {
  checkNationalNumber,
  checkInsuranceNumber,
  newRealPerson,
  editRealPerson,
} from "./API";

import {
  findPlaceName,
  checkListOfPermissionHasCurrentContract,
} from "./index";

import { handleErrorMessage } from "_helpers";

import securedAxios from "api/appAxios";

const setIDNumber = (dateBirthday, idNumber, nationalID, useForm) => {
  if (
    dateBirthday &&
    checkShamsi(dateBirthday) &&
    dateBirthday.split("/")[0] > 1368
  ) {
    useForm.setFieldsValue({
      "id_number/mainInfoTab": nationalID,
    });
  } else {
    useForm.setFieldsValue({
      "id_number/mainInfoTab": idNumber ? idNumber : ``,
    });
  }
};

const handleSetIDNumber = (useForm) => {
  const dateBirthday = useForm.getFieldValue("birth_date/mainInfoTab");
  const nationalID = useForm.getFieldValue("national_number/mainInfoTab");
  const idNumber = useForm.getFieldValue("id_number/mainInfoTab");
  setIDNumber(dateBirthday, idNumber, nationalID, useForm);
};

const handleCheckNationalNumber = (event, useForm) => {
  let value = event.target.value;
  if (value && value.length === 10) {
    checkNationalNumber(value)
      .then(() => {})
      .catch(() => {
        useForm.setFields([
          {
            name: "national_number/mainInfoTab",
            errors: ["کد ملی تکراری است"],
          },
        ]);
      });
  }
};

const handleValidateNationalNumber = (event, useForm) => {
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
        if (res(code)) resolve(res);
        else {
          useForm.setFields([
            {
              name: "national_number/mainInfoTab",
              errors: ["کد ملی نامعتبر است"],
            },
          ]);
          reject();
        }
      } catch (error) {
        useForm.setFields([
          {
            name: "national_number/mainInfoTab",
            errors: ["کد ملی نامعتبر است"],
          },
        ]);
        reject();
      }
    });
  }
};

const handleSetIssuePlace = (nationalNumber, useForm) => {
  let cityName = findPlaceName(nationalNumber);
  useForm.setFieldsValue({
    "id_issue_place/mainInfoTab": cityName,
    "birth_place/mainInfoTab": cityName,
  });
};

const handleSetUserName = (useForm) => {
  const nationalID = useForm.getFieldValue("national_number/mainInfoTab");
  useForm.setFieldsValue({
    "username/mainInfoTab": nationalID,
  });
};

const handleSetPassword = (useForm) => {
  const nationalID = useForm.getFieldValue("national_number/mainInfoTab");
  useForm.setFieldsValue({
    "password/mainInfoTab": nationalID,
    "repeat_password/mainInfoTab": nationalID,
  });
};

const handleCheckJobCode = (useForm, setLoading, getError, setStatus) => {
  let error = useForm.getFieldError("job_title_id/jobInfoTab");
  let code = useForm.getFieldValue("job_title_id/jobInfoTab");
  if (error.length === 0 && code) {
    setLoading(true);
    securedAxios
      .get(`/api/jobtitle/${code}`)
      .then((res) => {
        setLoading(false);
        setStatus("edit");
        useForm.setFieldsValue({
          "job_title_name/jobInfoTab": `${res.data.title}`,
          "job_title_id/jobInfoTab": `${res.data.id}`,
        });
      })
      .catch((error) => {
        setLoading(false);
        getError(error?.response?.data);
        useForm.setFieldsValue({
          "job_title_name/jobInfoTab": ``,
        });
      });
  }
};

const handleCheckInsuranceNumber = (useForm, value) => {
  if (value && value.length === 8) {
    checkInsuranceNumber(value)
      .then(() => {})
      .catch(() => {
        useForm.setFields([
          {
            name: "insurance_number/jobInfoTab",
            errors: ["شماره بیمه تکراری است"],
          },
        ]);
      });
  }
};

const handleRestCheckBox = (contractId, officeId, useForm) => {
  useForm.setFieldsValue({
    person: undefined,
    legal: undefined,
    machinery: undefined,
    contract: undefined,
    tamin_insurance: undefined,
  });
};

const selectCheckBoxPermission = (permissionsSelected, contractID, useForm) => {
  if (permissionsSelected.length > 0) {
    const result = checkListOfPermissionHasCurrentContract(
      permissionsSelected,
      contractID
    );
    if (result) {
      useForm.setFieldsValue(result);
    }
  }
};

const checkValidationSubordinateTab = (input) => {
  if (
    input === "father" ||
    input === "son" ||
    input === "daughter" ||
    input === "mother" ||
    input === "wife"
  ) {
    return true;
  }
  return false;
};

const handleOnFailedForm = (data, changeTab, activeTab, setLoading) => {
  setLoading(false);
  let tabNames = [];
  for (let i = 0; i < data.errorFields.length; i++) {
    if (!checkValidationSubordinateTab(data.errorFields[i].name[0])) {
      let tabName = data.errorFields[i].name[0].split("/")[1];
      tabNames.push(tabName);
    } else {
      tabNames.push("subordinatePersonInfoTab");
    }
  }
  if (tabNames.indexOf(activeTab) === -1) {
    changeTab(tabNames[0]);
  }
};

const handleNewRealPerson = (data, handleSuccess, handleError) => {
  newRealPerson(data)
    .then((result) => {
      handleSuccess("باموفقیت انجام شد.");
    })
    .catch((error) => {
      let message = handleErrorMessage(error);
      handleError(message);
    });
};

const handleEditRealPerson = (data, handleSuccess, handleError) => {
  editRealPerson(data)
    .then((result) => {
      handleSuccess("باموفقیت انجام شد.");
    })
    .catch((error) => {
      let message = handleErrorMessage(error);
      handleError(message, "submit");
    });
};

export {
  handleSetIDNumber,
  handleCheckNationalNumber,
  handleValidateNationalNumber,
  handleSetIssuePlace,
  handleSetUserName,
  handleCheckJobCode,
  handleCheckInsuranceNumber,
  handleRestCheckBox,
  selectCheckBoxPermission,
  handleOnFailedForm,
  handleSetPassword,
  handleNewRealPerson,
  handleEditRealPerson,
};
