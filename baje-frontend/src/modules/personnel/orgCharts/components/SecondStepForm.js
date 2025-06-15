import { Form, Row, Spin } from "antd";
import React, { useState, useRef, useEffect } from "react";
import * as fields from "../common/formItems";
import { useHistory, useLocation, useParams } from "react-router-dom";
import OrgChart from "./OrgChart/OrgChart";
import AppButton from "components/general/AppButton";
import { generateChartDetailsView } from "../chartsView";
import {
  getJobInsuranceCodes,
  getJobsList,
  handleExceptions,
} from "modules/personnel/jobs/common/api";
////////////////////////////////////////////////////////

const SecondStepForm = ({ onFinish, chartDetails, updating, isFirstChart }) => {
  const formItemLayout = {
    labelCol: { span: 24 },
    colon: false,
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      lg: { span: 22 },
    },
  };
  const orgchart = useRef();

  const [mainForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const initialNewNodes = {
    job: "",
    people_count: "",
    job_code: "",
  };
  const [newNodes, setNewNodes] = useState(initialNewNodes);
  // only used to determine if print button should be disabled
  const [ds, setDs] = useState();
  const [jobsList, setJobsLIst] = useState([]);
  const [jobsOptions, setJobsOptions] = useState([]);

  useEffect(() => {
    getJobsList()
      .then((res) => {
        setLoading(false);
        if (res?.data && res?.data?.length) {
          setJobsLIst(res?.data);
          const activeJobs = res?.data.filter((i) => i.status);
          let options = activeJobs.map((i) => ({
            label: i.title,
            value: [i.title, i.id],
          }));

          // remove root node
          if (isFirstChart) {
            options = options.filter((i) => i.label !== "مدیر عامل");
          } else {
            options = options.filter(
              (i) => i.label !== "مدیر پروژه" && i.label !== "مدیر عامل"
            );
          }

          setJobsOptions(options);
        }
      })
      .catch((err) => {
        setLoading(false);
        handleExceptions(err);
      });
  }, []);

  const handleOnChange = (values) => {
    const changedKey = Object.keys(values)[0];
    setNewNodes((prev) => {
      return { ...prev, [changedKey]: values[changedKey] };
    });
    if (changedKey === "job") {
      mainForm.setFieldsValue({ job_code: undefined });
    }
  };

  const handleOnFinish = (params) => {};

  const submitChart = () => {
    if (ds && ds?.children?.length) onFinish(ds);
  };

  const printChart = () => {
    orgchart.current.exportTo("organizational_chart", "pdf");
  };

  const [initialData, setInitialData] = useState({
    id: "1",
    root: true,
    children: [],
  });

  useEffect(() => {
    // set chart data if is updating
    if (chartDetails) {
      setInitialData(generateChartDetailsView(chartDetails));
    } else if (!updating && jobsList?.length) {
      // set default root node based on isFirstChart
      let bossId;
      let projectManagerId;
      let bossInsuranceId;
      let projectManagerInsuranceId;

      if (jobsList && jobsList.length) {
        for (let job of jobsList) {
          if (job.title === "مدیر عامل") {
            bossId = job.id;
          }
          if (job.title === "مدیر پروژه") {
            projectManagerId = job.id;
          }
        }
      }

      // root node is boss if isFirstChart
      setLoading(true);
      if (isFirstChart && bossId) {
        getJobInsuranceCodes(bossId)
          .then((res) => {
            setLoading(false);
            if (res?.data && res?.data?.length) {
              bossInsuranceId = res.data[0].id;
            }

            if (bossInsuranceId) {
              setInitialData({
                id: "1",
                root: true,
                children: [],
                job: ["مدیر عامل", bossId],
                peopleCount: "1",
                insuranceCode: bossInsuranceId,
                relationship: "000",
              });
            }
          })
          .catch((err) => {
            setLoading(false);
            handleExceptions(err);
          });

        // root node is project manager if not isFirstChart
      } else if (!isFirstChart && projectManagerId) {
        getJobInsuranceCodes(projectManagerId)
          .then((res) => {
            setLoading(false);
            if (res?.data && res?.data?.length) {
              projectManagerInsuranceId = res.data[0].id;
            }

            if (projectManagerId) {
              setInitialData({
                id: "1",
                root: true,
                children: [],
                job: ["مدیر پروژه", projectManagerId],
                peopleCount: "1",
                insuranceCode: projectManagerInsuranceId,
                relationship: "000",
              });
            }
          })
          .catch((err) => {
            setLoading(false);
            handleExceptions(err);
          });
      }
    }
  }, [jobsList]);

  /////////////////////

  return (
    <Spin spinning={loading}>
      <Form
        {...formItemLayout}
        form={mainForm}
        name="chart_form"
        onFinish={handleOnFinish}
        onValuesChange={handleOnChange}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <fields.Job isFirstChart={isFirstChart} jobsList={jobsOptions} />
          <fields.PeopleCount />
          <fields.InsuranceJobCode
            jobCode={
              mainForm.getFieldsValue().job && mainForm.getFieldsValue().job[1]
            }
          />
        </Row>
      </Form>

      <div className="contain-chart w-100">
        <OrgChart
          datasource={initialData}
          orgchart={orgchart}
          job={newNodes.job}
          insuranceCode={newNodes.job_code}
          peopleCount={newNodes.people_count}
          updating={updating}
          setLoading={setLoading}
          print={printChart}
          onAddRoot={(newNode) => {
            const rootNode = { ...initialData, ...newNode };
            setInitialData(rootNode);
            setNewNodes(initialNewNodes);
          }}
          onAdd={(node) => {
            mainForm.resetFields();
            setNewNodes(initialNewNodes);
            if (node)
              setJobsOptions((options) =>
                options.filter((i) => i.label !== node.job[0])
              );
          }}
          onEdit={(node) => {
            mainForm.resetFields();
            setNewNodes(initialNewNodes);
          }}
          onRemoveRoot={() => {
            setInitialData({
              id: "1",
              root: true,
              children: [],
            });
          }}
          onRemove={(node) => {
            if (node)
              setJobsOptions((options) => [
                ...options,
                { label: node.job[0], value: [node.job[0], node.job[1]] },
              ]);
          }}
          onSetDs={(ds) => {
            setDs(ds);
          }}
        />
      </div>

      <div className="flex justify-end mt-3">
        <AppButton
          className="big-btn"
          variant="primary"
          size="large"
          onClick={submitChart}
          loading={loading}
        >
          {updating ? "تایید" : "ذخیره چارت"}
        </AppButton>
        <AppButton
          className="big-btn mr-2"
          size="large"
          onClick={() => history.goBack()}
        >
          انصراف
        </AppButton>
      </div>
    </Spin>
  );
};

export default SecondStepForm;
