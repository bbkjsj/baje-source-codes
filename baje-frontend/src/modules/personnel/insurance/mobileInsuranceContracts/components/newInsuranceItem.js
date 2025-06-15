import React from "react";
import { Collapse, Modal } from "antd";
import styled from "styled-components";
import colors from "utils/colors";
import { DownOutlined } from "@ant-design/icons";
import AppButton from "components/general/AppButton";
import { covetFormatDateToFA, dateRangeOverlaps, getLink } from "_helpers";
import { Link } from "react-router-dom";
import ChevronWhite from "assets/images/icons/chevron-down-white.svg";
import { config, pageNames } from "constant";

const { Panel } = Collapse;

const NewInsuranceItem = ({
  data,
  idx,
  onClick,
  noCollapse,
  userInsurances,
}) => {
  function handleInsuranceSelect(e) {
    if (onClick) {
      e.preventDefault();

      // check if this insurance overlaps with other user's insurances
      if (userInsurances) {
        console.log(userInsurances);
        let overlapping = false;

        for (let ins of userInsurances) {
          if (
            dateRangeOverlaps(
              data.contract_date_from_date,
              data.to_date,
              ins.start_date,
              ins.end_date
            )
          ) {
            overlapping = true;
          }
        }
        if (overlapping) {
          Modal.confirm({
            content:
              "همکار گرامی دوره این قرارداد بیمه تکمیلی با دوره عضویت شما در سایر بیمه ها تداخل، و پرداخت حق بیمه مضاعف را برای جنابعالی به دنبال دارد، لطفا قبل از ثبت درخواست اطمینان حاصل فرمایید.",
            onOk: onClick,
          });
        } else {
          onClick();
        }
      } else {
        onClick();
      }
    }
  }

  return (
    <StyledCollapse>
      <Collapse
        bordered={false}
        className="custom-collapse"
        collapsible={!noCollapse}
        expandIcon={(state) =>
          !noCollapse ? (
            <img
              src={ChevronWhite}
              style={{ transform: state.isActive ? "rotate(180deg)" : "none" }}
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
              <h4 className="insurance-title text-white mb-0">
                {data.insurer_main || "بدون عنوان"}
              </h4>
              <h4 className="insurance-date text-white mb-0">
                از{" "}
                <span className="text-lime">
                  {covetFormatDateToFA(data.contract_date_from_date)}
                </span>{" "}
                تا{" "}
                <span className="text-lime">
                  {covetFormatDateToFA(data.to_date)}
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
                  {data.insurer_main && (
                    <InsuranceSubitem
                      title="بیمه گذار"
                      value={data.insurer_main}
                    />
                  )}
                  {data.insurer_company && (
                    <InsuranceSubitem
                      title="بیمه گر"
                      value={data.insurer_company}
                    />
                  )}
                  {data.contract_number && (
                    <InsuranceSubitem
                      title="شماره قرارداد"
                      value={data.contract_number}
                    />
                  )}
                  {data.id && (
                    <InsuranceSubitem title="کد یکتا" value={data.id} />
                  )}
                  {data.contract_date_from_date && (
                    <InsuranceSubitem
                      title="از تاریخ"
                      value={covetFormatDateToFA(data.contract_date_from_date)}
                    />
                  )}
                  {data.to_date && (
                    <InsuranceSubitem
                      title="تا تاریخ"
                      value={covetFormatDateToFA(data.to_date)}
                    />
                  )}
                </tbody>
              </table>
              <div className="flex insurance-item-btns">
                {data.pdf_file_url && (
                  <AppButton
                    className="people-btn flex-grow-1"
                    href={config.url.API_URL + data.pdf_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    تعهدات بیمه
                  </AppButton>
                )}

                <AppButton
                  className="people-btn flex-grow-1"
                  variant="primary"
                  onClick={handleInsuranceSelect}
                >
                  انتخاب
                </AppButton>
              </div>
            </>
          )}
        </Panel>
      </Collapse>
    </StyledCollapse>
  );
};

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
      justify-content: center;
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
        font-size: 12px;
      }
      .insurance-date {
        padding-right: 8px;
        font-size: 12px;
      }
    }

    .links-list {
      li:not(:last-of-type) {
        margin-bottom: 10px;
      }
    }
    .people-btn {
      height: 40px;
      font-size: 14px;
    }
    .insurance-item-btns {
      a {
        flex: 1 0 50%;
        /* .people-btn {
          border-top-left-radius: 0px;
          border-bottom-left-radius: 0px;
        } */
      }
      & > .people-btn {
        flex: 1 0 50%;
        /* border-top-right-radius: 0px;
        border-bottom-right-radius: 0px; */
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

export default NewInsuranceItem;
