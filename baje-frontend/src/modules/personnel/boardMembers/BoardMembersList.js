import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import GoBackBtn from "components/GoBackBtn";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import routes from "modules/personnel/routes";
import { getBoardMembersList } from "./utils/api";
import Table from "./common/Table";
import { PlusOutlined } from "@ant-design/icons";
import ContentTop from "components/general/ContentTop";
import { getLink } from "_helpers";
import { useParams } from "react-router";

const BoardMembersList = (props) => {
  const [listLoading, setListLoading] = useState(false);
  const [list, setList] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const params = useParams();

  const menuBtnList = [
    {
      url: getLink(routes.PERSONNEL_BOARD_MEMBERS_ADD, params.id),
      label: "عضو هیئت مدیره جدید",
      id: "newMember",
      variant: "primary",
      icon: <PlusOutlined />,
    },
  ];

  const getList = async () => {
    try {
      setListLoading(true);

      const res = await getBoardMembersList(params.id);

      setListLoading(false);
      setDeleteLoading(false);
      setList(res.data);
    } catch (err) {
      setListLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    getList();
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
      <GoBackBtn />
      <ContentTop
        title="اعضای هیئت مدیره"
        className="mt-3"
        breadcrumbItems={[
          { text: "منابع انسانی" },
          {
            text: "اعضای هیئت مدیره",
          },
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

export default BoardMembersList;
