import React, { useState, useEffect } from "react";
import { Row, Col, Divider, Form, Checkbox } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { Line } from "react-chartjs-2";
import styled from "styled-components";
import { covetFormatDateToFA } from "_helpers";
import { namedColor } from "modules/dashboard/utils/index";
import AppButton from "components/general/AppButton";
import { printContent } from "_helpers";

const ChartContainer = styled.div`
  background-color: rgb(255, 255, 255);
  padding: 10px;
  box-shadow: rgba(19, 37, 71, 0.1) 0px 4px 8px 0px;
  border-radius: 5px;
  min-height: 400px;
`;

function PeriodicProjectProgress({ chartData }) {
  const [form1] = Form.useForm();
  //
  const [labels, setLabels] = useState([]);
  const [list, setList] = useState([]);
  //
  const options1 = [
    { label: "درصد پیشرفت واقعی", value: "real_progress" },
    { label: "درصد پیشرفت برنامه ای", value: "program_progress" },
  ];
  //
  const chartLineData = {
    labels: labels,
    datasets: list,
  };

  //
  const updateChartData = (data, fieldName, fieldLabel) => {
    const newList = [];
    const sampleItem = {
      lineTension: 0,
      fill: false,

      pointBackgroundColor: "#55bae7",
      pointBorderColor: "#55bae7",
      pointHoverBackgroundColor: "#55bae7",
      pointHoverBorderColor: "#55bae7",
    };

    const newLabels = data[0].reports.map((r) => covetFormatDateToFA(r.date));
    setLabels(newLabels);

    data.forEach((el, index) => {
      const values = [];
      const values1 = [];
      const values2 = [];
      if (fieldName === "both") {
        el.reports.forEach((r) => {
          values1.push(r.program_progress);
          values2.push(r.real_progress);
        });
        const newItem1 = {
          ...sampleItem,
          label: `پیشرفت برنامه ای--${el.contract_name}`,
          data: values1,
          borderColor: namedColor(index),
          backgroundColor: namedColor(index),
        };
        const newItem2 = {
          ...sampleItem,
          label: `پیشرفت پروژه ای--${el.contract_name}`,
          data: values2,
          borderColor: namedColor(index),
          backgroundColor: namedColor(index),
        };
        newList.push(newItem1, newItem2);
      } else {
        el.reports.forEach((r) => {
          values.push(r[fieldName]);
        });
        const newItem = {
          ...sampleItem,
          label: `${fieldLabel}--${el.contract_name}`,
          data: values,
          borderColor: namedColor(index),
          backgroundColor: namedColor(index),
        };
        newList.push(newItem);
      }
    });

    setList(newList);
  };
  //
  const onChangeForm1 = () => {
    const target1 = form1.getFieldValue("target1");
    if (target1.length === 0) {
      setList([]);
    } else if (target1.length === 1) {
      target1[0] === "real_progress"
        ? updateChartData(chartData, "real_progress", "درصد پیشرفت واقعی")
        : updateChartData(
            chartData,
            "program_progress",
            "درصد پیشرفت برنامه ای"
          );
    } else if (target1.length === 2) {
      updateChartData(chartData, "both", "both");
    }
  };

  //
  useEffect(() => {
    updateChartData(chartData, "real_progress", "درصد پیشرفت واقعی");
  }, []);
  // console.log(chartData, "!");
  return (
    <>
      <Row align="end">
        <AppButton
          icon={<PrinterOutlined />}
          // onClick={(e) => printDiv(container1.current)}
          onClick={(e) => printContent()}
        >
          پرینت
        </AppButton>
      </Row>
      <Row className="print-area">
        <Col span={24}>
          <ChartContainer>
            <Row align="middle">
              <Divider orientation="right"> گزارش درصد پیشرفت پروژه </Divider>
            </Row>
            {chartData?.length > 0 && chartData[0].reports.length > 0 && (
              <Row className="mb-4" justify="space-between">
                <Col span={12} className="flex-wrap justify-center ">
                  <span
                    className="ml-2"
                    style={{ color: "rgba(0, 0, 0, 0.25)" }}
                  >
                    از تاریخ:
                  </span>
                  <span>
                    {covetFormatDateToFA(chartData[0].reports[0].date)}
                  </span>
                </Col>
                <Col span={12} className="flex-wrap justify-center ">
                  <span
                    className="ml-2"
                    style={{ color: "rgba(0, 0, 0, 0.25)" }}
                  >
                    تا تاریخ:
                  </span>
                  <span>
                    {covetFormatDateToFA(
                      chartData[0].reports[chartData[0].reports.length - 1].date
                    )}
                  </span>
                </Col>
              </Row>
            )}
            <Row justify="center" className="">
              <Col span={24} className="flex-wrap justify-center">
                <Form form={form1} onFieldsChange={onChangeForm1}>
                  <Form.Item name="target1" initialValue={["real_progress"]}>
                    <Checkbox.Group options={options1}></Checkbox.Group>
                  </Form.Item>
                </Form>
              </Col>
              <Col
                span={24}
                style={{
                  overflowX: "scroll",
                }}
              >
                <Line
                  redraw
                  data={chartLineData}
                  height={300}
                  options={{
                    legend: { position: "bottom" },
                    scales: {
                      yAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: "درصد پیشرفت پروژه",
                          },
                          ticks: {
                            beginAtZero: true,
                          },
                        },
                      ],
                    },
                    maintainAspectRatio: false,
                    animation: {
                      x: {
                        duration: 5000,
                        from: 0,
                      },
                      y: {
                        duration: 3000,
                        from: 500,
                      },
                    },
                  }}
                />
              </Col>
            </Row>
          </ChartContainer>
        </Col>
      </Row>
    </>
  );
}

export default PeriodicProjectProgress;
