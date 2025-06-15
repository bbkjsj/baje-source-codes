import { reduxTypes } from "constant";

export const setUser = (payload) => ({
  type: reduxTypes.user,
  payload,
});
