import AppButton from "components/general/AppButton";
import AppRadioGroup from "components/general/AppRadioGroup";
import { constant, questionGroups } from "modules/hse/constant";
import Person from "modules/hse/pages/Allocate/Step1/Person";
import React, { useContext } from "react";
import { AllocateContext } from "../context";
import Vehicle from "./Vehicle";

const AllocateStep1 = () => {
  const { state, setState } = useContext(AllocateContext);

  const onChangeType = ({ target }) => {
    setState((s) => ({
      ...s,
      group: target.value,
      personnelId: -1,
      vehicleId: -1,
      environmentId: -1,
    }));
  };

  const handleNext = () => {
    setState((s) => ({ ...s, step: 1 }));
  };

  return (
    <>
      <div className="flex row justify-center my-4">
        <AppRadioGroup
          value={state.group}
          onChange={onChangeType}
          options={questionGroups.map((item) => ({
            label: item.text,
            value: item.value,
          }))}
        />
      </div>
      {state.group === constant.inidividual && <Person />}
      {state.group === constant.vehicle && <Vehicle />}

      <div className="flex row justify-end">
        <AppButton
          variant="primary"
          disabled={
            !state.group ||
            (state.group === constant.inidividual && state.personnelId <= 0) ||
            (state.group === constant.vehicle && state.vehicleId <= 0) ||
            (state.group === constant.environment && state.environmentId <= 0)
          }
          onClick={handleNext}
        >
          بعدی
        </AppButton>
      </div>
    </>
  );
};

export default AllocateStep1;
