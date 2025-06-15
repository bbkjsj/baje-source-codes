import React from "react";
import { v4 as uuidv4 } from "uuid";
import SubordinatePeople from "components/renderInput/subordinatepeopleSection/SubordinatePeople";

const Father = ({ useForm, formChangeHandlers }) => {
  return (
    // change inputs name
    <SubordinatePeople
      form={useForm}
      name="father"
      label="پدر"
      id={uuidv4()}
      limit={1}
      initLastName={useForm.getFieldValue("last_name/mainInfoTab")}
      initName={useForm.getFieldValue("father_name/mainInfoTab")}
    />
  );
};

const Mother = ({ useForm }) => {
  return (
    // change inputs name
    <SubordinatePeople
      form={useForm}
      name="mother"
      label="مادر"
      id={uuidv4()}
      limit={1}
    />
  );
};

const Son = ({ useForm }) => {
  return (
    <SubordinatePeople
      form={useForm}
      name="son"
      label="فرزندان پسر"
      id={uuidv4()}
      initLastName={useForm.getFieldValue("last_name/mainInfoTab")}
      initFatherName={useForm.getFieldValue("first_name/mainInfoTab")}
    />
  );
};

const Daughter = ({ useForm }) => {
  return (
    <SubordinatePeople
      form={useForm}
      name="daughter"
      label="فرزندان دختر"
      id={uuidv4()}
      initLastName={useForm.getFieldValue("last_name/mainInfoTab")}
      initFatherName={useForm.getFieldValue("first_name/mainInfoTab")}
    />
  );
};

const Wife = ({ useForm }) => {
  return (
    <SubordinatePeople form={useForm} name="wife" label="همسر" id={uuidv4()} />
  );
};

export { Father, Mother, Son, Daughter, Wife };
