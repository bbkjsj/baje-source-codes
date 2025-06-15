import { Descriptions } from "antd";
import React from "react";
import CarPlate from "components/CarPlate";

const MachineDetail = ({ audit }) => {
  const { organization_code, plaque1, plaque2, plaque3, plaque4 } = audit;
  return (
    <Descriptions>
      <Descriptions.Item label="کد کارگاهی">
        {organization_code}
      </Descriptions.Item>
      <Descriptions.Item label="پلاک ماشین">
        <CarPlate
          plaque1={plaque1}
          plaque2={plaque2}
          plaque3={plaque3}
          plaque4={plaque4}
        />
      </Descriptions.Item>
    </Descriptions>
  );
};

export default MachineDetail;
