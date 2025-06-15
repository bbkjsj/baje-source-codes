import AppTag from "components/general/AppTag";
import useWhoAmI from "hooks/useWhoAmI";
import { patchTask } from "modules/task/api/task";
import { constant, taskStatus } from "modules/task/constant";
import React from "react";
import { useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import { taskDetailActions, useTaskDetailContext } from "./context";

const TaskStatus = () => {
  const { state, dispatch } = useTaskDetailContext();
  const user = useWhoAmI();

  const {
    params: { role },
  } = useRouteMatch();

  const handleChangeTaskStatus = async (taskType) => {
    if (role !== constant.mytasks) return;
    try {
      await patchTask({ id: state.task.id, status: taskType.value });
      dispatch({
        type: taskDetailActions.setTask,
        payload: { ...state.task, status: taskType.value },
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      {taskStatus.map((item) => (
        <AppTag
          color={item.value === state.task.status && "blue"}
          onClick={() => handleChangeTaskStatus(item)}
          key={item.value}>
          {item.label}
        </AppTag>
      ))}
    </>
  );
};

export default TaskStatus;
