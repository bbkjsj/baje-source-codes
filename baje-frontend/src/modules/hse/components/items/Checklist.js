import AppButton from "components/general/AppButton";
import { constant } from "modules/hse/constant";
import React from "react";

const ChecklistItem = ({ checklist, onClick }) => {
  const handleClick = (params) => {
    onClick(checklist);
  };

  return (
    <div className="flex my-2">
      <AppButton disabled={!checklist.enable} onClick={handleClick}>{`${
        checklist.code
      } - ${
        checklist.group === constant.vehicle
          ? checklist.vehicleType
          : checklist.group === constant.inidividual
          ? checklist.job
          : ""
      } `}</AppButton>
    </div>
  );
};

export default ChecklistItem;
