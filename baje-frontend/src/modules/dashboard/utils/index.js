import React from "react";
import { message } from "antd";
import { systemStatus } from "modules/dashboard/const";
import * as api from "./api";
import { NAMED_COLORS } from "modules/dashboard/const";
import { covetFormatDateToFA, getTodayDate } from "_helpers";
import { store } from "../../../store";
import TableActions from "components/general/TableActions";
import { GET_LIST } from "modules/contracts/utils/api";

export const onChangeContract = (e, setDisableBtn) => {
  setDisableBtn(!e);
};

export const getAllowedContracts = (companyId, type, activity = null) => {
  const payload = {
    type,
    id: companyId,
  };
  if (activity) {
    payload.activity = activity;
  }
  return GET_LIST(payload);
};

export const getTableData = async (
  getData,
  contarct_id,
  setDisableBtn,
  setList,
  setHash,
  setOperator,
  setManager,
  setCurrentPage,
  setLoading
) => {
  if (contarct_id) {
    setLoading(true);
    try {
      const res = await getData(contarct_id);

      const index = res?.data?.list?.length
        ? res.data.list.findIndex((record) => isToday(record.date))
        : 0;

      const perPage = window.localStorage.getItem("table_page_size") || 20;

      const current = Math.floor(index / perPage) + 1;
      setCurrentPage(current);
      setDisableBtn(true);
      setList(res?.data?.list);
      setHash(res?.data?.hash);
      if (res?.data?.operator?.first_name && res?.data?.operator?.last_name) {
        setOperator(
          res.data.operator.first_name + " " + res.data.operator.last_name
        );
      } else setOperator("نامشخص");

      setManager(
        res?.data?.contract?.manager_firstname +
          " " +
          res?.data?.contract?.manager_lastname
      );
      setLoading(false);
    } catch (error) {
      message.error("دریافت اطلاعات با مشکل مواجه شد");
      setLoading(false);
    }
  }
};

export const changeStatus = (
  record,
  status,
  onSuccess,
  onError,
  updateData
) => {
  const payload = {
    contractId: record.contract_id_fk,
    data: [
      {
        status,
        id: record.id,
      },
    ],
  };

  updateData(payload, onSuccess, onError);
};

export const newCheck = (access, contract) => {
  const user = store.getState().user;
  const userAccess = user?.access;
  const currentOffice = store.getState().currentOffice;

  if (Array.isArray(userAccess) && userAccess.length > 0) {
    return userAccess.find(
      (item) =>
        item.access == access &&
        item.contract_id == contract &&
        item.company_id == currentOffice
    );
  } else return false;
};

export const isToday = (date) => {
  return (
    new Date(date).toLocaleDateString() === new Date().toLocaleDateString()
  );
};

export const isUntilToday = (date) => {
  const recordFarsiDate = covetFormatDateToFA(date);
  const today = getTodayDate();
  // console.log(recordFarsiDate, today, recordFarsiDate <= today, "!");
  return recordFarsiDate <= today;
};

export const approaveHandler = (
  isSuperAdmin,
  isManager,
  record,
  getData,
  updateData
) => {
  const status =
    isManager || (isSuperAdmin && record.status === systemStatus.user_approaved)
      ? systemStatus.manager_approved
      : systemStatus.user_approaved;

  const onSuccess = () => successHandler(getData);

  changeStatus(record, status, onSuccess, errorHandler, updateData);
};

export const cancelApproveHandler = (
  isSuperAdmin,
  record,
  getData,
  updateData
) => {
  const onSuccess = () => successHandler(getData);

  const status =
    isSuperAdmin && record.status === systemStatus.manager_approved
      ? systemStatus.user_approaved
      : systemStatus.not_approved;

  changeStatus(record, status, onSuccess, errorHandler, updateData);
};

export const successHandler = (getData) => {
  message.success("اطلاعات با موفقیت ثبت شد!");
  getData();
};

export const errorHandler = () => {
  message.error("خطایی در ثبت اطلاعات رخ داده است!");
};

export const renderColumns = (
  list,
  displayForm,
  getData,
  onChangeStatus,
  columnsList,
  operatorAccess,
  managerAccess
) => {
  const user = store.getState().user;
  const isSuperAdmin = () => user?.isSuper;

  const hasEditAccess = (record) => {
    let allowedAccess = operatorAccess;

    return newCheck(allowedAccess, record.contract_id_fk);
  };
  const hasApproveAccess = (record) => {
    let allowedAccess = managerAccess;

    return newCheck(allowedAccess, record.contract_id_fk);
  };
  const approave = (record) => {
    approaveHandler(
      isSuperAdmin(),
      hasApproveAccess(record),
      record,
      getData,
      onChangeStatus
    );
  };

  const cancelApprove = (record) => {
    cancelApproveHandler(isSuperAdmin(), record, getData, onChangeStatus);
  };

  const generateIcons = (record) => {
    const canEdit = (record) => {
      return (
        ((isSuperAdmin() || hasEditAccess(record)) &&
          record.status === systemStatus.not_approved) ||
        ((isSuperAdmin() || hasApproveAccess(record)) &&
          record.status === systemStatus.user_approaved)
      );
    };

    const canInsertData = (record) => {
      return (
        (isSuperAdmin() || hasEditAccess(record)) &&
        !record.status &&
        isUntilToday(record.date)
      );
    };

    const canApprove = (record) => {
      return (
        ((isSuperAdmin() || hasEditAccess(record)) &&
          record.status === systemStatus.not_approved) ||
        ((isSuperAdmin() || hasApproveAccess(record)) &&
          record.status === systemStatus.user_approaved)
      );
    };

    const canDisApprove = (record) => {
      return (
        ((isSuperAdmin() || hasEditAccess(record)) &&
          record.status === systemStatus.user_approaved) ||
        (isSuperAdmin() && record.status === systemStatus.manager_approved)
      );
    };

    const list = [
      {
        name: "edit",
        onClick: () => displayForm(record),
        hide: !canEdit(record),
      },
      {
        name: "insertData",
        onClick: () => displayForm(record),
        hide: !canInsertData(record),
        children: " ورود اطلاعات",
        style: { width: "auto" },
        variant: "primary",
      },
      {
        name: "approve",
        onClick: () => approave(record),
        hide: !canApprove(record),
        children: "تأیید ",
        style: { width: "auto" },
        variant: "",
      },
      {
        name: "disApprove",
        onClick: () => cancelApprove(record),
        hide: !canDisApprove(record),
        children: "عدم تأیید",
        style: { width: "auto" },
        variant: "danger",
      },
    ];

    return list;
  };

  let columns = [
    ...columnsList,
    {
      title: "تنظیمات",
      key: "action",
      render: (text, record, index) => {
        return <TableActions list={generateIcons(record)} />;
      },
    },
  ];
  return columns;
};

export function namedColor(index) {
  return NAMED_COLORS[index % NAMED_COLORS.length];
}

export const mobileItemActions = (
  displayForm,
  getData,
  onChangeStatus,
  operatorAccess,
  managerAccess
) => {
  const user = store.getState().user;
  const isSuperAdmin = () => user?.isSuper;

  const hasEditAccess = (record) => {
    let allowedAccess = operatorAccess;

    return newCheck(allowedAccess, record.contract_id_fk);
  };
  const hasApproveAccess = (record) => {
    let allowedAccess = managerAccess;

    return newCheck(allowedAccess, record.contract_id_fk);
  };
  const approave = (record) => {
    approaveHandler(
      isSuperAdmin(),
      hasApproveAccess(record),
      record,
      getData,
      onChangeStatus
    );
  };

  const cancelApprove = (record) => {
    cancelApproveHandler(isSuperAdmin(), record, getData, onChangeStatus);
  };
  const canEdit = (record) => {
    return (
      ((isSuperAdmin() || hasEditAccess(record)) &&
        record.status === systemStatus.not_approved) ||
      ((isSuperAdmin() || hasApproveAccess(record)) &&
        record.status === systemStatus.user_approaved)
    );
  };

  const canInsertData = (record) => {
    return (
      (isSuperAdmin() || hasEditAccess(record)) &&
      !record.status &&
      isUntilToday(record.date)
    );
  };

  const canApprove = (record) => {
    return (
      ((isSuperAdmin() || hasEditAccess(record)) &&
        record.status === systemStatus.not_approved) ||
      ((isSuperAdmin() || hasApproveAccess(record)) &&
        record.status === systemStatus.user_approaved)
    );
  };

  const canDisApprove = (record) => {
    return (
      ((isSuperAdmin() || hasEditAccess(record)) &&
        record.status === systemStatus.user_approaved) ||
      (isSuperAdmin() && record.status === systemStatus.manager_approved)
    );
  };

  const list = [
    {
      name: "ویرایش",
      onClick: (record) => displayForm(record),
      hide: (record) => !canEdit(record),
    },
    {
      name: "ورود اطلاعات",
      onClick: (record) => displayForm(record),
      hide: (record) => !canInsertData(record),
    },
    {
      name: "تایید",
      onClick: (record) => approave(record),
      hide: (record) => !canApprove(record),
    },
    {
      name: "عدم تایید",
      onClick: (record) => cancelApprove(record),
      hide: (record) => !canDisApprove(record),
    },
  ];

  return list;
};
