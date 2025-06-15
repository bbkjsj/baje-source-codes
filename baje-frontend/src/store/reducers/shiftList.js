import { reduxTypes } from "constant";
import { sampleShift } from "../../modules/personnel/shiftwork/data";
const initialState = sampleShift;

export const shiftList = (state = initialState, { type, payload }) => {
  switch (type) {
    case reduxTypes.shiftList:
      return payload;

    default:
      return state;
  }
};
