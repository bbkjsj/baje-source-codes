import React from "react";
import { Input, Row, Col } from "antd";

const SearchInput = (props) => {
  return (
    <>
      <Row>
        <Col span={24}>
          <Input
            placeholder="جستجو  "
            onChange={props.onChangeSearchField}
            value={props.value}
          />
        </Col>
        {/* <Col span={6}>
          <Button
            onClick={props.onSearch}
            style={{ width: "100%", color: "#2f75b5" }}
            loading={props.loading}
          >
            جستجو
          </Button>
        </Col> */}
      </Row>
    </>
  );
};

export default SearchInput;
