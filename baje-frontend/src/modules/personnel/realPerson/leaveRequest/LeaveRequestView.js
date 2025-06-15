import React, { useEffect, useState } from "react";
import { notification } from "antd";
import GoBackBtn from "components/GoBackBtn";
import { useParams } from "react-router-dom";
import { _GET_ITEM } from "./utils/api";
import DetailDescription from "components/DetailDescription";
import { covetFormatDateToFA, timeToFa } from "_helpers";
import ContentTop from "components/general/ContentTop";
import { pageNames } from "constant";
import { getPersonData } from "modules/personnel/insurance/mobileInsuranceContracts/common/api";

function MemberView({ updating, view }) {
  const [data, setData] = useState();
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
          let detailArr = [
            { label: "کد پرسنلی", value: data?.personnel_id_fk },
            {
              label: "نوع",
              value: `${data.type} ${
                data.request_type &&
                data.request_type != "undefined" &&
                data.type != "بدون حقوق"
                  ? " - " + data.request_type
                  : ""
              }`,
            },
            { label: "وضعیت", value: data?.status || "در انتظار تایید" },
          ];

          if (res.data.request_type === "ساعتی") {
            detailArr = [
              ...detailArr,
              {
                label: "تاریخ",
                value: covetFormatDateToFA(res.data.from_date.split(" ")[0]),
              },
              {
                label: "از ساعت",
                value: res.data.from_date.split(" ")[1],
              },
              {
                label: "تا ساعت",
                value: res.data.to_date.split(" ")[1],
              },
            ];
          } else {
            detailArr = [
              ...detailArr,
              {
                label: "از تاریخ",
                value: timeToFa(res.data.from_date, false),
              },
              {
                label: "تا تاریخ",
                value: timeToFa(res.data.to_date, false),
              },
            ];
          }

          if (data.description) {
            detailArr.push({ label: "توضیحات", value: data?.description });
          } else {
            detailArr.push({ label: "توضیحات", value: "" });
          }

          // find operator name and set it if status is approved
          if (res.data.status === "تایید نهایی") {
            const operatorId = res?.data?.operator_id_fk;
            if (operatorId && operatorId !== null) {
              setLoading(true);
              getPersonData(operatorId).then((personRes) => {
                setLoading(false);
                if (personRes.data.first_name) {
                  detailArr.splice(3, 0, {
                    label: "تایید کننده",
                    value: `${personRes.data.first_name} ${personRes.data.last_name}`,
                  });
                  setDetailItems(detailArr);
                }
              });
            } else {
              detailArr.splice(3, 0, {
                label: "تایید کننده",
                value: "نامشخص",
              });
              setDetailItems(detailArr);
            }
          } else {
            setDetailItems(detailArr);
          }
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
        title="مشاهده جزئیات مرخصی"
        className="mt-3"
        breadcrumbItems={[
          // { text: "منابع انسانی" },
          {
            text: "درخواست های مرخصی",
            link: pageNames.personnel.realPerson.leaveRequest.list,
          },
          { text: "جزییات" },
        ]}
      />
      <DetailDescription items={detailItems} loading={loading} />
    </>
  );
}

export default MemberView;
