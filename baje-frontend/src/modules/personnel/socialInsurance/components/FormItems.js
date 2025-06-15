import React, { useEffect, useContext, useState } from "react";
import { Col, Form, Input, Select, message } from "antd";
import { countOfNumInp } from "_helpers";
import { _getContractWithCode } from "../util/api";
import AppButton from "components/general/AppButton";

const CheckContract = ({ children }) => (
  <Form.Item noStyle shouldUpdate>
    {(form) => {
      return form.getFieldValue("contract_id") && children;
    }}
  </Form.Item>
);

const ContractID = ({}) => {
  return (
    <Form.Item hidden name={"contract_id"}>
      <Input />
    </Form.Item>
  );
};

const WorkShopCode = ({ detail, contractList }) => {
  const rules = [{ required: true }, { len: 10 }];
  const [list, setList] = useState([]);

  useEffect(() => {
    (async () => {
      if (contractList && contractList.length > 0) {
        const newList = [];
        contractList.forEach((element) => {
          if (
            element.workshop_code &&
            newList.indexOf(element.workshop_code) == -1
          ) {
            newList.push(element.workshop_code);
          }
        });
        setList(newList);
      } else setList([]);
    })();
  }, [contractList]);
  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        return (
          <Col xs={24} sm={24} md={24} lg={12} xl={6}>
            <Form.Item
              label="کد کارگاهی"
              name="work_shop"
              rules={rules}
              normalize={(value, prevValue) =>
                countOfNumInp(value, prevValue, 10)
              }
            >
              {/* <Input
                disabled={form.getFieldValue("contract_id") ? true : false}
              /> */}
              <Select
                disabled={form.getFieldValue("contract_id") ? true : false}
              >
                {list.map((el) => {
                  return (
                    <Select.Option key={el} value={el}>
                      {el}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        );
      }}
    </Form.Item>
  );
};

const RowCode = ({ detail, contractList }) => {
  const rules = [{ required: true }, { len: 3 }];

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (contractList && contractList.length > 0) {
        const newList = [];
        contractList.forEach((element) => {
          if (element.row && newList.indexOf(element.row) == -1) {
            newList.push(element.row);
          }
        });
        setList(newList);
      } else setList([]);
    })();
  }, [contractList]);

  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        return (
          <Col xs={24} sm={24} md={24} lg={12} xl={6}>
            <Form.Item
              label="ردیف پیمان"
              name="row"
              rules={rules}
              normalize={(value, prevValue) =>
                countOfNumInp(value, prevValue, 3)
              }
            >
              {/* <Input
                disabled={form.getFieldValue("contract_id") ? true : false}
              /> */}
              <Select
                disabled={form.getFieldValue("contract_id") ? true : false}
              >
                {list.map((el) => {
                  return (
                    <Select.Option key={el} value={el}>
                      {el}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        );
      }}
    </Form.Item>
  );
};

const ContractSubject = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="عنوان قرارداد" name={"subject"}>
        <Input disabled />
      </Form.Item>
    </Col>
  );
};

const defaultDate = (year, month) => {
  if (parseInt(month) == 12) {
    month = "01";
    year = parseInt(year) + 1;
  } else {
    month = parseInt(month) + 1;
  }

  return {
    year,
    month,
  };
};

const GetContract = ({ useForm, onClick, loading, onAllChange }) => {
  const handleOnChangeEdit = () => {
    useForm.setFieldsValue({
      contract_id: null,
      row: null,
      work_shop: null,
      subject: null,
    });
    if (onAllChange) {
      onAllChange();
    }
  };

  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        return form.getFieldValue("contract_id") ? (
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={6}
            xl={4}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              marginTop: "11px",
            }}
          >
            <AppButton size={"large"} onClick={handleOnChangeEdit}>
              تغییر
            </AppButton>
          </Col>
        ) : (
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={6}
            xl={4}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              marginTop: "11px",
            }}
          >
            <AppButton size={"large"} loading={loading} onClick={onClick}>
              بررسی
            </AppButton>
          </Col>
        );
      }}
    </Form.Item>
  );
};

const Year = () => {
  const rules = [{ required: true }];
  return (
    <CheckContract>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          label="سال"
          name="year"
          rules={rules}
          normalize={(value, prevValue) => countOfNumInp(value, prevValue, 4)}
        >
          <Input />
        </Form.Item>
      </Col>
    </CheckContract>
  );
};

const Month = ({ useForm }) => {
  const handleOnBlur = (e) => {
    let value = e.target.value;
    if (value === "0" || value === "00") {
      value = "1";
    }
    while (value.length < 2) {
      value = "0" + value;
    }
    useForm.setFieldsValue({ month: value });
  };

  return (
    <CheckContract>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          name={"month"}
          label="ماه "
          rules={[{ required: true }]}
          normalize={(value, prevValue) => countOfNumInp(value, prevValue, 2)}
        >
          <Input onBlur={handleOnBlur} />
        </Form.Item>
      </Col>
    </CheckContract>
  );
};

const ListNumber = ({ useForm }) => {
  const handleOnBlur = (e) => {
    let value = e.target.value;
    if (value === "0" || value === "00" || value === "000") {
      value = "1";
    }
    while (value.length < 3) {
      value = "0" + value;
    }
    useForm.setFieldsValue({ list_number: value });
  };

  return (
    <CheckContract>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          name={"list_number"}
          label="شماره لیست"
          rules={[{ required: true }]}
          normalize={(value, prevValue) => countOfNumInp(value, prevValue, 3)}
        >
          <Input onBlur={handleOnBlur} />
        </Form.Item>
      </Col>
    </CheckContract>
  );
};

const Description = () => {
  return (
    <CheckContract>
      <Col xs={24} sm={24} md={24} lg={24} xl={12}>
        <Form.Item label="توضیحات" name="description">
          <Input.TextArea />
        </Form.Item>
      </Col>
    </CheckContract>
  );
};

const FirstInsuranceList = ({ label, name, insuranceList, onChange }) => {
  const rules = [{ required: true }];
  return (
    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
      <Form.Item label={label} name={name} rules={rules}>
        <Select onChange={onChange}>
          {insuranceList &&
            insuranceList.map((el) => (
              <Select.Option
                key={el.id}
                value={el.id}
                title={`${el.year}-${el.month}`}
              >
                {el.year}-{el.month}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
    </Col>
  );
};

const LastInsuranceList = ({ label, name, insuranceList, onChange, form }) => {
  const rules = [{ required: true }];

  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        const { last_list, first_list } = form.getFieldsValue();
        if (last_list && first_list && first_list === last_list) {
          console.log("they are same");
          form.setFieldsValue({ last_list: null, first_list: null });
          message.error("لیست ها باید متفاوت باشند.");
        }

        return (
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Form.Item label={label} name={name} rules={rules}>
              <Select onChange={onChange}>
                {insuranceList &&
                  insuranceList.map((el) => (
                    <Select.Option
                      key={el.id}
                      value={el.id}
                      title={`${el.year}-${el.month}`}
                    >
                      {el.year}-{el.month}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        );
      }}
    </Form.Item>
  );
};

export {
  RowCode,
  WorkShopCode,
  ContractSubject,
  GetContract,
  ContractID,
  Month,
  Year,
  ListNumber,
  Description,
  FirstInsuranceList,
  LastInsuranceList,
};
