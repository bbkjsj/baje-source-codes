import React, { useRef, useEffect, useState } from "react";
import { Form, Input, Col, Row, Select } from "antd";
import { countOfNumInp } from "../../../_helpers";

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

const PelakInput = () => {
  const [selectOpen, setSelectOpen] = useState(false);
  const pelak2 = useRef();
  const pelak3 = useRef();
  const pelak4 = useRef();

  const goToPelak2 = () => {
    pelak2.current.focus();
  };

  const goToPelak3 = () => {
    setSelectOpen(false);
    pelak3.current.focus();
  };

  const goToPelak4 = () => {
    pelak4.current.focus();
  };

  return (
    <>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          label="شماره انتظامی"
          rules={[{ required: true }]}
          style={{ marginBottom: "0" }}
        >
          <Row gutter={4} style={{ flexDirection: "row-reverse" }}>
            <Col span={5}>
              <Form.Item
                name="pelak1"
                normalize={(v, prevV) => countOfNumInp(v, prevV, 2, goToPelak2)}
              >
                <Input type="text" />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="pelak2">
                <Select
                  // open={selectOpen}
                  // onFocus={() => setSelectOpen(true)}

                  ref={pelak2}
                  onSelect={goToPelak3}
                >
                  {alphabetList.map((el) => (
                    <Select.Option value={el.value}>{el.label}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                name="pelak3"
                normalize={(v, prevV) => countOfNumInp(v, prevV, 3, goToPelak4)}
              >
                <Input type="text" ref={pelak3} />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                name="pelak4"
                normalize={(v, prevV) => countOfNumInp(v, prevV, 2)}
              >
                <Input type="text" ref={pelak4} />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      </Col>
    </>
  );
};

export default PelakInput;
