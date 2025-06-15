import React, { Component } from "react";
import styled from "styled-components";
import { CloseOutlined, DownOutlined } from "@ant-design/icons";
import { Checkbox, Collapse } from "antd";
import AppButton from "../../../../components/general/AppButton";

export default class extends Component {
  prevSelectedValues = {};

  constructor(props) {
    super(props);
    this.state = { selectedValues: {} };
  }

  componentDidMount() {
    if (this.props.selectedValues) {
      this.setState((state, props) => ({
        selectedValues: props.selectedValues,
      }));
      this.prevSelectedValues = this.props.selectedValues;
    }
  }

  handleOnFilterChange(filterIndex, values) {
    const newFilterValue = {
      ...this.state.selectedValues,
      ...{ [filterIndex]: values },
    };

    this.setState((state, props) => ({ selectedValues: newFilterValue }));
  }

  triggerOnChange() {
    this.props.onChange && this.props.onChange(this.state.selectedValues);
    this.triggerOnClose();
  }

  triggerOnClose() {
    this.setState({ selectedValues: this.prevSelectedValues });
    this.props.onClose && this.props.onClose();
  }

  getFilterValues(filterIndex) {
    const filter = this.props.filters.find(
      (item) => item.dataIndex === filterIndex
    );

    if (filter.items) return filter.items;
    else if (this.props.listData && Array.isArray(this.props.listData)) {
      const filterValues = this.props.listData.map((item) =>
        filter.computeValue ? filter.computeValue(item) : item[filterIndex]
      );
      return [...new Set(filterValues)];
    } else return [];
  }

  getFilterCounter(filterIndex) {
    const count = this.state.selectedValues
      ? this.state.selectedValues[filterIndex]?.length
      : 0;
    let countText = count && " (" + count + " مورد" + ")";

    if (count) return <small>{countText}</small>;
    else return "";
  }

  clearMobileFilters() {
    this.setState({ selectedValues: {} });
    this.props.onChange && this.props.onChange({});
    this.triggerOnClose();
  }

  render() {
    return (
      <Container>
        <div className="header">
          <div className="title">فیلتر گزارش</div>
          <CloseOutlined
            className="close-button"
            onClick={() => this.triggerOnClose()}
          />
        </div>
        <div className="filter-item">
          {this.props.filters.map((filterItem) => (
            <Collapse
              defaultActiveKey={0}
              className="custom-collapse"
              expandIcon={(state) => (
                <DownOutlined rotate={state.isActive ? 0 : 0.1} />
              )}
              expandIconPosition="left"
            >
              <Collapse.Panel
                key={filterItem.dataIndex}
                header={[
                  filterItem.title,
                  this.getFilterCounter(filterItem.dataIndex),
                ]}
                className="custom-collapse-panel"
              >
                <Checkbox.Group
                  options={this.getFilterValues(filterItem.dataIndex).map(
                    (item) => ({
                      label: item,
                      value: item,
                    })
                  )}
                  defaultValue={
                    this.state.selectedValues?.[filterItem.dataIndex]
                  }
                  onChange={(values) =>
                    this.handleOnFilterChange(filterItem.dataIndex, values)
                  }
                />
              </Collapse.Panel>
            </Collapse>
          ))}
        </div>
        <MobileActionBar>
          <div className="buttons">
            <AppButton
              disabled={!Object.entries(this.state.selectedValues).length}
              size="large"
              onClick={() => this.clearMobileFilters()}
              block
            >
              پاک کردن همه
            </AppButton>
            <AppButton
              disabled={!Object.entries(this.state.selectedValues).length}
              size="large"
              onClick={() => this.triggerOnChange()}
              variant="primary"
              block
            >
              اعمال فیلتر
            </AppButton>
          </div>
        </MobileActionBar>
      </Container>
    );
  }
}

const Container = styled("div")`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 20px;
  background: #f5f5f5;
  z-index: 4;

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;

    .title {
      flex-grow: 1;
      font-size: 1.2em;
    }
  }

  .custom-collapse {
    border: 1px solid #00000040;

    &:not(:last-of-type) {
      margin-bottom: 16px;
    }

    .ant-collapse-header,
    .custom-collapse-panel {
      border-radius: 4px !important;
      border: none;
    }

    .ant-collapse-item-active {
      box-shadow: 0 0 3px 2px rgba(67, 153, 227, 0.3);
    }

    .ant-collapse-content {
      background-color: white;
      color: black;
      border: none;
    }

    .ant-collapse-content-box {
      padding: 16px 0;
      margin: 0 16px;
      border-top: 1px solid #00000017;
    }

    .ant-collapse-header {
      padding: 8px 12px;
      background: #fff;

      .ant-collapse-arrow {
        font-size: 0.7em;
        padding-top: 10px;
      }
    }

    .ant-checkbox-group-item {
      display: flex;
      font-size: 0.87em;

      &:not(:last-of-type) {
        margin-bottom: 12px;
      }
    }
  }
`;

const MobileActionBar = styled("div")`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: #fff;
  box-shadow: 0px -2px 4px rgba(22, 25, 49, 0.1);
  z-index: 5;

  .buttons {
    display: flex;

    > * {
      flex-grow: 1;
    }

    > *:not(:last-of-type) {
      margin-left: 20px;
    }
  }
`;
