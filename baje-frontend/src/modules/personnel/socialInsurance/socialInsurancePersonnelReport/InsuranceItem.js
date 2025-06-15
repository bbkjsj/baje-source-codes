import React from "react";
import { Collapse } from "antd";
import styled from "styled-components";
import colors from "utils/colors";
import { DownOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const InsuranceItem = ({ data, activeRows }) => {
  const getDataItemValue = (rowItem) => {
    return rowItem.render
      ? rowItem.render(data[rowItem.dataIndex], data)
      : data[rowItem.dataIndex];
  };

  return (
    <StyledCollapse>
      <Collapse
        bordered={false}
        className="custom-collapse"
        expandIcon={(state) => (
          <DownOutlined rotate={state.isActive ? 0 : 0.1} />
        )}
      >
        <Panel
          key={data.id}
          header={
            <div className="m-0 text-white flex">
              <h4 className="insurance-date text-white mb-0">
                {data.year + "-" + data.month}
              </h4>
              <h4 className="insurance-title text-white mb-0">{data.name}</h4>
            </div>
          }
          className="custom-collapse-panel"
        >
          <div className="sub-items w-100">
            {activeRows.map((rowItem) => (
              <InsuranceSubItem
                title={rowItem.title}
                value={getDataItemValue(rowItem)}
                important={rowItem.dataIndex === "salary_benefit_include"}
              />
            ))}
          </div>
        </Panel>
      </Collapse>
    </StyledCollapse>
  );
};

// sub components
export const InsuranceSubItem = ({ title, value, background, important }) => {
  return (
    <StyledSubItem
      className={
        "insurance-sub-item flex " + (important ? "important-row" : "")
      }
      style={{
        backgroundColor:
          background || important ? "rgba(82, 196, 26, 0.1)" : "auto",
      }}
    >
      <h4>{title}</h4>
      <span className="row-value">{value}</span>
    </StyledSubItem>
  );
};

// css
const StyledCollapse = styled.div`
  margin-bottom: 20px;

  .custom-collapse {
    border: none;
    .ant-collapse-header,
    .custom-collapse-panel {
      border-radius: 4px !important;
      border: none;
      color: white;
    }

    .ant-collapse-content {
      background-color: white;
      color: black;
      border: none;
    }

    .ant-collapse-content-box {
      padding: 0 !important;
    }

    .ant-collapse-header {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      padding-left: 20px !important;
      padding-right: 20px !important;
      background: ${colors.primary};

      .ant-collapse-arrow {
        position: static;
        margin-right: auto;
        padding-top: 0;
        color: white;
      }

      .insurance-date {
        border-left: 1px solid rgba(255, 255, 255, 0.35);
        padding-left: 8px;
        white-space: nowrap;
      }
      .insurance-title {
        padding-right: 8px;
      }
    }

    .links-list {
      li:not(:last-of-type) {
        margin-bottom: 10px;
      }
    }
  }
`;

const StyledSubItem = styled.div`
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.09);
  border-top: none;
  padding: 10px 16px;

  h4 {
    font-weight: 500;
    margin-left: 50px;
    margin-bottom: 0;
  }

  .row-value {
    text-align: left;
    flex-grow: 1;
    color: rgba(0, 0, 0, 0.65);
  }

  &:nth-of-type(even) {
    background-color: rgba(0, 0, 0, 0.04);
  }

  &.important-row {
    h4 {
      font-weight: bold;
    }

    .row-value {
      color: #52c41a;
    }
  }
`;

export default InsuranceItem;
