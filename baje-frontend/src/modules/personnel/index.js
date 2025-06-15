import React from "react";
//-------------------realPerson-----------------
import realPerson from "./realPerson";
import service from "./realPerson/service";
import examination from "./realPerson/examination";
import checkout from "./realPerson/checkout";
import recordClaim from "./realPerson/recordClaim";
import leaveRequest from "./realPerson/leaveRequest";
import loanRequest from "./realPerson/loanRequest";
import mission from "./realPerson/mission";
//---------------------rightFull--------------------------
import rightFull from "./rightFull";
//---------------------settings--------------------------
import settings from "./annualSettings";
//--------------------doctor----------------------------
import doctor from "./doctor";
//-----------------------accident-------------------------------
import accidentReport from "./accidentReport";
//-----------------------------SupplementaryInsurance----------------------------------
import SupplementaryInsurance from "./SupplementaryInsurance";
import SupplementaryInsurancePerson from "./SupplementaryInsurance/person";
import SupplementaryInsurancePersonDeductions from "./SupplementaryInsurance/deductions";
//-----------------------------AccidentInsurance----------------------------------
import AccidentInsurance from "./AccidentInsurance";
import AccidentInsurancePerson from "./AccidentInsurance/person";
import AccidentInsurancePersonDeductions from "./AccidentInsurance/deductions";

//-----------------------------SocialInsurance----------------------------------
import socialInsurancePersonnel from "./socialInsurance/socialInsurancePersonnel";
//-----------------------CONTEXT-------------------------------
import AccidentInsuranceProvider from "./AccidentInsurance/util/AccidentInsuranceContext";

//------------------------------------SocialInsurance-----------------------------------------------
import socialInsurance from "./socialInsurance";
import socialInsurancePayment from "./socialInsurance/payment";
import jobs from "./jobs/index";
import shiftWork from "./shiftwork/index";
import charts from "./orgCharts/index";
import boardMembers from "./boardMembers/index";
//------------------------------------Insurance-----------------------------------------------

const route = () => {
  return (
    <>
      {[
        ...realPerson.route(),
        ...accidentReport.route(),
        ...service.route(),
        ...examination.route(),
        ...checkout.route(),
        ...recordClaim.route(),
        ...leaveRequest.route(),
        ...loanRequest.route(),
        ...mission.route(),
        ...rightFull.route(),
        ...doctor.route(),
        ...settings.route(),
        ...jobs.route(),
        ...shiftWork.route(),
        ...charts.route(),
        ...boardMembers.route(),
        ...socialInsurance.route(),
        ...socialInsurancePayment.route(),
        ...socialInsurancePersonnel.route(),
        ...SupplementaryInsurance.route(),
        ...SupplementaryInsurancePerson.route(),
        ...SupplementaryInsurancePersonDeductions.route(),
      ]}
      <AccidentInsuranceProvider>
        {[
          ...AccidentInsurance.route(),
          ...AccidentInsurancePerson.route(),
          ...AccidentInsurancePersonDeductions.route(),
        ]}
      </AccidentInsuranceProvider>
    </>
  );
};

export default {
  route,
};
