import { Col, Form, Input, Radio, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment-jalaali";
import { checkShamsi, convertDateToEN } from "_helpers";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { NationalIdInput } from "modules/personnel/realPerson/service/formItems";
import AppFormItem from "components/general/AppFormItem";
import { _GET } from "modules/environment/enviromentDefinition/utils/api";
import { useSelector } from "react-redux";
import { getOfficesList } from "pages/persons/realPerson/common/_helpers";
import { getPermissionsList, getUserPermissions } from "../utils/api";
import { useParams } from "react-router-dom";
import {
  PermissionsFarsiLabels,
  PermissionsSectionsFarsiLabels,
} from "json/Permission";

const Person = ({
  useForm,
  setPerson,
  defaultValue = false,
  edit = false,
  button = true,
}) => {
  console.info(button);
  return (
    <NationalIdInput
      type={edit ? "edit" : "send"}
      codeField="person_personnel_id"
      nameField="person_name"
      name="person_national_code"
      label="دارنده دسترسی"
      url="/api/admin/personnel/lookup"
      form={useForm}
      setData={setPerson}
      isRequired={false}
      defaultValue={defaultValue}
      disabled={true}
    />
  );
};

const AccessLevel = () => {
  const options = [
    { label: "باجه", value: "baje" },
    { label: "شرکت", value: "company" },
    { label: "محیط", value: "environment" },
  ];
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item name="accessLevel" label="حوزه" rules={[{ required: true }]}>
        <Radio.Group options={options} />
      </Form.Item>
    </Col>
  );
};

const Permissions = () => {
  const params = useParams();
  const [permissionsList, setPermissionsList] = useState([]);
  const [userPermissionsList, setUserPermissionsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    getPermissionsList()
      .then((res) => {
        const permissions = res.data.map((i) => {
          const module = i.name.split("/")[0];
          const moduleFa = PermissionsSectionsFarsiLabels[module] || "";

          return {
            id: i.id,
            title:
              moduleFa +
                " - " +
                PermissionsFarsiLabels[
                  i.name.replaceAll("/", "_").replaceAll("-", "_")
                ]?.label || i.name.replaceAll("/", "_").replaceAll("-", "_"),
          };
        });

        setPermissionsList(permissions);
      })
      .then(() => {
        getUserPermissions(params.id).then((res) => {
          setUserPermissionsList(res.data);
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filterOptions = (input, option) => {
    let isCode = false;
    if (input.length === 5) {
      const sliceLength = 5 - String(option.value).length;
      isCode = String(option.value).includes(String(input).slice(sliceLength));
    }
    return (
      option.children.toLowerCase().includes(input.toLowerCase()) || isCode
    );
  };

  // include only permissions that the user doesn't already have
  const filteredPermissionsList = () => {
    if (!permissionsList.length || !userPermissionsList.length)
      return permissionsList;

    return permissionsList.filter((perm) => {
      return !userPermissionsList.some(
        (userPerm) => perm.id == userPerm.accessId
      );
    });
  };

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Spin spinning={loading || !filteredPermissionsList()}>
        <AppFormItem name="accessIds" label="دسترسی‌ها">
          {filteredPermissionsList() ? (
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={filterOptions}
              mode="multiple"
              showArrow
            >
              {filteredPermissionsList().map((el) => (
                <Select.Option key={el.id} value={el.id} title={el.title}>
                  {el.title}
                </Select.Option>
              ))}
            </Select>
          ) : (
            ""
          )}
        </AppFormItem>
        <small style={{ marginTop: "-16px", display: "block" }}>
          برای جستجو عنوان یا کد پنج رقمی دسترسی را وارد کنید
        </small>
      </Spin>
    </Col>
  );
};

const EnvironmentPath = () => {
  const [environmentsList, setEnvironmentsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    _GET()
      .then((res) => {
        setLoading(false);
        let data = res?.data;
        if (data && data.length) {
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
      isCode = String(option.value).includes(String(input).slice(sliceLength));
    }
    return (
      option.children.toLowerCase().includes(input.toLowerCase()) || isCode
    );
  };

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Spin spinning={loading}>
        <AppFormItem name="environmentId" label="آدرس شاخه">
          <Select
            showSearch
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
      </Spin>
    </Col>
  );
};

const CompanyPath = () => {
  const [companyList, setCompanyList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getOfficesList()
      .then((res) => {
        setCompanyList(res.list);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filterOptions = (input, option) => {
    let isCode = false;
    isCode = String(option.national_id).includes(String(input));

    return (
      option.children.toLowerCase().includes(input.toLowerCase()) || isCode
    );
  };

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Spin spinning={loading}>
        <AppFormItem name="companyId" label="آدرس شاخه">
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={filterOptions}
          >
            {companyList.map((el) => (
              <Select.Option
                key={el.id}
                value={el.id}
                title={el.name}
                national_id={el.national_id}
              >
                {el.name}
              </Select.Option>
            ))}
          </Select>
        </AppFormItem>
        <small style={{ marginTop: "-16px", display: "block" }}>
          برای جستجو عنوان یا شناسه ملی شرکت را وارد کنید
        </small>
      </Spin>
    </Col>
  );
};

// Added Validation for start and end date
const StartDate = ({ useForm, onChange }) => {
  const checkStartDate = ({ getFieldValue }) => ({
    validator(rule, value) {
      const startTime = new Date(convertDateToEN(getFieldValue("startDate")));

      const currentTime = new Date();
      currentTime.setHours(0, 0, 0, 0);
      console.info(startTime + "   " + currentTime);

      if (currentTime > startTime) {
        return Promise.reject("تاریخ نمی‌تواند قبل از امروز باشد");
      }
      return Promise.resolve();
    },
  });
  const rules = [
    {
      required: true,
      message: "فیلد تاریخ شروع اجباریست",
    },
    checkStartDate,
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

const EndDate = ({ useForm, onChange, noCol = false }) => {
  const checkEndDate = ({ getFieldValue }) => ({
    validator(rule, value) {
      const startTime = new Date(convertDateToEN(getFieldValue("startDate")));
      const endTime = getFieldValue("endDate")
        ? new Date(convertDateToEN(getFieldValue("endDate")))
        : "";

      console.info(startTime + "   " + endTime);

      if (endTime < startTime) {
        return Promise.reject("نباید قبل از تاریخ شروع باشد");
      }
      return Promise.resolve();
    },
  });

  const rules = [
    {
      required: true,
      message: "فیلد تاریخ پایان اجباریست",
    },
    checkEndDate,
  ];

  return (
    <CustomDatePicker
      form={useForm}
      label="تاریخ پایان"
      name="endDate"
      //rules={rules}
      plain={noCol}
    />
  );
};

export {
  Person,
  StartDate,
  EndDate,
  AccessLevel,
  EnvironmentPath,
  CompanyPath,
  Permissions,
};
