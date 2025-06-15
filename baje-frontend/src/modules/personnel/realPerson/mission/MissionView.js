import React, { useEffect, useState } from "react";
import { notification } from "antd";
import GoBackBtn from "components/GoBackBtn";
import { useParams } from "react-router-dom";
import { _GET_ITEM } from "./utils/api";
import DetailDescription from "components/DetailDescription";
import { covetFormatDateToFA } from "_helpers";
import ContentTop from "components/general/ContentTop";
import { pageNames } from "constant";

function MissionView() {
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
            { label: "نوع مرخصی", value: data?.type },
            { label: "محل مرخصی", value: data?.location },
            { label: "موضوع مرخصی", value: data?.subject },
            { label: "از تاریخ", value: covetFormatDateToFA(data.from_date) },
            { label: "تا تاریخ", value: covetFormatDateToFA(data.to_date) },
            { label: "محل اقامت", value: data?.residency },
            { label: "وسیله رفت و برگشت", value: data?.vehicle },
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
        title="جزییات ماموریت"
        className="mt-3"
        breadcrumbItems={[
          {
            text: "ماموریت ها",
            link: pageNames.personnel.realPerson.mission.list,
          },
          { text: "جزییات" },
        ]}
      />
      <DetailDescription items={detailItems} loading={loading} />
    </>
  );
}

export default MissionView;
