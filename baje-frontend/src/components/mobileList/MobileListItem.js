import { DownOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import React from "react";
import moment from "moment-jalaali";
import styled from "styled-components";
import { Checkbox, Collapse, Dropdown, Menu } from "antd";
//
import colors from "utils/colors";
import AppButton from "components/general/AppButton";
import { CheckAccess } from "AuxComponent/CheckAccess";
import ChevronWhite from "assets/images/icons/chevron-down-white.svg";

const { Panel } = Collapse;

const MobileListItem = ({
  data,
  idx,
  onClick,
  noCollapse,
  onSelectedChange,
  selected,
  tableData,
  itemActions,
  singleAction,
  titleKeys,
  titleSeparator,
  viewLink,
  noRowNum,
  mobileItemsTitle,
  mobileItemColors,
}) => {
  //-------------- functions --------------//
  function handleChecked(e) {
    if (e.target.checked) {
      onSelectedChange([data.id]);
    } else {
      onSelectedChange([]);
    }
  }

  function getItemRows() {
    return tableData.reduce((acc, item, idx) => {
      if (item.hideMobile) {
        return acc;
      }
      return [
        ...acc,
        <MobileListSubItem
          key={idx}
          title={item.title}
          value={
            item.value && typeof item.value === "function"
              ? item.value(data, idx)
              : "-"
          }
        />,
      ];
    }, []);
  }

  function getTitle() {
    return mobileItemsTitle
      ? mobileItemsTitle(data)
      : titleKeys &&
          titleKeys.map((i, idx) => (
            <span key={idx}>
              {!!Date.parse(data[i])
                ? moment(data[i]).format("jYYYY/jMM/jDD")
                : data[i]}

              {idx < titleKeys.length - 1 ? titleSeparator : ""}
            </span>
          ));
  }
  //-------------- template --------------//
  let menu;
  if (itemActions && itemActions.length) {
    const menuItems = itemActions
      .filter((item) => {
        if (item.hide) {
          return item.hide(data);
        }
        return true;
      })
      .map((i, idx) => {
        const item = (
          <Menu.Item key={idx} onClick={() => i.onClick(data, idx)}>
            {i.name}
          </Menu.Item>
        );

        if (i.permission) {
          return (
            <CheckAccess key={idx} permission={i.permission}>
              {item}
            </CheckAccess>
          );
        }

        return item;
      });

    if (menuItems.length) {
      menu = <Menu>{menuItems}</Menu>;
    }
  }

  return (
    <StyledCollapse
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      itemColor={mobileItemColors ? mobileItemColors(data) : null}
    >
      {selected && onSelectedChange && (
        <Checkbox
          checked={selected.length && selected[0] == data.id}
          disabled={selected.length > 1}
          onChange={handleChecked}
        ></Checkbox>
      )}
      <Collapse
        bordered={false}
        className="custom-collapse"
        collapsible={!noCollapse}
        expandIcon={(state) =>
          !noCollapse ? (
            <img
              src={ChevronWhite}
              style={{
                transform: state.isActive ? "rotate(180deg)" : "none",
              }}
              alt="بیشتر"
              width="11"
            />
          ) : (
            ""
          )
        }
      >
        <Panel
          header={
            <div className="m-0 text-white flex">
              <h4 className="mobileitem-title text-white mb-0 text-12">
                {getTitle()}
              </h4>
            </div>
          }
          className="custom-collapse-panel"
        >
          {!noCollapse && (
            <>
              <table className="sub-items w-100">
                <colgroup>
                  <col span="1" style={{ width: "35%" }} />
                  <col span="1" style={{ width: "65%" }} />
                </colgroup>

                <thead className="d-none">
                  <tr className="d-none">
                    <th>عنوان</th>
                    <th>مقدار</th>
                  </tr>
                </thead>

                <tbody>
                  {!noRowNum && (
                    <MobileListSubItem title="ردیف" value={idx + 1} />
                  )}
                  {getItemRows()}
                </tbody>
              </table>
              {(menu || viewLink || singleAction) && (
                <div className="flex insurance-item-btns">
                  {singleAction && (
                    <AppButton
                      className="item-btn"
                      onClick={() => singleAction.onClick(data)}
                    >
                      {singleAction.name}
                    </AppButton>
                  )}

                  {viewLink && !singleAction && (
                    <Link to={viewLink(data)}>
                      <AppButton
                        className={`item-btn ${menu ? "no-radius" : ""}`}
                      >
                        مشاهده
                      </AppButton>
                    </Link>
                  )}
                  {menu && !singleAction && (
                    <Dropdown overlay={menu} trigger={["click"]}>
                      <AppButton
                        className={`item-btn ${viewLink ? "no-radius" : ""}`}
                      >
                        گزینه ها <DownOutlined />
                      </AppButton>
                    </Dropdown>
                  )}
                </div>
              )}
            </>
          )}
        </Panel>
      </Collapse>
    </StyledCollapse>
  );
};

//-------------- sub components --------------//
const MobileListSubItem = ({ title, value, background }) => {
  return (
    <StyledSubItem
      className="mobileitem-subitem"
      style={{ backgroundColor: background || "auto" }}
    >
      <td>{title}</td>
      <td className="text-mid-black">{value}</td>
    </StyledSubItem>
  );
};

//-------------- styles --------------//
const StyledCollapse = styled.div`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  .custom-collapse {
    flex-grow: 1;
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
      width: 100%;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      padding-left: 20px !important;
      padding-right: 20px !important;
      background: ${(props) => props.itemColor || colors.primary};

      .ant-collapse-arrow {
        position: static;
        margin-right: auto;
        padding-top: 0px;
        color: white;
      }

      /* .mobileitem-title {
        border-left: 1px solid rgba(255, 255, 255, 0.35);
        padding-left: 8px;
      } */
      .mobileitem-date {
        padding-right: 8px;
      }
    }

    .links-list {
      li:not(:last-of-type) {
        margin-bottom: 10px;
      }
    }
    .item-btn {
      height: 44px;
      font-size: 13px;
    }

    .actions-container {
      background-color: #f5f5f5;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      border: 1px solid #ececec;
      border-top: none;
    }
  }

  .ant-checkbox-wrapper {
    margin-left: 8px;
    margin-top: 10px;
  }

  .insurance-item-btns {
    a {
      flex: 1 0 50%;
      .item-btn {
        width: 100%;
        &.no-radius {
          border-top-left-radius: 0px;
          border-bottom-left-radius: 0px;
        }
      }
    }
    & > .item-btn {
      flex: 1 0 50%;
      &.no-radius {
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
      }
    }
  }

  td {
    font-size: 12px;
  }
`;

const StyledSubItem = styled.tr`
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.09);
  border-top: none;

  h4 {
    font-weight: 500;
    margin-bottom: 0px;
  }
  &:nth-of-type(even) {
    background-color: rgba(0, 0, 0, 0.04);
  }

  td {
    padding: 10px 16px;
    padding-bottom: 8px;
    word-break: break-word;
  }
`;

export default MobileListItem;
