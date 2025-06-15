import { message } from "antd";

const persianErrors = {
  NO_INSURANCE: "هیچ لیست بیمه ای یافت نشد",
  WRONG_INSURANCE: "بیمه درخواست شده اشتباه است",
  INSURANCE_NOT_EXIST: "بیمه درخواستی وجود ندارد",
  CREATE_PERSONNEL_INSURANCE_ERROR:
    "ساخت بیمه ناموفق بود، لطفا مجددا تلاش کنید",
  CREATE_PERSONNEL_SUBORDINATE_ERROR:
    "ساخت فرد تبعی ناموفق بود، لطفا ورودی های خود را چک کنید و مجددا تلاش کنید",
  DUPLICATE_INSURANCE: "بیمه تکراری است",
  NO_USER: "هیچ کاربری یافت نشد",
  NO_SUBORDINATE: "هیچ فرد تبعی یافت نشد",
  DUPLICATED_PARENTS: "والدین تکراری",
  SUBORDINATE_CREATE_FAIL:
    "ساخت فرد تبعی ناموفق بود، لطفا ورودی های خود را چک کنید و مجددا تلاش کنید",
  SUBORDINATE_MODIFY_FAIL:
    " ویرایش فرد تبعی ناموفق بود، لطفا ورودی های خود را چک کنید و مجددا تلاش کنید",
  WRONG_SUBORDINATE: "فرد تبعی انتخاب شده جزو افراد تبعی شما نیست",
  ADD_SUBORDINATE_FIELD_DUPLICATED_NATION_CODE:
    "کد ملی تکراری است و فرد جزو افراد تبعی شما است",
};

const defaultError = "مشکلی پیش آمده است لطفا دوباره تلاش کنید";

export function getErrorMessage(errorKey) {
  if (errorKey && persianErrors[errorKey]) {
    return persianErrors[errorKey];
  }
  return defaultError;
}

export function handleExceptions(errObj) {
  if (errObj && errObj?.response?.data?.error?.code) {
    if (persianErrors[errObj?.response?.data?.error?.code]) {
      message.error(persianErrors[errObj?.response?.data?.error?.code]);
    } else {
      message.error(defaultError);
    }
  } else {
    message.error(defaultError);
  }
}
