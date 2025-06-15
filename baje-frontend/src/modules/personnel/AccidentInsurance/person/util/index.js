import { covetFormatDateToFA } from "_helpers";

export const checkBirthDateWithContractDate = (birthDate, contractDate) => {
  let birthDateFa = covetFormatDateToFA(birthDate);
  //
  if (birthDateFa > contractDate) {
    let newDate = birthDateFa.split("/");
    newDate[2] = "01";
    return newDate.join("/");
  }

  return contractDate;
};
