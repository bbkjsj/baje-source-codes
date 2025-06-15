import React, { useState, useContext, useEffect } from "react";
import { Form, Row, Spin, Col } from "antd";
import { permission } from "json/Permission";

import ContentTop from "components/general/ContentTop";
import { onChangeContract } from "modules/dashboard/utils/index";
import { useGetContarctList } from "modules/dashboard/utils/hooks";
import Table from "modules/dashboard/components/Table";
import * as FormItems from "modules/dashboard/components/formItems";
import CustomRow from "modules/dashboard/components/CustomRow";
import { getTableData } from "modules/dashboard/utils/index";
import ProgressModal from "./components/ProgressModal";
import { updateProgress } from "./utils/index";
import { _GET_PROGRESS } from "./utils/api";
import { columnsList } from "./utils/index";
import { allowedContractsTypes } from "modules/dashboard/const";
import {
  formColSpan,
  formItemLayout,
  formRowGutter,
  pageNames,
} from "constant";

//
const { ADD_EDIT_PROGRESS, APPROVE_PROGRESS } = permission;

function List() {
  const [searchForm] = Form.useForm();
  const [disableContractList, setDisableContractList] = useState(false);

  const {
    contractList,
    loading,
    hidden,
    c_id,
    setLoading,
  } = useGetContarctList(
    allowedContractsTypes.progress,
    searchForm,
    setDisableContractList
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [disableBtn, setDisableBtn] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [hash, setHash] = useState(null);
  const [operator, setOperator] = useState("");
  const [manager, setManager] = useState("");
  const [current, setCurrent] = useState(1);

  const searchBtnText = "پیشرفت پروژه";
  const breadcrumbItems = [
    { text: "داشبورد ", link: pageNames.home.web },
    { text: " پیشرفت پروژه ", link: pageNames.dashboard.projectProgress },
  ];

  const searchHandler = (params) => {
    getTableData(
      _GET_PROGRESS,
      params.contarct_id,
      setDisableBtn,
      setTableData,
      setHash,
      setOperator,
      setManager,
      setCurrent,
      setLoading
    );
  };

  const onDisplayModal = (record) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };
  const onHideModal = () => {
    setSelectedRecord(null);
    setModalVisible(false);
  };
  //

  return (
    <>
      <Spin spinning={loading}>
        <ContentTop noBack title="داشبورد " breadcrumbItems={breadcrumbItems} />

        <Form
          onFinish={(params) => searchHandler(params)}
          form={searchForm}
          {...formItemLayout}
        >
          <Row className="space-between" align="bottom" gutter={formRowGutter}>
            <FormItems.ContractList
              list={contractList}
              onChange={(e) => onChangeContract(e, setDisableBtn)}
              disabled={disableContractList}
              hidden={hidden}
            ></FormItems.ContractList>
            <FormItems.SearchBtn
              onClick={() => searchForm.submit()}
              searchBtnText={searchBtnText}
              disabled={disableBtn}
              hidden={hidden}
            />

            {hidden &&
              `قرارداد ${contractList?.find((el) => el.id == c_id)?.subject}`}
            <Col {...formColSpan} />
            <FormItems.Actions hash={hash} />
          </Row>
        </Form>

        <CustomRow
          list={[
            { name: "مدیرپروژه", value: manager },
            // { name: "کاربر پروژه", value: operator },
          ]}
        ></CustomRow>
        <Table
          list={tableData}
          onDisplayForm={onDisplayModal}
          onChangeStatus={updateProgress}
          columnsList={columnsList}
          operatorAccess={ADD_EDIT_PROGRESS.permission}
          managerAccess={APPROVE_PROGRESS.permission}
          current={current}
          getList={() =>
            getTableData(
              _GET_PROGRESS,
              searchForm.getFieldValue("contarct_id"),
              setDisableBtn,
              setTableData,
              setHash,
              setOperator,
              setManager,
              setCurrent,
              setLoading
            )
          }
        ></Table>

        <ProgressModal
          modalVisible={modalVisible}
          record={selectedRecord}
          hideModal={onHideModal}
          setModalVisible={setModalVisible}
          setTableData={setTableData}
          setDisableBtn={setDisableBtn}
          setHash={setHash}
          setOperator={setOperator}
          setManager={setManager}
          setCurrent={setCurrent}
          setLoading={setLoading}
        />
      </Spin>
    </>
  );
}

export default List;
