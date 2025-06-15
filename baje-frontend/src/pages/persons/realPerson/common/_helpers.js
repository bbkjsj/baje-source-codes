import axios from "api/appAxios";
import moment from "moment-jalaali";
import ListOfCity from "json/ListofCity";

export const getAccessRolesFromServer = () => {
  return new Promise((resole, reject) => {
    axios
      .get("/api/admin/personnel/permissions")
      .then((res) => {
        console.log("res in permitiomn", res.data);
        resole(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getOfficesList = () => {
  return new Promise((resole, reject) => {
    axios
      .get("/api/admin/personnel/legal/list")
      .then((res) => {
        resole(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const checkListOfPermissionHasCurrentOfficeObj = (list, current) => {
  return new Promise((resole, reject) => {
    let index = list.findIndex((value) => value.selectContract === current);
    if (index !== -1) resole(list[index]);
    else reject(false);
  });
};

// convert list of permission for send to server
// must be like this [{ company_id: 13, ["person/add", "person/delete"]}
export const covertListOfPermission = (list) => {
  console.log("ieowjfwe", list);
  let newList = [];
  for (let i = 0; i < list.length; i++) {
    let newObj = {};
    newObj.company_id = list[i].selectOffice;
    newObj.contract_id = list[i].selectContract;

    const element = [];
    for (const key in list[i]) {
      if (key !== "selectContract" && key !== "selectOffice" && list[i][key]) {
        element.push(list[i][key]);
      }
    }

    newObj.permissions = element.flat(1);
    newList.push(newObj);
  }

  return newList;
};

export const convertListOfOffice = (list) => {
  if (list) {
    let newList = [];
    for (let i = 0; i < list.length; i++) {
      let newObj = {};
      newObj.label = list[i]["name"];
      newObj.value = list[i]["id"];
      newList.push(newObj);
    }
    return newList;
  }
};

export const checkCode = (form, setLoading, getError, setStatus) => {
  let error = form.getFieldError("job_title_id");
  let code = form.getFieldValue("job_title_id");
  if (error.length == 0 && code) {
    setLoading(true);
    axios
      .get(`/api/jobtitle/${code}`)
      .then((res) => {
        setLoading(false);
        setStatus("edit");
        form.setFieldsValue({
          job_title_name: `${res.data.title}`,
          job_title_id: `${res.data.id}`,
        });
      })
      .catch((error) => {
        setLoading(false);
        getError(error?.response?.data);
        form.setFieldsValue({
          job_title_name: ``,
        });
      });
  }
};

export const convertDateToEN = (time) => {
  //1365/98/74
  let momentTime = moment(time, "jYYYY/jM/jD");
  return momentTime.format("YYYY/M/D");
};

export const covetFormatDateToEn = (time) => {
  console.log("time in convetr date to en", time);

  let momentTime = moment(
    `${time.year}/${time.month}/${time.day}`,
    "jYYYY/jM/jD"
  );
  return momentTime.format("YYYY/M/D");
};

// export const convertTimeToTimeStamp = (list) => {
//   for (const key in list) {
//     if (list[key]) {
//       list[key].map((el) => {
//         el.birth_day = covetDateToTimeStamp(el.birth_day);
//         return el;
//       });
//     }
//   }

//   return list;
// };

//{ rel: 'mother' ,  first_name: '' , last_name: '' , national_number: '', birth_date: '' }
export const convertFamily = (list /*family obj */) => {
  let newArr = [];
  for (const key in list) {
    if (list[key]) {
      for (let i = 0; i < list[key].length; i++) {
        let newObj = {};
        newObj = {
          id: list[key][i]["id"] && list[key][i]["id"],
          rel: key,
          national_id: list[key][i]["national_id"],
          first_name: list[key][i]["name"],
          last_name: list[key][i]["last_name"],
          father_name: list[key][i]["father_name"],
          birth_day: convertDateToEN(list[key][i]["birth_day"]),
          national_number: list[key][i]["national_number"],
          birth_day_place: list[key][i]["birth_day_place"],
        };
        newArr.push(newObj);
      }
    }
  }
  return newArr;
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

// contract: ["contract/insert"]
// legal: ["legal/insert"]
// machinery: ["machinery/insert"]
// person: (2) ["person/delete", "person/insert"]
// selectOffice: 19

const convertAccess = (access) => {
  let newList = [];
  for (let i = 0; i < access.length; i++) {
    let newObj = {};
    newObj.selectOffice = access[i]["company_id"];
    newObj.selectContract = access[i]["contract_id"];
    for (let j = 0; j < access[i]["permissions"].length; j++) {
      let newAccess = access[i]["permissions"][j].split("/");
      let arr = [];
      if (newObj[newAccess[0]]) {
        arr = [...newObj[newAccess[0]]];
        arr.push(access[i]["permissions"][j]);
        newObj[newAccess[0]] = [...arr];
      } else {
        arr.push(access[i]["permissions"][j]);
        newObj[newAccess[0]] = [...arr];
      }
    }
    newList.push({ ...newObj });
  }

  console.log("ewigjeio", newList);
  return newList;
};

export const covetFormatDateToFAV2 = (time) => {
  let momentTime = moment(time, "YYYY/M/D");
  let momentTimeFa = momentTime.format("jYYYY/jMM/jDD");
  let year = parseInt(momentTime.format("jYYYY"));
  let month = parseInt(momentTime.format("jM"));
  let day = parseInt(momentTime.format("jD"));
  return momentTimeFa;
};

export const covetFormatDateToFA = (time) => {
  let momentTime = moment(time, "YYYY/M/D");
  let year = parseInt(momentTime.format("jYYYY"));
  let month = parseInt(momentTime.format("jM"));
  let day = parseInt(momentTime.format("jD"));
  return { year, month, day };
};

const convertFamilyFromServer = (family) => {
  let newObj = {};
  for (let i = 0; i < family.length; i++) {
    family[i]["birth_day"] = covetFormatDateToFAV2(family[i]["birth_day"]);

    if (newObj.hasOwnProperty(family[i]["relation"])) {
      let singleArr = newObj[family[i]["relation"]];
      singleArr.push(family[i]);
      newObj[family[i]["relation"]] = singleArr;
    } else {
      newObj[family[i]["relation"]] = [family[i]];
    }
  }
  return newObj;
};

export const getPersonData = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/v1/baje/personnel/${id}`)
      .then((res) => {
        let person = res.data;
        person.birth_date = covetFormatDateToFAV2(person.birth_date);
        person.sex = person.sex === "m" ? "male" : "female";
        // let subordinates;
        // if (
        //   res.data.subordinates &&
        //   res.data.subordinates !== "no access" &&
        //   res.data.subordinates.length > 0
        // ) {
        //   subordinates = convertFamilyFromServer(res.data.subordinates);
        // }
        if (person.job_disable_description) {
          person.expire_reason = person.job_disable_description;
        }
        if (person.job_disable_date) {
          person.expire_time = covetFormatDateToFAV2(person.job_disable_date);
        }
        resolve({
          person: person,
          //job: res.data.job,
          //subordinates,
          company: res.data.company,
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    axios
      .get("/api/admin" + url, { responseType: "arraybuffer" })
      .then((res) => {
        let data = new Uint8Array(res.data);
        let raw = String.fromCharCode.apply(null, data);
        let base64 = btoa(raw);
        let src = "data:image;base64," + base64;

        resolve(src);
      });
  });
};

export const getBase64Local = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const checkNationalNumber = (nationalNumber) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/admin/personnel/lookup/${nationalNumber}`)
      .then((res) => {
        reject();
      })
      .catch((err) => {
        resolve();
      });
  });
};

export const checkInsuranceNumber = (insuranceNumber) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/admin/personnel/lookup/insurance/${insuranceNumber}`)
      .then((res) => {
        reject();
      })
      .catch((err) => {
        resolve();
      });
  });
};

export const checkPhoneNumber = (phone) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/admin/personnel/lookup/mobile/${phone}`)
      .then((res) => {
        reject();
      })
      .catch((err) => {
        resolve();
      });
  });
};

export const setBirthPlace = (nationalNumber) => {
  let code = nationalNumber.slice(0, 3);
  if (ListOfCity.hasOwnProperty(code)) {
    return ListOfCity[code];
  } else {
    return "";
  }
  //   let full = {};
  //   for (let i = 0; i < ListOfCity.length; i++) {
  //     console.log(ListOfCity[i]);
  //     let key = ListOfCity[i]["code"];
  //     let value = ListOfCity[i]["city"];
  //     full[key] = value;
  //   }
  //   console.log("full full", JSON.stringify(full));
  // };
};

export const deleteRealPerson = (ids) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/api/admin/personnel/delete`, { data: { data: ids } })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        if (error.response) {
          reject(error.response);
        }
      });
  });
};

export const deleteSubordinate = (ids) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/api/admin/personnel/subordinate/delete`, { data: { ids: ids } })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        if (error.response) {
          reject(error.response);
        }
      });
  });
};

export const getContractList = (id, setContractList, error) => {
  axios
    .post("/api/admin/contract/list", { type: "main", id })
    .then((res) => {
      setContractList(convertListToOptionContract(res.data.list));
    })
    .catch((err) => {
      console.log(err);
      error();
    });
};

export const convertListToOptionContract = (list) => {
  let newList = [];
  if (list) {
    newList = list.map((el) => {
      return { ...el, value: el.id, label: el.subject, title: el.subject };
    });
  }

  return newList;
};
