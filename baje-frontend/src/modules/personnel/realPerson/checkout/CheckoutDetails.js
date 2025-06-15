import React, { useEffect, useState } from "react";
import { notification } from "antd";
import GoBackBtn from "components/GoBackBtn";
import { useParams } from "react-router-dom";
import { _GET_ITEM } from "./utils/api";
import DetailDescription from "components/DetailDescription";
import { covetFormatDateToFA } from "_helpers";
import ContentTop from "components/general/ContentTop";
import { pageNames } from "constant";

function CheckoutView() {
  const [loading, setLoading] = useState(false);
  const routeParams = useParams();
  const [detailItems, setDetailItems] = useState([]);

  useEffect(() => {
    setLoading(true);
    _GET_ITEM(routeParams.id)
      .then((res) => {
        setLoading(false);
        if (res) {
          const data = res.data;

          const detailArr = [
            { label: "کد پرسنلی", value: data?.personnel_id_fk },
            { label: "تاریخ", value: covetFormatDateToFA(data?.date) },
            { label: "دلیل", value: data?.reason },
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
        title=" جزئیات تسویه حساب"
        className="mt-3"
        breadcrumbItems={[
          // { text: "منابع انسانی" },
          {
            text: "درخواست های تسویه حساب",
            link: pageNames.personnel.realPerson.checkout.list,
          },
          { text: "جزییات" },
        ]}
      />
      <DetailDescription items={detailItems} loading={loading} />
    </>
  );
}

export default CheckoutView;
