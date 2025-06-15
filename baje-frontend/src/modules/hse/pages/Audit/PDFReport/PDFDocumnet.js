import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { IText } from "./componnets";
import Header from "./Header";
import AuditDetail from "./AuditDetail";
import Questions from "./Questions";
import Description from "./Description";
import OtherQuestions from "./OtherQuestions";
import Footer from "./Footer";

const PDFDoucument = ({ audit }) => {
  const { questions } = audit;
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <IText style={{ textAlign: "center" }} size={10}>
          به نام خدا
        </IText>
        <Header audit={audit} />
        <AuditDetail audit={audit} />
        <Questions audit={audit} />
        <Description audit={audit} />
        {!!questions.find((item) => item.is_not_related) && (
          <OtherQuestions audit={audit} />
        )}
        <Footer audit={audit} />
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFF",
    paddingTop: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

export default PDFDoucument;
