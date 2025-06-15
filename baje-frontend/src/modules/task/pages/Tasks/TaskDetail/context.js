import { useContext } from "react";
import { createContext } from "react";

export const taskDetailActions = {
  setInitialState: "setInitialState",
  setTask: "setTask",
  toggleNotMyDuty: "toggleNotMyDuty",
  toggleDoneModal: "toggleDoneModal",
  toggleReferModal: "toggleReferModal",
};

export const taskDetailInitialState = {
  task: {},
  loading: true,
  notMyDutyModal: false,
  doneModal: false,
  referModal: false,
};

export const taskDetailReducer = (
  state = taskDetailInitialState,
  { type, payload }
) => {
  switch (type) {
    case taskDetailActions.setInitialState:
      return {
        ...state,
        task: payload,
        loading: false,
      };

    case taskDetailActions.setTask:
      return {
        ...state,
        task: payload,
      };

    case taskDetailActions.toggleNotMyDuty:
      return { ...state, notMyDutyModal: !state.notMyDutyModal };

    case taskDetailActions.toggleDoneModal:
      return { ...state, doneModal: !state.doneModal };

    case taskDetailActions.toggleReferModal:
      return { ...state, referModal: !state.referModal };

    default:
      return state;
  }
};

export const TaskDetailContext = createContext({
  state: taskDetailInitialState,
  dispatch: () => {},
});

export const useTaskDetailContext = () => useContext(TaskDetailContext);
