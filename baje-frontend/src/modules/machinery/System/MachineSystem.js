import React, { useState, useEffect } from "react";
import { Form, Row, Button, message, Spin, Popconfirm, Modal } from "antd";
import * as FormItems from "./formItems";
import { getTypeListHandler } from "../utils/index";
import LoadingLogo from "components/general/LoadingLogo";
import GoBackBtn from "components/GoBackBtn";
import AppTable from "components/general/AppTable";
import SubmitBtn from "components/general/SubmitBtn";
import ContentTop from "components/general/ContentTop";
import useTableSearch from "hooks/useTableSearch";
import { formItemLayout, formRowGutter, pageNames } from "constant";
import TableActions from "components/general/TableActions";
import {
  GET_SYSTEM_LIST,
  GET_TYPE_LIST,
  ADD_SYSTEM,
  DELETE_SYSTEM,
  EDIT_SYSTEM,
} from "../utils/api";
import AppModal from "components/general/AppModal";
import { config } from "constant";
import { messages, showMessage } from "utils/message";
import qs from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import ResponsiveList from "../../../components/general/ResponsiveList";

const MachineSystem = () => {
  const [selectedRow, setSleetedRow] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editLoading, seteditLoading] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [initialList, setInitialList] = useState([]);
  const [systemList, setSystemList] = useState();
  const [listLoading, setListLoading] = useState(true);
  const [typeList, setTypeList] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });

  ////
  const history = useHistory();
  const location = useLocation();

  const searchParams = qs.parse(location.search);

  const [tableInfo, setTableInfo] = useState({
    pagination: {
      current: searchParams.page ? +searchParams.page : 1,
      defaultPageSize: 20,
    },
  });

  let columns = [
    // {
    //   width: "10%",
    //   title: "ردیف",
    //   align: "center",
    //   dataIndex: "id",
    //   key: "id",
    // },

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
    // {
    //   title: "نوع",
    //   dataIndex: "typeTitle",
    //   key: "typeTitle",
    //   sorter: (a, b) =>
    //     a.typeTitle ? a.typeTitle.localeCompare(b.typeTitle) : false,
    //   ...tableSearch("typeTitle", "نوع"),
    // },
    {
      title: "عنوان فارسی",
      align: "center",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "عنوان لاتین",
      align: "center",
      dataIndex: "enTitle",
      key: "enTitle",
      sorter: (a, b) =>
        a.enTitle ? a.enTitle.localeCompare(b.enTitle) : false,
      ...tableSearch("enTitle", "عنوان لاتین"),
    },
    {
      title: "لوگو",
      align: "center",
      dataIndex: "logo",
      key: "logo",
      render: (logo) => {
        if (logo) {
          return (
            <img
              alt="imagee"
              src={`${config.url.API_URL + "/api/v1/baje/" + logo}`}
              style={{ height: "40px", maxWidth: "100%", objectFit: "contain" }}
            />
          );
        } else {
          return "-";
        }
      },
    },
    // {
    //   title: "سیستم",
    //   dataIndex: "title",
    //   key: "title",
    //   sorter: (a, b) => (a.title ? a.title.localeCompare(b.title) : false),
    //   ...tableSearch("title", "سیستم"),
    // },
    {
      title: "تعداد ماشین آلات",
      dataIndex: "vehicleCount",
      key: "vehicleCount",
      sorter: (a, b) =>
        a.vehicleCount ? a.vehicleCount.localeCompare(b.vehicleCount) : false,
    },
    {
      align: "center",
      title: "تنظیمات",
      key: "action",
      render: (text, record) => {
        return (
          <TableActions
            list={[
              { name: "delete", onClick: () => handleDelete([record.id]) },
              {
                name: "edit",
                onClick: () => {
                  const type = typeList.find(
                    (el) => el.id === record.type_id_fk
                  );

                  console.log(type, "type");

                  editForm.setFieldsValue({
                    title: record.title,
                    typeId: type.id,
                    logo: record.logo,
                    enTitle: record.enTitle,
                  });

                  setEditRecord(record.id);
                },
              },
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
    GET_SYSTEM_LIST().then(({ data }) => {
      setSystemList(data);
      setInitialList(data);
      setListLoading(false);
      setDeleteLoading(false);
    });
  };

  useEffect(() => {
    setData();
    getTypeListHandler(setTypeList);
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const fd = new FormData();
      for (const key in values) {
        if (!values[key]) continue;
        if (Object.hasOwnProperty.call(values, key)) {
          const element = values[key];
          if (key === "file") {
            fd.append("logo", values.file[0]["originFileObj"]);
          } else {
            fd.append(key, element);
          }
        }
      }

      await ADD_SYSTEM(fd);
      message.success("با موفقیت انجام شد.");
      form.resetFields();
      setData();
      setLoading(false);
    } catch (error) {
      console.log(error.message);

      if (error.response.status === 400) {
        showMessage("سیستم ثبت شده تکراری است.", "error");
      }
      setLoading(false);
    }
  };

  const handleDelete = (list) => {
    setDeleteLoading(true);
    DELETE_SYSTEM(list.map((el) => el.toString()))
      .then((res) => {
        setSleetedRow([]);
        setDeleteLoading(false);

        if (res?.data?.deletedItems > 0) {
          showMessage(messages.deletedSuccessfully("سیستم"), "success");
          setData();
        } else
          showMessage(
            "ایتم فعلی در سایر جداول استفاده شده .در حال حاضر امکان حذف وجود ندارد",
            "error"
          );
      })
      .catch((err) => {
        setDeleteLoading(false);
        message.error("مشکلی پیش آمده است");
      });
  };

  const onEdit = async (values) => {
    try {
      const fd = new FormData();
      for (const key in values) {
        if (!values[key]) continue;
        if (Object.hasOwnProperty.call(values, key)) {
          const element = values[key];
          if (key === "file") {
            fd.append("logo", values.file[0]["originFileObj"]);
          } else {
            fd.append(key, element);
          }
        }
      }

      await EDIT_SYSTEM(editRecord, fd);

      setEditRecord(false);
      setData();
    } catch (error) {
      console.log(error.message);
      setEditRecord(false);
    }
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

  if (listLoading) {
    return <LoadingLogo />;
  }

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSleetedRow(selectedRowKeys);
    },
  };

  const mobileItemActions = [
    {
      name: "ویرایش",
      onClick: (record) => {
        const type = typeList.find((el) => el.id === record.type_id_fk);

        editForm.setFieldsValue({
          title: record.title,
          typeId: type.id,
          logo: record.logo,
          enTitle: record.enTitle,
        });

        setEditRecord(record.id);
      },
    },
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
    <>
      <GoBackBtn />
      <ContentTop
        title="سیستم"
        breadcrumbItems={[
          {
            text: "ماشین آلات",
            link: pageNames.machinery.list,
          },
          { text: "سیستم" },
        ]}
      />

      <Form form={form} {...formItemLayout} onFinish={onFinish}>
        <Row gutter={formRowGutter}>
          <FormItems.Title />
          <FormItems.LatinTitle />
          {/* <FormItems.Type options={typeList} /> */}
          <FormItems.Logo />

          <SubmitBtn loading={loading} />
        </Row>
      </Form>

      <Spin spinning={loading || deleteLoading}>
        <ResponsiveList
          dataSource={systemList}
          pagination={tableInfo?.pagination}
          tableInfo={tableInfo}
          setTableInfo={setTableInfo}
          filterMode="client"
          itemActions={mobileItemActions}
          showFilters={true}
          columns={columns}
          titleKeys={["title"]}
          initialData={initialList}
          setData={setSystemList}
          rowKey={(record) => record.id}
          rowSelection={{ ...rowSelection }}
          footer={selectedRow.length > 0 && deleteGroup}
          onChange={handleTableChange}
        />
      </Spin>
      <AppModal
        visible={editRecord}
        footer={null}
        title="ویرایش سیستم"
        closable={true}
        onCancel={() => {
          editForm.resetFields();
          setEditRecord(null);
        }}
      >
        <Form form={editForm} onFinish={onEdit}>
          <Row gutter={formRowGutter}>
            <FormItems.Title />
            <FormItems.LatinTitle />
            <FormItems.Type options={typeList} />
            <FormItems.Logo
              defaultFileList={[
                {
                  uid: "-1",
                  name: "image.png",
                  status: "done",
                  url: `${
                    config.url.API_URL +
                    "/api/v1/baje/" +
                    editForm.getFieldValue("logo")
                  }`,
                },
              ]}
            />
            <SubmitBtn loading={editLoading} />
          </Row>
        </Form>
      </AppModal>
    </>
  );
};

export default MachineSystem;
