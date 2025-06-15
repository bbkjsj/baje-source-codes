import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";

const UploadDocuments = ({ subordinateForm, setSubordinateForm }) => {
  const uploadProps = {
    name: "file",
    multiple: false,
    accept: ".jpg, .jpeg, .png",
    listType: "picture-card",
    headers: {
      authorization: "authorization-text",
    },
    progress: {
      strokeColor: {
        "0%": "transparent",
        "100%": "transparent",
      },
      strokeWidth: 0,
    },
    beforeUpload: (file) => {
      const reader = new FileReader();
      let thumbUrl;

      reader.readAsDataURL(file);
      reader.onload = () => (thumbUrl = reader.result);

      setSubordinateForm({
        ...subordinateForm,
        files: [...subordinateForm.files, { originFileObj: file, thumbUrl }],
      });
      console.log(subordinateForm);
      return false;
    },
    onRemove: (file) => {
      setSubordinateForm((state) => {
        const index = state.files.indexOf(file);
        const newFileList = state.files.slice();
        newFileList.splice(index, 1);
        return {
          ...subordinateForm,
          files: newFileList,
        };
      });
    },
    // onChange: ({ fileList: newFileList }) => {
    //   console.log(newFileList);
    //   setSubordinateForm({ ...subordinateForm, files: newFileList });
    // },
    className: "mt-4",
    fileList: subordinateForm.files,
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  return (
    <>
      <div className="w-100 pt-3">
        <p className="text-14 text-mid-black">مدارک مورد نیاز جهت بارگذاری:</p>
        <p className="text-14 mt-1">
          1. تصویر <span className="text-danger">صفحه اول شناسنامه</span>
          <br />
          2. تصویر <span className="text-danger">صفحه توضیحات</span> در صورت
          وجود توضیحات
          <br />
          3. تصویر <span className="text-danger">صفحه اطلاعات همسر</span> در
          صورتی که فرد تبعی اضافه شده همسر شما باشد
          <br />
        </p>
        <ImgCrop rotate quality={1} modalTitle="ویرایش تصویر" aspect={4 / 3}>
          <Upload {...uploadProps} onPreview={onPreview}>
            افزودن فایل +
          </Upload>
        </ImgCrop>
      </div>
    </>
  );
};

// css
// const StyledUploads = styled.section`
//   padding-top: 30px;
//   p {
//     line-height: 26px;
//   }
//   .camera-toggle {
//     background: rgba(125, 175, 221, 0.1);
//     padding: 12px 70px;
//     border: 1px dashed #2f75b5;
//     box-sizing: border-box;
//     border-radius: 4px;
//     img {
//       width: 43px;
//       height: 43px;
//       object-fit: contain;
//       transform: translateY(3px);
//     }
//     .image-upload {
//       visibility: hidden;
//       width: 0;
//       height: 0;
//     }
//   }
// `;
export default UploadDocuments;
