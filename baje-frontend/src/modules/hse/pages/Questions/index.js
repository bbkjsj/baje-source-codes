import AppTable from "components/general/AppTable";
import ContentTop from "components/general/ContentTop";
import MenuInlineBtn from "components/MenuInlineBtn";
import TableOptionV2 from "components/general/TableActions";
import { pageNames } from "constant";
import { deleteQuestion, getQuestions } from "modules/hse/api/question";
import { questionGroups, questionTypes } from "modules/hse/constant";
import { SearchOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import AppTableSearch from "components/general/AppTableSearch";
import useIsMobile from "hooks/useIsMobile";
import useTableSearch from "hooks/useTableSearch";
import useTableSelect from "hooks/useTableSelectSearch";
import qs from "query-string";
import { Modal } from "antd";
import MobileList from "components/mobileList/MobileList";
import ResponsiveList from "components/general/ResponsiveList";

const Questions = () => {
  const { push } = useHistory();
  const [state, setState] = useState({
    questions: [],
    initialList: [],
    loading: true,
  });
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
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    if (!state.loading) setState((s) => ({ ...s, loading: true }));
    try {
      const { data: questions } = await getQuestions();
      setState((s) => ({
        ...s,
        questions,
        initialList: questions,
        loading: false,
      }));
    } catch (error) {
      setState((s) => ({ ...s, loading: false }));
      console.log(error.message);
    }
  };

  const handleDeleteQuestions = async (question) => {
    setState((s) => ({
      ...s,
      loading: true,
    }));
    try {
      await deleteQuestion(question);
      setState((s) => ({
        ...s,
        loading: false,
        questions: s.questions.filter((item) => item.id !== question.id),
      }));
    } catch (error) {
      setState((s) => ({
        ...s,
        loading: true,
      }));
      console.log(error.message);
    }
  };

  const handleEditQuestions = (question) => {
    push(pageNames.hse.questions.addEdit, question);
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
      //filters,
      sorter,
    });
  };

  /**
   *
   * @param {"code"|"question"} element
   * @param {string} searchPhrase
   * @returns
   */
  const handleQuestions = (element, searchPhrase = "") => {
    const temp = [...state.questions];
    if (searchPhrase.length === 0) return loadQuestions();

    setState((s) => ({
      ...s,
      questions: temp.filter((item) => item[element].includes(searchPhrase)),
    }));
  };

  /////////////////// - Table data - ///////////////////
  let columns = [
    {
      title: "کد سوال",
      dataIndex: "code",
      ...tableSearch("code", "کد"),
    },
    {
      title: "گروه ممیزی",
      dataIndex: "group",
      ...tableSelect("group", "گروه ممیزی", {
        filters: questionGroups,
      }),
      onFilter: (value, record) => record.group === value,
      render: (data) =>
        questionGroups.find((item) => item.value === data)?.text,
    },
    {
      title: "سوال",
      dataIndex: "question",
      render: (question) =>
        `${question.substr(0, 50)} ${question.length > 50 ? "..." : ""}`,
      ...tableSearch("question", "سوال"),
    },
    {
      title: "شیوه ممیزی",
      dataIndex: "type",
      ...tableSelect("type", "شیوه ممیزی", {
        filters: questionTypes.map((item) => ({
          text: item.label,
          value: item.value,
        })),
      }),
      onFilter: (value, record) => record.type === value,
      render: (data) =>
        questionTypes.find((item) => item.value === data)?.label,
    },
    {
      dataIndex: "code",
      title: "تنظیمات",
      render: (text, record) => (
        <TableOptionV2
          list={[
            {
              name: "delete",
              title: "حذف",
              warningText: `نسبت به حذف کد ${text} اطمینان دارید؟`,
              onClick: () => handleDeleteQuestions(record),
            },
            {
              name: "edit",
              title: "ویرایش",
              onClick: () => handleEditQuestions(record),
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
          ? searchParams[column?.dataIndex].split(",")
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
      onClick: (record) =>
        Modal.confirm({
          onOk: () => handleDeleteQuestions(record),
          content: "آیا از حذف این مورد اطمینان دارید؟",
        }),
    },
    {
      name: "ویرایش",
      onClick: (record) => handleEditQuestions(record),
    },
  ];

  return (
    <>
      <ContentTop title="لیست سوالات" noBack />
      <MenuInlineBtn
        list={[
          {
            id: "newQuestion",
            variant: "primary",
            label: "سوال جدید",
            url: pageNames.hse.questions.addEdit,
          },
        ]}
      />

      <ResponsiveList
        dataSource={state.questions}
        pagination={tableInfo?.pagination}
        tableInfo={tableInfo}
        setTableInfo={setTableInfo}
        filterMode="client"
        showFilters={true}
        loading={state.loading}
        itemActions={mobileItemActions}
        columns={columns}
        titleKeys={["code"]}
        initialData={state.initialList}
        setData={(data) => setState({ ...state, questions: data })}
        onChange={handleTableChange}
      />
    </>
  );
};

export default Questions;
