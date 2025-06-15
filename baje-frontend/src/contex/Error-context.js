import React, { useState } from "react";

export const ErrorContext = React.createContext({
  errorCode: null,
  errorMessage: null,
  setError: () => {},
});

const ErrorContextProvider = (props) => {
  const [errorCode, setErrorCode] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSetError = (error) => {
    setErrorCode(error.code);
    setErrorMessage(error.message);
  };

  return (
    <ErrorContext.Provider
      value={{ setError: handleSetError, errorCode, errorMessage }}
    >
      {props.children}
    </ErrorContext.Provider>
  );
};

export default ErrorContextProvider;
