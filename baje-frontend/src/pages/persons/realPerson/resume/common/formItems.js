import { Col, Form, Input, Select, Spin } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { NationalIdInput } from "modules/personnel/realPerson/service/formItems";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import AppButton from "components/general/AppButton";
import ContractSelector from "components/contractSelector/ContractSelector";
import { useParams } from "react-router-dom";
import AppFormItem from "components/general/AppFormItem";
import {
  getJobsList,
  handleExceptions,
} from "modules/personnel/jobs/common/api";
import { checkShamsi } from "_helpers";
import {
  getChart,
  getChartsList,
} from "modules/personnel/orgCharts/common/api";
import { useSelector } from "react-redux";

const { Option } = Select;

// const PersonnelCode = () => {
//   const rules = [
//     {
//       required: true,
//     },
//   ];

//   return (
//     <Col xs={24} sm={24} md={24} lg={12} xl={6}>
//       <div className="flex">
//         <Form.Item label="کد پرسنلی" name="personnel_code" rules={rules}>
//           <Input type="number" />
//         </Form.Item>
//         <AppButton
//           onClick={createCode}
//           size="large"
//           style={{ marginTop: "16px", marginRight: "-22px" }}
//         >
//           ساخت کد پرسنلی
//         </AppButton>
//       </div>
//     </Col>
//   );
// };

const Person = ({ useForm, setPerson, defaultValue = false, edit = false }) => {
  return (
    <NationalIdInput
      type={edit ? "edit" : "send"}
      codeField="person_personnel_id"
      nameField="person_name"
      name="personnel_id_fk"
      label="شخص"
      url="/api/v1/baje/personnel/national-code/validate"
      form={useForm}
      setData={setPerson}
      isRequired={true}
      defaultValue={defaultValue}
      disabled
    />
  );
};

const Job = ({ selectedChart }) => {
  const rules = [
    {
      required: true,
      message: "شغل الزامی است",
    },
  ];
  const [jobsList, setJobsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartDetails, setChartDetails] = useState();

  useEffect(() => {
    getJobsList()
      .then((res) => {
        setLoading(false);
        if (res?.data && res?.data?.length) {
          const activeJobs = res?.data.filter((i) => i.status);
          const options = activeJobs.map((i) => ({
            label: i.title,
            value: [i.title, i.id],
          }));

          setJobsList(options);
        }
      })
      .catch((err) => {
        setLoading(false);
        handleExceptions(err);
      });
  }, []);

  // listen to selected chart and get chart details and filter jobs based on jobs that are in the selected chart
  useEffect(() => {
    if (selectedChart) {
      setLoading(true);
      getChart(selectedChart).then((res) => {
        setLoading(false);
        const { data } = res;
        setChartDetails([data]);
      });
    }
  }, [selectedChart]);

  // memoize since recursive function is heavy
  const filteredJobsList = useMemo(() => {
    function flat(array) {
      let result = [];
      array.forEach((a) => {
        result.push({ title: a?.title, count: a?.count });
        if (Array.isArray(a.nodes) && a.nodes.length) {
          result = [...result, ...flat(a.nodes)];
        }
      });
      return result;
    }

    if (chartDetails && chartDetails?.[0] && jobsList?.length) {
      const jobDetails = flat(chartDetails);

      const filtered = jobsList.reduce((acc, job) => {
        const findDetail = jobDetails.find(
          (detail) => detail.title == job.label
        );
        if (!findDetail) {
          return acc;
        }

        return [...acc, { ...job, value: [...job.value, findDetail.count] }];
      }, []);

      console.log("filtered:", filtered);
      return filtered;
    }

    return;
  }, [chartDetails, jobsList]);

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Spin spinning={loading}>
        <AppFormItem required label="شغل" name="jobs_id_fk" rules={rules}>
          <Select
            disabled={!selectedChart}
            title={
              selectedChart
                ? ""
                : "برای انتخاب شغل لطفا ابتدا چارت را انتخاب نمایید"
            }
            showSearch
            options={filteredJobsList || []}
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          />
        </AppFormItem>
      </Spin>
    </Col>
  );
};

const Chart = ({ setSelectedChart }) => {
  const rules = [
    {
      required: true,
      message: "چارت الزامی است",
    },
  ];
  const [loading, setLoading] = useState(true);
  const [chartsList, setChartsList] = useState([]);
  const currentOffice = useSelector((state) => state.currentOffice);

  useEffect(() => {
    getChartsList()
      .then((res) => {
        setLoading(false);
        if (res?.data && res?.data?.length) {
          const actives = res?.data.filter((i) => i.enable);
          const options = actives.map((i) => ({
            ...i,
            label: i.title,
            value: i.id,
          }));

          setChartsList(options);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, []);

  function filterByCompany() {
    if (chartsList.length && currentOffice && currentOffice != "-1") {
      return chartsList.filter((i) => i.company_id_fk == currentOffice);
    }
    return chartsList;
  }

  const filterOptions = (input, option) => {
    return (
      option?.children?.toLowerCase?.().includes(input.toLowerCase()) ||
      option.value == input
    );
  };

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Spin spinning={loading}>
        <AppFormItem required label="چارت" name="chart_id_fk" rules={rules}>
          <Select
            showSearch
            options={filterByCompany()}
            onChange={(value) => setSelectedChart(value)}
            filterOption={filterOptions}
          />
        </AppFormItem>
      </Spin>
      <small style={{ marginTop: "-16px", display: "block" }}>
        برای جستجو عنوان یا کد یکتای چارت را وارد کنید
      </small>
    </Col>
  );
};

// const Contract = ({ form, disabled, contractId }) => {
//   const params = useParams();
//   const rules = [
//     {
//       required: true,
//       message: "کد قرارداد اجباری است",
//     },
//   ];

//   return (
//     <Col xs={24} sm={24} md={24} lg={12} xl={6}>
//       <ContractSelector
//         form={form}
//         required
//         label="انتخاب پروژه"
//         name="contract_id_fk"
//         rules={rules}
//         disabled={disabled}
//         officeId={params.id}
//         contractId={contractId}
//         hideInput
//       />
//     </Col>
//   );
// };

const StartDate = ({ useForm, onChange }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ شروع اجباری است",
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (checkShamsi(value, false) && getFieldValue("to_date") < value) {
          return Promise.reject("تاریخ شروع نباید پس از تاریخ پایان باشد");
        }
        return Promise.resolve();
      },
    }),
  ];

  return (
    <CustomDatePicker
      form={useForm}
      label="تاریخ شروع"
      name="from_date"
      rules={rules}
      onChange={onChange}
    />
  );
};

const EndDate = ({ useForm, onChange }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ پایان اجباری است",
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (checkShamsi(value, false) && getFieldValue("from_date") > value) {
          return Promise.reject("تاریخ پایان نباید قبل از تاریخ شروع باشد");
        }
        return Promise.resolve();
      },
    }),
  ];

  return (
    <CustomDatePicker
      form={useForm}
      label="تاریخ پایان"
      name="to_date"
      rules={rules}
    />
  );
};

export { Person, Job, Chart, StartDate, EndDate };
