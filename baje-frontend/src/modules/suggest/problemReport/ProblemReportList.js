import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, message, Popconfirm, Spin } from "antd";
import AppTable from "components/general/AppTable";
import GoBackBtn from "components/GoBackBtn";
import axios from "api/appAxios";
import useCheckAccess from "hooks/useCheckAccess";
import { LayoutContext } from "contex/Layout-context";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import { columns } from "./problemReportList/tableColumns";
import * as api from "./utils/api";
import * as suggestApi from "../suggestion/utils/api";
import { getLink } from "_helpers";
import { PlusOutlined } from "@ant-design/icons";
import ContentTop from "components/general/ContentTop";
import { pageNames } from "constant";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

const ProblemReportList = (props) => {
  const [listLoading, setListLoading] = useState(true);
  const [list, setList] = useState([]);
  const [canModify, setCanModify] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const history = useHistory();
  const checkAccess = useCheckAccess();
  const layoutContext = useContext(LayoutContext);
  const user = useWhoAmI();
  const pageId = props.match.params.id && parseInt(props.match.params.id);

  const menuBtnList = [
    {
      label: "درج گزارش مشکل",
      id: "newProblemReport",
      url: getLink(pageNames.suggest.problem.add, pageId),
      variant: "primary",
      icon: <PlusOutlined />,
    },
  ];

  useEffect(() => {
    (async function () {
      setListLoading(true);
      await getList();

      const res = await suggestApi._GET_ITEM(pageId);
      setCanModify(res.data?.execution?.personnel_id_fk === user?.id);
    })();
  }, []);

  const getList = async () => {
    setListLoading(true);

    try {
      const res = await api._GET_BY_SURVEY(pageId);

      setListLoading(false);
      setDeleteLoading(false);
      console.log(res.data);
      setList(res.data);
    } catch (error) {
      setListLoading(false);
      message.error("دریافت اطلاعات لیست با مشکل روبرو شد");
    }
  };

  const footer = () => (
    <Popconfirm
      placement="leftTop"
      title={"آیا برای حذف اطمینان دارید ؟"}
      onConfirm={() => deleteItems(selectedRows)}
      okText="بله"
      cancelText="خیر"
    >
      <Button type="danger">حذف</Button>
    </Popconfirm>
  );

  const deleteItems = async (items) => {
    if (!Array.isArray(items)) items = [items];

    try {
      await api._DELETE(items);

      await getList();
      message.success("آیتم مورد نظر پاک شد");
    } catch (error) {
      message.error(error.data);
      setDeleteLoading(false);
    }
  };

  if (listLoading) {
    return <LogoLoading />;
  }

  const handleOnChangeTablePage = (page) => {
    layoutContext.setTablePage(page);
  };

  const rowSelection = {
    type: "checkbox",
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: false,
    }),
  };

  return (
    <div>
      <GoBackBtn />
      <ContentTop
        title="گزارش مشکلات اجرای پیشنهاد"
        className="mt-3"
        breadcrumbItems={[{ text: "نظام پیشنهادات" }]}
      />

      <div className="w-100 flex-wrap align-center mb-3" hidden={!canModify}>
        <MenuInlineBtn list={menuBtnList} />
      </div>

      <Spin spinning={deleteLoading}>
        <div className="card-container">
          <AppTable
            pagination={{
              defaultCurrent: layoutContext.tablePage,
              defaultPageSize: 20,
              onChange: handleOnChangeTablePage,
            }}
            rowKey={(record) => record.id}
            size="small"
            scroll={{ y: 600, x: true }}
            onRow={() => false}
            columns={columns({
              list,
              history,
              deleteHandler: deleteItems,
              suggestId: pageId,
              canModify,
            })}
            dataSource={list}
            bordered={true}
            rowSelection={{ ...rowSelection }}
            footer={!!selectedRows.length && footer}
          />
        </div>
      </Spin>
    </div>
  );
};

export default ProblemReportList;
