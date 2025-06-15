import React, { useEffect, useState } from "react";
import {
  convertToShamsi,
  covetFormatDateToFA,
  dateToJalali,
  getLink,
} from "_helpers";
import { deleteAudit, getAudit } from "modules/hse/api/audit";
import { useHistory, useLocation } from "react-router";

import ContentTop from "components/general/ContentTop";
import MenuInlineBtn from "components/MenuInlineBtn";
import { Modal } from "antd";
import ResponsiveList from "components/general/ResponsiveList";
import TableActions from "components/general/TableActions";
import { constant } from "modules/hse/constant";
import moment from "moment-jalaali";
import { pageNames } from "constant";
import { permission } from "json/Permission";
import qs from "query-string";
import { showMessage } from "utils/message";
import useCheckAccess from "hooks/useCheckAccess";
import useDateFilterTable from "hooks/useDateFilterTable";
import useTableSearch from "hooks/useTableSearch";
import useTableSelect from "hooks/useTableSelectSearch";
import colors from "utils/colors";

const Audit = () => {
  const [state, setState] = useState({
    audits: [],
    loading: true,
    initialData: [],
  });
  const { push } = useHistory();
  const checkAccess = useCheckAccess();

  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });

  const tableSelect = useTableSelect({ saveParams: true });
  const tableDateFilter = useDateFilterTable();
  const location = useLocation();
  const history = useHistory();

  const searchParams = qs.parse(location.search);

  const [tableInfo, setTableInfo] = useState({
    pagination: {
      current: searchParams.page ? +searchParams.page : 1,
      defaultPageSize: 20,
    },
  });

  useEffect(() => {
    loadAudits();
  }, []);

  const loadAudits = async () => {
    try {
      const { data: audits } = await getAudit();
      setState((s) => ({ ...s, audits, loading: false, initialData: audits }));
    } catch (error) {
      setState((s) => ({ ...s, loading: false }));
      console.log(error.message);
    }
  };

  const handleDeleteAudit = async (audit) => {
    setState((s) => ({ ...s, loading: true }));
    try {
      await deleteAudit(audit);
      setState((s) => ({
        ...s,
        audits: s.audits.filter((item) => item.id !== audit.id),
        loading: false,
      }));
    } catch (error) {
      console.log(error.message);
      setState((s) => ({ ...s, loading: false }));
    }
  };

  const performAnAudit = (audit) => {
    push(getLink(pageNames.hse.performAnAudit.index, audit.id));
  };

  const auditDetail = (audit) => {
    push(getLink(pageNames.hse.audit.auditDetail, audit.id));
  };

  const handleTableChange = (
    pagination,
    filters,
    sorter,
    { currentDataSource, action }
  ) => {
    //Reset current page on filter or sort
    if (action !== "paginate")
      pagination = {
        ...pagination,
        current: 1,
      };

    // save current page if it is updated as url query param so that the page would be loaded on back or refresh
    if (action !== "filter") {
      const queryParams = qs.parse(location.search);
      const newQueries = { ...queryParams };
      const isDiffPage = pagination.current !== tableInfo.pagination.current;
      const isDiffSort =
        !queryParams?.sort ||
        (queryParams?.sort &&
          (sorter?.field !== queryParams.sort ||
            sorter?.order !== queryParams.sort_order));

      if (isDiffPage) {
        newQueries.page = pagination.current;
      }
      if (isDiffSort) {
        newQueries.sort = sorter.field;
        newQueries.sort_order = sorter.order;
      }
      if (!sorter.order) {
        delete newQueries.sort_order;
        delete newQueries.sort;
      }

      if (isDiffPage || isDiffSort) {
        history.replace({ search: qs.stringify(newQueries) });
      }
    }

    //Trigger changes on table info
    setTableInfo({
      pagination,
      filters,
      sorter,
    });
  };

  /**
   *
   * @param {"id"} element
   * @param {string} searchPhrase
   */
  const handleSearchAudit = (element = "id", searchPhrase = "") => {
    const temp = [...state.audits];
    if (searchPhrase.length === 0) return loadAudits();
    const filtered = temp.filter((item) =>
      `${item[element]}`.includes(searchPhrase)
    );
    if (filtered.length === 0) return showMessage("موردی یافت نشد", "error");
    setState((s) => ({
      ...s,
      audits: filtered,
    }));
  };

  let columns = [
    {
      title: "شماره",
      dataIndex: "id",
      // filterDropdown: () => (
      //   <AppTableSearch
      //     onSearch={(searchText) => handleSearchAudit("id", searchText)}
      //     onReset={() => handleSearchAudit("id", "")}
      //   />
      // ),
      // filterIcon: <SearchOutlined />,
      ...tableSearch("id", "شناسه"),
    },
    {
      title: "تاریخ",
      dataIndex: "audit_date",
      ...tableDateFilter("audit_date", "تاریخ"),
      render: (value) => dateToJalali(value),
    },
    {
      key: "audit_group_id",
      title: "گروه بازرسی",
      ...tableSelect("audit_group_id", "گروه بازرسی", {
        filters: [
          { text: "اشخاص", value: constant.inidividual },
          { text: "ماشین", value: constant.vehicle },
          { text: "محیط", value: constant.environment },
        ],
      }),

      onFilter: (value, data) =>
        value === constant.inidividual
          ? data?.first_name || data?.last_name
          : value === constant.vehicle
          ? data?.plaque1 || data?.plaque2 || data?.plaque3 || data?.plaque4
          : false,
      defaultFilteredValue: searchParams.audit_group_id
        ? [searchParams.audit_group_id]
        : null,
      render: (data) =>
        data?.first_name || data?.last_name
          ? "اشخاص"
          : data?.plaque1 || data?.plaque2 || data?.plaque3 || data?.plaque4
          ? "ماشین"
          : "محیط",
    },
    {
      title: "بازرسی شونده",
      key: "to_be_audit",
      ...tableSelect("to_be_audit", "بازرسی شونده", {
        filters: state.audits
          .map((item) => ({
            text:
              item.first_name + item.last_name ||
              item.type +
                " " +
                item.system +
                " " +
                item.style +
                " " +
                (item.color || ""),
            value:
              item.first_name + item.last_name ||
              item.type +
                " " +
                item.system +
                " " +
                item.style +
                " " +
                (item.color || ""),
          }))
          .filter(
            (item, i, ar) => ar.findIndex((t) => t.text === item.text) === i
          ),
      }),

      onFilter: (value, data) =>
        data.first_name + data.last_name === value ||
        data.type + " " + data.system + " " + data.style + " " + data.color ===
          value,
      defaultFilteredValue: searchParams.to_be_audit
        ? [searchParams.to_be_audit]
        : null,
      render: (data) =>
        data?.first_name ? (
          `${data?.first_name} ${data?.last_name}`
        ) : data?.plaque1 || data?.plaque2 || data?.plaque3 || data?.plaque4 ? (
          <p>
            {data?.type +
              " " +
              data.system +
              " " +
              data.style +
              " " +
              (data?.color || " ")}
          </p>
        ) : (
          ""
        ),
    },
    {
      title: "کد",
      key: "organization_code",
      ...tableSelect("organization_code", "کد", {
        filters: state.audits
          .map((item) => ({
            text: item.organization_code || item.national_number,
            value: item.organization_code || item.national_number,
          }))
          .filter(
            (item, i, ar) => ar.findIndex((t) => t.text === item.text) === i
          ),
      }),

      onFilter: (value, data) =>
        data.organization_code === value || data.national_number === value,
      defaultFilteredValue: searchParams.organization_code
        ? [searchParams.organization_code]
        : null,
      render: (data) =>
        data?.first_name || data?.last_name
          ? data?.national_number
          : data?.plaque1 || data?.plaque2 || data?.plaque3 || data?.plaque4
          ? data?.organization_code
          : "محیط",
    },
    {
      title: "بازرس",
      key: "operator",
      ...tableSelect("operator", "بازرس", {
        filters: state.audits
          .map((item) => ({
            text: item.operator_first_name + " " + item.operator_last_name,
            value: item.operator_first_name + " " + item.operator_last_name,
          }))
          .filter(
            (item, i, ar) => ar.findIndex((t) => t.text === item.text) === i
          ),
      }),

      onFilter: (value, data) =>
        value === data.operator_first_name + " " + data.operator_last_name,
      defaultFilteredValue: searchParams.operator
        ? [searchParams.operator]
        : null,
      render: (data, record) =>
        `${data?.operator_first_name} ${data.operator_last_name}`,
    },

    {
      title: "وضعیت فرآیند",
      dataIndex: "draft",
      key: "draft",
      ...tableSelect("draft", "وضعیت", {
        filters: [
          { text: "نیمه تمام", value: 1 },
          { text: "اتمام بازرسی", value: 0 },
        ],
      }),

      onFilter: (value, { draft }) => value === draft,

      render: (text, record) =>
        record.draft == 1 ? "نیمه تمام" : "اتمام بازرسی",
    },
    {
      title: "نمره",
      dataIndex: "percentage",
      render: (data) => (data ? Math.floor(data) : "-"),
    },

    {
      key: "permit",
      dataIndex: "permit",
      title: "پرمیت",
      ...tableSelect("permit", "پرمیت", {
        filters: [
          { text: "انجام نشده ها", value: 0 },
          { text: "صادر نشده ها", value: -1 },
          { text: "صادر شده ها", value: 1 },
        ],
      }),

      onFilter: (value, { permit, draft }) =>
        value === 0
          ? draft === 1
          : value === -1
          ? !permit && draft === 0
          : !!permit,
      render: (text, record) =>
        record.draft === 1 ? (
          "-"
        ) : (
          <p>{record.permit === true ? "صادر شد" : "صادر نشد"}</p>
        ),
    },

    { title: "توضیحات", dataIndex: "description" },
    {
      title: "ابزار",
      dataIndex: "id",
      render: (id, record) =>
        !checkAccess(permission.HSE_AUDIT) ? null : (
          <TableActions
            list={[
              {
                name: "delete",
                warningText: `نسبت به حذف بازرسی شماره ${id} مطمئن هستید؟`,
                onClick: () => handleDeleteAudit(record),
                hide: !record.draft,
              },
              {
                name: "edit",
                tooltip: "انجام بازرسی",
                onClick: () => performAnAudit(record),
                hide: !record.draft,
              },
              {
                name: "detail",
                tooltip: "مشاهده نتیجه بازرسی",
                onClick: () => auditDetail(record),
              },
            ]}
          />
        ),
    },
  ];

  columns = columns.map((column) => {
    return {
      ...column,
      defaultFilteredValue:
        searchParams && searchParams[column?.dataIndex]
          ? [searchParams[column?.dataIndex]]
          : column.defaultFilteredValue || null,
      defaultSortOrder:
        searchParams && searchParams.sort === column?.dataIndex
          ? searchParams?.sort_order || "ascend"
          : null,
    };
  });

  const mobileItemActions = [
    {
      name: "حذف",
      onClick: (record) =>
        Modal.confirm({
          onOk: () => handleDeleteAudit(record),
          content: "آیا از حذف این بازرسی اطمینان دارید؟",
        }),
    },
    {
      name: "انجام بازرسی",
      onClick: (record) => performAnAudit(record),
    },
    {
      name: "مشاهده نتیجه بازرسی",
      onClick: (record) => auditDetail(record),
    },
  ];

  // used span instead of string because the rtl text and symbols were scrambled in string
  const getMobileItemTitle = (record) => {
    return (
      <>
        <span>{record?.id}</span> |{" "}
        <span>{record.audit_date && dateToJalali(record.audit_date)}</span> |{" "}
        <span>{record.type || ""}</span> <span>{record.system || ""}</span>{" "}
        <span>{record.style || ""}</span>{" "}
        <span>
          {record.first_name && record.last_name
            ? `${record.first_name} ${record.last_name}`
            : ""}
        </span>{" "}
        <span>{record.type || record.first_name ? "|" : ""}</span>{" "}
        <span>
          {record.national_number
            ? record.national_number
            : record.organization_code
            ? record.organization_code
            : ""}
        </span>
      </>
    );
  };

  return (
    <>
      <ContentTop noBack title={"بازرسی"} />

      <MenuInlineBtn
        list={[
          {
            label: "انجام بازرسی جدید",
            url: pageNames.hse.audit.addEdit,
            variant: "primary",
            hidden: !checkAccess(permission.HSE_AUDIT),
          },
        ]}
      />

      <ResponsiveList
        dataSource={state.audits}
        pagination={tableInfo?.pagination}
        tableInfo={tableInfo}
        setTableInfo={setTableInfo}
        filterMode="client"
        loading={state.loading}
        showFilters={true}
        itemActions={mobileItemActions}
        columns={columns}
        viewLink={(record) =>
          getLink(pageNames.hse.audit.auditDetail, record.id)
        }
        mobileItemsTitle={getMobileItemTitle}
        initialData={state.initialData}
        setData={(data) => setState((s) => ({ ...s, audits: data }))}
        onChange={handleTableChange}
        mobileItemColors={(record) => {
          if (record.permit == true && record.draft !== 1) {
            return "#5e8a26";
          } else if (record.permit != true && record.draft !== 1) {
            return "#c83c2d";
          }
          return colors.primary;
        }}
      />
    </>
  );
};

export default Audit;
