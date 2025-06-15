import AppButton from "components/general/AppButton";
import React, { useState, useContext, useEffect } from "react";
import { getLink, randomBetween } from "_helpers";
import { Link, useHistory } from "react-router-dom";

import { Spin } from "antd";
import { getCompanyInsurances } from "../common/api";
import { handleExceptions } from "../common/exceptions";
import NewInsuranceItem from "./newInsuranceItem";
import { pageNames } from "constant";
import { useSelector } from "react-redux";

const ChooseInsuranceModal = ({ onCancel, userInsurances }) => {
  const currentOffice = useSelector((state) => state.currentOffice);
  const [insurances, setInsurances] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    getCompanyInsurances(currentOffice.toString())
      .then((res) => {
        setLoading(false);
        if (res && res.data && res.data.response) {
          let companyInsurances = res.data.response;
          let newList = [...companyInsurances];
          if (userInsurances) {
            const userInsuranceIds = userInsurances.map(
              (userItem) => userItem.insurance_id_fk
            );

            newList = companyInsurances.filter((item) => {
              return !userInsuranceIds.includes(item.id);
            });
          }
          setInsurances(newList);
        } else {
          handleExceptions();
        }
      })
      .catch((err) => {
        setLoading(false);
        handleExceptions(err);
      });
  }, []);

  let insuranceItems;

  if (insurances) {
    insuranceItems = insurances.map((item, idx) => (
      <NewInsuranceItem
        key={item.id}
        data={item}
        idx={idx}
        userInsurances={userInsurances}
        onClick={() =>
          history.push(
            getLink(pageNames.personnel.insurance.supplymentary.contracts.add, {
              id: item.id,
            })
          )
        }
      />
    ));
  }

  return (
    <div className="choose-insurance-modal">
      <Spin spinning={loading}>
        <p className="mb-4 text-center">
          لطفا برای افزودن لیست بیمه یکی از بیمه هایتان را انتخاب نمایید
        </p>
        {!loading && (
          <>
            {insuranceItems && insuranceItems.length
              ? insuranceItems
              : "هیچ لیست بیمه ای که شما در آن عضو نباشید یافت نشد"}
          </>
        )}
      </Spin>

      <AppButton className="mt-3" onClick={() => onCancel()}>
        بستن
      </AppButton>
    </div>
  );
};

export default ChooseInsuranceModal;
