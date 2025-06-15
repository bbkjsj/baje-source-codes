import React from "react";
// import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { IText, Row } from "./componnets";
import colors from "utils/colors";

const OtherQuestions = ({ audit }) => {
  const { questions } = audit;
  return (
    // <View style={styles.container}>
    <div style={styles.container}> {/* Placeholder for PDF View */}
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
      {/* <View style={{ height: 0.5, backgroundColor: "#000" }} /> */}
      <div style={{ height: 0.5, backgroundColor: "#000" }} /> {/* Placeholder for PDF View */}
      {questions
        .filter((item) => item.is_not_related)
        .map((item, index) => (
          // <View key={item.id}>
          <div key={item.id}> {/* Placeholder for PDF View */}
            <Row mX={10} justify="flex-end" mY={1}>
              <IText size={10}>{item.question}</IText>
              <IText size={10}>.</IText>
              <IText size={10}>{index + 1}</IText>
            </Row>
          </div>
          // </View>
        ))}
    </div>
    // </View>
  );
};

export default OtherQuestions;

// Original StyleSheet replaced with simple style object for the placeholder
const styles = {
  container: {
    border: "1.5px solid black", // Adjusted for web
    borderRadius: 1,
    margin: "10px", // Adjusted for web
    marginTop: 5,
  },
};
