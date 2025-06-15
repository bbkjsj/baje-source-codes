import { v4 as uuidv4 } from "uuid";
import {
  checkShamsi,
  imageValidation,
  nation_idNormalize,
  pngValidation,
  numberNormalize,
  mobile_numberNormalize,
  intNormalizer,
  countOfNumInp,
  insuranceNumberNormalizer,
} from "../../../../_helpers";
import bankList from "../../../../json/BankList";

// for upload file
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  if (e.fileList.length > 1) {
    e.fileList.shift();
  }

  return e && e.fileList;
};
const beforeUpload = () => false;

export const firstTab = [
  {
    id: uuidv4(),
    type: "maskAndDatePicker",
    label: "تاریخ تولد",
    name: "birth_date",
    rules: [
      {
        required: true,
        message: "تاریخ تولد اجباری است",
      },
      () => ({
        validator(rule, value) {
          if (checkShamsi(value)) {
            return Promise.resolve();
          } else {
            return Promise.reject("فرمت تاریخ صحیح نیست");
          }
        },
      }),
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    name: "national_number",
    label: "کد ملی",
    normalize: (value, prevValue) => countOfNumInp(value, prevValue, 10),
    rules: [
      {
        required: true,
        len: 10,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    label: "نام",
    name: "first_name",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    label: "نام خانوادگی",
    name: "last_name",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    label: "نام پدر",
    name: "father_name",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    label: "شماره شناسنامه",
    name: "id_number",
    normalize: numberNormalize,
    rules: [
      {
        required: true,
      },
    ],
  },

  {
    id: uuidv4(),
    option: [
      { label: "مرد", value: "male" },
      { label: "زن", value: "female" },
    ],
    type: "groupRadioButton",
    label: "جنسیت",
    name: "sex",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    label: "محل تولد",
    name: "birth_place",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    label: "محل صدور شناسنامه",
    name: "id_issue_place",
    inputAttr: {
      disabled: true,
    },
  },
  {
    id: uuidv4(),
    option: [
      { label: "ایرانی", value: "iranian" },
      { label: "غیر ایرانی", value: "non_iranian" },
    ],
    type: "groupRadioButton",
    label: "ملیت",
    name: "nation",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "textArea",
    label: "توضیحات عمومی",
    name: "public_description",
  },

  {
    id: uuidv4(),
    type: "textArea",
    label: "توضیحات خصوصی",
    name: "private_description",
  },
  {
    id: uuidv4(),
    type: "dropDownSelect",
    label: "ارتباط کارگاهی",
    name: "contract_id",
    rules: [
      {
        required: true,
      },
    ],
  },

  {
    id: uuidv4(),
    option: [
      { label: "مجرد", value: "single" },
      { label: "متاهل", value: "married" },
    ],
    type: "groupRadioButton",
    label: "وضعیت تأهل",
    name: "marital_status",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    option: [
      { label: "نامشخص", value: "unknown" },
      { label: "پایان خدمت", value: "army_done" },
      { label: "معافیت پزشکی", value: "medical" },
      { label: "معافیت کفالت", value: "sponsorship" },
      { label: "معافیت تحصیلی", value: "educational" },
      { label: "خدمت نکرده", value: "none" },
      { label: "خرید خدمت", value: "buy" },
      { label: "موراد خاص", value: "special" },
    ],
    type: "dropDownSelect",
    label: "وضعیت خدمت",
    name: "army_service",
    rules: [
      {
        required: true,
      },
    ],
  },

  {
    id: uuidv4(),
    option: [
      { label: "نامشخص", value: "unknown" },
      { label: "بیسواد", value: "illiterate" },
      { label: "تحصیلات ابتدایی", value: "school" },
      { label: "سیکل", value: "middle_school" },
      { label: "دیپلم", value: "high_school" },
      { label: "لیسانس", value: "bachelor" },
      { label: "فوق لیسانس", value: "master" },
      { label: "دکترا", value: "doctorate" },
    ],
    type: "dropDownSelect",
    label: "میزان تحصیلات",
    name: "education",
  },
  {
    id: uuidv4(),
    type: "text",
    label: "رشته تحصیلی",
    name: "study_field",
  },

  {
    id: uuidv4(),
    type: "text",
    label: "نام کاربری",
    name: "username",
    inputAttr: {
      disabled: true,
    },
  },
  {
    id: uuidv4(),
    type: "password",
    label: "رمز عبور",
    name: "password",
    rules: [
      {
        required: true,
      },
    ],
    inputAttr: {
      autocomplete: "new-password",
    },
  },
  {
    id: uuidv4(),
    type: "confirm_password",
    label: "تکرار رمز عبور",
    name: "repeat_password",
    dependencies: ["password"],
    rules: [
      {
        required: true,
      },

      ({ getFieldValue }) => ({
        validator(rule, value) {
          if (getFieldValue("password") === value) {
            return Promise.resolve();
          }
          return Promise.reject("رمز عبور مطابقت ندارد");
        },
      }),
    ],
  },

  {
    id: uuidv4(),
    type: "divider",
    label: "وضعیت ایـثارگری",
  },

  {
    id: uuidv4(),
    option: [
      { label: "نمی باشد", value: "none" },
      { label: "فرزند شهید", value: "child_of" },
      { label: "همسر شهید", value: "wife_of" },
      { label: "جانباز", value: "veteran" },
      { label: "رزمنده", value: "fighting" },
      { label: "آزاده", value: "noble" },
    ],
    type: "dropDownSelect",
    label: "ایثارگر",
    name: "isargar",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    option: [
      { label: "همکار", value: 1 },
      { label: "غیر همکار", value: 0 },
    ],
    type: "groupRadioButton",
    label: "شهید همکار",
    name: "shahid_was_colleague",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    label: "نام شهید",
    name: "shahid_name",
    rules: [
      {
        required: true,
      },
    ],
  },

  {
    id: uuidv4(),
    option: [
      { label: "1 درصد", value: "1" },
      { label: "2 درصد", value: "2" },
      { label: "3 درصد", value: "3" },
      { label: "4 درصد", value: "4" },
      { label: "5 درصد", value: "5" },
      { label: "6 درصد", value: "6" },
      { label: "7 درصد", value: "7" },
      { label: "8 درصد", value: "8" },
      { label: "9 درصد", value: "9" },
      { label: "10 درصد", value: "10" },
      { label: "11 درصد", value: "11" },
      { label: "12 درصد", value: "12" },
      { label: "13 درصد", value: "13" },
      { label: "14 درصد", value: "14" },
      { label: "15 درصد", value: "15" },
      { label: "16 درصد", value: "16" },
      { label: "17 درصد", value: "17" },
      { label: "18 درصد", value: "18" },
      { label: "19 درصد", value: "19" },
      { label: "20 درصد", value: "20" },
      { label: "21 درصد", value: "21" },
      { label: "22 درصد", value: "22" },
      { label: "23 درصد", value: "23" },
      { label: "24 درصد", value: "24" },
      { label: "25 درصد", value: "25" },
      { label: "26 درصد", value: "26" },
      { label: "27 درصد", value: "27" },
      { label: "28 درصد", value: "28" },
      { label: "29 درصد", value: "29" },
      { label: "30 درصد", value: "30" },
      { label: "31 درصد", value: "31" },
      { label: "32 درصد", value: "32" },
      { label: "33 درصد", value: "33" },
      { label: "34 درصد", value: "34" },
      { label: "35 درصد", value: "35" },
      { label: "36 درصد", value: "36" },
      { label: "37 درصد", value: "37" },
      { label: "38 درصد", value: "38" },
      { label: "39 درصد", value: "39" },
      { label: "40 درصد", value: "40" },
      { label: "41 درصد", value: "41" },
      { label: "42 درصد", value: "42" },
      { label: "43 درصد", value: "43" },
      { label: "44 درصد", value: "44" },
      { label: "45 درصد", value: "45" },
      { label: "46 درصد", value: "46" },
      { label: "47 درصد", value: "47" },
      { label: "48 درصد", value: "48" },
      { label: "49 درصد", value: "49" },
      { label: "50 درصد", value: "50" },
      { label: "51 درصد", value: "51" },
      { label: "52 درصد", value: "52" },
      { label: "53 درصد", value: "53" },
      { label: "54 درصد", value: "54" },
      { label: "55 درصد", value: "55" },
      { label: "56 درصد", value: "56" },
      { label: "57 درصد", value: "57" },
      { label: "58 درصد", value: "58" },
      { label: "59 درصد", value: "59" },
      { label: "60 درصد", value: "60" },
      { label: "61 درصد", value: "61" },
      { label: "62 درصد", value: "62" },
      { label: "63 درصد", value: "63" },
      { label: "64 درصد", value: "64" },
      { label: "65 درصد", value: "65" },
      { label: "66 درصد", value: "66" },
      { label: "67 درصد", value: "67" },
      { label: "68 درصد", value: "68" },
      { label: "69 درصد", value: "69" },
      { label: "70 درصد", value: "70" },
      { label: "71 درصد", value: "71" },
      { label: "72 درصد", value: "72" },
      { label: "73 درصد", value: "73" },
      { label: "74 درصد", value: "74" },
      { label: "75 درصد", value: "75" },
      { label: "76 درصد", value: "76" },
      { label: "77 درصد", value: "77" },
      { label: "78 درصد", value: "78" },
      { label: "78 درصد", value: "79" },
      { label: "80 درصد", value: "80" },
      { label: "81 درصد", value: "81" },
      { label: "82 درصد", value: "82" },
      { label: "83 درصد", value: "83" },
      { label: "84 درصد", value: "84" },
      { label: "85 درصد", value: "85" },
      { label: "86 درصد", value: "86" },
      { label: "87 درصد", value: "87" },
      { label: "88 درصد", value: "88" },
      { label: "89 درصد", value: "89" },
      { label: "90 درصد", value: "90" },
      { label: "91 درصد", value: "91" },
      { label: "92 درصد", value: "92" },
      { label: "93 درصد", value: "93" },
      { label: "94 درصد", value: "94" },
      { label: "95 درصد", value: "95" },
      { label: "96 درصد", value: "96" },
      { label: "97 درصد", value: "97" },
      { label: "98 درصد", value: "98" },
      { label: "99 درصد", value: "99" },
      { label: "100 درصد", value: "100" },
    ],
    type: "dropDownSelect",
    label: "درصد جانبازی",
    name: "veteran_percentage",
    rules: [
      {
        required: true,
      },
    ],
  },

  {
    id: uuidv4(),
    type: "customInput",
    name: "period_time_fighting",
  },
  {
    id: uuidv4(),
    type: "customInput",
    name: "period_time_noble",
  },
];

export const thirdTab = [];

export const fourthTab = [
  {
    id: uuidv4(),
    type: "text",
    normalize: (value, prevValue) =>
      insuranceNumberNormalizer(value, prevValue, 8),
    label: "شماره بیمه",
    name: "insurance_number",
    rules: [
      {
        len: 8,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    normalize: numberNormalize,
    label: "شماره پرسنلی فعال",
    name: "personnel_id",
  },
  {
    id: uuidv4(),
    option: [
      { label: "عملیاتی", value: "operational" },
      { label: "ستادی", value: "nonoperational" },
    ],
    type: "groupRadioButton",
    label: "نوع شغل",
    name: "job_type",
  },
  {
    id: uuidv4(),
    option: [
      { label: "فعال", value: "active" },
      { label: "غیر فعال", value: "inactive" },
    ],
    type: "groupRadioButton",
    label: "وضعیت شغل",
    name: "job_status",
  },
  {
    id: uuidv4(),
    type: "maskAndDatePicker",
    label: "زمان غیر فعالی",
    name: "expire_time",
    rules: [
      {
        required: true,
        message: "فیلد تاریخ اجباری است",
      },
      () => ({
        validator(rule, value) {
          if (!value || checkShamsi(value)) {
            return Promise.resolve();
          } else {
            return Promise.reject("فرمت تاریخ صحیح نیست");
          }
        },
      }),
    ],
  },
  {
    id: uuidv4(),
    option: [
      { label: "بازنشستگی", value: "retire" },
      { label: "ترک کار", value: "quit" },
      { label: "تعلیق", value: "redundant" },
      { label: "اخراج", value: "dismiss" },
      { label: "فوت", value: "dead" },
    ],
    type: "dropDownSelect",
    label: "علت غیر فعالی",
    name: "expire_reason",
  },
];

export const fifthTab = [
  {
    id: uuidv4(),
    type: "text",
    label: "شماره موبایل 1",
    name: "mobile1",
    normalize: mobile_numberNormalize,
    rules: [
      {
        len: 11,
      },
      ({ getFieldValue }) => ({
        validator(rule, value) {
          if (value && getFieldValue("mobile2") === value) {
            return Promise.reject("لطفا یک شماره موبایل جدید وارد نمایید");
          }
          return Promise.resolve();
        },
      }),
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    normalize: mobile_numberNormalize,
    label: "شماره موبایل 2",
    name: "mobile2",
    rules: [
      {
        len: 11,
      },
      ({ getFieldValue }) => ({
        validator(rule, value) {
          if (value && getFieldValue("mobile1") === value) {
            return Promise.reject("لطفا یک شماره موبایل جدید وارد نمایید");
          }
          return Promise.resolve();
        },
      }),
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    normalize: mobile_numberNormalize,
    label: "شماره تلفن",
    name: "phone",
    rules: [
      {
        len: 11,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    label: "آدرس ایمیل",
    name: "email",
    rules: [
      {
        type: "email",
      },
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    normalize: (value, prevValue) => countOfNumInp(value, prevValue, 10),
    label: "کد پستی",
    name: "postal_code",
    rules: [{ len: 10 }],
  },
  {
    id: uuidv4(),
    type: "textArea",
    label: "آدرس",
    name: "address",
  },
];

export const sixthTabTab = [
  {
    id: uuidv4(),
    type: "divider",
    label: "حساب اول",
  },
  {
    id: uuidv4(),
    type: "text",
    label: "شماره حساب ",
    name: "bank_account1",
    normalize: numberNormalize,
  },
  {
    id: uuidv4(),
    type: "text",
    label: "شماره شبا ",
    name: "sheba1",
  },
  {
    id: uuidv4(),
    option: bankList,
    type: "dropDownSelect",
    label: "نام بانک ",
    name: "bank_name1",
    showSearch: true,
  },
  {
    id: uuidv4(),
    type: "divider",
    label: " حساب دوم",
  },
  //two
  {
    id: uuidv4(),
    type: "text",
    label: "شماره حساب ",
    name: "bank_account2",
    normalize: numberNormalize,
  },
  {
    id: uuidv4(),
    type: "text",
    label: "شماره شبا ",
    name: "sheba2",
  },
  {
    id: uuidv4(),
    option: bankList,
    type: "dropDownSelect",
    label: "نام بانک ",
    name: "bank_name2",
  },
  //three
  {
    id: uuidv4(),
    type: "divider",
    label: " حساب سوم",
  },
  {
    id: uuidv4(),
    type: "text",
    label: "شماره حساب ",
    name: "bank_account3",
    normalize: numberNormalize,
  },
  {
    id: uuidv4(),
    type: "text",
    label: "شماره شبا ",
    name: "sheba3",
  },
  {
    id: uuidv4(),
    option: bankList,
    type: "dropDownSelect",
    label: "نام بانک ",
    name: "bank_name3",
  },
  //four
  {
    id: uuidv4(),
    type: "divider",
    label: " حساب چهارم",
  },
  {
    id: uuidv4(),
    type: "text",
    label: "شماره حساب ",
    name: "bank_account4",
    normalize: numberNormalize,
  },
  {
    id: uuidv4(),
    type: "text",
    label: "شماره شبا ",
    name: "sheba4",
  },
  {
    id: uuidv4(),
    option: bankList,
    type: "dropDownSelect",
    label: "نام بانک ",
    name: "bank_name4",
  },
  //five
  {
    id: uuidv4(),
    type: "divider",
    label: " حساب پنجم",
  },
  {
    id: uuidv4(),
    type: "text",
    label: "شماره حساب ",
    name: "bank_account5",
    normalize: numberNormalize,
  },
  {
    id: uuidv4(),
    type: "text",
    label: "شماره شبا ",
    name: "sheba5",
  },
  {
    id: uuidv4(),
    option: bankList,
    type: "dropDownSelect",
    label: "نام بانک ",
    name: "bank_name5",
  },
];

export const seventhTab = [
  // {
  //   id: uuidv4(),
  //   type: "formList",
  //   name: "sons",
  //   inputs: [
  //     {
  //       id: uuidv4(),
  //       type: "textV2",
  //       label: "کدملی",
  //       name: "codeMeli",
  //     },
  //   ],
  // },

  {
    id: uuidv4(),
    type: "divider",
    label: "پدر",
  },
  {
    id: uuidv4(),
    type: "number",
    label: "کد ملی ",
    name: "national_father_num",
    rules: [
      {
        len: 10,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    label: "نام",
    name: "name",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    label: "نام خانوادگی",
    name: "last_name",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    label: "نام پدر",
    name: "grandFather",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "datePicker",
    label: "تاریخ تولد",
    name: "date_birthday",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "number",
    label: "شماره شناسنامه",
    name: "nation_num",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    label: "محل صدور",
    name: "place_birth",
    rules: [
      {
        required: true,
      },
    ],
  },
  // Divider
  {
    id: uuidv4(),
    type: "divider",
    label: "مادر",
  },
  {
    id: uuidv4(),
    type: "number",
    label: "کد ملی ",
    name: "national_father_num",
    rules: [
      {
        len: 10,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    label: "نام",
    name: "name",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    label: "نام خانوادگی",
    name: "last_name",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    label: "نام پدر",
    name: "grandFather",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "datePicker",
    label: "تاریخ تولد",
    name: "date_birthday",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "number",
    label: "شماره شناسنامه",
    name: "nation_num",
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "text",
    label: "محل صدور",
    name: "place_birth",
    rules: [
      {
        required: true,
      },
    ],
  },
];

export const eightTab = [
  {
    id: uuidv4(),
    multiple: false,
    showUploadList: {
      showDownloadIcon: false,
    },
    type: "upload",
    label: "اسکن شناسنامه",
    name: "birth_certificate",
    valuePropName: "fileList",
    rules: [imageValidation],
    getValueFromEvent: normFile,
    inputProps: {
      beforeUpload: beforeUpload,
      accept: ".jpg",
      btnText: "انتخاب فایل",
    },
  },
  {
    id: uuidv4(),
    type: "upload",
    label: "اسکن روی کارت ملی",
    name: "national_card_front",
    rules: [imageValidation],
    valuePropName: "fileList",
    getValueFromEvent: normFile,
    inputProps: {
      beforeUpload: beforeUpload,
      accept: ".jpg",
      btnText: "انتخاب فایل",
    },
  },
  {
    id: uuidv4(),
    type: "upload",
    label: "اسکن پشت کارت ملی",
    rules: [imageValidation],
    name: "national_card_rear",
    valuePropName: "fileList",
    getValueFromEvent: normFile,
    inputProps: {
      beforeUpload: beforeUpload,
      accept: ".jpg",
      btnText: "انتخاب فایل",
    },
  },
  {
    id: uuidv4(),
    type: "upload",
    label: "اسکن کارت پایان خدمت",
    name: "army_service_card",
    valuePropName: "fileList",
    rules: [imageValidation],
    getValueFromEvent: normFile,
    inputProps: {
      beforeUpload: beforeUpload,
      accept: ".jpg",
      btnText: "انتخاب فایل",
    },
  },
  {
    id: uuidv4(),
    type: "upload",
    label: "عکس پرسنلی",
    name: "person",
    rules: [imageValidation],
    valuePropName: "fileList",
    getValueFromEvent: normFile,
    inputProps: {
      beforeUpload: beforeUpload,
      accept: ".jpg",
      btnText: "انتخاب فایل",
    },
  },
  {
    id: uuidv4(),
    extra: "حداکثر حجم فایل 80Kb برای فایل های png",
    type: "upload",
    label: "امضا",
    rules: [pngValidation],
    name: "sign",
    valuePropName: "fileList",
    getValueFromEvent: normFile,
    inputProps: {
      beforeUpload: beforeUpload,
      accept: ".jpg,.png",
      btnText: "انتخاب فایل",
    },
  },
];
