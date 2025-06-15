import React, { useEffect, useState } from "react";
import GoBackBtn from "components/GoBackBtn";
import { useParams } from "react-router-dom";
import { getBoardMemberByPersonId } from "./utils/api";
import DetailDescription from "components/DetailDescription";
import { covetFormatDateToFA } from "_helpers";
import ContentTop from "components/general/ContentTop";
import { persianMemberRoles, persianSignatureRights } from "./utils/const";
import { pageNames } from "constant";

function BoardMemberView() {
  const [loading, setLoading] = useState(false);
  const routeParams = useParams();
  const [detailItems, setDetailItems] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await getBoardMemberByPersonId(routeParams.member_id);

        if (res) {
          setLoading(false);
          const data = res.data;

          const detailArr = [
            {
              label: "نام و نام خانوادگی",
              value: data?.first_name + " " + data?.last_name,
            },
            { label: "کد ملی", value: data?.national_number },
            { label: "از تاریخ", value: covetFormatDateToFA(data?.from_date) },
            { label: "تا تاریخ", value: covetFormatDateToFA(data?.to_date) },
            { label: "سمت", value: persianMemberRoles[data?.role] || "-" },
            {
              label: "حق امضا",
              value: data?.signature_rights
                ? data?.signature_rights
                    .split(",")
                    .map((right) => persianSignatureRights[right])
                    .join(" - ")
                : "-",
            },
          ];

          setDetailItems(detailArr);
        }
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title=" جزئیات عضو هیئت مدیره"
        className="mt-3"
        breadcrumbItems={[
          { text: "منابع انسانی" },
          {
            text: "اعضای هیئت مدیره",
            link: pageNames.personnel.boardMembers.list,
          },
          { text: "عضو هیئت مدیره" },
        ]}
      />
      <DetailDescription items={detailItems} loading={loading} />
    </>
  );
}

export default BoardMemberView;
