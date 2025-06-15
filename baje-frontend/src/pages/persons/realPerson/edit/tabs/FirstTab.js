import React, { useEffect, useContext, useState } from "react";
import { Tabs, Form, Row, Button, Col } from "antd";
import { firstTab } from "../inputsList";
import { RenderInputs } from "../../../../../components/renderInput/RenderInputs";
import { utils } from "react-modern-calendar-datepicker";
import { convertListOfOffice, getContractList } from "../../common/_helpers";
import PeriodTime from "components/PeriodTime";
import { useSelector } from "react-redux";

const FirstTab = (props) => {
  const statusOfIsargar = props.statusOfIsargar;
  const [contractList, setContractList] = useState([]);
  const currentOffice = useSelector((state) => state.currentOffice);

  const error = () => {
    console.log("error in first Tab");
  };

  useEffect(() => {
    // props.form.setFieldsValue({ contract_id: null });
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
              onChange: props.onChangeNationalIdAndBirthDay,
              disable: true,
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
