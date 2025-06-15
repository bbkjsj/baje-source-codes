import React from "react";
import { Collapse } from "antd";
import styled from "styled-components";
import colors from "utils/colors";
import { DownOutlined } from "@ant-design/icons";
import AppButton from "components/general/AppButton";
import { covetFormatDateToFA, getLink } from "_helpers";
import { Link } from "react-router-dom";
import ChevronWhite from "assets/images/icons/chevron-down-white.svg";
import { pageNames } from "constant";
import { config } from "constant";

const { Panel } = Collapse;

const InsuranceItem = ({ data, idx, onClick, noCollapse }) => {
  return (
    <StyledCollapse
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
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
              <h4 className="insurance-title text-white mb-0 text-13">
                {data?.insurance.insurer_main || "بدون عنوان"}
              </h4>
              <h4 className="insurance-date text-white mb-0 text-12">
                از{" "}
                <span className="text-lime">
                  {covetFormatDateToFA(data.start_date)}
                </span>{" "}
                تا{" "}
                <span className="text-lime">
                  {covetFormatDateToFA(data.end_date)}
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
                  {data.insurance.insurer_main && (
                    <InsuranceSubitem
                      title="بیمه گذار"
                      value={data.insurance.insurer_main}
                    />
                  )}
                  {data.insurance.insurer_company && (
                    <InsuranceSubitem
                      title="بیمه گر"
                      value={data.insurance.insurer_company}
                    />
                  )}
                  {data.insurance.contract_number && (
                    <InsuranceSubitem
                      title="شماره قرارداد"
                      value={data.insurance.contract_number}
                    />
                  )}
                  {data.insurance.id && (
                    <InsuranceSubitem
                      title="کد یکتا"
                      value={data.insurance.id}
                    />
                  )}
                  {data.insurance.contract_date_from_date && (
                    <InsuranceSubitem
                      title="از تاریخ"
                      value={covetFormatDateToFA(
                        data.insurance.contract_date_from_date
                      )}
                    />
                  )}
                  {data.insurance.to_date && (
                    <InsuranceSubitem
                      title="تا تاریخ"
                      value={covetFormatDateToFA(data.insurance.to_date)}
                    />
                  )}

                  <InsuranceSubitem
                    title="وضعیت"
                    value={
                      data.is_approved == 1
                        ? "تایید شده"
                        : data.is_approved == 0
                        ? "عدم تایید"
                        : "در حال بررسی"
                    }
                  />
                </tbody>
              </table>
              <div className="flex insurance-item-btns">
                {data.pdf_file_url && (
                  <AppButton
                    className="people-btn"
                    href={config.url.API_URL + data.insurance.pdf_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    تعهدات بیمه
                  </AppButton>
                )}
                <Link
                  to={
                    getLink(
                      pageNames.personnel.insurance.supplymentary.contracts
                        .view,
                      {
                        id: data.insurance_id_fk,
                      }
                    ) +
                    "?insurance_id=" +
                    data.id
                  }
                >
                  <AppButton className="people-btn w-100">
                    مشاهده لیست افراد
                  </AppButton>
                </Link>
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

export default InsuranceItem;
