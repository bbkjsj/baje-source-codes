import React, { useContext, useState, useEffect } from "react";
import { Form, Tabs, Spin, message, Modal } from "antd";
import MainInfoTab from "./components/MainInfoTab";
import JobInfoTab from "./components/JobInfoTab";
import ContactInfoTab from "./components/ContactInfoTab";
import SubordinatePersonTab from "./components/SubordinatePersonTab";
import BankAccountTab from "./components/BankAccountTab";
import UploadDocTab from "./components/UploadDocTab";
import AccessLevelTab from "./components/AccessLevelTab";
import GoBackBtn from "components/GoBackBtn";
import { handleOnFailedForm, handleEditRealPerson } from "./utils/formUtils";
import personnelEvents from "modules/personnel/events";
import {
  handelGetSingleRealPerson,
  addTabName,
  convertRealPersonDateFa,
  convertRealPersonSubordinate,
  changePropertyName,
  setFileInputValue,
  convertAccess,
  makeDataRealPersonServer,
} from "./utils";
import { useHistory, useLocation, withRouter } from "react-router-dom";
import LogoLoading from "components/general/LoadingLogo";
import ContentTop from "components/general/ContentTop";
import { formItemLayout, pageNames } from "constant";
import { useSelector } from "react-redux";

const { TabPane } = Tabs;

function RealPersonEdit(props) {
  const [realPersonEditForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [permissionsSelected, setPermissionsSelected] = useState([]);
  const [realPerson, setRealPerson] = useState();

  const currentOffice = useSelector((state) => state.currentOffice);
  const history = useHistory();
  const realPersonID = props.match.params.id;

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tabTarget = query.get("target");

  // more data send form server
  const [personJob, setPersonJob] = useState();

  const handleError = (msg, type) => {
    if (type === "submit") {
      setSubmitLoading(false);
    } else if (type === "get") {
      setInitialLoading(false);
    }
    message.error(msg);
  };

  useEffect(() => {
    handelGetSingleRealPerson(realPersonID, setRealPersonInfo, handleError);
  }, []);

  useEffect(() => {
    if (tabTarget && !activeTab && realPerson)
      setTimeout(() => setActiveTab(tabTarget), 1000);
  }, [realPerson]);

  const setRealPersonInfo = (data) => {
    // console.log("egiowejg", data);

    let person = data.person;

    let subordinates = data.subordinates;
    let access = data.access;
    let job = data.job;
    // convert date
    person = convertRealPersonDateFa(person);
    // convert sex
    person.sex = person.sex === "m" ? "male" : "female";
    //expire_reason convert
    person.expire_reason = person.job_disable_description
      ? person.job_disable_description
      : null;

    //- change some input name
    person = changePropertyName(person, {
      oldName: "army_service_card_url",
      newName: "army_service_card",
    });
    person = changePropertyName(person, {
      oldName: "birth_certificate_url",
      newName: "birth_certificate",
    });
    person = changePropertyName(person, {
      oldName: "national_card_front_url",
      newName: "national_card_front",
    });
    person = changePropertyName(person, {
      oldName: "national_card_rear_url",
      newName: "national_card_rear",
    });
    person = changePropertyName(person, {
      oldName: "sign_url",
      newName: "sign",
    });
    person = changePropertyName(person, {
      oldName: "image_url",
      newName: "person_img",
    });
    // handle null fields
    if (!person.army_service || person.army_service === "unknown") {
      person.army_service = "نامشخص";
    }

    person.password = person.national_number;

    //- handle file input value
    person.person_img = setFileInputValue("person_img", person.person_img);
    person.sign = setFileInputValue("sign", person.sign);
    person.national_card_rear = setFileInputValue(
      "national_card_rear",
      person.national_card_rear
    );
    person.national_card_front = setFileInputValue(
      "national_card_front",
      person.national_card_front
    );
    person.birth_certificate = setFileInputValue(
      "birth_certificate",
      person.birth_certificate
    );
    person.army_service_card = setFileInputValue(
      "army_service_card",
      person.army_service_card
    );

    //convert family
    if (
      subordinates &&
      subordinates !== "no access" &&
      subordinates.length > 0
    ) {
      subordinates = convertRealPersonSubordinate(subordinates);
    } else {
      subordinates = [];
    }
    //convert access
    access = convertAccess(access);

    // add tab Name
    person = addTabName(person);

    if (job) {
      setPersonJob(job);
      // realPersonEditForm.setFieldsValue({
      //   "job_title_id/jobInfoTab": person.job_title,
      //   "job_title_name/jobInfoTab": job.title,
      // });
    }
    setPermissionsSelected(access);
    setRealPerson(person);

    const formData = { ...subordinates, ...person };

    realPersonEditForm.setFieldsValue(formData);
  };

  const handleOnSubmit = () => {
    setSubmitLoading(true);
    realPersonEditForm.submit();
  };

  const handleSuccess = (msg) => {
    setSubmitLoading(false);
    message.success(msg);
    history.push(pageNames.personnel.realPerson.list);
  };

  const handleOnFinish = (values) => {
    if (values["contract_id/mainInfoTab"] < 1) {
      Modal.error({
        title: "انتخاب شرکت و قرارداد",
        content:
          "لطفا پیش از ادامه، شرکت و قرارداد (کارگاه) را از بالای صفحه انتخاب نمایید.",
      });

      setSubmitLoading(false);
      return;
    }

    const data = makeDataRealPersonServer(
      values,
      currentOffice,
      permissionsSelected,
      "edit",
      realPersonID,
      personJob ? personJob.code : null
    );

    handleEditRealPerson(data, handleSuccess, handleError);
  };

  if (!realPerson) {
    return <LogoLoading />;
  }

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="ویرایش"
        breadcrumbItems={[
          { text: "حقیقی", link: pageNames.personnel.realPerson.list },
          { text: "ویرایش" },
        ]}
      />

      <Form
        {...formItemLayout}
        form={realPersonEditForm}
        name="realPersonEdit"
        onFinish={handleOnFinish}
        onFinishFailed={(data) =>
          handleOnFailedForm(data, setActiveTab, activeTab, setSubmitLoading)
        }
        onFieldsChange={(changed, all) => {
          window.Baje.events.dispatch(personnelEvents.REAL_PERSON_FORM_CHANGE, {
            changed,
            all,
          });
        }}
      >
        <Spin spinning={submitLoading}>
          <div className="card-container">
            <Tabs
              type="card"
              activeKey={activeTab}
              onTabClick={(key) => setActiveTab(key)}
            >
              <TabPane tab="اطلاعات اصلی" key="mainInfoTab">
                <MainInfoTab
                  useForm={realPersonEditForm}
                  loading={submitLoading}
                  onSubmit={handleOnSubmit}
                  edit
                  isargar={realPerson["isargar/mainInfoTab"]}
                />
              </TabPane>
              <TabPane tab="اطلاعات شغلی" key="jobInfoTab" forceRender={true}>
                <JobInfoTab
                  useForm={realPersonEditForm}
                  loading={submitLoading}
                  onSubmit={handleOnSubmit}
                  jobTitle={personJob}
                  defaultData={{
                    employeement_type:
                      realPerson["employeement_type/jobInfoTab"],
                    job_status: realPerson["job_status/jobInfoTab"],
                  }}
                />
              </TabPane>
              <TabPane
                tab="اطلاعات تماس"
                key="contactInfoTab"
                forceRender={true}
              >
                <ContactInfoTab
                  useForm={realPersonEditForm}
                  loading={submitLoading}
                  onSubmit={handleOnSubmit}
                />
              </TabPane>
              <TabPane
                tab="افراد تبعی"
                key="subordinatePersonInfoTab"
                forceRender={true}
              >
                <SubordinatePersonTab
                  useForm={realPersonEditForm}
                  loading={submitLoading}
                  onSubmit={handleOnSubmit}
                />
              </TabPane>
              <TabPane tab="حساب بانکی" key="bankAccountTab" forceRender={true}>
                <BankAccountTab
                  useForm={realPersonEditForm}
                  loading={submitLoading}
                  onSubmit={handleOnSubmit}
                />
              </TabPane>
              <TabPane tab="آپلود اسناد" key="uploadDocTab" forceRender={true}>
                <UploadDocTab
                  useForm={realPersonEditForm}
                  loading={submitLoading}
                  onSubmit={handleOnSubmit}
                />
              </TabPane>
              <TabPane
                tab="سطوح دسترسی"
                key="accessLevelTab"
                forceRender={true}
              >
                <AccessLevelTab
                  useForm={realPersonEditForm}
                  loading={submitLoading}
                  onSubmit={handleOnSubmit}
                  permissionsSelected={permissionsSelected}
                  setPermissionsSelected={setPermissionsSelected}
                />
              </TabPane>
            </Tabs>
          </div>
        </Spin>
      </Form>
    </>
  );
}

export default withRouter(RealPersonEdit);
