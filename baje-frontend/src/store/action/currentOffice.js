import { reduxTypes } from "constant";

export const setCurrentOffice = (payload) => ({
  type: reduxTypes.currentOffice,
  payload,
});
