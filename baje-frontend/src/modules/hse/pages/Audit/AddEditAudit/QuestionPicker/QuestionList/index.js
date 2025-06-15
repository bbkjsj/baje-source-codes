import AppInput from "components/general/AppInput";
import React, { useContext, useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import QuestionItem from "modules/hse/components/items/Question";
import { Col, Row } from "antd";
import { getQuestions } from "modules/hse/api/question";
import { AuditContext } from "../../context";

const QuestionList = () => {
  const { state: parentState, toggleSelectQuestion } = useContext(AuditContext);
  const [state, setState] = useState({ questiuons: [] });
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async (params) => {
    try {
      const { data } = await getQuestions();
      setState((s) => ({ ...s, questiuons: data }));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <AppInput
        className="mx-auto mt-3 w-75"
        placeholder="جستجوی سوال"
        prefix={<SearchOutlined />}
      />

      <Row gutter={10}>
        {state.questiuons
          .filter((item) =>
            parentState.group ? item.group === parentState.group : true
          )
          .map((question) => (
            <Col key={question.id} md={8} sm={24} className="mt-2">
              <QuestionItem
                checked={
                  !!parentState.selectedQuestions.find(
                    (item) => item.id === question.id
                  )
                }
                onClick={toggleSelectQuestion}
                question={question}
              />
            </Col>
          ))}
      </Row>
    </>
  );
};

export default QuestionList;
