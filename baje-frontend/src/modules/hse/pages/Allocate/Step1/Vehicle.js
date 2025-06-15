import { SearchOutlined } from "@ant-design/icons";
import AppTable from "components/general/AppTable";
import { getVehicles } from "modules/hse/api/genraal";
import React, { useContext, useEffect, useState } from "react";
import { AllocateContext } from "../context";
import AppTableSearch from "components/general/AppTableSearch";
import CarPlate from "components/CarPlate";
import useIsMobile from "hooks/useIsMobile";
import MobileList from "components/mobileList/MobileList";
import ResponsiveList from "components/general/ResponsiveList";

const Vehicle = () => {
  const [state, setState] = useState({
    vehicles: [],
    loading: true,
    mobileSelected: [],
  });
  const { setState: setParentState } = useContext(AllocateContext);
  const isMobile = useIsMobile();

  useEffect(() => {
    loadVehicles({});
  }, []);

  const loadVehicles = async ({
    engine_number,
    chassis_number,
    organization_code,
  }) => {
    try {
      const { data } = await getVehicles({
        engine_number,
        chassis_number,
        organization_code,
      });
      setState((s) => ({ ...s, vehicles: data, loading: false }));
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChangeVehicle = (vehicleId) => {
    setParentState((s) => ({ ...s, vehicleId }));
  };

  const handleSearcEngineNumebr = (engine_number = "") => {
    // if (engine_number.length < 5)
    //   return showMessage("شماره موتور کوتاه است", "error");
    loadVehicles({ engine_number });
  };

  const handleSearchChassisNumber = (chassis_number = "") => {
    loadVehicles({ chassis_number });
  };

  const handleSearchOrganizationCode = (organization_code = "") => {
    loadVehicles({ organization_code });
  };

  const handleMobileSelection = (selected) => {
    setState((s) => ({ ...s, mobileSelected: selected }));
    handleChangeVehicle(selected[0]);
  };

  const columns = [
    {
      title: "شماره کارگاهی",
      dataIndex: "organization_code",
      filterDropdown: () => (
        <AppTableSearch
          onSearch={handleSearchOrganizationCode}
          onReset={() => loadVehicles({})}
        />
      ),
      filterIcon: () => <SearchOutlined />,
    },
    { title: "وضعیت", dataIndex: "status" },
    {
      title: "پلاک",
      align: "center",
      render: (data) => (
        <CarPlate
          plaque1={data.plaque1}
          plaque2={data.plaque2}
          plaque3={data.plaque3}
          plaque4={data.plaque4}
        />
      ),
      // children: [
      //   { title: "عبارت 1", dataIndex: "plaque1" },
      //   { title: "عبارت 2", dataIndex: "plaque2" },
      //   { title: "عبارت 3", dataIndex: "plaque3" },
      //   { title: "عبارت 4", dataIndex: "plaque4" },
      // ],
    },
    { title: "رنگ", dataIndex: "color" },
    {
      title: "شماره موتور",
      dataIndex: "engine_number",
      filterDropdown: () => (
        <AppTableSearch
          onSearch={handleSearcEngineNumebr}
          onReset={() => loadVehicles({})}
        />
      ),
      filterIcon: () => <SearchOutlined />,
    },

    {
      title: "شماره شاسی",
      dataIndex: "chassis_number",
      filterDropdown: () => (
        <AppTableSearch
          onSearch={handleSearchChassisNumber}
          onReset={() => loadVehicles({})}
        />
      ),
      filterIcon: () => <SearchOutlined />,
    },
    // {
    //   title: "گیربکس",
    //   dataIndex: "gearbox",
    //   render: (data) => (data === constant.manual ? "دستی" : "اتوماتیک"),
    // },
  ];

  return (
    <ResponsiveList
      dataSource={state.vehicles.map((item) => ({ ...item, key: item.id }))}
      selected={state.mobileSelected}
      onSelectedChange={handleMobileSelection}
      titleKeys={["organization_code"]}
      columns={columns}
      pagination={{ defaultPageSize: 20 }}
      loading={state.loading}
      rowSelection={{
        hideSelectAll: true,
        onChange: (data) => {
          handleChangeVehicle(data[0]);
        },
        type: "radio",
      }}
    />
  );

  // return (
  //   <>
  //     <AppSelect
  //       loading={state.loading}
  //       onChange={handleChangeVehicle}
  //       options={state.vehicles.map((item) => ({
  //         label: item.title,
  //         value: item.id,
  //       }))}
  //     />
  //   </>
  // );
};

export default Vehicle;
