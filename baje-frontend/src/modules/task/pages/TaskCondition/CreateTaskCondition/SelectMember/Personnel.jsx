import AppTable from "components/general/AppTable";
import AppTableSearch from "components/general/AppTableSearch";
import { getPersonnel } from "modules/task/api/general";
import React, { useEffect } from "react";
import {
  createTaskConditionActions,
  useCreateTaskConditionContext,
} from "../context";
import { SearchOutlined } from "@ant-design/icons";
import { constant } from "modules/task/constant";
import { handleOnFailedForm } from "modules/personnel/realPerson/utils/formUtils";
import useTableSearch from "hooks/useTableSearch";

const Personnel = () => {
  const { dispatch, state } = useCreateTaskConditionContext();
  const tableSearch = useTableSearch();

  const handleSelectPersonnel = (payload) => {
    dispatch({
      type: createTaskConditionActions.changeAttribute,
      payload: { value: payload, attribute: "personnelMembers" },
    });
  };

  const handleSearchNationNumber = (value) => {
    dispatch({
      type: createTaskConditionActions.setSearchPhrase,
      payload: { field: constant.nationNumber, value },
    });
  };

  const handleSearchLastName = (value) => {
    dispatch({
      type: createTaskConditionActions.setSearchPhrase,
      payload: { field: constant.lastName, value },
    });
  };

  const handleSearchFirstName = (value) => {
    dispatch({
      type: createTaskConditionActions.setSearchPhrase,
      payload: { field: constant.firstName, value },
    });
  };

  return (
    <AppTable
      dataSource={state.personnels
        .filter(
          (item) =>
            item.national_number.includes(state.searchNationNumber) &&
            item.first_name.includes(state.searchFirstName) &&
            item.last_name.includes(state.searchLastName)
        )
        .map((item) => ({
          ...item,
          key: item.id,
        }))}
      columns={[
        {
          title: "نام",
          dataIndex: "first_name",
          filterDropdown: () => (
            <AppTableSearch
              onSearch={handleSearchFirstName}
              onReset={() => handleSearchFirstName("")}
            />
          ),
          filterIcon: () => <SearchOutlined />,
        },
        {
          title: "نام خانوادگی",
          dataIndex: "last_name",
          filterDropdown: () => (
            <AppTableSearch
              onSearch={handleSearchLastName}
              onReset={() => handleSearchLastName("")}
            />
          ),
          filterIcon: () => <SearchOutlined />,
        },

        {
          title: "کدملی",
          dataIndex: "national_number",
          filterDropdown: () => (
            <AppTableSearch
              onSearch={handleSearchNationNumber}
              onReset={() => handleSearchNationNumber("")}
            />
          ),
          filterIcon: () => <SearchOutlined />,
        },
        { title: "شناسه", dataIndex: "id" },
      ]}
      loading={state.personnelLoading}
      pagination={{ pageSize: 10, size: "small" }}
      rowSelection={{
        type: "checkbox",
        hideSelectAll: true,
        onChange: handleSelectPersonnel,
        selectedRowKeys: state.personnelMembers,
      }}
    />
  );
};

export default Personnel;
