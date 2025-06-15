import React, { useContext, useEffect, useState, useRef } from "react";
import { Spin, Modal, Form, message } from "antd";
import GoBackBtn from "components/GoBackBtn";
import MenuInlineBtn from "components/MenuInlineBtn";
import Table from "./common/Table";
import { useHistory } from "react-router-dom";
import ContentTop from "components/general/ContentTop";
import * as fields from "./common/formItems";
import AppButton from "components/general/AppButton";
import { formItemLayout } from "constant";

import {
  createEnvironmentUsage,
  getEnvironmentUsageList,
  deleteEnvironmentUsage,
} from "./common/api";

const EnvironmetUsageList = (props) => {
  const [listLoading, setListLoading] = useState(false);
  const [list, setList] = useState([]);
  const [selectedRow, setSleetedRow] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [environmentUsageForm] = Form.useForm();
  const [newEnvUsageLoading, setNewEnvUsageLoading] = useState(false);

  const history = useHistory();
  let tableDataTimeout = useRef(0);

  const [tableInfo, setTableInfo] = useState({
    pagination: {
      current: 1,
      pageSize: window.localStorage.getItem("table_page_size") || 20,
    },
  });

  const addParamsToUrl = (url) => {
    let paramString = "";

    //Sort
    if (tableInfo?.sorter?.column)
      paramString += `order_column=${tableInfo?.sorter.field}&order_dir=${
        tableInfo?.sorter.order === "ascend" ? "asc" : "desc"
      }`;

    //Filters
    if (tableInfo?.filters) {
      Object.entries(tableInfo?.filters).forEach(([key, value]) => {
        if (value !== null) {
          paramString += `&${key}=${value[0]}`;
        }
      });
    }

    //Page
    const currPage = tableInfo?.pagination?.current || 1;
    const pageSize =
      tableInfo?.pagination?.pageSize ||
      window.localStorage.getItem("table_page_size") ||
      20;

    paramString += `&page=${currPage}&size=${pageSize}`;

    url += "?" + paramString;
    return url;
  };

  const getList = () => {
    setListLoading(true);

    getEnvironmentUsageList()
      .then((res) => {
        setListLoading(false);
        setDeleteLoading(false);

        if (res?.data) {
          setList(res?.data);
        }

        setTableInfo({
          ...tableInfo,
          pagination: {
            ...tableInfo?.pagination,
            total: res.data.total,
          },
          silentUpdate: true,
        });
      })
      .catch((err) => {
        setListLoading(false);
      });
  };

  // handle page change
  useEffect(() => {
    if (!tableInfo?.silentUpdate) getList();
  }, [tableInfo]);

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSleetedRow(selectedRowKeys);
    },
  };

  const handleOnFinish = (vals) => {
    setNewEnvUsageLoading(true);

    const payload = {
      ...vals,
      description: "توضیحات امتخانی",
      jobId: 1000,
      isEnable: true,
    };
    createEnvironmentUsage(payload)
      .then((res) => {
        setNewEnvUsageLoading(false);

        getList();
        environmentUsageForm.resetFields();
      })
      .catch((err) => {
        setNewEnvUsageLoading(false);
        if (
          err?.response?.data?.message &&
          err?.response?.data?.message.includes("already exists")
        ) {
          message.error("عنوان شغل تکراری است");
        } else {
        }
      });
  };

  const handleOnTableChange = (
    pagination,
    filters,
    sorter,
    { currentDataSource, action }
  ) => {
    clearTimeout(tableDataTimeout.current);
    setListLoading(true);

    //Rate limit on table filter
    tableDataTimeout.current = setTimeout(
      () => {
        //Reset current page on filter or sort
        if (action !== "paginate") {
          pagination = {
            ...pagination,
            current: 1,
          };
        }

        //Trigger changes on table info
        setTableInfo({
          pagination,
          filters,
          sorter,
        });
      },
      action === "filter" ? 1000 : 0
    );
  };

  return (
    <>
      <GoBackBtn />

      <ContentTop
        title="محیط"
        className="mt-3"
        breadcrumbItems={[
          {
            text: "کاربری محیط",
          },
        ]}
      />
      <div className="w-100 flex-wrap align-center mb-3">
        <MenuInlineBtn list={[]} />
      </div>

      <Form
        {...formItemLayout}
        form={environmentUsageForm}
        name="environmentUsageForm"
        onFinish={handleOnFinish}
      >
        <div className="flex-wrap align-end">
          <fields.EnvironmentUsageTitle />
          <AppButton
            variant="primary"
            htmlType="submit"
            loading={newEnvUsageLoading}
            className="mb-4 input-inline-btn"
          >
            ثبت
          </AppButton>
        </div>
      </Form>

      <Spin spinning={deleteLoading}>
        <div className="card-container">
          <Table
            data={list}
            updateList={getList}
            selectedRow={selectedRow}
            rowSelection={rowSelection}
            setLoadingList={setListLoading}
            handleOnTableChange={handleOnTableChange}
            setSelectedRow={setSleetedRow}
            pagination={tableInfo?.pagination}
            loading={listLoading}
          />
        </div>
      </Spin>
    </>
  );
};

export default EnvironmetUsageList;
