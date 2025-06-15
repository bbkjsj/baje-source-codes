import AppCheckBox from "components/general/AppCheckBox";
import React from "react";

const QuestionItem = ({ question, checked, onClick }) => {
  const { question: content } = question;

  const handleChange = (params) => {
    onClick && onClick(question);
  };

  return (
    <div className="flex">
      <AppCheckBox checked={checked} onChange={handleChange} />
      <span className="mx-2">{content}</span>
    </div>
  );
};

export default QuestionItem;
