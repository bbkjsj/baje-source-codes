import { useSelector } from "react-redux";
import useWhoAmI from "./useWhoAmI";

const useSuperAdminCheck = () => {
  const user = useWhoAmI();
  const userSuper = user?.isSuper;

  const check = () => {
    return !userSuper;
  };

  return check;
};

export default useSuperAdminCheck;
