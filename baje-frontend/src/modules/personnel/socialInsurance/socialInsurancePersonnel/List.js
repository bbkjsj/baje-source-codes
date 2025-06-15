import React, { useContext, useEffect, useState } from "react";
import { Modal } from "antd";
import GoBackBtn from "components/GoBackBtn";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import Table from "./common/Table";
import { getLink, priceNormalizer } from "_helpers";
import { useParams } from "react-router-dom";
import SocialInsuranceErrors from "../SocialInsuranceErrors";
import PersonAddGroup from "./PersonAddGroup";
import AppButton from "components/general/AppButton";
import ContentTop from "components/general/ContentTop";
import { PlusOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import DetailDescription from "./common/DetailDescription";
import ListActions from "components/general/ListActions";
import { handleClickExportExl } from "_helpers";
import { LayoutContext } from "contex/Layout-context";
import { useDeleteAllPersons, useInsurancePageInfo } from "./utils/hooks";
import EditModal from "./list/EditModal";
import DetailModal from "./list/DetailModal";
import { CheckAccess } from "AuxComponent/CheckAccess";
import { permission } from "json/Permission";
import { pageNames } from "constant";

const MembersList = (props) => {
  const routeParams = useParams();
  const {
    insurance,
    loading,
    exportKey,
    list,
    setLoading,
    updatePageData,
  } = useInsurancePageInfo();

  const { loading: deleteAllLoading, deleteAllPersons } = useDeleteAllPersons();
  const { setDisableHeaderSelects } = useContext(LayoutContext);

  const [selectedRow, setSelectedRow] = useState([]);
  const [insuranceErrorsModal, setInsuranceErrorsModal] = useState(false);
  const [addGroupModal, setAddGroupModal] = useState(false);
  const [resultModal, setResultModal] = useState(false);
  const [resultList, setResultList] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

  let btnForNotConfirm = [
    {
      url: getLink(
        pageNames.personnel.insurance.tamin.personnel.add,
        routeParams.id
      ),
      label: "جدید",
      id: "newRequest",
      variant: "primary",
      icon: <PlusOutlined />,
    },
    {
      handleClick: () => setAddGroupModal(true),
      label: "اضافه کردن گروهی",
      id: "addGroup",
      icon: <UsergroupAddOutlined />,
    },
    {
      // url: getLink(pageNames.personnel.insurance.tamin.personnel.add, routeParams.id),
      label: "حذف کلی",
      id: "removeAll",
      handleClick: () => deleteAll(),
      loading: deleteAllLoading,
    },
  ];
  let menuBtnList = [
    // {
    //   handleClick: () => setInsuranceErrorsModal(true),
    //   label: "خطا یابی",
    //   id: "errors",
    // },
  ];

  if (!routeParams.status) menuBtnList.push(btnForNotConfirm);
  if (routeParams.status === "عدم تایید" || routeParams.status === "null") {
    menuBtnList = menuBtnList.concat(btnForNotConfirm);
  }

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedRow(selectedRowKeys);
    },
  };

  const results = resultList.map((i, idx) => {
    if (i.message && i.message !== "ثبت شد") {
      return <p key={"result-" + idx}>{i.message || "-"}</p>;
    }
  });

  const deleteAll = () => deleteAllPersons(routeParams.id, updatePageData);

  const onViewHandler = (record) => {
    console.log(record, "!record-detail");
    setModalData(record);
    setDetailModalVisible(true);
  };

  const onEditHandler = (record) => {
    console.log(record, "!record -edit");
    setModalData(record);
    setEditModalVisible(true);
  };

  // load insurance context if not exist
  useEffect(() => {
    // disable header selects if in social insurance members page and enable them when the user leaves this page
    setDisableHeaderSelects(true);
    return () => {
      setDisableHeaderSelects(false);
    };
  }, []);

  if (loading) {
    return <LogoLoading />;
  }

  return (
    <>
      <EditModal
        visible={editModalVisible}
        setVisible={setEditModalVisible}
        data={modalData}
      />
      <DetailModal
        visible={detailModalVisible}
        setVisible={setDetailModalVisible}
        data={modalData}
      />

      <Modal
        visible={addGroupModal}
        onCancel={() => setAddGroupModal(false)}
        footer={null}
        title="اضافه کردن گروهی افراد"
        width={640}
      >
        <PersonAddGroup
          updateList={() => {
            updatePageData();
            setAddGroupModal(false);
          }}
        />
      </Modal>

      <Modal
        visible={resultModal}
        closable={false}
        title="خطاهای اظافه کردن گروهی"
        footer={[
          <AppButton
            key="submit"
            type="primary"
            onClick={() => window.location.reload(false)}
          >
            تایید
          </AppButton>,
        ]}
      >
        <div>{results}</div>
      </Modal>

      <Modal
        // style={{ width: "80%" }}
        width={"90%"}
        visible={insuranceErrorsModal}
        onCancel={() => setInsuranceErrorsModal(false)}
        footer={null}
        title="خطا های لیست بیمه"
      >
        <SocialInsuranceErrors />
      </Modal>

      <GoBackBtn />

      <ContentTop
        title="لیست ریز اسامی بیمه تأمین اجتماعی"
        className="mt-3"
        breadcrumbItems={[
          {
            text: "بیمه تامین اجتماعی",
            link: pageNames.personnel.insurance.tamin.list,
          },
          { text: "ریز اسامی " },
        ]}
      />
      <div className="w-100 flex-wrap align-center mb-3">
        <MenuInlineBtn list={menuBtnList} />

        <CheckAccess
          permission={permission.SOCIAL_INSURANCE_MEMEBERS_EXCEL_EXPORT}
        >
          <ListActions
            className="mr-md-auto mt-lg-0"
            noFilter
            noSort
            noPrint
            actions={{
              excelExport: () => {
                handleClickExportExl(exportKey);
              },
            }}
          />
        </CheckAccess>
      </div>

      <DetailDescription
        items={[
          {
            label: "دوره",
            value: insurance?.year + "-" + insurance?.month,
          },
          {
            label: "شماره لیست",
            value: insurance?.list_number,
          },
          {
            label: "ردیف پیمان",
            value: insurance?.row,
          },
          {
            label: "کد کارگاهی",
            value: insurance?.workshop_code,
          },
          {
            label: "مجموع حق بیمه",
            value: insurance?.total_insured
              ? priceNormalizer(insurance.total_insured)
              : "-",
          },
          {
            label: "تعداد افراد",
            value: insurance?.personnel_count,
          },
          {
            label: "وضعیت",
            value: insurance?.status,
          },
        ]}
        loading={false}
      />

      <div className="card-container">
        <Table
          insurance={insurance}
          data={list}
          status={routeParams.status}
          updateList={updatePageData}
          selectedRow={selectedRow}
          rowSelection={rowSelection}
          setLoadingList={setLoading}
          onViewHandler={onViewHandler}
          onEditHandler={onEditHandler}
        />
      </div>
    </>
  );
};

export default MembersList;
