import { toast, ToastContent } from "react-toastify";

/**
 *
 * @param {ToastContent} message - message ReactNode
 * @param {"error"|"success"|"info"|"warning"|"default"} type  - type of message
 */
export const showMessage = (message, type = "default") =>
  toast(message, { type });

export const messages = {
  createdSuccessfully: (preffix = "") => ` ${preffix} با موفقیت ساخته شد`,
  editedSuccessfully: (preffix = "") => ` ${preffix} با موفقیت ویرایش شد`,
  deletedSuccessfully: (preffix = "") => ` ${preffix} با موفقیت حذف شد`,
};
