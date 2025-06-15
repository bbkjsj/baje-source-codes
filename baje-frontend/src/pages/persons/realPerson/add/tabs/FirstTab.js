import React, { useContext, useState, useEffect } from "react";
import { Row } from "antd";
import { firstTab } from "../inputsList";
import { RenderInputs } from "components/renderInput/RenderInputs";
import { utils } from "react-modern-calendar-datepicker";
import {
  checkNationalNumber,
  setBirthPlace,
  getContractList,
} from "../../common/_helpers";
import PeriodTime from "components/PeriodTime";
import { useSelector } from "react-redux";

const FirstTab = (props) => {
  console.log("statusOfIsargar", props.statusOfIsargar);
  const statusOfIsargar = props.statusOfIsargar;
  const [contractList, setContractList] = useState([]);
  const currentOffice = useSelector((state) => state.currentOffice);

  const error = () => {
    console.log("error in first Tab");
  };

  useEffect(() => {
    props.form.setFieldsValue({ contract_id: null });
    if (currentOffice) {
      getContractList(currentOffice, setContractList, error);
    }
  }, [currentOffice]);

  return (
    <>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <RenderInputs
          inputsFiled={firstTab}
          additionalData={{
            shahid_was_colleague: {
              hidden:
                statusOfIsargar === "child_of" || statusOfIsargar === "wife_of"
                  ? true
                  : false,
            },

            shahid_name: {
              hidden: statusOfIsargar === "wife_of" ? true : false,
            },
            veteran_percentage: {
              hidden: statusOfIsargar === "veteran" ? true : false,
            },

            period_time_fighting: {
              hidden: statusOfIsargar === "fighting" ? true : false,
              component: (
                <PeriodTime
                  label="مدت حضور در جبهه"
                  year="frontline_year"
                  month="frontline_month"
                  day="frontline_day"
                />
              ),
            },
            period_time_noble: {
              hidden: statusOfIsargar === "noble" ? true : false,
              component: (
                <PeriodTime
                  label="مدت زمان اسارت"
                  year="captivity_year"
                  month="captivity_month"
                  day="captivity_day"
                />
              ),
            },
            national_number: {
              inputAttr: {
                onChange: props.onChangeNationalIdAndBirthDay,
                onBlur: (e) => {
                  if (e.target.value && e.target.value.length === 10) {
                    checkNationalNumber(e.target.value)
                      .then(() => {})
                      .catch(() => {
                        props.form.setFields([
                          {
                            name: "national_number",
                            errors: ["کد ملی تکراری است"],
                          },
                        ]);
                      });
                    let cityName = setBirthPlace(e.target.value);
                    props.form.setFieldsValue({
                      id_issue_place: cityName,
                      birth_place: cityName,
                    });
                  }
                },
              },
            },
            birth_date: {
              onChange: props.onChangeNationalIdAndBirthDay,
              maximumDate: utils("fa").getToday(),
              form: props.form,
            },
            contract_id: { option: contractList },
          }}
        />
      </Row>
    </>
  );
};

export default FirstTab;
