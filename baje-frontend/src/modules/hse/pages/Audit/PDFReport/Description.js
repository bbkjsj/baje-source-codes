import React from "react";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { IText, Row } from "./componnets";

const Description = ({ audit }) => {
  const { minimum_point } = audit;

  return (
    <View>
      <Row justify="flex-end" mX={20} mY={5}>
        <IText size={10} mX={2}>
          می باشد
        </IText>
        <IText size={10} color="red">
          100
        </IText>
        <IText size={10} mX={2}>
          از
        </IText>
        <IText size={10} color="red" mX={2}>
          {minimum_point}
        </IText>
        <IText size={10}>
          حداقل نمره مورد نیاز کسب مجوز فعالیت برای این چک لیست، نمره
        </IText>
      </Row>
      <IText size={10} style={{ textAlign: "right" }} mX={20}>
        مورد ستاره دار )*( بدین معناست که حالت بحرانی پیش آمده و امکان فعالیت
        وجود ندارد.
      </IText>
    </View>
  );
};

export default Description;

const styles = StyleSheet.create({});
