import moment from "moment";

export const getShiftWorkingDays = (shifts) => {
  return shifts.reduce((prev, curr) => {
    return curr.status === "work" ? Number(curr.days) + prev : prev;
  }, 0);
};

function hoursBetweenTwoDates(startDate, endDate) {
  const start = moment(startDate);
  const end = moment(endDate);
  const duration = moment.duration(end.diff(start));
  return duration.asHours();
}

export const getShiftWorkingHours = (shifts) => {
  const result = shifts.reduce((prev, curr) => {
    const dayHours = hoursBetweenTwoDates(curr.from_time, curr.to_time);
    const totalHours = dayHours * Number(curr.days);
    return curr.status === "work" ? totalHours + prev : prev;
  }, 0);

  return Math.round(result * 10) / 10;
};

export const getShiftPatternString = (shifts) => {
  return shifts.map((shift) => {
    const shiftType = shift.status === "work" ? "کار" : "استراحت";
    const startTime = moment(shift.from_time).format("HH:mm");
    const endTime = moment(shift.to_time).format("HH:mm");

    let result = `${shift.days} روز ${shiftType}`;
    result += shift.status === "work" ? ` ${startTime} لغایت ${endTime}` : "";

    return result;
  });
};

export const getShiftTimeString = (timestamp) => {
  return moment(timestamp).format("HH:mm");
};
