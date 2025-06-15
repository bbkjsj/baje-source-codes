import { useSelector } from "react-redux";

function useWhoAmI() {
  const user = useSelector((state) => state.user);

  return {
    companies: user?.company,
    isSuper: user?.isSuper,
    isDoctor: user?.isDoctor,
    firstName: user?.firstName,
    lastName: user?.lastName,
    gender: user?.gender,
    profileImage: user?.imageUrl,
    access: user?.access,
    id: user?.personnelId,
    surveyAccess: user?.surveyAccess,
    nationalCode: user?.nationalCode,
  };
}

export default useWhoAmI;
