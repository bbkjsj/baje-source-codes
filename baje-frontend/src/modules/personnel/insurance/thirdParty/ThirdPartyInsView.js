import React, { useEffect, useState } from "react";
import { Modal, notification } from "antd";
import GoBackBtn from "components/GoBackBtn";
import { useParams } from "react-router-dom";
import { _CHANGE_STATUS, _GET_ITEM } from "./utils/api";
import DetailDescription from "components/DetailDescription";
import { covetFormatDateToFA } from "_helpers";
import ContentTop from "components/general/ContentTop";
import { pageNames } from "constant";
import { config } from "constant";
import AppButton from "components/general/AppButton";
import useCheckAccess from "hooks/useCheckAccess";
import { permission as permissions } from "json/Permission";

function ThirdPartyInsView() {
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const routeParams = useParams();
  const [detailItems, setDetailItems] = useState([]);
  const [data, setData] = useState();
  const checkAccess = useCheckAccess();

  useEffect(() => {
    setLoading(true);
    _GET_ITEM(routeParams.id)
      .then((res) => {
        setLoading(false);
        if (res) {
          const data = res.data;
          setData(data);

          const detailArr = [
            { label: "کد سازمانی ماشین", value: data?.machineOrganizationCode },
            {
              label: "شناسه یکتای بیمه مرکزی",
              value: data?.insuranceIdentification,
            },
            { label: "شماره بیمه نامه", value: data?.insuranceNumber },
            { label: "شرکت بیمه گر", value: data?.companyName },
            {
              label: "بیمه گذار",
              value: data?.insurerCompanyId || data?.insurerPersonnelId,
            },
            {
              label: "اعتبار از تاریخ",
              value: covetFormatDateToFA(data?.fromDate),
            },
            { label: "تا تاریخ", value: covetFormatDateToFA(data?.toDate) },
            { label: "سابقه عدم خسارت", value: data?.noDamageHistory },
            { label: "حق بیمه", value: data?.insurance },
            {
              label: "حداكثر تعهد خسارت مالي",
              value: data?.maxCommitmentFinancialDamages,
            },
            {
              label: "حداكثر تعهد صدمات جاني",
              value: data?.maxCommitmentInjury,
            },
            {
              label: "حداكثر تعهد حوادث راننده",
              value: data?.maxCommitmentDriver,
            },
            {
              label: "تحویل گیرنده بیمه نامه",
              value: `${data?.deliverToFirstName} ${data?.deliverToLastName}`,
            },
            {
              label: "اسکن بیمه نامه",
              value: data?.file ? (
                <a
                  href={config.url.API_URL + "/api/v1/baje/" + data?.file}
                  //download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  مشاهده
                </a>
              ) : (
                "-"
              ),
            },
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

  // handel status change
  function handleStatusChange() {
    const newStatus = data?.status == "1" ? "0" : "1";
    Modal.confirm({
      title: "تغییر وضعیت",
      content: `آیا مطمئن هستید میخواهید این رکورد را ${
        data?.status == "1" ? "از تایید خارج" : "تایید"
      } کنید؟`,
      onOk: () => {
        setButtonLoading(true);
        _CHANGE_STATUS(data.id, newStatus)
          .then(() => {
            setButtonLoading(false);
            setData({ ...data, status: newStatus });
            notification.success({
              message: "با موفقیت ثبت شد",
            });
          })
          .catch((err) => {
            setButtonLoading(false);
            console.error(err);
          });
      },
    });
  }

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="جزئیات بیمه شخص ثالث"
        className="mt-3"
        breadcrumbItems={[
          { text: "منابع انسانی" },
          { text: "بیمه" },
          { text: "بیمه شخص ثالث" },
          { text: "جزییات" },
        ]}
      />
      <DetailDescription items={detailItems} loading={loading} />

      {data?.status !== undefined &&
      checkAccess([permissions.THIRD_PARTY_INSURANCE_APPROVE]) ? (
        <AppButton
          variant={data?.status == "1" ? "danger" : "success"}
          onClick={handleStatusChange}
          loading={buttonLoading}
          className="my-3 big-btn mx-auto"
        >
          {data?.status == "1" ? "خروج از تایید" : "تایید"}
        </AppButton>
      ) : (
        ""
      )}
    </>
  );
}

export default ThirdPartyInsView;
