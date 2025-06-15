import { reduxTypes } from "../../constant";
const initialState = "";

export const officeLogo = (state = initialState, { type, payload }) => {
  switch (type) {
    case reduxTypes.officeLogo:
      return payload;

    default:
      return state;
  }
};
