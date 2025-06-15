import AppModal from "components/general/AppModal";
import React from "react";
import { Calendar } from "react-modern-calendar-datepicker";
import moment from "moment-jalaali";

const ShamsiDatePicker = ({
  visible,
  minimumDate,
  maximumDate,
  value,
  onChange,
}) => {
  const handleChange = ({ year: jYear, month: jMonth, day: jDay }) => {
    onChange(moment(`${jYear}/${jMonth}/${jDay}`, "jYYYY/jMM/jDD").toDate());
  };

  return (
    <AppModal centered footer={null} closable={false} visible={visible}>
      <Calendar
        locale="fa"
        onChange={handleChange}
        value={
          value && {
            year: moment(value).jYear(),
            month: parseInt(moment(value).format("jMM")),
            day: parseInt(moment(value).format("jDD")),
          }
        }
        minimumDate={
          minimumDate && {
            year: moment(minimumDate).jYear(),
            month: parseInt(moment(minimumDate).format("jMM")),
            day: parseInt(moment(minimumDate).format("jDD")),
          }
        }
        maximumDate={
          maximumDate && {
            year: moment(maximumDate).jYear(),
            month: parseInt(moment(maximumDate).format("jMM")),
            day: parseInt(moment(maximumDate).format("jDD")),
          }
        }
      />
    </AppModal>
  );
};

export default ShamsiDatePicker;
