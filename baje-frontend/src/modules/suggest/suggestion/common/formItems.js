import {
  Col,
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  message,
  Row,
  Modal,
  Button,
  Switch,
  InputNumber,
  Space,
  Divider,
  List,
  Upload,
  notification,
  Spin,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import axios from "api/appAxios";
import {
  checkShamsi,
  convertDataKeys,
  countOfNumInp,
  numberNormalize,
  priceNormalizer,
} from "_helpers";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { utils } from "react-modern-calendar-datepicker";
import { NationalIdInput } from "modules/personnel/realPerson/service/formItems";
import { participationType, suggestionType, dealType, keyMap } from "../const";
import SubmitBtn from "../../../../components/general/SubmitBtn";
import AppButton from "components/general/AppButton";
import { _REGISTER } from "modules/suggest/auth/api";
import AppSelect from "components/general/AppSelect";
import { notice } from "_helpers";
import AppInput from "components/general/AppInput";
import * as api from "../utils/api";
import * as categoryApi from "../../category/utils/api";
import AppNumInput from "../../../../components/general/AppNumInput";
import {
  formColSpan,
  formItemLayout,
  formRowGutter,
} from "../../../../constant";
import endpoints from "../../endpoints";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";
export const Title = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item label="عنوان پیشنهاد" name={"title"} rules={rules}>
        <Input />
      </Form.Item>
    </Col>
  );
};

export const ParticipationType = ({ disabled = false }) => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item label="نوع مشارکت" name={"participation_type"} rules={rules}>
        <Radio.Group disabled={disabled}>
          <Radio value={participationType.SINGLE}>انفرادی</Radio>
          <Radio value={participationType.GROUP}>گروهی</Radio>
        </Radio.Group>
      </Form.Item>
    </Col>
  );
};

export const Person = ({
  useForm,
  setPerson,
  defaultValue = false,
  edit = false,
  disabled = false,
}) => {
  return (
    <NationalIdInput
      type={edit ? "edit" : "send"}
      codeField="person_personnel_id"
      nameField="person_name"
      name="person_national_code"
      label="پیشنهاد دهنده"
      url={endpoints.userLookup}
      form={useForm}
      setData={setPerson}
      isRequired={true}
      defaultValue={defaultValue}
      disabled={disabled}
    />
  );
};

export const Sender = ({ defaultValue }) => {
  const rules = [];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item label="پیشنهاد دهنده" name={"sender_name"} rules={rules}>
        <Input defaultValue={defaultValue} disabled />
      </Form.Item>
    </Col>
  );
};

export const GroupTitle = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item label="نام گروه" name={"group_title"} rules={rules}>
        <Input />
      </Form.Item>
    </Col>
  );
};

export const Participants = ({
  dispatch,
  state,
  factory,
  disabled = false,
}) => {
  const [newItem, setNewItem] = useState();
  const [isPersonModalVisible, setIsPersonModalVisible] = useState(false);
  const [preventDiscardNewPerson, setPreventDiscardNewPerson] = useState();
  const user = useWhoAmI();
  const [groupForm] = Form.useForm();

  useEffect(() => {
    (async () => {
      groupForm.setFieldsValue({
        code: state.curr_group_person_code,
      });

      await handleOnCodeChange();
    })();
  }, [state.curr_group_person_code]);

  const handleOnCodeChange = async () => {
    const code = groupForm.getFieldValue("code");

    if (!code || code.toString().length !== 10) return false;

    if (state.participants.find((item) => item.national_id === code)) {
      Modal.warn({
        title: "مشارکت کننده تکراری",
        content: "این فرد ‌قبلا در لیست مشارکت کنندگان ثبت شده است",
      });

      discardNewItem();
      return;
    }

    try {
      const req = await axios.get(`/api/survey/user/lookup/${code}`);

      if (!req.data.length) {
        showPersonConfirm();
        return;
      }

      const result = req.data?.[0];

      if (typeof result === "object") {
        setNewItem({
          ...result,
          id: -1,
          national_id: code,
          personnel_id: result.id,
        });

        groupForm.setFieldsValue({
          full_name: result.first_name + " " + result.last_name,
          percentage: getRemainingPercent(),
        });

        if (code === user.nationalCode) setPreventDiscardNewPerson(true);
        else setPreventDiscardNewPerson(false);
      } else {
        setNewItem(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormFinish = (params) => {
    if (newItem && params.percentage) {
      const action = {
        type: "PARTICIPANT/ADD",
        payload: factory({
          ...newItem,
          percentage: params.percentage,
        }),
      };

      dispatch(action);
      discardNewItem();
    }
  };

  const handleFormChange = async (changed, all) => {
    if (changed.code) await handleOnCodeChange();
  };

  const deleteParticipant = (nationalId) => {
    const id = state.participants.find(
      (item) => item.national_id === nationalId
    )?.id;

    dispatch({
      type: "PARTICIPANT/DELETE",
      payload: nationalId,
    });

    if (id > 0)
      dispatch({
        type: "PARTICIPANT/LOG_DELETE",
        payload: id,
      });
  };

  const discardNewItem = () => {
    groupForm.resetFields();
    setNewItem(null);
  };

  const showPersonConfirm = () => {
    Modal.confirm({
      title: "درج فرد حقیقی جدید",
      content:
        "کد ملی مورد نظر در سامانه یافت نشد، آیا مایل به درج مشخصات فرد جدید هستید؟",
      onOk: () => {
        setIsPersonModalVisible(true);
      },
    });
  };

  const getTotalPercent = () => {
    return state.participants.reduce((prev, item) => {
      return prev + parseInt(item.percentage);
    }, 0);
  };

  const getRemainingPercent = () => {
    return 100 - getTotalPercent();
  };

  const handleOnPercentBlur = (event) => {
    const value = groupForm.getFieldValue("percentage");

    if (getTotalPercent() + parseInt(value) > 100) {
      Modal.info({
        title: "مجموع درصد مشارکت",
        content:
          "درصد وارد شده باید به گونه ای باشد که مجموع مشارکت افراد گروه از ۱۰۰٪ تجاوز نکند",
      });

      groupForm.setFieldsValue({
        percentage: getRemainingPercent(),
      });
    }

    if (parseInt(value) < 1) {
      Modal.info({
        title: "حداقل درصد مشارکت",
        content: "درصد مشارکت افراد در پیشنهاد، نمیتواند کمتر از ۱ باشد",
      });

      groupForm.setFieldsValue({
        percentage: getRemainingPercent(),
      });
    }
  };

  const PersonBirthDate = ({ useForm, onChange }) => {
    const rules = [
      {
        required: true,
        message: "تاریخ ثبت اجباری است",
      },
      () => ({
        validator(rule, value) {
          if (checkShamsi(value)) {
            return Promise.resolve();
          } else {
            return Promise.reject("فرمت تاریخ صحیح نیست");
          }
        },
      }),
    ];

    return (
      <CustomDatePicker
        form={useForm}
        label="تاریخ تولد"
        name="date"
        maximumDate={utils("fa").getToday()}
        rules={rules}
        plain={true}
      />
    );
  };

  const NewPersonModal = () => {
    const STEPS = {
      first: 1, // get user info
      second: 2, // get verify code
    };

    const [personForm] = Form.useForm();
    const [formLoading, setFormLoading] = useState(false);
    const [step, setStep] = useState(STEPS.first);
    const [loading, setLoading] = useState(false);

    const handleOnFinish = (params) => {
      setLoading(true);
      console.table(params);
      // if (step === STEPS.first) {
      // send user info
      _REGISTER(params)
        .then((res) => {
          console.log(res.data);
          setLoading(false);
          // after get response change step
          dispatch({
            type: "CURRENT_GROUP_PERSON_CODE/SET",
            payload: params.national_code,
          });
          setIsPersonModalVisible(false);
          // setStep(STEPS.second);
          // setFormVals(values);
        })
        .catch((err) => {
          setLoading(false);
          console.error(err);
          if (err.response.data === "duplicate user") {
            Modal.warning({
              content: "شما قبلا ثبت نام کرده اید لطفا وارد شوید",
              okText: "ورود",
              closable: true,
            });
          } else {
            notification.error({
              message: "مشکلی پیش آمده، لطفا دوباره تلاش کنید",
            });
          }
        });
      // } else if (step === STEPS.second) {
      // verify code
      // after verify. close modal and show success message
      // }
    };

    const onModalOk = () => {
      personForm.submit();
    };

    // const onModalCancel = () => {
    //   if (step === STEPS.first) {
    //     // close Modal
    //     setIsPersonModalVisible(false);
    //     setStep(STEPS.second);
    //   } else if (step === STEPS.second) {
    //     // back to first step
    //     setStep(STEPS.first);
    //   }
    // };

    const onModalCancel = () => {
      setIsPersonModalVisible(false);
    };

    const rules = [{ required: true }];

    const formInitialValues = {
      national_code: groupForm.getFieldValue("code"),
    };

    return (
      <Modal
        title="مشخصات حقیقی جدید"
        width={800}
        visible={isPersonModalVisible}
        onCancel={() => setIsPersonModalVisible(false)}
        footer={
          <>
            {/* <AppButton onClick={onModalCancel} variant="danger">
              {step === STEPS.first ? "لغو" : "برگشت"}
            </AppButton>
            <AppButton loading={loading} onClick={onModalOk} variant="primary">
              {step === STEPS.first ? "ادامه" : "ارسال"}
            </AppButton> */}
            <AppButton onClick={onModalCancel} variant="danger">
              لغو
            </AppButton>
            <AppButton loading={loading} onClick={onModalOk} variant="primary">
              ارسال
            </AppButton>
          </>
        }
      >
        <Form
          {...formItemLayout}
          form={personForm}
          name="person"
          onFinish={handleOnFinish}
          initialValues={formInitialValues}
        >
          <Spin spinning={formLoading}>
            <Row gutter={formRowGutter}>
              <>
                <Col {...formColSpan}>
                  <Form.Item
                    label="کد ملی"
                    name={"national_code"}
                    rules={[{ required: true }, { len: 10 }]}
                    normalize={(value, prevValue) =>
                      countOfNumInp(value, prevValue, 10)
                    }
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col {...formColSpan}>
                  <Form.Item
                    name="id_number"
                    label="شماره شناسنامه"
                    rules={rules}
                    normalize={numberNormalize}
                    // labelCol={{ span: 24 }}
                    // colon={false}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col {...formColSpan}>
                  <Form.Item label="نام" name={"first_name"} rules={rules}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col {...formColSpan}>
                  <Form.Item
                    label="نام خانوادگی"
                    name={"last_name"}
                    rules={rules}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col {...formColSpan}>
                  <Form.Item label="نام پدر" name={"father_name"} rules={rules}>
                    <Input />
                  </Form.Item>
                </Col>
                {/* <Col {...formColSpan}>
                    <PersonBirthDate useForm={personForm} />
                  </Col> */}
                <Col {...formColSpan}>
                  <Form.Item
                    label="شماره موبایل"
                    name={"mobile"}
                    rules={[{ required: true }, { len: 11 }]}
                    normalize={(value, prevValue) =>
                      countOfNumInp(value, prevValue, 11)
                    }
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col {...formColSpan}>
                  <Form.Item
                    label="جنسیت"
                    name="gender"
                    rules={rules}
                    // labelCol={{ span: 24 }}
                    // colon={false}
                  >
                    <AppSelect
                      options={[
                        { label: "مرد", value: "m" },
                        { label: "زن", value: "f" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </>

              {/* {step === STEPS.second && (
                <Col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={12}
                  className="mx-auto"
                >
                  <Form.Item
                    name="code"
                    label="کد تایید"
                    rules={rules}
                    labelCol={{ span: 24 }}
                    colon={false}
                  >
                    <AppInput
                      mask="1  1  1  1  1  1"
                      name="code"
                      className="text-center ltr"
                      dir="ltr"
                      placeholder="_  _  _  _  _  _"
                    />
                  </Form.Item> */}
              {/* <AppButton
          type="link"
          onClick={() => onResend()}
          className="m-0 p-0 text-underline text-14"
        >
          اصلاح شماره
        </AppButton> */}
              {/* </Col>
              )} */}

              {/* <Col {...formColSpan}>
                <Form.Item label="رمز عبور" name={"password"} rules={rules}>
                  <Input.Password />
                </Form.Item>
              </Col>
              <Col {...formColSpan}>
                <Form.Item
                  label="تکرار رمز عبور"
                  name={"password_repeat"}
                  rules={rules}
                >
                  <Input.Password />
                </Form.Item>
              </Col> */}
            </Row>
          </Spin>
        </Form>
      </Modal>
    );
  };

  const NewItemCode = () => {
    return (
      <Form.Item
        name="code"
        normalize={numberNormalize}
        label="جستجوی افراد"
        {...formItemCols}
      >
        <Input placeholder="کد ملی را وارد کنید..." disabled={disabled} />
      </Form.Item>
    );
  };

  const NewItemFullName = () => {
    return (
      <Form.Item name="full_name" label="نام کامل" {...formItemCols}>
        <Input disabled={true} />
      </Form.Item>
    );
  };

  const NewItemPercentage = () => {
    return (
      <Form.Item label="درصد مشارکت" {...formItemCols}>
        <Space>
          <Form.Item
            name="percentage"
            noStyle={true}
            normalize={numberNormalize}
          >
            <Input
              suffix="٪"
              onBlur={handleOnPercentBlur}
              style={{ maxWidth: "100px" }}
            />
          </Form.Item>
          <span style={{ color: "gray" }}>
            از {getRemainingPercent() + "% باقی مانده"}
          </span>
        </Space>
      </Form.Item>
    );
  };

  const formItemCols = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const ParticipantListContainer = styled.div`
    background: #f5f5f5;
    border: 3px solid #f3f3f3;
    border-radius: 5px;
    padding: 24px;
  `;

  return (
    <Col span={24}>
      <Divider orientation="right">لیست پیشنهاد دهندگان</Divider>
      <Row>
        <Col xs={24} lg={12}>
          <Form
            form={groupForm}
            name="new_participant"
            onFinish={handleFormFinish}
            onValuesChange={handleFormChange}
          >
            <Form.Item noStyle={true} shouldUpdate={true}>
              <Row gutter={{ xs: 8, lg: 16 }}>
                <Col xs={24} md={10}>
                  {newItem ? <NewItemFullName /> : <NewItemCode />}
                </Col>
                {newItem && (
                  <>
                    <Col xs={24} md={14}>
                      <NewItemPercentage />
                    </Col>
                    <Col span={24}>
                      <Space>
                        <Button type="primary" htmlType="submit">
                          ثبت فرد
                        </Button>
                        <Button
                          type="secondary"
                          onClick={discardNewItem}
                          disabled={preventDiscardNewPerson}
                        >
                          انصراف
                        </Button>
                      </Space>
                    </Col>
                  </>
                )}
              </Row>
            </Form.Item>
          </Form>
        </Col>
        <Col xs={0} lg={1} />
        <Col xs={24} lg={11}>
          <ParticipantListContainer>
            <Row>
              {state?.participants.length ? (
                state.participants.map((item, index) => (
                  <Col xs={24} lg={12} xxl={8}>
                    <Space>
                      <MinusCircleOutlined
                        hidden={disabled}
                        onClick={() => deleteParticipant(item.national_id)}
                      />
                      <span>
                        <span>{item.name}</span>
                        <br />
                        <small style={{ color: "gray" }}>
                          {item.percentage}% مشارکت
                        </small>
                      </span>
                    </Space>
                  </Col>
                ))
              ) : (
                <span>لیست خالی است</span>
              )}
            </Row>
          </ParticipantListContainer>
        </Col>
      </Row>
      <NewPersonModal />
    </Col>
  );
};

export const Call = (props) => {
  const handleOnChange = (e) => {
    let id = e;

    if (e.target) {
      if (e.target.checked) id = props.form.getFieldValue("related_call");
      else id = false;
    }
    props.onChange && props.onChange(id);
  };

  return (
    <Col span={24}>
      <Form.Item noStyle>
        <Form.Item name={"is_for_call"} valuePropName="checked" noStyle={true}>
          <Checkbox onChange={handleOnChange} />
        </Form.Item>
        <span className="mr-3">جهت شرکت در فراخوان</span>
      </Form.Item>
      <RelatedCall {...props} onChange={handleOnChange} />
    </Col>
  );
};

export const RelatedCall = ({ items, onChange, onButtonClick }) => {
  let [options, setOptions] = useState([]);
  const rules = [{ required: true }];

  useEffect(() => {
    const listOptions = items.map((item) => {
      return { label: item.subject, value: item.id };
    });

    setOptions(listOptions);
  }, [items]);

  return (
    <Form.Item noStyle={true} shouldUpdate={true}>
      {(form) => {
        const StyledRow = styled.div`
          display: flex;
          align-items: center;
        `;

        const hasActiveCall = Array.isArray(options) && options.length;

        return (
          !!form.getFieldValue("is_for_call") && (
            <StyledRow style={{ display: hasActiveCall ? "flex" : "block" }}>
              {hasActiveCall ? (
                <Form.Item
                  label="موضوع فراخوان"
                  name="related_call"
                  rules={rules}
                  className="ml-3"
                >
                  <Select options={options} onChange={onChange} />
                </Form.Item>
              ) : (
                <div className="mt-2 ml-2">
                  <div>در حال حاضر فراخوان فعالی وجود ندارد.</div>
                </div>
              )}
              <AppButton onClick={onButtonClick} className="mt-lg-3">
                مشاهده فراخوان های آتی
              </AppButton>
            </StyledRow>
          )
        );
      }}
    </Form.Item>
  );
};

export const SuggestionType = ({ onChange }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    { label: "کیفی", value: suggestionType.QUALITATIVE },
    { label: "کمی", value: suggestionType.QUANTITATIVE },
    { label: "ویژه", value: suggestionType.SPECIAL },
  ];

  return (
    <Form.Item name="suggestion_type" hidden={true}>
      <Input />
    </Form.Item>
  );

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item label="نوع پیشنهاد" name="suggestion_type" rules={rules}>
        <Radio.Group options={options} onChange={onChange} />
      </Form.Item>
    </Col>
  );
};

export const Category = ({ onChange, items }) => {
  const [options, setOptions] = useState([]);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [description, setDescription] = useState();

  const rules = [
    {
      required: true,
    },
  ];

  const handleOptionChange = async (value) => {
    onChange && onChange(value);

    const { data } = await categoryApi._GET_ITEM(value);
    setDescription(data["description"]);
  };

  const DescriptionDialog = () => {
    return (
      <Modal
        title="توضیحات حوزه انتخابی"
        visible={isDescriptionVisible}
        onCancel={() => setIsDescriptionVisible(false)}
      >
        {description}
      </Modal>
    );
  };

  useEffect(() => {
    const listItems = items.map((item) => {
      return { label: item.name, value: item.id };
    });

    setOptions([...listItems, { label: "سایر", value: 0 }]);
    items.length && handleOptionChange(items[0].id);
  }, [items]);

  return (
    <Form.Item hidden={true} name="category">
      <Input />
    </Form.Item>
  );

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item label="حوزه پیشنهاد" name="category" rules={rules}>
        <Select options={options} onChange={handleOptionChange} />
      </Form.Item>
      <Form.Item noStyle={true} shouldUpdate={true}>
        {(form) => {
          return (
            <>
              {form.getFieldValue("category") === 0 && <CustomCategory />}
              {description && (
                <small>
                  <a onClick={() => setIsDescriptionVisible(true)}>
                    توضیحات حوزه انتخاب شده
                  </a>
                </small>
              )}
            </>
          );
        }}
      </Form.Item>
      <DescriptionDialog />
    </Col>
  );
};

export const CustomCategory = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Form.Item label="عنوان حوزه" name={"custom_category"} rules={rules}>
      <Input />
    </Form.Item>
  );
};

export const Committee = ({
  items,
  onChange,
  onButtonClick,
  disabled = false,
}) => {
  let [options, setOptions] = useState([]);
  const rules = [{ required: true }];

  useEffect(() => {
    const listOptions = items.map((item) => {
      return { label: item.name, value: item.id };
    });

    setOptions(listOptions);
  }, [items]);

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item noStyle={true} shouldUpdate={true}>
        {(form) => {
          return (
            <Form.Item
              label="پیشنهاد شما در حوزه تخصصی کدامیک از کارگروه های تخصصی می باشد؟"
              name="workgroup"
              rules={rules}
              className="mr-lg-3"
              style={{ maxWidth: "300px", width: "100%" }}
            >
              <Select
                options={options}
                onChange={onChange}
                disabled={disabled}
              />
            </Form.Item>
          );
        }}
      </Form.Item>
    </Col>
  );
};

export const TheProblem = () => {
  const rules = [];

  return (
    <Col xs={24} xxl={12}>
      <Form.Item
        label="شرح وضعیت موجود"
        name={"the_problem"}
        rules={rules}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        extra="مشکل یا وضعیت فعلی را شرح دهید"
      >
        <Input.TextArea style={{ minHeight: "120px" }} />
      </Form.Item>
    </Col>
  );
};

export const TheIdea = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} xxl={12}>
      <Form.Item
        label="شرح پیشنهاد"
        name={"the_idea"}
        rules={rules}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        extra="  پیشنهاد خود را شرح دهید"
      >
        <Input.TextArea style={{ minHeight: "120px" }} />
      </Form.Item>
    </Col>
  );
};

export const Requirements = () => {
  const rules = [];

  return [
    <Col xs={24} xxl={12}>
      <Form.Item
        label="امکانات مورد نیاز"
        name={"requirements"}
        rules={rules}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        extra="امکانات مورد نیاز جهت پیاده سازی را بنویسید"
      >
        <Input.TextArea style={{ minHeight: "120px" }} />
      </Form.Item>
    </Col>,
    <Col xs={0} xxl={12} />,
  ];
};

export const IsInProcess = () => {
  const options = [
    { label: "بلی", value: 1 },
    { label: "خیر", value: 0 },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item
        label="آیا پیشنهاد شما قبلا توسط جنابعالی در هلدینگ جهاد نصر ارائه و اجرا گردیده است؟"
        name={"is_in_process"}
        // valuePropName="checked"
        // extra="این پیشنهاد قبلا توسط پیشنهاد دهنده ارائه و اجرا شده یا در حال اجرا در واحد مطبوع میباشد"
      >
        <Radio.Group options={options} />

        {/* <Space>
          <Checkbox />
          <span>پیشنهاد در حال اجرا</span>
        </Space> */}
      </Form.Item>
    </Col>
  );
};

export const WantPartnership = () => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    { label: "بلی", value: 1 },
    { label: "خیر", value: null },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item
        label="آیا مایل به مشارکت در اجرای پیشنهاد خود هستید؟"
        name={"want_partnership"}
        // valuePropName="checked"
        // extra="آیا مایل به مشارکت در اجرای پیشنهاد خود هستید؟"
      >
        <Radio.Group options={options} />

        {/* <Space>
          <Checkbox />
          <span>مشارکت در اجرا</span>
        </Space> */}
      </Form.Item>
    </Col>
  );
};

export const DealType = ({ onChange }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    { label: "طبق آیین نامه جهاد نصر", value: dealType.REGULATION },
    { label: "فروش پیشنهاد", value: dealType.SELL },
    { label: "شراکت در منافع", value: dealType.PARTNERSHIP },
  ];

  return (
    <Form.Item
      label="نحوه تعامل در صورت اجرا شدن پیشنهاد"
      name="deal_type"
      hidden={true}
    >
      <Input />
    </Form.Item>
  );

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item
        label="نحوه تعامل در صورت اجرا شدن پیشنهاد"
        name="deal_type"
        rules={rules}
      >
        <Select
          options={options}
          onChange={onChange}
          // style={{ marginTop: "10px" }}
        />
      </Form.Item>
    </Col>
  );
};

export const SuggestionPrice = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Form.Item noStyle={true} shouldUpdate={true}>
      {(form) => {
        return (
          form.getFieldValue("deal_type") === dealType.SELL && (
            <Col xs={24} sm={24} md={24} lg={12} xl={8}>
              <Form.Item
                label="مبلغ فروش پیشنهاد"
                name={"suggestion_price"}
                rules={rules}
                normalize={priceNormalizer}
              >
                <AppNumInput suffix="ریال" />
              </Form.Item>
            </Col>
          )
        );
      }}
    </Form.Item>
  );
};

export const PartnershipPercent = ({ max = 100 }) => {
  const rules = [
    {
      asyncValidator: (rule, value) => {
        return new Promise((resolve, reject) => {
          if (value < 1 || value > max) {
            reject("درصد شراکت باید بین 1 تا " + max + " باشد");
          } else {
            resolve();
          }
        });
      },
    },
    { required: true },
  ];

  return (
    <Form.Item noStyle={true} shouldUpdate={true}>
      {(form) => {
        return (
          form.getFieldValue("deal_type") === dealType.PARTNERSHIP && (
            <Col xs={24} sm={24} md={24} lg={12} xl={8}>
              <Form.Item
                label="درصد شراکت در منافع"
                name={"partnership_percent"}
                rules={rules}
                extra={" حداکثر" + max + " درصد"}
                normalize={numberNormalize}
              >
                <Input suffix="%" />
              </Form.Item>
            </Col>
          )
        );
      }}
    </Form.Item>
  );
};

export const PartnershipPeriod = ({ max = 5 }) => {
  const rules = [
    {
      asyncValidator: (rule, value) => {
        return new Promise((resolve, reject) => {
          if (value < 1 || value > max) {
            reject("مدت شراکت باید بین 1 تا " + max + " باشد");
          } else {
            resolve();
          }
        });
      },
    },
    { required: true },
  ];

  return (
    <Form.Item noStyle={true} shouldUpdate={true}>
      {(form) => {
        return (
          form.getFieldValue("deal_type") === dealType.PARTNERSHIP && (
            <Col xs={24} sm={24} md={24} lg={12} xl={8}>
              <Form.Item
                label="مدت شراکت در منافع"
                name={"partnership_period"}
                rules={rules}
                extra={" حداکثر" + max + " سال"}
                normalize={numberNormalize}
              >
                <Input suffix="سال" />
              </Form.Item>
            </Col>
          )
        );
      }}
    </Form.Item>
  );
};

const DisAdv = ({
  form,
  dispatch,
  state,
  name,
  title,
  sectionTitle,
  disabledItems = [],
}) => {
  const removeItem = (fieldName, handler) => {
    const id = form.getFieldValue(name)[fieldName]?.id;

    if (id > 0)
      dispatch({
        type: "ADVANTAGE/LOG_DELETE",
        payload: id,
      });

    handler(fieldName);
  };

  return (
    <Col span={24}>
      <Divider orientation="right">{sectionTitle}</Divider>
      <Form.List name={name}>
        {(fields, { add, remove }, { errors }) => (
          <>
            <Row gutter={[32, 16]}>
              {fields.map((field, index) => (
                <Col key={field.key} xs={24} md={12}>
                  <Form.Item
                    fieldKey={[field.fieldKey, "comment"]}
                    noStyle={true}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Form.Item
                        {...field}
                        name={[field.name, "comment"]}
                        fieldKey={[field.fieldKey, "comment"]}
                        noStyle={true}
                        style={{ flexGrow: "1" }}
                      >
                        <Input.TextArea
                          placeholder={title + " را در اینجا بنویسید..."}
                          maxLength={200}
                          allowClear={true}
                          disabled={disabledItems.includes(
                            form.getFieldValue(name)[field.name]?.id
                          )}
                        />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "id"]}
                        hidden={true}
                      >
                        <Input defaultValue={-1} />
                      </Form.Item>
                      <MinusCircleOutlined
                        onClick={() => removeItem(field.name, remove)}
                        style={{ flexGrow: "0", marginRight: "12px" }}
                      />
                    </div>
                  </Form.Item>
                </Col>
              ))}
            </Row>
            <Row>
              <Col xs={24} md={6}>
                <Button
                  onClick={() => add()}
                  type="dashed"
                  block={true}
                  icon={<PlusOutlined />}
                  className="mt-3"
                >
                  افزودن
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Form.List>
    </Col>
  );
};

export const Advantages = (props) => {
  return (
    <DisAdv
      name={"advantages"}
      sectionTitle="طرح مزایای پیشنهاد"
      title="مزیت"
      {...props}
    />
  );
};

export const Disadvantages = (props) => {
  return (
    <DisAdv
      name={"disadvantages"}
      sectionTitle="طرح معایب پیشنهاد"
      title="عیب"
      {...props}
    />
  );
};

export const UploadDocs = () => {
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }

    if (e.fileList.length > 1) {
      e.fileList.shift();
    }

    return e && e.fileList;
  };

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item
        label="اسناد پیوست"
        name={"survey_file"}
        valuePropName="fileList"
        getValueFromEvent={normFile}
        extra="جهت درج چند فایل، آنها را در قالب یک فایل zip ارسال نمایید"
      >
        <Upload beforeUpload={(file) => false}>
          <Button icon={<UploadOutlined />} block={false}>
            انتخاب فایل
          </Button>
        </Upload>
      </Form.Item>
    </Col>
  );
};

export const AcceptRules = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
      <Form.Item>
        <Space>
          <Form.Item name="accept_rules" valuePropName="checked" noStyle>
            <Checkbox />
          </Form.Item>
          <p>قوانین نظام پیشنهادات هلدینگ جهاد نصر کرمان را می‌پذیرم</p>
        </Space>
        <a href="#" style={{ marginRight: "23px", display: "block" }}>
          مشاهده قوانین
        </a>
      </Form.Item>
    </Col>
  );
};
