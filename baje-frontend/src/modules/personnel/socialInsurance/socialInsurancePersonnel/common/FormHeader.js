import React, { useState } from "react";
import { getLink, toPersianDigits } from "_helpers";
import GoBackBtn from "components/GoBackBtn";
import ContentTop from "components/general/ContentTop";
import { useParams } from "react-router";
import { pageNames } from "constant";

function FormHeader({ information, mode, pageTitle }) {
  const routeParams = useParams();

  return (
    <>
      {mode == "add" && <GoBackBtn />}

      <ContentTop
        title={`${pageTitle} -- کدکارگاهی: ${
          information?.workshop_code
            ? toPersianDigits(information?.workshop_code)
            : information?.workshop_code
        }
      ، ردیف: ${
        information?.row ? toPersianDigits(information?.row) : information?.row
      }
      ، سال و ماه: ${
        information?.year
          ? toPersianDigits(information.year)
          : information?.year
      }/${
          information?.month
            ? toPersianDigits(information?.month)
            : information?.month
        }`}
        className="mt-3"
        breadcrumbItems={[
          {
            text: "بیمه تامین اجتماعی",
            link: pageNames.personnel.insurance.tamin.list,
          },
          {
            text: "ریز اسامی ",
            link: getLink(
              pageNames.personnel.insurance.tamin.personnel.list,
              routeParams.id
            ),
          },
          { text: pageTitle },
        ]}
      />
    </>
  );
}

export default FormHeader;
