import React from "react";
// import { Image, View } from "@react-pdf/renderer";
import { Row, IText } from "./componnets";
import moment from "moment-jalaali";

// Placeholder for @react-pdf/renderer Image component
const Image = ({ src, style }) => <img src={src} style={style} alt="PDF "/>;
const View = ({style, children}) => <div style={style}>{children}</div>;


const Header = ({ audit }) => {
  return (
    <Row mX={10} justify="space-between" align="flex-end">
      <View style={{ alignItems: "center", width: 80 }}>
        <Row>
          <IText size={10} mX={5} semibold>
            {audit.id}
          </IText>
          <IText size={10}>:</IText>
          <IText size={10}>شماره</IText>
        </Row>
        <Row align="center">
          <IText mX={5} semibold size={8}>
            {moment(audit.date).format("jYYYY/jMM/jDD")}
          </IText>
          <IText size={10}>:</IText>
          <IText size={10}>تاریخ بازرسی</IText>
        </Row>
      </View>
      <View style={{ alignItems: "center" }}>
        <IText bold size={22}>
          هلدینگ جهاد نصر
        </IText>
        <IText bold size={22}>
          گزارش بازرسی
        </IText>
      </View>
      <View style={{ width: 80, alignItems: "center" }}>
        <Image
          src={require("./../../../../../assets/img/logo.png")} // require might need adjustment for web
          style={{ width: 70, height: 70 }}
        />
        {/* <IText size={6}>شرکت کاوشگران نصر بافق</IText> */}
      </View>
    </Row>
  );
};

export default Header;
