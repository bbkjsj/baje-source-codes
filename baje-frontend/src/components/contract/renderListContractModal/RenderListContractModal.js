import React, { useState, useEffect } from "react";
import { Modal, Spin, Table } from "antd";
import SearchInput from "./SearchInput";
import styled from "styled-components";
import { covetFormatDateToFA } from "../../../_helpers";

const columns = [
  {
    title: "موضوع قرارداد",
    dataIndex: "subject",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "شماره قرارداد",
    dataIndex: "number",
  },
  {
    title: "شناسه قرارداد",
    dataIndex: "id",
  },
];

const StyledTable = styled(Table)`
  tr {
    cursor: pointer;
  }
`;

const RenderListContractModal = (props) => {
  const rowSectionChange = (selectedRowKeys, selectedRows) => {
    let id = selectedRows[0]["id"];
    props.form.setFieldsValue({ mainContractId: id });
  };

  const onRow = (record) => {
    return {
      onClick: () => {
        props.setContractDate(covetFormatDateToFA(record.date));
        props.setFinishDate(covetFormatDateToFA(record.end_date));
        props.form.setFieldsValue({
          mainContractId: record.id,
          employerId: record.contractor_id,
        });
        props.onCancel();
      },
    };
  };

  let content;
  // if (props.loadingList) {
  //   content = (
  //     <div>
  //       <p>در حال دریافت</p>
  //     </div>
  //   );
  // }

  if (props.list.length > 0) {
    content = (
      <>
        <StyledTable
          onRow={onRow}
          columns={columns}
          dataSource={props.list}
          pagination={false}
        />
      </>
    );
  } else if (!props.loadingList) {
    content = (
      <div>
        <p>هیچ آیتمی یافت نشد</p>
      </div>
    );
  }

  useEffect(() => {}, [props.visible]);

  return (
    <>
      <Modal
        footer={null}
        title="لیست قراردادهای اصلی"
        visible={props.visible}
        onCancel={props.onCancel}
      >
        <Spin spinning={props.loadingList}>
          <SearchInput
            onSearch={props.search}
            onChangeSearchField={props.onchangeInputSearch}
            loading={props.searchBtnLoading}
            value={props.searchValue}
          />
          <Spin spinning={props.searchBtnLoading}>{content}</Spin>
        </Spin>
      </Modal>
    </>
  );
};

export default RenderListContractModal;
