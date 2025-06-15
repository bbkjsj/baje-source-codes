import React, { useContext } from "react";
import useCheckAccess from "hooks/useCheckAccess";

const hasAccess = (permission, check, contract) => {
  if (!permission) return true;

  return check(permission, contract);
};

const CheckAccess = ({ children, permission, contract = null }) => {
  const check = useCheckAccess();

  if (!hasAccess(permission, check, contract)) {
    return null;
  }

  return children;
};

const CheckAccessWarning = ({ children, permission, contract = null }) => {
  const check = useCheckAccess();

  if (!hasAccess(permission, check, contract)) {
    return <p>سطح دسترسی شما به این بخش محدود میباشد.</p>;
  }
  return children;
};

export { CheckAccess, CheckAccessWarning };
