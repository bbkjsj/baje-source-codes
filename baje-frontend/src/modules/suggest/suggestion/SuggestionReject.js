import React, { useContext, useEffect, useReducer, useState } from "react";
import {
  Col,
  Divider,
  Form,
  message,
  Row,
  Spin,
  Modal,
  Descriptions,
  Space,
  List,
  Input,
} from "antd";
import GoBackBtn from "components/GoBackBtn";
import AppCard from "components/general/AppCard";
import SubmitBtn from "components/general/SubmitBtn";
import { Link, useHistory, useLocation } from "react-router-dom";
import {
  keyMap as suggestionKeyMap,
  statusTypes,
  statusChangeTypes,
} from "./const";
import * as api from "./utils/api";
import { convertDataKeys, getAsArray, getLink, notice } from "_helpers";
import ContentTop from "../../../components/general/ContentTop";
import { RollbackOutlined } from "@ant-design/icons";
import AppButton from "../../../components/general/AppButton";
import * as committeeApi from "../committee/utils/api";
import { committeeMemberPosition } from "../committee/const";
import { SECRETARIAT_COMMITTEE_ID } from "../const";
import { formItemLayout, formRowGutter, pageNames } from "constant";

function SuggestionReject(props) {
  const [mainForm] = Form.useForm();
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const pageId = props.match.params.id;
  const [suggestionInfo, setSuggestionInfo] = useState({});
  const [rejectionReasons, setRejectionReasons] = useState([]);
  const [loading, setLoading] = useState(false);

  const REASON_TYPE_CRITERIA = 0;
  const REASON_TYPE_SCORE = 1;

  const getReasonTitle = (reason) => {
    return reason.type === REASON_TYPE_CRITERIA
      ? "رای به ملاک رد"
      : "امتیاز پایین";
  };

  const getReasonDescription = (reason) => {
    let title, description;

    if (reason.type === REASON_TYPE_CRITERIA) {
      const voteCount = reason.votes + " نفر";
      const votePercent = "(" + "حدود " + reason.percent + "٪" + ")";

      description = "توسط " + voteCount;
      title = reason.title;
    } else {
      description = "امتیاز " + reason.score + " از حداقل " + reason.passScore;
      title = "عدم کسب امتیاز کافی";
    }

    return (
      <>
        <div>{title}</div>
        <small style={{ color: "gray" }}>{description}</small>
      </>
    );
  };

  useEffect(() => {
    try {
      (async () => {
        setLoading(true);

        const suggestion = (await api._GET_ITEM(pageId))?.data?.["survey"];
        setSuggestionInfo(
          convertDataKeys(suggestionKeyMap(true), suggestion, true)
        );

        const reasons = [];
        const { data } = await api._GET_WORKGROUP_REJECT_REASON(pageId);
        const scoreData = data["score"];
        const gainedScore = Math.round(
          scoreData?.result?.average * scoreData?.result?.tadil
        );

        if (data["reject_list"]?.length)
          data["reject_list"].forEach((item) => {
            if (Number(item.count) >= Number(item.min_point))
              reasons.push({
                title: item.name,
                votes: item.count,
                type: REASON_TYPE_CRITERIA,
              });
          });

        if (scoreData && gainedScore < scoreData["min_pass"])
          reasons.push({
            title: "item.name",
            score: gainedScore,
            passScore: scoreData["min_pass"],
            type: REASON_TYPE_SCORE,
          });

        setRejectionReasons(reasons);
        setLoading(false);
      })();
    } catch (error) {
      message.error("مشکلی در نمایش صفحه پیش آمده است");
    }
  }, []);

  const sendRejectRequest = async () => {
    const res = await committeeApi._GET_MEMBER(SECRETARIAT_COMMITTEE_ID);

    if (Array.isArray(res.data)) {
      const secretary = res.data.find(
        (item) => item.position === committeeMemberPosition.SECRETARY
      );

      if (!secretary) {
        message.error("اطلاعات دبیر دبیرخانه یافت نشد");
        return false;
      }

      const data = {
        from_status: statusTypes.COMMITTEE_MEMBER_REJECTION,
        to_status: statusTypes.COMMITTEE_REJECTION,
        type: statusChangeTypes.BACKWARD,
        description:
          "پیام سیستم: پیشنهاد توسط کارگروه تخصصی رد شده و جهت بررسی ارجاع میگردد",
        personnel_ids: getAsArray(secretary.personnel_id),
      };

      try {
        await api._CHANGE_STATUS(pageId, data);
      } catch (error) {
        message.error("ابلاغ با مشکل روبرو شد");
      }

      message.success("با موفقیت انجام شد");

      const newPath = pageNames.suggest.suggestion.list;
      // history.replace(newPath);
      window.location = newPath;
    } else {
      message.error("دریافت اطلاعات دبیرخانه با مشکل روبرو شد");
    }
  };

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="رد پیشنهاد"
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
        <Descriptions title="اطلاعات پیشنهاد" bordered={true}>
          <Descriptions.Item label="عنوان پیشنهاد">
            {suggestionInfo.title}
          </Descriptions.Item>
          <Descriptions.Item label="نوع مشارکت">
            {suggestionInfo.participation_type}
          </Descriptions.Item>
          <Descriptions.Item label="نوع پیشنهاد">
            {suggestionInfo.suggestion_type}
          </Descriptions.Item>
          <Descriptions.Item label="حوزه پیشنهاد">
            {suggestionInfo.category
              ? suggestionInfo["category_name"]
              : suggestionInfo.custom_category || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="در حال اجرا">
            {suggestionInfo.is_in_process ? "بلی" : "-"}
          </Descriptions.Item>
          <Descriptions.Item>
            <Link to={getLink(pageNames.suggest.suggestion.view, pageId)}>
              مشاهده جزئیات پیشنهاد
            </Link>
          </Descriptions.Item>
        </Descriptions>
      </AppCard>

      <div style={{ height: "20px" }} />

      <AppCard>
        <div>
          <Divider orientation="right">دلایل رد از جانب اعضای کارگروه</Divider>
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={rejectionReasons}
            renderItem={(item) => (
              <List.Item>
                <AppCard title={getReasonTitle(item)}>
                  {getReasonDescription(item)}
                </AppCard>
              </List.Item>
            )}
          />
        </div>

        <div style={{ height: "20px" }} />

        <AppButton
          type="primary"
          icon={<RollbackOutlined />}
          className="big-btn"
          style={{ width: "200px" }}
          onClick={sendRejectRequest}
          hidden={!rejectionReasons.length}
        >
          رد و ارجاع به دبیرخانه
        </AppButton>
      </AppCard>
    </>
  );
}

export default SuggestionReject;
