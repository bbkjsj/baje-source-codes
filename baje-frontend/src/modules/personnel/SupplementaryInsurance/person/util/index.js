import { covetFormatDateToFA } from "_helpers";
import moment from "moment-jalaali";

export const checkBirthDateWithContractDate = (birthDate, contractDate) => {
  const jFormat = "jYYYY/jMM/jDD";

  const birthFirstOfMonth = moment(birthDate).jDate(1);
  const contract = moment(contractDate);

  if (contract.isBefore(birthFirstOfMonth))
    return birthFirstOfMonth.format(jFormat);
  else return contract.format(jFormat);
};
