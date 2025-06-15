import { checkNationalNumber } from "./API";

const handleCheckNationalNumber = (event, useForm) => {
  let value = event.target.value;
  if (value && value.length === 10) {
    checkNationalNumber(value)
      .then(() => {})
      .catch(() => {
        useForm.setFields([
          {
            name: "national_number",
            errors: ["کد ملی تکراری است"],
          },
        ]);
      });
  }
};

const handleSetPassword = (useForm) => {
  const nationalID = useForm.getFieldValue("national_number");
  useForm.setFieldsValue({
    "password/mainInfoTab": nationalID,
    "repeat_password/mainInfoTab": nationalID,
  });
};

export {
    handleCheckNationalNumber,
    handleSetPassword
};
