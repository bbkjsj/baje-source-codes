import { constant } from "modules/hse/constant";
import { createContext } from "react";

export const AuditContext = createContext({
  state: {
    group: constant.vehicle,
    existency: {},
    questionPicker: true,
    selectedQuestions: [],
    selectedTab: constant.auditInfo,
    date: "",
    description: "",
    loading: false,
  },
  setState: () => {},
  toggleQuestionPicker: () => {},
  toggleSelectQuestion: () => {},
  handleCreateAudit: () => {},
});
