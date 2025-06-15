import React, { useContext, useEffect, useState } from "react";
import { Button, message, Popconfirm, Spin, Tabs } from "antd";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import { _GET } from "./utils/api";
import Table from "./common/Table";
import ContentTop from "components/general/ContentTop";
import { PlusOutlined } from "@ant-design/icons";
import { pageNames } from "constant";

const SettingsList = (props) => {
  const [listLoading, setListLoading] = useState(true);
  const [list, setList] = useState([]);
  const [selectedRow, setSleetedRow] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const menuBtnList = [
    {
      url: pageNames.personnel.annualSetting.add,
      label: "افزودن تنظیمات سالانه",
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
        console.log("settings list:", res.data);
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
      setSleetedRow(selectedRowKeys);
    },
  };

  return (
    <div>
      <ContentTop
        noBack
        title="تنظیمات سالانه"
        className="mt-3"
        breadcrumbItems={[{ text: "منابع انسانی" }, { text: "تنظیمات سالانه" }]}
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

export default SettingsList;
