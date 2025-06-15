import axios from "api/appAxios";
import { covetFormatDateToFA, loadImage, timeToFa } from "../../../../_helpers";
import noImage from "../../../../assets/icons/noImage.svg";

export const getCompony = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/v1/baje/company/${id}`)
      .then((res) => {
        let data = { ...res.data };
        data.registerDate = timeToFa(data.registerDate, false);

        resolve(data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  });
};

export const convertUrlToBase64 = async (list) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i]["logoUrl"]) {
      list[i]["logoUrl"] = await loadImage(list[i]["logoUrl"]);
    } else {
      list[i]["logoUrl"] = noImage;
    }
  }

  return list;
};

export const check_nationalID = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/admin/personnel/legal/check/nationalid/${id}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const check_finance_code = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/admin/personnel/legal/check/financecode/${id}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const finance_code_validation = (mode = "add") => ({
  validator(rule, value) {
    return new Promise((resolve, reject) => {
      if (value && value.length == 12 && mode === "add") {
        check_finance_code(value)
          .then((res) => {
            resolve();
          })
          .catch(() => {
            reject("کد اقتصادی تکراری است");
          });
      } else {
        resolve();
      }
    });
  },
});

export const finance_code_validation_edit = (value) =>
  new Promise((resolve, reject) => {
    if (value && value.length === 12) {
      check_finance_code(value)
        .then((res) => {
          console.info("success");
          resolve();
        })
        .catch(() => {
          reject("کد اقتصادی تکراری است");
        });
    } else {
      resolve();
    }
  });

export const national_ID_validation_edit = (value) =>
  new Promise((resolve, reject) => {
    if (value && value.length == 11) {
      check_nationalID(value)
        .then((res) => {
          resolve();
        })
        .catch(() => {
          reject("شناسه ملی تکراری است ");
        });
    } else {
      resolve();
    }
  });

export const national_ID_validation = (mode = "add") => ({
  validator(rule, value) {
    return new Promise((resolve, reject) => {
      if (value && value.length == 11 && mode === "add") {
        check_nationalID(value)
          .then((res) => {
            resolve();
          })
          .catch(() => {
            reject("شناسه ملی تکراری است ");
          });
      } else {
        resolve();
      }
    });
  },
});

export const deleteRightFull = (ids, setLoading) => {
  return new Promise((resolve, reject) => {
    setLoading(true);
    axios
      .delete(`/api/v1/baje/company`, { data: { ids: ids } })
      .then((res) => {
        resolve();
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          reject(error.response);
        }
      });
  });
};

// export const handleCheckOfficeNationalID = (form, setLoading) => {
//   let national_id = form.getFieldValue("national_id");
//   let national_id_error = form.getFieldError("national_id");

//   if (national_id_error.length === 0 && national_id) {
//     setLoading(true);
//     check_nationalID(national_id)
//       .then((res) => {
//         setLoading(false);
//       })
//       .catch((error) => {
//         if (error.response) {
//           if (error.response.status === 403) {
//             form.setFields([
//               {
//                 name: "national_id",
//                 errors: ["شناسه ملی تکراری است"],
//               },
//             ]);
//             setLoading(false);
//           }
//         }
//       });
//   }
// };

// export const handleCheckFinanceCode = (form, setLoading) => {
//   let finance_code = form.getFieldValue("finance_code");
//   let finance_code_error = form.getFieldError("finance_code");

//   if (finance_code_error.length === 0 && finance_code) {
//     setLoading(true);
//     check_finance_code(finance_code)
//       .then((res) => {
//         setLoading(false);
//       })
//       .catch((error) => {
//         if (error.response) {
//           if (error.response.status === 403) {
//             setLoading(false);
//           }
//         }
//       });
//   }
// };
