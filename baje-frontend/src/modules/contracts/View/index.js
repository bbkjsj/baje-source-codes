import React, { useState, useEffect } from "react";
import { Row } from "antd";
import GoBackBtn from "components/GoBackBtn";
import ContentTop from "components/general/ContentTop";
import { formRowGutter, pageNames } from "constant";
import styled from "styled-components";
import LoadingLogo from "components/general/LoadingLogo";
import { GET_CONTRACT } from "../utils/api";
import Field from "components/Field";
import { covetFormatDateToFA, timeToFa } from "_helpers";
import { contractTypes } from "../utils/constant";
import Value from "components/Value";
import adjustmentOptions from "../common/adjustmentBasisOptions";

const ContractContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  margin-right: 3px;
  box-shadow: 0 4px 8px 0 rgba(19, 37, 71, 0.1);
`;

export default function Index(props) {
  const contractID = props.match.params.id;
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState();

  useEffect(() => {
    (async function () {
      const res = await GET_CONTRACT(contractID);

      const data = res.data;
      const newContract = {
        "نوع فعالیت":
          data.activity === "mineral"
            ? "معدنی"
            : data.activity === "non_mineral"
            ? "غیرمعدنی"
            : data.activity,
        "زمان شروع قرارداد": timeToFa(data.startDate, false),
        "شناسه یکتا": data.id,
        "مبلغ اولیه": data.initialAmount,
        "ردیف پیمان": data.row,
        "شماره قرارداد": data.contractNumber,
        "موضوع قرارداد": data.subject,
        " کارفرما": data.employer,
        " پیمان کار": data.contractorId,
        " کد کارگاهی": data.workshopCode,
        "نوع قرارداد":
          data.type === contractTypes.MAIN_CIVIL
            ? "اصلی عمرانی"
            : data.type === contractTypes.MAIN_NON_CIVIL
            ? "اصلی غیر عمرانی"
            : data.type === contractTypes.SUB_CIVIL
            ? "فرعی عمرانی"
            : data.type === contractTypes.SUB_NON_CIVIL
            ? "فرعی غیر عمرانی"
            : data.type,
        "مدیر پروژه ": data.managerId,
        "رئیس کارگاه": data.bossId,
        "تاریخ قرارداد": timeToFa(data.date, false),
        "تاریخ پایان قرارداد": timeToFa(data.endDate, false),
        مشاور: data.consultantCompanyId,
        "نوع پیمان": data.contractType.includes("two")
          ? "دو عاملی"
          : data.contractType.includes("three")
          ? "سه عاملی"
          : data.contractType,
        "محیط پروژه": data.environmentId,
        "فهرست بها": data.priceListYear,
        "شاخص مبنای تعدیل":
          data.adjustmentBaseIndex &&
          adjustmentOptions.find((i) => i.value == data.adjustmentBaseIndex)
            ?.label,
        "فصل های فهرست بها": data.priceListParts,
        "وزن زمانی": data.timeWeight,
        "وزن ریالی": data.rialWeight,
      };

      setContract(newContract);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <LoadingLogo />;
  }

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="مشاهده قرارداد"
        breadcrumbItems={[
          {
            text: "قرارداد ها",
            link: pageNames.contract.list,
          },
        ]}
      />
      <ContractContainer>
        <Row gutter={formRowGutter}>
          {Object.keys(contract).map((el) => (
            <Field name={el} value={<Value value={contract[el]} />} />
          ))}
        </Row>
      </ContractContainer>
    </>
  );
}
