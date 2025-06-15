import React from "react";
import { Row, Col, Divider, Empty } from "antd";
import styled from "styled-components";
import statistics from "assets/img/statistics.jpg";

const ChartContainer = styled.div`
  background-color: rgb(255, 255, 255);
  padding: 10px;
  box-shadow: rgba(19, 37, 71, 0.1) 0px 4px 8px 0px;
  border-radius: 5px;
  min-height: 400px;
`;

function EmptyChart() {
  return (
    <Row>
      <Col span={24}>
        <ChartContainer className="flex-wrap align-center justify-center ">
          <Divider orientation="right">گزارش </Divider>

          <div>
            <Empty
              image={statistics}
              imageStyle={{
                height: 150,
              }}
              description=""
            ></Empty>
          </div>
        </ChartContainer>
      </Col>
    </Row>
  );
}

export default EmptyChart;
