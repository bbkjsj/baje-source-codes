import React, { useState, useContext } from "react";
import { Row, Button, Col, Select, Form } from "antd";
import FormItem from "components/renderInput/formItem/FormItem";
import RenderSections from "components/renderInput/accessRolesSection/RenderSections";
import { getContractList } from "../../common/_helpers";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

const { Option } = Select;
const selectInputContainer = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 14 },
  },
};

const SecondTab = (props) => {
  const user = useWhoAmI();
  const listLegal = user?.companies;
  const [showPermissions, setShowPermissions] = useState(false);
  const [contractList, setContractList] = useState([]);

  const error = () => console.log("error");

  console.log("eoigo", contractList);

  const onChangeSelect = (value) => {
    getContractList(value, setContractList, error);
    setShowPermissions(false);
    setContractList([]);
    props.form.setFieldsValue({
      selectContract: null,
    });
  };

  const onChangeSelectContract = (value) => {
    console.log("props.permissions", props.permissions);
    setShowPermissions(true);
    const officeId = props.form.getFieldValue("selectOffice");
    console.log("efge", officeId);
    props.resetAndSetOffice(value, officeId);
  };

  return (
    <>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {props.permissions && listLegal ? (
          <>
            <Col xs={24} sm={24} md={24} lg={12} xl={6}>
              <Form.Item
                key="selectOffice"
                label="انتخاب شرکت"
                name="selectOffice"
                {...selectInputContainer}
              >
                <Select onChange={onChangeSelect}>
                  {listLegal.map((el) => (
                    <Option value={el.id}>{el.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={6}>
              <Form.Item
                key="selectContract"
                label="انتخاب قرارداد"
                name="selectContract"
                {...selectInputContainer}
              >
                <Select
                  onChange={onChangeSelectContract}
                  options={contractList}
                ></Select>
              </Form.Item>
            </Col>

            {showPermissions && (
              <>
                <RenderSections
                  permissions={props.permissions}
                  form={props.form}
                />
                <FormItem>
                  <Button type="primary" onClick={props.addListPermission}>
                    تایید
                  </Button>
                </FormItem>
              </>
            )}
          </>
        ) : (
          <p>درحال دریافت از سمت سرور</p>
        )}
      </Row>
    </>
  );
};

export default SecondTab;
