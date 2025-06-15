import React, { useEffect, useContext } from "react";
import {
  Checkbox,
  Col,
  Form,
  TimePicker,
  Radio,
  Input,
  Select,
  Button,
  Row,
  message,
  Divider,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  accidentType,
  accidentLocation,
  injuries,
  injuryType,
  accidentPersonReason,
  relationWithOffice,
  reason,
  consequences,
  pollution,
  probableReason,
} from "../const";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import {
  checkShamsi,
  countOfNumInp,
  pictureValidation,
  numberNormalize,
  mobileNumberValidation,
} from "_helpers";
import * as accidentReportConst from "../const";
import { useGetUserInfo, useGetMachineInfo } from "../utils/hooks";
import AppButton from "components/general/AppButton";
import { NationalIdInput } from "modules/personnel/realPerson/service/formItems";
import PeriodTime from "components/PeriodTime";
import { formColSpan } from "../../../../constant";
import { useSelector } from "react-redux";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  if (e.fileList.length > 1) {
    e.fileList.shift();
  }

  return e && e.fileList;
};

// check for national id if checked show inputs
const checkUserId = (listName, from, index) => {
  let data = from.getFieldValue([listName, index, "id"]);
  if (data) {
    return true;
  }
  return false;
};

const CheckShowPersonal = ({ listName, children, index }) => {
  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        return checkUserId(listName, form, index) && children;
      }}
    </Form.Item>
  );
};

const checkRepetitiousNationalId = (list, nationalId) => {
  let res = list.filter((el) => el.national_id === nationalId);
  if (res.length > 1) {
    return false;
  } else {
    return true;
  }
};

// check for machine id if checked show inputs
const checkMachineId = (from, index) => {
  let data = from.getFieldValue(["vehicles", index, "id"]);
  if (data) {
    return true;
  }
  return false;
};

const CheckShowVehicles = ({ children, index }) => {
  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        return checkMachineId(form, index) && children;
      }}
    </Form.Item>
  );
};

const Reporter = ({
  useForm,
  setPerson,
  defaultValue = false,
  edit = false,
  button = true,
}) => {
  return (
    <NationalIdInput
      type={edit ? "edit" : "send"}
      codeField="person_personnel_id"
      nameField="reporter"
      name="person_national_code"
      label="گزارش دهنده"
      url="/api/admin/personnel/lookup"
      form={useForm}
      setData={setPerson}
      isRequired={true}
      defaultValue={defaultValue}
      disabled={button}
    />
  );
};

const Executer = ({
  useForm,
  setPerson,
  defaultValue = false,
  edit = false,
  button = true,
}) => {
  return (
    <NationalIdInput
      type={edit ? "edit" : "send"}
      codeField="executer_personnel_id"
      nameField="executer"
      name="executer_national_code"
      label="مجري اقدام اصلاحي "
      url="/api/admin/personnel/lookup"
      form={useForm}
      setData={setPerson}
      isRequired={true}
      defaultValue={defaultValue}
    />
  );
};

const Deadline = ({ useForm }) => {
  useEffect(() => {
    (async () => {
      useForm.setFieldsValue({
        d_year: 0,
        d_month: 0,
        d_day: 0,
      });
    })();
  }, []);

  const handleDurationChange = (i) => {
    const values = useForm.getFieldsValue();
    const days =
      Number((values.d_year ?? 0) * 365) +
      Number((values.d_month ?? 0) * 30) +
      Number(values.d_day ?? 0);

    useForm.setFieldsValue({
      duration: days,
    });
  };

  const requiredRule = [
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (getFieldValue("duration") && getFieldValue("duration") > 0) {
          return Promise.resolve();
        } else {
          return Promise.reject("تعیین مدت ضروری است");
        }
      },
    }),
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="مهلت اقدام اصلاحی"
        name={"duration"}
        rules={requiredRule}
        normalize={numberNormalize}
      >
        <PeriodTime
          year="d_year"
          month="d_month"
          day="d_day"
          required={false}
          onChange={handleDurationChange}
          plain={true}
          useForm={useForm}
        />
      </Form.Item>
    </Col>
  );
};

const CorrectiveAction = ({ detail }) => {
  const rules = [{ required: false }];
  return (
    <Col {...formColSpan}>
      <Form.Item label="اقدام اصلاحی" name="action" rules={rules}>
        <Input disabled={detail} />
      </Form.Item>
    </Col>
  );
};

const AccidentType = ({ detail }) => {
  const rules = [{ required: true }];

  const options = [
    { label: accidentType.INJURY, value: accidentType.INJURY },
    { label: accidentType.FINANCIAL, value: accidentType.FINANCIAL },
    { label: accidentType.DEATH, value: accidentType.DEATH },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item
        label="نوع حادثه - دسته بندی اول"
        name="type"
        rules={rules}
        shouldUpdate
      >
        <Checkbox.Group options={options} disabled={detail} />
      </Form.Item>
    </Col>
  );
};

const Reason = ({ detail }) => {
  const options = [
    { label: reason.ACCIDENT, value: reason.ACCIDENT },
    { label: reason.FALLING_FROM_HEIGHT, value: reason.FALLING_FROM_HEIGHT },
    { label: reason.FALLING_OBJECT, value: reason.FALLING_OBJECT },
    { label: reason.DEBRIS_FALLING, value: reason.DEBRIS_FALLING },
    { label: reason.WORK_WITH_TOOLS, value: reason.WORK_WITH_TOOLS },
    { label: reason.ELECTROCUTION, value: reason.ELECTROCUTION },
    { label: reason.EXPLOSION, value: reason.EXPLOSION },
    { label: reason.INCLUDE_BODY, value: reason.INCLUDE_BODY },
    { label: reason.FIRE, value: reason.FIRE },
    { label: reason.COLLIDE_BODY, value: reason.COLLIDE_BODY },
    { label: reason.COLLIDE_FIRE_HOT, value: reason.COLLIDE_FIRE_HOT },
    { label: reason.PLACEMENT_OBJECT, value: reason.PLACEMENT_OBJECT },
    { label: reason.COLLISION_OBJECT, value: reason.COLLISION_OBJECT },
    { label: reason.CONFLICT, value: reason.CONFLICT },
  ];

  return (
    <Col xs={24} sm={24} md={12} lg={24} xl={18}>
      <Form.Item
        name={"reason"}
        label="نوع حادثه - دسته بندی دوم"
        rules={[{ required: true }]}
      >
        <Checkbox.Group>
          <Row gutter={(8, 16)}>
            {options.map((el, i) => (
              <Col xs={24} sm={12} lg={8}>
                <Checkbox value={el.value} disabled={detail}>
                  {el.label}
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Form.Item>
    </Col>
  );
};

const Consequences = ({ detail }) => {
  const options = [
    { label: consequences.DAMAGE_TO_LIFE, value: consequences.DAMAGE_TO_LIFE },
    {
      label: consequences.DAMAGE_TO_MACHINE,
      value: consequences.DAMAGE_TO_MACHINE,
    },
    {
      label: consequences.DAMAGE_TO_FACILITIES,
      value: consequences.DAMAGE_TO_FACILITIES,
    },
    {
      label: consequences.ENVIRONMENTAL_POLLUTION,
      value: consequences.ENVIRONMENTAL_POLLUTION,
    },
  ];

  return (
    <Col xs={24} sm={24} md={12} lg={18} xl={18}>
      <Form.Item
        name={"consequences"}
        label="پیامدهای اولیه"
        rules={[{ required: false }]}
      >
        <Checkbox.Group>
          <Row gutter={(8, 16)}>
            {options.map((el, i) => (
              <Col xs={24} sm={6}>
                <Checkbox value={el.value} disabled={detail}>
                  {el.label}
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Form.Item>
    </Col>
  );
};

const Pollution = ({ detail }) => {
  const options = [
    { label: pollution.WATER, value: pollution.WATER },
    { label: pollution.AIR, value: pollution.AIR },
    { label: pollution.SAND, value: pollution.SAND },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item noStyle shouldUpdate>
        {(form) => {
          return form
            .getFieldValue("consequences")
            ?.includes(consequences.ENVIRONMENTAL_POLLUTION) ? (
            <Form.Item
              name={"pollution"}
              label="نوع آلودگی"
              rules={[{ required: true }]}
            >
              <Checkbox.Group>
                {options.map((el, i) => (
                  <Checkbox value={el.value} disabled={detail}>
                    {el.label}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>
          ) : null;
        }}
      </Form.Item>
    </Col>
  );
};

const ProbableReason = ({ detail }) => {
  const options = [
    { label: probableReason.TECHNICAL, value: probableReason.TECHNICAL },
    { label: probableReason.UNSAFE, value: probableReason.UNSAFE },
    { label: probableReason.BAD_DESIGN, value: probableReason.BAD_DESIGN },
    { label: probableReason.HUMAN, value: probableReason.HUMAN },
    { label: probableReason.PPE, value: probableReason.PPE },
    { label: probableReason.INSTRUCTIONS, value: probableReason.INSTRUCTIONS },
    { label: probableReason.NATURAL, value: probableReason.NATURAL },
    { label: probableReason.EDU, value: probableReason.EDU },
    { label: probableReason.OTHER, value: probableReason.OTHER },
  ];

  return (
    <Col xs={24} sm={24} md={12} lg={18}>
      <Form.Item
        name={"probable_reason"}
        label="علل احتمالی"
        rules={[{ required: true }]}
      >
        <Checkbox.Group>
          <Row gutter={(8, 16)}>
            {options.map((el, i) => (
              <Col xs={24} sm={6}>
                <Checkbox value={el.value} disabled={detail}>
                  {el.label}
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Form.Item>
    </Col>
  );
};

const ProbableReasonOther = ({ detail }) => {
  const rules = [{ required: true }];
  return (
    <Col xs={24} sm={24} md={12} lg={6}>
      <Form.Item noStyle shouldUpdate>
        {(form) => {
          return form
            .getFieldValue("probable_reason")
            ?.includes(probableReason.OTHER) ? (
            <Form.Item
              label="سایر علل احتمالی"
              name="probable_reason_other"
              rules={rules}
            >
              <Input disabled={detail} />
            </Form.Item>
          ) : null;
        }}
      </Form.Item>
    </Col>
  );
};

const AccidentPicture = ({ detail }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        name="accident_picture"
        label="عکس های حادثه"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[pictureValidation(9000)]}
      >
        <Upload
          maxCount={1}
          beforeUpload={(file) => {
            return false;
          }}
          accept=".jpg , .png , .zip , .rar"
        >
          <Button>
            <UploadOutlined /> انتخاب فایل
          </Button>
        </Upload>
      </Form.Item>
    </Col>
  );
};

const Date = ({ useForm, detail }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ حادثه اجباری است",
    },
    () => ({
      validator(rule, value) {
        if (!value || checkShamsi(value, false)) {
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
      label="تاریخ وقوع حادثه"
      name="date"
      rules={rules}
      disabled={detail}
    />
  );
};

const Time = ({ detail }) => {
  const rules = [{ required: true }];
  const format = "HH:mm";
  return (
    <Col {...formColSpan}>
      <Form.Item label="زمان حادثه" name="time" rules={rules}>
        <TimePicker format={format} disabled={detail} />
      </Form.Item>
    </Col>
  );
};

const locationType = ({ detail }) => {
  const rules = [{ required: true }];

  const option = [
    { label: accidentLocation.IN_PROJECT, value: accidentLocation.IN_PROJECT },
    {
      label: accidentLocation.OUT_OF_PROJECT,
      value: accidentLocation.OUT_OF_PROJECT,
    },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="محل حادثه"
        name="location"
        rules={rules}
        initialValue={0}
      >
        <Radio.Group options={option} disabled={detail} />
      </Form.Item>
    </Col>
  );
};

const locationText = ({ detail }) => {
  const rules = [{ required: true }];
  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        return form.getFieldValue("location") ===
          accidentLocation.OUT_OF_PROJECT ? (
          <Col {...formColSpan}>
            <Form.Item label="نام محل حادثه" name="address" rules={rules}>
              <Input disabled={detail} />
            </Form.Item>
          </Col>
        ) : null;
      }}
    </Form.Item>
  );
};

const NationalID = ({ detail }) => {
  return (
    <Col xs={18} sm={18} md={18} lg={6} xl={6}>
      <Form.Item label="کد ملی" name="national_id">
        <Input disabled={detail} />
      </Form.Item>
    </Col>
  );
};

const ContractID = ({ useForm, detail }) => {
  const currentOffice = useSelector((state) => state.currentOffice);
  const contractList = useSelector((state) => state.contractList);

  useEffect(() => {
    useForm.setFieldsValue({ contract_id: null });
  }, [currentOffice]);

  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        return form.getFieldValue("location") ===
          accidentLocation.IN_PROJECT ? (
          <Col {...formColSpan}>
            <Form.Item label="پروژه محل حادثه" name="project_id" rules={rules}>
              <Select disabled={detail}>
                {contractList.map((el) => (
                  <Select.Option
                    key={el.contract_id}
                    value={el.contract_id}
                    title={el.subject}
                  >
                    {el.subject}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        ) : null;
      }}
    </Form.Item>
  );
};

const ReasonOther = ({ detail }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="سایر علت حادثه" name="reason_other">
        <Input.TextArea disabled={detail} />
      </Form.Item>
    </Col>
  );
};

const AccidentReason = ({ detail }) => {
  const rules = [{ required: true }];
  const { accidentReason } = accidentReportConst;

  const options = [
    {
      label: accidentReason.CAR_TECHNICAL_DEFECT,
      value: accidentReason.CAR_TECHNICAL_DEFECT,
    },
    { label: accidentReason.NO_DISTANCE, value: accidentReason.NO_DISTANCE },
    {
      label: accidentReason.ILLEGAL_OVERTAKING,
      value: accidentReason.ILLEGAL_OVERTAKING,
    },
    {
      label: accidentReason.UNAUTHORIZED_SPEED,
      value: accidentReason.UNAUTHORIZED_SPEED,
    },
    {
      label: accidentReason.NO_ATTENTION_FRONT,
      value: accidentReason.NO_ATTENTION_FRONT,
    },
    {
      label: accidentReason.DRIVER_DROWSINESS,
      value: accidentReason.DRIVER_DROWSINESS,
    },
    {
      label: accidentReason.TECHNICAL_PROBLEM,
      value: accidentReason.TECHNICAL_PROBLEM,
    },
    { label: accidentReason.CARELESSNESS, value: accidentReason.CARELESSNESS },
  ];

  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        let reasonCheckBox = form.getFieldValue("reason");
        if (reasonCheckBox && reasonCheckBox.indexOf(reason.ACCIDENT) > -1) {
          return (
            <Col {...formColSpan} xl={24}>
              <Form.Item label="علت تصادف" name="accident_reason" rules={rules}>
                <Checkbox.Group>
                  <Row gutter={(8, 16)}>
                    {options.map((el, i) => (
                      <Col key={i} xs={24} sm={12} md={12} lg={12} xl={6}>
                        <Checkbox value={el.value} disabled={detail}>
                          {el.label}
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Col>
          );
        }
      }}
    </Form.Item>
  );
};

const Description = ({ detail }) => {
  const rules = [{ required: true, message: "شرح واقعه اجباری است" }];
  return (
    <Col {...formColSpan}>
      <Form.Item label="شرح واقعه" name="description" rules={rules}>
        <Input.TextArea disabled={detail} />
      </Form.Item>
    </Col>
  );
};

const TherapeuticMeasures = ({ detail }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="اقدامات درمانی انجام شده" name="medicine">
        <Input.TextArea disabled={detail} />
      </Form.Item>
    </Col>
  );
};

const AddDynamicForm = ({ add }) => {
  return (
    <Col xs={6} sm={6} md={6} lg={3} xl={3}>
      <Form.Item>
        <Button type="dashed" onClick={() => add()}>
          افزودن
        </Button>
      </Form.Item>
    </Col>
  );
};

const RemoveAccidentSeen = ({ filedName, remove }) => (
  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
    <Form.Item>
      <Button
        type="danger"
        className="dynamic-delete-button"
        onClick={() => remove(filedName)}
      >
        حذف ایتم
      </Button>
    </Form.Item>
  </Col>
);

const Injury = ({ listName, index, field, detail }) => {
  const options = [
    { label: injuries.ABDOMINAL, value: injuries.ABDOMINAL },
    { label: injuries.FACE, value: injuries.FACE },
    { label: injuries.FINGERS, value: injuries.FINGERS },
    { label: injuries.HEAD, value: injuries.HEAD },
    { label: injuries.HAND, value: injuries.HAND },
    { label: injuries.LEG, value: injuries.LEG },
    { label: injuries.TOOTH, value: injuries.TOOTH },
    { label: injuries.WAIST, value: injuries.WAIST },
    { label: injuries.NECK, value: injuries.NECK },
  ];

  return (
    <CheckShowPersonal listName={listName} index={index}>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          {...field}
          fieldKey={[field.fieldKey, "injury"]}
          name={[field.name, "injury"]}
          label="صدمات"
          rules={[{ required: true }]}
        >
          <Checkbox.Group>
            <Row>
              {options.map((el, i) => (
                <Col key={i} xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Checkbox value={el.value} disabled={detail}>
                    {el.label}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>
      </Col>
    </CheckShowPersonal>
  );
};

const InjuryOther = ({ listName, field, index, detail }) => {
  return (
    <CheckShowPersonal listName={listName} index={index}>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          label="سایر صدمات"
          {...field}
          fieldKey={[field.fieldKey, "injury_other"]}
          name={[field.name, "injury_other"]}
        >
          <Input.TextArea disabled={detail} />
        </Form.Item>
      </Col>
    </CheckShowPersonal>
  );
};

const InjuryType = ({ listName, index, field, detail }) => {
  const options = [
    { label: injuryType.AMPUTATION, value: injuryType.AMPUTATION },
    { label: injuryType.BRUISING, value: injuryType.BRUISING },
    { label: injuryType.FRACTURE, value: injuryType.FRACTURE },
    { label: injuryType.CONTUSION, value: injuryType.CONTUSION },
    { label: injuryType.PRESS, value: injuryType.PRESS },
    { label: injuryType.RUPTURE, value: injuryType.RUPTURE },
    { label: injuryType.BLEEDING, value: injuryType.BLEEDING },
    { label: injuryType.DEATH, value: injuryType.DEATH },
    { label: injuryType.FIRE, value: injuryType.FIRE },
    { label: injuryType.WOUND, value: injuryType.WOUND },
    { label: injuryType.EYE, value: injuryType.EYE },
    { label: injuryType.ELECTERICAL, value: injuryType.ELECTERICAL },
  ];

  return (
    <CheckShowPersonal listName={listName} index={index}>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          {...field}
          name={[field.name, "injury_type"]}
          fieldKey={[field.fieldKey, "injury_type"]}
          label="پیامدها"
          rules={[{ required: true }]}
        >
          <Checkbox.Group>
            <Row>
              {options.map((el, i) => (
                <Col key={i} xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Checkbox value={el.value} disabled={detail}>
                    {el.label}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>
      </Col>
    </CheckShowPersonal>
  );
};

const InjuryTypeOther = ({ listName, field, index, detail }) => {
  return (
    <CheckShowPersonal listName={listName} index={index}>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          label="سایر پیامدها"
          {...field}
          fieldKey={[field.fieldKey, "injury_type_other"]}
          name={[field.name, "injury_type_other"]}
        >
          <Input.TextArea disabled={detail} />
        </Form.Item>
      </Col>
    </CheckShowPersonal>
  );
};

const Relation = ({ listName, index, field, detail }) => {
  const options = [
    {
      label: relationWithOffice.PERSONNEL,
      value: relationWithOffice.PERSONNEL,
    },
    {
      label: relationWithOffice.CONTRACTOR_PERSONNEL,
      value: relationWithOffice.CONTRACTOR_PERSONNEL,
    },
    { label: relationWithOffice.EMPLOYER, value: relationWithOffice.EMPLOYER },
    {
      label: relationWithOffice.CONTRACTOR,
      value: relationWithOffice.CONTRACTOR,
    },
    {
      label: relationWithOffice.THIRD_PERSON,
      value: relationWithOffice.THIRD_PERSON,
    },
  ];

  return (
    <CheckShowPersonal listName={listName} index={index}>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          {...field}
          fieldKey={[field.fieldKey, "relation"]}
          name={[field.name, "relation"]}
          label="رابطه با شرکت"
          rules={[{ required: true }]}
        >
          <Select options={options} disabled={detail} />
        </Form.Item>
      </Col>
    </CheckShowPersonal>
  );
};

const PersonnelReason = ({ listName, index, field, detail }) => {
  const rules = [{ required: true }];

  const option = [
    {
      label: accidentPersonReason.IN_WORK,
      value: accidentPersonReason.IN_WORK,
    },
    {
      label: accidentPersonReason.OUT_WORK,
      value: accidentPersonReason.OUT_WORK,
    },
  ];
  return (
    <CheckShowPersonal listName={listName} index={index}>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          label="علت حادثه"
          {...field}
          fieldKey={[field.fieldKey, "person_reason"]}
          name={[field.name, "person_reason"]}
          rules={rules}
        >
          <Radio.Group
            defaultValue={option[0].value}
            options={option}
            disabled={detail}
          />
        </Form.Item>
      </Col>
    </CheckShowPersonal>
  );
};

const UserId = ({ index, field }) => {
  return (
    <Form.Item
      hidden
      {...field}
      fieldKey={[field.fieldKey, "id"]}
      name={[field.name, "id"]}
    >
      <Input />
    </Form.Item>
  );
};

const UserFullName = ({ listName, index, field }) => {
  return (
    <CheckShowPersonal listName={listName} index={index}>
      <Col {...formColSpan}>
        <Form.Item
          {...field}
          fieldKey={[field.fieldKey, "fullName"]}
          name={[field.name, "fullName"]}
          label="نام"
        >
          <Input disabled />
        </Form.Item>
      </Col>
    </CheckShowPersonal>
  );
};

const NationalId = ({ listName, index, field, useForm, detail }) => {
  const { getUserInfo, userInfo, loading, errorMsg } = useGetUserInfo();

  useEffect(() => {
    if (userInfo) {
      let userId = userInfo.data.id;
      let userFullName =
        userInfo.data.first_name + " " + userInfo.data.last_name;
      useForm.setFields([
        {
          name: [listName, index, "id"],
          value: userId,
        },
        {
          name: [listName, index, "fullName"],
          value: userFullName,
        },
      ]);
    }
  }, [userInfo]);

  useEffect(() => {
    if (errorMsg) {
      message.error(errorMsg);
      useForm.setFields([
        {
          name: [listName, index, "national_id"],
          value: "",
          errors: ["کد ملی نامعتبر"],
        },
      ]);
    }
  }, [errorMsg]);

  const handleOnClick = () => {
    let personnel = useForm.getFieldValue(listName);
    let value = useForm.getFieldValue([listName, index, "national_id"]);
    if (value) {
      let error = useForm.getFieldError([listName, index, "national_id"]);
      if (error.length === 0 && checkRepetitiousNationalId(personnel, value)) {
        // check Repetitious nationalId
        // check national Id
        getUserInfo(value);
      }
    }
  };

  const handleOnChange = (e) => {
    if (e.target.value.length === 10) {
      handleOnClick();
    }
  };

  const rules = [
    { required: true, message: "کد ملی اجباری است" },
    { len: 10, message: "کد ملی اشتباه است" },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item style={{ marginBottom: "0" }} label="کدملی">
        <Row>
          <Col span={18}>
            <Form.Item
              normalize={(value, prevValue) =>
                countOfNumInp(value, prevValue, 10)
              }
              rules={rules}
              {...field}
              fieldKey={[field.fieldKey, "national_id"]}
              name={[field.name, "national_id"]}
              // label="کد ملی"
            >
              <Input disabled={detail} onChange={handleOnChange} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <AppButton
              size="large"
              disabled={detail}
              block
              onClick={handleOnClick}
              loading={loading}
            >
              بررسی
            </AppButton>
          </Col>
        </Row>
      </Form.Item>
    </Col>
  );
};

const MobileIntuition = ({ listName, index, field }) => {
  const rules = [
    { required: true },
    {
      len: 11,
    },
  ];
  return (
    <CheckShowPersonal listName={listName} index={index}>
      <Col {...formColSpan}>
        <Form.Item
          {...field}
          fieldKey={[field.fieldKey, "mobile"]}
          name={[field.name, "mobile"]}
          label="شماره موبایل"
          validateFirst
          normalize={(value) => mobileNumberValidation(value)}
          rules={rules}
        >
          <Input placeholder="09XXXXXXXXX بصورت" />
        </Form.Item>
      </Col>
    </CheckShowPersonal>
  );
};

const Intuition = ({ useForm, detail }) => {
  return (
    <>
      <Divider orientation="right">مشخصات شهود</Divider>
      <Form.List name="intuition">
        {(fields, { add, remove }) => {
          return (
            <>
              {fields.map((field, index) => (
                <React.Fragment key={index}>
                  <UserId index={index} field={field} />
                  <NationalId
                    listName="intuition"
                    index={index}
                    field={field}
                    useForm={useForm}
                    detail={detail}
                  />
                  <UserFullName
                    listName="intuition"
                    index={index}
                    field={field}
                  />
                  <MobileIntuition
                    listName="intuition"
                    index={index}
                    field={field}
                  />

                  {fields.length >= 1 && !detail ? (
                    <RemoveAccidentSeen
                      filedName={field.name}
                      remove={remove}
                    />
                  ) : null}
                </React.Fragment>
              ))}
              {!detail && <AddDynamicForm add={add} />}
            </>
          );
        }}
      </Form.List>
    </>
  );
};

const Personnel = ({ useForm, detail }) => {
  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        return form
          .getFieldValue("consequences")
          ?.includes(consequences.DAMAGE_TO_LIFE) ? (
          <>
            <Divider orientation="right">مشخصات حادثه دیدگان</Divider>
            <Form.List name="personnel">
              {(fields, { add, remove }) => {
                return (
                  <>
                    {fields.map((field, index) => (
                      <React.Fragment key={index}>
                        <UserId index={index} field={field} />
                        <NationalId
                          listName="personnel"
                          index={index}
                          field={field}
                          useForm={useForm}
                          detail={detail}
                        />
                        <UserFullName
                          listName="personnel"
                          index={index}
                          field={field}
                        />
                        <Injury
                          listName="personnel"
                          index={index}
                          field={field}
                          detail={detail}
                        />
                        <InjuryOther
                          listName="personnel"
                          index={index}
                          field={field}
                          detail={detail}
                        />
                        <Relation
                          listName="personnel"
                          index={index}
                          field={field}
                          detail={detail}
                        />
                        <PersonnelReason
                          listName="personnel"
                          index={index}
                          field={field}
                          detail={detail}
                        />
                        <InjuryType
                          listName="personnel"
                          index={index}
                          field={field}
                          detail={detail}
                        />
                        <InjuryTypeOther
                          listName="personnel"
                          index={index}
                          field={field}
                          detail={detail}
                        />
                        {fields.length >= 1 && !detail ? (
                          <RemoveAccidentSeen
                            filedName={field.name}
                            remove={remove}
                          />
                        ) : null}
                      </React.Fragment>
                    ))}
                    {!detail && <AddDynamicForm add={add} />}
                  </>
                );
              }}
            </Form.List>
          </>
        ) : null;
      }}
    </Form.Item>
  );
};

const Damage = ({ index, field, detail }) => {
  const rules = [{ required: true, message: "صدمات اجباری میباشد" }];
  return (
    <CheckShowVehicles index={index}>
      <Col {...formColSpan}>
        <Form.Item
          label="صدمات"
          rules={rules}
          fieldKey={[field.fieldKey, "damage"]}
          name={[field.name, "damage"]}
        >
          <Input.TextArea disabled={detail} />
        </Form.Item>
      </Col>
    </CheckShowVehicles>
  );
};

const MachineId = ({ index, field }) => {
  return (
    <Form.Item
      hidden
      {...field}
      fieldKey={[field.fieldKey, "id"]}
      name={[field.name, "id"]}
    >
      <Input />
    </Form.Item>
  );
};

const MachineSystem = ({ index, field }) => {
  return (
    <CheckShowVehicles index={index}>
      <Col {...formColSpan}>
        <Form.Item
          {...field}
          fieldKey={[field.fieldKey, "system"]}
          name={[field.name, "system"]}
          label={"سیستم"}
        >
          <Input disabled />
        </Form.Item>
      </Col>
    </CheckShowVehicles>
  );
};

const MachineCode = ({ index, field, useForm, detail }) => {
  const {
    loading,
    errorMsg,
    machineInfo,
    getMachineInfo,
  } = useGetMachineInfo();

  const rules = [{ required: true, message: "کد ماشین اجباری است" }];

  useEffect(() => {
    if (machineInfo) {
      let machineId = machineInfo.data.id;

      useForm.setFields([
        {
          name: ["vehicles", index, "id"],
          value: machineId,
        },
        {
          name: ["vehicles", index, "system"],
          value: machineInfo.data.system,
        },
      ]);
    }
  }, [machineInfo]);

  useEffect(() => {
    if (errorMsg) {
      message.error(errorMsg);
      useForm.setFields([
        {
          name: ["vehicles", index, "machine_code"],
          value: "",
          errors: ["کد ماشین نامعتبر است"],
        },
      ]);
    }
  }, [errorMsg]);

  const handleOnClick = () => {
    let value = useForm.getFieldValue(["vehicles", index, "machine_code"]);
    if (value) {
      let error = useForm.getFieldError(["vehicles", index, "machine_code"]);
      if (error.length === 0) {
        // check machine code
        getMachineInfo(value);
      }
    }
  };

  return (
    <Col {...formColSpan}>
      <Form.Item style={{ marginBottom: "0" }} label="کد ماشین">
        <Row>
          <Col span={18}>
            <Form.Item
              rules={rules}
              {...field}
              fieldKey={[field.fieldKey, "machine_code"]}
              name={[field.name, "machine_code"]}
            >
              <Input disabled={detail} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <AppButton
              size="large"
              block
              onClick={handleOnClick}
              loading={loading}
              disabled={detail}
            >
              بررسی
            </AppButton>
          </Col>
        </Row>
      </Form.Item>
    </Col>
  );
};

const Vehicles = ({ useForm, detail }) => {
  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        return form
          .getFieldValue("consequences")
          ?.includes(consequences.DAMAGE_TO_MACHINE) ? (
          <>
            <Divider orientation="right">مشخصات ماشین آلات حادثه دیده</Divider>
            <Form.List name="vehicles">
              {(fields, { add, remove }) => {
                return (
                  <>
                    {fields.map((field, index) => (
                      <React.Fragment key={index}>
                        <MachineId index={index} field={field} />
                        <MachineCode
                          index={index}
                          field={field}
                          useForm={useForm}
                          detail={detail}
                        />
                        <MachineSystem index={index} field={field} />
                        <Damage index={index} field={field} detail={detail} />
                        {fields.length >= 1 && !detail ? (
                          <RemoveAccidentSeen
                            filedName={field.name}
                            remove={remove}
                          />
                        ) : null}
                      </React.Fragment>
                    ))}

                    {!detail && <AddDynamicForm add={add} />}
                  </>
                );
              }}
            </Form.List>
          </>
        ) : null;
      }}
    </Form.Item>
  );
};

export {
  Reporter,
  Executer,
  Deadline,
  CorrectiveAction,
  AccidentType,
  Date,
  Time,
  locationType,
  locationText,
  ContractID,
  Description,
  TherapeuticMeasures,
  Reason,
  ProbableReason,
  ProbableReasonOther,
  AccidentPicture,
  AccidentReason,
  Consequences,
  Pollution,
  NationalID,
  Intuition,
  Vehicles,
  Personnel,
  ReasonOther,
};
