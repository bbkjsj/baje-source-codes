import ContentTop from "components/general/ContentTop";
import React, { useEffect, useState } from "react";
import api from "api/appAxios";
import AppTable from "components/general/AppTable";
import TableActions from "components/general/TableActions";
import { messages, showMessage } from "utils/message";
import moment from "moment-jalaali";

const Hse = ({ data }) => {
  const { first_name, last_name, id } = data;
  const [state, setState] = useState({ questions: [], loading: true });

  useEffect(() => {
    loadQuestiuons();
  }, []);

  const loadQuestiuons = async () => {
    try {
      const { data } = await api.get(`api/v1/baje/hse/allocate`, {
        params: { pid: id },
      });
      setState((s) => ({ ...s, questions: data, loading: false }));
    } catch (error) {
      console.log(error.message);
      setState((s) => ({ ...s, loading: false }));
    }
  };

  const handleDelete = async (data, questionIndx) => {
    try {
      setState((s) => ({
        ...s,
        loading: true,
      }));
      await api.delete(`api/v1/baje/hse/allocate/${data.id}`);
      showMessage(messages.deletedSuccessfully(), "success");
      setState((s) => ({
        ...s,
        questions: s.questions.filter((item, index) => index !== questionIndx),
        loading: false,
      }));
    } catch (error) {
      setState((s) => ({
        ...s,
        loading: false,
      }));
      console.log(error.message);
    }
  };

  return (
    <>
      <ContentTop
        noBack
        title={`سوالاتی که باید از ${first_name} ${last_name} پرسیده شود.`}
      />
      <AppTable
        loading={state.loading}
        dataSource={state.questions}
        columns={[
          { title: "آیدی", dataIndex: "id" },
          { title: "سوال", dataIndex: "question" },
          { title: "حالت بحرانی", dataIndex: "critical" },
          {
            title: "از تاریخ",
            dataIndex: "from_date",
            render: (data) => moment(data).format("jYYYY/jM/jD"),
          },
          {
            title: "تا تاریخ",
            dataIndex: "to_date",
            render: (data) => moment(data).format("jYYYY/jM/jD"),
          },

          {
            render: (data, record, index) => (
              <TableActions
                list={[
                  {
                    name: "delete",
                    onClick: () => {
                      handleDelete(data, index);
                    },
                  },
                ]}
              />
            ),
          },
        ]}
      />
    </>
  );
};

export default Hse;
