import React from "react";
import { Row, Col, Divider, Carousel } from "antd";
import {
  RightOutlined,
  LeftOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { Chart } from "react-google-charts";
import styled from "styled-components";
import { covetFormatDateToFA } from "_helpers";
import AppButton from "components/general/AppButton";
import { printContent } from "_helpers";
import EmptyChart from "./EmptyChart";

const CarouselWrapper = styled(Carousel)`
  > .slick-dots li button {
    width: 6px;
    height: 6px;
    border-radius: 100%;
    background: gray;
  }
  > .slick-dots li.slick-active button {
    width: 7px;
    height: 7px;
    border-radius: 100%;
    background: black;
  }
  > .ant-carousel .slick-dots li {
    width: 7px;
  }
`;

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        color: "blue",
        fontSize: "15px",
        lineHeight: "1.5715",
        border: "1px solid blue",
        borderRadius: "50%",
        padding: "5px 5px 2px",
        width: "30px",
        height: "30px",
        marginRight: "4px",
      }}
      onClick={onClick}
    >
      <RightOutlined />
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        color: "blue",
        fontSize: "15px",
        lineHeight: "1.5715",
        border: "1px solid blue",
        borderRadius: "50%",
        padding: "5px 5px 2px",
        width: "30px",
        height: "30px",
      }}
      onClick={onClick}
    >
      <LeftOutlined />
    </div>
  );
};
const settings = {
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
};

function DailyMachinesActivityAverage({ chartData }) {
  return (
    <>
      <Row justify="end">
        <AppButton
          icon={<PrinterOutlined />}
          // onClick={(e) => printDiv(container1.current)}
          onClick={(e) => printContent()}
        >
          پرینت
        </AppButton>
      </Row>

      <Row justify="center" className="print-area">
        <Divider orientation="right">
          گزارش ماشین آلات فعال و غیر فعال روزانه
        </Divider>

        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
          {chartData?.length > 0 && (
            <Col span={24} className="flex-wrap justify-center mb-4">
              <span className="ml-2" style={{ color: "rgba(0, 0, 0, 0.25)" }}>
                تاریخ:
              </span>
              <span>{covetFormatDateToFA(chartData[0].date)}</span>
            </Col>
          )}
          <CarouselWrapper arrows {...settings}>
            {chartData?.map((el) => (
              <Row justify="center">
                <Col span={24} className="justify-center flex-wrap">
                  {el.company_name}
                </Col>
                <Col span={24} span={24} className="justify-center flex-wrap">
                  {!el.total_active_average &&
                  !el.total_disabled_car_no_part_average &&
                  !el.total_disabled_car_no_tier_average ? (
                    <EmptyChart />
                  ) : (
                    <Chart
                      key={el.company_id}
                      chartType="PieChart"
                      data={[
                        ["item", "value"],
                        ["  فعال ", parseFloat(el.total_active_average)],
                        [
                          "غیرفعال_نبود قطعه",
                          parseFloat(el.total_disabled_car_no_part_average),
                        ],
                        [
                          "غیرفعال_نبود تایر",
                          parseFloat(el.total_disabled_car_no_tier_average),
                        ],
                      ]}
                      width="100%"
                      height="500px"
                      legendToggle
                      options={{
                        // chartArea: { left: 40, top: 15, right: 40, bottom: 0 },
                        legend: "none",
                        title: "",
                        is3D: true,
                        backgroundColor: "rgb(252,252,252)",
                      }}
                    ></Chart>
                  )}
                </Col>
              </Row>
            ))}
          </CarouselWrapper>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={6}
          xl={6}
          className="flex-wrap align-center"
        >
          <table className="mr-2">
            <tr>
              <td>
                <div
                  style={{
                    width: "15px",
                    height: "15px",
                    backgroundColor: "#3366CC",
                  }}
                ></div>
              </td>
              <td>فعال</td>
            </tr>
            <tr>
              <td>
                <div
                  style={{
                    width: "15px",
                    height: "15px",
                    backgroundColor: "#FF9900",
                  }}
                ></div>
              </td>
              <td>غیرفعال(نبود تایر)</td>
            </tr>
            <tr>
              <td>
                <div
                  style={{
                    width: "15px",
                    height: "15px",
                    backgroundColor: "#DC3912",
                  }}
                ></div>
              </td>
              <td>غیرفعال (نبود قطعه)</td>
            </tr>
          </table>
        </Col>
      </Row>
    </>
  );
}

export default DailyMachinesActivityAverage;
