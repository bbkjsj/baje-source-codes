import React, { useState } from "react";
import { Tabs, Form, Spin, message } from "antd";
import InitialDataTab from "./components/InitialDataTab";
import ContactInfoTab from "./components/ContactInfoTab";
import { handleOnFailedForm, handleNewRightFull } from "./utils/formUtils";
import {
  removeTabNames,
  removePropertyFromObj,
  setOriginFileObj,
  appendToFormData,
} from "./utils";
import { convertDateToEN } from "_helpers";
import { useHistory } from "react-router-dom";

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

function RightFullAdd() {
  const [activeTab, setActiveTab] = useState("initialDataTab");
  const [loading, setLoading] = useState(false);
  const [manager, setManager] = useState(null);
  const [rightFullForm] = Form.useForm();
  const history = useHistory();

  const handleOnSubmit = () => {
    setLoading(true);
    rightFullForm.submit();
  };

  const handleSuccess = (msg) => {
    setLoading(false);
    message.success(msg);
    setTimeout(() => {
      history.go();
    }, 1000);
  };

  const handleError = (msg) => {
    setLoading(false);
    message.error(msg);
  };

  const handleOnFinish = async (values) => {
    //1- remove tab name form input name
    let data = removeTabNames(values);
    //2- remove additional inputs
    data = removePropertyFromObj(data, ["manager_name"]);
    //3- convert date to EN
    data.register_date = convertDateToEN(data.register_date);
    //4- set originFileObj for file inputs
    data = setOriginFileObj(data, ["seal", "sign", "logo"]);
    //5- set additional data like manager_id
    data.manager_id = manager ? manager.id : "-1";
    //6- append to form data
    data = appendToFormData(data);
    //7- send to server
    handleNewRightFull(data, handleSuccess, handleError);
  };

  return (
    <>
      <h2>اضافه کردن فرد حقوقی</h2>
      <Form
        {...formItemLayout}
        form={rightFullForm}
        name="Rightful"
        onFinish={handleOnFinish}
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
              <TabPane tab="اطلاعات اولیه" key="initialDataTab">
                <InitialDataTab
                  useForm={rightFullForm}
                  loading={loading}
                  onSubmit={handleOnSubmit}
                  setManager={setManager}
                  formType="send"
                />
              </TabPane>

              <TabPane
                tab="اطلاعات تماس"
                key="contactInfoTab"
                forceRender={true}
              >
                <ContactInfoTab
                  useForm={rightFullForm}
                  loading={loading}
                  onSubmit={handleOnSubmit}
                />
              </TabPane>
            </Tabs>
          </div>
        </Spin>
      </Form>
    </>
  );
}

export default RightFullAdd;
