import { reduxTypes } from "constant";

export const setOfficeLogo = (payload) => ({
  type: reduxTypes.officeLogo,
  payload,
});
