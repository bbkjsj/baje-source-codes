import {
  patchTaskCondition,
  postTaskCondition,
  getTaskCondition,
  postTaskConditionNew,
} from "modules/task/api/taskCondition";
import React, { useEffect, useReducer, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  createTaskConditionActions,
  CreateTaskConditionContext,
  createTaskConditionInitialState,
  createTaskConditionReducer,
} from "./context";
import SelectCommonAttributes from "./SelectCommonAttributes";
import SelectCondition from "./SelectCondition";
import SelectSchedule from "./SelectSchedule";
import SelectMember from "./SelectMember";
import ContentTop from "components/general/ContentTop";
import GoBackBtn from "components/GoBackBtn";
import { constant } from "modules/task/constant";
import LoadingLogo from "components/general/LoadingLogo";
import TaskSMSTemplate from "./TaskSMSTemplate";
import { pick } from "lodash";
import { getJobs, getPersonnel } from "modules/task/api/general";
import { parse } from "query-string";
import moment from "moment-jalaali";
import {
  convertDateToENProper,
  convertDateToISO8601,
  objectToFormData,
} from "_helpers";
import DueDate from "./DueDate";
import { showMessage } from "utils/message";
import { Modal } from "antd";

const CreateTaskCondition = () => {
  const { goBack } = useHistory();
  const { search } = useLocation();
  const condition = parse(search);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [state, dispatch] = useReducer(
    createTaskConditionReducer,
    createTaskConditionInitialState
  );

  useEffect(() => {
    loadDatas();
  }, []);

  const loadDatas = async () => {
    try {
      const {
        data: { list },
      } = await getPersonnel();
      const { data: jobs } = await getJobs();
      let currentCondition = {};
      if (!!condition && condition.id) {
        const { data } = await getTaskCondition(condition);
        currentCondition = data;
      }
      const newState = { personnels: list, jobs, ...currentCondition };
      dispatch({
        type: createTaskConditionActions.setInitialState,
        payload: newState,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleModifyTaskCondition = async () => {
    if (
      state.personnelMembers?.length === 0 &&
      state.selectedJobs?.length === 0
    )
      return;
    const temp = {
      ...pick(state, [
        "title",
        "description",
        "condition",
        "negativePoint",
        "point",
        "ifTaskFailed",
        "priority",
        "punishment",
        "pageUrl",
        "referable",
      ]),
      personnelToInform: state.personnelToInform.map((item) => `${item}`),
      smsNotification: state.smsNotification.map((item) => item.value),
      tableId: state.selectedTable?.id,
      enable: 0,
    };

    if (state?.file?.length) {
      temp.file = state.file[0]?.originFileObj;
    } else if (
      state?.attachment &&
      typeof state?.attachment === "string" &&
      temp.hasOwnProperty("file") &&
      !state?.file?.length
    ) {
      delete temp.file;
    }

    if (
      state.daysAfterCreate === 0 &&
      state.hoursAfterCreate === 0 &&
      state.monthsAfterCreate === 0 &&
      state.yearsAfterCreate === 0
    )
      return showMessage("مهلت انجام وظیفه را انتخاب نکرده اید", "error");

    temp.secondsAfterCreate =
      state.hoursAfterCreate * 3600 +
      state.daysAfterCreate * 24 * 3600 +
      state.monthsAfterCreate * 30 * 24 * 3600 +
      state.yearsAfterCreate * 12 * 30 * 86400;

    if (state.personnelMembers?.length > 0)
      temp.personnelMembers = state.personnelMembers.map((id) => `${id}`);

    if (state.selectedJobs?.length > 0)
      temp.jobs = state.selectedJobs?.map((id) => `${id}`);

    if (state.taskCreateType === constant.frequentTask) {
      if (state.dailySchedule.length > 0)
        temp.dailySchedule = [...state.dailySchedule].map(
          ({ fromDate, toDate, ...prp }) => ({
            fromDate: convertDateToENProper(fromDate).replaceAll("/", "-"),
            toDate: convertDateToENProper(toDate).replaceAll("/", "-"),
            ...prp,
          })
        );

      if (state.weeklySchedule.length > 0)
        temp.weeklySchedule = [...state.weeklySchedule].map((item) => ({
          ...item,
          fromDate: convertDateToENProper(item.fromDate).replaceAll("/", "-"),
          toDate: convertDateToENProper(item.toDate).replaceAll("/", "-"),
        }));

      if (state.monthlySchedule?.length > 0)
        temp.monthlySchedule = state.monthlySchedule.map((item) => ({
          month: item.month,
          startDate: convertDateToISO8601(item.fromDate, { hasTime: true }),
          // toDate: convertDateToENProper(item.toDate).replaceAll("/", "-"),
        }));

      if (state.yearlySchedule?.length > 0)
        temp.yearlySchedule = [...state.yearlySchedule].map((item) => ({
          ...item,
          fromDate: `${convertDateToENProper(item.fromDate).replaceAll(
            "/",
            "-"
          )} 00:00:01`,
          toDate: `${convertDateToENProper(item.toDate).replaceAll(
            "/",
            "-"
          )} 23:00:00`,
          month: parseInt(
            moment(
              `${item.fromDate.split("/")[0]}/${item.month.value}/${item.day}`,
              "jYYYY/jMM/jDD"
            ).format("MM")
          ),
          day: parseInt(
            moment(
              `${item.fromDate.split("/")[0]}/${item.month.value}/${item.day}`,
              "jYYYY/jMM/jDD"
            ).format("DD")
          ),
        }));

      temp.approveCondition = state.approveCondition;
      if (state.approveCondition === constant.specificPerson)
        temp.approverPersonnelId = state.approverPersonnelId;
      if (state.approveCondition === constant.specificJob) {
        temp.approveJobsSequence = state.approveJobsSequence;
        temp.approverJobsId = state.approverJobsId;
      }

      if (temp?.tableId == null && temp.hasOwnProperty("tableId")) {
        delete temp.tableId;
      }
    }

    function areAnyDateRangesIntersecting(dateRanges) {
      for (let i = 0; i < dateRanges.length - 1; i++) {
        const range1 = dateRanges[i];
        const fromDate1 = moment(range1.fromDate, "YYYY-MM-DD");
        const toDate1 = moment(fromDate1).add(range1.month, "months");

        for (let j = i + 1; j < dateRanges.length; j++) {
          const range2 = dateRanges[j];
          const fromDate2 = moment(range2.fromDate, "YYYY-MM-DD");
          const toDate2 = moment(fromDate2).add(range2.monthCount, "months");

          if (fromDate1.isBefore(toDate2) && toDate1.isAfter(fromDate2)) {
            return true; // Found an intersection
          }
        }
      }
      return false; // No intersections found
    }

    const handleCreateTaskCondition = async () => {
      try {
        if (temp.condition.length && temp.condition.includes("null")) {
          temp.condition = temp.condition.replace("null  ''", "null");
        }
        if (temp.condition.length && temp.condition.includes("  '")) {
          temp.condition = temp.condition.replace("  '", " '");
        }

        if (temp?.monthlySchedule?.length) {
          if (areAnyDateRangesIntersecting(temp?.monthlySchedule)) {
            Modal.error({
              content:
                "الگو های زمانی وارد شده باهم تداخل دارند، لطفا الگو های زمانی را ویرایش نمایید.",
            });
            return;
          }
        }

        console.log(temp);

        const toFormData = objectToFormData(temp);

        toFormData.forEach((value, key) => {
          console.log(`${key}: ${value}`);
        });

        setSubmitLoading(true);
        await postTaskCondition(toFormData);
        setSubmitLoading(false);
        goBack();
      } catch (error) {
        console.log(error.message);
        setSubmitLoading(false);
      }
    };

    const handleEditTaskCondition = async () => {
      const toFormData = objectToFormData({
        id: condition.id,
        ...temp,
      });

      console.log(temp);

      try {
        setSubmitLoading(true);
        await patchTaskCondition(condition.id, toFormData);
        setSubmitLoading(false);
        goBack();
      } catch (error) {
        console.log(error.message);
        setSubmitLoading(false);
      }
    };

    if (!!condition?.id) return handleEditTaskCondition();
    handleCreateTaskCondition();
  };

  if (state.jobsLoading || state.personnelLoading) return <LoadingLogo />;
  return (
    <CreateTaskConditionContext.Provider
      value={{ state, dispatch, handleModifyTaskCondition }}
    >
      <div style={{ minHeight: "100vh" }}>
        <ContentTop title="ساخت الگوی وظیفه" />
        <GoBackBtn ask />

        {state.step === 1 && <SelectCommonAttributes />}
        {state.step === 2 &&
          state.taskCreateType === constant.conditionalTask && (
            <SelectCondition />
          )}
        {state.step === 2 && state.taskCreateType === constant.frequentTask && (
          <SelectSchedule />
        )}
        {state.step === 3 && <SelectMember loading={submitLoading} />}
      </div>
      <TaskSMSTemplate />
      <DueDate />
      {/* <ShamsiDatePicker
        value={state.fromDate}
        onChange={handleChangeFromDate}
        visible={state.modals.shamsiFromDate}
        minimumDate={state.fromDate.toDate()}
      />
      <ShamsiDatePicker
        value={state.toDate}
        onChange={handleChangeToDate}
        visible={state.modals.shamsiToDate}
      /> */}
      {/* <MiladiDatePicke  r /> */}
    </CreateTaskConditionContext.Provider>
  );
};

export default CreateTaskCondition;
