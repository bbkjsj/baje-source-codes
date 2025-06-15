import AppButton from "components/general/AppButton";
import AppTable from "components/general/AppTable";
import ResponsiveList from "components/general/ResponsiveList";
import { questionGroups, questionTypes } from "modules/hse/constant";
import React, { useContext, useState } from "react";
import { AllocateContext } from "../context";

const AllocateStep2 = () => {
  const { state, setState } = useContext(AllocateContext);
  const [mobileSelection, setMobileSelection] = useState([]);
  const handlePrevious = () => {
    setState((s) => ({
      ...s,
      step: 0,
      selectedQuestions: [],
      personnelId: -1,
      vehicleId: -1,
      environmentId: -1,
    }));
  };

  const handleNext = () => {
    setState((s) => ({ ...s, step: 2 }));
  };

  const handleMobileSelection = (selected) => {
    setMobileSelection(selected);
    const findQuestion = state.questions.find(
      (item) => item.id === selected[0]
    );
    if (findQuestion) {
      setState((s) => ({ ...s, selectedQuestions: [findQuestion] }));
    } else {
      setState((s) => ({ ...s, selectedQuestions: [] }));
    }
  };

  return (
    <>
      <ResponsiveList
        rowSelection={{
          onChange: (selectedKeys, selectedQuestions) => {
            setState((s) => ({ ...s, selectedQuestions }));
          },
          hideSelectAll: true,
        }}
        dataSource={state.questions
          .filter((item) => item.group === state.group)
          .filter((item) =>
            state.selectedQuestions.length === 0
              ? item.type
              : item.type === state.selectedQuestions[0].type
          )
          .map((item) => ({ ...item, key: item.id }))}
        columns={[
          { title: "شماره شناسایی", dataIndex: "code" },
          { title: "سوال", dataIndex: "question" },
          {
            title: "گروه ممیزی",
            dataIndex: "group",
            render: (data) =>
              questionGroups.find((item) => item.value === data)?.text,
          },
          {
            title: "نوع ممیزی",
            dataIndex: "type",
            render: (data) =>
              questionTypes.find((item) => item.value === data)?.label,
          },
        ]}
        pagination={{ defaultPageSize: 20 }}
        titleKeys={["code"]}
        onSelectedChange={handleMobileSelection}
        selected={mobileSelection}
      />
      <div className="flex justify-end ">
        <AppButton variant="danger" onClick={handlePrevious} className="mx-2">
          قبلی
        </AppButton>
        <AppButton
          onClick={handleNext}
          disabled={state.selectedQuestions.length === 0}
        >
          بعدی
        </AppButton>
      </div>
    </>
  );
};

export default AllocateStep2;
