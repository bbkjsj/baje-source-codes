import React, { useEffect, useState } from "react";
import { Tabs, Form, Spin, message } from "antd";
import InitialDataTab from "./components/InitialDataTab";
import ContactInfoTab from "./components/ContactInfoTab";
import { handleOnFailedForm, handleSetManagerInfo } from "./utils/formUtils";
import { convertDateToEN } from "_helpers";
import { useHistory, withRouter } from "react-router-dom";
import {
  handleGetSingleRightFull,
  changePropertyName,
  addTabName,
  setFileInputValue,
} from "./utils";
import { covetFormatDateToFA } from "_helpers";
import LogoLoading from "components/general/LoadingLogo";

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

function RightFullEdit(props) {
  const [rightFull, setRightFull] = useState(null);
  const [activeTab, setActiveTab] = useState("initialDataTab");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [manager, setManager] = useState(null);
  const [rightFullEditForm] = Form.useForm();
  const history = useHistory();

  const rightFullID = props.match.params.id;

  useEffect(() => {
    handleGetSingleRightFull(rightFullID, handleSetRightFull, handleError);
  }, []);

  const handleSetRightFull = (data) => {
    let company = data.company;
    let manager = data.manager;
    setInitialLoading(false);
    //1- convert date to FA
    company.register_date = covetFormatDateToFA(company.register_date);
    //- change some input name
    company = changePropertyName(company, {
      oldName: "logo_url",
      newName: "logo",
    });
    company = changePropertyName(company, {
      oldName: "sign_url",
      newName: "sign",
    });
    company = changePropertyName(company, {
      oldName: "seal_url",
      newName: "seal",
    });
    company = changePropertyName(company, {
      oldName: "manager_id_fk",
      newName: "manager_id",
    });
    //- handle file input value
    company.logo = setFileInputValue("logo", company.logo);
    company.sign = setFileInputValue("sign", company.sign);
    company.seal = setFileInputValue("seal", company.seal);
    //- add tab name
    company = addTabName(company);
    //- set in state
    setRightFull(company);
    //- set manager info to form
    if (manager) {
      //- set manager
      setManager({ id: manager.id });
      let fullName = manager.first_name + " " + manager.last_name;
      handleSetManagerInfo(
        rightFullEditForm,
        manager.national_number,
        fullName
      );
    }
  };

  const handleOnSubmit = () => {
    setSubmitLoading(true);
    rightFullEditForm.submit();
  };

  const handleError = (msg, type) => {
    if (type === "submit") {
      setSubmitLoading(false);
    } else if (type === "get") {
      setInitialLoading(false);
    }
    message.error(msg);
  };

  const handleOnFinish = (values) => [console.llg("on dinnish", values)];

  if (initialLoading || !rightFull) {
    return <LogoLoading />;
  }

  return (
    <>
      <h2>ویرایش حقوقی</h2>
      <Form
        {...formItemLayout}
        form={rightFullEditForm}
        name="RightfulEdit"
        onFinish={handleOnFinish}
        onFinishFailed={(data) =>
          handleOnFailedForm(data, setActiveTab, activeTab, setSubmitLoading)
        }
        initialValues={rightFull}
      >
        <Spin spinning={submitLoading}>
          <div className="card-container">
            <Tabs
              type="card"
              activeKey={activeTab}
              onTabClick={(key) => setActiveTab(key)}
            >
              <TabPane tab="اطلاعات اولیه" key="initialDataTab">
                <InitialDataTab
                  useForm={rightFullEditForm}
                  loading={submitLoading}
                  onSubmit={handleOnSubmit}
                  setManager={setManager}
                  formType="edit"
                  manager={manager}
                />
              </TabPane>

              <TabPane
                tab="اطلاعات تماس"
                key="contactInfoTab"
                forceRender={true}
              >
                <ContactInfoTab
                  useForm={rightFullEditForm}
                  loading={submitLoading}
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

export default withRouter(RightFullEdit);
