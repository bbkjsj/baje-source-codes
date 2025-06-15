import { reduxTypes } from "constant";

const initialState = "";

export const suggestToken = (state = initialState, { type, payload }) => {
  switch (type) {
    case reduxTypes.suggestToken:
      return payload;

    default:
      return state;
  }
};
