import React from "react";
import { Descriptions } from "antd";
import { useTaskDetailContext } from "./context";
import AppButton from "components/general/AppButton";
import { downloadFile } from "modules/task/api/taskCondition";
import fileDownload from "js-file-download";

const DoneDescription = () => {
  const { state } = useTaskDetailContext();
  const downloadConditionFile = () => {
    downloadFile(state?.task?.attachmentUrl).then((res) => {
      fileDownload(res.data, state?.task?.attachmentUrl.split("/")[1]);
    });
  };

  return (
    <Descriptions>
      <Descriptions.Item>{`توضیحات: ${
        state?.task?.attachmentDescription || "-"
      }`}</Descriptions.Item>
      {state?.task?.attachmentUrl ? (
        <Descriptions.Item>
          <div className="flex">
            <p>فایل: {state?.task?.attachmentUrl}</p>
            <AppButton className="mr-2" onClick={downloadConditionFile}>
              دانلود
            </AppButton>
          </div>
        </Descriptions.Item>
      ) : (
        ""
      )}
    </Descriptions>
  );
};

export default DoneDescription;
