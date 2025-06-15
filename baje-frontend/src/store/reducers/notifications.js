import { reduxTypes } from "../../constant";
const initialState = {
  tasks: 0,
  toInform: 0,
  inProgress: 0,
  done: 0,
  notDone: 0,
  redirected: 0,
  toApprove: 0,
  notMyDuty: 0,
};

export const notifications = (state = initialState, { type, payload }) => {
  let newState = { ...state };

  if (type === reduxTypes.taskNotifications) {
    newState = {
      ...newState,
      ...payload,
    };
  }

  return newState;
};
