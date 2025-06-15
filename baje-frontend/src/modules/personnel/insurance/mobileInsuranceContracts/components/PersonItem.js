import React, { useContext } from "react";
import { Collapse, Modal } from "antd";
import styled from "styled-components";
import { DownOutlined, CloseCircleTwoTone } from "@ant-design/icons";
import { covetFormatDateToFA, priceNormalizer } from "_helpers";
import colors from "utils/colors";
import SubPersonItem from "./SubPersonItem";
import Chevron from "assets/images/icons/chevron-down-primary.svg";
import NewSubPersonItem from "./NewSubPersonItem";
import { InsuranceWizardContext } from "../contexts/InsuranceWizardContext";

const { Panel } = Collapse;

const PersonItem = ({ data, onDelete, selectedPeople }) => {
  let subordinateItems;
  let newSubordinateItems;
  const {
    selectedInsurance,
    setSelectedInsurance,
    setSelectedPeople,
  } = useContext(InsuranceWizardContext);

  // for editing: delete person from the retrieved insurance object
  const deleteSubPerson = (id) => {
    console.log(id);
    if (selectedInsurance?.insurance_takmili_subordinates) {
      const newSubordinates = selectedInsurance.insurance_takmili_subordinates.filter(
        (sub) => sub.personnel_subordinate && sub.personnel_subordinate.id != id
      );
      setSelectedInsurance({
        ...selectedInsurance,
        insurance_takmili_subordinates: newSubordinates,
      });
    }
  };

  // for creating: delete person from the selected people context
  const deleteNewPerson = (id) => {
    if (selectedPeople && selectedPeople?.subordinates.length) {
      const newSubordinates = selectedPeople.subordinates.filter(
        (sub) => sub.id != id
      );
      setSelectedPeople({
        ...selectedPeople,
        subordinates: newSubordinates,
      });
    }
  };

  if (data && data.insurance_takmili_subordinates) {
    subordinateItems = data.insurance_takmili_subordinates.map((sub) => {
      return (
        <SubPersonItem
          data={sub}
          onDelete={deleteSubPerson}
          is_deletable={!data.is_approved && !data.is_deleted}
        />
      );
    });
  }
  if (selectedPeople.subordinates) {
    newSubordinateItems = selectedPeople.subordinates.map((sub) => {
      return (
        <NewSubPersonItem
          data={sub}
          onDelete={deleteNewPerson}
          is_deletable={true}
        />
      );
    });
  }

  return (
    <div className="flex w-100 align-start">
      <StyledCollapse>
        <Collapse
          bordered={false}
          className="custom-collapse"
          expandIcon={(state) => (
            <img
              src={Chevron}
              style={{ transform: state.isActive ? "rotate(180deg)" : "none" }}
              alt="بیشتر"
              width="12"
            />
          )}
        >
          <Panel
            header={
              <div className="m-0 text-white flex">
                <h4 className="person-type text-primary mb-0 text-14">اصلی</h4>
                <h4 className="person-name text-high-black mb-0 text-13">
                  {data && data.personnel
                    ? data?.personnel?.first_name +
                      " " +
                      data?.personnel?.last_name
                    : selectedPeople.person &&
                      selectedPeople.person?.first_name +
                        " " +
                        selectedPeople.person?.last_name}
                </h4>
              </div>
            }
            className="custom-collapse-panel"
          >
            <table className="sub-items w-100">
              <colgroup>
                <col span="1" style={{ width: "35%" }} />
                <col span="1" style={{ width: "65%" }} />
              </colgroup>

              <thead>
                <tr className="d-none">
                  <th>عنوان</th>
                  <th>مقدار</th>
                </tr>
              </thead>

              <tbody>
                {data && data.personnel ? (
                  <>
                    {data.personnel.first_name && (
                      <PersonSubitem
                        title="نام"
                        value={data.personnel.first_name}
                      />
                    )}
                    {data.personnel.last_name && (
                      <PersonSubitem
                        title="نام خانوادگی"
                        value={data.personnel.last_name}
                      />
                    )}
                    {data.personnel.national_code && (
                      <PersonSubitem
                        title="کد ملی"
                        value={data.personnel.national_code}
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
                    {data.main_insured && (
                      <PersonSubitem
                        title="حق بیمه (ریال)"
                        value={priceNormalizer(data.main_insured.toString())}
                      />
                    )}
                  </>
                ) : (
                  selectedPeople.person && (
                    <>
                      {selectedPeople.person.first_name && (
                        <PersonSubitem
                          title="نام"
                          value={selectedPeople.person.first_name}
                        />
                      )}
                      {selectedPeople.person.last_name && (
                        <PersonSubitem
                          title="نام خانوادگی"
                          value={selectedPeople.person.last_name}
                        />
                      )}
                      {selectedPeople.person.national_code && (
                        <PersonSubitem
                          title="کد ملی"
                          value={selectedPeople.person.national_code}
                        />
                      )}
                      {data.main_insured && (
                        <PersonSubitem
                          title="حق بیمه (ریال)"
                          value={priceNormalizer(data.main_insured.toString())}
                        />
                      )}
                    </>
                  )
                )}
              </tbody>
            </table>
          </Panel>
        </Collapse>
        {(subordinateItems || newSubordinateItems) && (
          <div className="subordinates">
            {subordinateItems && subordinateItems}
            {newSubordinateItems && newSubordinateItems}
          </div>
        )}
      </StyledCollapse>

      {((data && !data.is_approved && !data.is_deleted) || selectedPeople) && (
        <CloseCircleTwoTone
          twoToneColor={colors["error-color"]}
          className="mr-3 pointer text-20 mt-3"
          onClick={() => {
            if (onDelete) {
              Modal.confirm({
                title:
                  "با حذف فرد اصلی، کلیه افراد تبعی موجود در لیست حذف خواهند شد.",
                content: "آیا از حذف این فرد اطمینان دارید؟",
                onOk: () => {
                  onDelete(data.id);
                },
              });
            }
          }}
        />
      )}
    </div>
  );
};

// sub components
export const PersonSubitem = ({ title, value, background }) => {
  return (
    <StyledSubItem
      className="person-subitem"
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
      background: #e5eff8;
      box-shadow: 0px 0px 0px 2px rgba(125, 175, 221, 0.3);

      .ant-collapse-arrow {
        position: static;
        margin-right: auto;
        padding-top: 0px;
        color: ${colors.primary};
      }

      .person-type {
        border-left: 1px solid #ffffff;
        padding-left: 8px;
      }
      .person-name {
        padding-right: 8px;
      }
    }
  }

  .subordinates {
    border-right: 1px dashed rgba(0, 0, 0, 0.25);
    margin-top: 8px;
    width: 100%;
    transform: translateX(-35px);
  }
`;

const StyledSubItem = styled.tr`
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.09);
  border-top: none;
  width: 100%;

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
    font-size: 12px;
  }
`;

export default PersonItem;
