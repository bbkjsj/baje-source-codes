import React, { forwardRef, useState } from "react";
import { Calendar } from "react-modern-calendar-datepicker";
import Styles from "./customDatePicker.module.css";
import InputMask from "react-input-mask";
import { Col, Modal } from "antd";
import styled from "styled-components";
import AppFormItem from "components/general/AppFormItem";
import { formColSpan } from "../../../constant";
import PropTypes from "prop-types";
import AppInput from "components/general/AppInput";

const StyledMaskInput = styled(InputMask)`
  padding: 4px 11px;
  width: 100%;

  border: 1px solid #d9d9d9;
  border-top-color: rgb(217, 217, 217);
  border-top-style: solid;
  border-top-width: 1px;
  border-right-color: rgb(217, 217, 217);
  border-right-style: solid;
  border-right-width: 1px;
  border-bottom-color: rgb(217, 217, 217);
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-left-color: rgb(217, 217, 217);
  border-left-style: solid;
  border-left-width: 1px;
  border-image-source: initial;
  border-image-slice: initial;
  border-image-width: initial;
  border-image-outset: initial;
  border-image-repeat: initial;
  border-radius: 2px;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  border-bottom-left-radius: 2px;
`;

const OpenCalenderBtn = styled.p`
  padding: 8px 15px;
  cursor: pointer;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  color: #2f75b5;
  transition: all 0.5s;
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid transparent;
  &:hover {
    background-color: #eee;
  }
`;
/**
 *
 * @param {object} props - all props of component
* @param {string} props.name - field name
 * @param {string} props.label - field label
 * @param {array} props.rules - validation rules
 * @param {object} props.form - current form
 * @param {object} props.minimumDate - all days before minimumDate would be disable
 * @param {object} props.maximumDate - all days after maximumDate would be disable
 * @param {boolean} props.dynamicForm - dynamicForm={true} is used dynamic form fields
 * @param {string} props.dynamicFormName - should passed when  dynamicForm={true}


/**
 *
 * @param {object} props - props object
 * @param {string} props.label - label
 * @param {string} props.name - name
 * @param {Function} props.form - form hook
 * @param {Function} props.onChange - onChange function
 * @param {boolean} props.disabled - disabled
 * @param {boolean} props.plain - if you want to use only form item
 * @param {Array<{required:boolean,message:string,min:number,max:number}>} props.rules - rules
 * @returns
 */
const CustomDatePicker = forwardRef((props, ref) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [modal, setModal] = useState(false);

  const handleSetDate = (date) => {
    if (date) {
      setSelectedDay(date);
      let month =
        date.month.toString().length === 1 ? `0${date.month}` : date.month;
      let day = date.day.toString().length === 1 ? `0${date.day}` : date.day;
      let tostring = `${date.year}/${month}/${day}`;

      if (props.dynamicForm) {
        let values = props.form.getFieldsValue();

        if (values[props.dynamicFormName]) {
          if (values[props.dynamicFormName][props.name[0]]) {
            values[props.dynamicFormName][props.name[0]] = {
              ...values[props.dynamicFormName][props.name[0]],
              [props.name[1]]: `${date.year}/${month}/${day}`,
            };
          } else {
            values[props.dynamicFormName][props.name[0]] = {
              [props.name[1]]: `${date.year}/${month}/${day}`,
            };
          }
        }

        props.form.setFieldsValue({
          [props.dynamicFormName]: [...values[props.dynamicFormName]],
        });

        if (props.onChangeDynamic)
          props.onChangeDynamic(
            props.dynamicFormName,
            props.name[0],
            props.form
          );
      } else {
        props.form.setFieldsValue({ [props.name]: tostring });
      }
      props.onChange && props.onChange(tostring);
      setModal(false);
    }
  };

  //For validation online
  const formItem = (
    <AppFormItem
      hidden={props.hidden}
      style={{ marginBottom: "0" }}
      required={props.required || false}

      // rules={props.rules}
      // name="customDatePicker"
    >
      <Col
        // span={24}
        style={{ position: "relative" }}
        className="custom-datepicker"
      >
        <AppFormItem
          label={props.label}
          {...props.field}
          fieldKey={props.fieldKey}
          name={props.name}
          rules={props.rules}
          required={props.required || false}
          // labelCol={{ span: 24 }}
          // colon={false}
          validateFirst
          style={props.style}
        >
          <AppInput
            mask="1111/11/11"
            onChange={props.onChange ? props.onChange : undefined}
            disabled={props.disabled}
            className={
              props.centerTextMobile || props.centerText ? "text-center" : ""
            }
            autoComplete="off"
            inputMode="numeric"
            ref={ref || props?.pRef}
            placeholder={props.placeholder || "____/__/__"}
          />
        </AppFormItem>
        {!props.disabled && (
          <OpenCalenderBtn onClick={() => setModal(true)}>
            تقویم
          </OpenCalenderBtn>
        )}
      </Col>
    </AppFormItem>
  );

  return (
    <>
      <Modal
        width={400}
        bodyStyle={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0",
        }}
        title="انتخاب تاریخ"
        visible={modal}
        onOk={() => setModal(false)}
        onCancel={() => setModal(false)}
        footer={false}
      >
        <Calendar
          locale="fa"
          value={selectedDay}
          onChange={(date) => {
            handleSetDate(date);
            props.form.validateFields([props.name]);
          }}
          maximumDate={props.maximumDate && props.maximumDate}
          minimumDate={props.minimumDate && props.minimumDate}
          // wrapperClassName={zIndex}
          calendarClassName={Styles.calender}
        />
      </Modal>

      {props.plain ? formItem : <Col {...formColSpan}>{formItem}</Col>}
    </>
  );
});

CustomDatePicker.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  rules: PropTypes.arrayOf(PropTypes.object),
  form: PropTypes.object,
  minimumDate: PropTypes.shape({
    day: PropTypes.number,
    month: PropTypes.number,
    year: PropTypes.number,
  }),
  maximumDate: PropTypes.shape({
    day: PropTypes.number,
    month: PropTypes.number,
    year: PropTypes.number,
  }),
  dynamicForm: PropTypes.bool,
  dynamicFormName: PropTypes.string,
};
export default CustomDatePicker;
