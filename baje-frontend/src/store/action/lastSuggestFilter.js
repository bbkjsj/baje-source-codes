import { reduxTypes } from "constant";

export const setLastSuggestFilter = (payload) => ({
  type: reduxTypes.lastSuggestFilter,
  payload,
});
