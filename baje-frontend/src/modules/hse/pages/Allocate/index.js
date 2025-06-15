import ContentTop from "components/general/ContentTop";
import React, { useEffect, useState } from "react";
import { Steps } from "antd";
import { getQuestions } from "modules/hse/api/question";
import { AllocateContext } from "./context";
import AllocateStep1 from "./Step1";
import AllocateStep2 from "./Step2";
import AllocateStep3 from "./Step3";
import { constant } from "modules/hse/constant";

const Allocate = () => {
  const [state, setState] = useState({
    step: 0,
    group: constant.inidividual,
    personnelId: -1,
    environmentId: -1,
    vehicleId: -1,
    questions: [],
    selectedQuestions: [],
  });

  useEffect(() => {
    loadQuestoins();
  }, []);

  const loadQuestoins = async () => {
    try {
      const { data } = await getQuestions();
      setState((s) => ({ ...s, questions: data }));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <AllocateContext.Provider value={{ state, setState }}>
      <ContentTop title="اختصاص دادن سوال به موجودیت" noBack />
      <Steps current={state.step} size="small" responsive>
        <Steps.Step title="انتخاب نوع موجودیت" />
        <Steps.Step title="انتخاب سوالات" />
        <Steps.Step title="تکمیل فرم" />
      </Steps>
      {state.step === 0 && <AllocateStep1 />}
      {state.step === 1 && <AllocateStep2 />}
      {state.step === 2 && <AllocateStep3 />}
    </AllocateContext.Provider>
  );
};

export default Allocate;
