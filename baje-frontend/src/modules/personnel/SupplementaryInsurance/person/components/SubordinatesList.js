import React from "react";
import { Row, Col, Descriptions, Divider, Button } from "antd";
import {
  EditFilled,
  EyeFilled,
  DeleteFilled,
  MoreOutlined,
} from "@ant-design/icons";
import AppButton from "components/general/AppButton";

function SubordinatesList({ list, onEdit, onDelete }) {
  const relationConvertor = (rel) => {
    switch (rel) {
      case "father":
        return "پدر";

      case "mother":
        return "مادر";

      case "son":
        return "پسر";

      case "daughter":
        return "دختر";

      case "wife":
        return "همسر";
    }
  };
  return (
    <Row className="mb-8">
      <Divider orientation="right">افراد تبعی:</Divider>

      {list.map((el) => (
        <Descriptions
          style={{ marginBottom: "20px" }}
          bordered
          title={
            <Row justify="space-between">
              <Col>
                <span className="pl-2 ">نسبت:</span>
                <span>{relationConvertor(el.relation)}</span>
              </Col>
              <Col className="flex-wrap">
                <AppButton
                  variant="danger"
                  className="ml-2"
                  onClick={() => onDelete(el)}
                >
                  <DeleteFilled className="text-13" />
                </AppButton>
                <AppButton variant="alt-primary" onClick={() => onEdit(el)}>
                  <EditFilled className="text-13" />
                </AppButton>
              </Col>
            </Row>
          }
          key={el.id}
        >
          <Descriptions.Item label="نام">{el.name}</Descriptions.Item>
          <Descriptions.Item label="تاریخ شروع بیمه">
            {el.start_date}
          </Descriptions.Item>
          <Descriptions.Item label="تاریخ پایان بیمه">
            {el.end_date}
          </Descriptions.Item>
          <Descriptions.Item label="توضیحات">
            {el.description}
          </Descriptions.Item>
        </Descriptions>
      ))}
    </Row>
  );
}

export default SubordinatesList;
