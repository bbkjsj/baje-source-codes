import axios from "api/appAxios";
import { convertDateToEN } from "../../../_helpers";

export const constants = {
  MAIN_CONTRACT: "main",
  SUBSIDIARY_CONTRACT: "subsidiary",
};

export const onFinishUpdate = (
  values,
  contractor,
  manager,
  boss,
  contractType,
  setLoading,
  successFulMessage,
  errorMessage,
  contractID,
  oldContractorID,
  employerID,
  mainContractId
) => {
  setLoading(true);
  if (contractor) {
    values.contractor_id = contractor.id;
    values.contractor_type = contractor.type;
  } else {
    values.contractor_type = "company";
  }

  if (contractType === constants.MAIN_CONTRACT) {
    if (manager) {
      values.manager_id = manager.id;
    }
    if (boss) {
      values.boss_id = boss.id;
    }
    if (employerID) {
      values.employer_id = employerID;
      delete values.employer;
    } else values.employer_id = -1;
  }

  if (values.main_contract) {
    values.main_contract_id = values.main_contract;
  }

  if (mainContractId) {
    values.main_contract_id = mainContractId;
  }

  values.id = contractID;

  delete values.manager_national_ic;
  delete values.main_contract;
  delete values.boss;
  delete values.boss_name;
  delete values.manager;
  delete values.manager_name;
  delete values.contractor_filed;
  delete values.contractor_name;

  if (values.initial_amount) {
    values.initial_amount = values.initial_amount.replace(/\$\s?|(,*)/g, "");
  }
  if (values.contract_date) {
    values.contract_date = convertDateToEN(values.contract_date);
  }
  if (values.start_date) {
    values.start_date = convertDateToEN(values.start_date);
  }

  if (values.finish_date) {
    values.finish_date = convertDateToEN(values.finish_date);
  }

  values.old_contractor_id = oldContractorID;
  // console.log(values, "!values");

  axios({
    method: "post",
    url: "/api/admin/contract/edit",
    data: values,
  })
    .then((res) => {
      setLoading(false);
      successFulMessage("با موفقیت انجام شد");
    })
    .catch((error) => {
      if (error.response) {
        setLoading(false);
        errorMessage(error?.response?.data);
      }
    });
};

export const onFinish = (
  values,
  contractor,
  manager,
  boss,
  contractType,
  setLoading,
  successFulMessage,
  errorMessage,
  currentOffice,
  employer
) => {
  console.log(values);
  // setLoading(true);
  // if (contractor) {
  //   values.contractor_id = contractor.id;
  //   values.contractor_type = contractor.type;
  // } else {
  //   values.contractor_type = "company";
  // }

  // if (employer) {
  //   values.employer_id = employer?.id;
  // }

  // if (contractType === constants.MAIN_CONTRACT) {
  //   if (manager) {
  //     values.manager_id = manager.id;
  //   }
  //   if (boss) {
  //     values.boss_id = boss.id;
  //   }
  //   //values.employer_id = -1;
  // }

  // if (values.main_contract) {
  //   values.main_contract_id = values.main_contract;
  // }

  // delete values.main_contract;
  // delete values.boss;
  // delete values.boss_name;
  // delete values.manager;
  // delete values.manager_name;
  // delete values.contractor_filed;
  // delete values.contractor_name;

  // if (values.initial_amount) {
  //   values.initial_amount = values.initial_amount.replace(/\$\s?|(,*)/g, "");
  // }
  // if (values.contract_date) {
  //   values.contract_date = convertDateToEN(values.contract_date);
  // }
  // if (values.start_date) {
  //   values.start_date = convertDateToEN(values.start_date);
  // }

  // if (values.finish_date) {
  //   values.finish_date = convertDateToEN(values.finish_date);
  // }
  // values.company_id = currentOffice;
  // // console.log(values, "!values");
  // axios({
  //   method: "post",
  //   url: "/api/admin/contract/add",
  //   data: values,
  // })
  //   .then((res) => {
  //     setLoading(false);
  //     successFulMessage("با موفقیت انجام شد");
  //   })
  //   .catch((error) => {
  //     if (error.response) {
  //       setLoading(false);
  //       errorMessage(error?.response?.data);
  //     }
  //   });
};

export const onValuesChange = (values, setTypeContract, form, setSubject) => {
  console.log(values, "!!!!!!val");
  if (values && values.hasOwnProperty("subject")) {
    const subject = form.getFieldValue("subject").trim();

    if (subject === "دفتر ستاد" || subject === "دفترستاد") {
      form.setFieldsValue({ row: "000" });
      setSubject("دفتر ستاد");
    } else setSubject(null);
  }
  const { type } = values;
  if (type) {
    if (type === "main_civil" || type === "main_non_civil") {
      setTypeContract(constants.MAIN_CONTRACT);
    } else {
      setTypeContract(constants.SUBSIDIARY_CONTRACT);
      form.setFieldsValue({ main_contract_id: "" });
    }
  }
};

export const getOfficesList = () => {
  return new Promise((resole, reject) => {
    axios
      .get("/api/v1/baje/company")
      .then((res) => {
        resole(res.data);
      })
      .catch((err) => {
        reject(err.msg);
      });
  });
};

export const handleTypeOfContract = (value) => {
  if (value.substr(5) === "civil" || value.substr(4) === "civil") {
    return "civil";
  } else {
    return "non_civil";
  }
};
