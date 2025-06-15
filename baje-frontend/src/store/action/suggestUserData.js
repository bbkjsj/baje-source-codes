import { reduxTypes } from "constant";

export const setSuggestUserData = (payload) => ({
  type: reduxTypes.suggestUserData,
  payload,
});
