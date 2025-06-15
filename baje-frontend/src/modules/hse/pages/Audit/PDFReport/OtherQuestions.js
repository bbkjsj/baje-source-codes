import React from "react";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { IText, Row } from "./componnets";
import colors from "utils/colors";

const OtherQuestions = ({ audit }) => {
  const { questions } = audit;
  return (
    <View style={styles.container}>
      <IText
        bold
        size={10}
        style={{
          textAlign: "center",
          backgroundColor: colors["light-gray"],
          paddingVertical: 10,
        }}
      >
        سوالات نامرتبط گزارش شده
      </IText>
      <View style={{ height: 0.5, backgroundColor: "#000" }} />
      {questions
        .filter((item) => item.is_not_related)
        .map((item, index) => (
          <View key={item.id}>
            <Row mX={10} justify="flex-end" mY={1}>
              <IText size={10}>{item.question}</IText>
              <IText size={10}>.</IText>
              <IText size={10}>{index + 1}</IText>
            </Row>
          </View>
        ))}
    </View>
  );
};

export default OtherQuestions;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderRadius: 1,
    marginHorizontal: 10,
    marginTop: 5,
  },
});
