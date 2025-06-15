import React, { useState } from "react";
import { useHistory } from "react-router";
import { Col, Form, Row, Space, Spin } from "antd";
import { permission } from "json/Permission";
import { getLink } from "_helpers";
import ContentTop from "components/general/ContentTop";
import { getTableData } from "modules/dashboard/utils/index";
import { onChangeContract } from "modules/dashboard/utils/index";
import { useGetContarctList } from "modules/dashboard/utils/hooks";
import Table from "modules/dashboard/components/Table";
import * as FormItems from "modules/dashboard/components/formItems";
import CustomRow from "modules/dashboard/components/CustomRow";
import { columnsList } from "./utils/index";
//
import { _GET_PEYMAN_REPORT_LIST } from "./utils/api";
import { updatePeymanReport } from "./utils/index";
import { allowedContractsTypes } from "modules/dashboard/const";
import {
  formColSpan,
  formItemLayout,
  formRowGutter,
  pageNames,
} from "constant";
//

const { ADD_EDIT_PEYMAN, APPROVE_PEYMAN } = permission;

function List() {
  const history = useHistory();
  const [searchForm] = Form.useForm();
  const [disableContractList, setDisableContractList] = useState(false);
  const {
    contractList,
    loading,
    hidden,
    c_id,
    setLoading,
  } = useGetContarctList(
    allowedContractsTypes.peyman,
    searchForm,
    setDisableContractList
  );
  //
  const [disableBtn, setDisableBtn] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [hash, setHash] = useState(null);
  const [operator, setOperator] = useState("");
  const [manager, setManager] = useState("");
  const [current, setCurrent] = useState(1);
  //
  const searchBtnText = "مدیریت پیمان ";
  const breadcrumbItems = [
    { text: "داشبورد ", link: pageNames.home.web },
    { text: "مدیریت پیمان ", link: pageNames.dashboard.peymanManagement.list },
  ];

  const onDisplayForm = (record) => {
    const newPath = !record.status
      ? getLink(pageNames.dashboard.peymanManagement.add, record.id)
      : getLink(pageNames.dashboard.peymanManagement.edit, record.id);
    history.push(newPath);
  };

  const searchHandler = (params) => {
    getTableData(
      _GET_PEYMAN_REPORT_LIST,
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
              disabled={disableBtn}
              searchBtnText={searchBtnText}
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
          onDisplayForm={onDisplayForm}
          onChangeStatus={updatePeymanReport}
          columnsList={columnsList}
          operatorAccess={ADD_EDIT_PEYMAN.permission}
          managerAccess={APPROVE_PEYMAN.permission}
          current={current}
          getList={() =>
            getTableData(
              _GET_PEYMAN_REPORT_LIST,
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
      </Spin>
    </>
  );
}

export default List;
