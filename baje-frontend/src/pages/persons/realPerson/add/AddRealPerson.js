import React, { useEffect, useState, useContext } from "react";
import { Form, Tabs, message, Row, Spin } from "antd";
import Styles from "../common/addRealPerson.module.css";
import axios from "api/appAxios";
import { useHistory } from "react-router-dom";

import {
  getAccessRolesFromServer,
  getOfficesList,
  checkListOfPermissionHasCurrentOfficeObj,
  covertListOfPermission,
  covetFormatDateToEn,
  convertFamily,
  convertInputFile,
} from "../common/_helpers";

import { convertDateToEN, checkShamsi } from "../../../../_helpers";

//TABS
import FirstTab from "./tabs/FirstTab";
import SecondTab from "./tabs/SecondTab";
import FourthTab from "./tabs/FourthTab";
import FifthTab from "./tabs/FifthTab";
import SixthTab from "./tabs/SixthTab";
import SeventhTab from "./tabs/Seventh";
import EightTab from "./tabs/EighthTab";
import SubmitBtn from "../../../../components/general/SubmitBtn";
import { onFinish } from "./../../../machinery/machine/_helper";

import GoBackBtn from "./../../../../components/GoBackBtn";
import { useSelector } from "react-redux";

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

const AddRealPerson = () => {
  const [permissions, setPermissions] = useState(null);
  const [officeList, setOfficeList] = useState(null);
  const [toggleStatusJob, setToggleStatusJob] = useState(false);
  const [listOfPermission, setListOfPermission] = useState([]);
  const [currentTab, setCurrentTab] = useState("1");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [handyError, setHandyError] = useState();
  const [statusOfIsargar, setStatusOfIsargar] = useState(null);

  const [firstForm] = Form.useForm();
  const [secondForm] = Form.useForm();
  const [fourthForm] = Form.useForm();
  const [fifthForm] = Form.useForm();
  const [sixthForm] = Form.useForm();
  const [seventhForm] = Form.useForm();
  const [eighthFrom] = Form.useForm();

  const history = useHistory();
  const currentOffice = useSelector((state) => state.currentOffice);

  const handleSendToServer = () => {
    if (!handyError) {
      setSubmitLoading(true);
      firstForm.submit();
    } else {
      setCurrentTab(handyError);
    }
  };

  const submitToServer = () => {
    let { son, daughter, wife } = seventhForm.getFieldsValue();
    if (
      (son && son.length > 0) ||
      (daughter && daughter.length > 0) ||
      (wife && wife.length > 0)
    ) {
      firstForm.setFieldsValue({ marital_status: "married" });
    }

    let allFormData = {
      ...firstForm.getFieldsValue(),
      ...fourthForm.getFieldsValue(),
      ...fifthForm.getFieldsValue(),
      ...sixthForm.getFieldsValue(),
      ...convertInputFile(eighthFrom.getFieldsValue()),
    };

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

    formData.append("company_id", currentOffice);

    console.log("formData", formData);

    axios({
      method: "post",
      url: "/api/admin/personnel/person",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        message.success("با موفقیت انجام شد");
        setSubmitLoading(false);
        setTimeout(() => {
          history.go();
        }, 1000);
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

  //1
  // const onBlurNameFF = (e) => {
  //   console.log("in non bluer ff", e.target.value);
  //   console.log(seventhForm.getFieldsValue());
  // };
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
    firstForm.setFieldsValue({
      username: nationalID,
      password: nationalID,
      repeat_password: nationalID,
    });
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

  const onFailedSecondForm = () => {};

  const onChangeFourthForm = (changedValues) => {
    if (changedValues.hasOwnProperty("job_status")) {
      if (changedValues.job_status == "active") setToggleStatusJob(false);
      else setToggleStatusJob(true);
    }
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
          console.log("resfe", res);
          secondForm.setFieldsValue(res);
        })
        .catch((err) => {
          console.log("111", err);
        });
    }
  };

  const addListPermission = () => {
    let values = secondForm.getFieldsValue();
    console.log("oeigfjhek", values);

    let list = [...listOfPermission];
    let index = listOfPermission.findIndex(
      (v) => v.selectContract === values.selectContract
    );

    if (index == -1) {
      list.push(values);
    } else {
      list[index] = values;
    }
    message.success("با موفقیت انجام شد");
    setListOfPermission(list);
  };

  //3
  const onFinishThirdForm = () => {
    setCurrentTab("4");
    seventhForm.submit();
  };

  //4
  const onFinishFourthForm = () => {
    setCurrentTab("5");
    sixthForm.submit();
  };

  // 5
  const onFinishFifthForm = () => {
    setCurrentTab("6");
    eighthFrom.submit();
  };

  // 6
  const onFinishSixthForm = () => {
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
        console.log("resefew", res);
        setPermissions(res);
      })
      .catch((err) => console.log(err));

    // get office list for select and choose permission
    getOfficesList()
      .then((res) => {
        setOfficeList(res.list);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <GoBackBtn />
      <h2>فرد حقیقی جدید</h2>
      <Spin spinning={submitLoading}>
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
              onValuesChange={onChangeFirstForm}
              form={firstForm}
              initialValues={{
                isargar: "none",
                nation: "iranian",
                sex: "male",
                marital_status: "single",
                army_service: "army_done",
              }}
            >
              <FirstTab
                onChangeNationalIdAndBirthDay={onChangeNationalIdAndBirthDay}
                // onBlurFirstName={onBlurNameFF}
                officeList={officeList}
                form={firstForm}
                statusOfIsargar={statusOfIsargar}
              />
              {/* <NextAndPrev nextTab={() => nextTab(firstForm)} /> */}
            </Form>
          </TabPane>

          <TabPane tab="اطلاعات شغلی" key="2" className={Styles.tab}>
            <Form
              form={fourthForm}
              onFinish={onFinishSecondForm}
              onFinishFailed={onFailedForm}
              {...formItemLayout}
              name="fourthTab"
              onValuesChange={onChangeFourthForm}
            >
              <FourthTab
                toggleStatusJob={toggleStatusJob}
                form={fourthForm}
                setHandyError={setHandyError}
              />
              {/* <NextAndPrev
              nextTab={() => nextTab(fourthForm)}
              prevTab={prevTab}
            /> */}
            </Form>
          </TabPane>

          <TabPane tab="اطلاعات تماس" key="3" className={Styles.tab}>
            <Form
              onFinish={onFinishThirdForm}
              {...formItemLayout}
              name="fifthTab"
              onFinishFailed={onFailedForm}
              form={fifthForm}
            >
              <FifthTab form={fifthForm} />
              {/* <NextAndPrev nextTab={() => nextTab(fifthForm)} prevTab={prevTab} /> */}
            </Form>
          </TabPane>

          <TabPane tab="افراد تبعی" key="4" className={Styles.tab}>
            <Form
              onFinish={onFinishFourthForm}
              {...formItemLayout}
              name="seventhTab"
              onFinishFailed={onFailedForm}
              form={seventhForm}
              onValuesChange={onChangeSeventhForm}
            >
              <SeventhTab form={seventhForm} firstForm={firstForm} />
            </Form>
          </TabPane>

          <TabPane tab="حساب بانکی" key="5" className={Styles.tab}>
            <Form
              onFinish={onFinishFifthForm}
              {...formItemLayout}
              name="sixthTab"
              onFinishFailed={onFailedForm}
              form={sixthForm}
            >
              <SixthTab />
              {/* <NextAndPrev nextTab={() => nextTab(sixthForm)} prevTab={prevTab} /> */}
            </Form>
          </TabPane>

          <TabPane tab="اپلود اسناد" key="6" className={Styles.tab}>
            <Form
              {...formItemLayout}
              name="eightTab"
              onFinishFailed={onFailedForm}
              form={eighthFrom}
              onFinish={onFinishSixthForm}
            >
              <EightTab submitLoading={submitLoading} />
            </Form>
          </TabPane>

          <TabPane tab="سطوح دسترسی" key="7" className={Styles.tab}>
            <Form {...secondFormItemLayout} name="secondTab" form={secondForm}>
              <SecondTab
                permissions={permissions}
                officeList={officeList}
                resetAndSetOffice={restCheckBoxAndSetOffice}
                addListPermission={addListPermission}
                form={secondForm}
              />
              {/* <NextAndPrev
              nextTab={() => nextTab(secondForm)}
              prevTab={prevTab}
            /> */}
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
      </Spin>
    </>
  );
};

export default AddRealPerson;
