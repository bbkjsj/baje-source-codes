import React, { useEffect, useState, useContext } from "react";
import { Form, Tabs, message, Button, Row } from "antd";
import Styles from "../common/addRealPerson.module.css";
import { useHistory, withRouter } from "react-router-dom";
import axios from "api/appAxios";
import LogoLoading from "components/general/LoadingLogo";
import SubmitBtn from "components/general/SubmitBtn";
import useCheckAccess from "hooks/useCheckAccess";
import { LayoutContext } from "contex/Layout-context";

//TABS
import FirstTab from "../edit/tabs/FirstTab";
import SecondTab from "../edit/tabs/SecondTab";
import ThirdTab from "../edit/tabs/ThirdTab";
import FourthTab from "../edit/tabs/FourthTab";
import FifthTab from "../edit/tabs/FifthTab";
import SixthTab from "../edit/tabs/SixthTab";
import SeventhTab from "./tabs/SeventhTab";
import EightTab from "../edit/tabs/EighthTab";
import {
  getAccessRolesFromServer,
  getOfficesList,
  getPersonData,
  covetFormatDateToFA,
  checkListOfPermissionHasCurrentOfficeObj,
  convertInputFile,
  convertDateToEN,
  convertFamily,
  covertListOfPermission,
} from "../common/_helpers";

import { checkShamsi } from "_helpers";
import GoBackBtn from "components/GoBackBtn";
import { CheckAccessWarning } from "AuxComponent/CheckAccess";
import { permission } from "json/Permission";
import { pageNames } from "constant";
import { useSelector } from "react-redux";

const { VIEWSUBORDINATE_PERSON } = permission;

const { TabPane } = Tabs;
const formItemLayout = {
  labelCol: { span: 24 },
  colon: false,
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    lg: { span: 22 },
  },
};
const secondFormItemLayout = {
  labelCol: {
    xs: { span: 0 },
    sm: { span: 0 },
    md: { span: 0 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
  },
};

const AddRealPerson = (props) => {
  const userId = props.match.params.id;
  const [permissions, setPermissions] = useState(null);
  const [listOfPermission, setListOfPermission] = useState([]);
  const [officeList, setOfficeList] = useState(null);
  const [userMainInfo, setUserMainInfo] = useState();
  const [currentTab, setCurrentTab] = useState("1");
  const [toggleStatusJob, setToggleStatusJob] = useState(false);
  const [userJob, setUserJob] = useState();
  const [initialSubordinates, setInitialSubordinates] = useState({});
  const [submitLoading, setSubmitLoading] = useState();
  const [statusOfIsargar, setStatusOfIsargar] = useState(null);
  const [handyError, setHandyError] = useState();
  const layoutContext = useContext(LayoutContext);
  // forms
  const [firstForm] = Form.useForm();
  const [secondForm] = Form.useForm();
  const [thirdForm] = Form.useForm();
  const [fourthForm] = Form.useForm();
  const [fifthForm] = Form.useForm();
  const [seventhForm] = Form.useForm();
  const [eighthFrom] = Form.useForm();

  const history = useHistory();
  const [sixthForm] = Form.useForm();
  const checkAccess = useCheckAccess();
  const currentOffice = useSelector((state) => state.currentOffice);

  const handleSendToServer = () => {
    if (!handyError) {
      setSubmitLoading(true);
      firstForm.submit();
    } else {
      setCurrentTab(handyError);
    }
  };

  const submitToServer = (values) => {
    setSubmitLoading(true);
    let { son, daughter, wife } = seventhForm.getFieldsValue();
    if (
      (son && son.length > 0) ||
      (daughter && daughter.length > 0) ||
      (wife && wife.length > 0)
    ) {
      thirdForm.setFieldsValue({ marital_status: "married" });
    }

    let allFormData = {
      ...firstForm.getFieldsValue(),
      ...thirdForm.getFieldsValue(),
      ...fourthForm.getFieldsValue(),
      ...fifthForm.getFieldsValue(),
      ...sixthForm.getFieldsValue(),
      ...convertInputFile(eighthFrom.getFieldsValue()),
    };

    if (allFormData.birth_certificate) {
      allFormData.birth_certificate_old = userMainInfo.birth_certificate_url;
    }
    if (allFormData.national_card_front) {
      allFormData.national_card_front_old =
        userMainInfo.national_card_front_url;
    }
    if (allFormData.national_card_rear) {
      allFormData.national_card_rear_old = userMainInfo.national_card_rear_url;
    }
    if (allFormData.army_service_card_url) {
      allFormData.army_service_card_old =
        userMainInfo.army_service_card_url_url;
    }
    if (allFormData.person) {
      allFormData.person_old = userMainInfo.image_url;
    }
    if (allFormData.sign) {
      allFormData.sign_old = userMainInfo.sign_url;
    }

    allFormData.subordinates = convertFamily(seventhForm.getFieldsValue());

    if (listOfPermission.length > 0) {
      let convertedList = covertListOfPermission(listOfPermission);
      allFormData.permissions = [...convertedList];
    }

    const formData = new FormData();
    for (const property in allFormData) {
      if (allFormData[property]) {
        if (property === "birth_date") {
          formData.append(property, convertDateToEN(allFormData[property]));
        } else if (property === "expire_time") {
          formData.append(property, convertDateToEN(allFormData[property]));
        } else if (property === "subordinates") {
          formData.append(property, JSON.stringify(allFormData[property]));
        } else if (property === "permissions") {
          formData.append(property, JSON.stringify(allFormData[property]));
        } else {
          formData.append(property, allFormData[property]);
        }
      }
    }

    formData.append("id", userId);
    if (userMainInfo.mobile1) {
      formData.append("mobile1_old", userMainInfo.mobile1);
    }
    if (userMainInfo.mobile2) {
      formData.append("mobile2_old", userMainInfo.mobile2);
    }
    formData.append("company_id", currentOffice);

    // console.info(formData);

    axios({
      method: "post",
      url: "/api/admin/personnel/edit",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        message.success("با موفقیت انجام شد");
        setSubmitLoading(false);
        // set lastUpdated
        layoutContext.setLastItemUpdated(userId);
        history.push(pageNames.personnel.realPerson.list);
      })
      .catch((error) => {
        if (error.response) {
          setSubmitLoading(false);
          message.error(error?.response?.data);
          if (error.response.status == 405) {
            setCurrentTab("3");
          }
        }
      });
  };

  const onFinishFirstForm = (values) => {
    setCurrentTab("2");
    fourthForm.submit();
  };

  const onFinishFailedFirstForm = () => {
    setCurrentTab("1");
    setSubmitLoading(false);
  };

  const onFailedForm = () => {
    setSubmitLoading(false);
  };

  const onChangeNationalIdAndBirthDay = () => {
    let date_birthday = firstForm.getFieldValue("birth_date");
    let nationalID = firstForm.getFieldValue("national_number");

    if (
      date_birthday &&
      checkShamsi(date_birthday) &&
      date_birthday.split("/")[0] > 1368
    ) {
      firstForm.setFieldsValue({
        id_number: nationalID,
      });
    } else {
      firstForm.setFieldsValue({
        id_number: ``,
      });
    }
  };

  // 2
  const onFinishSecondForm = (values) => {
    setCurrentTab("3");
    fifthForm.submit();
  };

  const restCheckBoxAndSetOffice = (contractId, officeId) => {
    secondForm.resetFields();
    secondForm.setFieldsValue({
      selectOffice: officeId,
      selectContract: contractId,
    });
    if (listOfPermission.length > 0) {
      checkListOfPermissionHasCurrentOfficeObj(listOfPermission, contractId)
        .then((res) => {
          secondForm.setFieldsValue(res);
        })
        .catch((err) => {
          console.log("111", err);
        });
    }
  };

  const addListPermission = () => {
    let values = secondForm.getFieldsValue();
    console.log("تایید", values);

    let list = [...listOfPermission];
    let index = listOfPermission.findIndex(
      (v) => v.selectContract === values.selectContract
    );

    if (index == -1) {
      list.push(values);
    } else {
      list[index] = values;
    }
    console.log("weofjioef", list);

    message.success("با موفقیت انجام شد");
    setListOfPermission(list);
  };

  const onChangeFourthForm = (changedValues) => {
    if (changedValues.hasOwnProperty("job_status")) {
      if (changedValues.job_status == "active") setToggleStatusJob(false);
      else setToggleStatusJob(true);
    }
  };

  //3
  const onFinisThirdForm = () => {
    if (checkAccess("person/viewsubordinate")) {
      setCurrentTab("4");
      seventhForm.submit();
    } else {
      setCurrentTab("5");
      sixthForm.submit();
    }
  };

  //4
  const onFinishFourthForm = () => {
    setCurrentTab("5");
    sixthForm.submit();
  };

  // 5
  const onFinisFifthForm = () => {
    setCurrentTab("6");
    eighthFrom.submit();
  };

  // 6
  const onFinishSixForm = () => {
    // finlay send to server
    submitToServer();
    setCurrentTab("1");
  };
  // on change national ID and set national_number
  const onChangeSeventhForm = (changedValues) => {
    let nameOfCategory;
    for (let property in changedValues) {
      nameOfCategory = property;
    }
    let index = changedValues[nameOfCategory].length - 1;

    if (
      changedValues[nameOfCategory][index] &&
      (changedValues[nameOfCategory][index].hasOwnProperty("national_id") ||
        changedValues[nameOfCategory][index].hasOwnProperty("birth_day"))
    ) {
      let data = seventhForm.getFieldValue(nameOfCategory);

      if (
        data[index] &&
        data[index].hasOwnProperty("birth_day") &&
        checkShamsi(data[index]["birth_day"])
      ) {
        if (data[index]["birth_day"].split("/")[0] > 1368) {
          let national_id = data[index]["national_id"];
          // national_number
          data[index]["national_number"] = national_id;
        } else {
          data[index]["national_number"] = ``;
        }

        seventhForm.setFieldsValue({
          nameOfCategory: data,
        });
      }
    }
  };

  const onChangeFirstForm = (changedValues) => {
    if (changedValues.hasOwnProperty("isargar")) {
      setStatusOfIsargar(changedValues.isargar);
    }
  };

  useEffect(() => {
    //get access roles from server that person select them
    getAccessRolesFromServer()
      .then((res) => {
        setPermissions(res);
      })
      .catch((err) => console.log(err));
    //get user data by id
    getPersonData(userId).then((res) => {
      setUserMainInfo(res.person);
      setStatusOfIsargar(res.person.isargar);
      setUserJob(res.job);
      setInitialSubordinates(res.subordinates);
      setListOfPermission(res.permissions);
      if (res.person.job_status === "inactive") {
        setToggleStatusJob(true);
      }
    });

    // get office list for select and choose permission
    getOfficesList()
      .then((res) => {
        setOfficeList(res.list);
      })
      .catch((err) => console.log(err));
  }, []);

  if (!userMainInfo) {
    return <LogoLoading />;
  }

  return (
    <>
      <h2>ویرایش فرد حقیقی</h2>
      <GoBackBtn />
      <Tabs
        type="card"
        activeKey={currentTab}
        onTabClick={(key) => setCurrentTab(key)}
      >
        <TabPane tab="اطلاعات اصلی" key="1" className={Styles.tab}>
          <Form
            onFinish={onFinishFirstForm}
            onFinishFailed={onFinishFailedFirstForm}
            {...formItemLayout}
            name="firstTab"
            form={firstForm}
            initialValues={{ contract_id: 479, ...userMainInfo }}
            onValuesChange={onChangeFirstForm}
          >
            <FirstTab
              onChangeNationalIdAndBirthDay={onChangeNationalIdAndBirthDay}
              officeList={officeList}
              form={firstForm}
              //   nextTab={nextTab}
              statusOfIsargar={statusOfIsargar}
            />
          </Form>
        </TabPane>
        {/* FOURTH TAB*/}
        <TabPane tab="اطلاعات شغلی" key="2" className={Styles.tab}>
          <Form
            form={fourthForm}
            onFinishFailed={onFailedForm}
            onFinish={onFinishSecondForm}
            {...formItemLayout}
            name="fourthTab"
            initialValues={userMainInfo}
            onValuesChange={onChangeFourthForm}
          >
            <FourthTab
              toggleStatusJob={toggleStatusJob}
              form={fourthForm}
              job={userJob}
              insurance_number={userMainInfo.insurance_number}
              setHandyError={setHandyError}
            />
          </Form>
        </TabPane>
        {/* FIFTH TAB*/}
        <TabPane tab="اطلاعات تماس" key="3" className={Styles.tab}>
          <Form
            onFinish={onFinisThirdForm}
            onFinishFailed={onFailedForm}
            {...formItemLayout}
            name="fifthTab"
            initialValues={userMainInfo}
            form={fifthForm}
          >
            <FifthTab
              form={fifthForm}
              mobile1={userMainInfo.mobile1}
              mobile2={userMainInfo.mobile2}
            />
          </Form>
        </TabPane>

        {/* SEVENTH TAB*/}

        <TabPane tab="افراد تبعی" key="4" className={Styles.tab}>
          <CheckAccessWarning permission={VIEWSUBORDINATE_PERSON}>
            <Form
              initialValues={initialSubordinates}
              onFinish={onFinishFourthForm}
              {...formItemLayout}
              onFinishFailed={onFailedForm}
              name="seventhTab"
              form={seventhForm}
              onValuesChange={onChangeSeventhForm}
            >
              <SeventhTab form={seventhForm} firstForm={firstForm} />
            </Form>
          </CheckAccessWarning>
        </TabPane>

        {/* SIXTH TAB*/}
        <TabPane tab="حساب بانکی" key="5" className={Styles.tab}>
          <Form
            onFinish={onFinisFifthForm}
            {...formItemLayout}
            name="sixthTab"
            initialValues={userMainInfo}
            onFinishFailed={onFailedForm}
            form={sixthForm}
          >
            <SixthTab />
          </Form>
        </TabPane>

        {/* EIGHT TAB*/}
        <TabPane tab="اپلود اسناد" key="6" className={Styles.tab}>
          <Form
            {...formItemLayout}
            name="eightTab"
            initialValues={{
              birth_certificate: userMainInfo.birth_certificate_url && [
                {
                  uid: "birth_certificate",
                  name: "اسکن شناسنامه",
                  status: "done",
                  url: userMainInfo.birth_certificate_url,
                },
              ],
              national_card_front: userMainInfo.national_card_front_url && [
                {
                  uid: "national_card_front",
                  name: "اسکن روی کارت ملی",
                  status: "done",
                  url: userMainInfo.national_card_front_url,
                },
              ],
              national_card_rear: userMainInfo.national_card_rear_url && [
                {
                  uid: "national_card_rear",
                  name: "اسکن پشت کارت ملی",
                  status: "done",
                  url: userMainInfo.national_card_rear_url,
                },
              ],
              army_service_card: userMainInfo.army_service_card_url && [
                {
                  uid: "army_service_card",
                  name: "اسکن کارت پایان خدمت",
                  status: "done",
                  url: userMainInfo.army_service_card_url,
                },
              ],
              person: userMainInfo.image_url && [
                {
                  uid: "person",
                  name: "عکس پرسنلی",
                  status: "done",
                  url: userMainInfo.image_url,
                },
              ],
              sign: userMainInfo.sign_url && [
                {
                  uid: "sign",
                  name: "امضا",
                  status: "done",
                  url: userMainInfo.sign_url,
                },
              ],
            }}
            form={eighthFrom}
            onFinish={onFinishSixForm}
            onFinishFailed={onFailedForm}
          >
            <EightTab submitLoading={submitLoading} userInfo={userMainInfo} />
          </Form>
        </TabPane>

        {/* SECOND TAB*/}
        <TabPane tab="سطوح دسترسی" key="7" className={Styles.tab}>
          <Form {...secondFormItemLayout} name="secondTab" form={secondForm}>
            <SecondTab
              permissions={permissions}
              officeList={officeList}
              resetAndSetOffice={restCheckBoxAndSetOffice}
              addListPermission={addListPermission}
              form={secondForm}
            />
          </Form>
        </TabPane>
      </Tabs>
      <Row
        style={{
          marginRight: "3px",
          width: "100%",
          backgroundColor: "#fff",
          padding: "15px",
        }}
      >
        <SubmitBtn
          customFunction={handleSendToServer}
          loading={submitLoading}
        />
      </Row>
    </>
  );
};

export default withRouter(AddRealPerson);
