import * as api from "./api";
import { aliasContractTypes, contractTypes } from "./constant";
import {
  convertDateToEN,
  convertDateToISO8601,
  covetFormatDateToFA,
  timeToFa,
} from "_helpers";
import { showMessage } from "utils/message";
import * as actions from "../utils/actions";
import { pageNames } from "constant";

export const getList = async (
  setList,
  error,
  type,
  setLoading,
  officeID,
  setExportKey
) => {
  setLoading(true);

  try {
    const res = await api.GET_LIST({ type, id: officeID });
    setLoading(false);
    setList(res.data);
    setExportKey(res.data.export);
  } catch (err) {
    setLoading(false);
    error();
  }
};

export const deleteContract = async (ids, setLoading) => {
  setLoading(true);
  try {
    const res = await api.DELETE_CONTRACT(ids);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const onValuesChange = (values, dispatch, form) => {
  if (values && values.hasOwnProperty("subject")) {
    const subject = form.getFieldValue("subject").trim();

    if (subject === "دفتر ستاد" || subject === "دفترستاد") {
      form.setFieldsValue({ row: "000" });

      dispatch(actions.setSubject("دفتر ستاد"));
    } else {
      dispatch(actions.setSubject(null));
    }
  }
  const { type } = values;
  if (type) {
    if (
      type === contractTypes.MAIN_CIVIL ||
      type === contractTypes.MAIN_NON_CIVIL
    ) {
      dispatch(actions.setContractType(aliasContractTypes.MAIN_CONTRACT));
    } else {
      dispatch(actions.setContractType(aliasContractTypes.SUBSIDIARY_CONTRACT));
      form.setFieldsValue({ mainContractId: "" });
    }
  }

  // handle rial and time weights change to update each other
  if (values.hasOwnProperty("timeWeight")) {
    if (values["timeWeight"] >= 0 && values["timeWeight"] <= 100) {
      form.setFieldsValue({ rialWeight: 100 - values["timeWeight"] });
    }
  }

  if (values.hasOwnProperty("rialWeight")) {
    if (values["rialWeight"] >= 0 && values["rialWeight"] <= 100) {
      form.setFieldsValue({ timeWeight: 100 - values["rialWeight"] });
    }
  }
};

export const getOfficesList = async () => {
  try {
    const res = await api.GET_COMPANIES();
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const prepareDataForAdd = ({
  values,
  contractor,
  contractType,
  manager,
  boss,
  currentOffice,
  oldId,
  edit = false,
  employer,
}) => {
  if (contractor) {
    values.contractorId = contractor.id;
    values.contractorType = contractor.type;
  } else {
    values.contractorType = "company";
  }

  if (employer) {
    values.employerId = employer.id;
  }

  if (contractType === aliasContractTypes.MAIN_CONTRACT) {
    if (manager) {
      values.managerId = manager.id;
    }
    if (boss) {
      values.bossId = boss.id;
    }
    //values.employerId = -1;
  }

  if (values.mainContract) {
    values.mainContractId = values.mainContract;
  }

  delete values.mainContract;
  delete values.boss;
  delete values.bossName;
  delete values.manager;
  delete values.managerName;
  delete values.contractorName;
  if (edit) {
    delete values.date;
  }

  if (values.initialAmount) {
    values.initialAmount = String(values.initialAmount).replace(
      /\$\s?|(,*)/g,
      ""
    );
  }
  if (values.date) {
    values.date = convertDateToISO8601(values.date);
  }
  if (values.startDate) {
    values.startDate = convertDateToISO8601(values.startDate);
  }

  if (values.endDate) {
    values.endDate = convertDateToISO8601(values.endDate);
  }

  if (values.initialAmount) {
    values.initialAmount = Number(values.initialAmount);
  }
  if (values.adjustmentBaseIndex) {
    values.adjustmentBaseIndex = Number(values.adjustmentBaseIndex);
  }
  if (values.timeWeight) {
    values.timeWeight = Number(values.timeWeight);
  }
  if (values.rialWeight) {
    values.rialWeight = Number(values.rialWeight);
  }
  values.companyId = currentOffice;

  values.oldContractorId = oldId;

  return values;
};

export const AddContractHandler = async ({
  values,
  contractor,
  manager,
  boss,
  contractType,
  dispatch,
  currentOffice,
  history,
  edit = false,
  id,
  oldId,
  employer,
}) => {
  dispatch(actions.setLoading(true));
  const data = prepareDataForAdd({
    values,
    contractor,
    contractType,
    manager,
    boss,
    currentOffice,
    oldId,
    edit,
    employer,
  });

  if (data.contractorFiled) {
    data.contractor = data.contractorFiled;
    delete data.contractorFiled;
  }

  if (data.employerFiled) {
    data.employer = data.employerFiled;
    delete data.employerFiled;
  }
  if (data.employerName) {
    delete data.employerName;
  }

  console.log(data);
  // console.log(data);

  let request;
  if (!edit) {
    request = api.ADD_CONTRACT(data);
  } else if (id) {
    data.oldContractorId = data?.contractorId;
    request = api.EDIT_CONTRACT(data, id);
  }

  request
    .then((res) => {
      showMessage("با موفقیت انجام شد", "success");
      history.goBack();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      dispatch(actions.setLoading(false));
    });
};

const prepareDataForEdit = (
  values,
  contractor,
  contractType,
  manager,
  boss,
  employerID,
  mainContractId,
  oldContractorID,
  contractID
) => {
  if (contractor) {
    values.contractorId = contractor.id;
    values.contractorType = contractor.type;
  } else {
    values.contractor_type = "company";
  }

  if (contractType === aliasContractTypes.MAIN_CONTRACT) {
    if (manager) {
      values.managerId = manager.id;
    }
    if (boss) {
      values.bossId = boss.id;
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
  if (values.date) {
    values.date = convertDateToISO8601(values.date);
  }
  if (values.start_date) {
    values.start_date = convertDateToISO8601(values.start_date);
  }

  if (values.finish_date) {
    values.finish_date = convertDateToISO8601(values.finish_date);
  }

  values.old_contractor_id = oldContractorID;

  return values;
};

export const EditContractHandler = async (
  values,
  contractor,
  manager,
  boss,
  contractType,
  history,
  dispatch,
  contractID,
  oldContractorID,
  employerID,
  mainContractId
) => {
  try {
    dispatch(actions.setLoading(true));
    const data = prepareDataForEdit(
      values,
      contractor,
      contractType,
      manager,
      boss,
      employerID,
      mainContractId,
      oldContractorID,
      contractID
    );

    const res = await api.EDIT_CONTRACT(data);
    dispatch(actions.setLoading(false));
    showMessage("با موفقیت انجام شد", "success");
    history.push(pageNames.contract.list);
  } catch (error) {
    dispatch(actions.setLoading(false));
  }
};

export const getContractHandler = async (handleSetContract, ID, dispatch) => {
  try {
    dispatch(actions.setLoading(true));
    const res = await api.GET_CONTRACT(ID);
    dispatch(actions.setLoading(false));
    //
    let contract = { ...res.data };
    contract.date = timeToFa(contract.date, false);
    contract.endDate = timeToFa(contract.endDate, false);
    if (contract.initialAmount)
      contract.initialAmount = contract.initialAmount
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    contract.contractorCode =
      contract.contractorType == "company"
        ? contract.nationalId
        : contract.nationalNumber;
    contract.contractorName = contract.name;

    contract.bossCode = contract.bossId;
    contract.bossName = contract.bossId;
    contract.boss = contract.bossId;
    contract.manager = contract.managerId;
    contract.managerName = contract.managerId;

    if (contract?.priceListParts && contract?.priceListParts.includes(",")) {
      contract.priceListParts = contract.priceListParts
        .split(",")
        .map((i) => Number(i));
    } else if (contract?.priceListParts?.length === 1) {
      contract.priceListParts = [Number(contract?.priceListParts)];
    }

    if (contract.contractorId) {
      dispatch(
        actions.setContractor({
          id: contract.contractorId,
          type: contract.contractorType,
        })
      );
    }
    if (contract.bossId) {
      dispatch(actions.setContractor({ id: contract.bossId }));
    }

    if (contract.managerId) {
      dispatch(actions.setContractor({ id: contract.managerId }));
    }

    handleSetContract({
      ...contract,
      startDate: timeToFa(res.data.startDate, false),
    });
  } catch (error) {
    dispatch(actions.setLoading(false));
  }

  //
  //
};

export const handleTypeOfContract = (value) => {
  if (value.substr(5) === "civil" || value.substr(4) === "civil") {
    return "civil";
  } else {
    return "non_civil";
  }
};
