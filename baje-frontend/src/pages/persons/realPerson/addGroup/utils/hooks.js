import { useContext, useState } from "react";
import { Modal } from "antd";
import * as api from "./api";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const useSubmitPresonsFile = (form) => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const personType = query.get("type");
  const currentOffice = useSelector((state) => state.currentOffice);
  const currentContract = useSelector((state) => state.currentContract);

  const submit = (values) => {
    setLoading(true);

    if (values.select_file === "dbf") {
      const formData = new FormData();
      formData.append("dbf_file", values.dbf_file[0]["originFileObj"]);
      // formData.set("contract_id", null);
      // formData.set("company_id", null);
      api
        ._POST_MAIN_PERSONS_DBF(formData)
        .then((res) => {
          setLoading(false);
          form.resetFields();
          Modal.success({
            content: `از تعداد : ${res.data.total} ردیف ، ${res.data.success} ردیف وارد سیستم شد.`,
          });
        })
        .catch((error) => {
          if (error.response) {
            Modal.error({
              content: "مشکلی پیش آمده است لطفا دوباره تلاش کنید ",
            });
            setLoading(false);
          }
        });
    } else if (values.select_file === "excel") {
      const formData = new FormData();
      // if (personType === "mainTab") {
      //   formData.append("contract_id", null);
      //   formData.append("company_id", null);
      // }
      formData.append("excel_file", values.excel_file[0]["originFileObj"]);

      const request = (data) =>
        personType === "mainTab"
          ? api._POST_MAIN_PERSONS_EXCEL(data)
          : api._POST_SUBORDINATE_PERSONS_EXCEL(data);

      request(formData)
        .then((res) => {
          setLoading(false);
          form.resetFields();
          Modal.success({
            content:
              personType === "mainTab"
                ? `از تعداد : ${res.data.total} ردیف ، ${res.data.success} ردیف وارد سیستم شد.`
                : ` ${res.data.success} ردیف وارد سیستم شد.`,
          });
        })
        .catch((error) => {
          if (error.response) {
            Modal.error({
              content: "مشکلی پیش آمده است لطفا دوباره تلاش کنید ",
            });
            setLoading(false);
          }
        });
    }
  };

  return {
    loading,
    submit,
  };
};
