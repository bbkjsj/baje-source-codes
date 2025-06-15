import MobileInsuranceHeader from "components/layouts/mobileInsurance/MobileInsuranceHeader";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { Link, useParams, useHistory, useLocation } from "react-router-dom";
import { UserAddOutlined } from "@ant-design/icons";
import AppButton from "components/general/AppButton";
import emptyList from "assets/icons/empty-list.svg";
import BottomButtons from "./components/BottomButtons";
import PersonItem from "./components/PersonItem";
import { covetFormatDateToFA, getLink, priceNormalizer } from "_helpers";
import { Modal, Spin } from "antd";
import {
  addInsurance,
  deleteInsurance,
  editInsurance,
  getInsurance,
  getUserInsurance,
} from "./common/api";
import { handleExceptions } from "./common/exceptions";
import { InsuranceWizardContext } from "./contexts/InsuranceWizardContext";
import { number } from "prop-types";
import { pageNames } from "constant";
import { UserContext } from "contex/User-context";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

const PeopleList = ({ newList }) => {
  const {
    selectedInsurance,
    setSelectedInsurance,
    selectedPeople,
    setSelectedPeople,
  } = useContext(InsuranceWizardContext);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const history = useHistory();
  const userData = useWhoAmI();

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery();

  const deletePerson = () => {
    setSelectedPeople({ person: null, subordinates: [] });
    if (selectedInsurance) {
      setSelectedInsurance({
        ...selectedInsurance,
        personnel: undefined,
        insurance_takmili_subordinates: undefined,
      });
    }
  };

  useEffect(() => {
    // get insurance data if we haven't already fetched it, because I'd rather not to call the api every time we go to addSubordinate page and goback
    if (!selectedInsurance) {
      setLoading(true);

      let action = getUserInsurance;

      if (newList) {
        action = getInsurance;
      }
      action(params.id)
        .then((res) => {
          setLoading(false);
          if (res && res.data && res.data.response) {
            const data = res.data.response;
            if (!newList) {
              data.personnel = userData;
            }
            setSelectedInsurance(data);
          } else {
            handleExceptions();
          }
        })
        .catch((err) => {
          setLoading(false);
          handleExceptions(err);
        });
    }
  }, []);

  // handle new list creation and editing existing lists in this function according to the newList prop and context
  const submitList = () => {
    if (newList) {
      if (selectedPeople.person) {
        let subordinates;

        if (selectedPeople.subordinates && selectedPeople.subordinates.length) {
          subordinates = selectedPeople.subordinates.map((sub) => {
            return {
              id: sub.id,
              description: sub.first_name + " " + sub.last_name,
            };
          });
        }
        const body = {
          insuranceId: params.id,
          description: `لیست بیمه جدید - ${selectedPeople.person.last_name}`,
        };

        if (subordinates) {
          body.subordinates = subordinates;
        }

        setLoading(true);
        addInsurance(body)
          .then((res) => {
            setLoading(false);
            Modal.success({
              title: "همکار گرامی لیست بیمه تکمیلی جنابعالی تکمیل شد",
              content: `شما می توانید حداکثر تا قبل از تایید لیست، با مراجعه به سامانه، مجددا" نسبت به اعمال تغییرات اقدام نمایید. باتشکر، سامانه باجه`,
              onOk: history.replace(
                pageNames.personnel.insurance.supplymentary.contracts.list
              ),
            });
          })
          .catch((err) => {
            setLoading(false);
            handleExceptions(err);
          });
      } else {
        Modal.warn({
          content:
            "لطفا ابتدا افراد تحت بیمه را در منوی اضافه کردن افراد انتخاب کنید",
        });
      }
    } else {
      // edit a list if not approved
      if (!selectedInsurance.is_approved) {
        if (selectedInsurance.personnel || selectedPeople.person) {
          let subordinates = [];

          const person = selectedInsurance.personnel || selectedPeople.person;

          if (
            selectedInsurance &&
            selectedInsurance.insurance_takmili_subordinates
          ) {
            // get both existing subordinates and new ones
            const cleanSubordinates = selectedInsurance.insurance_takmili_subordinates.filter(
              (i) => i.personnel_subordinate
            );

            subordinates = cleanSubordinates.map((sub) => {
              return {
                id: sub.personnel_subordinate.id,
                description:
                  sub?.personnel_subordinate?.first_name +
                  " " +
                  sub?.personnel_subordinate?.last_name,
              };
            });
          }

          if (selectedPeople.subordinates.length) {
            for (let sub of selectedPeople.subordinates) {
              subordinates.push({
                id: sub.id,
                description: sub.first_name + " " + sub.last_name,
              });
            }
          }

          //if (subordinates.length) {
          // remove duplicate subordinates if any...
          if (subordinates.length) {
            subordinates = subordinates.filter(
              (v, i, a) => a.findIndex((t) => t.id === v.id) === i
            );
          }

          const body = {
            description: `ویرایش لیست بیمه - ${person.last_name}`,
            subordinates,
          };

          // if (subordinates.length) {
          //   body.subordinates = subordinates;
          // }

          setLoading(true);
          editInsurance(query.get("insurance_id"), body)
            .then((res) => {
              setLoading(false);
              Modal.success({
                title: "همکار گرامی لیست بیمه تکمیلی جنابعالی بروزرسانی شد",
                content: `شما می توانید حداکثر تا قبل از تایید لیست، با مراجعه به سامانه، مجددا" نسبت به اعمال تغییرات اقدام نمایید. باتشکر، سامانه باجه`,
                onOk: history.replace(
                  pageNames.personnel.insurance.supplymentary.contracts.list
                ),
              });
            })
            .catch((err) => {
              setLoading(false);
              handleExceptions(err);
            });
          // } else {
          //   Modal.warn({
          //     content:
          //       "لطفا ابتدا افراد تحت بیمه را در منوی اضافه کردن افراد انتخاب کنید",
          //   });
          // }
        } else {
          Modal.confirm({
            content:
              "شما تمام افراد این لیست بیمه را حذف کردید، آیا مایل به حذف این لیست بیمه هستید؟",
            onOk: deleteInsuranceList,
          });
        }
      } else {
        Modal.warn({ content: "امکان ویرایش لیست بیمه تایید شده وجود ندارد" });
      }
    }
  };

  // delete insurance list if no person left even the user himself
  function deleteInsuranceList() {
    setLoading(true);

    deleteInsurance(query.get("insurance_id"))
      .then((res) => {
        Modal.success({
          content: "لیست بیمه با موفقیت حذف شد",
          onOk: history.replace(
            pageNames.personnel.insurance.supplymentary.contracts.list
          ),
          cancelText: "انصراف",
        });
      })
      .catch((err) => {
        setLoading(false);
        handleExceptions(err);
      });
  }

  // total insured amount
  function totalInsuredAmount() {
    if (selectedInsurance && selectedInsurance.insurance_takmili_subordinates) {
      let totalAmount = selectedInsurance.main_insured
        ? parseFloat(selectedInsurance.main_insured)
        : 0;
      for (let sub of selectedInsurance.insurance_takmili_subordinates) {
        if (sub.personnel_subordinate) {
          let relation = sub.personnel_subordinate?.relation;

          // no other choice with this api :/
          switch (relation) {
            case "wife":
              relation = "spouse_insured";
              break;
            case "father":
              relation = "father_insured";
              break;
            case "mother":
              relation = "mother_insured";
              break;
            case "son":
              relation = "son_insured";
              break;
            case "daughter":
              relation = "doughter_insured";
              break;
            case "doughter":
              relation = "doughter_insured";
              break;
            default:
              relation = relation + "_insured";
          }

          if (selectedInsurance[relation]) {
            totalAmount += parseFloat(selectedInsurance[relation]);
          }
        }
      }
      return totalAmount;
    }
    return 0;
  }

  // total selected people insured amount
  function selectedInsuredAmount() {
    if (
      selectedPeople &&
      selectedPeople.subordinates &&
      selectedPeople.subordinates.length
    ) {
      let totalAmount = newList
        ? parseFloat(selectedInsurance.main_insured)
        : 0;
      for (let sub of selectedPeople.subordinates) {
        let relation = sub.relation;

        // no other choice with this api :/
        switch (relation) {
          case "wife":
            relation = "spouse_insured";
            break;
          case "father":
            relation = "father_insured";
            break;
          case "mother":
            relation = "mother_insured";
            break;
          case "son":
            relation = "son_insured";
            break;
          case "daughter":
            relation = "doughter_insured";
            break;
          case "doughter":
            relation = "doughter_insured";
            break;
          default:
            relation = relation + "_insured";
        }

        if (selectedInsurance && selectedInsurance[relation]) {
          totalAmount += parseFloat(selectedInsurance[relation]);
        }
      }
      return totalAmount;
    }
    return 0;
  }

  // number of insured people
  // get number of insured people
  function numberOfInsuredPeople() {
    let count = 1;
    if (
      selectedInsurance &&
      selectedInsurance.insurance_takmili_subordinates &&
      selectedInsurance.insurance_takmili_subordinates.length
    ) {
      count += selectedInsurance.insurance_takmili_subordinates.length;
    }

    if (selectedPeople.subordinates.length) {
      count += selectedPeople.subordinates.length;
    }
    return count;
  }

  // layout
  return (
    <Spin spinning={loading}>
      <div className="fade-in h-100">
        <PeopleListHeader className="w-100">
          <MobileInsuranceHeader
            title={
              selectedInsurance && selectedInsurance.insurance
                ? selectedInsurance.insurance.insurer_main
                : newList
                ? "لیست بیمه جدید"
                : "جزئیات قرارداد"
            }
          />

          {selectedInsurance && (
            <>
              <p className="text-12 text-light-black text-center mb-0">
                اطلاعات قرارداد به شماره
                <span className="text-primary text-14 mr-1">
                  {selectedInsurance?.insurance?.contract_number ||
                    selectedInsurance?.contract_number}
                </span>
              </p>
              <StyledContractInfo className="bg-trans-gray px-3 py-2 rounded-corners flex mt-1">
                <span className="text-mid-black text-medium">
                  {selectedInsurance?.insurance &&
                    selectedInsurance.insurance.insurer_main}
                  {selectedInsurance?.insurer_main &&
                    selectedInsurance.insurer_main}
                </span>
                <div className="separator"></div>
                <span className="text-mid-black text-medium">
                  {selectedInsurance.insurance &&
                    selectedInsurance.insurance.contract_date_from_date &&
                    covetFormatDateToFA(
                      selectedInsurance.insurance.contract_date_from_date
                    )}
                  {selectedInsurance &&
                    selectedInsurance.contract_date_from_date &&
                    covetFormatDateToFA(
                      selectedInsurance.contract_date_from_date
                    )}
                </span>
                <div className="separator"></div>
                <span className="text-success text-medium">
                  {selectedInsurance.insurance &&
                    selectedInsurance.insurance.to_date &&
                    covetFormatDateToFA(selectedInsurance.insurance.to_date)}
                  {selectedInsurance &&
                    selectedInsurance.to_date &&
                    covetFormatDateToFA(selectedInsurance.to_date)}
                </span>
              </StyledContractInfo>
            </>
          )}
        </PeopleListHeader>

        {selectedInsurance && (
          <InsurancePeopleContainer className="w-100">
            <Link
              to={
                newList
                  ? getLink(
                      pageNames.personnel.insurance.supplymentary.contracts
                        .subordinate.add,
                      {
                        id: params.id,
                      }
                    )
                  : getLink(
                      pageNames.personnel.insurance.supplymentary.contracts
                        .subordinate.edit,
                      {
                        id: params.id,
                      }
                    )
              }
            >
              <AppButton icon={<UserAddOutlined />} className="full-btn mt-3">
                اضافه کردن افراد
              </AppButton>
            </Link>
            {(selectedInsurance && selectedInsurance.personnel) ||
            selectedPeople.person ? (
              <div className="mt-4">
                <PersonItem
                  data={selectedInsurance}
                  selectedPeople={selectedPeople || null}
                  onDelete={deletePerson}
                />
              </div>
            ) : (
              <>
                <img src={emptyList} className="empty-img" alt="لیست خالی" />
                <p className="text-12 text-center text-light-black mt-3">
                  در حال حاظر لیست مربوطه خالیست
                </p>
                <p className="text-12 text-center text-primary mt-2">
                  میتوانید با استفاده از دکمه بالا افراد را به لیست اضافه نمایید
                </p>
              </>
            )}

            {(selectedInsurance &&
              selectedInsurance.insurance_takmili_subordinates) ||
            selectedPeople.subordinates.length ? (
              <div className="summery mt-1 mb-3">
                <p className="text-mid-black text-12">
                  تعداد نفرات عضو بیمه:
                  <span className="text-14 text-full-black mr-5">
                    {numberOfInsuredPeople()} نفر
                  </span>
                </p>

                {totalInsuredAmount() || selectedInsuredAmount() ? (
                  <p className="text-mid-black text-12 mt-1">
                    حق بیمه ماهیانه (ریال):
                    <span className="text-14 text-full-black mr-5">
                      {priceNormalizer(
                        (
                          totalInsuredAmount() + selectedInsuredAmount()
                        ).toString()
                      )}
                    </span>
                  </p>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
            <BottomButtons onSave={submitList} />
          </InsurancePeopleContainer>
        )}
      </div>
    </Spin>
  );
};

// css
const StyledContractInfo = styled.div`
  justify-content: space-around;
  .separator {
    width: 1px;
    height: 29px;
    background-color: rgba(0, 0, 0, 0.25);
  }
`;

const InsurancePeopleContainer = styled.div`
  padding-top: 148px;
  padding-bottom: 56px;
  .empty-img {
    width: 120px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-top: 60px;
  }
  .summery {
    background: rgba(0, 0, 0, 0.02);
    border: 1px dashed rgba(0, 0, 0, 0.09);
    border-radius: 8px;
    padding: 10px 50px;
  }
`;

const PeopleListHeader = styled.div`
  background-color: white;
  box-shadow: 0px 2px 4px rgba(22, 25, 49, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 20px;
  padding-bottom: 12px;
`;

export default PeopleList;
