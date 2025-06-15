import React from "react";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { IText, Row } from "./componnets";
import colors from "utils/colors";

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
    <View style={styles.container}>
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
    </View>
  );
};

export default AuditDetail;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderRadius: 1,
    marginHorizontal: 10,
    marginTop: 10,
  },
  cellContainer: { borderWidth: 0.5, flex: 1, paddingVertical: 2 },
});
