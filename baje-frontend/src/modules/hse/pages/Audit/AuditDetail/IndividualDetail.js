import { Descriptions } from "antd";
import React from "react";
import { config } from "constant";

const IndividualDetail = ({ audit }) => {
  return (
    <Descriptions title="مشصات کاربری">
      <Descriptions.Item label="نام">{audit.first_name}</Descriptions.Item>
      <Descriptions.Item label="نام خانوادگی">
        {audit.last_name}
      </Descriptions.Item>
      <Descriptions.Item label="شماره ملی">
        {audit.national_number}
      </Descriptions.Item>
      <Descriptions.Item label="شناسه کاربری">
        {audit.personnel_id_fk}
      </Descriptions.Item>
      <Descriptions.Item>
        <img
          src={config.url.API_URL + audit.image_url}
          alt="profile"
          style={{
            width: "200px",
            height: "250px",
            borderRadius: "20px",
          }}
        />
      </Descriptions.Item>
    </Descriptions>
  );
};

export default IndividualDetail;
