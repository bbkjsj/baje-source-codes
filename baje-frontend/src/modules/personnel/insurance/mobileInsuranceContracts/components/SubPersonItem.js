import React, { useContext } from "react";
import { Collapse, Modal } from "antd";
import styled from "styled-components";
import { DownOutlined, CloseCircleTwoTone } from "@ant-design/icons";
import { covetFormatDateToFA, priceNormalizer } from "_helpers";
import colors from "utils/colors";
import { PersonSubitem } from "./PersonItem";
import dashed from "assets/images/dashed.svg";
import Chevron from "assets/images/icons/chevron-down-primary.svg";
import { persianRelations } from "../common/const";
import { InsuranceWizardContext } from "../contexts/InsuranceWizardContext";

const { Panel } = Collapse;

const SubPersonItem = ({ data, onDelete, is_deletable }) => {
  const { selectedInsurance } = useContext(InsuranceWizardContext);

  // get person insurance amount from context by relation
  function personInsuranceAmount() {
    if (
      data &&
      selectedInsurance &&
      data?.personnel_subordinate &&
      data?.personnel_subordinate?.relation
    ) {
      const ins = selectedInsurance;

      switch (data?.personnel_subordinate?.relation) {
        case "wife":
          return ins.spouse_insured;
        case "father":
          return ins.father_insured;
        case "mother":
          return ins.mother_insured;
        case "son":
          return ins.son_insured;
        case "daughter":
          return ins.doughter_insured;
        case "doughter":
          return ins.doughter_insured;
        default:
          return;
      }
    }
    return;
  }

  if (data?.personnel_subordinate) {
    return (
      <div className="flex w-100 align-start">
        <img
          src={dashed}
          alt="pre"
          className="ml-3"
          style={{ marginTop: "45px" }}
        />
        <StyledCollapse>
          <Collapse
            bordered={false}
            className="custom-collapse"
            expandIcon={(state) => (
              <img
                src={Chevron}
                style={{
                  transform: state.isActive ? "rotate(180deg)" : "none",
                }}
                alt="بیشتر"
                width="12"
              />
            )}
          >
            <Panel
              header={
                <div className="m-0 text-white flex">
                  <h4 className="sub-person-type text-primary mb-0 text-14">
                    {(data?.personnel_subordinate &&
                      persianRelations[data?.personnel_subordinate.relation]) ||
                      (data?.personnel_subordinate &&
                        data?.personnel_subordinate.relation)}
                  </h4>
                  {data?.personnel_subordinate && (
                    <h4 className="sub-person-name text-high-black mb-0 text-13">
                      {data?.personnel_subordinate?.first_name +
                        " " +
                        data?.personnel_subordinate?.last_name}
                    </h4>
                  )}
                </div>
              }
              className="custom-collapse-panel"
            >
              <table className="sub-items w-100">
                <colgroup>
                  <col span="1" style={{ width: "35%" }} />
                  <col span="1" style={{ width: "65%" }} />
                </colgroup>

                <tr className="d-none">
                  <th>عنوان</th>
                  <th>مقدار</th>
                </tr>

                {data?.personnel_subordinate &&
                  data?.personnel_subordinate.first_name && (
                    <PersonSubitem
                      title="نام"
                      value={data?.personnel_subordinate.first_name}
                    />
                  )}
                {data?.personnel_subordinate &&
                  data?.personnel_subordinate.last_name && (
                    <PersonSubitem
                      title="نام خانوادگی"
                      value={data?.personnel_subordinate.last_name}
                    />
                  )}
                {data?.personnel_subordinate &&
                  data?.personnel_subordinate.national_code && (
                    <PersonSubitem
                      title="کد ملی"
                      value={data?.personnel_subordinate.national_code}
                    />
                  )}
                {data.start_date && (
                  <PersonSubitem
                    title="تاریخ شروع"
                    value={covetFormatDateToFA(data.start_date)}
                  />
                )}
                {data.end_date && (
                  <PersonSubitem
                    title="تاریخ پایان"
                    value={covetFormatDateToFA(data.end_date)}
                  />
                )}
                {personInsuranceAmount() && (
                  <PersonSubitem
                    title="حق بیمه (ریال)"
                    value={priceNormalizer(personInsuranceAmount())}
                  />
                )}
              </table>
            </Panel>
          </Collapse>
        </StyledCollapse>

        {is_deletable && (
          <CloseCircleTwoTone
            twoToneColor={colors["error-color"]}
            className="mr-3 pointer text-20"
            style={{ marginTop: "37px" }}
            onClick={() => {
              if (onDelete) {
                Modal.confirm({
                  content: "آیا از حذف این فرد تبعی اطمینان دارید؟",
                  onOk: () => {
                    onDelete(data?.personnel_subordinate.id);
                  },
                });
              }
            }}
          />
        )}
      </div>
    );
  } else {
    return "";
  }
};

// css
const StyledCollapse = styled.div`
  margin-top: 25px;

  flex-grow: 1;
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
      border-radius: 0px 0px 4px 4px;
      border: 1px solid #7dafdd;
    }

    .ant-collapse-header {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      padding-left: 20px !important;
      padding-right: 20px !important;
      background-color: white !important;
      box-shadow: 0px 0px 0px 2px rgba(125, 175, 221, 0.3);

      .ant-collapse-arrow {
        position: static;
        margin-right: auto;
        padding-top: 0px;
        color: ${colors.primary};
      }

      .sub-person-type {
        border-left: 1px solid ${colors["light-primary"]};
        padding-left: 8px;
      }
      .sub-person-name {
        padding-right: 8px;
      }
    }
  }
`;

export default SubPersonItem;
