import AppTag from "components/general/AppTag";
import React from "react";
import { useTaskDetailContext } from "./context";

const TaskMembers = () => {
  const { state } = useTaskDetailContext();
  return (
    <>
      {state.task.members?.map((item) => (
        <AppTag>{item.firstName + " " + item.lastName}</AppTag>
      ))}
    </>
  );
};

export default TaskMembers;
