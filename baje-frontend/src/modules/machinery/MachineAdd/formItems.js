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
import AppSearchInput from "components/general/AppSearchInput";
import axios from "api/appAxios";
import ImgCrop from "antd-img-crop";
import { useParams } from "react-router-dom";
import AppFormItem from "components/general/AppFormItem";
import { _GET } from "modules/environment/enviromentDefinition/utils/api";
import { useSelector } from "react-redux";

//
const Type = ({ options, onChange, systemRef }) => {
  const Rules = [{ required: true }];

  const goToSystem = () => {
    if (systemRef?.current) {
      systemRef.current.focus();
    }
  };

  return (
    <Col {...formColSpan}>
      <Form.Item name="typeId" label="نوع" rules={Rules}>
        <Select
          showSearch
          options={options}
          onChange={onChange}
          filterOption={(inputValue, option) => {
            return option?.label?.includes(inputValue) ?? false;
          }}
          onSelect={goToSystem}
        />
      </Form.Item>
    </Col>
  );
};

//
const System = ({ options, onChange, systemRef, tipRef }) => {
  const Rules = [{ required: true }];

  const goToTip = () => {
    if (tipRef?.current) {
      tipRef.current.focus();
    }
  };
  return (
    <Col {...formColSpan}>
      <Form.Item name="systemId" label="سیستم" rules={Rules}>
        <Select
          ref={systemRef}
          showSearch
          options={options}
          onChange={onChange}
          filterOption={(inputValue, option) => {
            return option?.label?.includes(inputValue) ?? false;
          }}
          onSelect={goToTip}
        />
      </Form.Item>
    </Col>
  );
};

//
const Tip = ({ options, tipRef }) => {
  const Rules = [{ required: true }];
  return (
    <Col {...formColSpan}>
      <Form.Item name="styleId" label="تیپ" rules={Rules}>
        <Select
          ref={tipRef}
          showSearch
          options={options}
          filterOption={(inputValue, option) => {
            return option?.label?.includes(inputValue) ?? false;
          }}
        />
      </Form.Item>
    </Col>
  );
};
//

const Plaque = ({ plateStatus, form }) => {
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

//
const Status = () => {
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
const OrganizationCode = () => {
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
export const EngineNumber = () => {
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
const ChassiNumber = ({}) => {
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
const VIN = ({}) => {
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
const SerialNumber = ({}) => {
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
const MadeYear = ({}) => {
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
const Color = ({}) => {
  return (
    <Col {...formColSpan}>
      <Form.Item name="color" label="رنگ">
        <Input type="text" />
      </Form.Item>
    </Col>
  );
};

//
const Gearbox = ({}) => {
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
const Price = ({}) => {
  return (
    <Col {...formColSpan}>
      <Form.Item name="price" label="قیمت" normalize={priceNormalizer}>
        <Input type="text" />
      </Form.Item>
    </Col>
  );
};

//
const ContractId = ({ options }) => {
  const Rules = [{ required: true }];
  return (
    <Col {...formColSpan}>
      <Form.Item name="contractId" label="محل استقرار" rules={Rules}>
        <Select options={options} />
      </Form.Item>
    </Col>
  );
};

const Environment = ({ defaultValue = false, disabled = false }) => {
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

//
const Description = ({}) => {
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
  console.log("Upload event:", e);
  if (Array.isArray(e)) {
    return e;
  }

  if (e.fileList.length > 1) {
    e.fileList.shift();
  }

  return e;
};

export const VehicleCard = ({ defaultFileList, onChange }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        name="vehicleCard"
        label="کارت ماشین"
        // rules={[imageValidation]}
        getValueFromEvent={normFile}
      >
        {/* <ImgCrop
          rotate
          quality={0.8}
          modalTitle="ویرایش تصویر"
          aspect={4.3 / 3}
          modalWidth={720}
          beforeCrop={(file) => {
            // open crop modal only if the file is an image
            if (file.type !== "image/jpeg" && file.type !== "image/png") {
              return false;
            }
            return true;
          }}
        > */}
        <Upload
          beforeUpload={(file) => {
            onChange(file);
            return false;
          }}
          accept=".jpg , .png , .jpeg"
          defaultFileList={defaultFileList}
          multiple={false}
          maxCount={1}
          // defaultFileList={[
          // {
          //   uid: '1',
          //   name: 'xxx.png',
          //   status: 'done',
          //   response: 'Server Error 500',
          //   url:
          //     'http://test.baje724.ir/api/image/vehicle/22019310903118.jpg',
          // },
          // ]}
        >
          <Button>
            <UploadOutlined /> انتخاب فایل
          </Button>
        </Upload>
        {/* </ImgCrop> */}
      </Form.Item>
    </Col>
  );
};
//
export const OwnDoc = ({ defaultFileList, onChange }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        name="ownDoc"
        label=" سند مالکیت خودرو "
        getValueFromEvent={normFile}
        // rules={[imageValidation]}
      >
        {/* <ImgCrop
          rotate
          quality={0.8}
          modalTitle="ویرایش تصویر"
          aspect={3.3 / 4}
          modalWidth={720}
          beforeCrop={(file) => {
            if (file.type !== "image/jpeg" && file.type !== "image/png") {
              return false;
            }
            return true;
          }}
        > */}
        <Upload
          beforeUpload={(file) => {
            onChange(file);
            return false;
          }}
          accept=".jpg , .png, .jpeg"
          defaultFileList={defaultFileList}
          multiple={false}
          maxCount={1}
        >
          <Button>
            <UploadOutlined /> انتخاب فایل
          </Button>
        </Upload>
        {/* </ImgCrop> */}
      </Form.Item>
    </Col>
  );
};
//
export const VehicleGreenCard = ({ defaultFileList, onChange }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        name="vehicleGreenCard"
        label="برگ سبز"
        getValueFromEvent={normFile}
        //rules={[imageValidation]}
        multiple={false}
      >
        {/* <ImgCrop
          rotate
          quality={0.8}
          modalTitle="ویرایش تصویر"
          aspect={3.3 / 4}
          modalWidth={720}
          beforeCrop={(file) => {
            if (file.type !== "image/jpeg" && file.type !== "image/png") {
              return false;
            }
            return true;
          }}
        > */}
        <Upload
          beforeUpload={(file) => {
            onChange(file);
            return false;
          }}
          accept=".jpg , .png, .jpeg,  .rar, .zip"
          defaultFileList={defaultFileList}
          maxCount={1}
        >
          <Button>
            <UploadOutlined /> انتخاب فایل
          </Button>
        </Upload>
        {/* </ImgCrop> */}
      </Form.Item>
    </Col>
  );
};

export const Owner = ({ form, setOwner, defaultValue }) => {
  return (
    <AppSearchInput
      defaultValue={defaultValue}
      form={form}
      active={true}
      label="مالک"
      nameInput="owner_name"
      codeInput="owner_code"
      disabled
      disabledBtn
      hideBtn
      idInput="ownerId"
      Rules={[{ required: true }]}
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

const DateType = () => {
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

export {
  Type,
  System,
  Tip,
  Plaque,
  Status,
  OrganizationCode,
  ChassiNumber,
  VIN,
  SerialNumber,
  MadeYear,
  Color,
  Gearbox,
  Price,
  ContractId,
  Description,
  DateType,
  Environment,
};
