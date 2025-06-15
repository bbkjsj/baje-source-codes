import * as FormItems from "../MachineAdd/formItems";

import { Button, Card, Form, Modal, Popconfirm, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import {
  deleteMachineHandler,
  getAllMachineList,
  getMachineData,
  getMachineList,
  onFinishUpdate,
} from "../utils/index";
import { formItemLayout, formRowGutter, pageNames } from "constant";
import { useHistory, useLocation } from "react-router-dom";

import { CheckAccess } from "AuxComponent/CheckAccess";
import ContentTop from "components/general/ContentTop";
import ListActions from "components/general/ListActions";
import LoadingLogo from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import ResponsiveList from "../../../components/general/ResponsiveList";
import SubmitBtn from "components/general/SubmitBtn";
import { columns } from "./columns";
import { downloadExcel, getLink } from "_helpers";
import { handleClickExportExl } from "_helpers";
import { permission } from "json/Permission";
import { plateStatusConstant } from "../constant";
import qs, { stringifyUrl } from "query-string";
import { messages, showMessage } from "utils/message";
import useCheckAccess from "hooks/useCheckAccess";
import useIsMobile from "hooks/useIsMobile";
import { useSelector } from "react-redux";
import useTableSearch from "hooks/useTableSearch";

const {
  INSERT_MACHINERY,
  LIST_MACHINERY,
  EDIT_MACHINERY,
  DELETE_MACHINERY,
} = permission;

const MachineList = () => {
  const [selectedRow, setSelectedRow] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [dispalyForm, setDispalyForm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [exportKey, setExportKey] = useState();

  const [plateStatus, setPlateStatus] = useState(
    plateStatusConstant.WITH_LICENSE_PLATE
  );
  const history = useHistory();
  const checkAccess = useCheckAccess();
  const tableSearch = useTableSearch({
    saveParams: true,
    filterMultiple: true,
  });

  const currentOffice = useSelector((state) => state.currentOffice);
  const currentContract = useSelector((state) => state.currentContract);
  const currentEnvironment = useSelector((state) => state.currentEnvironment);

  const [form] = Form.useForm();

  const [initialList, setInitialList] = useState([]);
  const [list, setList] = useState([]);
  ////
  const location = useLocation();

  const searchParams = qs.parse(location.search);

  const [tableInfo, setTableInfo] = useState({
    pagination: {
      current: searchParams.page ? +searchParams.page : 1,
      defaultPageSize: 10,
    },
  });

  // normal onFinish values retrieval isn't possible with cropping
  const [uploadImages, setUploadImages] = useState({
    vehicleCard: undefined,
    vehicleGreenCard: undefined,
    ownDoc: undefined,
  });

  const toggleForm = () => {
    if (dispalyForm) {
      form.resetFields();
    }
    setDispalyForm((prev) => !prev);
  };

  const menuBtnList = [
    {
      url: pageNames.machinery.add,
      label: "ماشین جدید",
      id: "newMachine",
      permission: INSERT_MACHINERY,
      disabled: currentOffice === "-1",
      title:
        currentOffice === "-1"
          ? "برای ثبت ماشین ابتدا شرکت را از منوی بالا انتخاب نمایید"
          : "",
    },
    {
      url: pageNames.machinery.addGroup,
      label: "ثبت گروهی",
      id: "group",
    },
    {
      handleClick: toggleForm,
      label: "اسناد",
      id: "doc",
      disabled: selectedRow.length !== 1,
    },
  ];

  const successDelete = async () => {
    showMessage(messages.deletedSuccessfully("ماشین"), "success");
    try {
      await getMachineList(
        setList,
        setListLoading,
        currentContract,
        currentOffice,
        setExportKey
      );

      setDeleteLoading(false);
      setSelectedRow([]);
    } catch (error) {}
  };

  useEffect(() => {
    if (!checkAccess(LIST_MACHINERY)) {
      setListLoading(false);
    }
    if (checkAccess(LIST_MACHINERY)) {
      setListLoading(true);

      if (/*currentOffice === "-1" && currentEnvironment === "-1"*/ false) {
        (async () => {
          await getAllMachineList(
            setList,
            setListLoading,
            currentContract,
            currentOffice,
            currentEnvironment,
            setExportKey,
            setInitialList
          );
        })();
      } else {
        (async () => {
          await getMachineList(
            setList,
            setListLoading,
            currentContract,
            currentOffice,
            currentEnvironment,
            setInitialList
          );
        })();
      }
    }
  }, [currentOffice, currentContract, currentEnvironment]);

  async function getList() {
    await getMachineList(
      setList,
      setListLoading,
      currentContract,
      currentOffice,
      currentEnvironment,
      setInitialList
    );
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      if (selectedRows.length != 1) {
        setDispalyForm(false);
      }

      setSelectedRow(selectedRows);
    },
  };

  const deleteGroup = () => (
    <Popconfirm
      placement="leftTop"
      title={"آیا برای حذف اطمینان دارید ؟"}
      onConfirm={() => {
        deleteMachineHandler(
          selectedRow,
          setDeleteLoading,
          successDelete,
          getList
        );
      }}
      okText="بله"
      cancelText="خیر"
    >
      <Button type="danger">حذف</Button>
    </Popconfirm>
  );
  const submitDocs = async (values) => {
    console.log("UPLOAD:", uploadImages);

    const successFulMessage = () =>
      showMessage("ثبت با موفقیت انجام شد", "success");

    // const data = await getMachineData(selectedRow[0].id);
    // console.log(data, "dta!!!!!!!!!!");
    // const newData = {
    //   description: data.description,
    //   styleId: data.styleId,
    //   typeId: data.typeId,
    //   ownerId: data.ownerId,
    //   status: data.status,
    //   organizationCode: data.organizationCode,
    //   engineNumber: data.engineNumber,
    //   chassisNumber: data.chassisNumber,
    //   vinNumber: data.vinNumber,
    //   serialNumber: data.serialNumber,
    //   color: data.color,
    //   gearBox: data.gearBox,
    //   price: data.price,
    //   contractId: data.contractId,
    //   ownerType: data.ownerType,
    //   plaque1: data.plaque1,
    //   plaque2: data.plaque2,
    //   plaque3: data.plaque3,
    //   plaque4: data.plaque4,
    //   dateType: data.dateType,
    //   madeYear: data.madeYear,
    //   systemId: data.systemId,
    // };

    // if (data.pelak) {
    //   setPlateStatus(plateStatusConstant.WITH_LICENSE_PLATE);
    // } else {
    //   setPlateStatus(plateStatusConstant.WITHOUT_LICENSE_PLATE);
    // }

    console.log("edit macine-values", { ...uploadImages });

    for (let key in uploadImages) {
      if (!uploadImages[key]) {
        delete uploadImages[key];
      }
    }

    if (!Object.keys(uploadImages).length) {
      Modal.warn({ content: "لطفا یکی از موارد را آپلود کنید" });
      return;
    }

    const reponse = await onFinishUpdate(
      { ...uploadImages },
      null,
      undefined,
      setListLoading,
      successFulMessage,
      selectedRow[0].id,
      currentOffice
    );

    setSelectedRow([]);
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
        history.push(getLink(pageNames.machinery.edit, record.id)),
      permission: EDIT_MACHINERY,
    },
    {
      name: "مشاهده بازرسی ها",
      onClick: (record) => {
        history.push(
          stringifyUrl({
            url: pageNames.hse.audit.index,
            query: { organization_code: record.organization_code },
          })
        );
      },
    },
    {
      name: "بازرسی جدید",
      onClick: (record) => {
        history.push(
          stringifyUrl({
            url: pageNames.hse.audit.addEdit,
            query: { organization_code: record.organization_code },
          })
        );
      },
    },
    {
      name: "بیمه شخص ثالث",
      onClick: (record) => {
        history.push(
          stringifyUrl({
            url: pageNames.personnel.insurance.thirdPartyIns.list,
            query: { machineOrganizationCode: record.organizationCode },
          })
        );
      },
    },
    {
      name: "حذف",
      onClick: (record) =>
        Modal.confirm({
          onOk: () =>
            deleteMachineHandler(
              [{ id: record.id, cid: record.contract_id }],
              setDeleteLoading,
              successDelete
            ),
          content: "آیا از حذف این مورد اطمینان دارید؟",
        }),
      permission: DELETE_MACHINERY,
    },
  ];

  if (listLoading) {
    return <LoadingLogo />;
  }
  return (
    <>
      <ContentTop noBack title="ماشین آلات" />
      <div className="w-100 flex-wrap align-center">
        <MenuInlineBtn list={menuBtnList} />
        <ListActions
          className="mr-md-auto mt-3 mt-lg-0"
          noPrint
          noFilter
          noSort
          actions={{
            excelExport: () =>
              downloadExcel("/api/v1/baje/vehicle/advance-search/excel"),
          }}
        />
      </div>
      {dispalyForm && (
        <Card style={{ marginTop: "1rem" }}>
          <Form {...formItemLayout} onFinish={submitDocs}>
            <Row gutter={formRowGutter}>
              <FormItems.VehicleCard
                onChange={(file) => {
                  setUploadImages((images) => ({
                    ...images,
                    vehicleCard: file,
                  }));
                }}
              />
              <FormItems.VehicleGreenCard
                onChange={(file) => {
                  setUploadImages((images) => ({
                    ...images,
                    vehicleGreenCard: file,
                  }));
                }}
              />
              <FormItems.OwnDoc
                onChange={(file) => {
                  setUploadImages((images) => ({
                    ...images,
                    ownDoc: file,
                  }));
                }}
              />
              <SubmitBtn loading={btnLoading} />
            </Row>
          </Form>
        </Card>
      )}

      <CheckAccess permission={LIST_MACHINERY}>
        <Spin spinning={deleteLoading}>
          <ResponsiveList
            dataSource={list}
            pagination={tableInfo?.pagination}
            tableInfo={tableInfo}
            setTableInfo={setTableInfo}
            filterMode="client"
            selected={selectedRow}
            onSelectedChange={setSelectedRow}
            itemActions={mobileItemActions}
            showFilters={true}
            columns={columns(
              setDeleteLoading,
              successDelete,
              history,
              tableSearch,
              qs.parse(location.search),
              tableInfo
            )}
            viewLink={(record) => getLink(pageNames.machinery.view, record.id)}
            titleKeys={["type", "companyName", "organizationCode"]}
            titleSeparator=" | "
            initialData={initialList}
            setData={setList}
            loading={listLoading}
            rowKey={(record) => record.id}
            rowSelection={{ ...rowSelection }}
            footer={selectedRow.length > 0 && deleteGroup}
            onChange={handleTableChange}
          />
        </Spin>
      </CheckAccess>
    </>
  );
};

export default MachineList;
