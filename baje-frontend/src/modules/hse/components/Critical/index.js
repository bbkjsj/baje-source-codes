import { Checkbox } from "antd";
import AppRadioGroup from "components/general/AppRadioGroup";
import AppSelect from "components/general/AppSelect";

import { criticalValues } from "modules/hse/constant";
import React from "react";

/**
 *
 * @param {object} params - params of component
 * @param {string} params.type - type of critical
 * @param {boolean} params.isReverse - isReverse
 * @param {"radio"|"select"|"checkbox"} params.componentType - component type
 * @param {"multiple"|"tags"} params.mode - mode
 * @returns
 */
const CriticalValue = ({ type, componentType, mode, isReverse, ...prp }) => {
  // if (type === constant.rate) return <AppNumInput min={0} max={4} {...prp} />;
  if (componentType && componentType === "checkbox")
    return (
      <Checkbox.Group
        options={criticalValues(!!isReverse)[type].map((item) => ({
          ...item,
          value: `${item.value}`,
        }))}
        {...prp}
      />
    );
  if (componentType && componentType === "radio")
    return (
      <AppRadioGroup
        options={criticalValues(!!isReverse)[type].map((item) => ({
          ...item,
          value: `${item.value}`,
        }))}
        {...prp}
      />
    );
  return (
    <AppSelect
      mode={mode}
      options={criticalValues(!!isReverse)[type]}
      {...prp}
    />
  );
};

export default CriticalValue;
