import { constant } from "modules/hse/constant";
import { createContext } from "react";
export const AllocateContext = createContext({
  state: {
    step: 0,
    vehicleId: -1,
    questions: [],
    personnelId: -1,
    environmentId: -1,
    selectedQuestions: [],
    group: constant.inidividual,
  },
  setState: () => {},
});
