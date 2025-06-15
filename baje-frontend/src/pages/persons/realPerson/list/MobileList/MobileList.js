import React, { useState } from "react";
import { List } from "antd";
import MobileListItem from "./MobileListItem";
import styled from "styled-components";
import { FilterOutlined } from "@ant-design/icons";
import AppButton from "components/general/AppButton";
import MobileListFilterPanel from "./MobileListFilterPanel";

const MobileList = ({
  dataSource,
  pagination,
  loading,
  handleDelete,
  selected,
  onSelectedChange,
  onPageChange,
  tableInfo,
  setTableInfo,
  onDisplayUserModal,
  setUserID,
  setFamilyModal,
  filterIcon,
  noActions,
  onChoose,
}) => {
  const [isMobileFilterVisible, setIsMobileFilterVisible] = useState(false);

  const handlePageChange = (page, pageSize) => {
    onPageChange(page, pageSize);
    window.scrollTo({
      top: 100,
      behavior: "smooth",
    });
  };

  return (
    <>
      <AppButton
        icon={filterIcon || <FilterOutlined />}
        variant="primary"
        onClick={() => {
          setIsMobileFilterVisible(true);
          document.body.style.overflowY = "hidden";
        }}
        className="mt-3 mr-auto"
      />
      <List
        className="mt-3"
        dataSource={dataSource}
        pagination={{ ...pagination, onChange: handlePageChange }}
        loading={loading}
        renderItem={(item, idx) => (
          <StyledListItem key={idx}>
            <MobileListItem
              key={idx}
              data={item}
              idx={idx}
              handleDelete={handleDelete}
              selected={selected}
              onSelectedChange={onSelectedChange}
              onDisplayUserModal={onDisplayUserModal}
              setUserID={setUserID}
              setFamilyModal={setFamilyModal}
              noActions={noActions}
              onChoose={onChoose}
            />
          </StyledListItem>
        )}
      />
      {isMobileFilterVisible && (
        <MobileListFilterPanel
          onClose={() => {
            setIsMobileFilterVisible(false);
            document.body.style.overflowY = "auto";
          }}
          tableInfo={tableInfo}
          setTableInfo={setTableInfo}
          noActions={noActions}
        />
      )}
    </>
  );
};

//css
const StyledListItem = styled(List.Item)`
  border: none !important;
  padding: 0;
`;

export default MobileList;
