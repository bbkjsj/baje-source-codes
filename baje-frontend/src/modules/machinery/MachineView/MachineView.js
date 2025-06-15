import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { Row, message, Button, Modal } from "antd";
import { showMachineHandler } from "../utils/index";
import GoBackBtn from "components/GoBackBtn";
import LoadingLogo from "components/general/LoadingLogo";
import { pageNames } from "constant";
import ContentTop from "components/general/ContentTop";
import Field from "components/Field";
import Value from "components/Value";
import styled from "styled-components";
import { config } from "constant";

const rowGutter = { xs: 8, sm: 16, md: 24, lg: 32 };
const StyleLink = styled(Button)`
  padding: 0;
  border: none;
  height: auto;
`;
const MachineView = (props) => {
  const machineID = props.match.params.id;
  const [loading, setLoading] = useState(true);
  const [machine, setMachine] = useState();
  const [propertyList, setPropertyList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState();

  const handleButtonClick = (url) => {
    setImage(url);
    setModalVisible(true);
  };
  const handleError = () => {
    message.error("مشکلی پیش آمده است");
  };

  useEffect(() => {
    showMachineHandler(
      setMachine,
      setPropertyList,
      handleError,
      machineID,
      setLoading
    );
  }, []);

  if (loading) {
    return <LoadingLogo />;
  }

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="ماشین آلات"
        breadcrumbItems={[
          {
            text: "ماشین آلات",
            link: pageNames.machinery.list,
          },
          { text: "جزییات" },
        ]}
      />

      <Row gutter={rowGutter}>
        {propertyList.map((el) => (
          <Field
            key={el.name}
            name={el.name}
            value={
              el.url && el.value ? (
                <StyleLink
                  type="link"
                  onClick={() => handleButtonClick(el.value)}
                >
                  مشاهده
                </StyleLink>
              ) : (
                <Value value={el.value} />
              )
            }
          />
        ))}
      </Row>
      <Modal
        visible={modalVisible}
        title="اسکن"
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        {image && (
          <img
            alt="scan"
            style={{ width: "100%" }}
            src={`${config.url.API_URL + "/api/v1/baje/" + image}`}
          />
        )}
      </Modal>
    </>
  );
};

export default withRouter(MachineView);
