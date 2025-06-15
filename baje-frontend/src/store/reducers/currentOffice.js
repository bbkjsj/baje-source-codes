import { reduxTypes } from "constant";

const initialState = "";

export const currentOffice = (state = initialState, { type, payload }) => {
  switch (type) {
    case reduxTypes.currentOffice:
      return payload;

    default:
      return state;
  }
};
