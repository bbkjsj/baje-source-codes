import { useContext } from "react";
import { NewContext } from "contex/New-Context";
import { levels } from "json/Permission";
import { useSelector } from "react-redux";
import useWhoAmI from "./useWhoAmI";

const useCheckAccess = () => {
  const user = useWhoAmI();
  const currentOffice = useSelector((state) => state.currentOffice);
  const currentContract = useSelector((state) => state.currentContract);
  const currentEnvironment = useSelector((state) => state.currentEnvironment);

  const newContext = useContext(NewContext);
  const userAccess = user?.access;

  const userSuper = user?.isSuper;
  const currOffice = currentOffice;
  const currContract = currentContract;
  const currEnv = currentEnvironment;

  const checkPermission = (perm) => {
    if (userAccess) {
      // console.log("permission:", perm);
      // console.log("user companies:", user.companies);

      // if (perm.level === levels.COMPANY)
      //   return userAccess.some((item) => {
      //     // console.log("user perm:", item.access);
      //     // console.log("perm:", perm);
      //     if (item.companyId) {
      //       console.log(item);
      //       return (
      //         item.access === perm.permission &&
      //         user.companies.some((i) => i.id == item.companyId)
      //       );
      //     } else {
      //       return item.access === perm.permission;
      //     }
      //   });
      // else if (perm.level === levels.ENVIRONMENT)
      //   return userAccess.find(
      //     (item) =>
      //       item.access === perm.permission &&
      //       item.environmentId === currEnv
      //   );
      // else
      return userAccess.some((item) => {
        return item.access === perm.permission;
      });
    }
  };

  const check = (permission, contract = null) => {
    let access = false;

    if (newContext.isPublicSuggestion()) return false;
    if (userSuper) return true;

    if (Array.isArray(permission)) {
      let hasAnyAccess = false;

      for (let per of permission) {
        if (checkPermission(per)) hasAnyAccess = true;
      }

      access = hasAnyAccess;
    } else access = checkPermission(permission);

    return access;
  };

  return check;
};

export default useCheckAccess;
