import { reduxTypes } from "constant";
const initialState = "";

export const token = (state = initialState, { type, payload }) => {
  switch (type) {
    case reduxTypes.token:
      return payload;

    default:
      return state;
  }
};
