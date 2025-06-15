import { reduxTypes } from "constant";

const initialState = [];

export const contractList = (state = initialState, { type, payload }) => {
  switch (type) {
    case reduxTypes.contractList:
      return payload;

    default:
      return state;
  }
};
