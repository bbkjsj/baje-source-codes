import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import styled from "styled-components";

export default ({ filters, removeHandler }) => {
  return Object.entries(filters).length ? (
    <Container>
      {Object.entries(filters).map(([filterIndex, filterValues]) =>
        filterValues.map((item) => (
          <div className="filter-item">
            <CloseOutlined
              className="remove-button"
              onClick={() => removeHandler && removeHandler(filterIndex, item)}
            />
            <div className="title">{item}</div>
          </div>
        ))
      )}
    </Container>
  ) : null;
};

const Container = styled("div")`
  margin-bottom: 16px;

  .filter-item {
    display: inline-flex;
    align-items: center;
    font-size: 0.75em;
    margin-left: 4px;
    margin-bottom: 4px;
    background: #f0f0f0;
    padding: 4px 8px;
    border-radius: 4px;

    .title {
      margin-right: 4px;
    }
  }
`;
