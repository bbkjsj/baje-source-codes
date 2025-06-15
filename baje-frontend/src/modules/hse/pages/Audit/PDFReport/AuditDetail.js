import React from "react";
// import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { IText, Row } from "./componnets";
import colors from "utils/colors";

// Placeholder for @react-pdf/renderer View component
const View = ({style, children}) => <div style={style}>{children}</div>;
// Placeholder for @react-pdf/renderer Text component (if IText wasn't already a good enough stub)
// const Text = ({children, style}) => <span style={style}>{children}</span>;


const AuditDetail = ({ audit }) => {
  const {
    plaque1,
    plaque2,
    plaque3,
    plaque4,
    first_name,
    last_name,
    organization_code,
    national_number,
  } = audit;
  return (
    // <View style={styles.container}>
    <div style={styles.container}> {/* Placeholder for PDF View */}
      <Row>
        <View
          style={{ ...styles.cellContainer, flex: 1.5, alignItems: "center" }}
        >
          <IText>-</IText>
        </View>
        <View
          style={{
            ...styles.cellContainer,
            backgroundColor: colors["light-gray"],
          }}
        >
          <IText>پروژه:</IText>
        </View>
        <View
          style={{ ...styles.cellContainer, flex: 1.5, alignItems: "center" }}
        >
          <IText>-</IText>
        </View>
        <View
          style={{
            ...styles.cellContainer,
            backgroundColor: colors["light-gray"],
          }}
        >
          <IText>شرکت:</IText>
        </View>
      </Row>
      <Row>
        <View
          style={{ ...styles.cellContainer, flex: 1.5, alignItems: "center" }}
        >
          <IText>{national_number || organization_code}</IText>
        </View>
        <View
          style={{
            ...styles.cellContainer,
            backgroundColor: colors["light-gray"],
          }}
        >
          <IText>
            {audit.first_name || audit.last_name ? "شماره ملی:" : "کد کارگاهی:"}
          </IText>
        </View>
        <View
          style={{
            ...styles.cellContainer,
            flex: 1.5,
            alignItems: "center",
          }}
        >
          {(first_name || last_name) && (
            <IText>{first_name + " " + last_name}</IText>
          )}
          {(plaque1 || plaque2 || plaque3) && (
            <Row>
              <IText>{plaque1}</IText>
              <IText>{plaque2}</IText>
              <IText>{plaque3}</IText>
              <IText>{plaque4}</IText>
            </Row>
          )}
        </View>
        <View
          style={{
            ...styles.cellContainer,
            backgroundColor: colors["light-gray"],
          }}
        >
          <IText>ممیزی شونده:</IText>
        </View>
      </Row>
    </div>
    // </View>
  );
};

export default AuditDetail;

// Original StyleSheet replaced with simple style object for the placeholder
const styles = {
  container: {
    border: "1.5px solid black", // Adjusted for web
    borderRadius: 1,
    margin: "10px", // Adjusted for web
    marginTop: 10,
  },
  cellContainer: { borderWidth: "0.5px solid black", flex: 1, padding: "2px" }, // Adjusted for web
};
