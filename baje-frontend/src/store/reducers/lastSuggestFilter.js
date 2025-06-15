import { reduxTypes } from "constant";

const initialState = "";

export const lastSuggestFilter = (state = initialState, { type, payload }) => {
  switch (type) {
    case reduxTypes.lastSuggestFilter:
      return payload;

    default:
      return state;
  }
};
