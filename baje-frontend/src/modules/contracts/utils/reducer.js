import { actionTypes } from "./constant";

export default function (state, { type, payload }) {
  switch (type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: payload };

    case actionTypes.SET_CONTRACT_TYPE:
      return { ...state, contractType: payload };

    case actionTypes.SET_MAIN_CONTRACT_DATE:
      return { ...state, mainContractDate: payload };

    case actionTypes.SET_MAIN_CONTRACT_FINISH_DATE:
      return { ...state, mainContractFinishDate: payload };

    case actionTypes.SET_SUBJECT:
      return { ...state, SUBJECT: payload };

    case actionTypes.SET_COMPANIES:
      return { ...state, companies: payload };

    case actionTypes.SET_CONTRACTOR:
      return { ...state, contractor: payload };

    case actionTypes.SET_EMPLOYER:
      return { ...state, employer: payload };

    case actionTypes.SET_MANAGER:
      return { ...state, manager: payload };

    case actionTypes.SET_BOSS:
      return { ...state, boss: payload };

    case actionTypes.SET_CAN_NOT_EDIT:
      return { ...state, canNotEdit: payload };

    case actionTypes.SET_CONTRACT:
      return { ...state, contract: payload };

    default:
      return state;
  }
}
