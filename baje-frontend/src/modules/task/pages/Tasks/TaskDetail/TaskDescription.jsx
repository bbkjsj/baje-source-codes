import { Descriptions } from "antd";
import React from "react";
import { useTaskDetailContext } from "./context";

const TaskDescription = () => {
  const { state } = useTaskDetailContext();
  return (
    <Descriptions>
      <Descriptions.Item>{state.task.description}</Descriptions.Item>
    </Descriptions>
  );
};

export default TaskDescription;
