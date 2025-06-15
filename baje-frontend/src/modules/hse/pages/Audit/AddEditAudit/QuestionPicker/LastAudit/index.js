import AppTable from "components/general/AppTable";
import ContentTop from "components/general/ContentTop";
import { omit } from "lodash";
import { getAudit } from "modules/hse/api/audit";
import React, { useContext, useEffect, useState } from "react";
import { AuditContext } from "../../context";
import { constant } from "../../../../../constant";
import CarPlate from "components/CarPlate";

const LastAudit = () => {
  const [state, setState] = useState({ audits: [], loading: true });
  const {
    toggleSelectQuestion,
    state: parentState,
    setState: setParentState,
  } = useContext(AuditContext);

  useEffect(() => {
    loadAudit();
  }, []);

  const loadAudit = async () => {
    try {
      const { data } = await getAudit();
      setState((s) => ({ ...s, audits: data, loading: false }));
    } catch (error) {
      setState((s) => ({ ...s, loading: false }));
      console.log(error.message);
    }
  };

  const loadAuditDetail = async (audit) => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const { data } = await getAudit(audit.id);
      // toggleSelectQuestion(
      //   data.questions.map((item) => ({
      //     ...omit(item, ["answer", "audit_id_fk"]),
      //     id: item.question_id_fk,
      //   }))
      // );
      setParentState((s) => ({
        ...s,
        selectedQuestions: data.questions.map((item) => ({
          ...omit(item, ["answer", "audit_id_fk"]),
          id: item.question_id_fk,
        })),
        minimumPoint: data.audit.minimum_point,
        questionPicker: false,
      }));
    } catch (error) {
      console.log(error.message);
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  };

  return (
    <>
      <ContentTop noBack title="انتخاب چک لیست" />
      <AppTable
        loading={state.loading}
        rowSelection={{
          onSelect: (audit) => {
            loadAuditDetail(audit);
          },
          hideSelectAll: true,
          type: "radio",
        }}
        dataSource={state.audits
          .map((item) => ({ ...item, key: item.id }))
          .filter((item) =>
            parentState.group === constant.inidividual
              ? item.first_name || item.last_name
              : parentState.group === constant.vehicle
              ? item.plaque1 || item.plaque2 || item.plaque3 || item.plaque4
              : false
          )}
        columns={[
          { title: "آیدی", dataIndex: "id" },
          {
            title: "عنوان بازرسی",
            render: (data) =>
              data.first_name || data.last_name ? (
                `بازرسی مربوط به آقا/خانم ${data.first_name} ${data.last_name}`
              ) : data.plaque1 || data.plaque2 ? (
                <CarPlate
                  plaque1={data.plaque1}
                  plaque2={data.plaque2}
                  plaque3={data.plaque3}
                  plaque4={data.plaque4}
                />
              ) : (
                ""
              ),
          },
        ]}
      />
    </>
  );
};

export default LastAudit;
