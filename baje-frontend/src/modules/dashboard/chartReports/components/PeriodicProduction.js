import React, { useEffect, useState } from "react";
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
  width: 100%;
`;

function PeriodicProduction({ chartData }) {
  //
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  //
  const [labels, setLabels] = useState([]);
  const [list1, setList1] = useState([]);
  const [list2, setList2] = useState([]);
  //
  const options1 = [
    { label: "سنگ", value: "stone_load_quantity" },
    { label: "خاک و باطله", value: "dust_load_quantity" },
  ];

  const options2 = [
    { label: "سنگ", value: "stone_tonnage" },
    { label: "خاک و باطله", value: "dust_tonnage" },
  ];
  //

  const chartLineData1 = {
    labels: labels,
    datasets: list1,
  };

  const chartLineData2 = {
    labels: labels,
    datasets: list2,
  };
  //

  const updateChartData = (data, setList, fieldName, fieldLabel) => {
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
        label: `${fieldLabel}--${el.contract_name}`,
        data: values,
        borderColor: namedColor(index),
        backgroundColor: namedColor(index),
      };
      newList.push(newItem);
    });

    setList(newList);
  };

  //

  const onChangeForm1 = () => {
    const target1 = form1.getFieldValue("target1");
    if (target1.length === 0) {
      setList1([]);
    } else if (target1.length === 1) {
      target1[0] === "stone_load_quantity"
        ? updateChartData(chartData, setList1, "stone_load_quantity", "سنگ")
        : updateChartData(
            chartData,
            setList1,
            "dust_load_quantity",
            "خاک و باطله"
          );
    } else
      updateChartData(
        chartData,
        setList1,
        "total_load",
        "مجموع  سنگ و خاک وباطله"
      );
  };

  const onChangeForm2 = () => {
    const target2 = form2.getFieldValue("target2");

    if (target2.length === 0) {
      setList2([]);
    } else if (target2.length === 1) {
      target2[0] === "stone_tonnage"
        ? updateChartData(chartData, setList2, "stone_tonnage", "سنگ")
        : updateChartData(chartData, setList2, "dust_tonnage", "خاک و باطله");
    } else
      updateChartData(
        chartData,
        setList2,
        "total_tonnage",
        "مجموع  سنگ و خاک وباطله"
      );
  };

  useEffect(() => {
    updateChartData(chartData, setList1, "stone_load_quantity", "سنگ");
    updateChartData(chartData, setList2, "stone_tonnage", "تناژ سنگ");
  }, []);
  //

  return (
    <>
      <Row justify="end mb-2">
        <AppButton
          icon={<PrinterOutlined />}
          // onClick={(e) => printDiv(container1.current)}
          onClick={(e) => printContent()}
        >
          پرینت
        </AppButton>
      </Row>
      <Row justify="space-between print-area">
        <Col xs={24} sm={24} md={24} lg={11} xl={11} className="mb-3">
          <ChartContainer>
            <Divider orientation="right">گزارش تعداد </Divider>
            <Row>
              {chartData?.length > 0 && chartData[0].reports.length > 0 && (
                <Col span={24} className="mb-4 flex-wrap justify-space-between">
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
                        chartData[0].reports[chartData[0].reports.length - 1]
                          .date
                      )}
                    </span>
                  </Col>
                </Col>
              )}

              <Col span={24} className="flex-wrap justify-center">
                <Form form={form1} onFieldsChange={onChangeForm1}>
                  <Form.Item
                    name="target1"
                    initialValue={["stone_load_quantity"]}
                  >
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
                  data={chartLineData1}
                  height={300}
                  options={{
                    legend: { position: "bottom" },
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
        <Col xs={24} sm={24} md={24} lg={12} xl={12} className="mb-3">
          <ChartContainer>
            <Divider orientation="right">گزارش تناژ</Divider>
            <Row className="">
              {chartData?.length > 0 && chartData[0].reports.length > 0 && (
                <Col span={24} className="mb-4 flex-wrap  space-between">
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
                        chartData[0].reports[chartData[0].reports.length - 1]
                          .date
                      )}
                    </span>
                  </Col>
                </Col>
              )}

              <Col span={24} className="flex-wrap justify-center">
                <Form form={form2} onFieldsChange={onChangeForm2}>
                  <Form.Item name="target2" initialValue={["stone_tonnage"]}>
                    <Checkbox.Group options={options2}></Checkbox.Group>
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
                  data={chartLineData2}
                  height={300}
                  options={{
                    legend: { position: "bottom" },
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

export default PeriodicProduction;
