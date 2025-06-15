import {
  Col,
  Form,
  Input,
  Select,
  Checkbox,
  message,
  Row,
  Button,
  Spin,
} from "antd";
import { UserContext } from "contex/User-context";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { NationalIdInput } from "modules/personnel/realPerson/service/formItems";
import React, { useEffect, useState } from "react";
import { useContext } from "react";

import { _GET } from "modules/personnel/shiftwork/utils/api.js";
import { handleExceptions } from "modules/personnel/jobs/common/api";
import AppFormItem from "components/general/AppFormItem";
import { checkShamsi } from "_helpers";

const Person = ({ useForm, setPerson, defaultValue = false, edit = false }) => {
  return (
    <NationalIdInput
      type={edit ? "edit" : "send"}
      codeField="person_personnel_id"
      nameField="person_name"
      name="person_national_code"
      label="شخص"
      url="/api/admin/personnel/lookup"
      form={useForm}
      setData={setPerson}
      isRequired={true}
      defaultValue={defaultValue}
      disabled
    />
  );
};

const StartDate = ({ useForm, onChange }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ شروع اجباری است",
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (checkShamsi(value, false) && getFieldValue("actionDate") < value) {
          return Promise.reject("تاریخ شروع نباید بعد از تاریخ اعمال باشد");
        }
        return Promise.resolve();
      },
    }),
  ];

  return (
    <CustomDatePicker
      form={useForm}
      label="تاریخ شروع"
      name="startDate"
      rules={rules}
      onChange={onChange}
    />
  );
};

const ActionDate = ({ useForm, onChange }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ اعمال اجباری است",
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (checkShamsi(value, false) && getFieldValue("startDate") > value) {
          return Promise.reject("تاریخ اعمال نباید قبل از تاریخ شروع باشد");
        }
        return Promise.resolve();
      },
    }),
  ];

  return (
    <CustomDatePicker
      form={useForm}
      label="تاریخ اعمال"
      name="actionDate"
      rules={rules}
    />
  );
};

const ShiftList = ({ onChange, onLoad }) => {
  const rules = [
    {
      required: true,
    },
  ];
  const [shiftsList, setShiftsLIst] = useState([]);
  const [allShifts, setAllShifts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    _GET()
      .then((res) => {
        setLoading(false);

        if (res?.data && res?.data?.length) {
          setAllShifts(res.data);
          onLoad(res.data);

          const options = res.data.map((i) => ({
            label: i.title,
            value: i.id,
          }));

          setShiftsLIst(options);
        }
      })
      .catch((err) => {
        setLoading(false);
        handleExceptions(err);
      });
  }, []);

  function handleOnChange(val) {
    const findShift = allShifts.find((i) => i.id == val);
    onChange(findShift);
  }

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Spin spinning={loading}>
        <AppFormItem
          required
          label="شیفت کاری"
          name="job_shift_id"
          rules={rules}
        >
          <Select
            showSearch
            options={shiftsList}
            onChange={handleOnChange}
            filterOption={(input, option) =>
              input
                ? option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                : null
            }
          />
        </AppFormItem>
      </Spin>
    </Col>
  );
};

export { Person, StartDate, ActionDate, ShiftList };
