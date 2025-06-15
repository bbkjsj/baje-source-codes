import AppTable from "components/general/AppTable";
import ContentTop from "components/general/ContentTop";
import GoBackBtn from "components/GoBackBtn";
import { pageNames } from "constant";
import { getTaskCartboard } from "modules/task/api/task";
import {
  constant,
  ifTaskFailed,
  taskPriority,
  taskPunishment,
  taskStatus,
} from "modules/task/constant";
import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import moment from "moment-jalaali";
import TableActions from "components/general/TableActions";
import { getLink } from "_helpers";
import AppTag from "components/general/AppTag";
import AppButton from "components/general/AppButton";
import { Modal } from "antd";
import { columns } from "./../../../../pages/persons/realPerson/list/columns";
import ResponsiveList from "components/general/ResponsiveList";
import colors from "utils/colors";

const Tasks = () => {
  const { params } = useRouteMatch();
  const [state, setState] = useState({ tasks: [], loading: true });
  const { push } = useHistory();
  const { status } = params;

  useEffect(() => {
    laodTasks();
  }, []);

  const laodTasks = async () => {
    try {
      const { data: tasks } = await getTaskCartboard(status);
      setState((s) => ({ ...s, loading: false, tasks }));
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleTaskDetail = (task) => {
    push(getLink(pageNames.task.detail, { id: task.id, role: status }), {
      task,
    });
  };

  const handleCreateTask = () => {
    push(pageNames.task.create);
  };

  const handleShowDescription = (content, record) => {
    Modal.info({
      content,
      centered: true,
      closable: true,
      maskClosable: true,
      okCancel: false,
      title: `جزئیات ${record.title}`,
    });
  };

  const columns = [
    { title: "شماره", dataIndex: "id" },
    {
      title: "تاریخ ایجاد",
      dataIndex: "created_at",
      render: (data) => moment(data).format("jYYYY/jMM/jDD"),
    },
    { title: "عنوان", dataIndex: "title" },
    {
      title: "نحوه ایجاد",
      dataIndex: "taskType",
      render: (data) =>
        data === constant.independent
          ? "مستقیما"
          : data === constant.chained
          ? "سیستمی"
          : "",
    },
    {
      title: "ایجاد کننده",
      dataIndex: "creatorFirstName",
      render: (_, record) => {
        return record?.creatorFirstName ? record?.creatorFirstName + " " + record?.creatorLastName : "-";
      },
    },
    {
      title: "مهلت انجام",
      dataIndex: "dueDate",
      render: (data) => moment(data).format("jYYYY/jMM/jDD"),
    },
    {
      title: "در صورت عدم انجام",
      dataIndex: "ifTaskFailed",
      render: (data) => ifTaskFailed.find((item) => item.value === data)?.label,
    },
    {
      title: "اهمیت",
      dataIndex: "priority",
      render: (data) => taskPriority.find((item) => item.value === data)?.label,
    },
    {
      title: "تنبیه",
      dataIndex: "punishment",
      render: (data) =>
        taskPunishment.find((item) => item.value === data)?.label,
    },
    {
      title: "امکان ارجاع",
      dataIndex: "referable",
      render: (data) => (!!data ? "دارد" : "ندارد"),
    },
    {
      title: "امتیاز",
      dataIndex: "point",
    },
    {
      title: "امتیاز منفی",
      dataIndex: "negativePoint",
    },
    // {
    //   title: "وظیفه وابسته",
    //   dataIndex: "relatedTask",
    //   render: (data) =>
    //     !data ? (
    //       <p className="text-danger">ندارد</p>
    //     ) : (
    //       <p className="text-success">دارد</p>
    //     ),
    // },
    {
      title: "وضعیت",
      dataIndex: "status",
      render: (data) => (
        <AppTag>{taskStatus.find((item) => item.value === data)?.label}</AppTag>
      ),
    },
    {
      title: "آدرس صفحه مرتبط",
      dataIndex: "pageurl",
      render: (data) =>
        data && data !== "undefined" ? (
          <AppTag className="pointer" onClick={() => handleOpenPageUrl(data)}>
            لینک
          </AppTag>
        ) : (
          "-"
        ),
    },
    {
      dataIndex: "description",
      render: (data, record) => (
        <AppButton
          type="link"
          onClick={() => handleShowDescription(data, record)}
        >
          شرح وظیفه
        </AppButton>
      ),
    },
    {
      render: (data) => (
        <TableActions
          list={[{ name: "detail", onClick: () => handleTaskDetail(data) }]}
        />
      ),
    },
  ];

  const mobileItemActions = [
    {
      name: "مشاهده",
      onClick: (record) => handleTaskDetail(record),
    },
    {
      name: "شرح وظیفه",
      onClick: (record) => handleShowDescription(record.description, record),
    },
  ];
  const handleOpenPageUrl = (pageUrl) => {
    window.location.assign(pageUrl);
  };

  return (
    <>
      <ContentTop
        breadcrumbItems={[
          { text: "کارتابل ها", link: pageNames.task.cardBoards },
        ]}
        title="وظیفه ها"
      />
      <GoBackBtn />
      {/* <MenuInlineBtn
        list={[{ label: "ساخت وظیفه جدید", handleClick: handleCreateTask }]}
      /> */}
      <ResponsiveList
        dataSource={state.tasks}
        loading={state.loading}
        columns={columns}
        titleKeys={["title"]}
        itemActions={mobileItemActions}
        pagination={{ defaultPageSize: 20 }}
        rowClassName={(record, index) => {
          return !record.readOn ? "bg-active" : null;
        }}
        mobileItemColors={(record) => {
          if (!record.readOn) {
            return "#2ecc71";
          } 
          return colors.primary;
        }}
      />
    </>
  );
};

export default Tasks;
