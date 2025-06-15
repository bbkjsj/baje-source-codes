import { v4 as uuidv4 } from "uuid";
import {
  checkShamsi,
  countOfNumInp,
  numberNormalize,
  priceNormalizer,
} from "../../../_helpers";

const checkDate = () => ({
  validator(rule, value) {
    if (!value || checkShamsi(value)) {
      return Promise.resolve();
    } else {
      return Promise.reject("فرمت تاریخ صحیح نیست");
    }
  },
});

const checkDateStart = ({ getFieldValue }) => ({
  validator(rule, value) {
    if (checkShamsi(value, false) && getFieldValue("contract_date") > value) {
      return Promise.reject(
        "تاریخ شروع قرارداد نباید قبل از تاریخ قرارداد باشد."
      );
    }

    if (!value || checkShamsi(value, false)) {
      return Promise.resolve();
    } else {
      return Promise.reject("فرمت تاریخ صحیح نیست");
    }
  },
});

const checkDateFinishDate = ({ getFieldValue }) => ({
  validator(rule, value) {
    if (checkShamsi(value, false) && getFieldValue("start_date") > value) {
      return Promise.reject("تاریخ پایان نباید قبل از تاریخ شروع باشد");
    }

    if (!value || checkShamsi(value, false)) {
      return Promise.resolve();
    } else {
      return Promise.reject("فرمت تاریخ صحیح نیست");
    }
  },
});

export const addContactsFields = [
  {
    id: uuidv4(),
    option: [
      { label: "اصلی عمرانی", value: "main_civil" },
      { label: "اصلی غیر عمرانی", value: "main_non_civil" },
      { label: "فرعی عمرانی", value: "sub_civil" },
      { label: "فرعی غیر عمرانی", value: "sub_non_civil" },
    ],
    type: "dropDownSelect",
    label: "نوع قرارداد",
    name: "type",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    option: [
      { label: "معدنی", value: "mineral" },
      { label: "غیرمعدنی", value: "non_mineral" },
    ],
    type: "dropDownSelect",
    label: "نوع فعالیت",
    name: "activity",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    label: "شماره قرارداد",
    name: "contract_number",
    // normalize: numberNormalize,
  },

  {
    id: uuidv4(),
    type: "customInput",
    label: "قرارداد اصلی",
    name: "main_contract",
  },

  {
    id: uuidv4(),
    type: "maskAndDatePicker",
    label: "تاریخ قرارداد",
    name: "contract_date",
    // rules: [checkDate],
  },
  {
    id: uuidv4(),
    type: "maskAndDatePicker",
    label: "تاریخ شروع قرارداد",
    name: "start_date",
    zIndex: "99",
    rules: [checkDateStart],
  },
  {
    id: uuidv4(),
    type: "maskAndDatePicker",
    label: "تاریخ پایان قرارداد",
    name: "finish_date",
    zIndex: "98",
    rules: [checkDateFinishDate],
  },
  {
    id: uuidv4(),
    type: "customInput",
    name: "employer",
  },
  {
    id: uuidv4(),
    type: "customInput",
    name: "contractor",
  },
  {
    id: uuidv4(),
    type: "text",
    label: "موضوع قرارداد ",
    name: "subject",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    label: "مبلغ اولیه قراداد",
    name: "initial_amount",
    normalize: priceNormalizer,
  },
  {
    id: uuidv4(),
    type: "text",
    label: "کد کارگاهی",
    name: "workshop_code",
    normalize: (value, prevValue) => countOfNumInp(value, prevValue, 10),
    rules: [
      {
        len: 10,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    label: "ردیف پیمان",
    name: "row",
    normalize: (value, prevValue) => countOfNumInp(value, prevValue, 3),
    rules: [
      {
        len: 3,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    label: "دستگاه نظارت",
    name: "supervision",
  },
  {
    id: uuidv4(),
    type: "customInput",
    name: "manager",
  },
  {
    id: uuidv4(),
    type: "customInput",
    name: "boss",
  },
];
