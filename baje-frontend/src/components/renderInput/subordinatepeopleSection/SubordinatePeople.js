import React, { useEffect, useState } from "react";
import { Button, Col, Divider, Form, Input, Modal, Row, Select } from "antd";
import Styles from "./subordinatepeople.module.css";
import { utils } from "react-modern-calendar-datepicker";
import CustomDatePicker from "./../customDatePicker/CustomDatePicker";
import personnelEvents from "modules/personnel/events";
import {
  checkShamsi,
  countOfNumInp,
  handleValidateNationalNumber,
  nation_idNormalize,
} from "_helpers";
import { findPlaceName } from "../../../../src/modules/personnel/realPerson/utils/index";
import { formColSpan, formRowGutter } from "../../../constant";

const onChangeBirthDay = (name, index, form) => {
  let data = form.getFieldValue(name);
  const mainPersonBirthYear = new Date(
    form.getFieldValue("birth_date/mainInfoTab")
  ).getFullYear();

  const year = new Date(
    form.getFieldValue(name)[index]["birth_day"]
  ).getFullYear();

  const diff = mainPersonBirthYear - year;

  if (
    ((name === "mother" || name === "father") && diff < 15) ||
    ((name === "son" || name === "daughter") && diff > -15)
  ) {
    data[index]["birth_day"] = null;
    form.setFieldsValue({
      name: data,
    });
    Modal.warn({
      title: "هشدار",
      content: "سن وارد شده صحیح نمی باشد !",
    });

    return false;
  } else if (
    data[index] &&
    data[index].hasOwnProperty("birth_day") &&
    data[index]["birth_day"] &&
    checkShamsi(data[index]["birth_day"])
  ) {
    if (year >= 1368) {
      data[index]["national_number"] = data[index]["national_id"];
    }

    form.setFieldsValue({
      name: data,
    });
  }
};

const onChangeFirstName = (event, name, form) => {
  const value = event.target.value;

  if (value && name === "father")
    form.setFieldsValue({
      "father_name/mainInfoTab": value,
    });
};

const setValueToInsurance = (key, arrName, form, formValues, value) => {
  formValues[arrName][key].insurance_number = value;

  form.setFieldsValue({
    [arrName]: [...formValues[arrName]],
  });
};

const SubordinatePeople = (props) => {
  const [sponsorshipStatus, setSponsorStatus] = useState();
  const [infoFatherName, setInfoFatherName] = useState(
    props.form.getFieldValue("father_name/mainInfoTab")
  );

  const onChangeSponsorshipStatus = (value, key, arrName, form) => {
    const formValues = form.getFieldsValue();
    if (value === "under_the_tutelage") {
      setSponsorStatus("under_the_tutelage");
      let mainInsurance = formValues["insurance_number/jobInfoTab"];
      setValueToInsurance(key, arrName, form, formValues, mainInsurance);
    } else if (value === "non_dependent") {
      setSponsorStatus("non_dependent");
      setValueToInsurance(key, arrName, form, formValues, null);
    } else {
      setSponsorStatus("leaving_the_sponsorship");
      setValueToInsurance(key, arrName, form, formValues, null);
    }
  };

  const handleOnBlurNationalNumber = (event, listName, fn, name) => {
    let result = handleValidateNationalNumber(event.target.value);

    if (!result) {
      props.form.setFields([
        {
          name: [listName, fn, name],
          errors: ["کد ملی نامعتبر است"],
        },
      ]);
    } else {
      let cityName = findPlaceName(event.target.value);

      const formValues = props.form.getFieldsValue();
      formValues[listName][fn].birth_day_place = cityName;

      props.form.setFieldsValue({
        [listName]: [...formValues[listName]],
      });
    }
  };

  useEffect(() => {
    window.Baje.events.on(
      personnelEvents.REAL_PERSON_FORM_CHANGE,
      (payload) => {
        const father = props.form.getFieldValue("father")?.[0];
        const newFatherName = payload.changed.find(
          (item) => item.name[0] === "father_name/mainInfoTab"
        );

        if (props.name === "father" && father && newFatherName) {
          props.form.setFieldsValue({
            father: [{ ...father, name: newFatherName.value }],
          });
        }
      }
    );
  }, [props.form]);

  return (
    <>
      <Form.List name={props.name}>
        {(fields, { add, remove }) => {
          let addBtn = null;

          if (props.limit > fields.length || !props.limit) {
            addBtn = (
              <Col span={24}>
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                  >
                    افزودن
                  </Button>
                </Form.Item>
              </Col>
            );
          }
          return (
            <>
              <Divider orientation="right" key={props.id}>
                {props.label}
              </Divider>
              {addBtn}
              {fields.map((field) => {
                return (
                  <>
                    <Row className={Styles.filesContainer} gutter={10}>
                      <Col span={24}>
                        <Row gutter={formRowGutter}>
                          <Col {...formColSpan}>
                            <Form.Item
                              {...field}
                              normalize={nation_idNormalize}
                              name={[field.name, "national_id"]}
                              fieldKey={[field.fieldKey, "national_id"]}
                              rules={[{ required: true, len: 10 }]}
                              label="کدملی"
                            >
                              <Input
                                onBlur={(event) =>
                                  handleOnBlurNationalNumber(
                                    event,
                                    props.name,
                                    field.fieldKey,
                                    "national_id"
                                  )
                                }
                              />
                            </Form.Item>
                          </Col>

                          <Col {...formColSpan}>
                            <Form.Item
                              {...field}
                              name={[field.name, "name"]}
                              fieldKey={[field.fieldKey, "name"]}
                              rules={[{ required: true }]}
                              label="نام"
                              initialValue={props.initName && props.initName}
                              shouldUpdate={true}
                            >
                              <Input
                                onBlur={(event) =>
                                  onChangeFirstName(
                                    event,
                                    props.name,
                                    props.form
                                  )
                                }
                              />
                            </Form.Item>
                          </Col>

                          <Col {...formColSpan}>
                            <Form.Item
                              initialValue={
                                props.initLastName && props.initLastName
                              }
                              {...field}
                              name={[field.name, "last_name"]}
                              fieldKey={[field.fieldKey, "last_name"]}
                              rules={[{ required: true }]}
                              label="نام خانوادگی"
                            >
                              <Input />
                            </Form.Item>
                          </Col>

                          <Col {...formColSpan}>
                            <Form.Item
                              {...field}
                              initialValue={
                                props.initFatherName && props.initFatherName
                              }
                              name={[field.name, "father_name"]}
                              fieldKey={[field.fieldKey, "father_name"]}
                              rules={[{ required: true }]}
                              label="نام پدر"
                            >
                              <Input />
                            </Form.Item>
                          </Col>

                          <CustomDatePicker
                            dynamicForm={true}
                            onChangeDynamic={onChangeBirthDay}
                            dynamicFormName={props.name}
                            form={props.form}
                            label="تاریخ تولد"
                            field={field}
                            name={[field.name, "birth_day"]}
                            fieldKey={[field.fieldKey, "birth_day"]}
                            maximumDate={utils("fa").getToday()}
                            rules={[
                              {
                                required: true,
                                message: "فیلد تاریخ تولد اجباریست",
                              },
                              () => ({
                                validator(rule, value) {
                                  if (checkShamsi(value)) {
                                    return Promise.resolve();
                                  } else {
                                    return Promise.reject(
                                      "فرمت تاریخ صحیح نیست"
                                    );
                                  }
                                },
                              }),
                            ]}
                          />

                          <Col {...formColSpan}>
                            <Form.Item
                              {...field}
                              name={[field.name, "national_number"]}
                              fieldKey={[field.fieldKey, "national_number"]}
                              rules={[{ required: true }]}
                              normalize={nation_idNormalize}
                              label="شماره شناسنامه"
                            >
                              <Input />
                            </Form.Item>
                          </Col>

                          <Col {...formColSpan}>
                            <Form.Item
                              {...field}
                              name={[field.name, "birth_day_place"]}
                              fieldKey={[field.fieldKey, "birth_day_place"]}
                              label="محل صدور"
                            >
                              <Input disabled={true} />
                            </Form.Item>
                          </Col>
                          <Col {...formColSpan}>
                            <Form.Item
                              label="وضعیت تکفل"
                              {...field}
                              name={[field.name, "sponsorship_status"]}
                              fieldKey={[field.fieldKey, "sponsorship_status"]}
                              rules={[{ required: true }]}
                            >
                              <Select
                                onChange={(value) =>
                                  onChangeSponsorshipStatus(
                                    value,
                                    field.fieldKey,
                                    props.name,
                                    props.form
                                  )
                                }
                                options={[
                                  {
                                    label: "تحت تکفل",
                                    value: "under_the_tutelage",
                                  },
                                  {
                                    label: "غیر تحت تکفل",
                                    value: "non_dependent",
                                  },
                                  {
                                    label: "خروج از تکفل",
                                    value: "leaving_the_sponsorship",
                                  },
                                ]}
                              />
                            </Form.Item>
                          </Col>

                          <Form.Item noStyle shouldUpdate>
                            {(form) => {
                              const formData = form.getFieldValue(props.name)[
                                field.name
                              ];
                              if (
                                formData &&
                                formData.hasOwnProperty("sponsorship_status")
                              ) {
                                if (
                                  formData.sponsorship_status ===
                                  "non_dependent"
                                ) {
                                  return (
                                    <Col {...formColSpan}>
                                      <Form.Item
                                        {...field}
                                        name={[field.name, "insurance_number"]}
                                        fieldKey={[
                                          field.fieldKey,
                                          "insurance_number",
                                        ]}
                                        rules={[{ required: true }]}
                                        normalize={(value, prevValue) =>
                                          countOfNumInp(value, prevValue, 15)
                                        }
                                        label="شماره بیمه"
                                      >
                                        <Input />
                                      </Form.Item>
                                    </Col>
                                  );
                                }
                              }
                            }}
                          </Form.Item>

                          <Form.Item noStyle shouldUpdate>
                            {(form) => {
                              const formData = form.getFieldValue(props.name)[
                                field.name
                              ];
                              if (
                                formData &&
                                formData.hasOwnProperty("sponsorship_status")
                              ) {
                                if (
                                  formData.sponsorship_status ===
                                  "leaving_the_sponsorship"
                                ) {
                                  return (
                                    <>
                                      <Col {...formColSpan}>
                                        <Form.Item
                                          label="علت خروج از تکفل"
                                          {...field}
                                          name={[
                                            field.name,
                                            "exit_sponsor_reason",
                                          ]}
                                          fieldKey={[
                                            field.fieldKey,
                                            "exit_sponsor_reason",
                                          ]}
                                          rules={[{ required: true }]}
                                        >
                                          <Select
                                            options={[
                                              {
                                                label: "سن قانونی",
                                                value: "legal_  age",
                                              },
                                              {
                                                label: "فوت",
                                                value: "death",
                                              },
                                              {
                                                label: "ازدواج",
                                                value: "marriage",
                                              },
                                              {
                                                label: "سایر",
                                                value: "other",
                                              },
                                            ]}
                                          />
                                        </Form.Item>
                                      </Col>

                                      <CustomDatePicker
                                        dynamicForm={true}
                                        dynamicFormName={props.name}
                                        form={props.form}
                                        label="تاریخ خروج از تکفل"
                                        field={field}
                                        name={[field.name, "exit_sponsor_date"]}
                                        fieldKey={[
                                          field.fieldKey,
                                          "exit_sponsor_date",
                                        ]}
                                        maximumDate={utils("fa").getToday()}
                                        rules={[
                                          // {
                                          //   required: true,
                                          //   message: "فیلد خروج از تکفل اجباری است",
                                          // },
                                          () => ({
                                            validator(rule, value) {
                                              if (checkShamsi(value)) {
                                                return Promise.resolve();
                                              } else {
                                                return Promise.reject(
                                                  "فرمت تاریخ صحیح نیست"
                                                );
                                              }
                                            },
                                          }),
                                        ]}
                                      />
                                    </>
                                  );
                                }
                              }
                            }}
                          </Form.Item>
                        </Row>
                      </Col>

                      <Col span={24}>
                        <Button
                          style={{ backgroundColor: "#e74c3c" }}
                          type="primary"
                          onClick={() => {
                            remove(field.name);
                          }}
                        >
                          حذف
                        </Button>
                      </Col>
                    </Row>
                  </>
                );
              })}
            </>
          );
        }}
      </Form.List>
    </>
  );
};

export default SubordinatePeople;
