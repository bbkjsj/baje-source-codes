import React, { useState } from "react";
import Field from "../Field";
import styled from "styled-components";
import { Button, Modal } from "antd";
import Value from "./Value";
import { config } from "constant";

const faLabel = {
  sign_url: "اسکن امضا",
  birth_certificate_url: "شناسنامه",
  image_url: "عکس پرسنلی",
  army_service_card_url: "کارت پایان خدمت",
  national_card_front_url: "روی کارت ملی",
  national_card_rear_url: "پشت کارت ملی",
};

const StyleLink = styled(Button)`
  padding: 0;
  border: none;
  height: auto;
`;

const SixthTab = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState();
  const [loadedImage, setLoadedImage] = useState();

  const handleButtonClick = (url) => {
    setImage(url);
    setModalVisible(true);
  };

  const loadImage = () => {
    setLoadedImage(image);
  };

  const info = [];
  for (const property in props.data) {
    if (faLabel.hasOwnProperty(property)) {
      let renderDataFiled;
      renderDataFiled = props.data[property] ? (
        <StyleLink
          type="link"
          onClick={() =>
            handleButtonClick(
              config.url.API_URL + "/api/v1/baje" + props.data[property]
            )
          }
        >
          مشاهده
        </StyleLink>
      ) : (
        <Value />
      );
      info.push(<Field name={faLabel[property]} value={renderDataFiled} />);
    }
  }

  return (
    <>
      <Modal
        visible={modalVisible}
        title="مشاهده"
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        <div>
          <img
            alt="view"
            style={{ width: "100%" }}
            src={image}
            onLoad={loadImage}
          />
        </div>
      </Modal>
      {info}
    </>
  );
};

export default SixthTab;
