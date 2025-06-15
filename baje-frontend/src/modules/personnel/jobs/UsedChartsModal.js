import { Spin, Table } from "antd";
import AppButton from "components/general/AppButton";
import React, { useState, useEffect } from "react";
import { getCompanyCharts, handleExceptions } from "./common/api";

const UsedChartsModal = (props) => {
  const columns = [
    {
      title: "نام شرکت",
      dataIndex: "title",
      key: "title",
    },
  ];
  const [loading, setLoading] = useState(false);
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    setLoading(true);
    getCompanyCharts(props.jobId)
      .then((res) => {
        setLoading(false);
        if (res && res.data) {
          setCharts(res.data);
        }
      })
      .catch((err) => {
        setLoading(false);
        handleExceptions(err);
      });
  }, [props.jobId]);

  return (
    <div className="used-charts-modal">
      <Spin spinning={loading}>
        {charts.length ? (
          <>
            <p className="mb-4">
              شغل مربوطه در چارت سازمانی شرکت های زیر استفاده شده است
            </p>

            <Table columns={columns} dataSource={charts} pagination={false} />

            <AppButton
              className="big-btn mt-3"
              size="large"
              variant="text"
              onClick={() => props.onCancel()}
            >
              بستن
            </AppButton>
          </>
        ) : (
          !loading && (
            <p className="text-center">هیچ موردی برای این کد شغلی یافت نشد</p>
          )
        )}
      </Spin>
    </div>
  );
};

export default UsedChartsModal;
