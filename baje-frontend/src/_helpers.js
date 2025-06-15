import moment from "moment-jalaali";
import axios from "./api/appAxios";
import { message, notification } from "antd";
import { utils } from "react-modern-calendar-datepicker";
import { alphabetList } from "modules/machinery/MachineList/columns";
import { fromBlob } from "image-resize-compress";

export const compressImage = (
  blobFile,
  fileFormat = "jpeg",
  fileQuality = 70
) => {
  // quality value for webp and jpeg formats.
  const quality = fileQuality;
  // output width. 0 will keep its original width and 'auto' will calculate its scale from height.
  const width = 0;
  // output height. 0 will keep its original height and 'auto' will calculate its scale from width.
  const height = 0;
  // file format: png, jpeg, bmp, gif, webp. If null, original format will be used.
  const format = fileFormat;

  // note only the blobFile argument is required
  return fromBlob(blobFile, quality, width, height, format);
};

export const covetFormatDateToEn = (time) => {
  let momentTime = moment(
    `${time.year}/${time.month}/${time.day}`,
    "jYYYY/jM/jD"
  );
  return momentTime.format("YYYY/M/D");
};

export const convertDateToEN = (time) => {
  if (!time) {
    return null;
  }
  //1365/98/74
  let momentTime = moment(time, "jYYYY/jM/jD");
  return momentTime.format("YYYY/M/D");
};

export const convertDateToENProper = (time) => {
  if (!time) {
    return null;
  }
  //1365/98/74
  let momentTime = moment(time, "jYYYY/jM/jD");
  return momentTime.format("YYYY/MM/DD");
};

export const convertDateToISO8601 = (time, config) => {
  if (!time) {
    return null;
  }
  let momentTime = moment(time, "jYYYY/jM/jD");
  return config?.hasTime
    ? momentTime.format("YYYY-MM-DDTHH:mm:ssZ")
    : momentTime.format("YYYY-MM-DD");
};

export const covetFormatDateToFA = (time) => {
  if (!time) {
    return null;
  }

  let momentTime = moment(time, "YYYY/M/D");
  let momentTimeFa = momentTime.format("jYYYY/jMM/jDD");
  let year = parseInt(momentTime.format("jYYYY"));
  let month = parseInt(momentTime.format("jM"));
  let day = parseInt(momentTime.format("jD"));

  return momentTimeFa;
};

export const dateToJalali = (date) => {
  return moment(date).format("jYYYY/jMM/jDD");
};

//Created By Sadeq
export const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const loadImage = (url) =>
  new Promise((resolve, reject) => {
    axios.get(url, { responseType: "arraybuffer" }).then((res) => {
      let data = new Uint8Array(res.data);
      let raw = String.fromCharCode.apply(null, data);
      let base64 = btoa(raw);
      let src = "data:image;base64," + base64;

      resolve(src);
    });
  });

export const getBase64Local = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const convertInputFile = (obj) => {
  // allFormData.army_service_card  = allFormData.army_service_card && allFormData.army_service_card[0]['originFileObj']
  for (const key in obj) {
    if (obj[key] && obj[key].length > 0) {
      obj[key] = obj[key][0]["originFileObj"];
    } else if (obj[key] && obj[key].length == 0) {
      obj[key] = undefined;
    }
  }
  return obj;
};

export const intNormalizer = (value, prevValue, count) => {
  let v = parseInt(value);
  if (value.length === 0) return null;
  if (!isNaN(v) && value.length <= count) {
    return v.toString();
  } else {
    return prevValue;
  }
};

export const insuranceNumberNormalizer = (value, prevValue, count) => {
  let v = parseInt(value);
  if (value.length === 0) return null;
  let strV = v.toString();
  if (!isNaN(v) && strV.length <= count) {
    return v.toString();
  } else {
    return prevValue === undefined ? null : prevValue;
  }
};

export const justSlashDashNumber = (value) => {
  let patt = /^[0-9/\d-?]+$/;
  let result = patt.test(value);
  if (!result) {
    return value.slice(0, -1);
  }
  return value;
};
export const justLetterAndNumber = (value, upperCase = false) => {
  let patt = /^[A-Za-z0-9\d]+$/;
  let result = patt.test(value);
  if (!result) {
    return value.slice(0, -1);
  }
  if (upperCase) {
    return String(value).toUpperCase();
  } else {
    return value;
  }
};

export const convertToNumber = (value) => {
  if (value) {
    let patt = /^[0-9\b]+$/;
    let result = patt.test(value);

    if (!result) {
      return value.slice(0, -1);
    }
  }

  return value;
};

export const countOfNumInp = (value, prevValue, count, goNextInput = null) => {
  let v = convertToNumber(value);
  if (v.length === count && goNextInput) {
    goNextInput();
  }

  if (v.length <= count) {
    return v;
  } else {
    return prevValue;
  }
};

// export const decimalNumberValidation = (value) => {
//   var ex = new RegExp(/\d+\.?\d*$/);
//   var pe = new RegExp(/\d+\.\d*\.$/);
//   var result = ex.test(value);
//   var ignore = pe.test(value);
//   if (ignore) {
//     return value.slice(0, -1);
//   }
//   if (!result) {
//     return value.slice(0, -1);
//   }
//   return value;
// };

export const priceNormalizer = (value) => {
  let v = value.replace(/\$\s?|(,*)/g, "");
  v = convertToNumber(v);
  v = v.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return v;
};

export const nation_idNormalize = (value, prevValue) => {
  let v = convertToNumber(value);
  if (v.length <= 10) {
    return v;
  } else {
    return prevValue;
  }
};

export const numberNormalize = (value) => {
  let v = convertToNumber(value);
  return v;
};

export const postal_code_normalize = (value, prevValue) => {
  let v = convertToNumber(value);
  if (v.length <= 10) {
    return v;
  } else {
    return prevValue;
  }
};

export const reward_type = (value, prevValue) => {
  let v = convertToNumber(value);
  if (v < 1001) {
    return v;
  } else {
    return prevValue;
  }
};

export const finance_code_normalize = (value, prevValue) => {
  let v = convertToNumber(value);
  if (v.length <= 12) {
    return v;
  } else {
    return prevValue;
  }
};

export const mobile_numberNormalize = (value, prevValue) => {
  let v = convertToNumber(value);
  if (v.length <= 11) {
    return v;
  } else {
    return prevValue;
  }
};

export const removingUnderLine = (value, prevValue) => {
  if (!value) {
    return;
  }
  let patt = /^[0-9\b]+$/;
  let result = patt.test(value);
  if (!result) {
    return value.slice(0, -1);
  }
  return value;
};

// for office
export const national_id_normalize = (value, prevValue) => {
  let v = convertToNumber(value);
  if (v.length <= 11) {
    return v;
  } else {
    return prevValue;
  }
};

export const checkShamsi = (str, checkBigger = true) => {
  let result = false;

  result = moment(str, "jYYYY/jMM/jDD").isValid();

  if (str.includes("_")) {
    result = false;
  }
  if (checkBigger && str > moment().format("jYYYY/jMM/jDD")) {
    result = false;
  }

  return result;
};

export const imageValidation = ({ maxSize = 1000000 }) => ({
  validator(rule, value) {
    if (!value || value.length === 0) {
      return Promise.resolve();
    } else if (
      value &&
      value.length > 0 &&
      value[0].hasOwnProperty("status") &&
      value[0].status == "done"
    ) {
      return Promise.resolve();
    }

    let file = value[0]["name"].split(".");
    let fileExtension = file[file.length - 1];
    let allowedExtensions = ["jpeg", "jpg", "png"];
    if (allowedExtensions.includes(fileExtension.toLowerCase())) {
      if (value[0].size > maxSize) {
        return Promise.reject(
          `حجم فایل بیشتر از ${maxSize / 1000000} مگابایت است !`
        );
      }
      return Promise.resolve();
    } else {
      return Promise.reject("فرمت فایل صحیح نمی باشد");
    }
  },
});

// Created By Sadeq
export const birthCertificateValidation = (maxSize = 1000000) => ({
  validator(rule, value) {
    if (!value || value.length === 0) {
      return Promise.resolve();
    } else if (
      value &&
      value.length > 0 &&
      value[0].hasOwnProperty("status") &&
      value[0].status == "done"
    ) {
      return Promise.resolve();
    }

    let file = value[0]["name"].split(".");
    let fileExtension = file[file.length - 1];
    let allowedExtensions = ["jpeg", "jpg"];
    let allowedExtensions2 = ["zip", "rar"];
    if (allowedExtensions.includes(fileExtension)) {
      if (value[0].size > maxSize) {
        return Promise.reject(
          `حجم فایل بیشتر از ${maxSize / 100000} مگابایت است !`
        );
      }
      return Promise.resolve();
    } else if (allowedExtensions2.includes(fileExtension)) {
      if (value[0].size > maxSize) {
        return Promise.reject(
          `حجم فایل بیشتر از ${maxSize / 1000000} مگابایت است !`
        );
      }
      return Promise.resolve();
    } else {
      return Promise.reject("فرمت فایل صحیح نمی باشد");
    }
  },
});

export const pngValidation = (maxSize = 1000000) => ({
  validator(rule, value) {
    if (!value || value.length === 0) {
      return Promise.resolve();
    } else if (
      value &&
      value.length > 0 &&
      value[0].hasOwnProperty("status") &&
      value[0].status == "done"
    ) {
      return Promise.resolve();
    }

    let file = value[0]["name"].split(".");
    let fileExtension = file[file.length - 1];
    let allowedExtensions = ["jpeg", "PNG", "jpg", "png"];
    if (allowedExtensions.includes(fileExtension.toLowerCase())) {
      if (fileExtension === "png") {
        if (value[0].size > maxSize) {
          return Promise.reject(
            `حجم فایل بیشتر از ${maxSize / 1000000} مگابایت است !`
          );
        }
      } else if (fileExtension === "jpeg" || fileExtension === "jpg") {
        if (value[0].size > maxSize) {
          return Promise.reject(
            `حجم فایل بیشتر از ${maxSize / 1000000} مگابایت است !`
          );
        }
      }
      return Promise.resolve();
    } else {
      return Promise.reject("فرمت فایل صحیح نمی باشد");
    }
  },
});

export const pictureValidation = (size) => ({
  validator(rule, value) {
    if (!value || value.length === 0) {
      return Promise.resolve();
    } else if (
      value &&
      value.length > 0 &&
      value[0].hasOwnProperty("status") &&
      value[0].status == "done"
    ) {
      return Promise.resolve();
    }

    let file = value[0]["name"].split(".");
    let fileExtension = file[file.length - 1].toLowerCase();
    let allowedExtensions = ["jpeg", "png", "jpg", "zip", "rar"];
    if (allowedExtensions.includes(fileExtension)) {
      if (fileExtension === "png") {
        if (value[0].size > size * 10000) {
          return Promise.reject(
            "حجم فایل بیشتر از " + size + " کیلو بایت است !"
          );
        }
      } else if (fileExtension === "jpeg" || fileExtension === "jpg") {
        if (value[0].size > size * 10000) {
          return Promise.reject(
            "حجم فایل بیشتر از " + size + " کیلو بایت است !"
          );
        }
      } else if (fileExtension === "zip" || fileExtension === "rar") {
        if (value[0].size > size * 10000) {
          return Promise.reject(
            "حجم فایل بیشتر از " + size + " کیلو بایت است !"
          );
        }
      }
      return Promise.resolve();
    } else {
      return Promise.reject("فرمت فایل صحیح نمی باشد");
    }
  },
});

// export excel file  with send export key(query)
const handleExportExcel = async (
  exportKey,
  successful,
  handleError,
  json = false,
  onStart
) => {
  const config = {
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/xls",
    },
  };
  if (onStart) {
    onStart();
  }
  try {
    const response = await axios.post(
      `/api/excel/create`,
      json || typeof exportKey === "object"
        ? { json: exportKey }
        : { hash: exportKey },
      config
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "file.xlsx");
    document.body.appendChild(link);
    link.click();
    successful();
  } catch (err) {
    handleError();
  }
};

export const downloadExcel = (url) => {
  axios.get(url, { responseType: "blob" }).then((response) => {
    let fileName = "report";
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      // IE variant
      window.navigator.msSaveOrOpenBlob(
        new Blob([response.data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        fileName
      );
      notification.success({
        message: "فایل اکسل با موفقیت دانلود شد",
      });
    } else {
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      notification.success({
        message: "فایل اکسل با موفقیت دانلود شد",
      });
    }
  });
};

export const downloadExcelFromRawData = (data, filename) => {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename ? filename + ".xlsx" : "file.xlsx");
  document.body.appendChild(link);
  link.click();
};

export function downloadBuffer(arrayBuffer, fileName) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([arrayBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
  );
  a.download = fileName;
  a.click();
}

export const handleClickExportExl = async (
  exportKey,
  json = false,
  onFinish = false
) => {
  const successful = () => {
    message.success("با موفقیت انجام شد");
    onFinish && onFinish(true);
  };
  const handleError = () => {
    message.error("مشکلی پیش آمده است دوباره تلاش کنید");
    onFinish && onFinish(false);
  };

  await handleExportExcel(exportKey, successful, handleError, json);
};

export const handleErrorMessage = (error) => {
  let message = null;
  if (error.response) {
    message = error?.response?.data;
  } else {
    message = "مشکلی پیش آمده است دوباره تلاش کنید.";
  }
  return message;
};

export const getTodayDate = () => {
  let { year, month, day } = utils("fa").getToday();
  const newMonth = month.toString().length < 2 ? `0${month}` : month;
  const newDay = day.toString().length < 2 ? `0${day}` : day;

  return `${year}/${newMonth}/${newDay}`;
};

export const convertTime = (time) => {
  let m = moment(time);
  return m.format("HH:mm");
};

//
export const timeToFa = (time, hour = true) => {
  if (!time) return;
  let m = moment(time);
  if (hour) {
    return m.format("HH:mm - jYYYY/jMM/jDD");
  } else {
    return m.format("jYYYY/jMM/jDD");
  }
};

export const timeToFaSeparate = (time) => {
  let m = moment(time);
  let newTime = {};
  newTime.time = m;
  newTime.date = m.format("jYYYY/jM/jD");

  return newTime;
};

export const convertStringToArr = (text) => {
  if (text && text !== null) {
    const arr = text.split(",");
    return arr;
  }
  return;
};

export const printContent = (recoverPage = true) => {
  let a = document.getElementsByClassName("print-area")[0];
  let parents = [];

  while (a) {
    parents.unshift(a);
    a = a.parentNode;
  }

  document.body.classList.add("show-print-area");
  parents.forEach(
    (item) => item.classList && item.classList.add("print-area-parents")
  );
  window.print();

  if (recoverPage) {
    parents.forEach(
      (item) => item.classList && item.classList.remove("print-area-parents")
    );
    document.body.classList.remove("show-print-area");
  }
};

export const getLink = (path, params) => {
  path = path.replace("?", "");

  if (params && typeof params === "object") {
    for (const [key, value] of Object.entries(params))
      path = path.replace(":" + key, value);
  } else if (params) path = path.replace(":id", params);
  else {
    path = path.split(":");

    if (path.length > 1) {
      path = path[0];
      path = path.substring(0, path.length - 1);
    } else path = path[0];
  }

  return path;
};

export const convertDataKeys = (keys, data, incoming = false, root = false) => {
  if (!data) return false;
  let output = Array.isArray(data) ? data : { ...data };

  if (root && keys[root]) keys = keys[root];

  for (const [local, remote] of Object.entries(keys)) {
    let from, to;

    if (typeof remote === "object") {
      if (remote.key) {
        from = incoming ? remote.key : local;
      } else from = to = local;

      output[to] = convertDataKeys(keys[from], data[from], incoming);
    } else {
      from = incoming ? remote : local;
      to = incoming ? local : remote;
      const items = Array.isArray(data) ? data : [data];

      items.forEach((item, index) => {
        delete Object.assign(items[index], { [to]: items[index][from] })[from];
      });

      output = Array.isArray(data) ? items : items[0];
    }
  }

  return output;
};

export const createFormData = (dataset) => {
  const formData = new FormData();

  Object.keys(dataset).forEach((key) => {
    let val = dataset[key];

    if (val !== undefined) {
      if (val?.file instanceof File) val = val.file;
      else if (Array.isArray(val) && val[0]?.originFileObj)
        val = val[0].originFileObj;
      else if (["object", "array"].includes(typeof val))
        val = JSON.stringify(val);
      else if (typeof val === "boolean") val = val ? 1 : 0;

      formData.append(key, val);
    }
  });

  return formData;
};

export const appendToFormData = (data) => {
  const formData = new FormData();
  for (const property in data) {
    if (data[property] || data[property] === 0) {
      formData.append(property, data[property]);
    }
  }
  return formData;
};

export function objectToFormData(
  obj,
  formData = new FormData(),
  parentKey = ""
) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const fullKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value instanceof File) {
        formData.append(fullKey, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const arrayKey = `${fullKey}[${index}]`;
          if (typeof item === "object") {
            objectToFormData(item, formData, arrayKey);
          } else {
            formData.append(arrayKey, item);
          }
        });
      } else if (typeof value === "object" && value !== null) {
        objectToFormData(value, formData, fullKey);
      } else {
        formData.append(fullKey, value);
      }
    }
  }

  return formData;
}

export const setOriginFileObj = (obj, keys) => {
  let newObj = { ...obj };
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (newObj[key] && newObj[key].length > 0) {
      newObj[key] = newObj[key][0]["originFileObj"];
    }
  }
  return newObj;
};

export const setFileInputValue = (name, value, faName = null) => {
  if (!value) {
    return null;
  }
  let newValue = [
    {
      uid: name,
      name: faName,
      status: "done",
      url: value,
    },
  ];
  return newValue;
};

export const getAsArray = (items) => {
  if (items === undefined || items === null) return [];

  return Array.isArray(items) ? items : [items];
};

export const getMonthDaysByMonth = (month) => {
  switch (parseFloat(month)) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      return 31;
    case 12:
      return 29;
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
      return 30;
  }
};

export const roundNumberTwoDecimals = (num) => {
  return Math.round((parseFloat(num) + Number.EPSILON) * 100) / 100;
};

export const notice = (content, color = "lightgreen", size = 18) => {
  console.log(
    "%c" + content,
    `font-size: ${size}px; color: ${color}; border: 1px solid yellow; padding: 12px 16px`
  );
};

export const daysToParts = (days, asArray = true) => {
  const year = days / 365;
  const month = (days % 365) / 30;
  const day = (days % 365) % 30;

  if (asArray) return [year, month, day];
  else {
    let output = [];
  }
};

export const convertToShamsi = (time) =>
  moment(time, "YYYY-M-D HH:mm:ss").format("jYYYY/jMM/jDD");

export const commaPriceToInt = (str) => {
  return parseFloat(str.split(",").join(""));
};

export const dateToInt = (str) => {
  //console.log("egfewoge", parseFloat(str.split("/").join("")), str);
  return parseFloat(str.split("/").join(""));
};

export const timeToInt = (str) => {
  return parseFloat(str.split(":").join(""));
};

export const calculateAge = (date) => {
  return moment().diff(date, "years");
};

export const randomBetween = (min, max) =>
  min + Math.floor(Math.random() * (max - min + 1));

export const subDomain = (url) => {
  url = url.replace(new RegExp(/^\s+/), ""); // START
  url = url.replace(new RegExp(/\s+$/), ""); // END

  url = url.replace(new RegExp(/\\/g), "/");

  url = url.replace(new RegExp(/^http\:\/\/|^https\:\/\/|^ftp\:\/\//i), "");

  url = url.replace(new RegExp(/^www\./i), "");

  url = url.replace(new RegExp(/\/(.*)/), "");

  if (url.match(new RegExp(/\.[a-z]{2,3}\.[a-z]{2}$/i))) {
    url = url.replace(new RegExp(/\.[a-z]{2,3}\.[a-z]{2}$/i), "");
  } else if (url.match(new RegExp(/\.[a-z]{2,4}$/i))) {
    url = url.replace(new RegExp(/\.[a-z]{2,4}$/i), "");
  }

  var subDomain = url.match(new RegExp(/\./g)) ? true : false;

  return subDomain;
};

//Created By Sadeq
export const decimalNumberValidation = (value) => {
  var ex = new RegExp(/\d+\.?\d*$/);
  var pe = new RegExp(/\d+\.\d*\.$/);
  var result = ex.test(value);
  var ignore = pe.test(value);
  if (ignore) {
    return value.slice(0, -1);
  }
  if (!result) {
    return value.slice(0, -1);
  }
  return value;
};

//Created By Sadeq

export const mobileNumberValidation = (value) => {
  // var a10 = new RegExp(/0$|^(0)[9]|^(0)[9][\d]{1}|^(0)[9][\d]{2}|^(0)[9][\d]{3}|^(0)[9][\d]{5}|^(0)[9][\d]{6}|^(0)[9][\d]{7}|^(0)[9][\d]{8}|^(0)[9][\d]{9}$/);
  var a10 = new RegExp(/^0$|^(09)[\d]{0,9}$/);
  var result = a10.test(value);
  if (!result) {
    return value.slice(0, -1);
  }
  return value;
};

//Created By Sadeq
export const nextFocusByEnterKey = (fromElement, toElement, formName = "") => {
  try {
    var fromEl = document.getElementById(fromElement);
    var toEl = document.getElementById(toElement);
    var form = document.getElementById(formName);
    fromEl.addEventListener("keypress", function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        if (toEl !== null) toEl.focus();
      }
    });
  } catch (e) {}
};

//Created By Sadeq
export const handleValidateNationalNumber = (code) => {
  if (code && code.length === 10) {
    const res = (code) => {
      var L = code.length;
      if (L < 8 || parseInt(code, 10) == 0) return false;
      code = ("0000" + code).substr(L + 4 - 10);
      if (parseInt(code.substr(3, 6), 10) == 0) return false;
      var c = parseInt(code.substr(9, 1), 10);
      var s = 0;
      for (var i = 0; i < 9; i++)
        s += parseInt(code.substr(i, 1), 10) * (10 - i);
      s = s % 11;
      return (s < 2 && c == s) || (s >= 2 && c == 11 - s);
      return true;
    };
    if (res(code)) return true;
    else return false;
  }
};

export const removeNullFromObject = (input) => {
  const output = {};

  Object.entries(input).map(([key, value]) => {
    if (value !== "null" && value !== null) output[key] = value;
  });

  return output;
};

export const findArrayIntersection = (array1, array2) =>
  array1.filter((value) => array2.includes(value));

export const toPersianDigits = (input) => {
  let id = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return input.replace(/[0-9]/g, function (w) {
    return id[+w];
  });
};

export const dateRangeOverlaps = (a_start, a_end, b_start, b_end) => {
  if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
  if (a_start <= b_end && b_end <= a_end) return true; // b ends in a
  if (b_start < a_start && a_end < b_end) return true; // a in b
  return false;
};

const getValidDate = (d) => {
  return new Date(d);
};

export const isDateBetween = (fromDate, toDate, givenDate) => {
  return (
    getValidDate(givenDate) <= getValidDate(toDate) &&
    getValidDate(givenDate) >= getValidDate(fromDate)
  );
};

export const getTimestamp = (input) => {
  let timestamp = input;

  if (typeof input === "object") timestamp = input.utc(true).unix();

  return Number(timestamp);
};

export const normalizeArabic = (input) => {
  if (typeof input !== "string") return input;

  const obj = {
    ك: "ک",
    دِ: "د",
    بِ: "ب",
    زِ: "ز",
    ذِ: "ذ",
    شِ: "ش",
    سِ: "س",
    ى: "ی",
    ي: "ی",
    "١": "۱",
    "٢": "۲",
    "٣": "۳",
    "٤": "۴",
    "٥": "۵",
    "٦": "۶",
    "٧": "۷",
    "٨": "۸",
    "٩": "۹",
    "٠": "۰",
  };

  Object.keys(obj).forEach(function (key) {
    input = input.replaceAll(key, obj[key]);
  });

  return input;
};

export const camelize = (s) => s.replace(/_./g, (x) => x[1].toUpperCase());

// used to check if the app is running in pwa mode
export const isInStandaloneMode = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone ||
  document.referrer.includes("android-app://");

// extract string from react jsx element object
export const jsxToString = (element) => {
  if (element?.props?.children) {
    if (typeof element.props.children === "string") {
      return element?.props?.children;
    } else if (Array.isArray(element.props.children)) {
      return element.props.children.join(" ").trim();
    }
  }
  return element?.props?.value || undefined;
};

export const getPlaqueString = (record) => {
  if (record.plaque1 != -1 && record.plaque1 != null) {
    return `${record.plaque3}-${record.plaque4}-${
      alphabetList.find((el) => el.value == record.plaque2)?.label
    }-${record.plaque1}`;
  } else {
    return "ثبت نشده است";
  }
};

// convert id to 5 digit code
export const convertIdToCode = (text) => {
  const count = 5 - text.toString().length;
  let code = "0".repeat(count) + text;
  return code;
};

export const currJalaliYear = () => moment(new Date()).jYear();

export const toCleanPersian = (word) => {
  if (!word) return "";

  return word
    .toString()
    .trim()
    .replace("ً", "")
    .replace("ُ", "")
    .replace("ٍ", "")
    .replace("ً", "")
    .replace(",", "")
    .replace("َ", "")
    .replace("ِ", "")
    .replace("ّ", "")
    .replace("ء", "")
    .replace("ْ", "")
    .replace("ٌ", "")
    .replace("إ", "ا")
    .replace("أ", "ا")
    .replace("ة", "ه")
    .replace(/ک/g, "ک")
    .replace(/ی/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/ي/g, "ی")
    .replace(/إ/g, "ا")
    .replace(/ة/g, "ه");
};

export function stringCommonLetters(str1, str2) {
  let count = 0;
  const obj = str2.split("");
  for (let str of str1) {
    let idx = obj.findIndex((s) => s === str);
    if (idx >= 0) {
      count++;
      obj.splice(idx, 1);
    }
  }
  return count;
}

const rootURL = "/api/v1/baje";

export function endpoint(url) {
  return rootURL + url;
}

export function convertDateFormat(dateTimeString) {
  const dateObj = new Date(dateTimeString);
  const year = dateObj.getFullYear();
  const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
  const date = ("0" + dateObj.getDate()).slice(-2);
  const hours = ("0" + dateObj.getHours()).slice(-2);
  const minutes = ("0" + dateObj.getMinutes()).slice(-2);
  const seconds = ("0" + dateObj.getSeconds()).slice(-2);
  const formattedDate = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
}

export const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  if (e.fileList.length > 1) {
    e.fileList.shift();
  }

  return e && e.fileList;
};

export function removeDuplicatesBasedOnKey(array, key) {
  const seen = new Map();
  const result = [];

  for (const item of array) {
    const keyValue = item[key];

    if (!seen.has(keyValue)) {
      seen.set(keyValue, true);
      result.push(item);
    }
  }

  return result;
}

export function compareDates(date1, date2) {
  if (!date1 || !date2) return false;
  // Parse the dates and convert them to milliseconds
  const parsedDate1 = Date.parse(date1.replace(/-/g, "/"));
  const parsedDate2 = Date.parse(date2.replace(/-/g, "/"));

  // Compare the dates and return true if date1 is less than date2, else false
  return parsedDate1 < parsedDate2;
}

export function isAgeDifferenceGreaterThanXYears(date1, date2, years) {
  // Parse the dates and calculate the difference in milliseconds
  const parsedDate1 = Date.parse(date1.replace(/-/g, "/"));
  const parsedDate2 = Date.parse(date2.replace(/-/g, "/"));
  const millisecondsPerYear = 31536000000; // Number of milliseconds in a year

  // Calculate the difference in years
  const yearDifference =
    Math.abs(parsedDate1 - parsedDate2) / millisecondsPerYear;

  // Check if the difference is greater than the specified number of years
  return yearDifference > years;
}
