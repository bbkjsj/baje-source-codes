import { reduxTypes } from "constant";

export const setToken = (payload) => ({
  type: reduxTypes.token,
  payload,
});
