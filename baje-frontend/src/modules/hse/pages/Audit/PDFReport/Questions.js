import React from "react";
// import { StyleSheet, View } from "@react-pdf/renderer";
import { IText, Row } from "./componnets";
import { Container } from "./componnets";
import { criticalValues } from "modules/hse/constant";
import colors from "utils/colors";

const Questions = ({ audit }) => {
  const { questions, minimum_point } = audit;
  const getAuditPoint = () =>
    parseInt(
      questions
        .filter((item) => item.answer)
        .reduce(
          (pre, current) =>
            parseInt(pre) +
            parseInt(current.answer || 0) * current.weight_factor,
          [0]
        )
    );

  const getCritialQuestions = () => {
    const temp = [];
    questions.forEach((question) => {
      if (!question.critical || !question.answer) return;
      const criticals = question.critical.split(",");
      const q = criticals.find((item) => item === question.answer);
      if (q) temp.push(q);
    });
    return temp;
  };

  const getTotalAuditPoint = () =>
    questions
      .filter((item) => item.answer)
      .reduce((pre, current) => parseInt(pre) + 4 * current.weight_factor, [0]);

  // Placeholder for PDF View
  return (
    <div style={styles.container}>
      <Row>
        <Container
          pY={10}
          flex={0.5}
          align="center"
          style={{ borderWidth: 0.5, backgroundColor: colors["light-gray"] }}
        >
          <IText size={9} bold>
            بحرانی
          </IText>
        </Container>
        <Container
          pY={10}
          flex={1.5}
          align="center"
          style={{ borderWidth: 0.5, backgroundColor: colors["light-gray"] }}
        >
          <IText size={10} bold>
            مسئول رفع عیب
          </IText>
        </Container>
        <Container
          pY={10}
          flex={2}
          align="center"
          style={{ borderWidth: 0.5, backgroundColor: colors["light-gray"] }}
        >
          <IText size={10} bold>
            توضیحات
          </IText>
        </Container>
        <Container
          pY={10}
          flex={1}
          align="center"
          style={{ borderWidth: 0.5, backgroundColor: colors["light-gray"] }}
        >
          <IText size={10} bold>
            امتیاز
          </IText>
        </Container>
        <Container
          pY={10}
          flex={1}
          align="center"
          style={{ borderWidth: 0.5, backgroundColor: colors["light-gray"] }}
        >
          <IText size={10} bold>
            نتیجه
          </IText>
        </Container>
        <Container
          pY={10}
          align="center"
          flex={3}
          style={{ borderWidth: 0.5, backgroundColor: colors["light-gray"] }}
        >
          <IText size={10} bold>
            متن سوال
          </IText>
        </Container>
        <Container
          pY={10}
          align="center"
          flex={0.5}
          style={{ borderWidth: 0.5, backgroundColor: colors["light-gray"] }}
        >
          <IText size={9} bold>
            ردیف
          </IText>
        </Container>
      </Row>
      {questions.map((question, index) => (
        <Row key={question.id}>
          <Container flex={0.5} align="center" style={{ borderWidth: 0.5 }}>
            <IText size={10} bold>
              {!question.answer
                ? ""
                : question.critical
                    ?.split(",")
                    .find((item) => item === question.answer)
                ? "*"
                : ""}
            </IText>
          </Container>
          <Container flex={1.5} align="center" style={{ borderWidth: 0.5 }}>
            <IText size={10} bold>
              {/* {question.description} */}
            </IText>
          </Container>
          <Container flex={2} align="flex-end" style={{ borderWidth: 0.5 }}>
            <IText size={9} style={{ textAlign: "right" }} mX={2}>
              {question.operator_description
                ?.split(" ")
                ?.map((item, index) =>
                  index === 0 ? item : index % 3 === 0 ? ` ${item}\n` : item
                )
                .join(" ") || " "}
            </IText>
          </Container>
          <Container flex={1} align="center" style={{ borderWidth: 0.5 }}>
            {!question.answer ? (
              <IText size={10}>بدون پاسخ</IText>
            ) : (
              <Row>
                <IText size={10}>{4 * question.weight_factor}</IText>
                <IText size={10}>از</IText>
                <IText mX={2} size={10}>
                  {parseInt(question.answer) * question.weight_factor}
                </IText>
              </Row>
            )}
          </Container>
          <Container flex={1} align="center" style={{ borderWidth: 0.5 }}>
            <IText size={10}>
              {!question.answer
                ? "بدون پاسخ"
                : criticalValues(!!question.is_reverse)[question.type].find(
                    (item) => item.value === question.answer
                  )?.label}
            </IText>
          </Container>
          <Container align="flex-end" flex={3} style={{ borderWidth: 0.5 }}>
            <IText style={{ textAlign: "right" }} size={10} mX={2}>
              {question.question
                ?.split(" ")
                ?.map((item, index) =>
                  index === 0 ? item : index % 5 === 0 ? ` ${item}\n` : item
                )
                .join(" ") || " "}
            </IText>
          </Container>
          <Container align="center" flex={0.5} style={{ borderWidth: 0.5 }}>
            <IText size={10}>{index + 1}</IText>
          </Container>
        </Row>
      ))}
      <Row>
        <Container flex={4} style={{ borderWidth: 0.5 }}>
          <Row justify="space-between">
            {/* Placeholder for View */} <div />
            <Row>
              <IText>100</IText>
              <IText mX={5}>از</IText>
              <IText color="green">
                {Math.floor((getAuditPoint() / getTotalAuditPoint()) * 100) ||
                  0}
              </IText>
              <IText>نرمالیزه:</IText>
            </Row>
            <Row mX={20}>
              <IText>{getTotalAuditPoint()}</IText>
              <IText mX={5}>از</IText>
              <IText color="green">{getAuditPoint()}</IText>
            </Row>
          </Row>
        </Container>

        <Container flex={3.57} style={{ borderWidth: 0.5 }}>
          <IText bold>نمره کسب شده:</IText>
        </Container>
      </Row>

      <IText
        size={18}
        semibold
        style={{ textAlign: "center" }}
        color={
          getCritialQuestions().length > 0 ||
          (getAuditPoint() / getTotalAuditPoint()) * 100 < minimum_point ||
          getAuditPoint() === 0
            ? "red"
            : "green"
        }
      >
        {getCritialQuestions().length > 0
          ? "عدم صدور مجوز فعالیت به دلیل احراز حالت بحرانی"
          : getAuditPoint() === 0 ||
            (getAuditPoint() / getTotalAuditPoint()) * 100 < minimum_point
          ? "عدم صدور مجوز به خاطر نرسیدن به حدنصاب ممیزی"
          : `صدور مجوز فعالیت`}
      </IText>
    </div>
  );
};

export default Questions;

// Original StyleSheet replaced with simple style object for the placeholder
const styles = {
  container: {
    border: "1.5px solid black", // Adjusted for web
    borderRadius: 1,
    margin: "10px", // Adjusted for web
    marginTop: 5,
  },
  cellContainer: { borderWidth: 0.5, alignItems: "center" }, // This would need to be applied via inline styles or CSS classes if used
};
