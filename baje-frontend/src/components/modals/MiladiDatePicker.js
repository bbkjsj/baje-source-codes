import AppModal from "components/general/AppModal";
import React from "react";
import { DatePicker } from "antd";
const MiladiDatePicker = () => {
  return (
    <AppModal visible>
      <DatePicker locale="fa" />
    </AppModal>
  );
};

export default MiladiDatePicker;
