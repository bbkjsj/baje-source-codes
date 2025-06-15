import React, { useState, useEffect } from "react";
import { Form, Row, Button, message, Popconfirm, Spin, Modal } from "antd";
import {
  getRelatedSystemListHandler,
  getSystemListHandler,
  getTypeListHandler,
} from "../utils/index";
import LoadingLogo from "components/general/LoadingLogo";
import GoBackBtn from "components/GoBackBtn";
import AppTable from "components/general/AppTable";
import SubmitBtn from "components/general/SubmitBtn";
import ContentTop from "components/general/ContentTop";
import useTableSearch from "hooks/useTableSearch";
import { formItemLayout, formRowGutter, pageNames } from "constant";
import TableActions from "components/general/TableActions";
import {
  GET_RELATED_SYSTEM_LIST,
  GET_TYPE_LIST,
  GET_TIP_LIST,
  DELETE_TIP,
  ADD_TIP,
} from "../utils/api";
import * as FormItems from "./formItems";
import { messages, showMessage } from "utils/message";
import qs from "query-string";
import useIsMobile from "hooks/useIsMobile";
import MobileList from "components/mobileList/MobileList";
import { useHistory, useLocation } from "react-router-dom";
import ResponsiveList from "../../../components/general/ResponsiveList";

const MachineTip = () => {
  const [selectedRow, setSleetedRow] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [listLoading, setListLoading] = useState(false);
  const [tipList, setTipList] = useState();
  const [typeList, setTypeList] = useState([]);
  const [systemList, setSystemList] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });

  const [initialList, setInitialList] = useState([]);
  ////
  const history = useHistory();
  const location = useLocation();
  const isMobile = useIsMobile();

  const searchParams = qs.parse(location.search);

  const [tableInfo, setTableInfo] = useState({
    pagination: {
      current: searchParams.page ? +searchParams.page : 1,
      defaultPageSize: 20,
    },
  });

  useEffect(() => {
    getSystemListHandler(setSystemList, setListLoading);
  }, []);

  let columns = [
    {
      width: "10%",
      title: "شناسه",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "تیپ",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => (a.title ? a.title.localeCompare(b.title) : false),
      ...tableSearch("title", "تیپ"),
    },
    {
      title: "نوع",
      dataIndex: "type",
      key: "type",
      sorter: (a, b) => (a.type ? a.type.localeCompare(b.type) : false),
      ...tableSearch("type", "نوع"),
    },
    {
      title: "سیستم",
      dataIndex: "systemTitle",
      key: "systemTitle",
      sorter: (a, b) =>
        a.systemTitle ? a.systemTitle.localeCompare(b.systemTitle) : false,
      ...tableSearch("systemTitle", "سیستم"),
    },
    {
      title: "تعداد ماشین آلات",
      dataIndex: "vehicleCount",
      key: "vehicleCount",
      sorter: (a, b) =>
        a.vehicleCount ? a.vehicleCount.localeCompare(b.vehicleCount) : false,
    },
    {
      // width: "15%",
      align: "center",
      title: "تنظیمات",
      key: "action",
      render: (text, record) => {
        return (
          <TableActions
            list={[
              { name: "delete", onClick: () => handleDelete([record.id]) },
            ]}
          />
        );
      },
    },
  ];

  columns = columns.map((column) => {
    return {
      ...column,
      defaultFilteredValue:
        searchParams && searchParams[column?.dataIndex]
          ? [searchParams[column?.dataIndex]]
          : null,
      defaultSortOrder:
        searchParams && searchParams.sort === column?.dataIndex
          ? searchParams?.sort_order || "ascend"
          : null,
    };
  });

  const setData = () => {
    GET_TIP_LIST().then(({ data }) => {
      setTipList(data);
      setInitialList(data);
      setListLoading(false);
      setDeleteLoading(false);
    });
  };

  const handleTableChange = (
    pagination,
    filters,
    sorter,
    { currentDataSource, action }
  ) => {
    //Reset current page on filter or sort
    if (action !== "paginate")
      pagination = {
        ...pagination,
        current: 1,
      };

    // save current page if it is updated as url query param so that the page would be loaded on back or refresh
    if (action !== "filter") {
      const queryParams = qs.parse(location.search);
      const newQueries = { ...queryParams };
      const isDiffPage = pagination.current !== tableInfo.pagination.current;
      const isDiffSort =
        !queryParams?.sort ||
        (queryParams?.sort &&
          (sorter?.field !== queryParams.sort ||
            sorter?.order !== queryParams.sort_order));

      if (isDiffPage) {
        newQueries.page = pagination.current;
      }
      if (isDiffSort) {
        newQueries.sort = sorter.field;
        newQueries.sort_order = sorter.order;
      }
      if (!sorter.order) {
        delete newQueries.sort_order;
        delete newQueries.sort;
      }

      if (isDiffPage || isDiffSort) {
        history.replace({ search: qs.stringify(newQueries) });
      }
    }

    //Trigger changes on table info
    setTableInfo({
      pagination,
      filters,
      sorter,
    });
  };

  useEffect(() => {
    setData();
    getTypeListHandler(setTypeList).then(({ data }) => {
      setInitialList(data);
    });
  }, []);

  const onFinish = (values) => {
    setLoading(true);
    ADD_TIP(values)
      .then((res) => {
        console.log(res, "res");
        if (res.status === 201 && res.data?.identifiers?.length) {
          setLoading(false);
          showMessage("ثبت با موفقیت انجام شد", "success");
          form.resetFields();
          setData();
        } else {
          showMessage(res.data.message, "error");
          setLoading(false);
        }
      })
      .catch((error) => {
        if (error.response) {
          setLoading(false);

          if (error.response.status === 400) {
            showMessage("تیپ ثبت شده تکراری است.", "error");
          }
        }
      });
  };

  const onChangeForm = (values) => {
    const { typeId } = values;
    if (typeId) {
      form.setFieldsValue({ systemId: null });
      //getRelatedSystemListHandler(typeId, setSystemList);
      getSystemListHandler(setSystemList);
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSleetedRow(selectedRowKeys);
    },
  };

  const handleDelete = (list) => {
    setDeleteLoading(true);
    DELETE_TIP(list.map((el) => el.toString()))
      .then((res) => {
        setSleetedRow([]);
        setDeleteLoading(false);
        if (res?.data?.deletedItems > 0) {
          showMessage(messages.deletedSuccessfully("تیپ"), "success");
          setData();
        } else
          showMessage(
            "ایتم فعلی در سایر جداول استفاده شده .در حال حاضر امکان حذف وجود ندارد",
            "error"
          );
      })
      .catch((err) => {
        setDeleteLoading(false);
      });
  };

  const deleteGroup = () => (
    <Popconfirm
      placement="leftTop"
      title={"آیا برای حذف اطمینان دارید ؟"}
      onConfirm={() => handleDelete(selectedRow)}
      okText="بله"
      cancelText="خیر"
    >
      <Button type="danger">حذف</Button>
    </Popconfirm>
  );

  const mobileItemActions = [
    {
      name: "حذف",
      onClick: (record) =>
        Modal.confirm({
          onOk: () => handleDelete([record.id]),
          content: "آیا از حذف این مورد اطمینان دارید؟",
        }),
    },
  ];
  if (listLoading) {
    return <LoadingLogo />;
  }
  return (
    <div>
      <GoBackBtn />
      <ContentTop
        title="تیپ"
        breadcrumbItems={[
          {
            text: "ماشین آلات",
            link: pageNames.machinery.list,
          },
          { text: "تیپ" },
        ]}
      />

      <Form
        form={form}
        {...formItemLayout}
        onFinish={onFinish}
        onValuesChange={onChangeForm}
      >
        <Row gutter={formRowGutter}>
          <FormItems.Type options={typeList} />
          <FormItems.System options={systemList} />
          <FormItems.Title />

          <SubmitBtn loading={loading} />
        </Row>
      </Form>
      <Spin spinning={loading || deleteLoading}>
        <ResponsiveList
          dataSource={tipList}
          pagination={tableInfo?.pagination}
          tableInfo={tableInfo}
          setTableInfo={setTableInfo}
          filterMode="client"
          itemActions={mobileItemActions}
          showFilters={true}
          columns={columns}
          titleKeys={["title", "id"]}
          initialData={initialList}
          setData={setTypeList}
          rowKey={(record) => record.id}
          rowSelection={{ ...rowSelection }}
          footer={selectedRow.length > 0 && deleteGroup}
          onChange={handleTableChange}
        />
      </Spin>
    </div>
  );
};

export default MachineTip;
