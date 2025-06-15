import React, { useEffect, useState } from "react";
import { notification } from "antd";
import GoBackBtn from "components/GoBackBtn";
import { useParams } from "react-router-dom";
import { _GET_ITEM } from "./utils/api";
import DetailDescription from "components/DetailDescription";
import { priceNormalizer } from "_helpers";
import ContentTop from "components/general/ContentTop";

function MemberView({ updating, view }) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [detailItems, setDetailItems] = useState([]);
  const routeParams = useParams();

  useEffect(() => {
    setLoading(true);
    _GET_ITEM(routeParams.id)
      .then((res) => {
        setLoading(false);
        if (res) {
          setData(res.data);
          setDetailItems([
            { label: "سال", value: res.data.year },
            {
              label: "حداقل حقوق روزانه",
              value: priceNormalizer(res.data.min_daily_salary),
            },
            {
              label: "حداکثر حقوق روزانه",
              value: priceNormalizer(res.data.max_daily_salary),
            },
            { label: "مزایای انگیزشی", value: priceNormalizer(res.data.bonus) },
            { label: "حق مسکن", value: priceNormalizer(res.data.housing) },
            { label: "توضیحات", value: res.data.description },
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
  }, []);

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="مشاهده تنظیمات"
        className="mt-3"
        breadcrumbItems={[
          { text: "منابع انسانی" },
          { text: "تنظیمات سالانه" },
          { text: "مشاهده تنظیمات" },
        ]}
      />
      <DetailDescription items={detailItems} loading={loading} />
    </>
  );
}

export default MemberView;
