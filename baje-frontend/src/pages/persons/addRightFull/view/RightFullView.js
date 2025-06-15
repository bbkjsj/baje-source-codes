import React, { useState, useEffect } from "react";
import { Tabs, Row, Col, Button, Modal } from "antd";
import Styles from "../addRightFull.module.css";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import GoBackBtn from "./../../../../components/GoBackBtn";
import { getCompony } from "../common/_helpers";
import LogoLoading from "../../../../components/general/LoadingLogo";
import { loadImage } from "../../../../_helpers";
import ContentTop from "components/general/ContentTop";
import { config, pageNames } from "constant";

const { TabPane } = Tabs;

const StyledTitle = styled.p`
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
`;

const RowWithMargin = styled(Row)`
  margin-bottom: 19px;
  background-color: rgba(241, 242, 246, 0.3);
  padding: 5px;
  border-radius: 5px;
`;

const StyleLink = styled(Button)`
  padding: 0;
  border: none;
  height: auto;
`;

const faLabelFirstTab = {
  //type: "نوع",
  name: "نام",
  nationalId: "شناسه ملی",
  logoUrl: "لوگو",
  sealUrl: "مهر شرکت",
  registerNumber: "شماه ثبت",
  financeCode: "کد اقتصادی",
  registerDate: "تاریخ ثبت",
};

const faLabelSecondTab = {
  phone: "شماره تماس",
  postalCode: "کد پستی",
  email: "ایمیل",
  address: "آدرس",
  description: "توضیحات",
};

const EditRightFull = React.memo((props) => {
  const [managerData, setManagerData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const company_id = props.match.params.id;
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);

  const setManager = (data) => {
    setManagerData(data);
  };

  useEffect(() => {
    getCompony(company_id).then((data) => {
      setCompanyData(data);
      // if (data.manager) {
      //   setManager(data.manager);
      // }
    });
  }, []);

  const onPreview = (file) => {
    console.log(file, "!file");
    console.log(config.url.API_URL, "!base");
    const url = `${config.url.API_URL}/api/v1/baje/${file}`;
    setModalVisible(true);
    setImage(null);
    setImage(url);
    // loadImage(file).then((base64) => {
    //   console.log(file, "!file");
    //   setImage(base64);
    // });
  };

  if (!companyData) {
    return <LogoLoading />;
  }

  let infoFirstTab = [];
  let fullData = { ...companyData, ...managerData };
  for (const property in fullData) {
    if (faLabelFirstTab.hasOwnProperty(property)) {
      let renderDataFiled;

      if (
        property == "logoUrl" ||
        property == "signUrl" ||
        property == "sealUrl"
      ) {
        if (fullData[property]) {
          renderDataFiled = (
            <StyleLink
              type="link"
              onClick={() => onPreview(fullData[property])}
            >
              مشاهده
            </StyleLink>
          );
        }
      } else {
        if (property === "first_name") {
          renderDataFiled = (
            <p>{`${fullData[property]} ${fullData["last_name"]}`}</p>
          );
        } else {
          renderDataFiled = <p>{fullData[property]}</p>;
        }
      }

      infoFirstTab.push(
        <Col xs={24} sm={24} md={24} lg={12} xl={8} key={property}>
          <RowWithMargin gutter={10}>
            <Col>
              <StyledTitle>{faLabelFirstTab[property]} :</StyledTitle>
            </Col>
            <Col>{renderDataFiled}</Col>
          </RowWithMargin>
        </Col>
      );
    }
  }

  let infoSecondTab = [];
  for (const property in companyData) {
    if (faLabelSecondTab.hasOwnProperty(property)) {
      infoSecondTab.push(
        <Col xs={24} sm={24} md={24} lg={12} xl={8} key={property}>
          <RowWithMargin gutter={10}>
            <Col>
              <StyledTitle>{faLabelSecondTab[property]} :</StyledTitle>
            </Col>
            <Col>
              <p>{companyData[property]}</p>
            </Col>
          </RowWithMargin>
        </Col>
      );
    }
  }

  return (
    <>
      <Modal
        visible={modalVisible}
        title="اسکن"
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        {image && <img alt="scan" style={{ width: "100%" }} src={image} />}
      </Modal>
      <GoBackBtn />

      <ContentTop
        title="فرد حقوقی"
        breadcrumbItems={[
          { text: "حقوقی", link: pageNames.personnel.rightFull.list },
          { text: "جزییات" },
        ]}
      />

      <div>
        <Tabs type="card">
          <TabPane tab="اطلاعات اولیه" key="1" className={Styles.tab}>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>{infoFirstTab}</Row>
          </TabPane>

          {/* ///second tab            */}

          <TabPane tab="اطلاعات تماس" key="2" className={Styles.tab}>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              {infoSecondTab}
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </>
  );
});

export default withRouter(EditRightFull);
