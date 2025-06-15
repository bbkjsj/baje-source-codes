import { Descriptions } from "antd";
import React from "react";
import { useTaskDetailContext } from "./context";
import moment from "moment-jalaali";
import AppTag from "components/general/AppTag";
import {
  constant,
  ifTaskFailed,
  taskDoneCondition,
  taskPriority,
} from "modules/task/constant";
import { useHistory, useRouteMatch, withRouter } from "react-router-dom";
import AppButton from "components/general/AppButton";
import { approveNotMyDuty } from "modules/task/api/task";

const TaskInfo = ({ header, ...prp }) => {
  const { state } = useTaskDetailContext();
  const { goBack } = useHistory();
  console.log(prp);
  const {
    params: { role },
  } = useRouteMatch();

  const handleApproveNotMyDuty = async () => {
    try {
      await approveNotMyDuty({ taskId: state.task.id, status: true });
      goBack();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleOpenLink = () => {
    window.location.assign(state.task.pageUrl);
  };

  return (
    <Descriptions>
      <Descriptions.Item>{`عنوان وظیفه : ${state.task.title}`}</Descriptions.Item>
      <Descriptions.Item>
        {`روش ساخته شدن وظیفه : ${
          state.task.taskType === constant.chained ? "سیستمی" : "دستی"
        }`}
      </Descriptions.Item>
      <Descriptions.Item>
        {`مهلت انجام وظیفه : ${
          moment(state.task.dueDate).isBefore(moment())
            ? "گذشته است"
            : "مهلت دارد"
        }`}
      </Descriptions.Item>
      <Descriptions.Item>
        هدف نمایش تسک به شما:
        {role === constant.done && (
          <AppTag color="blue"> وظیفه انجام شده است</AppTag>
        )}
        {role === constant.mytasks && (
          <AppTag color="blue">انجام دهنده وظیفه هستید</AppTag>
        )}
        {role === constant.toinfo && (
          <AppTag color="blue">وظیفه جهت اطلاع شما است</AppTag>
        )}
        {role === constant.toapprove && (
          <AppTag color="blue">تایید کننده انجام وظیفه هستید</AppTag>
        )}
      </Descriptions.Item>
      <Descriptions.Item>
        <AppTag color="green">{`امتیاز مثبت : ${state.task.point}`}</AppTag>
      </Descriptions.Item>
      <Descriptions.Item>
        <AppTag color="red">
          {`امتیاز منفی : ${state.task.negativePoint}`}
        </AppTag>
      </Descriptions.Item>
      <Descriptions.Item>
        درجه اهمیت :{" "}
        <AppTag>
          {taskPriority.find((item) => item.value === state.task.priority)
            ?.label || "-"}
        </AppTag>
      </Descriptions.Item>
      <Descriptions.Item>
        تایید کننده انجام وظیفه :{" "}
        <AppTag>
          {taskDoneCondition.find(
            (item) => item.value === state.task.approveCondition
          )?.label || "-"}
        </AppTag>
      </Descriptions.Item>
      <Descriptions.Item>
        در صورت عدم انجام وظیفه :{" "}
        <AppTag>
          {ifTaskFailed.find((item) => item.value === state.task.ifTaskFailed)
            ?.label || "-"}
        </AppTag>
      </Descriptions.Item>
      {!!state.task.pageUrl && (
        <Descriptions.Item>
          لینک مرتبط با وظیفه
          <AppButton onClick={handleOpenLink}>باز کردن</AppButton>
        </Descriptions.Item>
      )}
      <Descriptions.Item>{`تاریخ ساخت وظیفه : ${moment(
        state.task.created_at
      ).format("jYYYY/jMM/jDD")}`}</Descriptions.Item>
      <Descriptions.Item>{`مهلت انجام وظیفه : ${moment(
        state.task.dueDate
      ).format("jYYYY/jMM/jDD")}`}</Descriptions.Item>
      <Descriptions.Item>
        گزارش وظیفه من نیست:
        {!state.task.notMyDuty && <AppTag color="red">گزارشی ثبت نشده</AppTag>}
        {state.task.notMyDuty && <AppTag>گزارش ثبت شده است</AppTag>}
      </Descriptions.Item>
      {state.task.notMyDuty && (
        <Descriptions.Item>
          تاییدیه گزارش وظیفه من نیست:
          {state.task.notMyDuty.approved && (
            <AppTag color="green">تایید شده</AppTag>
          )}
          {!state.task.notMyDuty.approved && (
            <AppTag color="red">تایید نشده</AppTag>
          )}
          {!state.task.notMyDuty.approved && (
            <AppButton onClick={handleApproveNotMyDuty} color="red">
              تایید وظیفه من نیست
            </AppButton>
          )}
        </Descriptions.Item>
      )}
      {state?.task?.forwardMembers?.length ? (
        <Descriptions.Item>
          <p style={{flexShrink: 0}}>افراد ارجاع شده:</p>
          <div className="flex-wrap">
            {state?.task?.forwardMembers?.map((i) => (
              <AppTag color="blue" className="mr-1 mb-2">
                {i.fullName}
              </AppTag>
            ))}
          </div>
        </Descriptions.Item>
      ) : (
        ""
      )}
      {state?.task?.forwardDescription ? (
        <Descriptions.Item>
          توضیحات ارجاع:
          <div className="flex">
            <p>{state?.task?.forwardDescription}</p>
          </div>
        </Descriptions.Item>
      ) : (
        ""
      )}
    </Descriptions>
  );
};

export default withRouter(TaskInfo);
