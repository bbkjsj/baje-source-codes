import React, { useState } from "react";

export const AccidentInsuranceContext = React.createContext({
  insuranceList: [],
  setInsuranceList: () => {},
  insurance: {},
  setInsurance: () => {},
  insuranceId: null,
  setInsuranceId: () => {},
});

const Provider = (props) => {
  const [insurance, setInsurance] = useState(null);
  const [insuranceList, setInsuranceList] = useState([]);
  const [insuranceId, setInsuranceId] = useState([]);

  return (
    <AccidentInsuranceContext.Provider
      value={{
        insurance,
        setInsurance,
        insuranceList,
        setInsuranceList,
        insuranceId,
        setInsuranceId,
      }}
    >
      {props.children}
    </AccidentInsuranceContext.Provider>
  );
};

export default Provider;
