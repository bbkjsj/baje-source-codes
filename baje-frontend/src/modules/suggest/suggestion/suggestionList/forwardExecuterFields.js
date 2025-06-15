import { Col, Form, Input, Radio, Checkbox, Select, Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { numberNormalize, reward_type } from "_helpers";
import PeriodTime from "components/PeriodTime";
import * as callApi from "../../call/utils/api";
import * as configApi from "../../configuration/utils/api";
import AppNumInput from "components/general/AppNumInput";
import * as categoryApi from "../../category/utils/api";
import * as fields from "../common/formItems";
import styled from "styled-components";
import { formColSpan } from "../../../../constant";
const requiredRule = [{ required: true }];
const rewardTypes = {
  QUALITATIVE: "کیفی",
  QUANTITATIVE: "کمی",
  SPECIAL: "ویژه",
};

const getFields = (extForm) => {
  //hide personnel field on load
  extForm.setFieldsValue({
    _hidePersonnel: 1,
  });

  const ExecutorType = ({ onChange }) => {
    const options = [
      { label: "فرد حقوقی", value: "company" },
      { label: "فرد حقیقی", value: "person" },
    ];

    const handleOnChange = (e) => {
      onChange && onChange(e);
      const value = e.target.value;

      extForm.setFieldsValue({
        _hideCompany: value === "person" ? 1 : null,
        _hidePersonnel: value === "company" ? 1 : null,
      });
    };

    return (
      <Col {...formColSpan} style={{ order: "-1" }}>
        <Form.Item label="نوع مجری" name="executor_type" initialValue="company">
          <Radio.Group options={options} onChange={handleOnChange} />
        </Form.Item>
      </Col>
    );
  };

  const BenefitType = ({ onChange }) => {
    const options = [
      { label: "کمی", value: rewardTypes.QUANTITATIVE },
      { label: "کیفی", value: rewardTypes.QUALITATIVE },
      { label: "ویژه", value: rewardTypes.SPECIAL },
    ];

    return (
      <Col {...formColSpan}>
        <Form.Item label="نوع پیشنهاد" name="reward_type" rules={requiredRule}>
          <Select options={options} onChange={onChange} />
        </Form.Item>
      </Col>
    );
  };

  const Reward = () => {
    useEffect(() => {
      (async () => {
        const res = await configApi._GET();
        extForm.setFieldsValue({
          suggest_reward: res.data["min_reward_rial"],
        });
      })();
    }, []);

    return (
      <Form.Item shouldUpdate noStyle>
        {(form) => {
          return (
            [rewardTypes.QUANTITATIVE, rewardTypes.SPECIAL].includes(
              form.getFieldValue("reward_type")
            ) && (
              <Col {...formColSpan}>
                <Form.Item
                  label="پاداش پیشنهادی"
                  name={"suggest_reward"}
                  rules={requiredRule}
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

  const Score = () => {
    let yearlyRate = 0;

    useEffect(() => {
      (async () => {
        const res = await configApi._GET();
        yearlyRate = res.data["rial_rate_per_year"];

        setInterval(() => {
          if (
            extForm.getFieldValue("reward_type") === rewardTypes.QUALITATIVE
          ) {
            if (!extForm.getFieldValue("score")) {
              extForm.setFieldsValue({ score: 1000 });
            }

            calculateScore();
          }
        }, 1000);
      })();
    }, []);

    const calculateScore = () => {
      extForm.setFieldsValue({
        calculated_reward: extForm.getFieldValue("score") * yearlyRate,
      });
    };

    return (
      <Form.Item shouldUpdate noStyle>
        {(form) => {
          return (
            form.getFieldValue("reward_type") === rewardTypes.QUALITATIVE && (
              <Col {...formColSpan}>
                <Form.Item
                  label="امتیاز"
                  name={"score"}
                  rules={[{ required: true }]}
                  normalize={reward_type}
                  extra="بین ۱ تا ۱۰۰۰"
                >
                  <Input onChange={calculateScore} />
                </Form.Item>
              </Col>
            )
          );
        }}
      </Form.Item>
    );
  };

  const Category = ({ onChange }) => {
    const [options, setOptions] = useState([]);
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
    const [description, setDescription] = useState();
    const [categoryList, setCategoryList] = useState([]);

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

    const showDescriptionDialog = () => {
      Modal.info({
        title: "",
        content: description,
      });
    };

    useEffect(() => {
      (async () => {
        const categories = await categoryApi._GET();

        if (!categories.data?.length) return false;

        const listItems = categories.data.map((item) => {
          return { label: item.name, value: item.id };
        });

        setOptions([...listItems, { label: "سایر", value: 0 }]);
        categories.data.length &&
          (await handleOptionChange(categories.data[0].id));
      })();
    }, []);

    return (
      <Col {...formColSpan}>
        <Form.Item label="حوزه پیشنهاد" name="category" rules={rules}>
          <Select options={options} onChange={handleOptionChange} />
        </Form.Item>
        <Form.Item noStyle={true} shouldUpdate={true}>
          {(form) => {
            return (
              <>
                {form.getFieldValue("category") === 0 && <CustomCategory />}
                {description && (
                  <StyledCategoryDescLink>
                    <a onClick={() => showDescriptionDialog()}>
                      توضیحات حوزه انتخاب شده
                    </a>
                  </StyledCategoryDescLink>
                )}
              </>
            );
          }}
        </Form.Item>
      </Col>
    );
  };

  const CustomCategory = () => {
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

  const Calculator = () => {
    return (
      <Form.Item shouldUpdate noStyle>
        {(form) => {
          return (
            form.getFieldValue("reward_type") === rewardTypes.QUALITATIVE && (
              <Col {...formColSpan}>
                <Form.Item
                  label="مبلغ پاداش"
                  name={"calculated_reward"}
                  extra="محاسبه بر اساس امتیاز و ضریب ریالی امسال"
                >
                  {/* <Input  /> */}
                  <AppNumInput disabled suffix="ریال" />
                </Form.Item>
              </Col>
            )
          );
        }}
      </Form.Item>
    );
  };

  const DueDay = () => {
    return (
      <Form.Item name="due_day" hidden>
        <Input defaultValue="0" />
      </Form.Item>
    );
  };

  return [
    <ExecutorType />,
    <Category />,
    <BenefitType />,
    <Reward />,
    <Score />,
    <Calculator />,
    <DueDay />,
  ];
};

const StyledCategoryDescLink = styled.small`
  position: relative;
  top: -20px;
`;

export default getFields;
