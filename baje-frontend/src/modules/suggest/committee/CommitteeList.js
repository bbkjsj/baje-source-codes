import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { message, notification, Spin } from "antd";
import CommitteeAddModal from "./CommitteeAddModal";
import AppTable from "components/general/AppTable";
import GoBackBtn from "components/GoBackBtn";
import axios from "api/appAxios";
import useCheckAccess from "hooks/useCheckAccess";
import { LayoutContext } from "contex/Layout-context";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import { columns } from "./committeeList/tableColumns";
import { PlusOutlined } from "@ant-design/icons";
import ContentTop from "../../../components/general/ContentTop";
import useTableSearch from "hooks/useTableSearch";
import useRangeFilter from "hooks/useRangeFilter";
import { _GET_MEMBER } from "./utils/api";
import qs from "query-string";
import { pageNames } from "constant";
import { getLink } from "_helpers";
import ResponsiveList from "components/general/ResponsiveList";

const CommitteeList = (props) => {
  const [listLoading, setListLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [list, setList] = useState([]);
  const [initialList, setInitialList] = useState();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [committeeId, setCommitteeId] = useState(0);
  const history = useHistory();
  const checkAccess = useCheckAccess();
  const layoutContext = useContext(LayoutContext);
  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });
  const rangeFilter = useRangeFilter();

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
      label: "کارگروه جدید",
      id: "newCommittee",
      variant: "primary",
      icon: <PlusOutlined />,
      handleClick: () => {
        setCommitteeId(0);
        openAddCommitteeModal();
      },
    },
  ];

  const getList = () => {
    setListLoading(true);

    axios
      .get(`/api/survey/workgroups/all`)
      .then((res) => {
        setListLoading(false);
        setDeleteLoading(false);
        setList(res.data);
        setInitialList(res.data);
        setCommitteeId(0);
      })
      .catch((err) => {
        setListLoading(false);
        console.log(err);
      });
  };

  const deleteItems = (items) => {
    if (!Array.isArray(items)) items = [items];
    // check to have memeber in them
    items.forEach((id, i) => {
      _GET_MEMBER(id)
        .then((res) => {
          console.log(res, i, "res ,id !!");
          if (res?.data?.length > 0) {
            message.error(
              `این کارگروه دارای ${res.data.length} عضو می باشد. شما می بایست ابتدا نسبت به حذف اعضا آن اقدام نمایید`
            );
          } else {
            axios
              .delete(`/api/survey/workgroup`, { data: { ids: items } })
              .then((res) => {
                getList();
                message.success("آیتم مورد نظر پاک شد");
              })
              .catch((err) => {
                message.error(err.data);
                setDeleteLoading(false);
              });
          }
        })
        .catch((error) => {
          console.log(error, "error");
        });
    });
  };

  const openAddCommitteeModal = () => {
    setIsModalVisible(true);
  };

  const closeAddCommitteeModal = () => {
    setIsModalVisible(false);
  };

  const handleOnAddCommitteeSave = () => {
    closeAddCommitteeModal();
    getList();
  };

  useEffect(() => {
    getList();
    setListLoading(true);

    if (props.match.path.indexOf("add") !== -1) openAddCommitteeModal();
  }, []);

  useEffect(() => {
    committeeId && openAddCommitteeModal();
  }, [committeeId]);

  if (listLoading) {
    return <LogoLoading />;
  }

  const handleOnChangeTablePage = (page) => {
    layoutContext.setTablePage(page);
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
      onClick: (record) => setCommitteeId(record.id),
      hide: (record) => !record.fix,
    },
    {
      name: "حذف",
      onClick: (record) => deleteItems(record.id),
      hide: (record) => !record.fix,
    },
    {
      name: "اعضا",
      onClick: (record) =>
        history.push(
          getLink(pageNames.suggest.commitee.member.list, record.id)
        ),
    },
    {
      name: "معیار های ارزیابی",
      onClick: (record) =>
        history.push(
          getLink(pageNames.suggest.assessmentCriteria.list, record.id)
        ),
      hide: (record) => !record.fix,
    },
    {
      name: "معیار های رد",
      onClick: (record) =>
        history.push(
          getLink(pageNames.suggest.rejectionCriteria.list, record.id)
        ),
      hide: (record) => !record.fix,
    },
  ];

  return (
    <div>
      <CommitteeAddModal
        visible={isModalVisible}
        onCancel={closeAddCommitteeModal}
        onSave={handleOnAddCommitteeSave}
        dataId={committeeId}
      />
      <GoBackBtn />
      <ContentTop
        title="مدیریت کارگروه ها"
        className="mt-3"
        breadcrumbItems={[{ text: "نظام پیشنهادات" }, { text: "کارگروه‌ها" }]}
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
              setCommitteeId,
              tableSearch,
              rangeFilter,
              searchParams: qs.parse(location.search),
            })}
            dataSource={list}
            bordered={true}
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

export default CommitteeList;
