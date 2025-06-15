import React, { useContext, useEffect, useState } from "react";
import { Button, message, Modal, Popconfirm, Spin, Tabs } from "antd";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import { _GET } from "./utils/api";
import Table from "./common/Table";
import ContentTop from "components/general/ContentTop";
import { PlusOutlined } from "@ant-design/icons";
import { handleClickExportExl } from "_helpers";
import ListActions from "components/general/ListActions";
import { pageNames } from "constant";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { permission as permissions } from "json/Permission";
import useCheckAccess from "hooks/useCheckAccess";

const EnvironmentList = (props) => {
  const [listLoading, setListLoading] = useState(false);
  const [list, setList] = useState([]);
  const [selectedRow, setSleetedRow] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const currentOffice = useSelector((state) => state.currentOffice);
  const history = useHistory();
  const checkAccess = useCheckAccess();

  const menuBtnList = [
    {
      label: "محیط جدید",
      id: "newRequest",
      variant: "primary",
      icon: <PlusOutlined />,
      hidden: !checkAccess([permissions.ENVIRONMENT_CREATE]),
      handleClick: () => {
        if (currentOffice && currentOffice != "-1") {
          history.push(pageNames.environment.add);
        } else {
          Modal.warn({
            title: "شرکت انتخاب نشده است",
            content: "لطفا برای ایجاد محیط شرکت را از بالای صفحه انتخاب نمایید",
          });
        }
      },
    },
  ];

  const getList = () => {
    setListLoading(true);

    _GET()
      .then((res) => {
        setListLoading(false);
        setDeleteLoading(false);
        console.log("list:", res.data);
        setList(res.data);
      })
      .catch((err) => {
        setListLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    setListLoading(true);
    getList();
  }, []);

  if (listLoading) {
    return <LogoLoading />;
  }

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSleetedRow(selectedRowKeys);
    },
  };

  // filter environments by office
  function filterByOffice() {
    if (currentOffice && currentOffice != "-1" && list?.length) {
      return list.filter((i) => i.companyId == currentOffice);
    }
    return list;
  }

  return (
    <div>
      <ContentTop
        noBack
        title="محیط ها"
        className="mt-3"
        // breadcrumbItems={[
        //   { text: "منابع انسانی" },
        //   { text: "افراد حقیقی" },
        //   { text: "ماموریت ها" },
        // ]}
      />
      <div className="w-100 flex-wrap align-center mb-3">
        <MenuInlineBtn list={menuBtnList} />
        <ListActions
          className="mr-md-auto mt-lg-0"
          noPrint
          noFilter
          noSort
          noExcel
        />
      </div>
      <Spin spinning={deleteLoading}>
        <div className="card-container">
          <Table
            data={filterByOffice()}
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

export default EnvironmentList;
