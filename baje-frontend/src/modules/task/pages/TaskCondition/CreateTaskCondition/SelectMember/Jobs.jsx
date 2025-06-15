import AppTable from "components/general/AppTable";
import { getJobs } from "modules/task/api/general";
import React, { useEffect } from "react";
import {
  createTaskConditionActions,
  useCreateTaskConditionContext,
} from "../context";

const Jobs = () => {
  const { dispatch, state } = useCreateTaskConditionContext();

  useEffect(() => {
    // loadJobs();
  }, []);

  const handeSelectJob = (payload) => {
    dispatch({
      type: createTaskConditionActions.setSelectedJobs,
      payload,
    });
  };

  const loadJobs = async () => {
    try {
      const { data } = await getJobs();
      const temp = [];
      [...state.selectedJobs].forEach((item) => {
        console.log(item, data, "DATA");
        const job = data.find((j) => item == j.id);
        if (job) temp.push(job);
      });

      dispatch({
        type: createTaskConditionActions.setJobs,
        payload: { jobs: data, selectedJobs: temp },
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <AppTable
        dataSource={state.jobs.map((item) => ({
          ...item,
          key: item.id,
        }))}
        columns={[
          { title: "شناسه", dataIndex: "id" },
          { title: "عنوان", dataIndex: "title" },
        ]}
        rowSelection={{
          hideSelectAll: true,
          onChange: handeSelectJob,
          selectedRowKeys: state.selectedJobs,
        }}
      />
    </>
  );
};

export default Jobs;
