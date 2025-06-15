import React, { useState } from "react";
import { Row, Input, Button, message } from "antd";
import { fourthTab } from "../inputsList";
import { RenderInputs } from "../../../../../components/renderInput/RenderInputs";
import { utils } from "react-modern-calendar-datepicker";
import CheckCode from "../../../../../components/renderInput/checkCode/CheckCode";
import { checkCode, checkInsuranceNumber } from "../../common/_helpers";

const FourthTab = (props) => {
  const [checkCodeStatus, setCheckStatus] = useState("check");
  const [checkCodeLoading, setCheckLoading] = useState(false);

  const edit = () => {
    setCheckStatus("check");
  };

  const getError = (err) => {
    message.error(err);
  };

  return (
    <>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <CheckCode
          label="عنوان شغل"
          name="job_title_id"
          status={checkCodeStatus}
          resultNameFiled="job_title_name"
          edit={edit}
          filedName="job_title_id"
          loading={checkCodeLoading}
          checkCode={() =>
            checkCode(props.form, setCheckLoading, getError, setCheckStatus)
          }
          filedRules={[]}
        >
          <Input />
        </CheckCode>

        <RenderInputs
          inputsFiled={fourthTab}
          additionalData={{
            insurance_number: {
              inputAttr: {
                onBlur: (e) => {
                  if (e.target.value && e.target.value.length === 8) {
                    checkInsuranceNumber(e.target.value)
                      .then(() => {
                        props.setHandyError();
                      })
                      .catch(() => {
                        props.setHandyError("2");
                        props.form.setFields([
                          {
                            name: "insurance_number",
                            errors: ["شماره بیمه تکراری است"],
                          },
                        ]);
                      });
                  } else {
                    props.setHandyError();
                  }
                },
              },
            },
            expire_time: {
              hidden: props.toggleStatusJob,
              maximumDate: utils("fa").getToday(),
              form: props.form,
            },
            expire_reason: { hidden: props.toggleStatusJob },
          }}
        />
      </Row>
    </>
  );
};

export default FourthTab;
