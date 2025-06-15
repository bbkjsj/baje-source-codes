import { Col, Row } from "antd";
import AppModal from "components/general/AppModal";
import AppTag from "components/general/AppTag";
import { taskSMSNotirfication } from "modules/task/constant";
import React from "react";
import {
  createTaskConditionActions,
  useCreateTaskConditionContext,
} from "../context";
import "./mobile.css";

const TaskSMSTemplate = () => {
  const { state, dispatch } = useCreateTaskConditionContext();

  const handleClickTaskSMSTag = (payload) => {
    dispatch({
      type: createTaskConditionActions.toggleSMSNotification,
      payload,
    });
  };

  const handleCloseModal = () => {
    dispatch({
      type: createTaskConditionActions.changeAttribute,
      payload: { attribute: "smsNotificationModal", value: false },
    });
  };

  return (
    <AppModal
      centered
      width="70%"
      footer={null}
      closable={false}
      onCancel={handleCloseModal}
      visible={state.smsNotificationModal}>
      <Row>
        <Col md={14}>
          <div className="flex flex-column align-start h-100 w-100 justify-between">
            <h2>تنظیمات ارسال پیامک یادآور</h2>
            <div>
              {taskSMSNotirfication.map((item) => (
                <AppTag
                  key={item.value}
                  color={
                    state.smsNotification.find(
                      ({ value }) => value === item.value
                    ) && "blue"
                  }
                  
                  onClick={() => handleClickTaskSMSTag(item)}
                  className="my-1 pointer px-3 py-2">
                  {item.label}
                </AppTag>
              ))}
            </div>
            <div></div>
          </div>
        </Col>
        <Col
          md={10}
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}>
          <div className="task-mobile">
            <div className="task-mobile-container">
              <div className="task-mobile-header">
                <div className="task-mobile-header-speaker"></div>
                <div className="task-mobile-header-camera"></div>
              </div>
              <div className="task-mobile-body">
                <p>همکار گرامی</p>
                <p>
                  {`به آگاهی
                  میرساند ____ درصد از فرصت تعیین شده
                  برای انجام وظیفه به پایان رسید.
                  `}
                </p>
                <p>با تشکر سامانه باجه</p>
              </div>
              <div className="task-mobile-footer">
                <div className="task-mobile-finger-print"></div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </AppModal>
  );
};

export default TaskSMSTemplate;
