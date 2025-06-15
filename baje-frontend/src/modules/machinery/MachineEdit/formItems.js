import React, { useRef, useState, useEffect } from "react";
import {
  Col,
  Form,
  Input,
  Select,
  Row,
  Radio,
  Upload,
  Button,
  Spin,
} from "antd";
import { formColSpan } from "constant";
import {
  countOfNumInp,
  justSlashDashNumber,
  justLetterAndNumber,
  numberNormalize,
  priceNormalizer,
  imageValidation,
} from "_helpers";
import { plateStatusConstant } from "../constant";
import { UploadOutlined } from "@ant-design/icons";
import GetPerson from "components/renderInput/fetchDataWithCode/GetPerson";
//
import AppSearchInput from "components/general/AppSearchInput";
import axios from "api/appAxios";
import AppFormItem from "components/general/AppFormItem";
import { useSelector } from "react-redux";
import { _GET } from "modules/environment/enviromentDefinition/utils/api";

export const Type = ({ options, onChange }) => {
  const Rules = [{ required: true }];
  return (
    <Col {...formColSpan}>
      <Form.Item name="typeId" label="نوع" rules={Rules}>
        <Select options={options} onChange={onChange} />
      </Form.Item>
    </Col>
  );
};

//
export const System = ({ options, onChange }) => {
  const Rules = [{ required: true }];
  return (
    <Col {...formColSpan}>
      <Form.Item name="systemId" label="سیستم" rules={Rules}>
        <Select options={options} onChange={onChange} />
      </Form.Item>
    </Col>
  );
};

//
export const Tip = ({ options }) => {
  const Rules = [{ required: true }];
  return (
    <Col {...formColSpan}>
      <Form.Item name="styleId" label="تیپ" rules={Rules}>
        <Select options={options} />
      </Form.Item>
    </Col>
  );
};
//

export const Pelak = ({ plateStatus, form }) => {
  const alphabetList = [
    { label: "الف", value: "1" },
    { label: "ب", value: "2" },
    { label: "پ", value: "3" },
    { label: "ت", value: "4" },
    { label: "ث", value: "5" },
    { label: "ج", value: "6" },
    { label: "چ", value: "7" },
    { label: "ح", value: "8" },
    { label: "خ", value: "9" },
    { label: "د", value: "10" },
    { label: "ذ", value: "11" },
    { label: "ر", value: "12" },
    { label: "ز", value: "13" },
    { label: "ژ", value: "14" },
    { label: "س", value: "15" },
    { label: "ش", value: "16" },
    { label: "ص", value: "17" },
    { label: "ض", value: "18" },
    { label: "ط", value: "19" },
    { label: "ظ", value: "20" },
    { label: "ع", value: "21" },
    { label: "غ", value: "22" },
    { label: "ف", value: "23" },
    { label: "ق", value: "24" },
    { label: "ک", value: "25" },
    { label: "گ", value: "26" },
    { label: "ل", value: "27" },
    { label: "م", value: "28" },
    { label: "ن", value: "29" },
    { label: "و", value: "30" },
    { label: "ه", value: "31" },
    { label: "ی", value: "32" },
  ];
  const [selectOpen, setSelectOpen] = useState(false);
  const plaque2 = useRef();
  const plaque3 = useRef();
  const plaque4 = useRef();

  const goToPlaque2 = () => {
    plaque2.current.focus();
  };

  const goToPlaque3 = () => {
    setSelectOpen(false);
    plaque3.current.focus();
  };

  const goToPlaque4 = () => {
    plaque4.current.focus();
  };

  useEffect(() => {
    form.setFieldsValue({
      plaque1: null,
      plaque2: null,
      plaque3: null,
      plaque4: null,
    });
  }, [plateStatus]);

  return (
    plateStatus === plateStatusConstant.WITH_LICENSE_PLATE && (
      <>
        <Col {...formColSpan}>
          <Form.Item
            label="شماره انتظامی"
            rules={[{ required: true }]}
            style={{ marginBottom: "0" }}
          >
            <Row gutter={4} style={{ flexDirection: "row-reverse" }}>
              <Col span={5}>
                <Form.Item
                  name="plaque1"
                  normalize={(v, prevV) =>
                    countOfNumInp(v, prevV, 2, goToPlaque2)
                  }
                >
                  <Input type="text" />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item name="plaque2">
                  <Select
                    // open={selectOpen}
                    // onFocus={() => setSelectOpen(true)}
                    showSearch
                    ref={plaque2}
                    onSelect={goToPlaque3}
                    options={alphabetList}
                    filterOption={(inputValue, option) => {
                      if (inputValue.length <= 1) {
                        return option?.label?.includes(inputValue) ?? false;
                      } else {
                        const newValue = inputValue.slice(
                          inputValue.length - 1,
                          inputValue.length
                        );

                        return option?.label?.includes(newValue) ?? false;
                      }
                    }}
                  ></Select>
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  name="plaque3"
                  normalize={(v, prevV) =>
                    countOfNumInp(v, prevV, 3, goToPlaque4)
                  }
                >
                  <Input type="text" ref={plaque3} />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item
                  name="plaque4"
                  normalize={(v, prevV) => countOfNumInp(v, prevV, 2)}
                >
                  <Input type="text" ref={plaque4} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </>
    )
  );
};

//
export const Status = ({}) => {
  const options = [
    { label: "فعال", value: "enable" },
    { label: "آماده به کار", value: "ready" },
    { label: "مزایده ای", value: "auction" },
    { label: "غیر فعال", value: "disable" },
  ];
  const Rules = [{ required: true }];
  return (
    <Col {...formColSpan}>
      <Form.Item name="status" label="وضعیت" rules={Rules}>
        <Select options={options} />
      </Form.Item>
    </Col>
  );
};
//
export const Code = ({}) => {
  const Rules = [{ required: true }];
  return (
    <Col {...formColSpan}>
      <Form.Item
        // normalize={justSlashDashNumber}
        name="organizationCode"
        label="کد سازمانی"
        rules={Rules}
      >
        <Input type="text" />
      </Form.Item>
    </Col>
  );
};
//
export const EngineNumber = ({}) => {
  const Rules = [{ required: true }];
  return (
    <Col {...formColSpan}>
      <Form.Item
        // normalize={justLetterAndNumber}
        name="engineNumber"
        label="شماره موتور"
        rules={Rules}
      >
        <Input type="text" />
      </Form.Item>
    </Col>
  );
};
//
export const ShassiNumber = ({}) => {
  const Rules = [{ required: true }];
  return (
    <Col {...formColSpan}>
      <Form.Item
        // normalize={(values) => justLetterAndNumber(values)}
        name="chassisNumber"
        label="شماره شاسی"
        rules={Rules}
      >
        <Input type="text" />
      </Form.Item>
    </Col>
  );
};
//
export const VIN = ({}) => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        normalize={(values) => justLetterAndNumber(values)}
        name="vinNumber"
        label="شماره VIN"
      >
        <Input type="text" />
      </Form.Item>
    </Col>
  );
};
//
export const Serial = ({}) => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        normalize={(values) => numberNormalize(values)}
        name="serialNumber"
        label="شماره سریال"
      >
        <Input type="text" />
      </Form.Item>
    </Col>
  );
};
//
export const Year = ({}) => {
  const Rules = [{ required: true }];
  return (
    <Col {...formColSpan}>
      <Form.Item
        normalize={(value, prevValue) => countOfNumInp(value, prevValue, 4)}
        name="madeYear"
        label="سال ساخت"
        rules={Rules}
      >
        <Input type="text" />
      </Form.Item>
    </Col>
  );
};
//
export const Color = ({}) => {
  return (
    <Col {...formColSpan}>
      <Form.Item name="color" label="رنگ">
        <Input type="text" />
      </Form.Item>
    </Col>
  );
};
//
export const Gearbox = ({}) => {
  const options = [
    { label: "دستی", value: "manual" },
    { label: "اتوماتیک", value: "auto" },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item name="gearBox" label="نوع گیربکس">
        <Radio.Group options={options} />
      </Form.Item>
    </Col>
  );
};
//
export const Price = ({}) => {
  return (
    <Col {...formColSpan}>
      <Form.Item name="price" label="قیمت" normalize={priceNormalizer}>
        <Input type="text" />
      </Form.Item>
    </Col>
  );
};
//
export const Contract = ({ options }) => {
  const Rules = [{ required: true }];
  return (
    <Col {...formColSpan}>
      <Form.Item name="contractId" label="محل استقرار" rules={Rules}>
        <Select options={options} />
      </Form.Item>
    </Col>
  );
};
//
export const Description = ({}) => {
  return (
    <Col {...formColSpan}>
      <Form.Item name="description" label="توضیحات">
        <Input.TextArea />
      </Form.Item>
    </Col>
  );
};
//
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  if (e.fileList.length > 1) {
    e.fileList.shift();
  }

  return e && e.fileList;
};

export const VehicleCard = ({ onPreview }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        name="vehicle_card"
        label="کارت ماشین"
        getValueFromEvent={normFile}
        rules={[imageValidation]}
      >
        <Upload
          beforeUpload={(file) => {
            return false;
          }}
          accept=".jpg , .png , .zip , .rar"
          onPreview={onPreview}
        >
          <Button>
            <UploadOutlined /> انتخاب فایل
          </Button>
        </Upload>
      </Form.Item>
    </Col>
  );
};
//
export const OwnDoc = ({ onPreview }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        name="own_doc"
        label=" سند مالکیت خودرو "
        getValueFromEvent={normFile}
        rules={[imageValidation]}
      >
        <Upload
          beforeUpload={(file) => {
            return false;
          }}
          accept=".jpg , .png , .zip , .rar"
          onPreview={onPreview}
        >
          <Button>
            <UploadOutlined /> انتخاب فایل
          </Button>
        </Upload>
      </Form.Item>
    </Col>
  );
};
//
export const VehicleGreenCard = ({ onPreview }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        name="vehicle_green_card"
        label="برگ سبز"
        getValueFromEvent={normFile}
        rules={[imageValidation]}
      >
        <Upload
          beforeUpload={(file) => {
            return false;
          }}
          accept=".jpg , .png , .zip , .rar"
          onPreview={onPreview}
        >
          <Button>
            <UploadOutlined /> انتخاب فایل
          </Button>
        </Upload>
      </Form.Item>
    </Col>
  );
};

export const Owner = ({ form, defaultValue, setOwner }) => {
  return (
    <AppSearchInput
      form={form}
      label="مالک"
      nameInput="owner_name"
      codeInput="owner_code"
      idInput="ownerId"
      Rules={[{ required: true }]}
      defaultValue={defaultValue}
      search={async (code) => {
        try {
          const res = await axios.get(
            `api/admin/contract/contractor/lookup/${code}`
          );
          setOwner(res.data.list[0]);
          return { name: res.data.list[0].name, id: res.data.list[0].id };
        } catch (error) {
          setOwner(null);
          return null;
        }
      }}
    />
  );
};

export const DateType = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item name="dateType">
        <Radio.Group>
          <Radio value="shamsi">شمسی</Radio>
          <Radio value="miladi">میلادی</Radio>
        </Radio.Group>
      </Form.Item>
    </Col>
  );
};

export const ChassiNumber = ({}) => {
  const Rules = [{ required: true }];
  return (
    <Col {...formColSpan}>
      <Form.Item
        // normalize={(values) => justLetterAndNumber(values)}
        name="chassisNumber"
        label="شماره شاسی"
        rules={Rules}
      >
        <Input type="text" />
      </Form.Item>
    </Col>
  );
};

export const Environment = ({ defaultValue = false, disabled = false }) => {
  const [environmentsList, setEnvironmentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentOffice = useSelector((state) => state.currentOffice);

  useEffect(() => {
    setLoading(true);
    _GET()
      .then((res) => {
        setLoading(false);
        let data = res?.data;
        if (data?.length) {
          setEnvironmentsList(data);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("fetching environments error:", err);
      });
  }, []);

  function filterList() {
    let filtered = [...environmentsList];

    if (filtered?.length) {
      filtered = filtered.filter((i) => i.independentVehicle == 1);

      if (currentOffice != "-1") {
        filtered = filtered.filter((i) => i.companyId == currentOffice);
      }
    }

    return filtered;
  }

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Spin spinning={loading}>
        <AppFormItem name="environmentId" label="محیط محل استقرار" required>
          <Select
            disabled={disabled}
            showSearch
            defaultValue={defaultValue}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {filterList().map((el) => (
              <Select.Option key={el.id} value={el.id} title={el.title}>
                {el.title}
              </Select.Option>
            ))}
          </Select>
        </AppFormItem>
      </Spin>
    </Col>
  );
};

export const MadeYear = ({}) => {
  const Rules = [{ required: true }];
  return (
    <Col {...formColSpan}>
      <Form.Item
        normalize={(value, prevValue) => countOfNumInp(value, prevValue, 4)}
        name="madeYear"
        label="سال ساخت"
        rules={Rules}
      >
        <Input type="text" />
      </Form.Item>
    </Col>
  );
};

export const OrganizationCode = () => {
  const Rules = [{ required: true }];
  return (
    <Col {...formColSpan}>
      <Form.Item
        // normalize={justSlashDashNumber}
        name="organizationCode"
        label="کد سازمانی"
        rules={Rules}
      >
        <Input type="text" />
      </Form.Item>
    </Col>
  );
};

export const Plaque = ({ plateStatus, form }) => {
  const alphabetList = [
    { label: "الف", value: "1" },
    { label: "ب", value: "2" },
    { label: "پ", value: "3" },
    { label: "ت", value: "4" },
    { label: "ث", value: "5" },
    { label: "ج", value: "6" },
    { label: "چ", value: "7" },
    { label: "ح", value: "8" },
    { label: "خ", value: "9" },
    { label: "د", value: "10" },
    { label: "ذ", value: "11" },
    { label: "ر", value: "12" },
    { label: "ز", value: "13" },
    { label: "ژ", value: "14" },
    { label: "س", value: "15" },
    { label: "ش", value: "16" },
    { label: "ص", value: "17" },
    { label: "ض", value: "18" },
    { label: "ط", value: "19" },
    { label: "ظ", value: "20" },
    { label: "ع", value: "21" },
    { label: "غ", value: "22" },
    { label: "ف", value: "23" },
    { label: "ق", value: "24" },
    { label: "ک", value: "25" },
    { label: "گ", value: "26" },
    { label: "ل", value: "27" },
    { label: "م", value: "28" },
    { label: "ن", value: "29" },
    { label: "و", value: "30" },
    { label: "ه", value: "31" },
    { label: "ی", value: "32" },
  ];

  const plaque2 = useRef();
  const plaque3 = useRef();
  const plaque4 = useRef();

  const goToPlaque2 = () => {
    plaque2.current.focus();
  };

  const goToPlaque3 = () => {
    plaque3.current.focus();
  };

  const goToPlaque4 = () => {
    plaque4.current.focus();
  };

  useEffect(() => {
    form.setFieldsValue({
      plaque1: null,
      plaque2: null,
      plaque3: null,
      plaque4: null,
    });
  }, [plateStatus]);

  return (
    plateStatus === plateStatusConstant.WITH_LICENSE_PLATE && (
      <>
        <Col {...formColSpan}>
          <Form.Item
            label="شماره انتظامی"
            rules={[{ required: true, message: "پرکردن این فیلد الزامیست." }]}
            style={{ marginBottom: "0" }}
          >
            <Row gutter={4} style={{ flexDirection: "row-reverse" }}>
              <Col span={5}>
                <Form.Item
                  name="plaque1"
                  normalize={(v, prevV) =>
                    countOfNumInp(v, prevV, 2, goToPlaque2)
                  }
                  rules={[{ required: true }]}
                >
                  <Input type="text" />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  name="plaque2"
                  rules={[
                    { required: true, message: "پرکردن این فیلد الزامیست." },
                  ]}
                >
                  <Select
                    showSearch
                    ref={plaque2}
                    onSelect={goToPlaque3}
                    options={alphabetList}
                    filterOption={(inputValue, option) => {
                      if (inputValue.length <= 1) {
                        return option?.label?.includes(inputValue) ?? false;
                      } else {
                        const newValue = inputValue.slice(
                          inputValue.length - 1,
                          inputValue.length
                        );

                        return option?.label?.includes(newValue) ?? false;
                      }
                    }}
                  ></Select>
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  name="plaque3"
                  normalize={(v, prevV) =>
                    countOfNumInp(v, prevV, 3, goToPlaque4)
                  }
                  rules={[
                    { required: true, message: "پرکردن این فیلد الزامیست." },
                  ]}
                >
                  <Input type="text" ref={plaque3} />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item
                  name="plaque4"
                  normalize={(v, prevV) => countOfNumInp(v, prevV, 2)}
                  rules={[
                    { required: true, message: "پرکردن این فیلد الزامیست." },
                  ]}
                >
                  <Input type="text" ref={plaque4} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </>
    )
  );
};

export const SerialNumber = ({}) => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        normalize={(values) => numberNormalize(values)}
        name="serialNumber"
        label="شماره سریال"
      >
        <Input type="text" />
      </Form.Item>
    </Col>
  );
};
