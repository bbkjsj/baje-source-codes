import React, { createContext, useState } from "react";
import SuggestionsSignup from "./SuggestionsSignup";

export const signupContext = createContext();

const SignupContext = () => {
  const [state, setState] = useState({
    step: 0,
    formVals: null,
    nid: "",
    phoneNumber: null,
  });

  function setStep(val) {
    let newStep;
    if (val === "plus") {
      newStep = state.step + 1;
    } else {
      newStep = state.step - 1;
    }
    setState({ ...state, step: newStep });
    console.log(state);
  }

  function setForm(vals) {
    setState({ ...state, formVals: vals, phoneNumber: vals.mobile, step: 1 });
  }

  function setNid(nid, phone) {
    setState({
      ...state,
      formVals: { national_code: nid },
      phoneNumber: phone || "",
      step: phone ? 1 : state.step,
    });
  }

  return (
    <signupContext.Provider
      value={{
        state,
        incrementStep: () => setStep("plus"),
        decrementStep: () => setStep("minus"),
        setFormVals: setForm,
        setNid,
      }}
    >
      <SuggestionsSignup />
    </signupContext.Provider>
  );
};

export default SignupContext;
