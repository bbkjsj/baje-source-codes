import React from "react";
import { permission } from "json/Permission";
import { covetFormatDateToEn, covetFormatDateToFA, getLink } from "_helpers";
import { pageNames } from "constant";
import TableActions from "components/general/TableActions";
import { Input, Menu, message, Modal } from "antd";
import AppMenuItem from "components/general/AppMenuItem";
import { additionalTypes } from "../constant";
import TableHeaderInput from "./TableHeaderInput";
import styles from "./RealPersonList.module.css";
import { changeStatus } from "modules/dashboard/utils";
import { UPDATE_PERSON_STATUS } from "../utils/api";
import TableHeaderSelect from "./TableHeaderSelect";

const { EDIT_PERSON, DELETE_PERSON } = permission;
const wrongText = <p className="wrong-text-info">ثبت نشده است</p>;

const personnelStatus = {
  NOT_APPROVED: { key: "not_approved", farsi: "عدم تایید" },
  REGISTERED_VIA_FORM: {
    key: "registered_via_form",
    farsi: "نامنویسی از طریق فرم",
  },
  REGISTERED_BY_OPERATOR: {
    key: "registered_by_operator",
    farsi: "نامنویسی توسط پرسنل",
  },
  EDIT_REQUESTED_BY_OPERATOR: {
    key: "edit_requested_by_operator",
    farsi: "درخواست ویرایش توسط پرسنل",
  },
  APPROVED_BY_USER: { key: "approved_by_user", farsi: "تایید کاربر" },
  APPROVED_BY_PERSONNEL: { key: "approved_by_personnel", farsi: "تایید پرسنل" },
  APPROVED_BY_OFFICE: { key: "approved_by_office", farsi: "تایید ثبت احوال" },
};

export const columns = (
  handleDelete,
  history,
  list,
  tableSearch,
  tableInfo,
  setTableInfo,
  disabledFilters,
  searchParams,
  onDisplayUserModal,
  getList,
  checkAccess,
  setList,
  setUserID,
  setFamilyModal
) => {
  const generateIcons = (record) => {
    const list = [
      {
        name: "detail",
        onClick: () =>
          history.push(getLink(pageNames.personnel.realPerson.view, record.id)),
      },
      {
        name: "edit",
        onClick: () =>
          history.push(getLink(pageNames.personnel.realPerson.edit, record.id)),
        permission: EDIT_PERSON,
      },
      {
        name: "delete",
        onClick: () => handleDelete([record.id]),
        permission: DELETE_PERSON,
      },
    ];
    return list;
  };
  const otherActions = (record) => {
    const actionItems = [
      {
        title: "مشاهده",
        onClick: () => {
          history.push(getLink(pageNames.personnel.realPerson.view, record.id));
        },
      },
      {
        title: "ویرایش",
        onClick: () => {
          history.push(getLink(pageNames.personnel.realPerson.edit, record.id));
        },
        hidden: !checkAccess(EDIT_PERSON),
      },
      {
        title: "حذف",
        onClick: () => {
          handleDelete([record.id]);
        },
        hidden: !checkAccess(DELETE_PERSON),
      },
      {
        title: "اطلاعات تماس ",
        onClick: () => {
          onDisplayUserModal(additionalTypes.CONTACT, record.id);
        },
      },
      {
        title: "حساب های بانکی",
        onClick: () => {
          onDisplayUserModal(additionalTypes.BANK_ACCOUNTS, record.id);
        },
      },
      {
        title: "اسناد",
        onClick: () => {
          onDisplayUserModal(additionalTypes.DOCUMENTS, record.id);
        },
      },
      {
        title: "دسترسی‌ها",
        // onClick: () => {
        //   onDisplayUserModal(additionalTypes.ACCESS_LEVEL, record.id);
        // },
        onClick: () => {
          history.push(getLink(pageNames.permissions.person.list, record.id));
        },
      },
      {
        title: "اطلاعات کاربری",
        onClick: () => {
          onDisplayUserModal(additionalTypes.USER_ACCOUNT, record.id);
        },
      },
      {
        title: "اطلاعات بیمه",
        onClick: () => {
          onDisplayUserModal(additionalTypes.INSURANCE_INFO, record.id);
        },
      },
      {
        onClick: () => {
          history.push(
            getLink(pageNames.personnel.realPerson.resume.list, record.id)
          );
        },
        title: "مشاغل و رزومه",
      },
      {
        title: "متفرقه",
        onClick: () => {
          onDisplayUserModal(additionalTypes.OTHER_INFO, record.id);
        },
      },
      {
        title: "خانواده",
        onClick: () => {
          setUserID(record.id);
          setFamilyModal(true);
        },
      },
      {
        title: "تایید نهایی اطلاعات",
        onClick: () => {
          changeUserStatus(record.id, personnelStatus.APPROVED_BY_USER);
        },
        hidden:
          record.status === personnelStatus.APPROVED_BY_USER.key ||
          record.status === personnelStatus.APPROVED_BY_PERSONNEL.key ||
          record.status === personnelStatus.APPROVED_BY_OFFICE.key,
      },
      // {
      //   title: "استعلام از ثبت احوال",
      //   onClick: () => {},
      // },
    ];

    return actionItems.filter((item) => !item.hidden).length ? (
      <Menu>
        {actionItems.map((item) => (
          <AppMenuItem
            key={item.title}
            onClick={item.onClick}
            hidden={item.hidden}
          >
            {item.title}
          </AppMenuItem>
        ))}
      </Menu>
    ) : (
      false
    );
  };

  function changeUserStatus(id, status) {
    Modal.confirm({
      title: "تغییر وضعیت",
      content: "آیا از تغییر وضعیت این کاربر اطمینان دارید؟",
      onOk: () => {
        UPDATE_PERSON_STATUS(id, { status: status.key }).then(() => {
          message.success("با موفقیت انجام شد");
          getList();
        });
      },
    });
  }

  const oldCols = [
    {
      placeholder: "ردیف",
      title: "",
      align: "center",
      key: "number",
      dataIndex: "number",
      render: (text, record, index) => {
        const currPage = tableInfo?.pagination?.current || 1;
        const pageSize = tableInfo?.pagination?.pageSize || 20;
        const prevTotal = (currPage - 1) * pageSize;

        return prevTotal + index + 1;
      },
    },
    {
      placeholder: "کد ملی",
      // title: "شماره ملی",
      title: (
        <TableHeaderInput
          placeholder="کد ملی"
          dataIndex="national_number"
          setTableInfo={setTableInfo}
          tableInfo={tableInfo}
        />
      ),
      className: styles.test,
      dataIndex: "national_number",
      key: "national_number",

      sorter: (a, b) =>
        a.national_number ? a.national_number - b.national_number : false,
    },
    {
      placeholder: "نام",
      dataIndex: "first_name",
      key: "first_name",
      title: (
        <TableHeaderInput
          placeholder="نام"
          dataIndex="first_name"
          setTableInfo={setTableInfo}
          tableInfo={tableInfo}
        />
      ),
      sorter: (a, b) =>
        a.first_name ? a.first_name.localeCompare(b.first_name) : false,

      defaultFilteredValue:
        searchParams && searchParams.first_name
          ? [searchParams.first_name]
          : null,

      defaultSortOrder:
        searchParams && searchParams.sort === "first_name"
          ? searchParams?.sort_order || "ascend"
          : null,
    },
    {
      placeholder: "نام خانوادگی",
      title: (
        <TableHeaderInput
          placeholder="نام خانوادگی"
          dataIndex="last_name"
          setTableInfo={setTableInfo}
          tableInfo={tableInfo}
        />
      ),
      dataIndex: "last_name",
      key: "last_name",

      sorter: (a, b) =>
        a.last_name ? a.last_name.localeCompare(b.last_name) : false,
    },
    {
      placeholder: "نام پدر",
      title: (
        <TableHeaderInput
          placeholder="نام پدر"
          dataIndex="father_name"
          setTableInfo={setTableInfo}
          tableInfo={tableInfo}
        />
      ),
      dataIndex: "father_name",
      key: "father_name",
      sorter: (a, b) =>
        a.father_name ? a.father_name.localeCompare(b.father_name) : false,
    },
    {
      placeholder: "شماره شناسنامه",
      title: (
        <TableHeaderInput
          placeholder="شماره شناسنامه"
          dataIndex="id_number"
          setTableInfo={setTableInfo}
          tableInfo={tableInfo}
        />
      ),
      dataIndex: "id_number",
      key: "id_number",
      sorter: (a, b) =>
        a.id_number ? a.id_number.localeCompare(b.id_number) : false,
    },
    {
      placeholder: "تاریخ تولد ",
      title: (
        <TableHeaderInput
          placeholder="تاریخ تولد"
          dataIndex="birth_date"
          setTableInfo={setTableInfo}
          tableInfo={tableInfo}
        />
      ),
      dataIndex: "birth_date",
      key: "birth_date",
      sorter: (a, b) => (a.birth_date ? a.birth_date - b.birth_date : false),
      render: (text, record) => {
        return <span>{text ? covetFormatDateToFA(text) : "–"}</span>;
      },
    },

    {
      placeholder: "موبایل",
      title: (
        <TableHeaderInput
          placeholder="موبایل"
          dataIndex="mobile1"
          setTableInfo={setTableInfo}
          tableInfo={tableInfo}
        />
      ),
      dataIndex: "mobile1",
      key: "mobile1",

      // render: (text, record) => {
      //   if (record.mobile1) {
      //     return `${record.mobile1}`;
      //   } else {
      //     return wrongText;
      //   }
      // },

      render: (text, record) => {
        return <span>{text ? text : "–"}</span>;
      },
      sorter: (a, b) => (a.mobile1 ? a.mobile1 - b.mobile1 : false),
    },
    {
      placeholder: "شماره بیمه",
      title: (
        <TableHeaderInput
          placeholder="شماره بیمه"
          dataIndex="insurance_number"
          setTableInfo={setTableInfo}
          tableInfo={tableInfo}
        />
      ),
      dataIndex: "insurance_number",
      key: "insurance_number",
      sorter: (a, b) =>
        a.insurance_number ? a.insurance_number - b.insurance_number : false,
      render: (text, record) => {
        return <span>{text ? text : "–"}</span>;
      },
    },
    {
      placeholder: "نام شرکت",
      title: (
        <TableHeaderInput
          placeholder="نام شرکت"
          dataIndex="company_name"
          setTableInfo={setTableInfo}
          tableInfo={tableInfo}
        />
      ),
      dataIndex: "company_name",
      key: "company_name",
      sorter: (a, b) =>
        a.company_name ? a.company_name.localeCompare(b.company_name) : false,
    },
    {
      placeholder: "پروژه",
      title: (
        <TableHeaderInput
          placeholder="پروژه"
          dataIndex="contract_subject"
          setTableInfo={setTableInfo}
          tableInfo={tableInfo}
        />
      ),
      dataIndex: "contract_subject",
      key: "contract_subject",
      sorter: (a, b) =>
        a.contract_subject
          ? a.contract_subject.localeCompare(b.contract_subject)
          : false,
    },

    {
      placeholder: "وضعیت تایید",
      align: "center",
      title: (
        <TableHeaderSelect
          placeholder="وضعیت"
          dataIndex="status"
          setTableInfo={setTableInfo}
          tableInfo={tableInfo}
          options={[
            { value: null, label: "همه" },
            { value: "not_approved", label: "عدم تایید" },
            {
              value: "registered_via_form",
              label: "نامنویسی از طریق فرم",
            },
            {
              value: "registered_by_operator",
              label: "نامنویسی توسط پرسنل",
            },
            {
              value: "edit_requested_by_operator",
              label: "درخواست ویرایش توسط پرسنل",
            },
            { value: "approved_by_user", label: "تایید کاربر" },
            { value: "approved_by_personnel", label: "تایید پرسنل" },
            { value: "approved_by_office", label: "تایید ثبت احوال" },
          ]}
        />
      ),
      key: "status",
      dataIndex: "status",
      render: (text, record) => {
        if (!record.status || record.status === "null") {
          return <span>نامشخص</span>;
        }
        const findStatus = Object.values(personnelStatus).find(
          (i) => i.key === record.status
        );
        return findStatus.farsi || "نامشخص";
      },
    },
    {
      placeholder: "عملیات",
      align: "center",
      title: "عملیات",
      key: "action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <TableActions
            list={[]}
            record={record}
            moreMenu={otherActions(record)}
            contractKey="contract_id"
          />
        );
      },
    },
  ];

  return oldCols;

  // columns = columns.map((column) => {
  //   return {
  //     ...column,
  //     defaultFilteredValue:
  //       searchParams && searchParams[column?.dataIndex]
  //         ? [searchParams[column?.dataIndex]]
  //         : null,
  //     defaultSortOrder:
  //       searchParams && searchParams.sort === column?.dataIndex
  //         ? searchParams?.sort_order || "ascend"
  //         : null,
  //   };
  // });

  // return columns;
};
