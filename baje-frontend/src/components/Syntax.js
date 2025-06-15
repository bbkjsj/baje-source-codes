import React from "react";

const If = ({ children, condition }) => {
  if (condition) {
    return children;
  } else {
    return null;
  }
};

export { If };
