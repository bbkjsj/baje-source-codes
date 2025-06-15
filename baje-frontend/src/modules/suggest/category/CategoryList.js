import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button, message, Modal, Popconfirm, Spin } from "antd";
import AppTable from "components/general/AppTable";
import GoBackBtn from "components/GoBackBtn";
import useCheckAccess from "hooks/useCheckAccess";
import { LayoutContext } from "contex/Layout-context";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import { columns } from "./categoryList/tableColumns";
import * as api from "./utils/api";
import { PlusOutlined } from "@ant-design/icons";
import ContentTop from "components/general/ContentTop";
import useTableSearch from "hooks/useTableSearch";
import useTableSelect from "hooks/useTableSelectSearch";
import { pageNames } from "constant";
import qs from "query-string";
import { getLink } from "_helpers";
import ResponsiveList from "components/general/ResponsiveList";

const CategoryList = (props) => {
  const [listLoading, setListLoading] = useState(true);
  const [list, setList] = useState([]);
  const [initialList, setInitialList] = useState();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const history = useHistory();
  const checkAccess = useCheckAccess();
  const layoutContext = useContext(LayoutContext);
  const pageId = props.match.params.id && parseInt(props.match.params.id);
  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const tableSelect = useTableSelect({
    saveParams: true,
    filterMultiple: true,
  });

  const location = useLocation();

  const searchParams = qs.parse(location.search);

  const [tableInfo, setTableInfo] = useState({
    pagination: {
      current: searchParams.page ? +searchParams.page : 1,
      defaultPageSize: 20,
    },
  });

  const menuBtnList = [
    {
      label: "افزودن حوزه پیشنهاد جدید",
      id: "newCategory",
      url: pageNames.suggest.category.add,
      variant: "primary",
      icon: <PlusOutlined />,
    },
  ];

  useEffect(() => {
    (async function () {
      setListLoading(true);
      await getList();
    })();
  }, []);

  const getList = async () => {
    setListLoading(true);

    try {
      const res = await api._GET(pageId);

      setListLoading(false);
      setDeleteLoading(false);
      setList(res.data);
      setInitialList(res.data);
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

  const checkDependencies = async (items) => {
    if (!Array.isArray(items)) items = [items];
    let allPromise = [];

    //check dependency for each selected item
    items.forEach((item) => {
      const listItem = list.find((i) => i.id === item);

      allPromise.push(
        new Promise(async (resolve, reject) => {
          try {
            const res = await api._CHECK_SUGGESTION_DEPENDENCY(listItem.name);
            resolve(res.data === true);
          } catch (error) {
            reject();
          }
        })
      );
    });

    try {
      const values = await Promise.all(allPromise);
      return values.includes(true);
    } catch (error) {
      return null;
    }
  };

  const deleteItems = async (items) => {
    if (!Array.isArray(items)) items = [items];
    setDeleteLoading(true);

    try {
      //check for dependency
      const hasDependency = await checkDependencies(items);
      setDeleteLoading(false);

      //delete if there is no dependency
      if (hasDependency === true) {
        Modal.warn({
          title: "وابستگی به پیشنهادات",
          content:
            "حوزه / حوزه های مورد نظر، در یک پیشنهاد مورد استفاده قرار گرفته اند و امکان حذف آنها وجود ندارد",
        });

        return false;
      } else if (hasDependency === false) {
        await api._DELETE(items);
        await getList();

        message.success("آیتم مورد نظر پاک شد");
      } else {
        message.error("بررسی وابستگی حوزه با مشکل روبرو شد");
      }
    } catch (error) {
      message.error(error.data);
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

  const mobileItemActions = [
    {
      name: "ویرایش",
      onClick: (record) =>
        history.push(getLink(pageNames.suggest.category.edit, record.id)),
    },
    {
      name: "حذف",
      onClick: (record) => deleteItems(record.id),
    },
  ];

  return (
    <div>
      <ContentTop
        noBack
        title="مدیریت حوزه های پیشنهاد"
        className="mt-3"
        breadcrumbItems={[{ text: "نظام پیشنهادات" }]}
      />

      <div className="w-100 flex-wrap align-center mb-3">
        <MenuInlineBtn list={menuBtnList} />
      </div>
      <Spin spinning={deleteLoading}>
        <div className="card-container">
          <ResponsiveList
            rowKey={(record) => record.id}
            size="small"
            scroll={{ y: 600, x: true }}
            onRow={() => false}
            columns={columns({
              list,
              history,
              deleteHandler: deleteItems,
              tableSearch,
              tableSelect,
              searchParams: qs.parse(location.search),
            })}
            dataSource={list}
            bordered={true}
            rowSelection={{ ...rowSelection }}
            footer={!!selectedRows.length && footer}
            pagination={tableInfo.pagination}
            onChange={handleTableChange}
            tableInfo={tableInfo}
            setTableInfo={setTableInfo}
            filterMode="client"
            itemActions={mobileItemActions}
            showFilters={true}
            titleKeys={["name"]}
            initialData={initialList}
            setData={setList}
          />
        </div>
      </Spin>
    </div>
  );
};

export default CategoryList;
