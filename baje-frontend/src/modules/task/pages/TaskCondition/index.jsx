import AppSwitch from "components/general/AppSwitch";
import AppTable from "components/general/AppTable";
import ContentTop from "components/general/ContentTop";
import TableActions from "components/general/TableActions";
import MenuInlineBtn from "components/MenuInlineBtn";
import { pageNames } from "constant";
import {
  deleteTaskCondition,
  getTaskConditions,
  patchTaskCondition,
} from "modules/task/api/taskCondition";
import React, { useEffect, useReducer, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { stringifyUrl } from "query-string";
import ResponsiveList from "components/general/ResponsiveList";
import { Modal } from "antd";
import qs from "query-string";
const actions = {
  setTaskConditions: "setTaskConditions",
  setLoading: "setLoading",
};

const initialState = {
  taskConditions: [],
  loading: true,
};

/**
 *
 * @param { {type:string, payload:any} } action - action
 * @returns
 */
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.setTaskConditions:
      return {
        ...state,
        loading: false,
        taskConditions: action.payload,
      };
    case actions.setLoading:
      return {
        ...state,
        loading: action.payload,
      };

    default:
      break;
  }
};

const TaskCondition = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { push } = useHistory();
  const location = useLocation();
  const searchParams = qs.parse(location.search);
  const [tableInfo, setTableInfo] = useState({
    pagination: {
      current: searchParams.page ? +searchParams.page : 1,
      defaultPageSize: 20,
    },
  });

  useEffect(() => {
    loadTaskCondition();
  }, []);

  const loadTaskCondition = async () => {
    try {
      const { data } = await getTaskConditions();
      dispatch({ type: actions.setTaskConditions, payload: data });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDelete = async (taskCondition) => {
    try {
      await deleteTaskCondition(taskCondition);
      dispatch({
        type: actions.setTaskConditions,
        payload: state.taskConditions.filter(
          (item) => item.id !== taskCondition.id
        ),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = ({ id }) => {
    push(
      stringifyUrl({
        url: pageNames.task.taskCondtion.create,
        query: { id },
      })
    );
  };

  const handelChangeConditionStatus = async (taskCondition, params) => {
    try {
      dispatch({ type: actions.setLoading, payload: true });
      const formData = new FormData();
      formData.append("id", taskCondition.id);
      formData.append("enable", !params ? 1 : 0);

      await patchTaskCondition(taskCondition.id, formData);
      loadTaskCondition();
      dispatch({ type: actions.setLoading, payload: false });
    } catch (error) {
      console.log(error.message);
    }
  };

  const mobileItemActions = [
    { name: "ویرایش", onClick: (record) => handleEdit(record) },
    {
      name: "حذف",
      onClick: (record) =>
        Modal.confirm({
          onOk: () => handleDelete(record),
          content: "آیا از حذف این مورد اطمینان دارید؟",
        }),
    },
  ];

  return (
    <>
      <ContentTop noBack title="لیست شروط" />
      <MenuInlineBtn
        list={[
          { label: "ساخت شرط جدید", url: pageNames.task.taskCondtion.create },
        ]}
      />
      <ResponsiveList
        dataSource={state.taskConditions}
        loading={state.loading}
        titleKeys={["title"]}
        itemActions={mobileItemActions}
        pagination={{ defaultPageSize: 20 }}
        // tableInfo={tableInfo}
        // setTableInfo={setTableInfo}
        columns={[
          { title: "شناسه", dataIndex: "id" },
          { title: "عنوان", dataIndex: "title" },
          // {
          //   title: "نوع الگوی وظیفه",
          //   dataIndex: "condition",
          //   render: (data) =>
          //     data.length > 0 ? "وضعیت یک سلول" : "وظیفه تکراری",
          // },
          {
            title: "امتیاز",
            dataIndex: "point",
            render: (data) => <p className="text-success">{data}</p>,
          },

          {
            title: "نمره منفی",
            dataIndex: "negativePoint",
            render: (data) => <p className="text-danger">{data}</p>,
          },
          {
            title: "وضعیت",
            dataIndex: "enable",
            render: (data, record) => (
              <AppSwitch
                checked={!!data}
                onChange={() => handelChangeConditionStatus(record, data)}
                title={record.enable ? "فعال" : "غیرفعال"}
              />
            ),
          },
          {
            title: "ابزار",
            render: (data) => (
              <TableActions
                list={[
                  { name: "delete", onClick: () => handleDelete(data) },
                  { name: "edit", onClick: () => handleEdit(data) },
                ]}
              />
            ),
          },
        ]}
      />
    </>
  );
};

export default TaskCondition;
