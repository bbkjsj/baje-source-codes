import React, { useContext, useEffect, useState } from "react";
import { Button, message, Popconfirm, Spin, Tabs } from "antd";
import { useHistory } from "react-router-dom";
import useCheckAccess from "hooks/useCheckAccess";
import { LayoutContext } from "contex/Layout-context";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import { _GET } from "./utils/api";
import Table from "./common/Table";
import { PlusOutlined } from "@ant-design/icons";
import ContentTop from "components/general/ContentTop";
import { handleClickExportExl } from "_helpers";
import ListActions from "components/general/ListActions";
import { pageNames } from "constant";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

const LoanRequestList = (props) => {
  const [listLoading, setListLoading] = useState(true);
  const [list, setList] = useState([]);
  const [selectedRow, setSleetedRow] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const history = useHistory();
  const checkAccess = useCheckAccess();
  const layoutContext = useContext(LayoutContext);
  const itemId = props.match.params.id;
  const user = useWhoAmI();
  const [exportKey, setExportKey] = useState();

  const menuBtnList = [
    {
      url: pageNames.personnel.realPerson.loanRequest.add,
      label: "ثبت درخواست مساعده",
      id: "newRequest",
      variant: "primary",
      icon: <PlusOutlined />,
    },
  ];

  const getList = () => {
    setListLoading(true);

    _GET(user.id)
      .then((res) => {
        setListLoading(false);
        setDeleteLoading(false);
        console.log("loan list:", res.data);
        setList(res.data.list);
      })
      .catch((err) => {
        setListLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    getList();
    setListLoading(true);
  }, []);

  if (listLoading) {
    return <LogoLoading />;
  }

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSleetedRow(selectedRowKeys);
    },
  };

  const handleOnChangeTablePage = (page) => {
    layoutContext.setTablePage(page);
  };

  return (
    <div>
      <ContentTop noBack title="درخواست های مساعده" className="mt-3" />
      <div className="w-100 flex-wrap align-center mb-3">
        <MenuInlineBtn list={menuBtnList} />
        <ListActions
          className="mr-md-auto mt-lg-0"
          noPrint
          noFilter
          noSort
          actions={{
            excelExport: () => handleClickExportExl(exportKey),
          }}
        />
      </div>
      <Spin spinning={deleteLoading}>
        <div className="card-container">
          <Table
            data={list}
            updateList={getList}
            selectedRow={selectedRow}
            rowSelection={rowSelection}
            setLoadingList={setListLoading}
          />
        </div>
      </Spin>
    </div>
  );
};

export default LoanRequestList;
