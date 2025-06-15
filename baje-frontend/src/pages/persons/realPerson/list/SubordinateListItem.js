import { Collapse } from "antd";
import styled from "styled-components";
import AppButton from "components/general/AppButton";
import { config, pageNames } from "constant";
import React, { useState } from "react";
import { covetFormatDateToEn, covetFormatDateToFA, getLink } from "_helpers";
import ChevronWhite from "assets/images/icons/chevron-down-white.svg";
import { Link } from "react-router-dom";
import colors from "utils/colors";

const { Panel } = Collapse;

export default function SubordinateListItem({ data, idx, onClick }) {
  const [noCollapse, setnoCollapse] = useState(true);

  function relationValue(relation) {
    if (relation === "father") return "پدر";
    else if (relation === "mother") return "مادر";
    else if (relation === "daughter") return "فرزند دختر";
    else if (relation === "main") return "اصلی";
    else if (relation === "wife") return "همسر";
    else if (relation === "son") return "فرزند پسر";
  }

  return (
    <StyledCollapse
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          setnoCollapse((v) => !v);
        }
      }}
    >
      <Collapse
        bordered={false}
        className="custom-collapse"
        collapsible={!noCollapse}
        expandIcon={(state) => (
          <img
            src={ChevronWhite}
            style={{
              transform: state.isActive ? "rotate(180deg)" : "none",
            }}
            alt="بیشتر"
            width="11"
          />
        )}
      >
        <Panel
          header={
            <div className="m-0 text-white flex">
              <h4 className="insurance-title text-white mb-0 text-13">
                {data?.name + data?.last_name || "بدون عنوان"}
              </h4>
              <h4 className="insurance-date text-white mb-0 text-12">
                <span className="text-lime">
                  {relationValue(data.relation)}
                </span>
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
                  <InsuranceSubitem title="ردیف" value={idx + 1} />
                  {data.father_name && (
                    <InsuranceSubitem
                      title="نام پدر"
                      value={data.father_name}
                    />
                  )}
                  {data.father_name && (
                    <InsuranceSubitem
                      title="تاریخ تولد"
                      value={covetFormatDateToFA(data.birth_day)}
                    />
                  )}
                  {data.birth_day_place && (
                    <InsuranceSubitem
                      title="محل تولد"
                      value={data.birth_day_place}
                    />
                  )}
                  {data.national_id && (
                    <InsuranceSubitem title="کد ملی" value={data.national_id} />
                  )}
                  {data.national_number && (
                    <InsuranceSubitem
                      title="شماره شناسنامه "
                      value={data.national_number}
                    />
                  )}
                </tbody>
              </table>
            </>
          )}
        </Panel>
      </Collapse>
    </StyledCollapse>
  );
}

// sub components
export const InsuranceSubitem = ({ title, value, background }) => {
  return (
    <StyledSubItem
      className="insurance-subitem"
      style={{ backgroundColor: background || "auto" }}
    >
      <td>{title}</td>
      <td className="text-mid-black">{value}</td>
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
        padding-top: 0px;
        color: white;
      }

      .insurance-title {
        border-left: 1px solid rgba(255, 255, 255, 0.35);
        padding-left: 8px;
      }
      .insurance-date {
        padding-right: 8px;
      }
    }

    .links-list {
      li:not(:last-of-type) {
        margin-bottom: 10px;
      }
    }
    .people-btn {
      height: 44px;
      font-size: 14px;
    }
    .insurance-item-btns {
      a {
        flex: 1 0 50%;
        .people-btn {
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;
        }
      }
      & > .people-btn {
        flex: 1 0 50%;
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
      }
    }
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
  }
`;
