import { getSingleRightFull } from "./API";
import { handleErrorMessage } from "_helpers";
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
    if (data[property]) {
      formData.append(property, data[property]);
    }
  }
  return formData;
};

const handleGetSingleRightFull = (id, setData, handleError) => {
  getSingleRightFull(id)
    .then((res) => {
      setData(res.data);
    })
    .catch((err) => {
      let message = handleErrorMessage(err);
      handleError(message, "get");
      console.log("error", err);
    });
};

const changePropertyName = (data, { oldName, newName }) => {
  const newData = { ...data };
  newData[newName] = newData[oldName];
  delete newData[oldName];
  return newData;
};

// for add tab name to inputs
const inputsName = {
  phone: { tab: "contactInfoTab", fa: "تلفن" },
  finance_code: { tab: "initialDataTab", fa: "" },
  national_id: { tab: "initialDataTab", fal: "" },
  name: { tab: "initialDataTab", fa: "" },
  register_number: { tab: "initialDataTab", fa: "" },
  register_date: { tab: "initialDataTab", fa: "" },
  manager_national_id: { tab: "initialDataTab", fa: "" },
  sign_owners: { tab: "initialDataTab", fa: "" },
  description: { tab: "initialDataTab", fa: "" },
  logo: { tab: "initialDataTab", fa: "لوگو" },
  sign: { tab: "initialDataTab", fa: "اسکن مهر شرکت" },
  seal: { tab: "initialDataTab", fa: "اسکن امضا" },
  postal_code: { tab: "contactInfoTab", fa: "" },
  email: { tab: "contactInfoTab", fa: "" },
  address: { tab: "contactInfoTab", fa: "" },
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

export {
  removeTabNames,
  removePropertyFromObj,
  setOriginFileObj,
  appendToFormData,
  handleGetSingleRightFull,
  changePropertyName,
  addTabName,
  setFileInputValue,
};
