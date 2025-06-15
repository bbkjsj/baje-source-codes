import React from "react";
// import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { IText } from "./componnets";
import Header from "./Header";
import AuditDetail from "./AuditDetail";
import Questions from "./Questions";
import Description from "./Description";
import OtherQuestions from "./OtherQuestions";
import Footer from "./Footer";

// Placeholders for @react-pdf/renderer components
const Document = ({ children }) => <div>{children} {/* PDF Document Placeholder */}</div>;
const Page = ({ size, style, wrap, children }) => <div style={{...style, border: '2px solid green', margin: '10px', padding: '10px'}}>{children} {/* PDF Page Placeholder (size: {size}, wrap: {wrap?.toString()}) */}</div>;


const PDFDoucument = ({ audit }) => { // Typo in original filename: PDFDocumnet
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

// Original StyleSheet replaced with simple style object for the placeholder
const styles = {
  page: {
    backgroundColor: "#FFF",
    paddingTop: 10,
  },
  section: { // This style was unused in the original component but kept here for completeness if needed
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
};

export default PDFDoucument;
