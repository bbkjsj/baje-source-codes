import { Tabs, Typography } from "antd";
import AppModal from "components/general/AppModal";
import React, { useContext } from "react";
import QuestionList from "./QuestionList";
import Checklist from "./Checklist";
import LastAudit from "./LastAudit";
import { CloseOutlined } from "@ant-design/icons";
import { AuditContext } from "../context";

const AuditQuestionPicker = () => {
  const { state: parentState, toggleQuestionPicker } = useContext(AuditContext);

  return (
    <AppModal
      centered
      width="60%"
      footer={null}
      closable={false}
      visible={parentState.questionPicker}
      onCancel={toggleQuestionPicker}
    >
      <div className="flex justify-between">
        <Typography.Title level={5}>انتخاب سوال ممیزی</Typography.Title>
        <CloseOutlined onClick={toggleQuestionPicker} />
      </div>
      <Tabs type="card">
        <Tabs.TabPane key="1" tab="چک لیست ها">
          <Checklist />
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab="بازرسی های قبلی">
          <LastAudit />
        </Tabs.TabPane>
      </Tabs>
    </AppModal>
  );
};

export default AuditQuestionPicker;
