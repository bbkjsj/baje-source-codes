import React, { useEffect, useState } from "react";
import { Steps, Spin, Form, message } from "antd";
import GoBackBtn from "components/GoBackBtn";
import routes from "../routes";
import ContentTop from "components/general/ContentTop";
import styled from "styled-components";
import FirstStepForm from "./components/FirstStepForm";
import SecondStepForm from "./components/SecondStepForm";
import { useHistory, useParams } from "react-router-dom";
import {
  createChart,
  getChart,
  getChartsList,
  updateChart,
} from "./common/api";
import { handleExceptions, handleSuccess } from "../jobs/common/api";
import { pageNames } from "constant";
import { convertDateToISO8601, getLink, timeToFa } from "_helpers";
import { useSelector } from "react-redux";
import { getSingleRightFull } from "../rightFull/utils/API";

const { Step } = Steps;

function ChartsForm({ updating }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(null);
  const [isFirstChart, setIsFirstChart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  const history = useHistory();
  const routeParams = useParams();
  const [mainForm] = Form.useForm();
  const params = useParams();
  const contracts = useSelector((state) => state.user.contract);

  // get initial values if is updating
  useEffect(() => {
    if (updating) {
      getData();
    } else {
      getIsFirst();
    }
  }, []);

  const handleOnFinish = async (chartData, params) => {
    try {
      const body = updating ? params : { ...formData };

      if (body.apply_date) {
        body.apply_date = convertDateToISO8601(body.apply_date);
      }
      body.company_id_fk = parseFloat(routeParams.id);
      body.description = body.description || "-";
      body.title = body.title || "چارت جدید";

      if (!updating) {
        body.nodes = [generateChartDetails(chartData)];
      }

      setLoading(true);
      let request;
      if (updating) {
        body.enable = data.enable ? true : false;
        request = () => updateChart(body, routeParams.chart_id);
      } else {
        body.enable = false;
        request = () => createChart(body);
      }

      const res = await request();

      setLoading(false);
      if (!updating) {
        handleSuccess(res);
      }
      if (!updating) {
        setTimeout(
          () =>
            history.push(
              getLink(pageNames.personnel.orgCharts.list, {
                id: routeParams.id,
              })
            ),
          1000
        );
      } else {
        message.success("ویرایش با موفقیت انجام شد");
        setStep(1);
      }
    } catch (err) {
      setLoading(false);
      handleExceptions(err);
    }
  };

  // generate chart data to send to api
  function generateChartDetails(chartData) {
    const data = { title: chartData.job[0] };

    if (chartData.peopleCount) data.count = Number(chartData.peopleCount);
    if (chartData.insuranceCode)
      data.jobs_tamin_code_id_fk = chartData.insuranceCode;

    data.nodes = getNodeChildren(chartData.children);

    return data;
  }

  // get node children recursively
  function getNodeChildren(children) {
    if (children) {
      return children.map((child) => {
        if (child.children) {
          return {
            title: child.job[0],
            count: Number(child.peopleCount),
            jobs_tamin_code_id_fk: child.insuranceCode,
            nodes: getNodeChildren(child.children),
          };
        } else {
          return {
            count: Number(child.peopleCount),
            jobs_tamin_code_id_fk: child.insuranceCode,
            title: child.job[0],
          };
        }
      });
    }
  }

  // find out if this company has any chart and set default values
  const getIsFirst = async () => {
    try {
      setLoading(true);

      const res = await getChartsList();

      getSingleRightFull(routeParams.id).then((response) => {
        let registerDate;

        if (response?.data?.company?.register_date) {
          registerDate = timeToFa(response.data.company.register_date, false);
        }
        setLoading(false);

        if (res.data.length) {
          const thisCompanyCharts = res.data.filter(
            (i) => i.company_id_fk == params.id
          );

          // find setad contract for this company
          const findSetad = contracts.find(
            (i) => i.employerId == routeParams.id && i.subject.includes("ستاد")
          );

          if (!thisCompanyCharts.length) {
            setIsFirstChart(true);
            mainForm.setFieldsValue({
              title: "چارت بدو تاسیس",
              apply_date: registerDate ? registerDate : "",
              contract_id_fk: findSetad ? findSetad.contract_id : "",
            });
            if (findSetad) {
              setData((data) => ({
                ...data,
                contract_id_fk: findSetad?.contract_id,
              }));
            }
          }
        }
      });
    } catch (err) {
      setLoading(false);
      handleExceptions(err);
    }
  };

  // get chart data
  async function getData() {
    try {
      setLoading(true);
      const res = await getChart(routeParams.chart_id);

      setLoading(false);
      if (res) {
        mainForm.setFieldsValue({
          title: res.data?.title,
          environment_id_fk: res?.data.environment_id_fk,
          apply_date: res.data?.apply_date
            ? timeToFa(res.data?.apply_date, false)
            : "",
          description: res.data?.description ? res.data?.description : "",
        });

        setData(res.data);
      }
    } catch (err) {
      setLoading(false);
      handleExceptions(err);
    }
  }

  return (
    <ChartFormContainer>
      <GoBackBtn onClick={step > 0 ? () => setStep(0) : history.goBack} />
      <ContentTop
        title={updating ? "ویرایش چارت" : "ساخت چارت جدید"}
        className="mt-3"
        breadcrumbItems={[
          { text: "منابع انسانی" },
          { text: "افراد حقوقی" },
          { text: "لیست افراد", link: routes.PERSONNEL_RIGHTFUL_LIST },
          { text: "چارت سازمانی" },
          { text: "چارت جدید" },
        ]}
      />

      <Spin spinning={loading}>
        <Steps current={step} className="chart-form-steps">
          <Step key={0} />

          <Step key={1} />
        </Steps>

        {step === 0 ? (
          <FirstStepForm
            onFinish={(params) => {
              if (updating) {
                setFormData(params);
                handleOnFinish(undefined, params);
              } else {
                setFormData(params);
                setStep(1);
              }
            }}
            initialData={formData}
            environmentId={data?.environment_id_fk}
            updating={updating}
            mainForm={mainForm}
            isFirstChart={isFirstChart}
            data={data}
          />
        ) : (
          <SecondStepForm
            chartDetails={
              updating && data.nodes && data.nodes.length
                ? data.nodes[0]
                : undefined
            }
            onFinish={updating ? history.goBack : handleOnFinish}
            updating={updating}
            isFirstChart={isFirstChart}
          />
        )}
      </Spin>
    </ChartFormContainer>
  );
}

// css
const ChartFormContainer = styled.div`
  width: 100%;
  .chart-form-steps {
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
    align-items: center;
    margin-bottom: 32px;
  }
`;

export default ChartsForm;
