import AppSwitch from "components/general/AppSwitch";
import AppTable from "components/general/AppTable";
import ContentTop from "components/general/ContentTop";
import MenuInlineBtn from "components/MenuInlineBtn";
import TableOptionV2 from "components/general/TableActions";
import { pageNames } from "constant";
import {
  deleteChecklist,
  getChecklist,
  getChecklists,
  updateChecklist,
} from "modules/hse/api/checklist";
import {
  constant,
  questionGroups,
  questionTypes,
  criticalValues,
} from "modules/hse/constant";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { messages, showMessage } from "utils/message";
import { Modal } from "antd";
import ExportExcel from "components/ExportExcel";
import useIsMobile from "hooks/useIsMobile";
import useTableSearch from "hooks/useTableSearch";
import useTableSelect from "hooks/useTableSelectSearch";
import qs from "query-string";
import MobileList from "components/mobileList/MobileList";
import ResponsiveList from "components/general/ResponsiveList";

const Checklist = () => {
  const [state, setState] = useState({
    checklists: [],
    loading: true,
    initialData: [],
  });
  const { push } = useHistory();
  const isMobile = useIsMobile();
  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const tableSelect = useTableSelect({ saveParams: true });
  const location = useLocation();
  const history = useHistory();

  const searchParams = qs.parse(location.search);

  const [tableInfo, setTableInfo] = useState({
    pagination: {
      current: searchParams.page ? +searchParams.page : 1,
    },
  });

  useEffect(() => {
    loadChecklists();
  }, []);

  const loadChecklists = async () => {
    try {
      const { data: checklists } = await getChecklists();
      setState((s) => ({
        ...s,
        checklists,
        initialData: checklists,
        loading: false,
      }));
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEditCheckList = async (checklist, index) => {
    try {
      setState((s) => ({ ...s, loading: true }));
      await updateChecklist(checklist);
      const temp = [...state.checklists];
      temp[index] = { ...temp[index], ...checklist };
      setState((s) => ({ ...s, loading: false, checklists: temp }));
    } catch (error) {
      setState((s) => ({ ...s, loading: false }));
      console.log(error.message);
    }
  };

  const handleDelete = async (checklist, checklistIndex) => {
    setState((s) => ({
      ...s,
      loading: true,
    }));
    try {
      await deleteChecklist(checklist);
      showMessage(messages.deletedSuccessfully(), "error");
      setState((s) => ({
        ...s,
        checklists: s.checklists.filter(
          (item, index) => index !== checklistIndex
        ),
        loading: false,
      }));
    } catch (error) {
      console.log(error.message, "residam");
      setState((s) => ({
        ...s,
        loading: true,
      }));
    }
  };

  const handleDetail = (checklist) => {
    push(pageNames.hse.checklist.addEdit, checklist);
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

    console.log("filters:", filters);

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
   * @param {"code"|"question"} element
   * @param {string} searchPhrase
   * @returns
   */
  const handleCheckList = (element, searchPhrase = "") => {
    const temp = [...state.checklists];
    if (searchPhrase.length === 0) return loadChecklists();

    setState((s) => ({
      ...s,
      checklists: temp.filter((item) => `${item.code}`.includes(searchPhrase)),
    }));
  };

  const handleExportExcel = async (checklist) => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const { data } = await getChecklist(checklist);
      setState((s) => ({ ...s, loading: false }));
      Modal.info({
        title: "خروجی اکسل",
        centered: true,
        maskClosable: true,
        content: (
          <ExportExcel
            data={data.questions.map((item) => ({
              ...item,
              group: questionGroups.find((qu) => qu.value === item._group)
                ?.text,
              questionType: questionTypes.find((ttt) => ttt.value === item.type)
                ?.label,
              isReverse: item.is_reverse ? "بله" : "خیر",
              critical: item.critical
                .split(",")
                .map(
                  (ctr) =>
                    criticalValues(item.is_reverse)[item.type]?.find(
                      (ttt) => ttt.value == ctr
                    )?.label
                )
                .join(" - "),
            }))}
            columns={[
              { label: "آیدی سیستمی", value: "questionId" },
              { label: "شناسه", value: "code" },
              { label: "متن سوال", value: "question" },
              { label: "گروه سوال", value: "group" },
              { label: "نحوه نمره دهی", value: "questionType" },
              { label: "نمره دهی برعکس", value: "isReverse" },
              { label: "حالت بحرانی", value: "critical" },
              { label: "ضریب وزنی", value: "weight_factor" },
            ]}
          />
        ),
      });

      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  /////////////////// - Table data - ///////////////////

  let columns = [
    {
      title: "کد",
      dataIndex: "code",
      ...tableSearch("code", "کد"),
    },
    {
      title: "گروه ممیزی",
      dataIndex: "group",
      ...tableSelect("group", "گروه ممیزی", {
        filters: [
          { text: "اشخاص", value: constant.inidividual },
          { text: "ماشین", value: constant.vehicle },
          { text: "محیط", value: constant.environment },
        ],
      }),
      onFilter: (filter, data) => data.group === filter,
      render: (data) => questionGroups.find((item) => item.value === data).text,
    },
    {
      title: "ممیزی شونده",
      render: (data) =>
        data.group === constant.vehicle
          ? data.vehicleType
          : data.group === constant.inidividual
          ? data.job
          : "",
    },
    {
      title: "تعداد سوالات",
      dataIndex: "questionCount",
    },
    {
      title: "حداقل امتیاز صدور پرمیت",
      dataIndex: "minimum_point",
    },
    {
      title: "توضیحات",
      dataIndex: "comment",
    },
    {
      title: "وضعیت",
      dataIndex: "enable",
      ...tableSelect("enable", "وضعیت", {
        filters: [
          { text: "فعال", value: "1" },
          { text: "غیر فعال", value: "0" },
        ],
      }),

      onFilter: (value, data) => data.enable == value,
      render: (data, record, index) => (
        <AppSwitch
          checked={!!data}
          onChange={() =>
            handleEditCheckList(
              {
                id: record.id,
                enable: !record.enable,
                type: record.type,
              },
              index
            )
          }
        />
      ),
    },
    {
      title: "ابزار",
      render: (data, record, index) => (
        <TableOptionV2
          list={[
            {
              name: "delete",
              warningText: `نسبت به حذف ${data.code} مطمئن هستید؟`,
              onClick: () => handleDelete(data, index),
            },
            {
              name: "edit",
              onClick: () => handleDetail(data),
            },
            {
              name: "file",
              onClick: () => handleExportExcel(data),
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
          : null,
      defaultSortOrder:
        searchParams && searchParams.sort === column?.dataIndex
          ? searchParams?.sort_order || "ascend"
          : null,
    };
  });

  /////////////////// - Mobile list data - ///////////////////

  const mobileItemActions = [
    {
      name: "حذف",
      onClick: (record, index) =>
        Modal.confirm({
          onOk: () => handleDelete(record, index),
          content: "آیا از حذف این مورد اطمینان دارید؟",
        }),
    },
    {
      name: "ویرایش",
      onClick: (record) => handleDetail(record),
    },
    {
      name: "اکسپورت اکسل",
      onClick: (record) => handleExportExcel(record),
    },
  ];

  return (
    <>
      <ContentTop title="چک لیست" noBack />
      <MenuInlineBtn
        list={[
          {
            id: "newQuestion",
            variant: "primary",
            label: "چک لیست جدید",
            url: pageNames.hse.checklist.addEdit,
          },
        ]}
      />

      <ResponsiveList
        dataSource={state.checklists}
        pagination={tableInfo?.pagination}
        tableInfo={tableInfo}
        setTableInfo={setTableInfo}
        filterMode="client"
        showFilters={true}
        itemActions={mobileItemActions}
        columns={columns}
        titleKeys={["code", "vehicleType"]}
        initialData={state.initialData}
        setData={(data) => setState({ ...state, checklists: data })}
        loading={state.loading}
        onChange={handleTableChange}
      />
    </>
  );
};

export default Checklist;
