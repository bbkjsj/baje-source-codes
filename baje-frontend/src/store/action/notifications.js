import { reduxTypes } from "constant";

export const setTaskNotifications = (payload) => ({
  type: reduxTypes.taskNotifications,
  payload,
});
