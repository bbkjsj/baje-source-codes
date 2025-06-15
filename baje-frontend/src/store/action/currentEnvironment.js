import { reduxTypes } from "constant";

export const setCurrentEnvironment = (payload) => ({
  type: reduxTypes.currentEnvironment,
  payload,
});
