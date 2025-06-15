import React, { useEffect, useReducer } from "react";
import ContentTop from "components/general/ContentTop";
import GoBackBtn from "components/GoBackBtn";
import { pageNames } from "constant";
import { getLink } from "_helpers";
import { Collapse, message } from "antd";
import { useHistory, useRouteMatch } from "react-router-dom";
import {
  approveTask,
  getTask,
  getUnreadCount,
  patchTask,
  postReadTask,
} from "modules/task/api/task";
import LoadingLogo from "components/general/LoadingLogo";
import {
  taskDetailActions,
  TaskDetailContext,
  taskDetailInitialState,
  taskDetailReducer,
} from "./context";
import TaskInfo from "./TaskInfo";
import TaskDescription from "./TaskDescription";
import TaskStatus from "./TaskStatus";
import TaskMembers from "./TaskMembers";
import AppTag from "components/general/AppTag";
import { constant, taskStatus } from "modules/task/constant";
import TaskMembersToInform from "./TaskMembersToInform";
import MenuInlineBtn from "components/MenuInlineBtn";
import NotMyDuty from "./NotMyDuty";
import DoneModal from "./DoneModal";
import DoneDescription from "./DoneDescription";
import ReferModal from "./ReferModal";
import AppButton from "components/general/AppButton";
import { downloadFile } from "modules/task/api/taskCondition";
import fileDownload from "js-file-download";
import { setTaskNotifications } from "store/action/notifications";
import { useDispatch } from "react-redux";

const TaskDetail = () => {
  const { params } = useRouteMatch();
  const { goBack } = useHistory();

  const [state, dispatch] = useReducer(
    taskDetailReducer,
    taskDetailInitialState
  );

  const rdxDispatch = useDispatch();

  const { role, id } = params;

  useEffect(() => {
    loadTask();
    readTask();
  }, []);

  const loadTask = async () => {
    try {
      const { data } = await getTask(id);
      dispatch({
        type: taskDetailActions.setInitialState,
        payload: {
          ...data.task,
          members: data.members,
          membersToInform: data.membersToInform,
          notMyDuty: data.notMyDuty,
          forwardMembers: data.forwardMembers,
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDoneTask = async () => {
    if (role !== constant.mytasks) return;
    try {
      await patchTask({
        id: state.task.id,
        status: constant.done,
      });
      goBack();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleApproveTask = async () => {
    if (role !== constant.toapprove) return;
    try {
      await approveTask({ id: state.task.id });
      dispatch({
        type: taskDetailActions.setTask,
        payload: { ...state.task, approved: 1 },
      });
      goBack();
      message.success("با موفقیت تایید شد");
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleNotMyDutyModal = () => {
    dispatch({ type: taskDetailActions.toggleNotMyDuty });
  };
  const toggleDoneModal = () => {
    dispatch({ type: taskDetailActions.toggleDoneModal });
  };
  const toggleReferModal = () => {
    dispatch({ type: taskDetailActions.toggleReferModal });
  };

  const readTask = async () => {
    await postReadTask(id);
    setTimeout(() => {
      getUnreadCount()
        .then((res) => {
          rdxDispatch(setTaskNotifications(res.data));
        })
        .catch((err) => {
          console.error(err);
        });
    }, 3000);
  };

  const downloadConditionFile = () => {
    downloadFile(state?.task?.fileUrl).then((res) => {
      fileDownload(res.data, state?.task?.fileUrl.split("/")[1]);
    });
  };

  if (state.loading) return <LoadingLogo />;
  return (
    <TaskDetailContext.Provider value={{ state, dispatch }}>
      <ContentTop
        title="جزییات وظیفه"
        breadcrumbItems={[
          { text: "کارتابل", link: pageNames.task.cardBoards },
          {
            text: "وظیفه ها",
            link: getLink(pageNames.task.index, { status: "all" }),
          },
          {
            text: "جزییات وظیفه",
          },
        ]}
      />
      <GoBackBtn />
      <MenuInlineBtn
        list={[
          {
            label: "تایید انجام وظیفه",
            handleClick: handleApproveTask,
            hidden: role !== constant.toapprove,
          },
          {
            label: "وظیفه انجام شد",
            handleClick: toggleDoneModal,
            hidden:
              (role !== constant.mytasks && role !== constant.redirected) ||
              !!state.task.notMyDuty,
          },
          {
            label: "گزارش وظیفه من نیست",
            hidden: !!state.task.notMyDuty,
            handleClick: toggleNotMyDutyModal,
          },
          {
            label: "ارجاع وظیفه",
            hidden: role !== constant.mytasks || !state?.task?.referable,
            handleClick: toggleReferModal,
          },
        ]}
      />
      <div className="my-2"></div>
      <Collapse defaultActiveKey="info">
        <Collapse.Panel key="info" header="جزییات وظیفه">
          <TaskInfo />
        </Collapse.Panel>
        <Collapse.Panel key="description" header="توضیحات وظیفه">
          <TaskDescription />
        </Collapse.Panel>

        {!!state.relatedTask && (
          <Collapse.Panel key="relation" header="وظیفه وابسته"></Collapse.Panel>
        )}

        <Collapse.Panel
          key="status"
          header="وضعیت وظیفه"
          extra={
            <AppTag color="blue">
              {
                taskStatus.find((item) => item.value === state.task.status)
                  ?.label
              }
            </AppTag>
          }
        >
          <TaskStatus />
        </Collapse.Panel>

        <Collapse.Panel
          extra={
            <AppTag color="blue">{state.task.members.length + " نفر "}</AppTag>
          }
          key="members"
          header="افراد مرتبط با وظیفه"
        >
          <TaskMembers />
        </Collapse.Panel>

        <Collapse.Panel
          extra={
            <AppTag color="blue">
              {state.task.membersToInform.length + " نفر "}
            </AppTag>
          }
          key="membersToInform"
          header="افراد جهت اطلاع با وظیفه"
        >
          <TaskMembersToInform />
        </Collapse.Panel>

        <Collapse.Panel key="doneDescription" header="توضیحات انجام دهنده">
          <DoneDescription />
        </Collapse.Panel>

        {state?.task?.fileUrl ? (
          <Collapse.Panel header="فایل پیوستی">
            <div className="flex">
              <p>فایل: {state?.task?.fileUrl}</p>
              <AppButton className="mr-2" onClick={downloadConditionFile}>
                دانلود
              </AppButton>
            </div>
          </Collapse.Panel>
        ) : (
          ""
        )}
      </Collapse>
      <NotMyDuty />
      <DoneModal />
      <ReferModal />
    </TaskDetailContext.Provider>
  );
};

export default TaskDetail;
