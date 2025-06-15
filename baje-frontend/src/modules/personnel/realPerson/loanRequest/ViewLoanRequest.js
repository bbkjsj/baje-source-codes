import React, { useEffect, useState } from "react";
import { notification } from "antd";
import GoBackBtn from "components/GoBackBtn";
import { useParams } from "react-router-dom";
import { _GET_ITEM } from "./utils/api";
import DetailDescription from "components/DetailDescription";
import ContentTop from "components/general/ContentTop";
import { pageNames } from "constant";

function MemberView({ updating, view }) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const routeParams = useParams();

  useEffect(() => {
    setLoading(true);
    _GET_ITEM(routeParams.id)
      .then((res) => {
        setLoading(false);
        if (res) {
          setData(res.data);
          console.log("dataaaaaaaaaaaaaaaa:", res.data);
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

  const detailItems = [
    { label: "کد پرسنلی", value: data?.personnel_id_fk },
    { label: "مبلغ درخواستی", value: data?.amount },
    { label: "تعداد اقساط", value: data?.number_of_installment },
    { label: "توضیحات", value: data?.description },
  ];

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="جزییات مساعده"
        className="mt-3"
        breadcrumbItems={[
          {
            text: "درخواست های مساعده",
            link: pageNames.personnel.realPerson.loanRequest.list,
          },
          { text: "جزییات" },
        ]}
      />
      <DetailDescription items={detailItems} loading={loading} />
    </>
  );
}

export default MemberView;
