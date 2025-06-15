import { reduxTypes } from "constant";

export const setSuggestToken = (payload) => ({
  type: reduxTypes.suggestToken,
  payload,
});
