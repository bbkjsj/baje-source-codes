import React, {
  createElement,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  Col,
  Divider,
  Form,
  message,
  Input,
  Row,
  Spin,
  Modal,
  Descriptions,
  Space,
  Collapse,
  List,
  Tooltip,
  Comment,
  Button,
} from "antd";
import {
  DislikeOutlined,
  LikeOutlined,
  DislikeFilled,
  LikeFilled,
  PlusOutlined,
} from "@ant-design/icons";
import GoBackBtn from "components/GoBackBtn";
import AppCard from "components/general/AppCard";
import * as fields from "./common/formItems";
import SubmitBtn from "components/general/SubmitBtn";
import { Link, useHistory, useLocation } from "react-router-dom";
import {
  keyMap,
  pointTypes,
  senderTypes,
  reactionSubjectTypes,
  reactionTypes,
} from "./const";
import { keyMap as suggestionKeyMap } from "../suggestion/const";
import * as suggestionApi from "../suggestion/utils/api";
import * as api from "./utils/api";
import { convertDataKeys, getLink } from "_helpers";
import moment from "moment-jalaali";
import AppModal from "../../../components/general/AppModal";
import ContentTop from "../../../components/general/ContentTop";
import { formItemLayout, formRowGutter, pageNames } from "constant";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

const pageReducer = (state, action) => {
  const { points, reactions, comments } = state;
  let item, items;

  switch (action.type) {
    case "POINT/ADD":
      points.push(action.payload);

      return {
        ...state,
        points,
      };

    case "POINT/DELETE":
      items = points.filter((item, index) => {
        return item.id !== action.payload;
      });

      return {
        ...state,
        points: items,
      };

    case "REACTION/ADD":
      reactions.push(action.payload);

      return {
        ...state,
        reactions,
      };

    case "REACTION/DELETE":
      items = reactions.filter((item, index) => {
        return item.id !== action.payload;
      });

      return {
        ...state,
        reactions: items,
      };

    case "COMMENT/ADD":
      comments.push(action.payload);

      return {
        ...state,
        comments,
      };

    case "COMMENT/DELETE":
      items = comments.filter((item, index) => {
        return item.id !== action.payload;
      });

      return {
        ...state,
        comments: items,
      };
  }
};

function ForumIndex(props) {
  const user = useWhoAmI();
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const suggestionId = props.match.params.id;
  const [loading, setLoading] = useState(false);
  const [suggestionInfo, setSuggestionInfo] = useState({});
  const [isPointModalVisible, setIsPointModalVisible] = useState(false);
  const [pointModalType, setPointModalType] = useState(pointTypes.ADVANTAGE);

  const [pageState, pageDispatch] = useReducer(
    pageReducer,
    {
      points: [],
      reactions: [],
      comments: [],
    },
    (state) => state
  );

  useEffect(() => {
    try {
      (async () => {
        setLoading(true);

        const suggestion = (await suggestionApi._GET_ITEM(suggestionId))
          ?.data?.["survey"];
        setSuggestionInfo(
          convertDataKeys(suggestionKeyMap(true), suggestion, true)
        );

        const pointsList = [
          {
            id: 1,
            sender_id: 900,
            sender_type: senderTypes.STARTER,
            sender_position_title: "پیشنهاد دهنده",
            sender_name: "دانیال حمزه نژادی",
            body: "کاهش هزینه های مربوط به قطعات فرسوده",
            type: pointTypes.ADVANTAGE,
            datetime: "2021-01-26 18:27:00",
          },
          {
            id: 2,
            sender_id: 900,
            sender_type: senderTypes.STARTER,
            sender_position_title: "پیشنهاد دهنده",
            sender_name: "دانیال حمزه نژادی",
            body: "استفاده از امکانات داخلی سازمان جهت اجرا",
            type: pointTypes.ADVANTAGE,
            datetime: "2021-02-04 12:20:00",
          },
          {
            id: 3,
            sender_id: 640,
            sender_type: senderTypes.PERSONNEL,
            sender_position_title: "دبیر کارگروه تخصصی",
            sender_name: "کامبیز افخمی",
            body: "افزایش سرعت رسیدگی به درخواست های جدید",
            type: pointTypes.ADVANTAGE,
            datetime: "2021-02-05 16:18:00",
          },
          {
            id: 4,
            sender_id: 618,
            sender_type: senderTypes.PERSONNEL,
            sender_position_title: "دبیر کارگروه عالی",
            sender_name: "سپهر اسماعیلیان",
            body: "عدم رعایت سقف بودجه ی هولدینگ در خصوص پروپوزال ها",
            type: pointTypes.DISADVANTAGE,
            datetime: "2021-01-21 11:38:00",
          },
        ];

        const reactionsList = [
          {
            id: 1,
            subject_type: reactionSubjectTypes.POINT,
            subject_id: 2,
            sender_id: 900,
            sender_name: "علیرضا رحمانی",
            sender_position_title: "دبیر کارگروه عالی",
            type: reactionTypes.LIKE,
            datetime: "2021-01-21 11:38:00",
          },
          {
            id: 2,
            subject_type: reactionSubjectTypes.POINT,
            subject_id: 2,
            sender_id: 904,
            sender_name: "رضا پورحبیبی",
            sender_position_title: "عضو کارگروه تخصصی",
            type: reactionTypes.LIKE,
            datetime: "2021-01-22 11:10:00",
          },
          {
            id: 3,
            subject_type: reactionSubjectTypes.POINT,
            subject_id: 3,
            sender_id: 904,
            sender_name: "رضا پورحبیبی",
            sender_position_title: "عضو کارگروه تخصصی",
            type: reactionTypes.DISLIKE,
            datetime: "2021-01-21 04:38:00",
          },
        ];

        const commentsList = [
          {
            id: 1,
            subject_type: reactionSubjectTypes.POINT,
            subject_id: 3,
            sender_id: 900,
            sender_name: "علیرضا رحمانی",
            sender_position_title: "دبیر کارگروه عالی",
            body: "هیچ کدام از رویه های نظام بررسی در این مزیت وجود ندارد",
            datetime: "2021-01-21 11:38:00",
          },
          {
            id: 2,
            subject_type: reactionSubjectTypes.POINT,
            subject_id: 3,
            sender_id: 904,
            sender_name: "رضا پورحبیبی",
            sender_position_title: "عضو کارگروه تخصصی",
            body:
              "برای دستیابی به این مزیت، باید همه ی بودجه ی سازمان مورد نظارت قرار گیرد",
            datetime: "2021-01-22 11:10:00",
          },
          {
            id: 3,
            subject_type: reactionSubjectTypes.POINT,
            subject_id: 3,
            sender_id: 904,
            sender_name: "رضا پورحبیبی",
            sender_position_title: "عضو کارگروه تخصصی",
            body: "میتواند با هر نوع اصلاح به این مزیت برسد",
            datetime: "2021-01-21 04:38:00",
          },
        ];

        pointsList.forEach((item) => {
          pageDispatch({
            type: "POINT/ADD",
            payload: pointFactory(item),
          });
        });

        reactionsList.forEach((item) => {
          pageDispatch({
            type: "REACTION/ADD",
            payload: reactionFactory(item),
          });
        });

        commentsList.forEach((item) => {
          pageDispatch({
            type: "COMMENT/ADD",
            payload: commentFactory(item),
          });
        });

        setLoading(false);
      })();
    } catch (error) {
      message.error("مشکلی در نمایش صفحه پیش آمده است");
    }
  }, []);

  const pointFactory = (data) => {
    if (data.body && data.type) {
      return {
        id: data.id,
        sender_id: data.sender_id,
        sender_position_title: data.sender_position_title,
        sender_name: data.sender_name,
        body: data.body,
        type: data.type,
        datetime: data.datetime,
      };
    } else return null;
  };

  const reactionFactory = (data) => {
    if (data.subject_type && data.type) {
      return {
        id: data.id,
        subject_type: data.subject_type,
        subject_id: data.subject_id,
        sender_id: data.sender_id,
        sender_position_title: data.sender_position_title,
        sender_name: data.sender_name,
        type: data.type,
        datetime: data.datetime,
      };
    } else return null;
  };

  const commentFactory = (data) => {
    if (data.body && data.subject_id) {
      return {
        id: data.id,
        subject_id: data.subject_id,
        sender_id: data.sender_id,
        sender_position_title: data.sender_position_title,
        sender_name: data.sender_name,
        body: data.body,
        datetime: data.datetime,
      };
    } else return null;
  };

  const formatDateTime = (input, withTime = true) => {
    const mObject = moment(input, "YYYY-M-D HH:mm:ss");

    if (withTime) return mObject.format("jDD jMMMM jYYYY - HH:mm");
    else return mObject.format("jDD jMMMM jYYYY");
  };

  const getPointDescription = (item) => {
    return item.sender_name + " در " + formatDateTime(item.datetime, false);
  };

  const getPointsList = (typeFilter) => {
    const output = [];

    pageState.points.forEach((item, index) => {
      if (item.type === typeFilter) {
        const likes = getReactionsList(
          item.id,
          reactionSubjectTypes.POINT,
          reactionTypes.LIKE
        );
        const dislikes = getReactionsList(
          item.id,
          reactionSubjectTypes.POINT,
          reactionTypes.DISLIKE
        );

        const final = {
          ...item,
          likes,
          dislikes,
          likedByMe: !!likes.find((item) => item.sender_id === user.id),
          dislikedByMe: !!dislikes.find((item) => item.sender_id === user.id),
          comments: getCommentsList(item.id),
          isMine: item.sender_id === user.id,
        };

        output.push(final);
      }
    });

    return output;
  };

  const deletePoint = (id) => {
    pageDispatch({
      type: "POINT/DELETE",
      payload: id,
    });
  };

  const getReactionsList = (subjectId, subjectType, reactionType = false) => {
    const output = [];

    pageState.reactions.forEach((item, index) => {
      if (
        item.subject_id === subjectId &&
        item.subject_type === subjectType &&
        item.type === reactionType
      ) {
        const final = {
          ...item,
          datetimeString: formatDateTime(item.datetime),
        };

        output.push(final);
      }
    });

    return output;
  };

  const getCommentsList = (subjectId) => {
    const output = [];

    pageState.comments.forEach((item, index) => {
      if (item.subject_id === subjectId) {
        const likes = getReactionsList(
          item.id,
          reactionSubjectTypes.COMMENT,
          reactionTypes.LIKE
        );
        const dislikes = getReactionsList(
          item.id,
          reactionSubjectTypes.COMMENT,
          reactionTypes.DISLIKE
        );

        const final = {
          ...item,
          likes,
          dislikes,
          likedByMe: !!likes.find((item) => item.sender_id === user.id),
          dislikedByMe: !!dislikes.find((item) => item.sender_id === user.id),
          isMine: item.sender_id === user.id,
        };

        output.push(final);
      }
    });

    return output;
  };

  const deleteComment = (id) => {
    pageDispatch({
      type: "COMMENT/DELETE",
      payload: id,
    });
  };

  const addReaction = (subjectType, subjectId, type) => {
    const data = {
      id: Date.now(),
      subject_type: subjectType,
      subject_id: subjectId,
      sender_id: user.id,
      sender_position_title: "عضو کارگروه تخصصی",
      sender_name: user.firstName + " " + user.lastName,
      type: type,
      datetime: moment().format("YYYY-M-D HH:mm:ss"),
    };

    pageDispatch({
      type: "REACTION/ADD",
      payload: data,
    });
  };

  const getCommentsInterface = (comments) => (
    <List
      className="comment-list"
      header={comments.length + " دیدگاه"}
      itemLayout="horizontal"
      dataSource={comments}
      renderItem={(item) => {
        const actions = [
          <Tooltip key="comment-basic-like" title="موافقت">
            <span
              onClick={() =>
                addReaction(
                  reactionSubjectTypes.COMMENT,
                  item.id,
                  reactionTypes.LIKE
                )
              }
            >
              {createElement(item.likedByMe ? LikeFilled : LikeOutlined)}
              <span className="comment-action">
                {item.likes.length || null}
              </span>
            </span>
          </Tooltip>,
          <Tooltip key="comment-basic-dislike" title="مخالفت">
            <span
              onClick={() =>
                addReaction(
                  reactionSubjectTypes.COMMENT,
                  item.id,
                  reactionTypes.DISLIKE
                )
              }
            >
              {React.createElement(
                item.dislikedByMe ? DislikeFilled : DislikeOutlined
              )}
              <span className="comment-action">
                {item.dislikes.length || null}
              </span>
            </span>
          </Tooltip>,
          item.isMine && (
            <span
              key="comment-delete-item"
              onClick={() => deleteComment(item.id)}
            >
              حذف دیدگاه
            </span>
          ),
        ];

        const datetime = (
          <Tooltip title={formatDateTime(item.datetime)}>
            <span>{moment(item.datetime, "YYYY-M-D HH:mm:ss").fromNow()}</span>
          </Tooltip>
        );

        return (
          <li>
            <Comment
              actions={actions}
              author={item.sender_name}
              avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              content={<p>{item.body}</p>}
              datetime={datetime}
            />
          </li>
        );
      }}
    />
  );

  const CommentForm = ({ subjectId }) => {
    const [localForm] = Form.useForm();
    const [isSaving, setIsSaving] = useState(false);

    const onFormFinish = (params) => {
      const data = {
        id: Date.now(),
        subject_id: subjectId,
        sender_id: user.id,
        sender_position_title: "عضو کارگروه تخصصی",
        sender_name: user.firstName + " " + user.lastName,
        body: params.body,
        datetime: moment().format("YYYY-M-D HH:mm:ss"),
      };

      pageDispatch({
        type: "COMMENT/ADD",
        payload: commentFactory(data),
      });

      localForm.resetFields();
    };

    return (
      <Form form={localForm} onFinish={onFormFinish}>
        <Form.Item name="body">
          <Input.TextArea placeholder="دیدگاه خود را اینجا وارد کنید..." />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          درج دیدگاه
        </Button>
      </Form>
    );
  };

  const PointModal = (props) => {
    const [localForm] = Form.useForm();
    const [saving, setSaving] = useState(false);

    const onFormFinish = (params) => {
      const data = {
        id: Date.now(),
        sender_id: user.id,
        sender_position_title: "عضو کارگروه تخصصی",
        sender_name: user.firstName + " " + user.lastName,
        body: params.body,
        type: props.type,
        datetime: moment().format("YYYY-M-D HH:mm:ss"),
      };

      pageDispatch({
        type: "POINT/ADD",
        payload: pointFactory(data),
      });

      localForm.resetFields();
      setIsPointModalVisible(false);
    };

    const onModalCancel = () => {
      setIsPointModalVisible(false);
    };

    return (
      <AppModal
        {...props}
        title={
          props.type === pointTypes.ADVANTAGE ? "ثبت مزیت جدید" : "ثبت عیب جدید"
        }
        onOk={() => localForm.submit()}
        onCancel={onModalCancel}
        okText="تایید و درج"
      >
        <Form
          {...formItemLayout}
          form={localForm}
          name="pointForm"
          onFinish={onFormFinish}
          layout="vertical"
        >
          <Spin spinning={saving}>
            <Form.Item
              name="body"
              label={"عنوان " + (pointTypes.ADVANTAGE ? "مزیت" : "عیب")}
              rules={[{ required: true }]}
              wrapperCol={24}
            >
              <Input placeholder="متن مورد نظر را اینجا بنویسید..." />
            </Form.Item>
          </Spin>
        </Form>
      </AppModal>
    );
  };

  const getPointInterface = (point, pointIndex = Date.now()) => {
    const actions = [
      <Tooltip key="comment-basic-like" title="موافقت">
        <span
          onClick={(e) => {
            addReaction(
              reactionSubjectTypes.POINT,
              point.id,
              reactionTypes.LIKE
            );
            e.stopPropagation();
          }}
        >
          {createElement(point.likedByMe ? LikeFilled : LikeOutlined)}
          <span className="comment-action">{point.likes.length || null}</span>
        </span>
      </Tooltip>,
      <Tooltip key="comment-basic-dislike" title="مخالفت">
        <span
          onClick={(e) => {
            addReaction(
              reactionSubjectTypes.POINT,
              point.id,
              reactionTypes.DISLIKE
            );
            e.stopPropagation();
          }}
        >
          {React.createElement(
            point.dislikedByMe ? DislikeFilled : DislikeOutlined
          )}
          <span className="comment-action">
            {point.dislikes.length || null}
          </span>
        </span>
      </Tooltip>,
      point.isMine && (
        <span key="comment-delete-item" onClick={() => deletePoint(point.id)}>
          حذف
        </span>
      ),
    ];

    const extra = <Space>{actions}</Space>;

    return (
      <Collapse.Panel header={point.body} key={pointIndex} extra={extra}>
        <small>{getPointDescription(point)}</small>
        <div style={{ height: "8px" }} />
        {point.comments.length ? getCommentsInterface(point.comments) : null}
        <CommentForm subjectId={point.id} />
      </Collapse.Panel>
    );
  };

  return (
    <>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <GoBackBtn />

        <ContentTop
          title="بررسی مزایا و معایب پیشنهاد"
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
              <Link
                to={getLink(pageNames.suggest.suggestion.view, suggestionId)}
              >
                مشاهده جزئیات پیشنهاد
              </Link>
            </Descriptions.Item>
          </Descriptions>
        </AppCard>

        <AppCard>
          <Row>
            <Col flex="auto">
              <h3>مزایای پیشنهاد</h3>
            </Col>
            <Col flex="none">
              <a
                onClick={() => {
                  setPointModalType(pointTypes.ADVANTAGE);
                  setIsPointModalVisible(true);
                }}
              >
                <Space>
                  <PlusOutlined />
                  <span>افزودن مزیت</span>
                </Space>
              </a>
            </Col>
          </Row>
          <Collapse accordion={true}>
            {getPointsList(pointTypes.ADVANTAGE).map(getPointInterface)}
          </Collapse>
        </AppCard>

        <AppCard>
          <Row>
            <Col flex="auto">
              <h3>معایب پیشنهاد</h3>
            </Col>
            <Col flex="none">
              <a
                onClick={() => {
                  setPointModalType(pointTypes.DISADVANTAGE);
                  setIsPointModalVisible(true);
                }}
              >
                <Space>
                  <PlusOutlined />
                  <span>افزودن عیب</span>
                </Space>
              </a>
            </Col>
          </Row>
          <Collapse accordion={true}>
            {getPointsList(pointTypes.DISADVANTAGE).map(getPointInterface)}
          </Collapse>
        </AppCard>
      </Space>
      <PointModal visible={isPointModalVisible} type={pointModalType} />
    </>
  );
}

export default ForumIndex;
