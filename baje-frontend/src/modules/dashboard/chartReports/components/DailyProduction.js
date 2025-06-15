import React, { useState, useEffect } from "react";
import { Row, Col, Divider } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { Bar, Chart } from "react-chartjs-2";
import styled from "styled-components";
import { covetFormatDateToFA } from "_helpers";
import AppButton from "components/general/AppButton";
import { printContent } from "_helpers";
// import { printChartContent } from "modules/dashboard/utils/index";

const permanentTooltip = {
  id: "permanentTooltip",
  beforeRender: function (chart) {
    if (chart.config.options.showAllTooltips) {
      // create an array of tooltips
      // we can't use the chart tooltip because there is only one tooltip per chart
      chart.pluginTooltips = [];
      chart.config.data.datasets.forEach(function (dataset, i) {
        chart.getDatasetMeta(i).data.forEach(function (sector, j) {
          chart.pluginTooltips.push(
            new Chart.Tooltip(
              {
                _chart: chart.chart,
                _chartInstance: chart,
                _data: chart.data,
                _options: chart.options.tooltips,
                _active: [sector],
              },
              chart
            )
          );
        });
      });

      // turn off normal tooltips
      chart.options.tooltips.enabled = false;
    }
  },
  afterDraw: function (chart, easing) {
    if (chart.config.options.showAllTooltips) {
      // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
      if (!chart.allTooltipsOnce) {
        if (easing !== 1) return;
        chart.allTooltipsOnce = true;
      }

      // turn on tooltips
      chart.options.tooltips.enabled = true;
      Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
        tooltip.initialize();
        tooltip.update();
        // we don't actually need this since we are not animating tooltips
        tooltip.pivot();
        tooltip.transition(easing).draw();
      });
      chart.options.tooltips.enabled = false;
    }
  },
};

const ChartContainer = styled.div`
  background-color: rgb(255, 255, 255);
  padding: 10px;
  box-shadow: rgba(19, 37, 71, 0.1) 0px 4px 8px 0px;
  border-radius: 5px;
  min-height: 400px;
`;

function DailyProduction({ chartData }) {
  const [labels, setLabels] = useState([]);
  const [stoneLoadQuantity, setStoneLoadQuantity] = useState([]);
  const [dustLoadQuantity, setDustLoadQuantity] = useState([]);
  const [stoneTonage, setStoneTonage] = useState([]);
  const [dustTonage, setDustTonage] = useState([]);
  //
  const chartBarData1 = {
    labels: labels,
    datasets: [
      {
        label: "سنگ",
        data: stoneLoadQuantity,
        backgroundColor: "rgba(241, 196, 15,0.9)",
        borderWidth: 2,
      },
      {
        label: "خاک و باطله",
        data: dustLoadQuantity,
        backgroundColor: "rgba(41, 128, 185,0.5)",
        borderWidth: 2,
      },
    ],
  };
  const chartBarData2 = {
    labels: labels,
    datasets: [
      {
        label: "سنگ",
        data: stoneTonage,
        backgroundColor: "rgba(241, 196, 15,0.9)",
        borderWidth: 2,
      },
      {
        label: "خاک و باطله",
        data: dustTonage,
        backgroundColor: "rgba(41, 128, 185,0.5)",
        borderWidth: 2,
      },
    ],
  };
  //
  const updateChartData = (res) => {
    const newLabels = [];
    const stone_loads = [];
    const dust_loads = [];
    const stone_tonage = [];
    const dust_tonnage = [];

    res.forEach((el) => {
      newLabels.push(el.contract_name);
      stone_loads.push(parseFloat(el.stone_load_quantity));
      dust_loads.push(parseFloat(el.dust_load_quantity));
      stone_tonage.push(parseFloat(el.stone_tonnage));
      dust_tonnage.push(parseFloat(el.dust_tonnage));
    });

    setLabels(newLabels);
    setStoneLoadQuantity(stone_loads);
    setDustLoadQuantity(dust_loads);
    setStoneTonage(stone_tonage);
    setDustTonage(dust_tonnage);
  };
  //
  // const printDiv = (ref) => {
  //   console.log("lkcnkn!", ref);
  //   const printContents = ref.innerHTML;
  //   document.body.innerHTML = printContents;
  //   window.print();
  // };
  useEffect(() => {
    updateChartData(chartData);
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
      <Row justify="space-between" className="print-area">
        <Col xs={24} sm={24} md={24} lg={11} xl={11} className="mb-3 ">
          <ChartContainer>
            <Row align="middle">
              <Divider orientation="right">گزارش تعداد </Divider>
            </Row>
            <Row className="">
              {chartData?.length > 0 && (
                <Col span={24} className="flex-wrap justify-center mb-4">
                  <span
                    className="ml-2"
                    style={{ color: "rgba(0, 0, 0, 0.25)" }}
                  >
                    تاریخ:
                  </span>
                  <span>{covetFormatDateToFA(chartData[0].date)}</span>
                </Col>
              )}
              <Col
                span={24}
                style={{
                  overflowX: "scroll",
                }}
              >
                <Bar
                  redraw
                  data={chartBarData1}
                  height={300}
                  plugins={[permanentTooltip]}
                  options={{
                    maintainAspectRatio: false,
                    showAllTooltips: true,

                    scales: {
                      yAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: "تعداد",
                          },
                          ticks: {
                            beginAtZero: true,
                          },
                        },
                      ],
                    },
                  }}
                />
              </Col>
            </Row>
          </ChartContainer>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} className="">
          <ChartContainer>
            <Row align="middle">
              <Divider orientation="right">گزارش تناژ</Divider>
            </Row>
            <Row className="">
              {chartData?.length > 0 && (
                <Col span={24} className="flex-wrap justify-center mb-4">
                  <span
                    className="ml-2"
                    style={{ color: "rgba(0, 0, 0, 0.25)" }}
                  >
                    تاریخ:
                  </span>
                  <span>{covetFormatDateToFA(chartData[0].date)}</span>
                </Col>
              )}
              <Col
                span={24}
                style={{
                  overflowX: "scroll",
                }}
              >
                <Bar
                  redraw
                  data={chartBarData2}
                  height={300}
                  plugins={[permanentTooltip]}
                  options={{
                    maintainAspectRatio: false,
                    showAllTooltips: true,
                    scales: {
                      yAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: "تناژ",
                          },
                          ticks: {
                            beginAtZero: true,
                          },
                        },
                      ],
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

export default DailyProduction;
