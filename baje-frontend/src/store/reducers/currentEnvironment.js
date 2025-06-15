import { reduxTypes } from "constant";

const initialState = "-1";

export const currentEnvironment = (state = initialState, { type, payload }) => {
  switch (type) {
    case reduxTypes.currentEnvironment:
      return payload;

    default:
      return state;
  }
};
