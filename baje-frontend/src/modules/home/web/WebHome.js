import { Bar, Doughnut, Line, Pie, Polar, defaults } from "react-chartjs-2";
import { Col, Row } from "antd";
import React, { useEffect, useMemo, useState } from "react";

import { Redirect } from "react-router-dom";
import { pageNames } from "constant";
import styled from "styled-components";
import useMobileDetect from "use-mobile-detect-hook";

defaults.global.defaultFontFamily = "Peyda-Medium";
// defaults.global.animation = {
//   duration: 1000000,
// };

const chartOneData = {
  labels: ["افراد حقیقی", "ماشین آلات", "افراد حقوقی"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3],
      backgroundColor: [
        "rgba(231, 76, 60,0.8)",
        "rgba(41, 128, 185,0.8)",
        "rgba(241, 196, 15,0.8)",
      ],
      borderWidth: 3,
    },
  ],
};

const chartDataThree = {
  labels: ["افراد حقیقی", "ماشین آلات", "افراد حقوقی"],
  datasets: [
    {
      label: "فروش",
      data: [12, 19, 3],
      borderColor: [
        "rgba(231, 76, 60,0.9)",
        "rgba(41, 128, 185,0.9)",
        "rgba(241, 196, 15,0.9)",
      ],
      backgroundColor: [
        "rgba(231, 76, 60,0.5)",
        "rgba(41, 128, 185,0.5)",
        "rgba(241, 196, 15,0.3)",
      ],
      borderWidth: 3,
    },
  ],
};

const chartTowData = {
  labels: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور"],

  datasets: [
    {
      lineTension: 0,
      fill: false,
      borderColor: "#bae755",
      backgroundColor: "#e755ba",
      pointBackgroundColor: "#55bae7",
      pointBorderColor: "#55bae7",
      pointHoverBackgroundColor: "#55bae7",
      pointHoverBorderColor: "#55bae7",
      label: "فروش",
      data: [65, 59, 80, 81, 56, 55, 10],
    },
    {
      lineTension: 0,
      fill: false,
      borderColor: "rgba(41, 128, 185,0.8)",
      backgroundColor: "#e755ba",
      pointBackgroundColor: "#55bae7",
      pointBorderColor: "#55bae7",
      pointHoverBackgroundColor: "#55bae7",
      pointHoverBorderColor: "#55bae7",
      label: "سود ",
      data: [28, 48, 40, 19, 86, 27, 90],
    },
  ],
};

const ChartContainer = styled.div`
  background-color: rgb(255, 255, 255);
  padding: 10px;
  box-shadow: rgba(19, 37, 71, 0.1) 0px 4px 8px 0px;
  border-radius: 5px;
`;

const WebHome = () => {
  const [chartOneDataS, setChartOneData] = useState({});
  useEffect(() => {
    setChartOneData(chartOneData);
  }, []);

  const { isMobile } = useMobileDetect();

  return useMemo(() => {
    if (isMobile()) {
      return <Redirect to={pageNames.home.mobile} />;
    }
    return (
      <>
        {/* <p>hii</p> */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={24} lg={10} xl={6}>
            <ChartContainer>
              <h2>نمودار کلی سیستم</h2>
              <div>
                <Doughnut
                  redraw
                  data={chartOneDataS}
                  width={300}
                  height={300}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </ChartContainer>
          </Col>
          <Col xs={24} sm={24} md={24} lg={14} xl={18}>
            <ChartContainer>
              <h2>نمودار فروش</h2>
              <div>
                <Line
                  redraw
                  data={chartTowData}
                  width={300}
                  height={300}
                  options={{
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
              </div>
            </ChartContainer>
          </Col>
          <Col xs={24} sm={24} md={24} lg={14} xl={18}>
            <ChartContainer>
              <h2>نمودار فروش</h2>
              <div>
                <Bar
                  redraw
                  data={chartDataThree}
                  width={300}
                  height={300}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </ChartContainer>
          </Col>
          <Col xs={24} sm={24} md={24} lg={10} xl={6}>
            <ChartContainer>
              <h2>نمودار کلی سیستم</h2>
              <div>
                <Polar
                  redraw
                  data={chartOneData}
                  width={300}
                  height={300}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </ChartContainer>
          </Col>
        </Row>
      </>
    );
  }, [chartOneDataS]);
};

export default WebHome;
