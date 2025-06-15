import { createContext } from "react";

export const PerformAuditContext = createContext({
  state: {
    loading: true,
    audit: { questions: [] },
    questionIndex: 0,
  },
  setState: () => {},
  handleSetAnswer: () => {},
  handleSubmit: (draft) => {},
});
