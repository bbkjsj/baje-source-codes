import React, { useEffect, useState } from "react";
import { getAudit, updateAudit } from "modules/hse/api/audit";
import { useHistory, useParams } from "react-router";

import { CheckCircleOutlined } from "@ant-design/icons";
import ContentTop from "components/general/ContentTop";
import LoadingLogo from "components/general/LoadingLogo";
import { PerformAuditContext } from "./context";
import Question from "./Question";
import { Steps } from "antd";
import moment from "moment";
import { pageNames } from "constant";
import { permission } from "json/Permission";
import { showMessage } from "utils/message";
import useCheckAccess from "hooks/useCheckAccess";

const PerformAnAudit = () => {
  const [state, setState] = useState({
    loading: true,
    audit: {},
    questionIndex: 0,
  });

  const { id } = useParams();
  const { replace } = useHistory();
  const checkAccess = useCheckAccess();

  useEffect(() => {
    loadAudit();
  }, []);

  const loadAudit = async () => {
    try {
      const { data: audit } = await getAudit(id);
      const qIndex = [...audit.questions]
        .reverse()
        .findIndex((item) => item.answer);

      setState((s) => ({
        ...s,
        audit: {
          ...audit.audit,
          questions: audit.questions,
        },
        loading: false,
        questionIndex: qIndex < 0 ? 0 : audit.questions.length - 1 - qIndex,
      }));
    } catch (error) {
      setState((s) => ({ ...s, loading: false }));
      console.log(error.message);
    }
  };

  const handleSetAnswer = (answer) => {
    const temp = [...state.audit.questions];
    temp[state.questionIndex].answer = answer;
    // console.log(
    //   "rad shudam",
    //   state.questionIndex === state.audit.questions.length - 1
    // );
    setState((s) => ({
      ...s,
      audit: { ...s.audit, questions: temp },
      questionIndex:
        s.questionIndex === s.audit.questions.length - 1
          ? s.questionIndex
          : s.questionIndex + 1,
    }));
  };

  const handleSubmit = async (draft) => {
    const temp = {
      id: state.audit.id,
      date: moment(state.audit.date).format("YYYY/M/D"),
      minimumPoint: state.audit.minimum_point,
      draft,
      questions: state.audit.questions.map((item) => ({
        ...item,
        questionId: item.question_id_fk,
        isReverse: !!item.is_reverse,
      })),
    };

    if (state.audit.personnel_id_fk)
      temp.personnel_id_fk = state.audit.personnel_id_fk;
    if (state.audit.vehicle_id_fk)
      temp.vehicle_id_fk = state.audit.vehicle_id_fk;
    setState((s) => ({ ...s, loading: true }));
    try {
      await updateAudit(temp);
      showMessage("بازرسی با موفقیت ذخیره شد", "success");
      replace(pageNames.hse.audit.index);
    } catch (error) {
      console.log(error.message);
      setState((s) => ({ ...s, loading: false }));
    }
  };

  const handleChangeQuestionIndex = (questionIndex) => {
    setState((s) => ({ ...s, questionIndex }));
  };

  if (state.loading) return <LoadingLogo />;
  if (!checkAccess(permission.HSE_AUDIT)) return null;

  return (
    <PerformAuditContext.Provider
      value={{ state, setState, handleSetAnswer, handleSubmit }}
    >
      <ContentTop
        breadcrumbItems={[
          { text: "بازسی" },
          { text: "hse" },
          { text: "بازرسی جدید", link: pageNames.hse.audit.addEdit },
        ]}
        noBack
        title={`انجام بازرسی شماره ${state.audit.id}`}
      />
      <Steps
        current={state.questionIndex}
        style={{
          overflow: "auto",
          whiteSpace: "nowrap",
          display: "block",
        }}
      >
        {state.audit.questions?.map((item, index) => (
          <Steps.Step
            style={{ display: "inline-block", width: "100px", height: "50px" }}
            // onStepClick={handleChangeQuestionIndex}
            key={item.id}
            icon={state.questionIndex > index && <CheckCircleOutlined />}
          />
        ))}
      </Steps>
      <Question
        question={state.audit.questions?.[state.questionIndex]}
        questionIndex={state.questionIndex}
      />
    </PerformAuditContext.Provider>
  );
};

export default PerformAnAudit;
