import React, { useEffect, useState } from "react";
import { Select, Input, Form, Modal, Popover, Spin } from "antd";
import { utils } from "react-modern-calendar-datepicker";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import {
  checkShamsi,
  compareDates,
  countOfNumInp,
  handleValidateNationalNumber,
  isAgeDifferenceGreaterThanXYears,
} from "_helpers";
import { findPlaceName } from "modules/personnel/realPerson/utils/index";
import axios from "api/appAxios";
import styled from "styled-components";
import InfoPopover from "components/InfoPopover";
import { RelationType } from "./FormItems";
import { getPersonData } from "modules/personnel/insurance/mobileInsuranceContracts/common/api";
import { GET_FAMILY, VALIDATE_NID } from "pages/persons/realPerson/utils/api";

//
const relations = [
  {
    label: "مادر",
    value: "mother",
  },
  {
    label: "پدر",
    value: "father",
  },
  {
    label: "همسر",
    value: "spouse",
  },
  {
    label: "فرزند پسر",
    value: "son",
  },
  {
    label: "فرزند دختر",
    value: "doughter",
  },
  {
    label: "خواهر",
    value: "sister",
  },
  {
    label: "برادر",
    value: "brother",
  },
  {
    label: "برادر (از پدر مشترک)",
    value: "brotherSameFather",
  },
  {
    label: "برادر (از مادر مشترک)",
    value: "brotherSameMother",
  },
  {
    label: "خواهر (از پدر مشترک)",
    value: "sisterSameFather",
  },
  {
    label: "خواهر (از مادر مشترک)",
    value: "sisterSameMother",
  },
  // {
  //   label: "پدر همسر",
  //   value: "fatherInLaw",
  // },
  // {
  //   label: "مادر همسر",
  //   value: "motherInLaw",
  // },
];
const sponershipStatuses = [
  {
    label: "تحت تکفل",
    value: "dependant",
  },
  {
    label: "غیر تحت تکفل",
    value: "independant",
  },
  {
    label: "خروج از تکفل",
    value: "quit",
  },
  {
    label: "نامشخص",
    value: "unknown",
  },
];
//
export default function EditableCell({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  form,
  mainRecord,
  subordinates,
  setPersonModal,
  relation,
  setFamilyData,
  newMemberFamilyData,
  setNewMemberFamilyData,
  familyData,
  familyMembers,
  setData,
  ...restProps
}) {
  // const handleOnChangenationalCode = (event) => {
  //   let result = handleValidatenationalCode(event.target.value);

  //   if (!result) {
  //     form.setFieldsValue({
  //       birth_day_place: "",
  //     });
  //     form.setFields([
  //       {
  //         name: "nationalCode",
  //         errors: ["کد ملی نامعتبر است"],
  //       },
  //     ]);
  //   } else {
  //     let cityName = findPlaceName(event.target.value);

  //     form.setFieldsValue({
  //       birth_day_place: cityName,
  //     });
  //   }
  // };
  const [relationHelp, setRelationHelp] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dataIndex === "nationalCode" && record.id && editing) {
      setLoading(true);
      getPersonData(record.id)
        .then((response) => {
          setLoading(false);
          setFamilyData(response.data);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  }, [editing]);

  function handleSelectChange(value) {
    if (dataIndex === "relation") {
      if (
        form.getFieldValue("nationalCode") &&
        form.getFieldValue("nationalCode").length === 10
      ) {
        axios
          .get(
            "/api/admin/personnel/lookup/" + form.getFieldValue("nationalCode")
          )
          .then((res) => {
            const findRelation = relations.find((i) => i.value === value);
            if (
              mainRecord.first_name &&
              res.data.first_name &&
              findRelation?.label
            ) {
              setRelationHelp(
                `${res.data.first_name + " " + res.data.last_name} ${
                  findRelation.label
                } ${mainRecord.first_name + " " + mainRecord.last_name} می باشد`
              );
            }
          });
      }
    }
  }

  function handleInputChange(e) {
    const value = e.target.value;

    if (dataIndex === "nationalCode") {
      if (value.length === 10) {
        setLoading(true);
        VALIDATE_NID(form.getFieldValue("nationalCode"))
          .then((res) => {
            getPersonData(res.data.id)
              .then((response) => {
                setFamilyData(response.data);
                const mappedData = subordinates.map((sub) => {
                  if (sub.key == record.key || sub.id == record.id) {
                    return {
                      ...sub,
                      firstName: response.data.first_name,
                      lastName: response.data.last_name,
                      insuranceNumber: response.data.insurance_number,
                    };
                  }
                  return sub;
                });
                setData(mappedData);

                GET_FAMILY(response.data.national_number).then((data) => {
                  setNewMemberFamilyData(data.data);
                  console.log("newMemberFamilyData:", data.data);
                  setLoading(false);
                });
              })
              .catch((err) => {
                setLoading(false);
              });
            if (form.getFieldValue("relation")) {
              const findRelation = relations.find(
                (i) => i.value === form.getFieldValue("relation")
              );
              if (
                mainRecord.first_name &&
                res.data.first_name &&
                findRelation?.label
              ) {
                setRelationHelp(
                  `${res.data.first_name + " " + res.data.last_name} ${
                    findRelation.label
                  } ${
                    mainRecord.first_name + " " + mainRecord.last_name
                  } می باشد`
                );
              }
            }
          })
          .catch((err) => {
            setLoading(false);
            if (
              err?.response?.status == 404 &&
              handleValidateNationalNumber(form.getFieldValue("nationalCode"))
            ) {
              Modal.confirm({
                content:
                  "کد ملی وارد شده در سامانه یافت نشد، لطفا ابتدا به نام نویسی ایشان اقدام فرمایید",
                okText: "تایید و نام نویسی",
                cancelText: "انصراف",
                onOk: () => setPersonModal(true),
              });
            }
          });
      }
    }
  }

  function getHelp() {
    if (dataIndex === "relation") {
      return relationHelp;
    }
  }

  function getFilteredRelations() {
    // can have only one mother and father and hide spouse related relations if doesn't have spouse and hide non compatible genders
    let filterKeys = [];
    const sex = familyData?.sex;
    if (sex) {
      filterKeys =
        sex === "m"
          ? [
              "mother",
              "sister",
              "doughter",
              "motherInLaw",
              "sisterSameMother",
              "sisterSameFather",
            ]
          : sex === "f"
          ? [
              "father",
              "brother",
              "son",
              "fatherInLaw",
              "brotherSameMother",
              "brotherSameFather",
            ]
          : [
              "mother",
              "sister",
              "doughter",
              "motherInLaw",
              "sisterSameMother",
              "sisterSameFather",
              "father",
              "brother",
              "son",
              "fatherInLaw",
              "brotherSameMother",
              "brotherSameFather",
            ];

      if (sex === mainRecord.sex) {
        filterKeys.push("spouse");
      }
    }

    if (subordinates && subordinates.length) {
      const hasWife = subordinates.some((i) => i.relation === "spouse");
      const hasMother = subordinates.some((i) => i.relation === "mother");
      const hasFather = subordinates.some((i) => i.relation === "father");

      if (hasFather && !record.id) {
        filterKeys.push("father");
      }
      if (hasMother && !record.id) {
        filterKeys.push("mother");
      }
      // if (!hasWife) {
      //   filterKeys.push("son");
      //  filterKeys.push("doughter");
      // }
    }

    // filter based on birth dates
    // console.log("main record:", mainRecord);
    // console.log("family members:", familyMembers);
    // console.log("family data:", familyData);
    // console.log("new member family members:", newMemberFamilyData);

    // filter based on birth date
    if (mainRecord?.birth_date && familyData?.birth_date) {
      const isMainOlder = compareDates(
        mainRecord.birth_date,
        familyData.birth_date
      );

      if (!isMainOlder) {
        filterKeys.push("son");
        filterKeys.push("doughter");
      } else {
        filterKeys.push("father");
        filterKeys.push("mother");
      }

      const isDiffMoreThan10Years = isAgeDifferenceGreaterThanXYears(
        mainRecord.birth_date,
        familyData.birth_date,
        10
      );
      if (!isDiffMoreThan10Years) {
        filterKeys.push("father");
        filterKeys.push("mother");
        filterKeys.push("son");
        filterKeys.push("doughter");
      }
    }

    // filter based on family member has parents
    if (newMemberFamilyData) {
      const familyHasParents =
        newMemberFamilyData?.father && newMemberFamilyData?.mother;
      if (familyHasParents) {
        filterKeys.push("son");
        filterKeys.push("doughter");
      }
    }

    if (filterKeys.length) {
      return filterKeys.length
        ? relations.filter((i) => !filterKeys.includes(i.value))
        : relations;
    }
    return relations;
  }

  const inputNode =
    inputType === "select" ? (
      <Select
        options={
          dataIndex === "relation" ? getFilteredRelations() : sponershipStatuses
        }
        onChange={handleSelectChange}
        disabled={!familyData}
        title={
          !familyData
            ? "لطفاً ابتدا کد ملی فرد تبعی را وارد نمایید."
            : " کاربر گرامی، اگر نسبت مدنظر شما در لیست زیر نمایش داده نشده، خواهشمند است نسبت به بازبینی جنسیت و تاریخ تولد فرد اصلی و تبعی اقدام فرمایید"
        }
        className="mr-1"
      />
    ) : (
      <Input
        disabled={dataIndex === "birth_day_place"}
        onChange={handleInputChange}
      />
    );
  return (
    <td {...restProps}>
      <Spin spinning={loading}>
        {!editing ? (
          children
        ) : dataIndex === "birth_day" ? (
          <CustomDatePicker
            plain={true}
            form={form}
            name={dataIndex}
            maximumDate={utils("fa").getToday()}
            rules={[
              {
                required: true,
                message: "فیلد تاریخ تولد اجباریست",
              },
              () => ({
                validator(rule, value) {
                  if (checkShamsi(value)) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject("فرمت تاریخ صحیح نیست");
                  }
                },
              }),
            ]}
          />
        ) : (
          <StyledWrapper
            className={dataIndex === "dependencyStatus" ? "flex" : ""}
          >
            <Form.Item
              name={dataIndex}
              style={{
                margin: 0,
                flexGrow: 1,
              }}
              help={getHelp()}
              rules={[
                {
                  required: true,
                  message: `این ورودی اجباری است`,
                },
                () => ({
                  validator(rule, value) {
                    if (dataIndex === "nationalCode") {
                      if (handleValidateNationalNumber(value)) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject("کد ملی صحیح نیست");
                      }
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
              normalize={(v, prevV) =>
                dataIndex === "nationalCode" ? countOfNumInp(v, prevV, 10) : v
              }
            >
              {inputNode}
            </Form.Item>
            {dataIndex === "dependencyStatus" ? (
              <InfoPopover>
                كاربر گرامي، منظور از تحت تكفل يعني اينكه آيا اين شخص در
                سازمانهاي بيمه اي، به تبع اين شخص بيمه است يا خير؟
              </InfoPopover>
            ) : (
              ""
            )}
            {/* {dataIndex === "relation" &&
            (relation === "brother" || relation === "sister") ? (
              <RelationType />
            ) : (
              ""
            )} */}
          </StyledWrapper>
        )}
      </Spin>
    </td>
  );
}

// css
const StyledWrapper = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  .ant-form-item-explain div {
    text-align: right;
    font-size: 12px;
  }
`;
