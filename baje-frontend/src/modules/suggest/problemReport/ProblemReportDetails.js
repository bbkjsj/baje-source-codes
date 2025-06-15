import React, { useEffect, useState } from "react";
import { notification } from "antd";
import GoBackBtn from "components/GoBackBtn";
import { useParams } from "react-router-dom";
import { _GET_ITEM } from "./utils/api";
import DetailDescription from "components/DetailDescription";
import { covetFormatDateToFA } from "_helpers";
import ContentTop from "components/general/ContentTop";

function ProblemReportDetails() {
  const [loading, setLoading] = useState(false);
  const routeParams = useParams();
  const [detailItems, setDetailItems] = useState([]);

  useEffect(() => {
    setLoading(true);
    _GET_ITEM(routeParams.itemId)
      .then((res) => {
        setLoading(false);
        if (res) {
          const data = res.data;

          const detailArr = [
            { label: "عنوان", value: data?.title },
            { label: "نوع گزارش", value: data?.type },
            { label: "تاریخ", value: covetFormatDateToFA(data?.problem_date) },
            { label: "نتیجه", value: data?.result },
            { label: "راه حل", value: data?.solution },
            { label: "توضیحات", value: data?.description },
          ];

          setDetailItems(detailArr);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        notification.error({
          message: "مشکلی پیش آمده، لطفا دوباره تلاش کنید",
        });
      });
  }, []);

  return (
    <>
      <GoBackBtn />

      <ContentTop
        title="جزئیات گزارش"
        className="mt-3"
        breadcrumbItems={[
          { text: "نظام پیشنهادات" },
          { text: "گزارش مشکلات اجرای پیشنهاد" },
        ]}
      />

      <DetailDescription items={detailItems} loading={loading} />
    </>
  );
}

export default ProblemReportDetails;
