import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button, message, Popconfirm, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AppTable from "components/general/AppTable";
import { LayoutContext } from "contex/Layout-context";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import { columns } from "./suggestionList/tableColumns";
import * as api from "./utils/api";
import * as committeeApi from "../committee/utils/api";
import { statusTypes, suggestAccessTypes, accessToCartable } from "./const";
import TimeExtendModal from "./TimeExtendModal";
import ForwardModal from "components/general/ForwardModal";
import { findArrayIntersection, getAsArray, getLink, notice } from "_helpers";
import { SECRETARIAT_COMMITTEE_ID } from "../const";
import ContentTop from "../../../components/general/ContentTop";
import ScoresTableModal from "./ScoresTableModal";
import suggestBanner from "assets/images/suggest.jpg";
import useIsMobile from "hooks/useIsMobile";
import useTableSearch from "hooks/useTableSearch";
import FinalRejectModal from "./FinalRejectModal";
import PendingModal from "./PendingModal";
import useTableSelectSearch from "hooks/useTableSelectSearch";
import useRangeFilter from "hooks/useRangeFilter";
import SubmitTimelineModal from "./SubmitTimelineModal";
import { prepareForwards } from "./suggestionList/prepareForwards";
import { handleOnForwardClick } from "./suggestionList/handleOnForwardClick";
import { handleOnForwardSubmit } from "./suggestionList/handleOnForwardSubmit";
import { checkSuggestionPermission, getForwardTypes } from "./utils/index";
import { getRowOptions } from "./suggestionList/getRowOptions";
import { useGetList } from "./suggestionList/useGetList";
import { pageNames } from "constant";
import { useSelector, useDispatch } from "react-redux";
import { NewContext } from "contex/New-Context";
import { setLastSuggestFilter } from "store/action/lastSuggestFilter";
import qs from "query-string";
import ResponsiveList from "components/general/ResponsiveList";
import mobileActions from "./suggestionList/mobileItemOptions";
import useWhoAmI from "hooks/useWhoAmI";
import { setToken } from "store/action/token";
import { setSuggestToken } from "store/action/suggestToken";
import { setCurrentOffice } from "store/action/currentOffice";
import { setCurrentContract } from "store/action/currentContract";
import { setUser } from "store/action/user";
import { setOfficeLogo } from "store/action/officeLogo";

const SuggestionList = (props) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const newContext = useContext(NewContext);
  const dispatch = useDispatch();
  const user = useWhoAmI();
  const surveyAccess = user?.surveyAccess;
  const lastSuggestFilter = useSelector((state) => state.lastSuggestFilter);
  const history = useHistory();
  const layoutContext = useContext(LayoutContext);
  const pageId = props.match.params.id && parseInt(props.match.params.id);
  const [isForwardVisible, setIsForwardVisible] = useState(false);
  const [pageForwardTypes, setPageForwardTypes] = useState([]);
  const [currentForwardTypes, setCurrentForwardTypes] = useState([]);
  const [currentSuggestion, setCurrentSuggestion] = useState();
  const [isTimeExtendModalVisible, setIsTimeExtendModalVisible] = useState(
    false
  );
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [
    isSubmitTimelineModalVisible,
    setIsSubmitTimelineModalVisible,
  ] = useState(false);
  const [isPendingModalVisible, setIsPendingModalVisible] = useState(false);
  const [shouldShowIdentity, setShouldShowIdentity] = useState(false);
  const [shouldShowRating, setShouldShowRating] = useState(false);
  const pageFilter = props.match.params.filter;
  const [scoreModal, setScoreModal] = useState(false);
  const [currentScores, setCurrentScores] = useState(null);
  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const tableSelectSearch = useTableSelectSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const rangeFilter = useRangeFilter();

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const callId = parseInt(query.get("call"));

  const searchParams = qs.parse(location.search);

  const [tableInfo, setTableInfo] = useState({
    pagination: {
      current: searchParams.page ? +searchParams.page : 1,
      defaultPageSize: 20,
    },
  });

  const [list, listLoading, getList] = useGetList(
    pageId,
    callId,
    pageFilter,
    newContext
  );

  const [mobileList, setMobileList] = useState([]);

  useEffect(() => {
    setMobileList(list);
  }, [list]);

  const isMobile = useIsMobile();
  const menuBtnList = [];

  if (newContext.isPublicSuggestion())
    menuBtnList.push({
      label: "افزودن پیشنهاد جدید",
      id: "newSuggestion",
      variant: "primary",
      icon: <PlusOutlined />,
      url: pageNames.suggest.suggestion.add,
    });

  useEffect(() => {
    (async function () {
      //handle missing filter param for cartable
      const possibleFilters = [];

      Object.keys(accessToCartable).forEach((key) => {
        if (surveyAccess?.find((item) => accessToCartable[key].includes(item)))
          possibleFilters.push(key);
      });

      if (
        !pageFilter ||
        (possibleFilters.length && !possibleFilters.includes(pageFilter)) ||
        !possibleFilters.length
      ) {
        let newFilter;

        if (lastSuggestFilter && !newContext.isPublicSuggestion()) {
          newFilter = lastSuggestFilter;
          dispatch(setLastSuggestFilter(""));
        } else if (possibleFilters.length) newFilter = possibleFilters[0];
        else newFilter = false;

        const newPath = getLink(
          pageNames.suggest.suggestion.list,
          newFilter ? { filter: newFilter } : false
        );
        history.replace(newPath);

        if (newFilter) return false;
      } else dispatch(setLastSuggestFilter(pageFilter));

      //page init
      await getList();
      await prepareForwards(setPageForwardTypes);

      //should show starter identity in table?
      committeeApi
        ._GET_MEMBER(SECRETARIAT_COMMITTEE_ID)
        .then((res) => {
          const inCommittee = res.data.find(
            (item) => item.personnel_id === user?.id
          );
          setShouldShowIdentity(inCommittee);
        })
        .catch((error) => {
          if (error?.response?.status == 401) {
            dispatch(setToken(""));
            dispatch(setSuggestToken(""));
            dispatch(setCurrentOffice(""));
            dispatch(setCurrentContract(""));
            dispatch(setUser(""));
            dispatch(setOfficeLogo(""));
            dispatch(setLastSuggestFilter(""));

            if (
              !window.location.href.includes(pageNames.suggest.auth.intro) &&
              !window.location.href.includes(
                getLink(pageNames.suggest.auth.signUp)
              ) &&
              !window.location.href.includes(getLink(pageNames.auth.login))
            )
              window.location.href = pageNames.auth.login;
          } else {
            message.error("مشکلی پیش آمده است دوباره تلاش کنید");
          }
        });

      //should show point (rating) of suggestion in table?
      const showRating =
        findArrayIntersection(
          [suggestAccessTypes.SURVEY_MANAGER],
          getAsArray(surveyAccess)
        ) || newContext.isPublicSuggestion();

      setShouldShowRating(showRating);
    })();
  }, [pageFilter]);

  const deleteItems = async (items) => {
    if (!Array.isArray(items)) items = [items];

    try {
      newContext.isPublicSuggestion()
        ? await api._DELETE_PUBLIC(items)
        : await api._DELETE(items);

      await getList();
      message.success("آیتم مورد نظر پاک شد");
    } catch (error) {
      message.error(error.data);
      setDeleteLoading(false);
    }
  };

  const handleOnScoreClick = (id) => {
    setScoreModal(true);
    setCurrentScores(id);
  };

  const handleOnTimeExtendClick = (data) => {
    setCurrentSuggestion(data);
    setIsTimeExtendModalVisible(true);
  };

  const handleOnTimeExtendSubmit = (params) => {
    setIsTimeExtendModalVisible(false);
  };

  const onForwardClick = async (record) => {
    return await handleOnForwardClick(
      record,
      getForwardTypes(record, pageForwardTypes),
      setCurrentForwardTypes,
      setCurrentSuggestion,
      setIsForwardVisible
    );
  };

  const onForwardSubmit = async (result) => {
    return await handleOnForwardSubmit(
      result,
      newContext,
      currentSuggestion,
      setIsForwardVisible,
      getList,
      history
    );
  };

  const footer = () => (
    <Popconfirm
      placement="leftTop"
      title={"آیا برای حذف اطمینان دارید ؟"}
      onConfirm={() => deleteItems(selectedRows)}
      okText="بله"
      cancelText="خیر"
    >
      <Button type="danger">حذف</Button>
    </Popconfirm>
  );

  const handleOnChangeTablePage = (page) => {
    layoutContext.setTablePage(page);
  };

  if (listLoading) {
    return <LogoLoading />;
  }

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

  return (
    <div>
      <ContentTop
        noBack
        title="مدیریت پیشنهادات"
        className="mt-3"
        breadcrumbItems={[{ text: "نظام پیشنهادات" }, { text: "پیشنهادات" }]}
      />

      <img
        src={suggestBanner}
        alt="پیشنهادات خودتان را ارائه کنید"
        className="w-100 mb-3"
        style={{
          borderRadius: "4px",
          objectFit: "cover",
          height: isMobile ? "110px" : "auto",
        }}
      />

      {menuBtnList?.length ? (
        <div className="w-100 flex-wrap align-center mb-3">
          <MenuInlineBtn list={menuBtnList} />
        </div>
      ) : null}

      <Spin spinning={deleteLoading}>
        <div className="card-container">
          <ResponsiveList
            rowKey={(record) => record.id}
            scrollX={1280}
            size="small"
            columns={columns({
              list,
              history,
              showIdentity: shouldShowIdentity,
              showRating: shouldShowRating,
              rowOptions: (text, record) =>
                getRowOptions(text, record, {
                  setCurrentSuggestion,
                  setIsRejectModalVisible,
                  setIsSubmitTimelineModalVisible,
                  setIsPendingModalVisible,
                  handleOnTimeExtendClick,
                  onForwardClick,
                  newContext,
                  history,
                  pageFilter,
                  deleteItems,
                  forwards: getForwardTypes(record, pageForwardTypes),
                }),
              scoreClickHandler: handleOnScoreClick,
              tableSearch,
              tableSelectSearch,
              rangeFilter,
              searchParams: qs.parse(location.search),
            })}
            dataSource={mobileList}
            bordered={true}
            footer={!!selectedRows.length && footer}
            rowClassName={(record, index) => {
              if (
                record["excellent_member_vote"] === true ||
                (record["status"] === statusTypes.COMMITTEE_MEMBER_ACCEPTION &&
                  checkSuggestionPermission(
                    [suggestAccessTypes.WORKGROUP_HEAD],
                    record.totalRoles
                  ))
              )
                return "bg-success";
              else if (
                (record["status"] === statusTypes.COMMITTEE_MEMBER_REJECTION &&
                  checkSuggestionPermission(
                    [suggestAccessTypes.WORKGROUP_HEAD],
                    record.totalRoles
                  )) ||
                record["excellent_member_vote"] === false
              )
                return "bg-error";
            }}
            tableInfo={tableInfo}
            setTableInfo={setTableInfo}
            filterMode="client"
            itemActions={mobileActions({
              history,
              deleteItems,
              handleOnTimeExtendClick,
              onForwardClick,
              newContext,
              setCurrentSuggestion,
              setIsRejectModalVisible,
              setIsSubmitTimelineModalVisible,
              setIsPendingModalVisible,
              pageFilter,
            })}
            showFilters={true}
            titleKeys={["title"]}
            initialData={list}
            setData={setMobileList}
            pagination={tableInfo.pagination}
            onChange={handleTableChange}
          />
        </div>
        {!newContext.isPublicSuggestion() && (
          <ForwardModal
            isVisible={isForwardVisible}
            onSubmit={onForwardSubmit}
            onCancel={() => setIsForwardVisible(false)}
            forwardTypes={currentForwardTypes}
            subjectId={currentSuggestion?.id || currentSuggestion?.s_id}
          />
        )}
        <TimeExtendModal
          isVisible={isTimeExtendModalVisible}
          onSubmit={handleOnTimeExtendSubmit}
          onCancel={() => setIsTimeExtendModalVisible(false)}
          subjectId={currentSuggestion?.id || currentSuggestion?.s_id}
        />
        <ScoresTableModal
          status={scoreModal}
          close={() => setScoreModal(false)}
          suggestionId={currentScores}
        />
        <FinalRejectModal
          isVisible={isRejectModalVisible}
          pageData={currentSuggestion}
          onCancel={async () => {
            setIsRejectModalVisible(false);
            await getList();
          }}
          onSave={async () => {
            setIsRejectModalVisible(false);
            history.go();
          }}
        />
        <SubmitTimelineModal
          isVisible={isSubmitTimelineModalVisible}
          pageData={currentSuggestion}
          onCancel={async () => {
            setIsSubmitTimelineModalVisible(false);
          }}
          onSave={async () => {
            setIsSubmitTimelineModalVisible(false);
            history.go();
          }}
        />
        <PendingModal
          isVisible={isPendingModalVisible}
          pageData={currentSuggestion}
          onCancel={() => setIsPendingModalVisible(false)}
          onSave={async () => {
            setIsPendingModalVisible(false);
            history.go();
          }}
        />
      </Spin>
    </div>
  );
};

export default SuggestionList;
