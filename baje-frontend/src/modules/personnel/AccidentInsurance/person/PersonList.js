import React, { useEffect, useContext, useState } from "react";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import GoBackBtn from "components/GoBackBtn";
import { withRouter, useHistory, Redirect } from "react-router-dom";
import { getLink } from "_helpers";
import { AccidentInsuranceContext } from "modules/personnel/AccidentInsurance/util/AccidentInsuranceContext";
import Table from "./personList/Table";
import PersonAdd from "./PersonAdd";
import PersonEdit from "./PersonEdit";
import { useGetPerson } from "./util/hooks";
import PersonAddGroup from "./PersonAddGroup";
import PersonIntroductionLetter from "./PersonIntroductionLetter";
import { Modal, Button } from "antd";
import ContentTop from "components/general/ContentTop";
import { pageNames } from "constant";

const PersonList = ({ match }) => {
  const history = useHistory();
  const insuranceID = match.params.id;
  const insuranceDetail = useContext(AccidentInsuranceContext);
  const { insurance } = insuranceDetail;
  const {
    loading,
    setLoading: setLoadingList,
    data,
    getList: getPersonList,
  } = useGetPerson(insuranceID);

  insuranceDetail.setInsuranceId(insuranceID);

  const [addGroupModal, setAddGroupModal] = useState(false);
  const [introductionLetterModal, setIntroductionLetterModal] = useState(false);
  const [selectedRow, setSleetedRow] = useState([]);
  const [selectedRowInfo, setSelectedRowInfo] = useState([]);
  const [editModal, setEditModal] = useState(); // save user id for edit
  const [resultModal, setResultModal] = useState(false);
  const [resultList, setResultList] = useState([]);

  const rowSelection = {
    selectedRow,
    onChange: (selectedRowKeys, info) => {
      let newRow = info.filter((items) => items.is_approved === 0);
      let selectNewRows = newRow.map((items) => items.id);
      console.info(newRow);
      setSleetedRow(selectNewRows);
      setSelectedRowInfo(newRow);
    },
    getCheckboxProps: (record) => ({
      disabled: record.is_approved === 1, // Column configuration not to be checked
      name: record.id,
    }),
  };

  // load insurance context if not exist
  useEffect(() => {
    // console.info(JSON.parse(localStorage.getItem("record")));
    if (!insurance) {
      console.info(insurance);
      insuranceDetail.setInsurance(JSON.parse(localStorage.getItem("record")));
    }
  });

  // if (!insurance) {
  //   return <Redirect to={pageNames.personnel.insurance.supplymentary.list} />;
  // }

  // console.log("iergerd", selectedRowInfo);
  // console.info(insuranceDetail.insuranceList);
  // console.info(data);

  if (loading) {
    return <LogoLoading />;
  }

  const checkDeductionsButton = () => {
    if (selectedRowInfo.length !== 1) {
      return true;
    } else if (selectedRowInfo.length === 1) {
      console.log("ewoipfj", selectedRowInfo[0]);
      if (selectedRowInfo[0].relation) {
        return true;
      }
      return false;
    }
  };

  const menuBtnList = [
    {
      url: getLink(
        pageNames.personnel.insurance.accident.personnel.deducation.list,
        {
          insuranceId: insuranceID,
          userId:
            selectedRowInfo.length >= 1 ? selectedRowInfo[0].main_id : null,
        }
      ),
      label: "کسورات بیمه",
      id: pageNames.personnel.insurance.accident.personnel.deducation.list,
      disabled: checkDeductionsButton(),
    },
    {
      url: getLink(
        pageNames.personnel.insurance.accident.generalInfo,
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
          list={data.list}
          insurer={insurance.insurer_main}
        />
      </Modal>

      <Modal
        visible={editModal ? true : false}
        onCancel={() => setEditModal(null)}
        footer={null}
        title="ویرایش فرد"
      >
        <PersonEdit
          personId={editModal}
          updateList={getPersonList}
          personInfo={data.list.filter((el) => {
            return el.id == editModal;
          })}
        />
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

      <GoBackBtn />

      <ContentTop
        title={` لیست افراد قرارداد ${insurance.contract_number}`}
        className="mt-3"
        breadcrumbItems={[
          {
            text: "بیمه تکمیلی و حوادث",
            link: pageNames.personnel.insurance.accident.list,
          },
          { text: "لیست افراد" },
        ]}
      />

      <MenuInlineBtn list={menuBtnList} />
      <div style={{ marginBottom: "10px" }}>
        <PersonAdd updateList={getPersonList} data={data.list} />
      </div>

      <Table
        data={data.list}
        updateList={getPersonList}
        selectedRow={selectedRow}
        rowSelection={rowSelection}
        setLoadingList={setLoadingList}
        setEditModal={setEditModal}
        insuranceID={insuranceID}
        selected={selectedRow}
        setSelectedRow={setSleetedRow}
        setSelectedRowInfo={setSelectedRowInfo}
      />
    </>
  );
};

export default withRouter(PersonList);
