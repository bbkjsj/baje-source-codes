import React from "react";
import TextInput from "./textInput/TextInput";
import NumberInput from "./numberInput/NumberInput";
import ModernDatePicker from "./modernDatePicker/ModernDatePicker";
import DatePicker from "react-persian-datepicker";
import UploadInput from "./uploadInput/UploadInput";
import CustomDatePicker from "./customDatePicker/CustomDatePicker";

import {
  Checkbox,
  Radio,
  Form,
  Col,
  Input,
  Select,
  Divider,
  Button,
  Spin,
} from "antd";

{
  /* must be edit*/
}

const { Option } = Select;

const getAdditionalProps = (props, elementName) => {
  let additional = undefined;
  if (props.additionalData && props.additionalData[elementName]) {
    additional = props.additionalData[elementName];
    return additional;
  }
  return undefined;
};

const checkStatus = (Additional) => {
  if (Additional && Additional.hasOwnProperty("hidden")) {
    if (!Additional.hidden) {
      return true;
    }
  }
};

export const RenderTextInputs = (props) => {
  const inputs = props.inputsFiled.map((element) => {
    if (element.tab == props.tab) {
      return (
        <TextInput
          key={element.id}
          label={element.label}
          name={element.name}
          rules={element.rules ? element.rules : null}
        />
      );
    }
  });

  return <>{inputs}</>;
};

const checkInputAttr = (element, Additional) => {
  let inputAttr;
  if (element.inputAttr && Additional && Additional.inputAttr) {
    inputAttr = { ...element.inputAttr, ...Additional.inputAttr };
  } else if (element.inputAttr) {
    inputAttr = element.inputAttr;
  } else if (Additional && Additional.inputAttr) {
    inputAttr = Additional.inputAttr;
  }
  return inputAttr;
};

export const RenderInputs = (props) => {
  const inputs = props.inputsFiled.map((element) => {
    // if (element.tab == props.tab) {
    const Additional = getAdditionalProps(props, element.name);

    if (checkStatus(Additional)) return null;

    if (element.type === "text") {
      let inputAttr;
      if (element.inputAttr && Additional && Additional.inputAttr) {
        inputAttr = { ...element.inputAttr, ...Additional.inputAttr };
      } else if (element.inputAttr) {
        inputAttr = element.inputAttr;
      } else if (Additional && Additional.inputAttr) {
        inputAttr = Additional.inputAttr;
      }

      return (
        <TextInput
          {...Additional}
          key={element.id}
          label={element.label}
          name={element.name}
          rules={element.rules ? element.rules : null}
          normalize={element.normalize && element.normalize}
          inputAttr={inputAttr}
        />
      );
    } else if (element.type === "textArea") {
      return (
        <Col key={element.id} xs={24} sm={24} md={24} lg={12} xl={6}>
          <Form.Item
            label={element.label}
            name={element.name}
            rules={element.rules ? element.rules : null}
          >
            <Input.TextArea />
          </Form.Item>
        </Col>
      );
    } else if (element.type === "password") {
      return (
        <Col key={element.id} xs={24} sm={24} md={24} lg={12} xl={6}>
          <Form.Item
            label={element.label}
            name={element.name}
            rules={element.rules ? element.rules : null}
          >
            <Input.Password {...element.inputAttr} />
          </Form.Item>
        </Col>
      );
    } else if (element.type === "confirm_password") {
      return (
        <Col key={element.id} xs={24} sm={24} md={24} lg={12} xl={6}>
          <Form.Item
            validateFirst
            label={element.label}
            name={element.name}
            rules={element.rules ? element.rules : null}
            dependencies={element.dependencies}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
        </Col>
      );
    } else if (element.type === "number") {
      const Additional = getAdditionalProps(props, element.name);
      return (
        <NumberInput
          {...Additional}
          key={element.id}
          label={element.label}
          name={element.name}
          rules={element.rules ? element.rules : null}
        />
      );
    } else if (element.type === "datePicker") {
      const Additional = getAdditionalProps(props, element.name);
      if (checkStatus(Additional)) return null;
      let inputAttr = checkInputAttr(element, Additional);

      return (
        <ModernDatePicker
          {...Additional}
          zIndex={element.zIndex}
          key={element.id}
          label={element.label}
          name={element.name}
          rules={element.rules ? element.rules : null}
          inputAttr={inputAttr}
        />
      );
    } else if (element.type === "maskAndDatePicker") {
      const Additional = getAdditionalProps(props, element.name);
      if (checkStatus(Additional)) return null;
      let inputAttr = checkInputAttr(element, Additional);

      return (
        <CustomDatePicker
          {...Additional}
          zIndex={element.zIndex}
          key={element.id}
          label={element.label}
          name={element.name}
          rules={Additional.rules ? Additional.rules : element.rules}
          inputAttr={inputAttr}
        />
      );
    } else if (element.type === "upload") {
      const Additional = getAdditionalProps(props, element.name);
      if (checkStatus(Additional)) {
        return null;
      }

      return (
        <UploadInput
          {...Additional}
          extra={element.extra}
          key={element.id}
          valuePropName={element.valuePropName}
          getValueFromEvent={element.getValueFromEvent}
          label={element.label}
          name={element.name}
          rules={element.rules ? element.rules : null}
          inputProps={element.inputProps}
          listType={element.listType && element.listType}
        />
      );
    } else if (element.type === "groupCheckBox") {
      // render loading when get option from server
      let checkBox;
      const { accessCheckBoxOption } = props;
      if (!accessCheckBoxOption && !element.option) {
        checkBox = <p>درحال دریافت از سرور</p>;
      } else {
        checkBox = (
          <Checkbox.Group
            options={
              props.accessCheckBoxOption
                ? props.accessCheckBoxOption
                : element.option
            }
          />
        );
      }

      return (
        <Col key={element.id} xs={24} sm={24} md={24} lg={12} xl={6}>
          <Form.Item
            label={element.label}
            name={element.name}
            rules={element.rules ? element.rules : null}
          >
            {checkBox}
          </Form.Item>
        </Col>
      );
    } else if (element.type === "groupRadioButton") {
      const Additional = getAdditionalProps(props, element.name);
      if (checkStatus(Additional)) return null;
      return (
        <Col key={element.id} xs={24} sm={24} md={24} lg={12} xl={6}>
          <Form.Item
            label={element.label}
            name={element.name}
            rules={element.rules ? element.rules : null}
          >
            <Radio.Group options={element.option} />
          </Form.Item>
        </Col>
      );
    } else if (element.type === "dropDownSelect") {
      const Additional = getAdditionalProps(props, element.name);
      if (checkStatus(Additional)) return null;

      let listOfOption = null;
      if (element.option) listOfOption = element.option;
      else if (Additional.option) listOfOption = Additional.option;

      let disabled = false;
      if (Additional) {
        disabled = Additional.disabled || element.disabled;
      }

      return (
        <Col key={element.id} xs={24} sm={24} md={24} lg={12} xl={6}>
          <Form.Item
            label={element.label}
            name={element.name}
            rules={element.rules ? element.rules : null}
          >
            <Select
              disabled={disabled}
              showSearch={element.showSearch && element.showSearch}
              notFoundContent={listOfOption ? <Spin size="small" /> : null}
              options={listOfOption}
            ></Select>
          </Form.Item>
        </Col>
      );
    } else if (element.type === "divider") {
      return (
        <Divider orientation="right" key={element.id}>
          {element.label}
        </Divider>
      );
    } else if (element.type === "textV2") {
      return (
        <Col key={element.id} xs={24} sm={24} md={24} lg={12} xl={6}>
          <Form.Item
            {...props.filed}
            label={element.label}
            name={[props.filed.name, element.name]}
            rules={element.rules ? element.rules : null}
            fieldKey={[props.filed.fieldKey]}
          >
            <Input />
          </Form.Item>
        </Col>
      );
    } else if (element.type === "formList") {
      return (
        <Form.List name={element.name}>
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map((field) => (
                  <RenderInputs inputsFiled={element.inputs} filed={field} />
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    block
                  >
                    افزودن
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
      );
    } else if (element.type === "customInput") {
      const Additional = getAdditionalProps(props, element.name);
      if (checkStatus(Additional)) return null;
      let component = Additional.component;
      return <>{component}</>;
    }

    // }
  });
  return <>{inputs}</>;
};
