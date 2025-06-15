import {
  columnTypes,
  constant,
  jalaaliMonths,
  logicalOperators,
} from "modules/task/constant";
import { createContext, useContext } from "react";
import moment from "moment-jalaali";
import { convertSecondsToYearMonth } from "utils/utilFuncs";

export const createTaskConditionActions = {
  /* ------------------- GENERALACTIONS ------------------- */
  setInitialState: "setInitialState",
  setPersonnelAndJobs: "setPersonnelsAndJobs",
  changeAttribute: "changeAttribute",
  handleFirstStep: "handleFirstStep",
  handleSecondStep: "handleSecondStep",
  handleThirdStep: "handleThirdStep",
  /* ------------------- GENERALACTIONS ------------------- */

  setTables: "setTables",
  setSelectedTable: "setSelectedTable",
  setTableColumns: "setTableColumns",
  addCondition: "addCondition",
  deleteCondition: "deleteCondition",
  handleForthStep: "handleForthStep",
  setPersonnels: "setPersonnels",
  setSearchPhrase: "setSearchPhrase",
  changeMemberType: "changeMemberType",
  setJobs: "setJobs",
  setSelectedJobs: "setSelectedJobs",
  changeScheduleType: "changeScheduleType",
  addDailySchedule: "addDailySchedule",
  removeDailySchedule: "removeDailySchedule",
  addMonthlySchedule: "addMonthlySchedule",
  removeMonthlySchedule: "removeMonthlySchedule",
  addYearlySchedule: "addYearlySchedule",
  removeYearlySchedule: "removeYearlySchedule",
  onlyChangeStep: "onlyChangeStep",
  toggleSMSTemplateModal: "toggleSMSTemplateModal",
  toggleSMSNotification: "toggleSMSNotification",
  setTaskCreateType: "setTaskCreateType",
  setApproveCondition: "setApproveCondition",
  addWeeklySchedule: "addWeeklySchedule",
  removeWeeklySchedule: "removeWeeklySchedule",
  changeFromToDate: "changeFromToDate",
  changeFromDate: "changeFromDate",
  changeToDate: "changeToDate",
  changeCalendarMode: "changeCalendarMode",
  toggleDueDateModal: "toggleDueDateModal",
};

export const createTaskConditionInitialState = {
  step: 1,
  taskCreateType: constant.frequentTask,
  title: "",
  description: "",
  hoursAfterCreate: 0,
  daysAfterCreate: 1,
  monthsAfterCreate: 0,
  yearsAfterCreate: 0,
  point: 10,
  negativePoint: 5,
  ifTaskFailed: constant.delayed,
  priority: constant.low,
  approveCondition: constant.none,
  tables: [{}, {}, {}],
  tablesLoading: true,
  selectedTableLoading: false,
  punishment: constant.none,
  selectedTable: null,
  tableColumns: [],
  conditions: [],
  operator: logicalOperators.and,
  condition: "",
  personnels: [],
  personnelMembers: [],
  personnelLoading: true,
  personnelToInform: [],
  searchNationNumber: "",
  searchFirstName: "",
  searchLastName: "",
  memberType: constant.job,
  jobs: [],
  jobsLoading: true,
  selectedJobs: [],
  scheduleType: constant.daily,
  dailySchedule: [],
  monthlySchedule: [],
  yearlySchedule: [],
  weeklySchedule: [],
  smsNotificationModal: false,
  smsNotification: [
    { value: constant.onStart },
    { value: constant.on90percent },
  ],
  fromDate: moment(),
  toDate: moment().add(1, "day"),
  approveJobsSequence: constant.linear,
  referable: 0,
  calendarMode: constant.solar,
  dueDateModal: false,
  file: null,
  approverPersonnelId: null,
  approveJobsId: null,
};

/**
 *
 * @param { {type:string, payload:any} } action
 */
export const createTaskConditionReducer = (
  state = createTaskConditionInitialState,
  action
) => {
  const getFromDate = () =>
    state.fromDate.jYear() +
    "/" +
    state.fromDate.format("jMM") +
    "/" +
    state.fromDate.format("jDD");

  const getToDate = () =>
    state.toDate.jYear() +
    "/" +
    state.toDate.format("jMM") +
    "/" +
    state.toDate.format("jDD");

  switch (action.type) {
    case createTaskConditionActions.setInitialState: {
      const {
        condition: conditionPayload,
        daily,
        monthly,
        yearly,
        weekly: weeklySchedule,
        jobs,
        personnels,
      } = action.payload;
      if (!conditionPayload)
        return {
          ...state,
          jobs,
          personnels,
          personnelLoading: false,
          jobsLoading: false,
        };

      const {
        tableId,
        tableName,
        tableTitle,
        personnelMembers = "",
        condition,
        jobs: jobsCondition = "",
        personnelToInform = "",
        smsNotification = "",
        secondsAfterCreate,
        ...prp
      } = conditionPayload;
      const { day, hour, month, year } = convertSecondsToYearMonth(
        secondsAfterCreate
      );

      const conditions = [];
      let tempConditions = [];
      if (condition.includes(` ${logicalOperators.and} `)) {
        tempConditions = condition
          .replaceAll("'", "")
          .split(` ${logicalOperators.and} `);
      } else if (condition.includes(` ${logicalOperators.or} `)) {
        tempConditions = condition
          .replaceAll("'", "")
          .split(` ${logicalOperators.or} `);
      } else if (condition !== "" && condition.length) {
        tempConditions = [condition.replaceAll("'", "")];
      }

      tempConditions.forEach((item) => {
        const temp = item.split(" ").filter((item) => !!item);
        const temp2 = {
          column: { columnName: temp[0] },
          operator: temp[1],
          value: temp.slice(2),
        };
        conditions.push(temp2);
      });

      const finalState = {
        ...state,
        ...prp,
        selectedTable: {
          id: tableId,
          tableTitle,
          table_name: tableName,
          title: tableTitle,
        },
        personnelMembers: personnelMembers
          ?.split(",")
          .filter((item) => item !== "NaN" && !!item)
          .map((item) => parseInt(item)),
        personnelToInform: personnelToInform
          ?.split(",")
          .filter((item) => item !== "NaN" && !!item)
          // .filter((item) => item !== "NaN")
          .map((item) => parseInt(item)),
        selectedJobs: jobsCondition?.split(",").map((item) => parseInt(item)),
        condition,
        conditions,
        taskCreateType: !condition
          ? constant.frequentTask
          : constant.conditionalTask,
        operator: condition.includes(logicalOperators.and)
          ? logicalOperators.and
          : logicalOperators.or,
        memberType: !!jobsCondition ? constant.job : constant.personnel,
        dailySchedule: daily.map(({ hour, minute, fromDate, toDate }) => ({
          hour,
          minute,
          fromDate: moment(fromDate).format("jYYYY/jMM/jDD"),
          toDate: moment(toDate).format("jYYYY/jMM/jDD"),
        })),
        monthlySchedule: monthly.map(({ fromDate, month }) => ({
          month,
          fromDate: fromDate,
        })),
        yearlySchedule: yearly.map(({ fromDate, toDate, day, month }) => ({
          fromDate: moment(fromDate).format("jYYYY/jMM/jDD"),
          toDate: moment(toDate).format("jYYYY/jMM/jDD"),
          month: jalaaliMonths.find(
            (item) =>
              item.value ===
              parseInt(
                moment(
                  `${fromDate.split("/")[0]}/${month}/${day}`,
                  "YYYY/MM/DD"
                ).format("jMM")
              )
          ),
          day: parseInt(
            moment(
              `${fromDate.split("/")[0]}/${month}/${day}`,
              "YYYY/MM/DD"
            ).format("jDD")
          ),
        })),
        weeklySchedule: weeklySchedule.map((item) => ({
          ...item,
          fromDate: moment(item.fromDate).format("jYYYY/jMM/jDD"),
          toDate: moment(item.toDate).format("jYYYY/jMM/jDD"),
        })),
        smsNotification: smsNotification
          ?.split(",")
          .map((value) => ({ value })),
        scheduleType: constant.daily,
        // scheduleType:
        //   !!daily && Array.isArray(daily) && !!daily?.[0]
        //     ? constant.daily
        //     : !!monthly && Array.isArray(monthly) && monthly.length > 0
        //     ? constant.monthly
        //     : !!yearlySchedule &&
        //       Array.isArray(yearlySchedule) &&
        //       yearlySchedule.length > 0
        //     ? constant.yearly
        //     : !!weeklySchedule &&
        //       Array.isArray(weeklySchedule) &&
        //       weeklySchedule.length > 0
        //     ? constant.weekly
        //     : constant.daily,
        jobs,
        personnels,
        personnelLoading: false,
        jobsLoading: false,
        hoursAfterCreate: hour,
        daysAfterCreate: day,
        monthsAfterCreate: month,
        yearsAfterCreate: year,
        attachment: prp?.file,
        file: [],
        pageUrl: prp?.pageUrl === "undefined" ? "" : prp?.pageUrl,
      };

      console.log("*******************************************", finalState);
      return finalState;
    }

    case createTaskConditionActions.changeAttribute: {
      const temp = {};
      temp[action.payload.attribute] = action.payload.value;
      return {
        ...state,
        ...temp,
      };
    }

    case createTaskConditionActions.handleSecondStep:
      return {
        ...state,
        ...action.payload,
        step: 2,
      };

    case createTaskConditionActions.setTables:
      return {
        ...state,
        tables: action.payload,
        tablesLoading: false,
        // selectedTable: action.payload[0],
      };

    case createTaskConditionActions.setSelectedTable:
      return {
        ...state,
        selectedTable: action.payload,
        selectedTableLoading: true,
        conditions: [],
      };

    case createTaskConditionActions.setTableColumns:
      return {
        ...state,
        tableColumns: action.payload,
        selectedTableLoading: false,
      };

    case createTaskConditionActions.addCondition:
      return {
        ...state,
        conditions: [...state.conditions, action.payload],
      };

    case createTaskConditionActions.deleteCondition:
      return {
        ...state,
        conditions: state.conditions.filter(
          (item) => item.column.columnName !== action.payload.column.columnName
        ),
      };

    case createTaskConditionActions.handleFirstStep:
      return {
        ...state,
        step: 1,
      };

    case createTaskConditionActions.handleThirdStep:
      return {
        ...state,
        condition: state.conditions
          .map(
            (item) =>
              `${item.column.columnName} ${item.operator || ""}  '${
                item.column.type === columnTypes.date && !!item.value
                  ? moment(item.value, "jYYYY/jMM/jDD").format("YYYY-MM-DD")
                  : item.value || ""
              }'`
          )
          .join(` ${state.operator} `),
        ...action.payload,
        step: 3,
      };

    case createTaskConditionActions.setPersonnels: {
      const { personnels, personnelMembers = [] } = action.payload;
      return {
        ...state,
        personnels,
        personnelLoading: false,
        personnelMembers,
      };
    }

    case createTaskConditionActions.setSearchPhrase: {
      if (action.payload.field === constant.nationNumber)
        return {
          ...state,
          searchNationNumber: action.payload.value,
        };
      if (action.payload.field === constant.firstName)
        return {
          ...state,
          searchFirstName: action.payload.value,
        };
      if (action.payload.field === constant.lastName)
        return {
          ...state,
          searchLastName: action.payload.value,
        };
      return {
        ...state,
      };
    }

    case createTaskConditionActions.changeMemberType:
      return {
        ...state,
        memberType: action.payload,
      };

    case createTaskConditionActions.setJobs: {
      const { jobs, selectedJobs } = action.payload;
      return {
        ...state,
        jobs,
        selectedJobs,
      };
    }

    case createTaskConditionActions.setSelectedJobs:
      return {
        ...state,
        selectedJobs: action.payload,
      };

    /* -------------------- SCHEDULE TYPE ------------------- */
    case createTaskConditionActions.changeScheduleType:
      return {
        ...state,
        scheduleType: action.payload,
        // dailySchedule: {},
        // monthlySchedule: [],
        // yearlySchedule: [],
      };

    case createTaskConditionActions.addDailySchedule: {
      // if (state.fromDate.isAfter(state.toDate))
      //   return {
      //     ...state,
      //     dailySchedule: [...state.dailySchedule],
      //   };
      return {
        ...state,
        dailySchedule: [
          ...state.dailySchedule,
          {
            hour: action.payload.hour,
            minute: action.payload.minute,
            fromDate: getFromDate(),
            toDate: getToDate(),
          },
        ],
      };
    }

    case createTaskConditionActions.removeDailySchedule:
      return {
        ...state,
        dailySchedule: state.dailySchedule.filter(
          (item, index) => index !== action.payload
        ),
      };

    case createTaskConditionActions.addWeeklySchedule: {
      if (state.fromDate.isAfter(state.toDate))
        return {
          ...state,
          weeklySchedule: [...state.weeklySchedule],
        };

      return {
        ...state,
        weeklySchedule: [
          ...state.weeklySchedule,
          { ...action.payload, fromDate: getFromDate(), toDate: getToDate() },
        ],
      };
    }

    case createTaskConditionActions.addMonthlySchedule: {
      // if (state.fromDate.isAfter(state.toDate))
      //   return {
      //     ...state,
      //     monthlySchedule: [...state.monthlySchedule],
      //   };
      return {
        ...state,
        monthlySchedule: [
          ...state.monthlySchedule,
          { ...action.payload, fromDate: getFromDate() },
        ],
      };
    }

    case createTaskConditionActions.addYearlySchedule: {
      if (state.fromDate.isAfter(state.toDate))
        return {
          ...state,
          yearlySchedule: [...state.yearlySchedule],
        };
      return {
        ...state,
        yearlySchedule: [
          ...state.yearlySchedule,
          { ...action.payload, fromDate: getFromDate(), toDate: getToDate() },
        ],
      };
    }

    case createTaskConditionActions.removeWeeklySchedule:
      return {
        ...state,
        weeklySchedule: [...state.weeklySchedule].filter(
          (item, index) => index !== action.payload
        ),
      };

    case createTaskConditionActions.removeMonthlySchedule:
      return {
        ...state,
        monthlySchedule: [...state.monthlySchedule].filter(
          (item, index) => index !== action.payload
        ),
      };

    case createTaskConditionActions.removeYearlySchedule:
      return {
        ...state,
        yearlySchedule: [...state.yearlySchedule].filter(
          (item, index) => index !== action.payload
        ),
      };
    /* -------------------- SCHEDULE TYPE ------------------- */

    case createTaskConditionActions.onlyChangeStep:
      return {
        ...state,
        step: action.payload,
      };

    case createTaskConditionActions.toggleSMSNotification: {
      const temp = [...state.smsNotification];
      const isExists = !!temp.find(
        (item) => item.value === action.payload.value
      );
      return {
        ...state,
        smsNotification: isExists
          ? temp.filter((item) => item.value !== action.payload.value)
          : [...temp, action.payload],
      };
    }

    case createTaskConditionActions.setTaskCreateType:
      return {
        ...state,
        taskCreateType: action.payload,
      };

    case createTaskConditionActions.setApproveCondition:
      return {
        ...state,
        approveCondition: action.payload,
      };

    case createTaskConditionActions.changeFromToDate: {
      return {
        ...state,
        fromDate: action.payload.from,
        toDate: action.payload.to,
      };
    }

    case createTaskConditionActions.changeFromDate:
      return {
        ...state,
        fromDate: action.payload,
      };

    case createTaskConditionActions.changeToDate:
      return {
        ...state,
        toDate: action.payload,
      };

    case createTaskConditionActions.changeCalendarMode:
      return {
        ...state,
        calendarMode: action.payload,
      };

    case createTaskConditionActions.toggleDueDateModal:
      return {
        ...state,
        dueDateModal: !state.dueDateModal,
      };

    default:
      return state;
  }
};

export const CreateTaskConditionContext = createContext({
  state: createTaskConditionInitialState,
  dispatch: () => {},
  handleModifyTaskCondition: () => {},
});

export const useCreateTaskConditionContext = () =>
  useContext(CreateTaskConditionContext);
