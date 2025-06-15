import { timeToFaSeparate, convertStringToArr } from "_helpers";
import { accidentLocation } from "../const";

const prepareDataForForm = (data) => {
  let newDate = { ...data };
  let incident = { ...newDate.incident };
  let personnel = [...newDate.persons];
  personnel = preparePersonnelData(personnel);
  let vehicles = [...newDate.vehicles];
  vehicles = prepareVehicles(vehicles);

  let convertedDate = timeToFaSeparate(incident.date);
  incident.date = convertedDate.date;
  incident.time = convertedDate.time;
  incident.type = convertStringToArr(incident.type);
  incident.reason = convertStringToArr(incident.reason);
  incident.reason_other = convertStringToArr(incident.reason_other);
  incident.location = incident.project_id
    ? accidentLocation.IN_PROJECT
    : accidentLocation.OUT_OF_PROJECT;

  return { ...incident, vehicles, personnel };
};

const preparePersonnelData = (personnel) => {
  return personnel.map((el) => {
    return {
      ...el,
      fullName: el.first_name + " " + el.last_name,
      injury_type: convertStringToArr(el.injury_type),
      injury: convertStringToArr(el.injury),
      national_id: el.national_number,
    };
  });
};

const prepareVehicles = (vehicles) => {
  return vehicles.map((el) => {
    return {
      ...el,
      machine_code: el.organization_code,
    };
  });
};

export { prepareDataForForm };
