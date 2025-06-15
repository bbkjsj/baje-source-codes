import React, { useState } from "react";
import { messages, showMessage } from "utils/message";

import { AuditContext } from "./context";
import AuditInfo from "./AuditInfo";
import AuditQuestionPicker from "./QuestionPicker";
import ContentTop from "components/general/ContentTop";
import { constant } from "modules/hse/constant";
import { createAudit } from "modules/hse/api/audit";
import { getLink } from "_helpers";
import moment from "moment-jalaali";
import { omit } from "lodash";
import { pageNames } from "constant";
import { permission } from "json/Permission";
import useCheckAccess from "hooks/useCheckAccess";
import { useHistory } from "react-router";

const AuditAddOrEdit = () => {
  const [state, setState] = useState({
    group: constant.vehicle,
    existency: {},
    questionPicker: false,
    selectedQuestions: [],
    selectedTab: constant.auditInfo,
    date: "",
    description: "",
    loading: false,
  });
  const { replace } = useHistory();
  const checkAccess = useCheckAccess();

  const toggleQuestionPicker = () => {
    setState((s) => ({ ...s, questionPicker: !s.questionPicker }));
  };

  const toggleSelectQuestion = (question) => {
    const toggleSingleQuestion = () => {
      const temp = [...state.selectedQuestions];
      const questionIndex = temp.findIndex((item) => item.id === question.id);
      if (questionIndex >= 0)
        return setState((s) => ({
          ...s,
          selectedQuestions: s.selectedQuestions.filter(
            (item, index) => index !== questionIndex
          ),
        }));
      setState((s) => ({
        ...s,
        selectedQuestions: [question, ...s.selectedQuestions],
      }));
    };

    const toggleArrayQuestion = () => {
      let temp = [...state.selectedQuestions];
      return console.log(temp, question, "RESIDAM");
      question.forEach((q) => {
        const tempIndex = temp.findIndex((item) => item.id === q.id);
        if (tempIndex < 0) temp.push(q);
        // else temp = temp.filter((item, index) => tempIndex !== index);
      });
      setState((s) => ({ ...s, selectedQuestions: temp }));
    };

    if (typeof question === "object") return toggleSingleQuestion();
    if (Array.isArray(question)) toggleArrayQuestion();
  };

  const handleCreateAudit = async ({ date, description }) => {
    if (moment(date, "jYYYY/jM/jD").isSameOrAfter())
      return showMessage("نمی توانید فرم بازرسی برای آینده ثبت کنید", "error");
    const temp = {
      date: moment(date, "jYYYY/jM/jD").format("YYYY/MM/DD"),
      description,
      questions: state.selectedQuestions.map((item) => ({
        ...omit(item, ["_group"]),
        // questionId: item.id,
        group: item._group || item.group,
        isReverse: !!item.is_reverse,
      })),
      draft: true,
      minimumPoint: state.minimumPoint,
    };
    if (state.group === constant.inidividual)
      temp.personnel_id_fk = state.existency.id;
    if (state.group === constant.vehicle)
      temp.vehicle_id_fk = state.existency.id;

    setState((s) => ({ ...s, loading: true }));
    try {
      const { data } = await createAudit(temp);
      showMessage(messages.createdSuccessfully("بازرسی"), "success");
      replace(getLink(pageNames.hse.performAnAudit.index, data.raw.insertId));
    } catch (error) {
      setState((s) => ({ ...s, loading: false }));
      console.log(error.message);
    }
  };

  if (!checkAccess(permission.HSE_AUDIT)) return null;

  return (
    <AuditContext.Provider
      value={{
        state,
        setState,
        handleCreateAudit,
        toggleQuestionPicker,
        toggleSelectQuestion,
      }}
    >
      <ContentTop
        breadcrumbItems={[
          { text: "hse", link: pageNames.hse.audit.index },
          { text: "بازرسی" },
        ]}
        noBack
        title="بازرسی"
      />
      <AuditInfo />
      <AuditQuestionPicker />
    </AuditContext.Provider>
  );
};

export default AuditAddOrEdit;
