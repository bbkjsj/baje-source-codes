import React, { useContext, useState } from "react";
import { Form, Tabs, Spin, message, Modal } from "antd";
import MainInfoTab from "./components/MainInfoTab";
import JobInfoTab from "./components/JobInfoTab";
import ContactInfoTab from "./components/ContactInfoTab";
import SubordinatePersonTab from "./components/SubordinatePersonTab";
import BankAccountTab from "./components/BankAccountTab";
import UploadDocTab from "./components/UploadDocTab";
import AccessLevelTab from "./components/AccessLevelTab";
import GoBackBtn from "components/GoBackBtn";
import { handleOnFailedForm, handleNewRealPerson } from "./utils/formUtils";
import { makeDataRealPersonServer } from "./utils";
import { useHistory } from "react-router-dom";
import ContentTop from "components/general/ContentTop";
import { formItemLayout, pageNames } from "constant";
import { useSelector } from "react-redux";

const { TabPane } = Tabs;

const formInitialValues = {
  "isargar/mainInfoTab": "none",
  "nation/mainInfoTab": "iranian",
  "sex/mainInfoTab": "male",
  "marital_status/mainInfoTab": "single",
  "army_service/mainInfoTab": "نامشخص",
  "job_type/jobInfoTab": "nonoperational",
  "job_status/jobInfoTab": "active",
  "insurance_share_harmful/jobInfoTab": 0,
  "insurance_share_unemployment/jobInfoTab": 1,
  "insurance_share_employer/jobInfoTab": 1,
  "insurance_share_employee/jobInfoTab": 1,
  "username/mainInfoTab": "",
  "password/mainInfoTab": "",
  "study_field/mainInfoTab": "",
};

function RealPersonAdd() {
  const [realPersonForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState();
  const [loading, setLoading] = useState(false);
  const [permissionsSelected, setPermissionsSelected] = useState([]);
  const currentOffice = useSelector((state) => state.currentOffice);

  const history = useHistory();

  const MainFormContext = React.createContext({
    fatherName: "ali",
  });

  const handleOnSubmit = async () => {
    const nationCodeErrors = realPersonForm.getFieldError(
      "national_number/mainInfoTab"
    );
    if (nationCodeErrors.length > 0)
      return message.error("شماره ملی مورد قبول نیست");
    try {
      await realPersonForm.validateFields();
      setLoading(true);
      realPersonForm.submit();
    } catch (error) {
      const errorFields = error.errorFields;
      realPersonForm.setFields([
        ...errorFields,
        { name: "national_number/mainInfoTab", errors: nationCodeErrors },
      ]);
    }
  };

  const handleSuccess = (msg) => {
    setLoading(false);
    message.success(msg);
    setTimeout(() => {
      history.goBack();
    }, 1000);
  };

  const handleError = (msg) => {
    setLoading(false);
    message.error(msg);
  };

  const handleOnFinish = (values) => {
    if (currentOffice < 1 || values["contract_id/mainInfoTab"] < 1) {
      Modal.error({
        title: "انتخاب شرکت و قرارداد",
        content:
          "لطفا پیش از ادامه، شرکت و قرارداد (کارگاه) را از بالای صفحه انتخاب نمایید.",
      });

      setLoading(false);
      return;
    }

    const data = makeDataRealPersonServer(
      values,
      currentOffice,
      permissionsSelected
    );

    handleNewRealPerson(data, handleSuccess, handleError);
  };

  return (
    <>
      <GoBackBtn />

      <ContentTop
        title="فرد حقیقی جدید"
        breadcrumbItems={[
          { text: "حقیقی", link: pageNames.personnel.realPerson.list },
          { text: "فرد حقیقی جدید" },
        ]}
      />

      <Form
        {...formItemLayout}
        form={realPersonForm}
        name="realPerson"
        onFinish={handleOnFinish}
        initialValues={formInitialValues}
        autoComplete={false}
        onFinishFailed={(data) =>
          handleOnFailedForm(data, setActiveTab, activeTab, setLoading)
        }
      >
        <Spin spinning={loading}>
          <div className="card-container">
            <Tabs
              type="card"
              activeKey={activeTab}
              onTabClick={(key) => setActiveTab(key)}
            >
              <TabPane tab="اطلاعات اصلی" key="mainInfoTab">
                <MainInfoTab
                  useForm={realPersonForm}
                  loading={loading}
                  onSubmit={handleOnSubmit}
                />
              </TabPane>
              <TabPane tab="اطلاعات شغلی" key="jobInfoTab">
                <JobInfoTab
                  useForm={realPersonForm}
                  loading={loading}
                  onSubmit={handleOnSubmit}
                />
              </TabPane>
              <TabPane tab="اطلاعات تماس" key="contactInfoTab">
                <ContactInfoTab
                  useForm={realPersonForm}
                  loading={loading}
                  onSubmit={handleOnSubmit}
                />
              </TabPane>
              <TabPane tab="افراد تبعی" key="subordinatePersonInfoTab">
                <SubordinatePersonTab
                  useForm={realPersonForm}
                  loading={loading}
                  onSubmit={handleOnSubmit}
                />
              </TabPane>
              <TabPane tab="حساب بانکی" key="bankAccountTab">
                <BankAccountTab
                  useForm={realPersonForm}
                  loading={loading}
                  onSubmit={handleOnSubmit}
                />
              </TabPane>
              <TabPane tab="آپلود اسناد" key="uploadDocTab">
                <UploadDocTab
                  useForm={realPersonForm}
                  loading={loading}
                  onSubmit={handleOnSubmit}
                />
              </TabPane>
              <TabPane
                tab="سطوح دسترسی"
                key="accessLevelTab"
                // forceRender={true}
              >
                <AccessLevelTab
                  useForm={realPersonForm}
                  loading={loading}
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

export default RealPersonAdd;
