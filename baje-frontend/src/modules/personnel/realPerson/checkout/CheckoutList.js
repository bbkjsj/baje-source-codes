import React, { useContext, useEffect, useState } from "react";
import { Button, message, Popconfirm, Spin, Tabs } from "antd";
import GoBackBtn from "components/GoBackBtn";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import { _GET } from "./utils/api";
import Table from "./common/Table";
import { PlusOutlined } from "@ant-design/icons";
import ContentTop from "components/general/ContentTop";

import { handleClickExportExl } from "_helpers";
import ListActions from "components/general/ListActions";
import { pageNames } from "constant";

const CheckoutList = (props) => {
  const [listLoading, setListLoading] = useState(false);
  const [list, setList] = useState([]);
  const [selectedRow, setSleetedRow] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [exportKey, setExportKey] = useState();

  const menuBtnList = [
    {
      url: pageNames.personnel.realPerson.checkout.add,
      label: "ثبت درخواست تسویه حساب",
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
        title="درخواست های تسویه حساب"
        className="mt-3"
        // breadcrumbItems={[
        //   { text: "منابع انسانی" },
        //   { text: "افراد حقیقی" },
        //   { text: "تسویه حساب" },
        // ]}
      />
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

export default CheckoutList;
