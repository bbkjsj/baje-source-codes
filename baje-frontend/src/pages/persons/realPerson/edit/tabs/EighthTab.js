import React, { useState, useRef, useEffect } from "react";
import { Row, Button, Modal } from "antd";
import { eightTab } from "../inputsList";
import { RenderInputs } from "../../../../../components/renderInput/RenderInputs";
import FormItem from "../../../../../components/renderInput/formItem/FormItem";
import { getBase64Local } from "../../common/_helpers";
import { config } from "../../../../../constant";

const EighthTab = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState();
  const [loadedImage, setLoadedImage] = useState();

  const onPreview = (file) => {
    setModalVisible(true);
    if (file.hasOwnProperty("status") && file.status === "done") {
      setImage(`${config.url.API_URL + file.url}`);
    } else {
      getBase64Local(file.originFileObj).then((base64) => {
        setImage(base64);
      });
    }
  };

  const loadImage = () => {
    setLoadedImage(image);
  };

  return (
    <>
      <Modal
        visible={modalVisible}
        title="اسکن"
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        <div
          style={{
            display: loadedImage && loadedImage === image ? "block" : "none",
          }}
        >
          <img
            alt="scan"
            style={{ width: "100%" }}
            src={image}
            onLoad={loadImage}
          />
        </div>
      </Modal>

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <RenderInputs
          inputsFiled={eightTab}
          additionalData={{
            birth_certificate: {
              onPreview: (file) => {
                setImage(null);
                onPreview(file);
              },
            },
            national_card_front: {
              onPreview: (file) => {
                setImage(null);
                onPreview(file);
              },
            },
            national_card_rear: {
              onPreview: (file) => {
                setImage(null);
                onPreview(file);
              },
            },
            army_service_card: {
              onPreview: (file) => {
                setImage(null);
                onPreview(file);
              },
            },
            person: {
              onPreview: (file) => {
                setImage(null);
                onPreview(file);
              },
            },
            sign: {
              onPreview: (file) => {
                setImage(null);
                onPreview(file);
              },
            },
          }}
        />
      </Row>
    </>
  );
};

export default EighthTab;
