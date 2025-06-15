import { pageNames } from "constant";
import { getLink } from "_helpers";
import { _GET_BY_COMMITTEE } from "../../assessmentCriteria/utils/api";
import { message, Modal } from "antd";
import { checkSuggestionPermission, findCommitteeHead } from "../utils";
import {
  cartableFilters,
  detailsPageActions,
  statusChangeTypes,
  statusTypes,
  suggestAccessTypes,
} from "../const";
import * as api from "../utils/api";

const mobileActions = ({
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
}) => [
  {
    name: "جزئیات",
    onClick: (record) =>
      history.push(
        getLink(
          pageNames.suggest.suggestion.view,
          record.id || record.s_id || record.sid
        )
      ),
  },
  {
    name: "ویرایش",
    onClick: (record) =>
      history.push(
        getLink(pageNames.suggest.suggestion.edit, record.id || record.s_id)
      ),
    hide: (record) => !record._is_editable,
  },
  {
    name: "حذف",
    onClick: (record) =>
      Modal.confirm({
        onOk: () => deleteItems(record.id || record.s_id),
        content: "آیا از حذف این مورد اطمینان دارید؟",
      }),
    hide: (record) => !record._is_deletable,
  },
  {
    name: "پیام همراه ارجاع",
    onClick: (record) =>
      Modal.info({
        title: "پیام همراه ارجاع",
        content: (record) => record.message,
      }),
    hide: (record) => !record.message || record.message == "****",
  },
  {
    title: "امتیازدهی",
    onClick: (record) => {
      try {
        // console.log(record, "!rec");
        _GET_BY_COMMITTEE(record.workgroup_id_fk).then(({ data }) => {
          if (data?.length !== 0) {
            history.push(
              getLink(pageNames.suggest.evaluationApply, {
                suggestion: record.s_id || record.id,
                personnel: "",
              })
            );
          } else {
            message.warn(
              "برای این کارگروه ملاک ارزیابی  تعریف نشده است. جهت ایجاد ملاک ارزیابی با مدیر نظام پیشنهادات تماس بگیرید."
            );
          }
        });
      } catch (error) {
        message.error("مشکلی در دریافت اطلاعات پیش آمده است.");
      }
    },
    hide: (record) =>
      !(
        checkSuggestionPermission(
          [suggestAccessTypes.WORKGROUP_MEMBER],
          record.totalRoles
        ) && record.status === statusTypes.COMMITTEE_MEMBER_REVIEW
      ),
  },
  {
    title: "ارجاع",
    onClick: (record) => onForwardClick(record),
    hide: (record) => newContext.isPublicSuggestion(),
  },
  {
    title: "مزایا/معایب",
    onClick: (record) =>
      history.push(
        getLink(pageNames.suggest.forumIndex, record.s_id || record.id)
      ),
    hide: (record) =>
      !(
        checkSuggestionPermission(
          [
            suggestAccessTypes.SURVEY_MANAGER,
            suggestAccessTypes.SECRETARIAT_HEAD,
            suggestAccessTypes.SECRETARIAT_MEMBER,
            suggestAccessTypes.WORKGROUP_HEAD,
            suggestAccessTypes.WORKGROUP_MEMBER,
            suggestAccessTypes.EXCELLENT_HEAD,
            suggestAccessTypes.EXCELLENT_MEMBER,
            suggestAccessTypes.HOLDING_CEO,
          ],
          record.totalRoles
        ) &&
        [
          statusTypes.STARTER_REVISION_REQUEST,
          statusTypes.SECRETARIAT_HEAD_REVIEW,
          statusTypes.SECRETARIAT_MEMBER_REVIEW,
          statusTypes.SECRETARIAT_REJECTION,
          statusTypes.SECRETARIAT_CHANGE_WORKGROUP,
          statusTypes.COMMITTEE_HEAD_REVIEW,
          statusTypes.COMMITTEE_HEAD_REJECTION,
          statusTypes.COMMITTEE_HEAD_TIMELINE_REVIEW,
          statusTypes.COMMITTEE_MEMBER_REVIEW,
          statusTypes.COMMITTEE_MEMBER_ACCEPTION,
          statusTypes.COMMITTEE_MEMBER_REJECTION,
          statusTypes.COMMITTEE_REJECTION,
          statusTypes.EXCELLENT_COMMITTEE_MEMBER_REVIEW,
          statusTypes.EXCELLENT_COMMITTEE_REJECTION,
        ].includes(record.status)
      ),
  },
  //Reject for committee head
  {
    title: "رد پیشنهاد",
    onClick: (record) =>
      history.push(
        getLink(pageNames.suggest.suggestion.reject, record.s_id || record.id)
      ),
    hide: (record) =>
      !(
        checkSuggestionPermission(
          [suggestAccessTypes.WORKGROUP_HEAD],
          record.totalRoles
        ) && [statusTypes.COMMITTEE_MEMBER_REJECTION].includes(record.status)
      ),
  },
  //Reject for executor (initial)
  {
    title: "رد پیشنهاد",
    onClick: async (record) => {
      Modal.confirm({
        title: "رد پیشنهاد",
        content: "آیا مایل به رد پیشنهاد هستید؟",
        onOk: async () => {
          const committeeHead = await findCommitteeHead(
            record["workgroup_id_fk"]
          );

          if (committeeHead) {
            const rejectData = {
              from_status: record.status,
              to_status: statusTypes.EXECUTOR_REJECTION,
              type: statusChangeTypes.FORWARD,
              description:
                "پیشنهاد توسط مجری رد شد و برنامه زمانبندی ارسال نگردید",
              personnel_ids: [committeeHead.id],
            };

            await api._CHANGE_STATUS(record.id || record.s_id, rejectData);

            message.success("پیشنهاد رد شد");
            history.go();
          } else {
            Modal.warn({
              title: "دبیر کارگروه",
              content:
                "دبیر کارگروه مربوطه یافت نشد یا عضویت وی به پایان رسیده است. جهت رد پیشنهاد لازم است دبیر جهت بررسی مشخص باشد.",
            });
          }
        },
      });
    },

    hide: (record) =>
      !(
        checkSuggestionPermission(
          [suggestAccessTypes.EXECUTOR],
          record.totalRoles
        ) && [statusTypes.EXECUTOR_INITIAL_REVIEW].includes(record.status)
      ),
  },
  {
    title: "رد نهایی پیشنهاد",
    onClick: (record) => {
      setCurrentSuggestion(record);
      setIsRejectModalVisible(true);
    },
    hide: (record) =>
      !(
        checkSuggestionPermission(
          [
            suggestAccessTypes.SECRETARIAT_HEAD,
            suggestAccessTypes.SECRETARIAT_MEMBER,
          ],
          record.totalRoles
        ) &&
        [
          statusTypes.COMMITTEE_REJECTION,
          statusTypes.COMMITTEE_HEAD_REJECTION,
          statusTypes.EXCELLENT_COMMITTEE_REJECTION,
        ].includes(record.status)
      ),
  },
  {
    title: "برنامه زمانبندی",
    onClick: (record) => {
      setCurrentSuggestion(record);
      setIsSubmitTimelineModalVisible(true);
    },
    hide: (record) =>
      !(
        checkSuggestionPermission(
          [suggestAccessTypes.EXECUTOR],
          record.totalRoles
        ) &&
        [
          statusTypes.EXECUTOR_INITIAL_REVIEW,
          statusTypes.EXECUTOR_TIMELINE_CORRECTION,
        ].includes(record.status)
      ),
  },
  {
    title: "رد برنامه زمانبندی",
    onClick: async (record) => {
      const rejectData = {
        from_status: record.status,
        to_status: statusTypes.EXECUTOR_TIMELINE_CORRECTION,
        type: statusChangeTypes.FORWARD,
        description:
          "برنامه زمانبندی توسط دبیر کارگروه تخصصی رد شد و در انتظار اصلاح و ارسال مجدد میباشد",
        personnel_ids: [],
      };

      await api._CHANGE_STATUS(record.id || record.s_id, rejectData);

      message.success("برنامه زمانبندی رد شد");
      history.go();
    },

    hide: (record) =>
      !(
        checkSuggestionPermission(
          [suggestAccessTypes.WORKGROUP_HEAD],
          record.totalRoles
        ) &&
        [statusTypes.COMMITTEE_HEAD_TIMELINE_REVIEW].includes(record.status)
      ),
  },
  //review request from starter
  {
    title: "درخواست تجدید نظر",
    onClick: async (record) => {
      const statusLog = await api._GET_STATUS_LOG_PUBLIC(
        record.s_id || record.id
      );

      //check if has rejection by excellent committee in log
      const hasExcellentRejection = statusLog.data.filter((item) =>
        [statusTypes.EXCELLENT_COMMITTEE_REJECTION].includes(item.to_status)
      );

      if (hasExcellentRejection.length) {
        Modal.warn({
          title: "محدودیت درخواست",
          content:
            "با توجه به اینکه پیشنهاد شما توسط کارگروه عالی رد شده است، امکان درخواست تجدید نظر در خصوص آن وجود ندارد.",
        });

        return;
      }

      //check if has any other review request
      const prevRequests = statusLog.data.filter((item) =>
        [statusTypes.STARTER_REVIEW_REQUEST].includes(item.to_status)
      );

      if (prevRequests.length >= 2) {
        Modal.warn({
          title: "محدودیت درخواست",
          content:
            "شما قبلا ۲ بار درخواست تجدید نظر برای این پیشنهاد ارسال نموده اید و مجاز به درخواست دیگری نمیباشید.",
        });

        return;
      }

      let statusMessage =
        "پیشنهاد دهنده تقاضای تجدید نظر در مورد این پیشنهاد را ارسال نموده است. ";
      if (statusLog.data.length)
        statusMessage +=
          "آخرین وضعیت پیشنهاد پیش از رد نهایی، " +
          statusLog.data[statusLog.data.length - 2]["to_status"] +
          " بوده است.";

      Modal.confirm({
        title: "درخواست تجدید نظر",
        content:
          "آیا مایل به ارسال درخواست تجدید نظر در خصوص این پیشنهاد هستید؟",
        onOk: async () => {
          const statusData = {
            from_status: record.status,
            to_status: statusTypes.STARTER_REVIEW_REQUEST,
            type: statusChangeTypes.FORWARD,
            description: statusMessage,
          };

          await api._CHANGE_STATUS_PUBLIC(record.id || record.s_id, statusData);

          message.success("درخواست تجدید نظر ثبت گردید");
          history.go();
        },
      });
    },

    hide: (record) =>
      !(
        newContext.isPublicSuggestion() &&
        [statusTypes.FINAL_REJECTION].includes(record.status)
      ),
  },
  //review request from excellent committee member
  {
    title: "درخواست تجدید نظر",
    onClick: async () => {
      Modal.confirm({
        title: "درخواست تجدید نظر",
        content:
          "آیا مایل به ارسال درخواست تجدید نظر در خصوص این پیشنهاد هستید؟ پیشنهاد جهت اخذ مجدد رای اعضای مخالف، به کارگروه عالی برگشت میخورد.",
        onOk: async (record) => {
          try {
            await api._RESET_EXCELLENT_NEGATIVE_VOTES(record.id || record.s_id);

            message.success("درخواست تجدید نظر ثبت گردید");
            history.go();
          } catch (err) {
            if (err.response) {
              Modal.warn({
                title: "محدودیت درخواست",
                content:
                  err.response.data.message ||
                  "برای این پیشنهاد، قبلا درخواست تجدید نظر ارسال گردیده و امکان درخواست دیگری در این خصوص وجود ندارد.",
              });
            } else {
              message.error("درخواست تجدید با مشکل روبرو گردید.");
            }
          }
        },
      });
    },

    hide: (record) =>
      !checkSuggestionPermission(
        [
          suggestAccessTypes.EXCELLENT_MEMBER,
          suggestAccessTypes.EXCELLENT_HEAD,
        ],
        record.totalRoles
      ) ||
      ![statusTypes.EXCELLENT_COMMITTEE_REJECTION].includes(record.status) ||
      !record.excellent_member_vote,
  },
  {
    title: "اعمال و ارسال اصلاحات",
    onClick: async (record) => {
      const committeeHead = await findCommitteeHead(record["workgroup_id_fk"]);

      const statusData = {
        from_status: record.status,
        to_status: statusTypes.STARTER_REVISION_REQUEST,
        type: statusChangeTypes.FORWARD,
        description:
          "پیشنهاد دهنده تقاضای بررسی مجدد پیشنهاد را پس  از اعمال اصلاحات ارسال نموده است",
        personnel_ids: [committeeHead.id],
      };

      await api._CHANGE_STATUS_PUBLIC(record.id || record.s_id, statusData);

      message.success("اصلاحات برای کارگروه تخصصی ارسال گردید");
      history.go();
    },

    hide: (record) =>
      !(
        newContext.isPublicSuggestion() &&
        [statusTypes.STARTER_REVIEW].includes(record.status)
      ),
  },
  {
    title: "انصراف از پیشنهاد",
    onClick: (record) => {
      Modal.confirm({
        title: "انصراف از پیشنهاد",
        content: "آیا نسبت به انصراف از پیگیری پیشنهاد و توقف آن مطمئن هستید؟",
        onOk: async () => {
          const statusData = {
            from_status: record.status,
            to_status: statusTypes.FINAL_REJECTION,
            type: statusChangeTypes.FORWARD,
            description:
              "پیشنهاد دهنده مایل به اصلاح پیشنهاد نبوده و از ادامه پیگیری پیشنهاد انصراف داد",
            personnel_ids: [],
          };

          await api._CHANGE_STATUS_PUBLIC(record.id || record.s_id, statusData);

          message.success("انصراف از پیشنهاد ثبت گردید");
          history.go();
        },
      });
    },

    hide: (record) =>
      !(
        newContext.isPublicSuggestion() &&
        [statusTypes.STARTER_REVIEW].includes(record.status)
      ),
  },
  {
    title: "گزارش مشکل",
    onClick: (record) =>
      history.push(
        getLink(pageNames.suggest.problem.list, record.s_id || record.id)
      ),

    hide: (record) =>
      !(
        checkSuggestionPermission(
          [suggestAccessTypes.EXECUTOR],
          record.totalRoles
        ) &&
        [statusTypes.EXECUTOR_INFORM, statusTypes.PENDING].includes(
          record.status
        )
      ),
  },
  {
    title: "ثبت رای",
    onClick: (record) =>
      history.push(
        getLink(pageNames.suggest.suggestion.view, record.s_id || record.id) +
          "?action=" +
          detailsPageActions.EXCELLENT_COMMITTEE_VOTE
      ),

    hide: (record) =>
      !(
        checkSuggestionPermission(
          [
            suggestAccessTypes.EXCELLENT_MEMBER,
            suggestAccessTypes.EXCELLENT_HEAD,
          ],
          record.totalRoles
        ) &&
        [statusTypes.EXCELLENT_COMMITTEE_MEMBER_REVIEW].includes(
          record.status
        ) &&
        record.excellent_member_vote == -1
      ),
  },
  {
    title: "ابلاغ به مجری",
    onClick: (record) =>
      history.push(
        getLink(pageNames.suggest.suggestion.view, record.s_id || record.id) +
          "?action=" +
          detailsPageActions.CEO_TO_EXECUTOR_SIGNIFY
      ),

    hide: (record) =>
      !(
        checkSuggestionPermission(
          [suggestAccessTypes.HOLDING_CEO],
          record.totalRoles
        ) && [statusTypes.CEO_REVIEW].includes(record.status)
      ),
  },
  {
    title: "تعویق پیشنهاد",
    onClick: (record) => {
      setCurrentSuggestion(record);
      setIsPendingModalVisible(true);
    },

    hide: (record) =>
      !(
        checkSuggestionPermission(
          [suggestAccessTypes.SECRETARIAT_HEAD],
          record.totalRoles
        ) &&
        [statusTypes.EXECUTOR_INFORM, statusTypes.PENDING].includes(
          record.status
        ) &&
        [cartableFilters.HAS_PROBLEM, cartableFilters.PENDING].includes(
          pageFilter
        )
      ),
  },
  {
    title: "لیست گزارش مشکلات",
    onClick: (record) => {
      history.push(
        getLink(pageNames.suggest.problem.list, record.s_id || record.id)
      );
    },

    hide: (record) =>
      !(
        checkSuggestionPermission(
          [suggestAccessTypes.SECRETARIAT_HEAD, suggestAccessTypes.HOLDING_CEO],
          record.totalRoles
        ) &&
        [statusTypes.EXECUTOR_INFORM, statusTypes.PENDING].includes(
          record.status
        )
      ),
  },
  {
    title: "درخواست زمان",
    onClick: (record) => handleOnTimeExtendClick(record.s_id || record.id),
    hide: (record) => true,
  },
];

export default mobileActions;
