import * as api from "./api";
import { message } from "antd";

export const defaultDate = (year, month) => {
  if (parseFloat(month) >= 12) {
    month = "01";
    year = parseFloat(year) + 1;
  } else {
    month = parseFloat(month) + 1;
  }

  return {
    year,
    month,
  };
};

export const getContract = async (
  form,
  setGetContractLoading,
  isMonthSet,
  setIsMonthSet,
  currentOffice,
  setStartDate,
  setEndDate
) => {
  let { row, work_shop } = form.getFieldValue();
  let rowError = form.getFieldError("row");
  let workShopError = form.getFieldError("work_shop");

  console.info("row,shop", rowError, workShopError);

  if (row && row.length === 3 && work_shop && work_shop.length === 10) {
    setGetContractLoading(true);
    try {
      let res = await api._getContractWithCode(row, work_shop, currentOffice);
      setGetContractLoading(false);

      if (res.data.hasOwnProperty("insurance")) {
        const { year, month } = res.data.insurance;
        if (!isMonthSet) {
          form.setFieldsValue(defaultDate(year, month));
          setIsMonthSet(true);
        }
      }
      form.setFieldsValue({
        contract_id: res.data.item.id,
        subject: res.data.item.subject,
      });
      setStartDate(res.data?.item?.start_date);
      setEndDate(res.data?.item?.end_date);
    } catch (error) {
      setGetContractLoading(false);
      if (error) {
        if (error.response.status === 403) {
          form.setFieldsValue({ row: null, work_shop: null });
          message.error("قرارداد یافت نشد.");
        } else {
          console.info("error _getContractWithCode", error);
        }
      }
    }
  }
};
