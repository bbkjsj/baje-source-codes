import * as api from "./api";
import * as ParentApi from "../../util/api";
import { message } from "antd";
import { getMonthDaysByMonth, covetFormatDateToFA } from "_helpers";

export const getInsurance = (id, setLoading, setData) => {
  setLoading(true);
  return ParentApi._GET_SOCIALINSURANCE(id)
    .then((res) => {
      setData(res.data);
      setLoading(false);
      return res;
    })
    .catch((error) => {
      message.error("دریافت اطلاعات با مشکل مواجه شده است.");
      setLoading(false);
    });
};

export const getPersonsList = (
  id,
  loading,
  setLoading,
  setExportKey,
  setList
) => {
  if (!loading) {
    setLoading(true);
  }
  return api
    ._GET(id)
    .then((res) => {
      const withFullName = res.data.list.map((item) => {
        return { ...item, full_name: item.first_name + " " + item.last_name };
      });

      setList(withFullName);
      if (res?.data?.hash) {
        setExportKey(res.data.hash);
      }
      setLoading(false);
    })
    .catch((err) => {
      message.error("دریافت اطلاعات با مشکل مواجه شده است.");
      setLoading(false);
    });
};

export const FindCurrentAnnual = (annual, insurance) => {
  const currentAnnual = annual.find((el) => el.year == insurance.year);
  return currentAnnual;
};
export const setEditFormInitialValues = (
  form,
  data,
  setFirstRender,
  setDefaultPerson,
  setDefaultJob,
  setMonthlySalary,
  setInsuredShare,
  setEmployerShare,
  setJoblessShare,
  setHardJobShare,
  setTotalShare,
  setMember,
  setSalaryBenefitInclude
) => {
  form.setFieldsValue({
    start_date: data?.start_date ? covetFormatDateToFA(data.start_date) : null,
    end_date: data?.end_date ? covetFormatDateToFA(data.end_date) : null,
    total_work_day: data?.total_work_day,
    daily_salary: data?.daily_salary,
    include_benefit: data?.include_benefit,
    salary_benefit_include_notinclude: data.salary_benefit_include_notinclude,
    description: data?.description,
  });

  setMember({
    id: data.personnel_id_fk,
    insurance_number: data.insurance_number,
    job_id: data.job_id_fk,
  });
  setDefaultPerson(data.national_number);
  setDefaultJob(data.job_code);
  setMonthlySalary(data.monthly_salary);
  setInsuredShare(data.insured_share);
  setEmployerShare(data.employer_share);
  setJoblessShare(data.jobless_share);
  setHardJobShare(data.hard_job_share);
  setTotalShare(data.total_share);
  setSalaryBenefitInclude(data.salary_benefit_include);
  setFirstRender(false);

  // console.log(form.getFieldsValue(), "!form");
};

export const setAddFormInitialValues = (
  annual,
  insurance,
  form,
  setMonthlySalary,
  setSalaryBenefitInclude,
  setFirstRender
) => {
  if (annual && annual.length > 0 && insurance) {
    const currentAnnual = FindCurrentAnnual(annual, insurance);
    const initialTotalWorkDay = getMonthDaysByMonth(insurance?.month);
    const initialDailySalary = currentAnnual.min_daily_salary;
    const initialMonthlySalary = initialTotalWorkDay * initialDailySalary;
    const initialIncludBenefit =
      parseFloat(currentAnnual.housing) + parseFloat(currentAnnual.bonus);
    const initialSalaryBenfitInclude =
      parseFloat(initialMonthlySalary) + parseFloat(initialIncludBenefit);

    form.setFieldsValue({
      total_work_day: initialTotalWorkDay,
      daily_salary: initialDailySalary,
      include_benefit: initialIncludBenefit,
    });
    setMonthlySalary(initialMonthlySalary);
    setSalaryBenefitInclude(initialSalaryBenfitInclude);
    setFirstRender(false);
  }
};

export const updateMonthlySalary = (form, setMonthlySalary) => {
  const days = form.getFieldValue("total_work_day");
  const dailySalary = form.getFieldValue("daily_salary");
  const monthlySalary = days && dailySalary ? days * dailySalary : 0;
  setMonthlySalary(monthlySalary);
};

export const updateSalaryBenefitInclude = (
  form,
  monthlySalary,
  setSalaryBenefitInclude
) => {
  // console.log("!up-salary-ben");
  const includeBenefit = form.getFieldValue("include_benefit");
  const salaryBenefitInclude =
    parseFloat(monthlySalary ? monthlySalary : 0) +
    parseFloat(includeBenefit ? includeBenefit : 0);
  setSalaryBenefitInclude(salaryBenefitInclude);
};

export const addMemberHandler = (
  body,
  member,
  selectedJob,
  shouldExit,
  setExitBtnLoading,
  setNextBtnLoading,
  history
) => {
  if (member.job_id !== selectedJob) {
    const serverData = {
      id: body.personnel_id,
      payload: { job_id: body.job_id_fk },
    };

    // console.log(serverData , '!serverData');
    api
      ._PUT_JOB(serverData)
      .then(() => {
        console.log("!success");
      })
      .catch((err) => message.error("خطا در ثبت شغل برای کاربر!"));
  }

  // submit
  shouldExit ? setExitBtnLoading(true) : setNextBtnLoading(true);
  // console.log(body, '!body');

  api
    ._POST(body)
    .then((res) => {
      shouldExit ? setExitBtnLoading(false) : setNextBtnLoading(false);
      message.success("با موفقیت ثبت شد");
      shouldExit
        ? history.goBack()
        : setTimeout(() => window.location.reload(), 100);
    })
    .catch((err) => {
      console.error(err);
      if (err.response.data && err.response.data === "duplicate person") {
        message.error("این شخص در لیست موجود می باشد");
      } else {
        message.error(
          "عملیات ناموفق، لطفا ورودی های خود را چک کنید و مجددا تلاش کنید"
        );
      }
      shouldExit ? setExitBtnLoading(false) : setNextBtnLoading(false);
    });
};

export const updateMemberHandler = (
  body,
  member,
  selectedJob,
  shouldExit,
  setExitBtnLoading,
  setNextBtnLoading,
  history,
  setModalVisible,
  mainId
) => {
  console.log(member, "!member");
  console.log(selectedJob, "!selected job");
  if (member.job_id !== selectedJob) {
    const serverData = {
      id: body.personnel_id,
      payload: { job_id: body.job_id_fk },
    };

    console.log(serverData, "!serverData");
    api
      ._PUT_JOB(serverData)
      .then(() => {
        console.log("!success");
      })
      .catch((err) => message.error("خطا در ثبت شغل برای کاربر!"));
  }

  // submit
  setExitBtnLoading(true);
  console.log(body, "!body");

  api
    ._PUT(mainId, body)
    .then((res) => {
      setExitBtnLoading(false);
      message.success("با موفقیت ثبت شد");
      //
      setModalVisible(false);
      history.go();
    })
    .catch((err) => {
      console.error(err);

      message.error(
        "عملیات ناموفق، لطفا ورودی های خود را چک کنید و مجددا تلاش کنید"
      );

      setExitBtnLoading(false);
    });
};
