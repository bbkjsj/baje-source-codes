import AppButton from "components/general/AppButton";
import React, { useState } from "react";
import { getPlaqueString } from "_helpers";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Modal, notification, Table } from "antd";
import { alphabetList } from "modules/machinery/MachineList/columns";
import { EDIT_MACHINE } from "modules/machinery/utils/api";
import { extractPlaqueFromText, arePlaquesEqual } from "../utils/helpers";

const CheckingModal = ({
  machine,
  plk,
  MtrNum,
  ShsNum,
  vin,
  onFinish,
  onCancel,
}) => {
  const [updatedMachineFields, setUpdatedMachineFields] = useState({});
  const [loading, setLoading] = useState(false);

  const [tableData, setTableData] = useState([
    {
      title: "شماره پلاک",
      insData: plk,
      bajeData: getPlaqueString(machine),
      hasArrow: !arePlaquesEqual(plk, machine),
      updateId: "plaque",
    },
    {
      title: "شماره موتور",
      insData: MtrNum,
      bajeData: machine?.engine_number,
      hasArrow: MtrNum != machine?.engine_number,
      updateId: "engineNumber",
    },
    {
      title: "شماره شاسی",
      insData: ShsNum,
      bajeData: machine?.chassis_number,
      hasArrow: ShsNum != machine?.chassis_number,
      updateId: "chassisNumber",
    },
    {
      title: "VIN",
      insData: vin,
      bajeData: machine?.vin_number,
      hasArrow: vin != machine?.vin_number,
      updateId: "vinNumber",
    },
  ]);

  const tableColumns = [
    { title: " ", dataIndex: "title" },
    { title: "اطلاعات بیمه مرکزی", dataIndex: "insData" },
    {
      title: "تغییر",
      dataIndex: "hasArrow",
      render: (_, record) =>
        record.hasArrow === true ? (
          <AppButton onClick={() => handleChange(record)}>
            <ArrowLeftOutlined />
          </AppButton>
        ) : (
          ""
        ),
    },
    { title: "اطلاعات باجه", dataIndex: "bajeData" },
  ];

  ///////////////

  function updateMachine() {
    if (Object.keys(updatedMachineFields).length) {
      setLoading(true);
      const formData = new FormData();
      for (let key in updatedMachineFields) {
        formData.append(key, updatedMachineFields[key]);
      }

      EDIT_MACHINE(machine.id, formData)
        .then(() => {
          setLoading(false);
          notification.success({ message: "ماشین با موفقیت بروزرسانی شد" });
          onCancel();
          onFinish();
        })
        .catch((err) => {
          setLoading(false);
          notification.error({
            message: "بروزرسانی ماشین ناموفق بود، لطفا مجدد تلاش کنید",
          });
          console.error(err);
        });
    } else {
      onFinish();
    }
  }

  function handleChange(record) {
    const newTableData = tableData.map((i) => {
      if (i.updateId === record.updateId) {
        return { ...i, bajeData: record.insData, hasArrow: false };
      }
      return i;
    });
    setTableData(newTableData);

    const toUpdate = record.insData.trim().replace(/\s/g, "");

    if (record.updateId === "plaque" && toUpdate && toUpdate.length === 9) {
      const plaques = extractPlaqueFromText(toUpdate);

      if (plaques) {
        setUpdatedMachineFields((s) => ({
          ...s,
          ...plaques,
        }));
      }
    } else if (record.updateId) {
      setUpdatedMachineFields((s) => ({
        ...s,
        [record.updateId]: toUpdate,
      }));
    }
  }

  return (
    <div>
      <p className="my-3">
        اطلاعات مغایر را با کلیک بر روی دکمه های فلش جایگزین و سپس برای ثبت دکمه
        ثبت و ادامه را کلیک کنید.
      </p>
      <Table
        dataSource={tableData}
        columns={tableColumns}
        pagination={false}
        footer={false}
      />
      <AppButton
        onClick={updateMachine}
        variant="primary"
        className="my-3"
        loading={loading}
      >
        ثبت و ادامه
      </AppButton>
    </div>
  );
};

export default CheckingModal;
