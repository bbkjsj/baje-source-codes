import { Col, Row, Spin } from "antd";
import { AuditContext } from "../../context";
import React, { useContext, useEffect, useState } from "react";
import { getChecklist, getChecklists } from "modules/hse/api/checklist";
import ChecklistItem from "modules/hse/components/items/Checklist";
import { omit } from "lodash";

const Checklist = () => {
  const [state, setState] = useState({ checklists: [], loading: true });
  const { state: parentState, setState: setParentState } = useContext(
    AuditContext
  );

  useEffect(() => {
    loadChecklists();
  }, []);

  const loadChecklists = async () => {
    try {
      const { data } = await getChecklists();
      setState((s) => ({ ...s, checklists: data, loading: false }));
    } catch (error) {
      setState((s) => ({ ...s, loading: false }));
      console.log(error.message);
    }
  };

  const onClickChacklist = async (checklist) => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const { data } = await getChecklist(checklist);
      // toggleSelectQuestion(
      //   data.questions.map((item) => ({ ...item, id: item.questionId }))
      // );
      setParentState((s) => ({
        ...s,
        selectedQuestions: data.questions.map((item) => ({
          ...omit(item, ["minimum_point", "id", "is_reverse"]),
          // id: item.questionId,
          isReverse: !!item.is_reverse,
        })),
        minimumPoint: data.checklist.minimum_point,
        questionPicker: false,
      }));
      setState((s) => ({ ...s, loading: false }));
    } catch (error) {
      console.log(error.message);
      setState((s) => ({ ...s, loading: false }));
    }
  };

  if (state.loading) return <Spin />;
  return (
    <>
      <Row gutter={10}>
        <Col md={8} sm={24} className="mt-3">
          {state.checklists
            .filter((item) => parentState.group === item.group)
            .map((checklist) => (
              <ChecklistItem onClick={onClickChacklist} checklist={checklist} />
            ))}
        </Col>
      </Row>
    </>
  );
};

export default Checklist;
