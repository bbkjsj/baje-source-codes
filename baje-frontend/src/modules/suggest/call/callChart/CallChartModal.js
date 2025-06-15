import { Button, message, Spin } from "antd";
import AppModal from "components/general/AppModal";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { _GET_CHART } from "../utils/api";

const CallChartModal = (props) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    _GET_CHART(props.callId)
      .then((res) => {
        setLoading(false);
        if (res && res.data) {
          setChartData(res.data);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        message.error("مشکلی پیش آمده است دوباره تلاش کنید");
      });
  }, [props.callId]);

  // Process data for chart
  const colorsList = [
    "#1abc9c",
    "#2ecc71",
    "#3498db",
    "#9b59b6",
    "#34495e",
    "#16a085",
    "#27ae60",
    "#2980b9",
    "#8e44ad",
    "#2c3e50",
    "#f1c40f",
    "#e67e22",
    "#e74c3c",
    "#ecf0f1",
    "#95a5a6",
    "#f39c12",
    "#d35400",
    "#c0392b",
    "#bdc3c7",
    "#7f8c8d",
  ];
  const chartProcessedData = () => {
    const labels = [];
    const values = [];
    const colors = [];

    chartData.forEach((item, idx) => {
      labels.push(item.status);
      values.push(item.count);

      colorsList.forEach((color, idx2) => {
        if (idx === idx2) {
          colors.push(color);
        }
      });
    });

    const data = {
      labels: labels,
      datasets: [
        {
          label: "نمودار آماری فراخوان",
          data: values,
          backgroundColor: colors,
        },
      ],
    };

    return data;
  };

  return (
    <AppModal
      title="نمودار آماری فراخوان"
      visible={props.status}
      width={720}
      onCancel={() => props.close()}
      footer={[
        <Button key="back" onClick={() => props.close()}>
          بستن
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <>
          {chartData && chartData.length ? (
            <div className="mx-auto d-block">
              <Pie
                data={chartProcessedData()}
                width={300}
                height={300}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          ) : (
            <p className="text-center mt-2 text-danger">اطلاعاتی وجود ندارد</p>
          )}
        </>
      </Spin>
    </AppModal>
  );
};

export default CallChartModal;
