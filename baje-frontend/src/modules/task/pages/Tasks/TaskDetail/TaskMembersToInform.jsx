import AppTag from "components/general/AppTag";
import React from "react";
import { useTaskDetailContext } from "./context";

const TaskMembersToInform = () => {
  const { state } = useTaskDetailContext();
  return (
    <>
      {state.task.membersToInform.map((item) => (
        <AppTag>{item.firstName + item.lastName}</AppTag>
      ))}
    </>
  );
};

export default TaskMembersToInform;
