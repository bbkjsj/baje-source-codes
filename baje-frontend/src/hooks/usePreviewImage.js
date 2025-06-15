import React, { useState } from "react";
import { getBase64Local } from "_helpers";
import { config } from "../constant";

const usePreviewImage = () => {
  const [imageUrl, setImageUrl] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const onPreview = (file) => {
    setModalVisible(true);
    if (file.hasOwnProperty("status") && file.status === "done") {
      setImageUrl(`${config.url.API_URL + file.url}`);
    } else {
      getBase64Local(file.originFileObj).then((base64) => {
        setImageUrl(base64);
      });
    }
  };

  const handleCancelModal = () => {
    setModalVisible(false);
  };

  return [
    imageUrl,
    onPreview,
    modalVisible,
    setModalVisible,
    handleCancelModal,
  ];
};

export default usePreviewImage;
