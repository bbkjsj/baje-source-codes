import { Spin, Table } from "antd";
import AppButton from "components/general/AppButton";
import React, { useState, useEffect } from "react";
import { getPermissionJobs } from "../utils/api";

const PermissionJobsModal = ({ permCode, onCancel }) => {
  const columns = [
    {
      title: "کد یکتای شغل",
      dataIndex: "id",
      key: "id",
      width: 150,
      render: (text) => {
        const count = 5 - text.toString().length;
        let code = "0".repeat(count) + text;
        return code;
      },
    },
    {
      title: "عنوان شغل",
      dataIndex: "title",
      key: "title",
    },
  ];
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    setLoading(true);
    getPermissionJobs(permCode)
      .then((res) => {
        if (res && res.data) {
          setJobs(res.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [permCode]);

  return (
    <div className="used-charts-modal">
      <Spin spinning={loading}>
        {jobs.length ? (
          <>
            <p className="mb-4">شغل های زیر دارای دسترسی مربوطه هستند</p>

            <Table columns={columns} dataSource={jobs} pagination={false} />

            <AppButton
              className="big-btn mt-3"
              size="large"
              variant="text"
              onClick={onCancel}
            >
              بستن
            </AppButton>
          </>
        ) : (
          !loading && (
            <p className="text-center">هیچ موردی برای این دسترسی یافت نشد</p>
          )
        )}
      </Spin>
    </div>
  );
};

export default PermissionJobsModal;
