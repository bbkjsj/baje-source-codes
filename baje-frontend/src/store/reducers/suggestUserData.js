import { reduxTypes } from "constant";

const initialState = {};

export const suggestUserData = (state = initialState, { type, payload }) => {
  switch (type) {
    case reduxTypes.suggestUserData:
      return payload;

    default:
      return state;
  }
};
