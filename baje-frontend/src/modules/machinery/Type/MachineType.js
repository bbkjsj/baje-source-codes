import React, { useState, useEffect } from "react";
import { Form, Row, Button, message, Spin, Popconfirm, Modal } from "antd";
import LoadingLogo from "components/general/LoadingLogo";
import GoBackBtn from "components/GoBackBtn";
import AppTable from "components/general/AppTable";
import SubmitBtn from "components/general/SubmitBtn";
import ContentTop from "components/general/ContentTop";
import useTableSearch from "hooks/useTableSearch";
import { formItemLayout, formRowGutter, pageNames } from "constant";
import TableActions from "components/general/TableActions";
import useTableSelectSearch from "hooks/useTableSelectSearch";
import { GET_TYPE_LIST, DELETE_TYPE, ADD_TYPE } from "../utils/api";
import * as FormItems from "./formItems";
import { messages, showMessage } from "utils/message";
import qs from "query-string";
import useIsMobile from "hooks/useIsMobile";
import MobileList from "components/mobileList/MobileList";
import { useHistory, useLocation } from "react-router-dom";
import ResponsiveList from "components/general/ResponsiveList";

const MachineType = () => {
  const tableSelectSearch = useTableSelectSearch({ saveParams: true });
  const [selectedRow, setSleetedRow] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [typeList, setTypeList] = useState();
  const [listLoading, setListLoading] = useState(true);
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

  let columns = [
    {
      width: 65,
      title: "",
      align: "center",
      dataIndex: "id",
      key: "id",

      render: (text, record, index) => {
        const currPage = tableInfo?.pagination?.current || 1;
        const pageSize = tableInfo?.pagination?.pageSize || 20;
        const prevTotal = (currPage - 1) * pageSize;

        return prevTotal + index + 1;
      },
    },
    {
      title: "شناسه",
      width: "10%",
      align: "center",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "وضعیت پلاک",
      key: "pelak",
      dataIndex: "pelak",
      sorter: (a, b) => (a.name ? a.name.localeCompare(b.name) : false),

      ...tableSelectSearch("palak", " وضعیت پلاک", {
        filters: [
          {
            text: "بدون پلاک",
            value: 0,
          },
          {
            text: "با پلاک",
            value: 1,
          },
        ],
      }),

      onFilter: (value, record) => record.pelak === value,

      render: (text, record) => (text ? "با پلاک" : "بدون پلاک"),
    },
    {
      title: "نوع",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => (a.title ? a.title.localeCompare(b.title) : false),
      ...tableSearch("title", "نوع"),
    },
    {
      title: "کد",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => (a.code ? a.code.localeCompare(b.code) : false),
      ...tableSearch("code", "کد"),
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

  const setData = () => {
    setListLoading(true);
    GET_TYPE_LIST().then(({ data }) => {
      setTypeList(data);
      setInitialList(data);
      setListLoading(false);
    });
  };

  useEffect(() => {
    setData();
  }, []);

  const onFinish = (values) => {
    setLoading(true);
    // values.pelak = parseInt(values.pelak);
    console.log(values, "add-type");
    ADD_TYPE(values)
      .then(() => {
        setLoading(false);
        message.success("با موفقیت انجام شد.");
        form.resetFields();
        setData();
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  if (listLoading) {
    return <LoadingLogo />;
  }

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSleetedRow(selectedRowKeys);
    },
  };

  const handleDelete = (list) => {
    setDeleteLoading(true);

    DELETE_TYPE(list.map((el) => el.toString())).then((res) => {
      setDeleteLoading(false);
      setSleetedRow([]);
      if (res?.data?.deletedItems > 0) {
        showMessage(messages.deletedSuccessfully("نوع"), "success");
        setData();
      } else
        showMessage(
          "ایتم فعلی در سایر جداول استفاده شده .در حال حاضر امکان حذف وجود ندارد",
          "error"
        );
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

  return (
    <div>
      <GoBackBtn />

      <ContentTop
        title="ماشین آلات - جدید"
        breadcrumbItems={[
          {
            text: "ماشین آلات",
            link: pageNames.machinery.list,
          },
          { text: "نوع" },
        ]}
      />

      <Form form={form} {...formItemLayout} onFinish={onFinish}>
        <Row gutter={formRowGutter}>
          <FormItems.Title />
          <FormItems.Pelak />
          <FormItems.Code />
          <SubmitBtn loading={loading} />
        </Row>
      </Form>

      <Spin spinning={loading || deleteLoading}>
        <ResponsiveList
          dataSource={typeList}
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

export default MachineType;
