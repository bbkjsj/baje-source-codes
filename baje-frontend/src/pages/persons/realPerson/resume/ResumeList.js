import React, { useContext, useEffect, useRef, useState } from "react";
import { Spin, Modal, Form, Row } from "antd";
import GoBackBtn from "components/GoBackBtn";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import routes from "modules/personnel/routes";
import { createResume, getResumeList } from "./utils/api";
import Table from "./common/Table";
import { convertDateToENProper, convertDateToISO8601, getLink } from "_helpers";
import { useParams, useHistory } from "react-router-dom";
import ContentTop from "components/general/ContentTop";
import * as fields from "./common/formItems";
import AppButton from "components/general/AppButton";
import { handleSuccess } from "modules/personnel/jobs/common/api";
import api from "api/appAxios";
import endpoints from "modules/personnel/endpoints";

const ResumeList = (props) => {
  const history = useHistory();
  const [listLoading, setListLoading] = useState(false);
  const [list, setList] = useState([]);
  const [selectedRow, setSleetedRow] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const routeParams = useParams();
  const [mainForm] = Form.useForm();
  const [newJobLoading, setNewJobLoading] = useState(false);
  const [person, setPerson] = useState();
  const [defaultCode, setDefaultCode] = useState(routeParams.id);
  const [selectedChart, setSelectedChart] = useState(null);
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

      // if (activeFilter)
      //   paramString += `&filter=${activeFilter[0]}&fvalue=${
      //     Array.isArray(activeFilter[1]) ? activeFilter[1][0] : activeFilter[1]
      //   }`;
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

  // get resume list

  const getList = async () => {
    try {
      setListLoading(true);

      const res = await api.get(
        addParamsToUrl(endpoints.resume.list + "/" + routeParams.id)
      );

      setListLoading(false);
      setDeleteLoading(false);

      // const personList = res.data.list.filter(
      //   (i) => i.personnel_id == Number(routeParams.id)
      // );
      setList(res.data.list);

      setTableInfo({
        ...tableInfo,
        pagination: {
          ...tableInfo?.pagination,
          total: res.data.total,
        },
        silentUpdate: true,
      });
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
      setSleetedRow(selectedRowKeys);
    },
  };

  const formItemLayout = {
    labelCol: { span: 24 },
    colon: false,
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      lg: { span: 22 },
    },
  };

  // create new resume

  const handleOnFinish = async (vals) => {
    const body = {
      personnel_id_fk: Number(vals.personnel_id_fk),
      jobs_id_fk: vals.jobs_id_fk[1],
      from_date: convertDateToISO8601(vals.from_date),
      to_date: convertDateToISO8601(vals.to_date),
      chart_id_fk: vals.chart_id_fk,
    };

    try {
      setNewJobLoading(true);

      const res = await createResume(body);

      setNewJobLoading(false);
      handleSuccess(res);
      mainForm.resetFields();
      getList();
    } catch (err) {
      setNewJobLoading(false);
      console.error(err);
    }
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
        title="رزومه فرد"
        className="mt-3"
        breadcrumbItems={[
          {
            text: "منابع انسانی",
          },
          { text: "افراد حقیقی" },
          { text: "لیست افراد" },
          { text: "رزومه" },
        ]}
      />

      <Form
        {...formItemLayout}
        form={mainForm}
        name="mainForm"
        onFinish={handleOnFinish}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <fields.Person
            useForm={mainForm}
            setPerson={setPerson}
            defaultValue={defaultCode}
            disabled
          />
          {/* <fields.PersonnelCode /> */}
          <fields.Chart setSelectedChart={setSelectedChart} />
          <fields.Job selectedChart={selectedChart} />
          <fields.StartDate useForm={mainForm} />
          <fields.EndDate useForm={mainForm} />
        </Row>
        <div className="flex w-100 justify-end mt-4">
          <AppButton
            variant="primary"
            htmlType="submit"
            loading={newJobLoading}
            className="mb-4 input-inline-btn ml-3"
          >
            ثبت
          </AppButton>
          <AppButton
            className="mb-4 input-inline-btn"
            onClick={() => history.goBack()}
          >
            انصراف
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
            pagination={tableInfo?.pagination}
          />
        </div>
      </Spin>
    </>
  );
};

export default ResumeList;
