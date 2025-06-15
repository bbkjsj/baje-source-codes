import { checkNationalId, checkFinanceCode, newRightFull } from "./API";
import { handleErrorMessage } from "_helpers";
const nationalIdValidation = () => ({
  validator(rule, value) {
    return new Promise((resolve, reject) => {
      if (value && value.length == 11) {
        checkNationalId(value)
          .then((res) => {
            resolve();
          })
          .catch(() => {
            reject("شناسه ملی تکراری است ");
          });
      } else {
        resolve();
      }
    });
  },
});

const financeCodeValidation = () => ({
  validator(rule, value) {
    return new Promise((resolve, reject) => {
      if (value && value.length == 12) {
        checkFinanceCode(value)
          .then((res) => {
            resolve();
          })
          .catch(() => {
            reject("کد اقتصادی تکراری است");
          });
      } else {
        resolve();
      }
    });
  },
});

const handleOnFailedForm = (data, changeTab, activeTab, setLoading) => {
  setLoading(false);
  let tabNames = [];
  for (let i = 0; i < data.errorFields.length; i++) {
    let tabName = data.errorFields[i].name[0].split("/")[1];
    tabNames.push(tabName);
  }
  if (tabNames.indexOf(activeTab) === -1) {
    changeTab(tabNames[0]);
  }
};

const handleNewRightFull = (data, handleSuccess, handleError) => {
  newRightFull(data)
    .then((result) => {
      handleSuccess("باموفقیت انجام شد.");
    })
    .catch((error) => {
      let message = handleErrorMessage(error);
      handleError(message);
    });
};

const handleSetManagerInfo = (form, id, name) => {
  form.setFieldsValue({
    "manager_national_id/initialDataTab": id,
    manager_name: name,
  });
};

export {
  handleOnFailedForm,
  financeCodeValidation,
  nationalIdValidation,
  handleNewRightFull,
  handleSetManagerInfo,
};
