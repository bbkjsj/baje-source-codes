import { reduxTypes } from "constant";

const initialState = "";

export const currentContract = (state = initialState, { type, payload }) => {
  switch (type) {
    case reduxTypes.currentContract:
      return payload;

    default:
      return state;
  }
};
