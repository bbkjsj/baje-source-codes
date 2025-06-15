import { reduxTypes } from "constant";

export const setCurrentContract = (payload) => ({
  type: reduxTypes.currentContract,
  payload,
});
