import { Col, Input, Row } from "antd";
import AppTable from "components/general/AppTable";
import MobileList from "components/mobileList/MobileList";
import { searchPerson } from "modules/hse/api/genraal";
import React, { useContext, useState } from "react";
import { showMessage } from "utils/message";
import { AllocateContext } from "../context";
import ResponsiveList from "./../../../../../components/general/ResponsiveList";

const Person = () => {
  const { setState: setParentState } = useContext(AllocateContext);
  const [state, setState] = useState({
    searchText: "",
    loading: false,
    persons: [],
    mobileSelected: [],
  });

  const handleSearchPerson = async () => {
    if (state.searchText.length !== 10)
      return showMessage("کد ملی باید 10رقمی باشد", "error");
    setState((s) => ({ ...s, loading: true }));
    try {
      const { data } = await searchPerson({ nationalNumber: state.searchText });
      setState((s) => ({ ...s, loading: false, persons: data.list }));
    } catch (error) {
      console.log(error.message);
      setState((s) => ({ ...s, loading: false }));
    }
  };

  const handleChangeSearchText = ({ target }) => {
    setState((s) => ({ ...s, searchText: target.value }));
  };

  const handleMobileSelection = (selected) => {
    setState((s) => ({ ...s, mobileSelected: selected }));
    setParentState((s) => ({
      ...s,
      personnelId: selected[0]?.id,
    }));
  };

  return (
    <>
      <Row>
        <Col md={6} xs={24}>
          <Input.Search
            loading={state.loading}
            value={state.searchText}
            onChange={handleChangeSearchText}
            onSearch={handleSearchPerson}
            placeholder="کد ملی کاربر"
            maxLength={10}
          />
        </Col>
      </Row>

      <ResponsiveList
        dataSource={state.persons.map((item) => ({ ...item, key: item.id }))}
        selected={state.mobileSelected}
        onSelectedChange={handleMobileSelection}
        columns={[
          { title: "کد کاربر", dataIndex: "id" },
          { title: "نام", dataIndex: "first_name" },
          { title: "نام خانوادگی", dataIndex: "last_name" },
          { title: "نام پدر", dataIndex: "father_name" },
          { title: "شماره ملی", dataIndex: "national_number" },
        ]}
        titleKeys={["first_name", "last_name"]}
        rowSelection={{
          onChange: (see, selectedPersons) => {
            setParentState((s) => ({
              ...s,
              personnelId: selectedPersons[0]?.id,
            }));
          },
        }}
      />
    </>
  );
};

export default Person;
