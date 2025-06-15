import React, { useContext, useEffect, useState, useRef } from "react";
import { Spin, Modal, Form, message } from "antd";
import GoBackBtn from "components/GoBackBtn";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import Table from "./common/Table";
import { useHistory, useParams, useLocation } from "react-router-dom";
import ContentTop from "components/general/ContentTop";
import * as fields from "./common/formItems";
import AppButton from "components/general/AppButton";
import AccessesModal from "./AccessesModal";
import JobCodesModal from "./JobCodesModal";
import UsedChartsModal from "./UsedChartsModal";
import {
  createJob,
  getJobsList,
  handleExceptions,
  handleSuccess,
} from "./common/api";
import { formItemLayout, formRowGutter, pageNames } from "../../../constant";
import api from "api/appAxios";
import endpoints from "modules/personnel/endpoints";

const JobList = (props) => {
  const [listLoading, setListLoading] = useState(false);
  const [list, setList] = useState([]);
  const [selectedRow, setSleetedRow] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const routeParams = useParams();
  const [jobForm] = Form.useForm();
  const [newJobLoading, setNewJobLoading] = useState(false);
  const [accessModal, setAccessModal] = useState(false);
  const [codesModal, setCodesModal] = useState(false);
  const [chartsModal, setChartsModal] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const history = useHistory();
  let tableDataTimeout = useRef(0);
  const location = useLocation();
  const [tableInfo, setTableInfo] = useState({
    pagination: {
      current: 1,
      pageSize: /*window.localStorage.getItem("table_page_size") || 20*/ 30,
    },
  });

  const addParamsToUrl = (url, paginate = true, manualPage, manualSort) => {
    let paramString = "";

    //Page
    if (paginate) {
      const currPage = manualPage
        ? manualPage
        : tableInfo?.pagination?.current || 1;
      const pageSize =
        tableInfo?.pagination?.pageSize ||
        window.localStorage.getItem("table_page_size") ||
        30;

      // if (!tableInfo?.filters || !Object.entries(tableInfo?.filters).length) {
      paramString += `page=${currPage}&size=${pageSize}`;
      // } else {
      //   paramString += `page=1&size=${pageSize}`;
      // }
    }

    //Sort
    // if (tableInfo?.sorter?.column) {
    //   paramString += `&sort=${tableInfo?.sorter.field}&stype=${
    //     tableInfo?.sorter.order === "ascend" ? "asc" : "desc"
    //   }`;
    // } else if (manualSort) {
    //   paramString += `&sort=${manualSort.field}&stype=${
    //     manualSort.order === "ascend" ? "asc" : "desc"
    //   }`;
    // } else {
    //   paramString += `&sort=last_name&stype=asc`;
    // }

    //Filters
    // needs to change due to backend update
    // if (tableInfo?.filters) {
    //   const activeFilter = Object.entries(tableInfo?.filters).find(
    //     ([key, value]) => value !== null
    //   );

    //   if (activeFilter)
    //     paramString += `&filter=${activeFilter[0]}&fvalue=${
    //       Array.isArray(activeFilter[1]) ? activeFilter[1][0] : activeFilter[1]
    //     }`;
    // }

    url += "?" + paramString;
    return url;
  };

  const getList = () => {
    setListLoading(true);

    api
      .get(addParamsToUrl(endpoints.jobsAndCharts.jobs))
      .then((res) => {
        setListLoading(false);
        setDeleteLoading(false);

        if (res?.data?.list) {
          setList(res?.data?.list);
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
        handleExceptions(err);
      });
  };

  // useEffect(() => {
  //   getList();
  // }, []);

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
    setNewJobLoading(true);
    createJob(vals)
      .then((res) => {
        setNewJobLoading(false);
        handleSuccess(res);
        getList();
        jobForm.resetFields();
      })
      .catch((err) => {
        setNewJobLoading(false);
        if (
          err?.response?.data?.message &&
          err?.response?.data?.message.includes("already exists")
        ) {
          message.error("عنوان شغل تکراری است");
        } else {
          handleExceptions(err);
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

        // if (action !== "filter") {
        //   const queryParams = qs.parse(location.search);
        //   const newQueries = { ...queryParams };
        //   const isDiffPage = pagination.current !== tableInfo.pagination.current;
        //   const isDiffSort =
        //     !queryParams?.sort ||
        //     (queryParams?.sort &&
        //       (sorter?.field !== queryParams.sort ||
        //         sorter?.order !== queryParams.sort_order));

        //   if (isDiffPage) {
        //     newQueries.page = pagination.current;
        //   }
        //   if (isDiffSort) {
        //     newQueries.sort = sorter.field;
        //     newQueries.sort_order = sorter.order;
        //   }
        //   if (!sorter.order) {
        //     delete newQueries.sort_order;
        //     delete newQueries.sort;
        //   }

        //   if (isDiffPage || isDiffSort) {
        //     history.replace({ search: qs.stringify(newQueries) });
        //   }
        // }

        //Trigger changes on table info
        setTableInfo({
          pagination,
          filters,
          sorter,
        });
      },
      action === "filter" ? 1000 : 0
    );

    //Limit num of active table filters to 1
    // const filtersToDisable = [];
    // const filterArray = Object.entries(filters);
    // const activeFilter = filterArray.find(
    //   ([key, value]) => value !== null
    // )?.[0];

    // if (activeFilter)
    //   filterArray.forEach(([key, value]) => {
    //     if (key !== activeFilter) filtersToDisable.push(key);
    //   });

    //This state is passed to table columns
    //setDisabledFilters(filtersToDisable);
  };

  return (
    <>
      <GoBackBtn />

      <ContentTop
        title="مشاغل"
        className="mt-3"
        breadcrumbItems={[
          {
            text: "منابع انسانی",
          },
          { text: "مشاغل" },
          { text: "تعریف مشاغل" },
        ]}
      />

      <Form
        {...formItemLayout}
        form={jobForm}
        name="jobForm"
        onFinish={handleOnFinish}
      >
        <div className="flex-wrap align-end">
          <fields.JobTitle />
          <AppButton
            variant="primary"
            htmlType="submit"
            loading={newJobLoading}
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
            tableInfo={tableInfo}
            setTableInfo={setTableInfo}
            loading={listLoading}
            setAccessModal={setAccessModal}
            setCodesModal={setCodesModal}
            setChartsModal={setChartsModal}
            setSelectedId={setSelectedId}
          />
        </div>
      </Spin>

      {accessModal ? (
        <Modal
          visible={accessModal}
          onCancel={() => setAccessModal(false)}
          footer={null}
          title="سطوح دسترسی"
          width={920}
        >
          <AccessesModal
            visible={accessModal}
            onCancel={() => setAccessModal(false)}
            jobId={selectedId}
          />
        </Modal>
      ) : (
        ""
      )}

      <Modal
        visible={codesModal}
        onCancel={() => setCodesModal(false)}
        footer={null}
        title="کد شغل های قابل قبول تامین اجتماعی"
        width={720}
      >
        <JobCodesModal
          visible={codesModal}
          onCancel={() => setCodesModal(false)}
          jobId={selectedId}
        />
      </Modal>

      <Modal
        visible={chartsModal}
        onCancel={() => setChartsModal(false)}
        footer={null}
        title="چارت های استفاده شده"
        width={720}
      >
        <UsedChartsModal
          visible={chartsModal}
          onCancel={() => setChartsModal(false)}
          jobId={selectedId}
        />
      </Modal>
    </>
  );
};

export default JobList;
