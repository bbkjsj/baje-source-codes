import { reduxTypes } from "constant";

export const setContractList = (payload) => ({
  type: reduxTypes.contractList,
  payload,
});
