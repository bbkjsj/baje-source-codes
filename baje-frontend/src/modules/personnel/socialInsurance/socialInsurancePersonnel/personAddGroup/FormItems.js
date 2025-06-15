import React, { useEffect, useContext, useState } from "react";
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
  Space,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { _GET_SOCIALINSURANCE_LIST } from "../../util/api";
import { useParams } from "react-router-dom";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  if (e.fileList.length > 1) {
    e.fileList.shift();
  }

  return e && e.fileList;
};

const checkUserId = (from) => {
  let data = from.getFieldValue("personnel_id");
  if (data) {
    return true;
  }
  return false;
};

const CheckShowPersonal = ({ children }) => {
  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        return checkUserId(form) && children;
      }}
    </Form.Item>
  );
};

const Type = () => {
  const option = [
    // { label: "کپی از لیست دیگر", value: "1" },
    { label: "فایل اکسل", value: "2", disabled: true },
    { label: "فایل DBF", value: "3", disabled: false },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
      <Form.Item label="روش" name="type">
        <Radio.Group options={option} />
      </Form.Item>
    </Col>
  );
};

const InsuranceListID = () => {
  const rules = [{ required: true }];
  const [tamins, setTamins] = useState([]);
  const [filteredTamins, setFilteredTamins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState();
  const [thisWorkshop, setThisWorkshop] = useState(false);
  const [thisRow, setThisRow] = useState(false);
  const routeParams = useParams();

  useEffect(() => {
    _GET_SOCIALINSURANCE_LIST()
      .then((res) => {
        setLoading(false);
        setTamins(res.data);
        setFilteredTamins(res.data);
        res.data.forEach((el) => {
          if (el.id == routeParams.id) {
            setCurrent(el);
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    filterTamins();
  }, [thisWorkshop, thisRow]);

  function filterTamins() {
    const filter = {};
    if (thisWorkshop && current && current.workshop_code) {
      filter.workshop_code = current.workshop_code;
    }
    if (thisRow && current.row) {
      filter.row = current.row;
    }

    const newTamins = tamins.filter((item) => {
      for (let key in filter) {
        if (item[key] === undefined || item[key] != filter[key]) return false;
      }
      return true;
    });
    console.log(filter);
    console.log(newTamins);
    setFilteredTamins(newTamins);
  }

  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        return (
          form.getFieldValue("type") === "1" && (
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Space style={{ marginBottom: 16 }}>
                <Checkbox
                  name="this_workshop"
                  onChange={(e) => {
                    setThisWorkshop(e.target.checked);
                  }}
                >
                  همین کد کارگاهی
                </Checkbox>
                <Checkbox
                  name="this_row"
                  onChange={(e) => {
                    setThisRow(e.target.checked);
                  }}
                >
                  همین ردیف پیمان
                </Checkbox>
              </Space>
              <Form.Item label="لیست بیمه" name="insurance_id" rules={rules}>
                <Select loading={loading}>
                  {filteredTamins.map((el) => {
                    if (el.id == routeParams.id) {
                      return null;
                    }
                    return (
                      <Select.Option
                        key={el.id}
                        value={el.id}
                        title={
                          el.year + "/" + el.month + " - " + el.list_number
                        }
                      >
                        {el.year + "/" + el.month + " - " + el.list_number}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          )
        );
      }}
    </Form.Item>
  );
};

const ExcelFile = () => {
  return (
    <>
      <Form.Item noStyle shouldUpdate>
        {(form) => {
          return (
            form.getFieldValue("type") === "2" && (
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item
                  name="ExcelFile"
                  label="فایل اکسل"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                >
                  <Upload
                    beforeUpload={(file) => {
                      return false;
                    }}
                    accept=".XLSX,XLS,XLSM"
                  >
                    <Button>
                      <UploadOutlined /> انتخاب فایل
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            )
          );
        }}
      </Form.Item>
    </>
  );
};

const DBFFile = () => {
  return (
    <>
      <Form.Item noStyle shouldUpdate>
        {(form) => {
          return (
            form.getFieldValue("type") === "3" && (
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item
                  name="DBFFile"
                  label="فایل DBF"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  // rules={[imageValidation]}
                >
                  <Upload
                    // onPreview={onPreview}
                    beforeUpload={(file) => {
                      return false;
                    }}
                    accept=".DBF"
                  >
                    <Button>
                      <UploadOutlined /> انتخاب فایل
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            )
          );
        }}
      </Form.Item>
    </>
  );
};

export { Type, InsuranceListID, ExcelFile, DBFFile };
