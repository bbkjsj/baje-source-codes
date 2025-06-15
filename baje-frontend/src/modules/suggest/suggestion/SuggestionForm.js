import React, { useContext, useEffect, useReducer, useState } from "react";
import { Col, Divider, Form, message, Row, Spin, Modal } from "antd";
import GoBackBtn from "components/GoBackBtn";
import AppCard from "components/general/AppCard";
import * as fields from "./common/formItems";
import SubmitBtn from "components/general/SubmitBtn";
import { NewContext } from "contex/New-Context";
import { useHistory, useLocation } from "react-router-dom";
import { participationType, suggestionType, dealType, keyMap } from "./const";
import * as categoryApi from "../category/utils/api";
import * as callApi from "../call/utils/api";
import * as committeeApi from "../committee/utils/api";
import {
  convertDataKeys,
  getLink,
  notice,
  removeNullFromObject,
} from "_helpers";
import * as api from "./utils/api";
import useSaveSuggestion from "./common/useSaveSuggestion";
import ContentTop from "../../../components/general/ContentTop";
import { SuggestionType } from "./common/formItems";
import CallSubscribeModal from "./CallSubscribeModal";
import LogoLoading from "../../../components/general/LoadingLogo";
import { getServerDateTime } from "utils/api";
import { isCommitteeMemberActive } from "../committee/utils/tools";
import success from "assets/images/success.svg";
import { config, formItemLayout, formRowGutter, pageNames } from "constant";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

const pageReducer = (state, action) => {
  const { participants, del_participants, del_dis_adv } = state;

  switch (action.type) {
    case "PARTICIPANT/ADD":
      if (
        !participants.find(
          (item) => item.national_id === action.payload.national_id
        )
      )
        participants.push(action.payload);

      return {
        ...state,
        participants,
      };

    case "PARTICIPANT/DELETE":
      const items = participants.filter((item, index) => {
        return item.national_id !== action.payload;
      });

      return {
        ...state,
        participants: items,
      };

    case "PARTICIPANT/INIT":
      return {
        ...state,
        participants: action.payload,
      };

    case "PARTICIPANT/RESET":
      participants.length = 0;

      return {
        ...state,
        participants,
      };

    case "PARTICIPANT/LOG_DELETE":
      if (!del_participants.includes(action.payload))
        del_participants.push(action.payload);

      return {
        ...state,
        del_participants,
      };

    case "ADVANTAGE/LOG_DELETE":
      if (!del_dis_adv.includes(action.payload))
        del_dis_adv.push(action.payload);

      return {
        ...state,
        del_dis_adv,
      };

    case "CURRENT_GROUP_PERSON_CODE/SET":
      return {
        ...state,
        curr_group_person_code: action.payload,
      };
  }
};

function SuggestionForm(props) {
  const [mainForm] = Form.useForm();
  const newContext = useContext(NewContext);
  const user = useWhoAmI();
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [categoryList, setCategoryList] = useState([]);
  const [callList, setCallList] = useState([]);
  const [committeeList, setCommitteeList] = useState([]);
  const [initialPersonnelId, setInitialPersonnelId] = useState(null);
  const [currSuggestion, setCurrSuggestion] = useState();
  const [person, setPerson] = useState();
  const pageId = props.match.params.id;
  const isNew = !pageId;
  const [loading, setLoading] = useState(false);
  const [callModal, setCallModal] = useState(false);
  const [forceCommittee, setForceCommittee] = useState(0);

  const [pageState, pageDispatch] = useReducer(
    pageReducer,
    {
      participants: [],
      del_participants: [],
      del_dis_adv: [],
      curr_group_person_code: null,
    },
    (state) => state
  );

  const [savePageLoading, savePage] = useSaveSuggestion(pageState);

  const beforeSubmitCheck = () => {
    {
      const totalPercent = pageState.participants.reduce((total, item) => {
        return total + parseInt(item.percentage);
      }, 0);

      if (
        totalPercent < 100 &&
        mainForm.getFieldValue("participation_type") === participationType.GROUP
      ) {
        Modal.warn({
          title: "مجموع درصد مشارکت",
          content:
            "درصد مشارکت وارد شده برای افراد باید به گونه ای باشد که مجموع مشارکت گروه برابر ۱۰۰٪ گردد",
        });

        return false;
      }
    }

    if (
      pageState.participants.length < 2 &&
      mainForm.getFieldValue("participation_type") === participationType.GROUP
    ) {
      Modal.warn({
        title: "تعداد مشارکت کنندگان",
        content:
          "جهت ثبت پیشنهاد گروهی، لازم است حداقل ۲ نفر مشارکت کننده در پیشنهاد ثبت شده باشد",
      });

      return false;
    }

    if (
      !pageState.participants.find(
        (item) => item.national_id === user.nationalCode
      ) &&
      mainForm.getFieldValue("participation_type") === participationType.GROUP
    ) {
      Modal.warn({
        title: "مشارکت ثبت کننده پیشنهاد",
        content:
          "جهت ثبت پیشنهاد از جانب شما، ‌لازم است حتما در لیست مشارکت کنندگان نام خود را ثبت کنید",
      });

      return false;
    }

    if (isNew && !mainForm.getFieldValue("accept_rules")) {
      Modal.warn({
        title: "پذیرش قوانین نظام پیشنهاد",
        content:
          "لطفا پیش از ارسال فرم، گزینه موافقت خود با قوانین ارسال پیشنهاد را تیک بزنید",
      });

      return false;
    }

    if (
      mainForm.getFieldValue("suggestion_type") ===
        suggestionType.QUALITATIVE &&
      mainForm.getFieldValue("deal_type") === dealType.PARTNERSHIP
    ) {
      Modal.warn({
        title: "منافع مادی برای پیشنهاد کیفی",
        content:
          "طبق تعریف، پیشنهاد کیفی پیشنهادی است که منافع مادی ندارد. لذا خواهشمند است گزینه دیگری را انتخاب فرمایید و یا نوع پیشنهاد را به کمی یا ویژه تغییر دهید.",
      });

      return false;
    }

    return true;
  };

  const handleOnFinish = async (params) => {
    if (!beforeSubmitCheck()) return;

    if (params.participation_type === participationType.SINGLE) {
      pageDispatch({
        type: "PARTICIPANT/RESET",
      });

      const item = participantFactory({
        name: user.firstName + " " + user.lastName,
        national_id: user.nationalCode,
        percentage: 100,
        id: -1,
        personnel_id: user.nationalCode,
      });

      pageDispatch({
        type: "PARTICIPANT/ADD",
        payload: item,
      });
    }

    if (params.advantages)
      params.advantages = params.advantages.filter((el) => el.comment);
    if (params.disadvantages)
      params.disadvantages = params.disadvantages.filter((el) => el.comment);

    // console.log(params, "!params222");
    const result = await savePage(params, pageId);

    if (result && isNew) {
      Modal.info({
        icon: (
          <img
            src={success}
            alt="mobile"
            className="mx-auto d-block red"
            width="153"
          />
        ),
        title: "پیشنهاد با موفقیت ثبت شد",
        content:
          "از ثبت پیشنهاد ارزشمند جنابعالی، در سامانه نظام پیشنهادات هلدینگ جهاد نصر کرمان متشکریم",
        onOk: () => {
          const newPath = pageNames.suggest.suggestion.list;
          history.replace(newPath);
        },
      });
    } else {
      const newPath = pageNames.suggest.suggestion.list;
      history.replace(newPath);
    }
  };

  const onFormChange = (changed, all) => {
    if (changed.participation_type === participationType.GROUP) {
      if (
        !pageState.participants.find(
          (item) => item.national_id === user?.nationalCode
        ) &&
        user?.nationalCode
      ) {
        pageDispatch({
          type: "CURRENT_GROUP_PERSON_CODE/SET",
          payload: user?.nationalCode,
        });
      }
    }
  };

  const prepareFields = async () => {
    if (isNew) setInitialPersonnelId(user?.nationalCode);

    {
      const categories = await categoryApi._GET();
      setCategoryList(categories.data);
    }

    //used to list committees and filter calls below
    const validCommittees = [];

    {
      const serverDate = await getServerDateTime();
      const committees = await committeeApi._GET();

      for (const item of committees.data) {
        const members = await committeeApi._GET_MEMBER(item.id);

        if (
          members.data.find((item) =>
            isCommitteeMemberActive(item, serverDate.data.date)
          )
        )
          validCommittees.push(item);
      }

      setCommitteeList(validCommittees);
    }

    {
      const res = await callApi._GET_CURRENT();
      let calls = res.data;

      calls = calls.filter((callItem) =>
        validCommittees.find((item) => item.id === callItem["workgroup_id_fk"])
      );
      setCallList(calls);

      if (calls.length) mainForm.setFieldsValue({ related_call: calls[0]?.id });
    }
  };

  useEffect(() => {
    try {
      (async () => {
        await prepareFields();

        if (!isNew) {
          setLoading(true);
          const { data } = newContext.isPublicSuggestion()
            ? await api._GET_ITEM_PUBLIC(pageId)
            : await api._GET_ITEM(pageId);

          const pageData = {
            ...data.survey,
            advantages: data.advantages,
            disadvantages: data.disadvantages,
            participants: data.participants,
          };

          setCurrSuggestion(pageData);
          console.warn(pageData);

          if (data.survey?.file_url) {
            const initialFile = [
              {
                name: "فایل پیوست",
                status: "done",
                url: config.url.API_URL + data.survey.file_url,
              },
            ];

            notice(initialFile);
            mainForm.setFieldsValue({
              survey_file: initialFile,
            });
          }

          const cleanPageData = removeNullFromObject(pageData);

          mainForm.setFieldsValue(
            convertDataKeys(keyMap(true), cleanPageData, true)
          );

          pageData.participate_type === participationType.GROUP &&
            pageDispatch({
              type: "PARTICIPANT/INIT",
              payload: data.participants.map((item) =>
                participantFactory(item)
              ),
            });

          setLoading(false);
        }
      })();
    } catch (error) {
      message.error("مشکلی در نمایش صفحه پیش آمده است");
    }
  }, []);

  useEffect(() => {
    if (!isNew && currSuggestion?.["survey_call"])
      handleOnCallChange(mainForm.getFieldValue("related_call"));
  }, [callList, committeeList, currSuggestion]);

  useEffect(() => {
    if (!isNew) {
      if (
        mainForm.getFieldValue("participation_type") ===
        participationType.SINGLE
      ) {
        const participantId = currSuggestion.participants?.[0]?.personnel_id;

        setInitialPersonnelId(currSuggestion?.national_code);
        participantId &&
          pageDispatch({
            type: "PARTICIPANT/LOG_DELETE",
            payload: participantId,
          });
      }
    }
  }, [currSuggestion]);

  const participantFactory = (data) => {
    if (data.first_name && data.last_name && data.personnel_id)
      return {
        id: data.id || -1,
        name: data.first_name + " " + data.last_name,
        national_id: data.national_id || data.national_code,
        personnel_id: data.personnel_id,
        percentage: parseInt(data.percentage),
      };
    else return false;
  };

  const handleOnCallChange = (id) => {
    console.log(id);
    if (id && !callList.length) {
      Modal.warn({
        title: "انتخاب فراخوان",
        content:
          "هیچ فراخوان معتبر و فعالی جهت شرکت یافت نشد، ممکن است فراخوانی وجود داشته باشد که کارگروه مربوط به آن فاقد دبیر باشد یا قبلا از سیستم پاک شده باشد.",
      });

      return;
    }

    if (id && callList) {
      const theCall = callList.find((item) => item.id === id);

      if (
        theCall &&
        committeeList.find((item) => item.id === theCall["workgroup_id_fk"])
      ) {
        mainForm.setFieldsValue({ workgroup: theCall["workgroup_id_fk"] });
        setForceCommittee(theCall["workgroup_id_fk"]);
      } else if (theCall) {
        Modal.warn({
          title: "کارگروه مرتبط با فراخوان",
          content:
            "فراخوان انتخاب شده، توسط کارگروهی ایجاد شده که دبیر ندارد یا کارگروه مربوطه در سیستم وجود ندارد",
        });

        setForceCommittee(0);
      }
    } else {
      setForceCommittee(0);
    }
  };

  const formInitialValues = {
    participation_type: participationType.SINGLE,
    want_partnership: 1,
    is_in_process: 0,
    partnership_percent: 10,
    partnership_period: 1,
  };

  if (!isNew && !currSuggestion) {
    return <LogoLoading />;
  }

  return (
    <>
      <GoBackBtn />

      <ContentTop
        title={(isNew ? "ایجاد" : "ویرایش") + " پیشنهاد"}
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
        <Form
          {...formItemLayout}
          form={mainForm}
          name="suggestion"
          onFinish={handleOnFinish}
          onValuesChange={onFormChange}
          initialValues={formInitialValues}
        >
          <Spin spinning={loading || savePageLoading}>
            <Row gutter={formRowGutter}>
              <fields.Title />
              <fields.ParticipationType disabled={!isNew} />
              <Form.Item noStyle={true} shouldUpdate={true}>
                {(form) => {
                  return form.getFieldValue("participation_type") ===
                    participationType.GROUP ? (
                    [
                      <fields.GroupTitle />,
                      <fields.Participants
                        dispatch={pageDispatch}
                        state={pageState}
                        factory={participantFactory}
                        disabled={!isNew}
                      />,
                    ]
                  ) : (
                    <fields.Person
                      useForm={form}
                      setPerson={setPerson}
                      defaultValue={initialPersonnelId}
                      disabled={!isNew}
                    />
                  );
                }}
              </Form.Item>
              <Col span={24}>
                <Divider />
              </Col>
              <fields.Call
                items={callList}
                onButtonClick={() => setCallModal(true)}
                onChange={(id) => handleOnCallChange(id)}
                form={mainForm}
              />
              <Col span={24}>
                <Divider />
              </Col>
              <fields.SuggestionType />
              <fields.Committee
                items={committeeList}
                disabled={forceCommittee}
              />
              <fields.Category items={categoryList} />
              <fields.IsInProcess />
              <fields.WantPartnership />
              <fields.DealType />
              <fields.SuggestionPrice />
              <fields.PartnershipPercent />
              <fields.PartnershipPeriod />
              <fields.UploadDocs />
              <Col span={24}>
                <Divider orientation="right">اطلاعات پایه</Divider>
              </Col>
              <fields.TheProblem />
              <fields.TheIdea />
              <fields.Requirements />
              <fields.Advantages
                form={mainForm}
                state={pageState}
                dispatch={pageDispatch}
                disabledItems={
                  currSuggestion
                    ? currSuggestion["advantages"]?.map((item) => item.id)
                    : []
                }
              />
              <fields.Disadvantages
                form={mainForm}
                state={pageState}
                dispatch={pageDispatch}
                disabledItems={
                  currSuggestion
                    ? currSuggestion["disadvantages"]?.map((item) => item.id)
                    : []
                }
              />
              <Col span={24}>
                <Divider />
              </Col>
              {isNew && <fields.AcceptRules />}
              <SubmitBtn loading={savePageLoading} />
            </Row>
          </Spin>
        </Form>
      </AppCard>

      <CallSubscribeModal
        status={callModal}
        close={() => setCallModal(false)}
      />
    </>
  );
}

export default SuggestionForm;
