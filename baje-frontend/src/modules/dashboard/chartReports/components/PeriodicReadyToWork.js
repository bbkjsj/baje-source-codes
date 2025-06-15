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

function PeriodicReadyToWork({ chartData }) {
  //
  const [labels, setLabels] = useState([]);
  const [list, setList] = useState([]);
  //

  //
  const chartLineData = {
    labels: labels,
    datasets: list,
  };

  //
  const updateChartData = (data, fieldName) => {
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

      el.reports.forEach((r) => {
        values.push(r[fieldName]);
      });
      const newItem = {
        ...sampleItem,
        label: `${el.contract_name}`,
        data: values,
        borderColor: namedColor(index),
        backgroundColor: namedColor(index),
      };
      newList.push(newItem);
    });

    setList(newList);
  };
  //

  //
  useEffect(() => {
    updateChartData(chartData, "ready_to_work_factor");
  }, []);

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
              <Divider orientation="right">گزارش ضریب آماده به کاری</Divider>
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
                          labelString: "ضریب آماده به کاری",
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
          </ChartContainer>
        </Col>
      </Row>
    </>
  );
}

export default PeriodicReadyToWork;
