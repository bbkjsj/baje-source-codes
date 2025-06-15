import React, { useContext, useEffect, useReducer, useState } from "react";
import {
  Col,
  Divider,
  Form,
  message,
  Row,
  Spin,
  Descriptions,
  Space,
  Button,
} from "antd";
import { CheckOutlined } from "@ant-design/icons";
import GoBackBtn from "components/GoBackBtn";
import AppCard from "components/general/AppCard";
import { NewContext } from "contex/New-Context";
import { useHistory, useLocation } from "react-router-dom";
import {
  participationType,
  suggestionType,
  dealType,
  keyMap,
  detailsPageActions,
  statusTypes,
  statusChangeTypes,
  suggestAccessTypes,
} from "./const";
import {
  getLink,
  convertDataKeys,
  getAsArray,
  daysToParts,
  timeToFa,
} from "_helpers";
import * as api from "./utils/api";
import ContentTop from "components/general/ContentTop";
import AppButton from "components/general/AppButton";
import { config, pageNames } from "constant";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

function SuggestionDetails(props) {
  const pageId = props.match.params.id;
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [executionInfo, setExecutionInfo] = useState();
  const newContext = useContext(NewContext);
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const action = query.get("action");
  const user = useWhoAmI();
  const surveyAccess = user?.surveyAccess;

  useEffect(() => {
    try {
      (async () => {
        setLoading(true);

        try {
          const { data } = newContext.isPublicSuggestion()
            ? await api._GET_ITEM_PUBLIC(pageId)
            : await api._GET_ITEM(pageId);

          const flatData = {
            ...data.survey,
            participants: data.participants,
            advantages: data.advantages,
            disadvantages: data.disadvantages,
            execution: data.execution,
            workgroupInfo: data.workgroup,
            latestLogExec: data.latestLogExec,
          };

          setPageData(convertDataKeys(keyMap(true), flatData, true));
          setLoading(false);
        } catch (err) {
          message.error("دریافت جزئیات با مشکل روبرو شد");
        }

        if (action === detailsPageActions.EXCELLENT_COMMITTEE_VOTE) {
          try {
            const { data } = await api._GET_EXECUTION_INFO(pageId);

            if (typeof data === "object") setExecutionInfo(data);
          } catch (err) {
            message.error("دریافت جزئیات مجری پیشنهاد با مشکل روبرو شد");
          }
        }

        //set suggestion as seen
        try {
          newContext.isPublicSuggestion()
            ? await api._SET_AS_SEEN_PUBLIC(pageId)
            : await api._SET_AS_SEEN(pageId);
        } catch (error) {
          console.log("ثبت دیده شدن پیشنهاد با مشکل روبرو شد");
        }
      })();
    } catch (error) {
      message.error("مشکلی در نمایش صفحه پیش آمده است");
    }
  }, []);

  const getDealType = () => {
    if (!pageData) return "-";

    if (pageData.deal_type === dealType.SELL)
      return (
        "فروش طرح پیشنهادی با مبلغ " + pageData["suggestion_price"] + " ریال"
      );
    else if (pageData.deal_type === dealType.PARTNERSHIP)
      return (
        "مشارکت در منافع به میزان " +
        pageData["partnership_percent"] +
        "٪ به مدت " +
        pageData["partnership_period"] +
        " سال"
      );
    else return pageData.deal_type;
  };

  const getParticipants = () => {
    if (!pageData || !pageData.participants.length) return "-";

    return (
      <Row gutter={[6, 12]}>
        {pageData.participants.map((item) => (
          <Col key={item.id} xs={24} md={8} xl={6}>
            <div>
              {item.first_name + " " + item.last_name} (%
              {item.percentage ?? "100"})
            </div>
            <small style={{ color: "gray" }}>{item.national_id}</small>
          </Col>
        ))}
      </Row>
    );
  };

  const getDisAdv = (data, color) => {
    if (!pageData || !data || !data.length) return "-";

    return (
      <Row gutter={[8, 16]}>
        {data.map((item) => (
          <Col key={item.id} xs={24} lg={12} xl={8}>
            <div style={{ color: color }}>{item.comment}</div>
          </Col>
        ))}
      </Row>
    );
  };

  const getActionButtons = () => {
    if (action === detailsPageActions.EXCELLENT_COMMITTEE_VOTE) {
      return [
        <AppButton
          type="primary"
          icon={<CheckOutlined />}
          className="big-btn"
          style={{ width: "200px", background: "#309230", border: "none" }}
          onClick={() => sendVote(true)}
        >
          تایید پیشنهاد
        </AppButton>,
        <AppButton
          onClick={() => sendVote(false)}
          className="big-btn"
          variant="danger"
        >
          رد پیشنهاد
        </AppButton>,
      ];
    } else if (action === detailsPageActions.CEO_TO_EXECUTOR_SIGNIFY) {
      return [
        <AppButton
          type="primary"
          icon={<CheckOutlined />}
          className="big-btn"
          style={{ width: "200px" }}
          onClick={forwardToExecutor}
        >
          ابلاغ به مجری
        </AppButton>,
      ];
    }
  };

  const sendVote = async (approved) => {
    const data = {
      survey_id: pageId,
      approve: approved,
    };

    const res = await api._EXCELLENT_COMMITTEE_VOTE(data);

    if (res.status === 200) message.success("با موفقیت انجام شد");
    else message.error("ثبت رای با مشکل روبرو شد");

    const newPath = pageNames.suggest.suggestion.list;
    window.location = newPath;
  };

  const forwardToExecutor = async () => {
    const res = await api._CHANGE_STATUS(pageId, {
      from_status: pageData.status,
      to_status: statusTypes.EXECUTOR_INFORM,
      type: statusChangeTypes.FORWARD,
      description: "",
      personnel_ids: getAsArray([]),
    });

    if (res.status === 200) {
      message.success("با موفقیت انجام شد");
      const newPath = pageNames.suggest.suggestion.list;
      window.location = newPath;
    } else message.error("ابلاغ با مشکل روبرو شد");

    const newPath = pageNames.suggest.suggestion.list;
    history.replace(newPath);
  };

  const renderValues = {};

  // console.log(pageData ? pageData : "-", "!pagedata");
  return (
    <>
      <GoBackBtn />

      <ContentTop
        title="جزئیات پیشنهاد"
        className="mt-3"
        breadcrumbItems={[
          { text: "نظام پیشنهادات" },
          {
            text: "پیشنهادات",
            link: getLink(pageNames.suggest.suggestion.list, false),
          },
        ]}
      />

      <AppCard>
        <Spin spinning={loading}>
          {pageData && (
            <Space direction="vertical" size={32}>
              {(renderValues.buttons = getActionButtons()) &&
                [detailsPageActions.EXCELLENT_COMMITTEE_VOTE].includes(
                  action
                ) && <Space>{renderValues.buttons}</Space>}

              <Descriptions title="اطلاعات اولیه" bordered={true}>
                <Descriptions.Item label="عنوان پیشنهاد">
                  {pageData.title}
                </Descriptions.Item>
                <Descriptions.Item label="نوع مشارکت">
                  {pageData.participation_type}
                </Descriptions.Item>
                <Descriptions.Item label="نام گروه">
                  {pageData.group_title || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="شرکت در فراخوان">
                  {pageData.is_for_call ? pageData["call_subject"] : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="نوع پیشنهاد">
                  {pageData.suggestion_type}
                </Descriptions.Item>
                <Descriptions.Item label="کارگروه بررسی کننده">
                  {pageData.workgroupInfo?.name || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="حوزه پیشنهاد">
                  {pageData.category
                    ? pageData["category_name"]
                    : pageData.custom_category || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="در حال اجرا">
                  {pageData.status === statusTypes.EXECUTOR_INFORM
                    ? "بلی"
                    : "خیر"}
                </Descriptions.Item>
                <Descriptions.Item label="مشارکت در اجرا">
                  {pageData.want_partnership ? "بلی" : "-"}
                </Descriptions.Item>
                {/* <Descriptions.Item label="نحوه تعامل">
                  {getDealType()}
                </Descriptions.Item> */}
                {surveyAccess.includes(suggestAccessTypes.EXCELLENT_HEAD) ||
                  (surveyAccess.includes(suggestAccessTypes.SURVEY_MANAGER) && (
                    <Descriptions.Item label="مشارکت کنندگان" span={3}>
                      {getParticipants()}
                    </Descriptions.Item>
                  ))}
                {pageData.file_url && (
                  <Descriptions.Item label="فایل پیوست" span={3}>
                    <a
                      href={config.url.API_URL + pageData.file_url}
                      target="_blank"
                    >
                      مشاهده فایل
                    </a>
                  </Descriptions.Item>
                )}
              </Descriptions>

              <Descriptions title="اطلاعات اجرایی" bordered={true}>
                <Descriptions.Item label="نوع مجری">
                  {pageData.execution?.company_name
                    ? "حقوقی"
                    : pageData.execution?.first_name
                    ? "حقیقی"
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="نام شرکت مجری">
                  {pageData.execution?.company_name || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="نام فرد مجری">
                  {!pageData.execution?.company_name &&
                  (pageData.execution?.first_name ||
                    pageData.execution?.last_name)
                    ? pageData.execution?.first_name +
                      " " +
                      pageData.execution?.last_name
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="مدت اجرای طرح توسط مجری">
                  {pageData.execution?.due_day
                    ? pageData.execution?.due_day + " روز"
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="تاریخ ابلاغ به مجری">
                  {pageData.latestLogExec?.date
                    ? timeToFa(pageData.latestLogExec?.date, false)
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="تاریخ پایان تعویق اجرا">
                  {pageData.end_of_postpone
                    ? timeToFa(pageData.end_of_postpone, false)
                    : "-"}
                </Descriptions.Item>
                {pageData.execution?.timeline_file && (
                  <Descriptions.Item label="فایل زمانبندی مجری" span={3}>
                    <a
                      href={
                        config.url.API_URL + pageData.execution?.timeline_file
                      }
                      target="_blank"
                    >
                      مشاهده فایل زمانبندی
                    </a>
                  </Descriptions.Item>
                )}
              </Descriptions>

              <Descriptions title="جزئیات طرح" bordered={true}>
                <Descriptions.Item label="شرح وضعیت" span={3}>
                  {pageData.the_problem}
                </Descriptions.Item>
                <Descriptions.Item label="شرح پیشنهاد" span={3}>
                  {pageData.the_idea}
                </Descriptions.Item>
                <Descriptions.Item label="امکانات مورد نیاز" span={3}>
                  {pageData.requirements}
                </Descriptions.Item>
              </Descriptions>

              <Descriptions title="مزایا و معایب" bordered={true}>
                <Descriptions.Item label="مزایای طرح" span={3}>
                  {getDisAdv(pageData.advantages, "green")}
                </Descriptions.Item>
                <Descriptions.Item label="معایب طرح" span={3}>
                  {getDisAdv(pageData.disadvantages, "red")}
                </Descriptions.Item>
              </Descriptions>

              <Descriptions title="پاداش پیشنهاد" bordered={true}>
                <Descriptions.Item label="میزان پاداش پیشنهاد">
                  <div style={{ color: "#d4af37" }}>
                    {pageData.reward ? pageData.reward + " ریال" : "-"}
                  </div>
                </Descriptions.Item>
              </Descriptions>

              {(renderValues.buttons = getActionButtons()) &&
                [detailsPageActions.CEO_TO_EXECUTOR_SIGNIFY].includes(
                  action
                ) && <Space>{renderValues.buttons}</Space>}
            </Space>
          )}
        </Spin>
      </AppCard>
    </>
  );
}

export default SuggestionDetails;
