import React from "react";
// import { StyleSheet, Image, View } from "@react-pdf/renderer";
import { IText, Row } from "./componnets";

// Placeholder for @react-pdf/renderer Image component
const Image = ({ src, style }) => <img src={src} style={style} alt="PDF "/>;
const View = ({style, children}) => <div style={style}>{children}</div>;


const Footer = ({ audit }) => {
  const { operator_first_name, operator_last_name } = audit;
  return (
    <>
      <Row style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            borderWidth: 0.9,
          }}
        >
          <IText style={{ textAlign: "right" }}>مدیر پروژه:</IText>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            borderWidth: 0.9,
          }}
        >
          <IText style={{ textAlign: "right" }}>تایید کننده:</IText>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            borderWidth: 0.9,
          }}
        >
          <IText style={{ textAlign: "right" }}>ممیزی کننده:</IText>
          <IText color="#d9d9d9" style={{ textAlign: "center" }}>
            {operator_first_name + " " + operator_last_name}
          </IText>
          <View />
        </View>
      </Row>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Row justify="space-between" align="flex-end" mX={10} mY={15}>
          <Image
            src={require("./../../../../../assets/img/logo.png")} // require might need adjustment for web
            style={{ width: 30, height: 30 }}
          />
          <View style={{ alignItems: "flex-end" }}>
            <Row>
              <IText size={10} bold>
                باجه
              </IText>
              <IText size={10}>تهیه و تنظیم توسط نرم افزار</IText>
            </Row>
            <IText size={10}>تولید شرکت نگین گهرزمین</IText>
            <Row>
              <IText size={10}>{`تلفن تماس: 03652123)430(`}</IText>
              <IText size={10} mX={2}>
                -
              </IText>
              <IText size={10} bold mX={2}>
                باجه
              </IText>
              <IText size={10}>شما هم بیاین</IText>
            </Row>
          </View>
        </Row>
      </View>
    </>
  );
};

export default Footer;

// Original StyleSheet replaced with simple style object for the placeholder
const styles = {
  container: {
    border: "0.8px solid black", // Adjusted for web
    borderRadius: 1,
    margin: "10px", // Adjusted for web
    marginTop: 5,
    height: 150,
    display: 'flex', // Added for Row semantics
    flexDirection: 'row' // Added for Row semantics
  },
};
