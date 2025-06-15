import React, { useEffect, useState } from "react";
import { notification } from "antd";
import GoBackBtn from "components/GoBackBtn";
import { useParams } from "react-router-dom";
import { _GET_ITEM } from "./utils/api";
import DetailDescription from "components/DetailDescription";
import { priceNormalizer } from "_helpers";
import ContentTop from "components/general/ContentTop";

function ResumeView({ updating, view }) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [detailItems, setDetailItems] = useState([]);
  const routeParams = useParams();

  useEffect(() => {
    /*
    setLoading(true);
    _GET_ITEM(routeParams.id)
      .then((res) => {
        setLoading(false);
        if (res) {
          setData(res.data);
          setDetailItems([
            { label: "نام و نام خانوادگی", value: res.data.first_name + " " + res.data.first_name },
            {
              label: "کد پرسنلی",
              value: res.data.personnel_code,
            },
            {
              label: "پروژه",
              value: res.data.project,
            },
            { label: "عنوان شغلی", value: res.data.job_title },
            { label: "تاریخ شروع", value: covetFormatDateToFA(res.data.start_date) },
            { label: "تاریخ پایان", value: covetFormatDateToFA(res.data.end_date) },
          ]);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        notification.error({
          message: "مشکلی پیش آمده، لطفا دوباره تلاش کنید",
        });
      });
      */
  }, []);

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="مشاهده رزومه فرد"
        className="mt-3"
        breadcrumbItems={[
          {
            text: "منابع انسانی",
          },
          { text: "افراد حقیقی" },
          { text: "لیست افراد" },
          { text: "رزومه" },
        ]}
      />
      <DetailDescription items={detailItems} loading={loading} />
    </>
  );
}

export default ResumeView;
