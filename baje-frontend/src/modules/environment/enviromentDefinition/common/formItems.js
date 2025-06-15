import {
  Col,
  Form,
  Input,
  Select,
  Checkbox,
  message,
  Row,
  Button,
  Radio,
  Spin,
} from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment-jalaali";
import { checkShamsi, convertDateToEN, covetFormatDateToEn } from "_helpers";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import AppFormItem from "components/general/AppFormItem";
import { getEnvironmentUsageList } from "modules/environment/common/api";
import { _GET } from "../utils/api";
import { useParams } from "react-router-dom";

const Name = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem label="نام محیط" name="title" required>
        <Input />
      </AppFormItem>
    </Col>
  );
};

const Type = ({ onChange }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    { label: "ساختمان", value: "building" },
    { label: "محوطه باز", value: "outdoorArea" },
    { label: "محوطه سرپوشیده", value: "indoorArea" },
    { label: "کانکس", value: "conex" },
    { label: "طبقه", value: "floor" },
    { label: "واحد", value: "unit" },
    { label: "سالن", value: "hall" },
    { label: "اتاق", value: "room" },
    { label: "مخزن", value: "storage" },
    { label: "راه پله", value: "staircase" },
    { label: "مجازی", value: "virtual" },
    { label: "غیره", value: "others" },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem label="نوع محیط" name="type" rules={rules} required>
        <Select options={options} onChange={onChange}></Select>
      </AppFormItem>
    </Col>
  );
};

const Usage = ({
  defaultValue = false,
  disabled = false,
  usageMode,
  setUsageMode,
}) => {
  const [usagesList, setUsagesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const rules = [{ required: true }];

  const onRadioChange = (e) => {
    setUsageMode(e.target.value);
  };

  useEffect(() => {
    setLoading(true);
    getEnvironmentUsageList()
      .then((res) => {
        setLoading(false);
        const data = res?.data;
        if (data && data.length) {
          const enabledUsages = data.filter((i) => i?.isEnable == 1);
          setUsagesList(enabledUsages);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("fetching usages error:", err);
      });
  }, []);

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Spin spinning={loading}>
        <label className="ant-form-item-no-colon d-block required-label">
          کاربری محیط
        </label>
        <Radio.Group
          onChange={onRadioChange}
          value={usageMode}
          className="my-2"
        >
          <Radio value="basedOnSubEnvironments">وابسطه به زیر محیط ها</Radio>
          <Radio value="specificUsage">کاربری مشخص</Radio>
        </Radio.Group>

        {usageMode === "specificUsage" ? (
          <AppFormItem name="usage" label="کاربری محیط" required>
            <Select
              disabled={disabled}
              showSearch
              defaultValue={defaultValue}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {usagesList.map((el) => (
                <Select.Option key={el.id} value={el.id} title={el.title}>
                  {el.title}
                </Select.Option>
              ))}
            </Select>
          </AppFormItem>
        ) : (
          ""
        )}
      </Spin>
    </Col>
  );
};

const Status = ({
  defaultValue = false,
  disabled = false,
  statusMode,
  setStatusMode,
}) => {
  const [environmentsList, setEnvironmentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const rules = [{ required: true }];
  const routeParams = useParams();

  const onRadioChange = (e) => {
    setStatusMode(e.target.value);
  };

  useEffect(() => {
    setLoading(true);
    _GET()
      .then((res) => {
        setLoading(false);
        let data = res?.data;
        if (data && data.length) {
          if (routeParams.id) {
            data = data.filter((i) => i.id != Number(routeParams.id));
          }
          setEnvironmentsList(data);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("fetching environments error:", err);
      });
  }, []);

  const filterOptions = (input, option) => {
    let isCode = false;
    if (input.length === 5) {
      const sliceLength = 5 - String(option.value).length;
      console.log(String(input).slice(sliceLength), String(option.value));
      isCode = String(option.value).includes(String(input).slice(sliceLength));
    }
    return (
      option.children.toLowerCase().includes(input.toLowerCase()) || isCode
    );
  };

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Spin spinning={loading}>
        <label className="ant-form-item-no-colon d-block required-label">
          وضعیت
        </label>
        <Radio.Group
          onChange={onRadioChange}
          value={statusMode}
          className="my-2"
        >
          <Radio value="environment">محیط</Radio>
          <Radio value="subEnvironment">محاط</Radio>
        </Radio.Group>

        {statusMode === "subEnvironment" ? (
          <>
            <AppFormItem name="parentId" label="محیط" required>
              <Select
                disabled={disabled}
                showSearch
                defaultValue={defaultValue}
                optionFilterProp="children"
                filterOption={filterOptions}
              >
                {environmentsList.map((el) => (
                  <Select.Option key={el.id} value={el.id} title={el.title}>
                    {el.title}
                  </Select.Option>
                ))}
              </Select>
            </AppFormItem>
            <small style={{ marginTop: "-16px", display: "block" }}>
              برای جستجو عنوان یا کد پنج رقمی محیط را وارد کنید
            </small>
          </>
        ) : (
          ""
        )}
      </Spin>
    </Col>
  );
};

const OccupyingType = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem name="occupiedStatus" label="وضعیت تصرف محیط" required>
        <Radio.Group>
          <Radio value="owned">تملیکی</Radio>
          <Radio value="rented">استیجاری</Radio>
          <Radio value="borrowed">امانی (استقراضی)</Radio>
          <Radio value="ownedByEmployer">تحویلی از کارفرما</Radio>
        </Radio.Group>
      </AppFormItem>
    </Col>
  );
};

// Added Validation for start and end date
const StartDate = ({ useForm, onChange }) => {
  const checkStartDate = ({ getFieldValue }) => ({
    validator(rule, value) {
      var startTime = convertDateToEN(getFieldValue("start_date"));

      var currentTime = moment().format("YYYY/M/D");
      console.info(startTime + "   " + currentTime);

      if (checkShamsi(value, false) && currentTime > startTime) {
        return Promise.reject("تاریخ نباید برای قبل باشد.");
      }
      return Promise.resolve();
    },
  });
  const rules = [
    {
      required: true,
      message: "فیلد زمان پایان اجباریست",
    },
    checkStartDate,
  ];

  return (
    <CustomDatePicker
      form={useForm}
      label="از تاریخ"
      name="start_date"
      rules={rules}
      onChange={onChange}
    />
  );
};

const EndDate = ({ useForm, onChange }) => {
  const checkEndDate = ({ getFieldValue }) => ({
    validator(rule, value) {
      var startTime = convertDateToEN(getFieldValue("start_date"));
      var endTime = convertDateToEN(getFieldValue("end_date"));

      console.info(startTime + "   " + endTime);

      if (checkShamsi(value, false) && endTime < startTime) {
        return Promise.reject("نباید قبل از تاریخ شروع باشد.");
      }
      return Promise.resolve();
    },
  });
  const rules = [
    {
      required: true,
      message: "تاریخ اتمام اجباری است",
    },
    checkEndDate,
  ];

  return (
    <CustomDatePicker
      form={useForm}
      label="تا تاریخ"
      name="end_date"
      rules={rules}
    />
  );
};

const Description = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="توضیحات" name="description">
        <Input.TextArea />
      </Form.Item>
    </Col>
  );
};

export { Name, Usage, Status, OccupyingType };
