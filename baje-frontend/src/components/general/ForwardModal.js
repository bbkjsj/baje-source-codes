import React, { useEffect, useState } from "react";
import {
  Col,
  Divider,
  Form,
  Row,
  Spin,
  Space,
  Input,
  Radio,
  Select,
  Checkbox,
  InputNumber,
} from "antd";
import AppModal from "components/general/AppModal";
import { getAsArray } from "_helpers";
import { NationalIdInput } from "modules/personnel/realPerson/service/formItems";
import axios from "api/appAxios";
import { formColSpan, formRowGutter } from "../../constant";
import PropTypes from "prop-types";
/**
 * ForwardModal : a modal to forward a suggestion from one user to another user in nezam
 * @param {object} props all props of component
 * @param {string} props.title modal's title
 * @param {boolean} props.isVisible toggle modal
 * @param {array} props.forwardTypes list of options for forward to
 * @param {number} props.subjectId forwarding suggestion's id
 * @param {function} props.onSubmit forward action handler
 * @param {function} props.onCancle close modal handler
 * @returns
 */

const ForwardModal = (props) => {
  const {
    onSubmit,
    title = "ارجاع به دیگری",
    isVisible = false,
    forwardTypes = [],
    subjectId,
    onCancel = () => null,
  } = props;

  const [mainForm] = Form.useForm();
  const [formLoading, setFormLoading] = useState(false);
  const [forwardType, setForwardType] = useState();
  const [defaultCompanies, setDefaultCompanies] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const requiredRule = [{ required: true, message: "این فیلد اجباریست" }];

  const handleOnFinish = (params) => {
    const currType = getCurrType();

    const result = {
      ...params,
      subjectId,
      personnel:
        isNaN(currType.personnel) && currType["multiplePersonnel"]
          ? getAsArray(params.personnel).filter((item) => item)
          : params.personnel || currType.personnel,
      companies:
        isNaN(currType.companies) && currType["multipleCompanies"]
          ? getAsArray(params.companies)
          : params.companies || currType.companies,
      custom: currType["multipleCustom"]
        ? getAsArray(params.custom)
        : params.custom,
    };

    onSubmit(result);
  };

  const onModalOk = () => {
    mainForm.submit();
  };

  const onModalCancel = () => {
    onCancel && onCancel();
  };

  const handleCheckboxGroupChange = (field, values) => (checked) => {
    if (checked.includes(0))
      mainForm.setFieldsValue({
        [field]: [0, ...values.map((item) => item.id)],
      });
  };

  const onCheckAllChange = (e, field, values) => {
    if (e.target.checked) {
      mainForm.setFieldsValue({
        [field]: [0, ...values.map((item) => item.id)],
      });
    } else {
      mainForm.setFieldsValue({
        [field]: [],
      });
    }
    setCheckAll(e.target.checked);
  };

  const getCurrType = () => {
    if (Array.isArray(forwardTypes) && forwardTypes.length) {
      return forwardType
        ? forwardTypes.find((item) => item.value === forwardType)
        : forwardTypes[0];
    }
  };

  const createListOptions = (list) => {
    const options = [];

    list.forEach((item) => {
      const option = {};

      if (item.options) {
        option.options = item.options.map((innerItem) => ({
          label: innerItem.name,
          value: innerItem.id,
        }));
        option.label = item.title;
      } else {
        option.label = item.name;
        option.value = item.id;
      }

      options.push(option);
    });

    return options;
  };

  const getForwardTypesField = () => {
    if (Array.isArray(forwardTypes) && forwardTypes.length) {
      const options = [];
      forwardTypes.forEach((item) =>
        options.push({ label: item.title, value: item.value })
      );

      return (
        <Form.Item name="type" label="نوع ارجاع">
          <Radio.Group
            options={options}
            onChange={(e) => setForwardType(e.target.value)}
            optionType="button"
          />
        </Form.Item>
      );
    }
  };

  const getPersonnelField = () => {
    const currType = getCurrType();

    if (
      currType?.personnel === true ||
      (currType?.personnel && Array.isArray(currType?.personnel))
    ) {
      let options = [];

      if (Array.isArray(currType.personnel)) {
        options = createListOptions(currType.personnel);
      }

      // if (currType["multiplePersonnel"]) {
      //   options.unshift({
      //     label: "همه",
      //     value: 0,
      //   });
      // }

      return Array.isArray(currType.personnel) ? (
        <>
          <p>انتخاب فرد*</p>
          <Checkbox
            onChange={(e) =>
              onCheckAllChange(e, "personnel", currType.personnel)
            }
            checked={checkAll}
          >
            همه
          </Checkbox>
          <Form.Item
            name="personnel"
            shouldUpdate={true}
            rules={currType["personnelRequired"] ? requiredRule : undefined}
          >
            {currType["multiplePersonnel"] ? (
              <Checkbox.Group
                options={options}
                onChange={handleCheckboxGroupChange(
                  "personnel",
                  currType.personnel
                )}
              />
            ) : (
              <Select
                options={options}
                maxTagCount="responsive"
                placeholder="انتخاب کنید..."
              />
            )}
          </Form.Item>
        </>
      ) : (
        <NationalIdInput
          type="send"
          codeField="person_personnel_id"
          nameField="person_name"
          name="person_national_code"
          label="انتخاب فرد"
          url="/api/admin/personnel/lookup"
          form={mainForm}
          setData={() => null}
          isRequired={true}
          defaultValue={currType["personnelRequired"]}
          plain={true}
        />
      );
    }
  };

  const getCompaniesField = () => {
    const currType = getCurrType();

    if (
      currType?.companies === true ||
      (currType?.companies && Array.isArray(currType?.companies))
    ) {
      let options = [];

      if (Array.isArray(currType.companies)) {
        options = createListOptions(currType.companies);
      } else if (defaultCompanies.length) {
        options = defaultCompanies.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      }

      if (currType["multipleCompanies"]) {
        options.unshift({
          label: "همه",
          value: 0,
        });
      }

      return (
        <Form.Item
          name="companies"
          label="انتخاب فرد حقوقی / شرکت"
          shouldUpdate={true}
          rules={currType["companiesRequired"] ? requiredRule : undefined}
        >
          {currType["multipleCompanies"] ? (
            <Checkbox.Group
              options={options}
              onChange={handleCheckboxGroupChange(
                "companies",
                currType.companies
              )}
            />
          ) : (
            <Select
              options={options}
              maxTagCount="responsive"
              placeholder="انتخاب کنید..."
            />
          )}
        </Form.Item>
      );
    }
  };

  const getCustomField = () => {
    const currType = getCurrType();

    if (currType && currType.custom) {
      const options = createListOptions(currType.custom);

      return (
        <Form.Item
          name="custom"
          label={currType.fieldTitle || "انتخاب گیرنده"}
          rules={currType["customRequired"] ? requiredRule : undefined}
        >
          <Select
            options={options}
            mode={currType["multipleCustom"] ? "multiple" : undefined}
            allowClear
            maxTagCount="responsive"
            placeholder="انتخاب کنید..."
          />
        </Form.Item>
      );
    }
  };

  const getExternalFields = () => {
    const currType = getCurrType();

    if (currType && currType["fields"] !== undefined)
      return currType.fields(mainForm);
    else return [];
  };

  const prepareDefaultData = async () => {
    try {
      const res = await axios.get("/api/admin/personnel/legal/list");
      setDefaultCompanies(res.data);
    } catch (e) {
      console.log("مشکل در دریافت لیست شرکت ها", e);
    }
  };

  useEffect(() => {
    (async () => {
      mainForm.resetFields();
      await prepareDefaultData();
      setCheckAll(false);
      if (forwardTypes && forwardTypes.length) {
        mainForm.setFieldsValue({ type: forwardTypes[0].value });
        setForwardType(forwardTypes[0].value);
      }
    })();
  }, [isVisible, forwardTypes]);

  useEffect(() => {
    mainForm.resetFields(["personnel", "companies", "custom"]);
  }, [forwardType]);

  const renderValues = {};
  const formInitialValues = {};
  const currType = getCurrType();

  return (
    <AppModal
      title={title}
      width={800}
      visible={isVisible}
      onOk={onModalOk}
      onCancel={onModalCancel}
    >
      <Form
        form={mainForm}
        name="forward"
        onFinish={handleOnFinish}
        initialValues={formInitialValues}
        layout="vertical"
      >
        <Spin spinning={formLoading}>
          <Row gutter={formRowGutter}>
            {(renderValues.types = getForwardTypesField()) && (
              <Col span={24}>{renderValues.types}</Col>
            )}
          </Row>
          <Row gutter={formRowGutter}>
            <Form.Item shouldUpdate noStyle>
              {(form) =>
                !form.getFieldValue("_hidePersonnel") &&
                (renderValues.personnel = getPersonnelField()) && (
                  <Col
                    {...(currType["multiplePersonnel"]
                      ? { xs: 24 }
                      : formColSpan)}
                  >
                    {renderValues.personnel}
                  </Col>
                )
              }
            </Form.Item>
            <Form.Item shouldUpdate noStyle>
              {(form) =>
                !form.getFieldValue("_hideCompany") &&
                (renderValues.companies = getCompaniesField()) && (
                  <Col
                    {...(currType["multipleCompanies"]
                      ? { xs: 24 }
                      : formColSpan)}
                  >
                    {renderValues.companies}
                  </Col>
                )
              }
            </Form.Item>
            {(renderValues.custom = getCustomField()) && (
              <Col {...formColSpan}>{renderValues.custom}</Col>
            )}
            {getExternalFields()}
            <Col span={24}>
              <Form.Item
                label="متن ارجاع"
                name="message"
                extra="پیام / توضیحات مرتبط با ارجاع"
              >
                <Input.TextArea style={{ minHeight: "120px" }} />
              </Form.Item>
            </Col>
          </Row>
        </Spin>
        <Form.Item name="_subjectId" hidden initialValue={subjectId}>
          <Input />
        </Form.Item>
        <Form.Item name="_hidePersonnel" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="_hideCompany" hidden>
          <Input />
        </Form.Item>
      </Form>
    </AppModal>
  );
};

ForwardModal.propTypes = {
  title: PropTypes.string,
  isVisible: PropTypes.bool,
  forwardTypes: PropTypes.array,
  subjectId: PropTypes.number,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export default ForwardModal;
