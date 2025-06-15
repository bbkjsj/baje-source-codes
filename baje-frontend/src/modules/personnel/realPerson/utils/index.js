import ListOfCity from "json/ListofCity";
import { getAllPermission, getSingleRealPerson } from "./API";
import {
  handleErrorMessage,
  convertDateToEN,
  covetFormatDateToFA,
} from "_helpers";
// TEMP
import { permission } from "json/Permission";
const findPlaceName = (nationalNumber) => {
  let code = nationalNumber.slice(0, 3);
  if (ListOfCity.hasOwnProperty(code)) {
    return ListOfCity[code];
  } else {
    return "";
  }
};

const handleGetPermission = (setData, handleError) => {
  getAllPermission()
    .then((data) => {
      setData(data.data);
    })
    .catch((err) => {
      let message = handleErrorMessage(err);
      handleError(message);
      console.log("error:handleSetPermission", err);
    });
};

const addPermissionToList = (
  useForm,
  permissionsSelected,
  setPermissionsSelected
) => {
  console.log(useForm.getFieldValue(), "!form");
  let {
    person,
    legal,
    machinery,
    contract,
    tamin_insurance,
    hse,
  } = useForm.getFieldValue();
  let contractSelected = useForm.getFieldValue("selectContract/accessLevelTab");
  let companySelected = useForm.getFieldValue("selectOffice/accessLevelTab");

  let permissionObj = {
    person,
    legal,
    machinery,
    contract,
    tamin_insurance,
    hse,
    contractSelected,
    companySelected,
  };

  let list = [...permissionsSelected];
  let index = permissionsSelected.findIndex(
    (v) => v.contractSelected === contractSelected
  );

  if (index == -1) {
    list.push(permissionObj);
  } else {
    list[index] = permissionObj;
  }
  setPermissionsSelected(list);
  console.log("!list", list);
  return list;
};

const checkListOfPermissionHasCurrentContract = (list, current) => {
  let index = list.findIndex((value) => value.contractSelected === current);
  if (index !== -1) return list[index];
  else return false;
};

const checkMaritalStatus = ({ useForm }) => {
  let { son, daughter, wife } = useForm.getFieldsValue();
  if (
    (son && son.length) ||
    (daughter && daughter.length) ||
    (wife && wife.length)
  ) {
    useForm.setFieldsValue({ "marital_status/mainInfoTab": "married" });
  }
};

//{ rel: 'mother' ,  first_name: '' , last_name: '' , national_number: '', birth_date: '' }
const convertFamily = (list /*family obj */) => {
  console.log("listlist", list);
  let newArr = [];
  for (const key in list) {
    if (list[key]) {
      for (let i = 0; i < list[key].length; i++) {
        let newObj = {};
        newObj = {
          id: list[key][i]["id"] && list[key][i]["id"],
          rel: key,
          national_id: list[key][i]["national_id"],
          first_name: list[key][i]["name"],
          last_name: list[key][i]["last_name"],
          father_name: list[key][i]["father_name"],
          birth_day: convertDateToEN(list[key][i]["birth_day"]),
          national_number: list[key][i]["national_number"],
          birth_day_place: list[key][i]["birth_day_place"],
          sponsorship_status: list[key][i]["sponsorship_status"],
          insurance_number: list[key][i]["insurance_number"],
          exit_sponsor_reason: list[key][i]["exit_sponsor_reason"],
          exit_sponsor_date: convertDateToEN(list[key][i]["exit_sponsor_date"]),
        };
        newArr.push(newObj);
      }
    }
  }
  return newArr;
};

const covertListOfPermission = (list) => {
  let newList = [];
  for (let i = 0; i < list.length; i++) {
    let newObj = {};
    newObj.company_id = list[i].companySelected;
    newObj.contract_id = list[i].contractSelected;
    const element = [];
    for (const key in list[i]) {
      if (
        key !== "contractSelected" &&
        key !== "companySelected" &&
        list[i][key]
      ) {
        element.push(list[i][key]);
      }
    }

    newObj.permissions = element.flat(1);
    newList.push(newObj);
  }

  return newList;
};

const removeTabNames = (data) => {
  let newObj = {};
  for (let key in data) {
    let newKey = key.split("/")[0];
    newObj[newKey] = data[key];
  }
  return newObj;
};
const removePropertyFromObj = (obj, keys) => {
  let newObj = { ...obj };
  for (let i = 0; i < keys.length; i++) {
    delete newObj[keys[i]];
  }
  return newObj;
};

const setOriginFileObj = (obj, keys) => {
  let newObj = { ...obj };
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (newObj[key] && newObj[key].length > 0) {
      newObj[key] = newObj[key][0]["originFileObj"];
    }
  }
  return newObj;
};

const appendToFormData = (data) => {
  const formData = new FormData();
  for (const property in data) {
    if (data[property] || data[property] === 0) {
      formData.append(property, data[property]);
    }
  }
  return formData;
};

const handelGetSingleRealPerson = (id, setData, handleError) => {
  getSingleRealPerson(id)
    .then((res) => {
      setData(res.data);
    })
    .catch((err) => {
      let message = handleErrorMessage(err);
      handleError(message, "get");
      console.log("error", err);
    });
};

const inputsName = {
  birth_date: { tab: "mainInfoTab", fa: "" },
  national_number: { tab: "mainInfoTab", fa: "" },
  first_name: { tab: "mainInfoTab", fa: "" },
  last_name: { tab: "mainInfoTab", fa: "" },
  father_name: { tab: "mainInfoTab", fa: "" },
  id_number: { tab: "mainInfoTab", fa: "" },
  sex: { tab: "mainInfoTab", fa: "" },
  birth_place: { tab: "mainInfoTab", fa: "" },
  id_issue_place: { tab: "mainInfoTab", fa: "" },
  nation: { tab: "mainInfoTab", fa: "" },
  public_description: { tab: "mainInfoTab", fa: "" },
  private_description: { tab: "mainInfoTab", fa: "" },
  contract_id: { tab: "mainInfoTab", fa: "" },
  marital_status: { tab: "mainInfoTab", fa: "" },
  army_service: { tab: "mainInfoTab", fa: "" },
  education: { tab: "mainInfoTab", fa: "" },
  study_field: { tab: "mainInfoTab", fa: "" },
  isargar: { tab: "mainInfoTab", fa: "" },
  shahid_was_colleague: { tab: "mainInfoTab", fa: "" },
  shahid_name: { tab: "mainInfoTab", fa: "" },
  veteran_percentage: { tab: "mainInfoTab", fa: "" },
  frontline_year: { tab: "mainInfoTab", fa: "" },
  frontline_month: { tab: "mainInfoTab", fa: "" },
  frontline_day: { tab: "mainInfoTab", fa: "" },
  captivity_year: { tab: "mainInfoTab", fa: "" },
  captivity_month: { tab: "mainInfoTab", fa: "" },
  captivity_day: { tab: "mainInfoTab", fa: "" },
  password: { tab: "mainInfoTab", fa: "" },
  ///
  insurance_number: { tab: "jobInfoTab" },
  personnel_id: { tab: "jobInfoTab" },
  history_total_day: { tab: "jobInfoTab" },
  insurance_share_employee: { tab: "jobInfoTab" },
  insurance_share_employer: { tab: "jobInfoTab" },
  insurance_share_unemployment: { tab: "jobInfoTab" },
  insurance_share_harmful: { tab: "jobInfoTab" },
  employeement_type: { tab: "jobInfoTab" },
  employeement_date: { tab: "jobInfoTab" },
  contract_end_date: { tab: "jobInfoTab" },
  contract_start_date: { tab: "jobInfoTab" },
  job_type: { tab: "jobInfoTab" },
  job_status: { tab: "jobInfoTab" },
  expire_reason: { tab: "jobInfoTab" },
  expire_time: { tab: "jobInfoTab" },
  //
  mobile1: { tab: "contactInfoTab" },
  mobile2: { tab: "contactInfoTab" },
  phone: { tab: "contactInfoTab" },
  postal_code: { tab: "contactInfoTab" },
  address: { tab: "contactInfoTab" },
  email: { tab: "contactInfoTab" },
  //
  bank_account1: { tab: "bankAccountTab" },
  sheba1: { tab: "bankAccountTab" },
  bank_name1: { tab: "bankAccountTab" },
  bank_account2: { tab: "bankAccountTab" },
  sheba2: { tab: "bankAccountTab" },
  bank_name2: { tab: "bankAccountTab" },
  bank_account3: { tab: "bankAccountTab" },
  sheba3: { tab: "bankAccountTab" },
  bank_name3: { tab: "bankAccountTab" },
  bank_account4: { tab: "bankAccountTab" },
  sheba4: { tab: "bankAccountTab" },
  bank_name4: { tab: "bankAccountTab" },
  bank_account5: { tab: "bankAccountTab" },
  sheba5: { tab: "bankAccountTab" },
  bank_name5: { tab: "bankAccountTab" },

  //
  birth_certificate: { tab: "uploadDocTab", fa: "شناسنامه" },
  national_card_front: { tab: "uploadDocTab", fa: "روی کارت ملی" },
  national_card_rear: { tab: "uploadDocTab", fa: "پشت کارت ملی" },
  army_service_card: { tab: "uploadDocTab", fa: "پایان خدمت" },
  person_img: { tab: "uploadDocTab", fa: "عکس پرسنلی" },
  sign: { tab: "uploadDocTab", fa: "امضا" },
};

const addTabName = (data) => {
  let newObj = {};
  for (const property in data) {
    let input = inputsName[property];
    if (input) {
      let newName = property + "/" + input["tab"];
      newObj[newName] = data[property];
    }
  }
  return newObj;
};

const convertRealPersonDateFa = (person) => {
  let newObj = { ...person };
  newObj.birth_date = covetFormatDateToFA(person.birth_date);
  newObj.expire_time = covetFormatDateToFA(person.job_disable_date);
  newObj.employeement_date = covetFormatDateToFA(person.eployeement_date);
  newObj.contract_start_date = covetFormatDateToFA(person.contract_start_date);
  newObj.contract_end_date = covetFormatDateToFA(person.contract_end_date);
  console.log("weoifjwoefj", newObj);
  return newObj;
};

const convertFamilyFromServer = (family) => {
  let newObj = {};
  for (let i = 0; i < family.length; i++) {
    family[i]["birth_day"] = covetFormatDateToFA(family[i]["birth_day"]);
    family[i]["exit_sponsor_date"] = covetFormatDateToFA(
      family[i]["exit_sponsor_date"]
    );

    if (newObj.hasOwnProperty(family[i]["relation"])) {
      let singleArr = newObj[family[i]["relation"]];
      singleArr.push(family[i]);
      newObj[family[i]["relation"]] = singleArr;
    } else {
      newObj[family[i]["relation"]] = [family[i]];
    }
  }
  return newObj;
};

const convertRealPersonSubordinate = (subordinates) => {
  let newData;
  if (subordinates && subordinates !== "no access" && subordinates.length > 0) {
    newData = convertFamilyFromServer(subordinates);
  }
  return newData;
};

const changePropertyName = (data, { oldName, newName }) => {
  const newData = { ...data };
  newData[newName] = newData[oldName];
  delete newData[oldName];
  return newData;
};

const setFileInputValue = (name, value) => {
  if (!value) {
    return null;
  }
  let newValue = [
    {
      uid: name,
      name: inputsName[name].fa,
      status: "done",
      url: value,
    },
  ];
  return newValue;
};

const convertAccess = (access) => {
  let newList = [];
  for (let i = 0; i < access.length; i++) {
    let newObj = {};
    newObj.companySelected = access[i]["company_id"];
    newObj.contractSelected = access[i]["contract_id"];
    for (let j = 0; j < access[i]["permissions"].length; j++) {
      let newAccess = access[i]["permissions"][j].split("/");
      let arr = [];
      if (newObj[newAccess[0]]) {
        arr = [...newObj[newAccess[0]]];
        arr.push(access[i]["permissions"][j]);
        newObj[newAccess[0]] = [...arr];
      } else {
        arr.push(access[i]["permissions"][j]);
        newObj[newAccess[0]] = [...arr];
      }
    }
    newList.push({ ...newObj });
  }

  console.log("ewigjeio", newList);
  return newList;
};

const makeDataRealPersonServer = (
  values,
  currentOffice,
  permissionsSelected,
  type = "send",
  userID = 0,
  jobID = 0
) => {
  // remove tab name form input name
  let data = removeTabNames(values);
  // convert family structure
  data.subordinates = convertFamily({
    son: data.son,
    mother: data.mother,
    wife: data.wife,
    daughter: data.daughter,
    father: data.father,
  });

  // remove additional inputs
  data = removePropertyFromObj(data, [
    "person",
    "legal",
    "machinery",
    "contract",
    "son",
    "mother",
    "wife",
    "daughter",
    "father",
    "selectContract",
    "selectOffice",
  ]);
  //- check material status
  // checkMaritalStatus(realPersonForm);

  if (permissionsSelected.length > 0) {
    let convertedList = covertListOfPermission(permissionsSelected);
    data.permissions = [...convertedList];
  }

  //convert date
  data.birth_date = convertDateToEN(data.birth_date);
  data.expire_time = convertDateToEN(data.expire_time);
  data.employeement_date = convertDateToEN(data.employeement_date);
  data.contract_start_date = convertDateToEN(data.contract_start_date);
  data.contract_end_date = convertDateToEN(data.contract_end_date);

  //stringify
  data.subordinates = JSON.stringify(data.subordinates);
  data.permissions = JSON.stringify(data.permissions);

  // set originFileObj
  data = setOriginFileObj(data, [
    "birth_certificate",
    "national_card_front",
    "national_card_rear",
    "army_service_card",
    "person_img",
    "sign",
  ]);

  data.person = data.person_img;
  delete data.person_img;

  data.company_id = currentOffice;
  //6- append to form data

  if (type === "edit") {
    data.id = userID;
    if (data.mobile1) {
      data.mobile1_old = data.mobile1;
    }
    if (data.mobile2) {
      data.mobile2_old = data.mobile2;
    }

    data.job_title = jobID;
  }

  return appendToFormData(data);
};

export {
  findPlaceName,
  handleGetPermission,
  addPermissionToList,
  checkListOfPermissionHasCurrentContract,
  checkMaritalStatus,
  convertFamily,
  removeTabNames,
  removePropertyFromObj,
  covertListOfPermission,
  setOriginFileObj,
  appendToFormData,
  handelGetSingleRealPerson,
  addTabName,
  convertRealPersonDateFa,
  convertRealPersonSubordinate,
  changePropertyName,
  setFileInputValue,
  convertAccess,
  makeDataRealPersonServer,
};
