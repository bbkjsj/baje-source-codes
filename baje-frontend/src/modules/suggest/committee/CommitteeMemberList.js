import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Menu, message, Modal, Popconfirm, Space, Spin } from "antd";
import AppTable from "components/general/AppTable";
import GoBackBtn from "components/GoBackBtn";
import useCheckAccess from "hooks/useCheckAccess";
import { LayoutContext } from "contex/Layout-context";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import { columns } from "./committeeMemberList/tableColumns";
import * as api from "./utils/api";
import { PlusOutlined } from "@ant-design/icons";
import ContentTop from "../../../components/general/ContentTop";
import useTableSearch from "hooks/useTableSearch";
import { getLink } from "../../../_helpers";
import AppMenuItem from "../../../components/general/AppMenuItem";
import { EXCELLENT_COMMITTEE_ID } from "../const";
import useDateFilterTable from "hooks/useDateFilterTable";
import useTableSelectSearch from "hooks/useTableSelectSearch";
import { committeeMemberPosition } from "./const";
import { getServerDateTime } from "utils/api";
import { isCommitteeMemberActive } from "./utils/tools";
import moment from "moment-jalaali";
import { pageNames } from "constant";
import TableActions from "components/general/TableActions";

const CommitteeMemberList = (props) => {
  const [listLoading, setListLoading] = useState(true);
  const [list, setList] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [committeeData, setCommitteeData] = useState();
  const [serverDate, setServerDate] = useState();
  const history = useHistory();
  const checkAccess = useCheckAccess();
  const layoutContext = useContext(LayoutContext);
  const pageId = props.match.params.id && parseInt(props.match.params.id);
  const tableSearch = useTableSearch();
  const tableDate = useDateFilterTable();
  const selectSearch = useTableSelectSearch();

  const menuBtnList = [
    {
      label: "افزودن عضو جدید",
      id: "newMember",
      variant: "primary",
      icon: <PlusOutlined />,
      url: pageNames.suggest.commitee.member.add + "?committee_id=" + pageId,
    },
  ];

  useEffect(() => {
    (async function () {
      setListLoading(true);
      await getList();

      const res = await api._GET_ITEM(pageId);
      setCommitteeData(res.data);

      const time = await getServerDateTime();
      setServerDate(time.data.date);
    })();
  }, []);

  const getList = async () => {
    setListLoading(true);

    try {
      const res = await api._GET_MEMBER(pageId);

      setListLoading(false);
      setDeleteLoading(false);
      setList(res.data);
    } catch (error) {
      setListLoading(false);
      message.error("دریافت اطلاعات لیست با مشکل روبرو شد");
    }
  };

  const getPageTitle = () => {
    let title = "مدیریت اعضا";

    if (committeeData) title += " - " + committeeData.name;

    return title;
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
      allPromise.push(
        new Promise((resolve, reject) => {
          const listItem = list.find((i) => i.id === item);
          const committeeDep = api._CHECK_MEMBER_COMMITTEE_DEPENDENCY(
            listItem.personnel_id,
            pageId || "-1"
          );
          const excellentDep = api._CHECK_MEMBER_EXCELLENT_DEPENDENCY(
            listItem.personnel_id
          );

          //check all dependencies for this item
          Promise.all([committeeDep, excellentDep])
            .then((values) => {
              const result = values.map((item) => {
                return item.data;
              });

              if (pageId === EXCELLENT_COMMITTEE_ID) resolve(result[1]);
              else resolve(result[0]);
            })
            .catch((error) => {
              reject();
            });
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
        let modalContent =
          "عضو/اعضای مورد نظر، در ارزیابی یک پیشنهاد شرکت کرده اند و امکان حذف آنها وجود ندارد.";

        if (items.length < 2) {
          modalContent += " آیا مایل هستید برای عضو «پایان عضویت» ثبت کنید؟";

          Modal.confirm({
            title: "وابستگی به پیشنهادات",
            content: modalContent,
            onOk: async () => {
              setListLoading(true);
              const res = await api._SET_AS_EXPIRED(items[0]);

              if (res.status === 200) {
                message.success(
                  "تاریخ پایان عضویت فرد مربوطه به امروز تغییر کرد"
                );
                await getList();
              } else message.warning("در ثبت پایان عضویت مشکلی پیش آمده است");

              setListLoading(false);
            },
          });
        } else {
          modalContent +=
            " لطفا برای حذف افراد از دکمه روبروی هر سطر استفاده کنید تا وضعیت انفرادی آن سطر بررسی شود.";

          Modal.warn({
            title: "وابستگی به پیشنهادات",
            content: modalContent,
          });
        }

        return false;
      } else if (hasDependency === false) {
        await api._DELETE_MEMBER(items);
        await getList();

        message.success("آیتم مورد نظر پاک شد");
      } else {
        message.error("بررسی وابستگی فرد با مشکل روبرو شد");
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

  const getRowOptions = (text, record) => {
    const actionItems = [
      // {
      //   title: "ثبت پایان عضویت",
      //   onClick: () => null,
      //   hidden: false
      // },
    ];

    const generateIcons = (record) => {
      const actionsList = [
        {
          name: "edit",
          onClick: () =>
            history.push(
              getLink(pageNames.suggest.commitee.member.edit, record.id)
            ),
          hide:
            (serverDate &&
              isCommitteeMemberActive(record, serverDate) &&
              record.position === committeeMemberPosition.SECRETARY) ||
            (serverDate &&
              record.member_to &&
              moment(record.member_to).isBefore(serverDate, "day")),
        },
        {
          name: "delete",
          onClick: () => deleteItems(record.id),
          hide:
            !(
              record.position === committeeMemberPosition.MEMBER ||
              list.length === 1 ||
              !isCommitteeMemberActive(record, serverDate)
            ) ||
            record.rejects ||
            record.votes,
        },
        {
          name: "End of membership",
          onClick: async () => {
            setListLoading(true);
            const res = await api._SET_AS_EXPIRED(record.id);

            if (res.status === 200) {
              message.success("با موفقیت انجام شد");
              await getList();
            }

            setListLoading(false);
          },
          // temporary hiden
          hide: true || (!record.expire && (record.rejects || record.votes)),
          toolTip: "پایان عضویت",
          children: "پایان عضویت",
          style: { width: "auto" },
          variant: "",
        },
      ];
      return actionsList;
    };

    const OtherActions = () => {
      return actionItems.filter((item) => !item.hidden).length ? (
        <Menu>
          {actionItems.map((item) => (
            <AppMenuItem
              key={item.title}
              onClick={item.onClick}
              hidden={item.hidden}
            >
              {item.title}
            </AppMenuItem>
          ))}
        </Menu>
      ) : (
        false
      );
    };

    return (
      <TableActions list={generateIcons(record)} moreMenu={OtherActions()} />
    );
  };

  return (
    <div>
      <GoBackBtn customUrl={pageNames.suggest.commitee.list} />
      <ContentTop
        title={getPageTitle()}
        className="mt-3"
        breadcrumbItems={[
          { text: "نظام پیشنهادات" },
          { text: "کارگروه‌ها", link: pageNames.suggest.commitee.list },
        ]}
      />

      <div className="w-100 flex-wrap align-center mb-3">
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
              rowOptions: getRowOptions,
              serverDate,
              tableSearch,
              tableDate,
              selectSearch,
            })}
            dataSource={list}
            bordered={true}
            footer={!!selectedRows.length && footer}
            rowClassName={(record, index) => {
              if (serverDate && !isCommitteeMemberActive(record, serverDate))
                return "bg-error";
            }}
          />
        </div>
      </Spin>
    </div>
  );
};

export default CommitteeMemberList;
