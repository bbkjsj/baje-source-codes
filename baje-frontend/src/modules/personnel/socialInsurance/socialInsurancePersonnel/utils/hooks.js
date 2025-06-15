import { useState, useEffect } from "react";
import * as api from "./api";
import * as ParentApi from "../../util/api";
import { message } from "antd";
import { useParams } from "react-router-dom";
import { getInsurance, getPersonsList } from "./index";
import { _GET as _get_annual } from "modules/personnel/annualSettings/utils/api";
import { getMonthDaysByMonth } from "_helpers";
import { setAddFormInitialValues, setEditFormInitialValues } from "./index";

export const useInsurancePageInfo = () => {
  const [loading, setLoading] = useState(false);
  const [exportKey, setExportKey] = useState(null);
  const [insurance, setInsurance] = useState(null);
  const [list, setList] = useState([]);
  const routeParams = useParams();

  const updatePageData = () => {
    const id = routeParams.id;
    getInsurance(id, setLoading, setInsurance)
      .then(() => {
        getPersonsList(id, loading, setLoading, setExportKey, setList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    updatePageData();
  }, []);

  return {
    insurance,
    loading,
    exportKey,
    list,
    setLoading,
    updatePageData,
  };
};

export const useDeleteAllPersons = () => {
  const [loading, setLoading] = useState(false);

  const deleteAllPersons = (id, updateInfo) => {
    setLoading(true);
    api
      ._DELETE_All(id)
      .then((res) => {
        setLoading(false);
        updateInfo();
        message.success("عملیات با موفقیت انجام شد");
      })
      .catch((err) => {
        setLoading(false);
        message.error("عملیات ناموفق، لطفا مجددا تلاش کنید");
        console.error(err);
      });
  };

  return {
    loading,
    deleteAllPersons,
  };
};

export const useGetPersonFormData = (form, mode, initialData, modalVisible) => {
  // variables:
  const routeParams = useParams();
  const [loading, setLoading] = useState(false);
  const [insuranceGeneral, setInsuranceGeneral] = useState(null);
  const [annual, setAnnual] = useState([]);
  const [companyPersonnel, setCompanyPersonnel] = useState([]);
  const [insuredList, setInsuredList] = useState([]);
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [salaryBenefitInclude, setSalaryBenefitInclude] = useState(0);
  const [firstRender, setFirstRender] = useState(true);
  const [defaultJob, setDefaultJob] = useState(null);
  const [defaultPerson, setDefaultPerson] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [insuredShare, setInsuredShare] = useState(0);
  const [employerShare, setEmployerShare] = useState(0);
  const [joblessShare, setJoblessShare] = useState(0);
  const [hardJobShare, setHardJobShare] = useState(0);
  const [totalShare, setTotalShare] = useState(0);
  const [member, setMember] = useState(null);

  // funstions:
  const getAddFormData = async () => {
    const res = await api._GET_COMPANY_ID(routeParams.id);
    const companyId = res?.data?.company_id;
    //
    Promise.all([
      // get general info about insurance
      getInsurance(routeParams.id, setLoading, setInsuranceGeneral),
      // get minsalary for calc default salary and bounes
      _get_annual(),
      // get company personnel to check selected person is in it
      api._GET_COMPANY_PERSONNEL(companyId),
      // get insured person to pervent duplicate person
      api._GET(routeParams.id),
    ])
      .then(([res1, res2, res3, res4]) => {
        const insuranceGeneralInfo = res1.data;
        const annualInfo = res2.data;
        const personnelInfo = res3.data.list;
        const insuredListInfo = res4.data.list;

        setAnnual(insuranceGeneralInfo);
        setCompanyPersonnel(personnelInfo.map((el) => el.id));
        setInsuredList(insuredListInfo.map((el) => el.personnel_id_fk));

        setAddFormInitialValues(
          annualInfo,
          insuranceGeneralInfo,
          form,
          setMonthlySalary,
          setSalaryBenefitInclude,
          setFirstRender
        );
      })
      .catch((err) => {
        console.log(err, "!er");
        message.error("خطا در دریافت اطلاعات ");
      });
  };

  const getEditFormData = async () => {
    setFirstRender(true);
    getInsurance(routeParams.id, setLoading, setInsuranceGeneral)
      .then((res) => {
        setEditFormInitialValues(
          form,
          initialData,
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
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getData = () => {
    const request = mode === "add" ? getAddFormData : getEditFormData;
    request();
  };

  const resetData = () => {
    console.log("!reset");
    form.resetFields();
    setDefaultPerson(null);
    setDefaultJob(null);
    setMonthlySalary(0);
    setInsuredShare(0);
    setEmployerShare(0);
    setJoblessShare(0);
    setHardJobShare(0);
    setTotalShare(0);
    setSalaryBenefitInclude(0);
    setFirstRender(true);
  };

  useEffect(() => {
    if (mode !== "add") {
      if (modalVisible) {
        (async function () {
          await getData();
        })();
      } else {
        resetData();
      }
    }
  }, [modalVisible]);

  useEffect(() => {
    if (mode === "add") {
      (async function () {
        await getData();
      })();
    }
  }, []);

  return {
    loading,
    insuranceGeneral,
    annual,
    companyPersonnel,
    insuredList,
    monthlySalary,
    setMonthlySalary,
    salaryBenefitInclude,
    setSalaryBenefitInclude,
    firstRender,
    setFirstRender,
    defaultPerson,
    defaultJob,
    selectedJob,
    setSelectedJob,
    insuredShare,
    employerShare,
    joblessShare,
    hardJobShare,
    totalShare,
    setInsuredShare,
    setEmployerShare,
    setJoblessShare,
    setHardJobShare,
    setTotalShare,
    member,
    setMember,
  };
};
