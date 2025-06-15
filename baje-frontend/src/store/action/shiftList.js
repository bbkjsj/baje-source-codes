import { reduxTypes } from "constant";

export const setShiftList = (payload) => ({
  type: reduxTypes.shiftList,
  payload,
});
