import { message, Modal } from "antd";
import { forwardTypeValues, statusChangeTypes, statusTypes } from "../const";
import * as committeeApi from "../../committee/utils/api";
import { getServerDateTime } from "utils/api";
import { isCommitteeMemberActive } from "../../committee/utils/tools";
import { committeeMemberPosition } from "../../committee/const";
import * as api from "../utils/api";
import { getAsArray, notice } from "../../../../_helpers";
import moment from "moment-jalaali";
import { EXCELLENT_COMMITTEE_ID } from "../../const";
import { setSuggestionAsSeen } from "../utils/";
import { store } from "../../../../store";

export const handleOnForwardSubmit = async (
  result,
  newContext,
  currentSuggestion,
  setIsForwardVisible,
  getList,
  history
) => {
  let forwardParams = null;

  if (!result["subjectId"]) {
    message.error("موضوع ارجاع یافت نشد");
    return;
  }

  //set suggestion as seen by forward
  await setSuggestionAsSeen(
    result["subjectId"],
    newContext.isPublicSuggestion()
  );

  switch (result.type) {
    case forwardTypeValues.TO_COMMITTEE:
      {
        if (!result.custom) {
          message.error("کارگروه مقصد ارجاع یافت نشد");
          return;
        }

        try {
          const res = await committeeApi._GET_MEMBER(result.custom);

          if (Array.isArray(res.data)) {
            const serverDate = await getServerDateTime();
            const secretary = res.data.find(
              (item) =>
                isCommitteeMemberActive(item, serverDate.data.date) &&
                item.position === committeeMemberPosition.SECRETARY
            );

            if (secretary && secretary.personnel_id) {
              try {
                const res = await api._CHANGE_COMMITTEE(
                  currentSuggestion.s_id || currentSuggestion.id,
                  result.custom
                );

                let statusRes = await api._CHANGE_STATUS(result["subjectId"], {
                  from_status: currentSuggestion.status,
                  to_status: statusTypes.COMMITTEE_HEAD_REVIEW,
                  type: statusChangeTypes.FORWARD,
                  description: result["message"],
                  personnel_ids: getAsArray(secretary.personnel_id),
                });

                if (res.status === 200 && statusRes.status === 200) {
                  message.success("عملیات ارجاع با موفقیت انجام شد");
                  history.go();
                }
              } catch (error) {
                message.error("عملیات ارجاع با مشکل روبرو شد");
              }
            } else {
              Modal.warn({
                title: "کارگروه فاقد دبیر",
                content:
                  "برای این کارگروه دبیر تعریف نشده یا تاریخ عضویت وی پایان یافته و قابل انتخاب جهت ارجاع نمی‌باشد",
              });

              return;
            }
          }
        } catch (error) {
          message.error("دریافت اطلاعات کارگروه با مشکل روبرو شد");
        }
      }

      break;

    case forwardTypeValues.TO_SECRETARIAT_MEMBER:
      {
        if (!result.personnel) {
          message.error("فرد مقصد ارجاع یافت نشد");
          return;
        }

        try {
          const res = await api._CHANGE_STATUS(result["subjectId"], {
            from_status: statusTypes.SECRETARIAT_HEAD_REVIEW,
            to_status: statusTypes.SECRETARIAT_MEMBER_REVIEW,
            type: statusChangeTypes.FORWARD,
            description: result["message"],
            personnel_ids: getAsArray(result.personnel),
          });

          if (res.status === 200) {
            message.success("عملیات ارجاع با موفقیت انجام شد");
            history.go();
          } else message.error("عملیات ارجاع با مشکل روبرو شد");
        } catch (error) {
          message.error("دریافت اطلاعات کارگروه با مشکل روبرو شد");
        }
      }

      break;

    case forwardTypeValues.TO_COMMITTEE_MEMBER:
      {
        if (
          !result.personnel ||
          (result.personnel.length === 1 && result.personnel[0] === 0)
        ) {
          Modal.warn({
            title: "انتخاب عضو جهت امتیازدهی",
            content:
              "لازم است حداقل یک عضو عادی در کارگروه تعریف شده و جهت امتیازدهی انتخاب گردد.",
          });

          return;
        }

        const res = await api._CHANGE_STATUS(result["subjectId"], {
          from_status: statusTypes.COMMITTEE_HEAD_REVIEW,
          to_status: statusTypes.COMMITTEE_MEMBER_REVIEW,
          type: statusChangeTypes.FORWARD,
          description: result["message"],
          personnel_ids: getAsArray(result.personnel),
        });

        if (res.status === 200) {
          message.success("عملیات ارجاع با موفقیت انجام شد");
          history.go();
        } else message.error("عملیات ارجاع با مشکل روبرو شد");
      }

      break;

    case forwardTypeValues.TO_PENDING:
      {
        const restartDate = moment(
          result["restart_date"],
          "jYYYY/jM/jD"
        ).format("YYYY/M/D HH:mm:ss");

        const res = await api._CHANGE_STATUS(result["subjectId"], {
          from_status: currentSuggestion.status,
          to_status: statusTypes.PENDING,
          type: statusChangeTypes.FORWARD,
          description: result["message"],
          restart_date: restartDate,
        });

        if (res.status === 200) {
          message.success("عملیات ارجاع با موفقیت انجام شد");
          history.go();
        } else message.error("عملیات ارجاع با مشکل روبرو شد");
      }

      break;

    case forwardTypeValues.TO_STARTER:
      if (result.personnel !== false && !result.personnel) {
        message.error("دریافت کننده ی ارجاع یافت نشد");
        return;
      }

      forwardParams = {
        from_status: currentSuggestion.status,
        to_status: statusTypes.STARTER_REVIEW,
        type: statusChangeTypes.BACKWARD,
      };
      break;

    case forwardTypeValues.TO_EXCELLENT_COMMITTEE:
      const res = await committeeApi._GET_MEMBER(EXCELLENT_COMMITTEE_ID);
      const serverDate = await getServerDateTime();
      const members = res.data.filter((item) =>
        isCommitteeMemberActive(item, serverDate.data.date)
      );
      const personnelIds = members.map((item) => item.personnel_id);

      forwardParams = {
        from_status: currentSuggestion.status,
        to_status: statusTypes.EXCELLENT_COMMITTEE_MEMBER_REVIEW,
        type: statusChangeTypes.FORWARD,
        personnel_ids: getAsArray(personnelIds),
      };

      console.log(forwardParams);
      break;

    case forwardTypeValues.TO_EXECUTOR_INITIAL:
      {
        notice("excellent form");
        console.log(result);

        if (!result.person_personnel_id && !Number(result.companies)) {
          Modal.warn({
            title: "انتخاب مجری",
            content:
              "لطفا برای ادامه، مجری را از بین افراد حقیقی یا حقوقی انتخاب نمایید.",
          });

          return;
        }

        let unitTitle = null;

        if (result["executor_type"] === "person") {
          const res = await api._GET_PERSONNEL_INFO(
            result.person_national_code
          );
          unitTitle = `${res.data.first_name}  ${res.data.last_name}`;
        } else {
          const res = await api._GET_COMPANIES();
          const company = res.data.list.find(
            (item) => item.id === result["companies"]
          );

          if (!company.first_name && !company.last_name) {
            Modal.warn({
              title: "عدم وجود اطلاعات کافی",
              content:
                "مدیرعامل این شرکت مشخص نیست، لطفاً ابتدا نسبت به تعیین مدیرعامل اقدام فرمایید.",
            });

            return;
          }

          unitTitle = company.name;
        }

        const data = {
          from_status: currentSuggestion.status,
          to_status: statusTypes.EXECUTOR_INITIAL_REVIEW,
          type: statusChangeTypes.FORWARD,
          description: result["message"],
          personnel_id:
            result["executor_type"] === "person"
              ? result.person_personnel_id
              : undefined,
          company_id:
            result["executor_type"] === "company"
              ? result.companies
              : undefined,
          reward: result.suggest_reward,
          score: result.score,
          suggest_type: result.reward_type,
          reward_type: result.reward_type,
          unit: unitTitle,
          category: result["category"],
          category_title: result["custom_category"],
        };

        notice("excellent forward");
        console.log(data, "!!!data");

        const res = await api._CHANGE_STATUS(result["subjectId"], data);

        if (res.status === 200) {
          message.success("عملیات ارجاع با موفقیت انجام شد");
          history.go();
        } else message.error("عملیات ارجاع با مشکل روبرو شد");
      }
      break;

    case forwardTypeValues.TO_SECRETARIAT:
      const toStatus =
        result["forward_reason"] === "rejection"
          ? statusTypes.COMMITTEE_HEAD_REJECTION
          : statusTypes.SECRETARIAT_CHANGE_WORKGROUP;

      forwardParams = {
        from_status: currentSuggestion.status,
        to_status: toStatus,
        type: statusChangeTypes.FORWARD,
        forward_reason: result.forward_reason,
      };
      break;

    case forwardTypeValues.TO_CEO:
      const statusLog = await api._GET_STATUS_LOG(
        currentSuggestion.s_id || currentSuggestion.id
      );
      const prevRejections = statusLog.data.filter(
        (item) =>
          item.to_status === statusTypes.EXECUTOR_REJECTION &&
          item.personnel_id === store.getState().user.id
      ).length;

      if (prevRejections) {
        Modal.warn({
          title: "عدم امکان رد پیشنهاد",
          content:
            "این پیشنهاد قبلا یکبار توسط مجری رد شده و لازم الاجرا می باشد",
        });

        return;
      }

      forwardParams = {
        from_status: currentSuggestion.status,
        to_status: statusTypes.EXECUTOR_REJECTION,
        type: statusChangeTypes.FORWARD,
      };
      break;
  }

  if (forwardParams) {
    {
      const res = await api._CHANGE_STATUS(result["subjectId"], {
        description: result["message"],
        personnel_ids: getAsArray(result.personnel),
        ...forwardParams,
      });

      if (res.status === 200) {
        message.success("عملیات ارجاع با موفقیت انجام شد");
        history.go();
      } else message.error("عملیات ارجاع با مشکل روبرو شد");
    }
  }

  setIsForwardVisible(false);
};
