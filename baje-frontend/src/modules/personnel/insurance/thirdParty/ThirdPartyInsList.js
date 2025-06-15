import React, { useEffect, useState } from "react";
import { Button, message, Popconfirm, Spin, Tabs } from "antd";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import { _GET } from "./utils/api";
import Table from "./common/Table";
import ContentTop from "components/general/ContentTop";
import { PlusOutlined } from "@ant-design/icons";
import { handleClickExportExl } from "_helpers";
import ListActions from "components/general/ListActions";
import { pageNames } from "constant";
import qs, { stringifyUrl } from "query-string";
import { useHistory, useLocation } from "react-router-dom";

const ThirdPartyInsList = (props) => {
  const [listLoading, setListLoading] = useState(false);
  const [list, setList] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const location = useLocation();
  const history = useHistory();

  const menuBtnList = [
    {
      handleClick: () => {
        const queryParams = qs.parse(location.search);
        if (queryParams.machineOrganizationCode) {
          history.push(
            stringifyUrl({
              url: pageNames.personnel.insurance.thirdPartyIns.add,
              query: {
                machineOrganizationCode: queryParams.machineOrganizationCode,
              },
            })
          );
        } else {
          history.push(pageNames.personnel.insurance.thirdPartyIns.add);
        }
      },
      label: "بیمه شخص ثالث جدید",
      id: "newRequest",
      variant: "primary",
      icon: <PlusOutlined />,
    },
  ];

  const getList = () => {
    setListLoading(true);

    _GET()
      .then((res) => {
        setListLoading(false);
        setDeleteLoading(false);
        //console.log("mission list:", res.data);
        setList(res.data);
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
      setSelectedRow(selectedRowKeys);
    },
  };

  return (
    <div>
      <ContentTop
        noBack
        title="بیمه های شخص ثالث"
        className="mt-3"
        breadcrumbItems={[
          { text: "منابع انسانی" },
          { text: "بیمه" },
          { text: "بیمه شخص ثالث" },
        ]}
      />
      <div className="w-100 flex-wrap align-center mb-3">
        <MenuInlineBtn list={menuBtnList} />
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

export default ThirdPartyInsList;
