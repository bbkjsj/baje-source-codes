import { Input, Radio, Select } from "antd";
import AppFormItem from "components/general/AppFormItem";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import React from "react";
import { useEffect } from "react";
import { countOfNumInp } from "_helpers";

export const InsuranceNumberInput = ({ defaultValue }) => (
  <AppFormItem
    name="insuranceNumber"
    style={{ margin: 0 }}
    normalize={(v, prevV) => countOfNumInp(v, prevV, 15)}
  >
    <Input type="number" defaultValue={defaultValue} />
  </AppFormItem>
);

export const QuitReasonSelect = () => {
  const options = [
    { label: "سن قانونی", value: "legal_age" },
    { label: "فوت", value: "death" },
    { label: "ازدواج", value: "marriage" },
    { label: "تکفل سایرین", value: "dependant_to_other" },
    { label: "سایر", value: "other" },
  ];

  return (
    <AppFormItem name="dependencyQuitReason" style={{ margin: 0 }}>
      <Select options={options}></Select>
    </AppFormItem>
  );
};

export const QuitDateInput = ({ form, quitReason }) => {
  function getPlaceholder() {
    const placeholders = {
      death: "تاریخ فوت",
      marriage: "تاریخ ازدواج",
    };

    if (quitReason) {
      return placeholders[quitReason];
    }
  }

  return (
    <CustomDatePicker
      form={form}
      name="dependencyQuitDate"
      placeholder={getPlaceholder()}
      style={{ margin: 0 }}
      plain
    />
  );
};

export const RelationType = () => {
  return (
    <AppFormItem name="familyRelation" style={{ marginBottom: 0 }}>
      <Radio.Group defaultValue="commonParents" className="mt-2">
        <Radio value="commonParents" className="text-12">
          هر دو مشترک
        </Radio>
        <Radio value="commonFather" className="text-12">
          از پدر مشترک
        </Radio>
        <Radio value="commonMother" className="text-12">
          از مادر مشترک
        </Radio>
      </Radio.Group>
    </AppFormItem>
  );
};

export const temp = "temp";
