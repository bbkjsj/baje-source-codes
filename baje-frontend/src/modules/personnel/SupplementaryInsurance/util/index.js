import { covetFormatDateToFA } from "_helpers";

export const convertDataForm = (values) => {
  let data = { ...values };
  data.contract_date_from_date = covetFormatDateToFA(
    data.contract_date_from_date
  );
  data.contract_issue_date = covetFormatDateToFA(data.contract_issue_date);
  data.to_date = covetFormatDateToFA(data.to_date);
  data.change_deadline_date = covetFormatDateToFA(data.change_deadline_date);

  data.company_id = data.company_id_fk;

  data.main_insured = data.main_insured.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  data.spouse_insured = data.spouse_insured.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );
  data.doughter_insured = data.doughter_insured.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );
  data.son_insured = data.son_insured.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  data.father_insured = data.father_insured.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );
  data.mother_insured = data.mother_insured.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );

  return data;
};

export const addCompanyName = (id, legal) => {
  //find name of legal
  const index = legal.findIndex((el) => el.id == id);
  return legal[index].name;
};
