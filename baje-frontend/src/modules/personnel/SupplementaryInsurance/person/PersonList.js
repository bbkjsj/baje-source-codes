import React, { useEffect, useContext, useState, useRef } from "react";
import { Form, Input } from "antd";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import GoBackBtn from "components/GoBackBtn";
import {
  withRouter,
  useHistory,
  Redirect,
  useLocation,
} from "react-router-dom";
import {
  getLink,
  handleClickExportExl,
  convertDateToEN,
  covetFormatDateToFA,
  downloadExcelFromRawData,
  downloadExcel,
} from "_helpers";
import Table from "./personList/Table";
import MainPersonAdd from "./MainPersonAdd";
import PersonEdit from "./PersonEdit";
import { useGetPerson, useGetUserAndSubordinate } from "./util/hooks";
import PersonAddGroup from "./PersonAddGroup";
import PersonIntroductionLetter from "./PersonIntroductionLetter";
import { Modal, Button, message } from "antd";
import ContentTop from "components/general/ContentTop";
import ListActions from "components/general/ListActions";
import * as Api from "../util/api";
import * as personApi from "./util/api";
import AddSubordinateForm from "./components/AddSubordinateForm";
import * as FormItems from "./components/FormItems";
import { pageNames } from "constant";
import { getServerDateTime } from "../../../../utils/api";
import api from "api/appAxios";
import endpoints from "modules/personnel/endpoints";
import qs from "query-string";

const PersonList = ({ match }) => {
  const [subAddForm] = Form.useForm();
  const [subEditForm] = Form.useForm();
  const history = useHistory();
  const insuranceID = match.params.id;
  // const {
  //   loading,
  //   setLoading: setLoadingList,
  //   data: tableData,
  //   getList: getPersonList,
  // } = useGetPerson(insuranceID);
  const [loading, setLoadingList] = useState(false);
  const [tableData, setTableData] = useState();
  const location = useLocation();

  const { getSubordinates, sub } = useGetUserAndSubordinate();

  let tableDataTimeout = useRef(0);
  const [addGroupModal, setAddGroupModal] = useState(false);
  const [introductionLetterModal, setIntroductionLetterModal] = useState(false);
  const [selectedRow, setSleetedRow] = useState([]);
  const [selectedRowInfo, setSelectedRowInfo] = useState([]);
  const [editModal, setEditModal] = useState(); // save user id for edit
  const [resultModal, setResultModal] = useState(false);
  const [resultList, setResultList] = useState([]);
  const [displayMessage, setDisplayMessage] = useState(false);
  const [insurance, setInsurance] = useState(null);
  const [subModal, setSubModal] = useState(false);
  const [initialSub, setInitialSub] = useState(null);
  const [displayAddPerson, setDisplayAddPerson] = useState(false);
  const [disabledFilters, setDisabledFilters] = useState([]);
  const [tableInfo, setTableInfo] = useState({
    pagination: {
      current: 1,
      pageSize: 20,
    },
  });

  const addParamsToUrl = (url, paginate = true, manualPage, manualSort) => {
    let paramString = "";

    //Page
    if (paginate) {
      const currPage = manualPage
        ? manualPage
        : tableInfo?.pagination?.current || 1;
      const pageSize = tableInfo?.pagination?.pageSize || 20;

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

  const getPersonList = () => {
    setLoadingList(true);

    api
      .get(
        addParamsToUrl(endpoints.supplementaryInsurance.person.get(insuranceID))
      )
      .then((res) => {
        setLoadingList(false);

        const ids = [];
        let uniques = [];
        if (res?.data?.list?.length) {
          uniques = res?.data?.list.filter((i) => {
            const isDuplicate = ids.includes(i.id);

            if (!isDuplicate) {
              ids.push(i.id);

              return true;
            }

            return false;
          });
        }

        setTableData({ ...res.data, list: uniques });

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
        setLoadingList(false);
      });
  };

  // handle page change
  useEffect(() => {
    if (!tableInfo?.silentUpdate) getPersonList();
  }, [tableInfo]);

  const rowSelection = {
    selectedRow,
    onChange: (selectedRowKeys, info) => {
      let newRow = info.filter((items) => items.is_approved === 0);
      let selectNewRows = newRow.map((items) => items.id);
      // console.info(newRow);
      setSleetedRow(selectNewRows);
      setSelectedRowInfo(newRow);
    },
    getCheckboxProps: (record) => ({
      disabled: record.is_approved === 1, // Column configuration not to be checked
      name: record.id,
    }),
  };

  const checkDeductionsButton = () => {
    if (selectedRowInfo.length !== 1) {
      return true;
    } else if (selectedRowInfo.length === 1) {
      if (selectedRowInfo[0].relation) {
        return true;
      }
      return false;
    }
  };
  //

  const onClickAddSubordiante = async (record) => {
    await getSubordinates(record.main_national_number, insurance);
    setSubModal(record);
    setInitialSub({
      start_date: covetFormatDateToFA(record.start_date),
      end_date: covetFormatDateToFA(record.end_date),
    });
  };
  //

  const addSubordinateToExistPerosn = (data) => {
    // console.log(data, "subdata!");
    // console.log(subModal, "!record");
    // console.log(sub, "!sublist");

    const personId = sub[0].personnel_id_fk;

    const payload = {
      subordinateId: data.personnel_id,
      insuranceId: insuranceID,
      startDate: convertDateToEN(data.start_date),
      endDate: convertDateToEN(data.end_date),
      description: data.description,
      personnel_id: personId,
    };

    personApi
      ._POST_SUBORDINATE(payload)
      .then((res) => {
        message.success("ثبت با موفقیت انجام شد ");

        setSubModal(null);
        setInitialSub(null);
        getPersonList();
      })
      .catch((err) => {
        message.error("خطایی بروز داده است");
        setSubModal(null);
        setInitialSub(null);
      });
  };
  //

  const onEdit = async (record) => {
    // console.log(record, "!onEdit");
    subEditForm.setFieldsValue({
      personnel_id: record.sub_id,
      relation: record.relation,
      start_date: covetFormatDateToFA(record.start_date),
      end_date: covetFormatDateToFA(record.end_date),
      description: record.description,
    });
    setEditModal(record.id);
  };
  //

  const editSubordinate = (data) => {
    const payload = {
      ...data,
      start_date: convertDateToEN(data.start_date),
      end_date: convertDateToEN(data.end_date),
    };
    // console.log(payload, editModal, "!pay");

    personApi
      ._PUT_SUBORDINATE(editModal, payload)
      .then((res) => {
        getPersonList();
        message.success("عملیات با موفقیت انجام شد");
        setEditModal(null);
      })
      .catch((err) => {
        message.error("خطایی رخ داده است ");
        setEditModal(null);
      });
  };

  const menuBtnList = [
    {
      url: getLink(
        pageNames.personnel.insurance.supplymentary.personnel.deucation.list,
        {
          insuranceId: insuranceID,
          userId:
            selectedRowInfo.length >= 1 ? selectedRowInfo[0].main_id : null,
        }
      ),
      label: "کسورات بیمه",
      id: pageNames.personnel.insurance.supplymentary.personnel.deucation.list,
      disabled: checkDeductionsButton(),
    },
    {
      url: getLink(
        pageNames.personnel.insurance.supplymentary.generalInfo,
        insuranceID
      ),
      label: "اطلاعات کلی",
      id: "generalInfo",
    },
    {
      handleClick: () => setAddGroupModal(true),
      label: "اضافه کردن گروهی",
      id: "addGroup",
    },
    {
      handleClick: () => setIntroductionLetterModal(true),
      label: "معرفی نامه",
      id: "wepojwe6484",
      disabled: selectedRow.length === 0,
    },
  ];

  const results = resultList.map((i, idx) => {
    if (i.message && i.message !== "ثبت شد") {
      return <p key={"result-" + idx}>{i.message || "-"}</p>;
    }
  });

  useEffect(() => {
    if (introductionLetterModal) {
      setDisplayMessage(false);
    }
  }, [introductionLetterModal]);

  useEffect(() => {
    Api._GET_BY_ID(insuranceID)
      .then((res) => {
        setInsurance(res.data);
        if (res?.data?.change_deadline_date) {
          getServerDateTime()
            .then((serverDate) => {
              if (
                new Date(res.data.change_deadline_date).getTime() >=
                new Date(serverDate.data.date).getTime()
              ) {
                setDisplayAddPerson(true);
              }
            })
            .catch((error) => console.log(error));
        }
      })
      .catch((err) => {
        message.error("خطا در دریافت اطلاعات بیمه");
      });
  }, []);

  const handleOnTableChange = (
    pagination,
    filters,
    sorter,
    { currentDataSource, action }
  ) => {
    clearTimeout(tableDataTimeout.current);
    setLoadingList(true);

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

        if (action !== "filter") {
          const queryParams = qs.parse(location.search);
          const newQueries = { ...queryParams };
          const isDiffPage =
            pagination.current !== tableInfo.pagination.current;
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

        //Limit num of active table filters to 1
        // needs to change due to backend update
        const filtersToDisable = [];
        const filterArray = Object.entries(filters);
        const activeFilter = filterArray.find(
          ([key, value]) => value !== null
        )?.[0];

        if (activeFilter)
          filterArray.forEach(([key, value]) => {
            if (key !== activeFilter) filtersToDisable.push(key);
          });

        //This state is passed to table columns
        setDisabledFilters(filtersToDisable);
        console.log("disabled filters:", filtersToDisable);

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

  if (loading) {
    return <LogoLoading />;
  }
  if (!tableData) {
    return "";
  }
  return (
    <>
      <Modal
        visible={addGroupModal}
        onCancel={() => setAddGroupModal(false)}
        footer={null}
        title="اضافه کردن گروهی افراد"
      >
        <PersonAddGroup
          setModal={(modal) => setResultModal(modal)}
          setList={(list) => setResultList(list)}
        />
      </Modal>

      <Modal
        visible={introductionLetterModal}
        onCancel={() => setIntroductionLetterModal(false)}
        footer={null}
        title="معرفی نامه"
      >
        <PersonIntroductionLetter
          selectedRow={selectedRow}
          list={tableData?.list}
          displayMessage={displayMessage}
          setDisplayMessage={setDisplayMessage}
          insurance={insurance}
        />
      </Modal>

      <Modal
        title="ویرایش فرد"
        visible={editModal ? true : false}
        onCancel={() => setEditModal(null)}
        footer={null}
        closable={true}
      >
        {tableData.list.find((el) => el.id == editModal)?.relation ? (
          <Form form={subEditForm} onFinish={editSubordinate}>
            <FormItems.StartDateInsurance
              useForm={subEditForm}
              span={24}
              insurance={insurance}
            />
            <FormItems.EndDateInsurance
              useForm={subEditForm}
              span={24}
              insurance={insurance}
            />
            <FormItems.Description useForm={subEditForm} span={24} />
            <FormItems.submitSubordinate onClick={() => subEditForm.submit()} />
            <Form.Item name="personnel_id" hidden={true}>
              <Input></Input>
            </Form.Item>
          </Form>
        ) : (
          <PersonEdit
            personId={editModal}
            insurance={insurance}
            updateList={getPersonList}
            personInfo={tableData.list.find((el) => el.id == editModal)}
            setModal={setEditModal}
          />
        )}
      </Modal>

      <Modal
        visible={resultModal}
        closable={false}
        title="خطاهای اظافه کردن گروهی"
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={() => window.location.reload(false)}
          >
            تایید
          </Button>,
        ]}
      >
        <div>{results}</div>
      </Modal>

      <Modal
        title="افزودن تبعی"
        visible={subModal}
        onCancel={() => {
          setSubModal(null);
          setInitialSub(null);
        }}
        footer={null}
        closable={true}
      >
        <AddSubordinateForm
          subForm={subAddForm}
          list={sub.filter(
            (person) =>
              tableData.list.findIndex((el) => el.sub_id === person.id) === -1
          )}
          initialSub={initialSub}
          insurance={insurance}
          onFinish={addSubordinateToExistPerosn}
          mainPerson={
            subModal
              ? {
                  ...subModal,
                  start_date: covetFormatDateToFA(subModal.start_date),
                  end_date: covetFormatDateToFA(subModal.end_date),
                }
              : null
          }
        />
      </Modal>
      <GoBackBtn />
      <ContentTop
        title={` لیست افراد قرارداد ${insurance?.contract_number}`}
        className="mt-3"
        breadcrumbItems={[
          {
            text: "بیمه تکمیلی ",
            link: pageNames.personnel.insurance.supplymentary.list,
          },
          { text: "لیست افراد" },
        ]}
      />

      <div className="w-100 flex-wrap align-center mb-3">
        <MenuInlineBtn list={menuBtnList} />
        <ListActions
          className="mr-md-auto mt-lg-0"
          noPrint
          noFilter
          noSort
          actions={{
            excelExport: () => {
              downloadExcel(
                endpoints.supplementaryInsurance.person.excel(insuranceID)
              );
            },
          }}
        />
      </div>

      {displayAddPerson && (
        <div style={{ marginBottom: "10px" }}>
          <MainPersonAdd
            updateList={getPersonList}
            data={tableData.list}
            insurance={insurance}
          />
        </div>
      )}

      <Table
        data={tableData.list}
        updateList={getPersonList}
        selectedRow={selectedRow}
        rowSelection={rowSelection}
        setLoadingList={setLoadingList}
        onEdit={onEdit}
        insuranceID={insuranceID}
        onClickAddSubordiante={onClickAddSubordiante}
        displayAddPerson={displayAddPerson}
        selected={selectedRow}
        setSelectedRow={setSleetedRow}
        setSelectedRowInfo={setSelectedRowInfo}
        handleTableChange={handleOnTableChange}
        pagination={tableInfo?.pagination}
        tableInfo={tableInfo}
        setTableInfo={setTableInfo}
        disabledFilters={disabledFilters}
      />
    </>
  );
};

export default withRouter(PersonList);
