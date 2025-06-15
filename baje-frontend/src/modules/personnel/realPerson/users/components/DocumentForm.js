import React, { useState, useEffect } from "react";
import { Form, Modal, Row } from "antd";
import SubmitBtn from "components/general/SubmitBtn";
import * as FormItems from "./formItems";
import { config, formItemLayout, formRowGutter } from "constant";
import {
  birthCertificateValidation,
  compressImage,
  imageValidation,
  pngValidation,
} from "_helpers";
import { getUser } from "../utils/index";
import LoadingLogo from "components/general/LoadingLogo";
import { UPDATE_USER_DOCUMENT } from "../utils/api";
import { showMessage } from "utils/message";
import AppButton from "components/general/AppButton";
//
export default function DocumentForm({ ID, onDone, onCancel }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [formValues, setformValues] = useState({});
  //

  useEffect(() => {
    setLoading(true);
    getUser(ID)
      .then((data) => {
        setformValues({
          birth_certificate: data.birth_certificate_url,
          national_card_front: data.national_card_front_url,
          national_card_rear_url: data.national_card_rear_url,
          person_img: data.image_url,
          army_service_card: data.army_service_card_url,
          sign: data.sign_url,
          latest_educational_document: data.latest_educational_document_url,
        });
        form.setFieldsValue(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [ID]);
  const submitForm = async (values) => {
    if (Object.values(values).every((i) => !i)) {
      Modal.error({
        content:
          "هیچ سند جدیدی انتخاب نشده است، لطفاً برای ثبت، سند جدید انتخاب نمایید.",
      });
      return;
    }

    try {
      // console.log(values);
      // for (let key in values) {
      //   if (values[key]?.[0]?.originFileObj) {
      //     const blob = await compressImage(values[key]?.[0]?.originFileObj);
      //     if (blob) {
      //       values[key] = new File([blob], key);
      //     }
      //   }
      // }
      // console.log(values);
      setBtnLoading(true);
      const formData = new FormData();

      for (const key in values) {
        if (Object.hasOwnProperty.call(values, key)) {
          const element = values[key]
            ? values[key]?.[0]?.originFileObj
            : values[key];

          formData.append(key, element ? element : null);
        }
      }

      const res = await UPDATE_USER_DOCUMENT(ID, formData);
      setBtnLoading(false);
      showMessage("ثبت با موفقیت انجام شد", "success");
      if (onDone) {
        onDone();
      }
    } catch (error) {
      console.error(error);
      setBtnLoading(false);
    }
  };
  //
  if (loading) {
    return <LoadingLogo />;
  }
  return (
    <Form form={form} onFinish={submitForm} {...formItemLayout}>
      <Row gutter={formRowGutter}>
        <FormItems.ImageUploader
          name="birth_certificate"
          label="اسکن شناسنامه"
          rules={[imageValidation]}
          accept=".jpg , .zip , .rar"
          defaultFileList={
            formValues["birth_certificate"]
              ? [
                  {
                    name: "image",
                    url: `${
                      config.url.API_URL +
                      "/api/v1/baje" +
                      formValues["birth_certificate"]
                    }`,
                  },
                ]
              : []
          }
        />
        <FormItems.ImageUploader
          name="national_card_front"
          label="اسکن روی کارت ملی"
          rules={[imageValidation]}
          accept=".jpg"
          defaultFileList={
            formValues["national_card_front"]
              ? [
                  {
                    name: "image",
                    url: `${
                      config.url.API_URL +
                      "/api/v1/baje" +
                      formValues["national_card_front"]
                    }`,
                  },
                ]
              : []
          }
        />
        <FormItems.ImageUploader
          name="national_card_rear"
          label="اسکن پشت کارت ملی"
          rules={[imageValidation]}
          accept=".jpg"
          defaultFileList={
            formValues["national_card_rear"]
              ? [
                  {
                    name: "image",
                    url: `${
                      config.url.API_URL +
                      "/api/v1/baje" +
                      formValues["national_card_rear"]
                    }`,
                  },
                ]
              : []
          }
        />
        <FormItems.ImageUploader
          name="person_img"
          label="عکس پرسنلی"
          rules={[imageValidation]}
          accept=".jpg"
          defaultFileList={
            formValues["person_img"]
              ? [
                  {
                    name: "image",
                    url: `${
                      config.url.API_URL +
                      "/api/v1/baje" +
                      formValues["person_img"]
                    }`,
                  },
                ]
              : []
          }
        />
        <FormItems.ImageUploader
          name="army_service_card"
          label="اسکن کارت پایان خدمت"
          rules={[imageValidation]}
          accept=".jpg"
          defaultFileList={
            formValues["army_service_card"]
              ? [
                  {
                    name: "image",
                    url: `${
                      config.url.API_URL +
                      "/api/v1/baje" +
                      formValues["army_service_card"]
                    }`,
                  },
                ]
              : []
          }
        />
        <FormItems.ImageUploader
          name="sign"
          label="امضا"
          rules={[imageValidation]}
          accept=".jpg,.png"
          defaultFileList={
            formValues["sign"]
              ? [
                  {
                    name: "image",
                    url: `${
                      config.url.API_URL + "/api/v1/baje" + formValues["sign"]
                    }`,
                  },
                ]
              : []
          }
        />
        <FormItems.ImageUploader
          name="latest_educational_document"
          label="آخرین مدرک تحصیلی"
          rules={[imageValidation]}
          accept=".jpg"
          defaultFileList={
            formValues["latest_educational_document"]
              ? [
                  {
                    name: "image",
                    url: `${
                      config.url.API_URL +
                      "/api/v1/baje" +
                      formValues["latest_educational_document"]
                    }`,
                  },
                ]
              : []
          }
        />
      </Row>
      <div className="flex mt-4 justify-end">
        <AppButton
          className="big-btn ml-1"
          size="large"
          variant="text"
          onClick={onCancel}
        >
          انصراف
        </AppButton>
        <AppButton
          className="big-btn"
          variant="primary"
          size="large"
          htmlType="submit"
        >
          تایید
        </AppButton>
      </div>
    </Form>
  );
}

// export default function DocumentForm({ ID, onDone }) {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [btnLoading, setBtnLoading] = useState(false);
//   const [formValues, setformValues] = useState({});
//   //

//   useEffect(() => {
//     setLoading(true);
//     getUser(ID)
//       .then((data) => {
//         setformValues({
//           birth_certificate: data.birth_certificate_url,
//           national_card_front: data.national_card_front_url,
//           national_card_rear_url: data.national_card_rear_url,
//           person_img: data.image_url,
//           army_service_card: data.army_service_card_url,
//           sign: data.sign_url,
//           latest_educational_document: data.latest_educational_document_url,
//         });
//         form.setFieldsValue(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setLoading(false);
//       });
//   }, [ID]);
//   const submitForm = async (values) => {
//     console.log(values);
//     if (Object.values(values).every((i) => !i)) {
//       Modal.error({
//         content:
//           "هیچ سند جدیدی انتخاب نشده است، لطفاً برای ثبت، سند جدید انتخاب نمایید.",
//       });
//       return;
//     }

//     try {
//       setBtnLoading(true);
//       const formData = new FormData();

//       for (const key in values) {
//         if (Object.hasOwnProperty.call(values, key)) {
//           const element = values[key]
//             ? values[key][0].originFileObj
//             : values[key];

//           formData.append(key, element ? element : null);
//         }
//       }

//       const res = await UPDATE_USER_DOCUMENT(ID, formData);
//       setBtnLoading(false);
//       showMessage("ثبت با موفقیت انجام شد", "success");
//       if (onDone) {
//         onDone();
//       }
//     } catch (error) {
//       setBtnLoading(false);
//     }
//   };
//   //
//   if (loading) {
//     return <LoadingLogo />;
//   }
//   return (
//     <Form form={form} onFinish={submitForm} {...formItemLayout}>
//       <Row gutter={formRowGutter}>
//         <FormItems.ImageUploader
//           name="birth_certificate"
//           label="اسکن شناسنامه"
//           rules={[imageValidation]}
//           accept=".jpg , .zip , .rar"
//           aspect={12.5 / 8.5}
//           defaultFileList={
//             formValues["birth_certificate"]
//               ? [
//                   {
//                     name: "image",
//                     url: `${
//                       config.url.API_URL +
//                       "/api/v1/baje" +
//                       formValues["birth_certificate"]
//                     }`,
//                   },
//                 ]
//               : []
//           }
//         />
//         <FormItems.ImageUploader
//           name="national_card_front"
//           label="اسکن روی کارت ملی"
//           aspect={9 / 6}
//           rules={[imageValidation]}
//           accept=".jpg"
//           defaultFileList={
//             formValues["national_card_front"]
//               ? [
//                   {
//                     name: "image",
//                     url: `${
//                       config.url.API_URL +
//                       "/api/v1/baje" +
//                       formValues["national_card_front"]
//                     }`,
//                   },
//                 ]
//               : []
//           }
//         />
//         <FormItems.ImageUploader
//           name="national_card_rear"
//           label="اسکن پشت کارت ملی"
//           rules={[imageValidation]}
//           accept=".jpg"
//           aspect={9 / 6}
//           defaultFileList={
//             formValues["national_card_rear"]
//               ? [
//                   {
//                     name: "image",
//                     url: `${
//                       config.url.API_URL +
//                       "/api/v1/baje" +
//                       formValues["national_card_rear"]
//                     }`,
//                   },
//                 ]
//               : []
//           }
//         />
//         <FormItems.ImageUploader
//           name="person_img"
//           label="عکس پرسنلی"
//           aspect={3 / 4}
//           rules={[imageValidation]}
//           accept=".jpg"
//           defaultFileList={
//             formValues["person_img"]
//               ? [
//                   {
//                     name: "image",
//                     url: `${
//                       config.url.API_URL +
//                       "/api/v1/baje" +
//                       formValues["person_img"]
//                     }`,
//                   },
//                 ]
//               : []
//           }
//         />
//         <FormItems.ImageUploader
//           name="army_service_card"
//           label="اسکن کارت پایان خدمت"
//           rules={[imageValidation]}
//           aspect={9 / 6}
//           accept=".jpg"
//           defaultFileList={
//             formValues["army_service_card"]
//               ? [
//                   {
//                     name: "image",
//                     url: `${
//                       config.url.API_URL +
//                       "/api/v1/baje" +
//                       formValues["army_service_card"]
//                     }`,
//                   },
//                 ]
//               : []
//           }
//         />
//         <FormItems.ImageUploader
//           name="sign"
//           label="امضا"
//           rules={[imageValidation]}
//           accept=".jpg,.png"
//           defaultFileList={
//             formValues["sign"]
//               ? [
//                   {
//                     name: "image",
//                     url: `${
//                       config.url.API_URL + "/api/v1/baje" + formValues["sign"]
//                     }`,
//                   },
//                 ]
//               : []
//           }
//         />
//         <FormItems.ImageUploader
//           name="latest_educational_document"
//           label="آخرین مدرک تحصیلی"
//           aspect={30 / 22}
//           rules={[imageValidation]}
//           accept=".jpg"
//           defaultFileList={
//             formValues["latest_educational_document"]
//               ? [
//                   {
//                     name: "image",
//                     url: `${
//                       config.url.API_URL +
//                       "/api/v1/baje" +
//                       formValues["latest_educational_document"]
//                     }`,
//                   },
//                 ]
//               : []
//           }
//         />

//         <SubmitBtn loading={btnLoading} />
//       </Row>
//     </Form>
//   );
// }
