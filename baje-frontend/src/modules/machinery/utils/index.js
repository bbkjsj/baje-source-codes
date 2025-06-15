import React from "react";
import axios from "api/appAxios";
import { element } from "prop-types";
import { showMessage } from "utils/message";
import {
  dateTypeTranslator,
  gearBoxTranslator,
  plateStatusConstant,
  StatusTranslator,
} from "../constant";
import {
  ADD_MACHINE,
  GET_CONTRACT_LIST,
  GET_MACHINE,
  GET_RELATED_SYSTEM_LIST,
  GET_RELATED_TIP_LIST,
  GET_TIP_LIST,
  GET_TYPE_LIST,
  GET_MACHINE_LIST,
  DELETE_MACHINE,
  EDIT_MACHINE,
  GET_COMPANY_INFO,
  GET_SYSTEM_LIST,
  GET_ALL_MACHINE,
} from "./api";

// [{id: 10, title: 'tip2'}] => [{id: 10, title: 'tip2',key: 10 , value:'tip2'}]
const convertListToOption = (list) => {
  let newList = [];
  if (list) {
    newList = list.map((el) => {
      return { ...el, value: el.id, key: el.id, label: el.title };
    });
  }

  return newList;
};

export const getContractList = async (id, setContractList) => {
  try {
    const res = await GET_CONTRACT_LIST({ type: "main", id });
    setContractList(convertListToOptionContract(res.data.list));
  } catch (error) {
    console.log(error);
  }
};

const convertListToOptionContract = (list) => {
  let newList = [];
  if (list) {
    newList = list.map((el) => {
      return { ...el, value: el.id, label: el.subject, title: el.subject };
    });
  }

  return newList;
};

export const getDefaultOwner = (id, setDefault) => {
  GET_COMPANY_INFO(id).then((res) => {
    setDefault(res?.data?.company?.national_id);
  });
};

//machine
const showMachineHandler = (
  setMachine,
  setPropertyList,
  setError,
  ID,
  setLoading
) => {
  setLoading(true);
  GET_MACHINE(ID)
    .then((res) => {
      const machine = res.data[0];
      setMachine(machine);

      const newList = [
        {
          name: "مالک",
          value:
            machine.ownerType === "company"
              ? machine.ownerCompanyName
              : `${machine.ownerFirstName} ${machine.ownerLastName}`,
        },
        {
          name: "وضعیت",
          value: StatusTranslator(machine.status),
        },
        { name: "کد سازمانی", value: machine.organizationCode },
        {
          name: "پلاک",
          value:
            machine.plaque1 && machine.plaque1 != -1
              ? `${machine["plaque3"]}-${machine["plaque4"]}-${machine["plaque2"]}-${machine["plaque1"]}`
              : null,
        },
        {
          name: "شماره موتور",
          value: machine.engineNumber,
        },
        {
          name: "شماره شاسی",
          value: machine.chassisNumber,
        },
        {
          name: "سریال پشت کارت",
          value: machine.serialNumber,
        },
        {
          name: "سال ساخت",
          value: machine.madeYear + " " + dateTypeTranslator(machine.dateType),
        },
        { name: "رنگ", value: machine.color },
        {
          name: "قیمت",
          value: String(machine.price).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        },
        {
          name: "توضیحات",
          value: machine.description,
        },
        {
          name: "کارت ماشین",
          value: machine.cardUrl,
          url: true,
        },
        {
          name: "کارت سبز",
          value: machine.greenCardUrl,
          url: true,
        },
        {
          name: "سند مالکیت",
          value: machine.ownershipDocumentUrl,
          url: true,
        },
        {
          name: "تیپ",
          value: machine.style,
        },
        {
          name: "سیستم",
          value: machine.system,
        },
        {
          name: "نوع",
          value: machine.type,
        },
        {
          name: "گیربکس",
          value: gearBoxTranslator(machine.gearBox),
        },
        {
          name: "VIN",
          value: machine.vinNumber,
        },
      ];
      setPropertyList(newList);
      setLoading(false);
    })
    .catch((err) => {
      setLoading(false);
      setError();
    });
};

const getMachineList = async (
  setList,
  setLoading,
  contractID,
  officeID,
  environmentId,
  setInitialList,
  setFilterOptions
) => {
  try {
    const res = await GET_MACHINE_LIST(officeID, contractID, environmentId);

    setList(res.data);
    if (setInitialList) setInitialList(res.data);

    if (setFilterOptions) {
      // set options, remove duplicates
      const style = res.data
        .map((i) => ({ text: i.style, value: i.style }))
        .filter((v, i, a) => a.findIndex((v2) => v2.value === v.value) === i);
      const system = res.data
        .map((i) => ({ text: i.system, value: i.system }))
        .filter((v, i, a) => a.findIndex((v2) => v2.value === v.value) === i);
      const type = res.data
        .map((i) => ({ text: i.type, value: i.type }))
        .filter((v, i, a) => a.findIndex((v2) => v2.value === v.value) === i);

      const filterOptions = { style, system, type };
      setFilterOptions(filterOptions);
    }
    setLoading(false);
  } catch (error) {
    console.error("machinery:", error.message);
  }
};

const getAllMachineList = async (
  setList,
  setLoading,
  contractID,
  officeID,
  environmentId,
  setExport,
  setInitialList,
  setFilterOptions
) => {
  try {
    const res = await GET_ALL_MACHINE();

    setList(res.data);
    if (setInitialList) setInitialList(res.data);

    setExport(res.data.export);

    if (setFilterOptions) {
      // set options, remove duplicates
      const style = res.data
        .map((i) => ({ text: i.style, value: i.style }))
        .filter((v, i, a) => a.findIndex((v2) => v2.value === v.value) === i);
      const system = res.data
        .map((i) => ({ text: i.system, value: i.system }))
        .filter((v, i, a) => a.findIndex((v2) => v2.value === v.value) === i);
      const type = res.data
        .map((i) => ({ text: i.type, value: i.type }))
        .filter((v, i, a) => a.findIndex((v2) => v2.value === v.value) === i);

      const filterOptions = { style, system, type };
      setFilterOptions(filterOptions);
    }
    setLoading(false);
  } catch (error) {
    console.error("machinery:", error.message);
  }
};

const deleteMachineHandler = (list, setLoading, success, getList) => {
  setLoading(true);
  const ids = list.map((el) => el.id.toString());
  DELETE_MACHINE(ids)
    .then((res) => {
      setLoading(false);

      if (res?.data?.deletedItems > 0) {
        success();
        window.location.reload();
      } else
        showMessage(
          <div>
            برای این ماشین در جداول زیر رکورد ثبت شده است و امکان پاک کردن آن
            وجود ندارد:
            <ul>
              <li>جدول بازرسی های HSE</li>
              <li>جدول بیمه های شخص ثالث</li>
            </ul>
          </div>,
          "error"
        );
    })
    .catch((err) => {
      setLoading(false);
    });
};

const addMachineHandler = async (
  values,
  owner,
  officeId,
  plateStatus,
  setLoading,
  successFulMessage,
  history
) => {
  setLoading(true);

  try {
    if (owner) {
      values.ownerType = owner.type;
      delete values.owner_code;
      delete values.owner_name;
    }

    delete values.license_plate_status;

    if (plateStatus === plateStatusConstant.WITHOUT_LICENSE_PLATE) {
      values.plaque1 = -1;
      values.plaque2 = "";
      values.plaque3 = -1;
      values.plaque4 = -1;
    }

    values.companyId = officeId;

    if (values.price) {
      values.price = values.price.toString().replace(/\$\s?|(,*)/g, "");
    }

    for (const key in values) {
      if (Object.hasOwnProperty.call(values, key)) {
        values[key] = values[key]?.toString();
      }
    }

    console.log(plateStatus, values, "add-machine-body");
    const res = await ADD_MACHINE(values);

    successFulMessage();
    history.goBack();
  } catch (error) {
    console.log(error);
  }
  setLoading(false);
};

export const onFinishUpdate = async (
  values,
  owner,
  plateStatus,
  setLoading,
  successFulMessage,
  machineID,
  currentOffice,
  allData
) => {
  setLoading(true);
  try {
    delete values.license_plate_status;
    if (owner) {
      values.ownerType = owner.type;
      delete values.owner_code;
    }
    delete values.owner_name;

    if (plateStatus) {
      values.plaque1 =
        plateStatus === plateStatusConstant.WITHOUT_LICENSE_PLATE
          ? "-1"
          : values.plaque1;

      values.plaque2 =
        plateStatus === plateStatusConstant.WITHOUT_LICENSE_PLATE
          ? ""
          : values.plaque2;
      values.plaque3 =
        plateStatus === plateStatusConstant.WITHOUT_LICENSE_PLATE
          ? "-1"
          : values.plaque3;
      values.plaque4 =
        plateStatus === plateStatusConstant.WITHOUT_LICENSE_PLATE
          ? "-1"
          : values.plaque4;
    }

    // values.companyId = currentOffice;

    if (values.price) {
      values.price = values.price.toString().replace(/\$\s?|(,*)/g, "");
    } else {
      delete values.price;
    }

    const formData = new FormData();

    for (const key in values) {
      if (
        key === "vehicleCard" ||
        key === "ownDoc" ||
        key === "vehicleGreenCard"
      ) {
        console.log(key, element);
        if (values[key] && values[key] !== undefined) {
          formData.append(key, values[key]);
        }
      } else {
        formData.append(key, values[key] ? values[key].toString() : "");
      }
    }
    console.log(values, "edit-machine-values");
    const res = await EDIT_MACHINE(machineID, formData);
    successFulMessage();
  } catch (error) {}
  setLoading(false);
};

export const getMachineData = (id) => {
  return new Promise((resolve, reject) => {
    GET_MACHINE(id)
      .then((res) => {
        console.log(res, "res-machin");
        let data = { ...res.data[0] };
        // data.system_id = data.system_id_fk;
        // data.style_id = data.style_id_fk;
        // data.type_id = data.type_id_fk;
        // data.contract_id = data.contract_id_fk;
        data.status_pelak = res.data.pelak;
        if (data.plaque1 == -1) data.plaque1 = null;
        if (data.plaque3 == -1) data.plaque3 = null;
        if (data.plaque4 == -1) data.plaque4 = null;

        resolve(data);
      })

      .catch((err) => {
        console.log("err", err);
      });
  });
};

//type
const getTypeListHandler = async (setTypeList) => {
  try {
    const res = await GET_TYPE_LIST();
    const sorted = convertListToOption(res.data).sort((a, b) =>
      a.title.localeCompare(b.title)
    );

    setTypeList(sorted);
    return res;
  } catch (error) {
    console.log(error);
  }
};

//system
const getRelatedSystemListHandler = async (id, setSystemList) => {
  try {
    const res = await GET_RELATED_SYSTEM_LIST(id);
    const sorted = convertListToOption(res.data).sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    setSystemList(convertListToOption(sorted));
  } catch (error) {
    console.log(error);
  }
};

const getSystemListHandler = async (setSystemList, setLoading) => {
  try {
    const res = await GET_SYSTEM_LIST();
    if (res.status !== 200) {
      setLoading(false);
    }
    const sorted = convertListToOption(res.data).sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    setSystemList(convertListToOption(sorted));
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
};

//tip
const getTipListHandler = async (id, setTipList) => {
  try {
    const res = await GET_RELATED_TIP_LIST(id);
    const sorted = convertListToOption(res.data).sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    setTipList(sorted);
  } catch (error) {
    console.log(error);
  }
};

const onTypeChange = (
  typeId,
  form,
  setPlateStatus,
  setSystemList,
  setTipList,
  typeList,
  systemList
) => {
  if (typeId && !systemList?.length) {
    const typeIndex = typeList.findIndex((el) => el.id === typeId && el.pelak);
    if (typeIndex != -1) {
      setPlateStatus(plateStatusConstant.WITH_LICENSE_PLATE);
    } else {
      setPlateStatus(plateStatusConstant.WITHOUT_LICENSE_PLATE);
    }

    form.setFieldsValue({ systemId: null, styleId: null });
    getRelatedSystemListHandler(typeId, setSystemList);
    setTipList([]);
  }
};

const onSystemChange = (systemId, form, setTipList) => {
  if (systemId) {
    form.setFieldsValue({ styleId: null });
    getTipListHandler(systemId, setTipList);
  }
};

export {
  showMachineHandler,
  getMachineList,
  deleteMachineHandler,
  addMachineHandler,
  getTypeListHandler,
  getRelatedSystemListHandler,
  getTipListHandler,
  onTypeChange,
  onSystemChange,
  getSystemListHandler,
  getAllMachineList,
};
