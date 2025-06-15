import React, { useState } from "react";

export const InsuranceWizardContext = React.createContext({
  selectedPeople: { person: null, subordinates: [] },
  setSelectedPeople: () => {},
  subordinateForm: { values: {}, files: [] },
  setSubordinateForm: () => {},
  selectedInsurance: null,
  setSelectedInsurance: () => {},
  hasParents: {
    father: false,
    mother: false,
  },
  setHasParents: () => {},
});

const Provider = (props) => {
  const [selectedPeople, setSelectedPeople] = useState({
    person: null,
    subordinates: [],
  });
  const [subordinateForm, setSubordinateForm] = useState({
    values: {},
    files: [],
  });
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [hasParents, setHasParents] = useState({
    father: false,
    mother: false,
  });

  return (
    <InsuranceWizardContext.Provider
      value={{
        selectedPeople,
        setSelectedPeople,
        subordinateForm,
        setSubordinateForm,
        selectedInsurance,
        setSelectedInsurance,
        hasParents,
        setHasParents,
      }}
    >
      {props.children}
    </InsuranceWizardContext.Provider>
  );
};

export default Provider;
