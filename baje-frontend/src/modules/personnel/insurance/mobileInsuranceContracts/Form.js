import React, { useContext, useEffect, useState } from "react";
import MobileInsuranceHeader from "components/layouts/mobileInsurance/MobileInsuranceHeader";
import AddPersonItem from "./components/AddPersonItem";
import { Link, useParams } from "react-router-dom";
import { getLink } from "_helpers";
import AppButton from "components/general/AppButton";
import { UserAddOutlined } from "@ant-design/icons";
import BottomButtons from "./components/BottomButtons";
import { Modal, Spin } from "antd";
import { getUserSubordinates } from "./common/api";
import { handleExceptions } from "./common/exceptions";
import { InsuranceWizardContext } from "./contexts/InsuranceWizardContext";
import { useHistory } from "react-router";
import { pageNames } from "constant";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

const AddSubordinate = ({ edit }) => {
  const params = useParams();
  const history = useHistory();
  const user = useWhoAmI();
  const [person, setPerson] = useState({
    subordinates: [],
  });
  const [loading, setLoading] = useState(false);
  const {
    setSelectedPeople,
    selectedPeople,
    selectedInsurance,
    setSubordinateForm,
    setHasParents,
  } = useContext(InsuranceWizardContext);

  const [tempSelected, setTempSelected] = useState([]);

  // get subordinates
  useEffect(() => {
    setSubordinateForm({ values: {}, files: [] });
    setLoading(true);
    getUserSubordinates()
      .then((response) => {
        setLoading(false);
        if (response && response.data && response.data.response) {
          const subs = response.data.response;

          let hasMother = false;
          let hasFather = false;

          if (subs.length) {
            for (let sub of subs) {
              if (sub.relation === "father") {
                hasFather = true;
              }
              if (sub.relation === "mother") {
                hasMother = true;
              }

              setHasParents({
                mother: hasMother,
                father: hasFather,
              });
            }
            setPerson({ subordinates: subs });
          }
        } else {
          handleExceptions();
        }
      })
      .catch((err) => {
        handleExceptions(err);
      });
  }, []);

  function getSubChecked(id) {
    const subChecked = tempSelected.some((data) => id == data.id);
    return subChecked;
  }

  function handlePersonItemCheck(data, checked) {
    let newSelected = [...tempSelected];

    if (checked && !newSelected.includes(data)) {
      newSelected.push(data);
    } else {
      newSelected = newSelected.filter((itemId) => itemId.id != data.id);
    }

    //check if person is already in the list
    let alreadyInList = false;

    if (
      selectedInsurance &&
      selectedInsurance.insurance_takmili_subordinates &&
      selectedInsurance.insurance_takmili_subordinates.length
    ) {
      alreadyInList = selectedInsurance.insurance_takmili_subordinates.some(
        (sub) =>
          sub.personnel_subordinate && sub.personnel_subordinate.id == data.id
      );
    }

    if (!alreadyInList) {
      setTempSelected(newSelected);
    } else {
      Modal.warn({
        content: "این فرد در لیست بیمه موجود است",
      });
    }
  }

  function notifyUncheckedMain() {
    Modal.error({
      content: "برای انتخاب افراد تبعی باید ابتدا فرد اصلی را انتخاب نمایید",
    });
  }

  function deletePerson(id) {}

  let subordinateItems = person.subordinates.map((item, idx) => {
    let alreadyInList = false;
    if (selectedInsurance && selectedInsurance.insurance_takmili_subordinates) {
      alreadyInList = selectedInsurance.insurance_takmili_subordinates.some(
        (sub) =>
          sub.personnel_subordinate && sub.personnel_subordinate.id == item.id
      );
    }

    if (!alreadyInList) {
      if (selectedPeople.subordinates && selectedPeople.subordinates.length) {
        alreadyInList = selectedPeople.subordinates.some(
          (sub) => sub.id == item.id
        );
      }
    }

    if (!alreadyInList) {
      return (
        <AddPersonItem
          key={item.id}
          data={item}
          checked={getSubChecked(item.id)}
          onCheck={handlePersonItemCheck}
          disabled={
            (!selectedPeople.person && !edit) ||
            (edit &&
              selectedInsurance &&
              !selectedInsurance.personnel &&
              !selectedPeople.person)
          }
          onClick={!selectedPeople.person && !edit && notifyUncheckedMain}
        />
      );
    }
  });

  return (
    <div className="fade-in" style={{ paddingBottom: "56px" }}>
      <MobileInsuranceHeader title="اضافه کردن افراد" />

      <Spin spinning={loading}>
        <AddPersonItem
          data={{
            relation: "اصلی",
            first_name: user.firstName,
            last_name: user.lastName,
            id: user.id,
          }}
          checked={selectedPeople.person || selectedInsurance?.personnel}
          disabled={selectedInsurance?.personnel}
          onCheck={() =>
            setSelectedPeople({
              person: selectedPeople.person ? null : user,
              subordinates: [],
            })
          }
        />

        <Link
          to={getLink(
            pageNames.personnel.insurance.supplymentary.contracts.subordinate
              .addNew,
            {
              contract_id: params.id,
            }
          )}
        >
          <AppButton
            icon={<UserAddOutlined />}
            className="full-btn mt-3 fade-in"
          >
            تعریف تبعی جدید
          </AppButton>
        </Link>

        <div className="subordinate-items">{subordinateItems}</div>
        <BottomButtons
          verifyText="اضافه کردن"
          disabled={!tempSelected.length}
          onSave={() => {
            setSelectedPeople({
              ...selectedPeople,
              subordinates: [...selectedPeople.subordinates, ...tempSelected],
            });
            history.goBack();
          }}
        />
      </Spin>
    </div>
  );
};

export default AddSubordinate;
