import React from "react";
import { Row } from "antd";
import { fifthTab } from "../inputsList";
import { RenderInputs } from "components/renderInput/RenderInputs";
import { checkPhoneNumber } from "../../common/_helpers";

const FifthTab = (props) => {
  return (
    <>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <RenderInputs
          inputsFiled={fifthTab}
          additionalData={{
            mobile1: {
              onBlur: (e) => {
                if (e.target.value && e.target.value.length === 11) {
                  checkPhoneNumber(e.target.value)
                    .then(() => {
                      if (
                        props.form.getFieldValue("mobile1") != props.mobile1
                      ) {
                        props.form.setFields([
                          {
                            name: "mobile1",
                            errors: ["شماره تلفن تکراری است"],
                          },
                        ]);
                      }
                    })
                    .catch(() => {});
                }
              },
            },
            mobile2: {
              onBlur: (e) => {
                if (e.target.value && e.target.value.length === 11) {
                  checkPhoneNumber(e.target.value)
                    .then(() => {
                      if (
                        props.form.getFieldValue("mobile2") != props.mobile2
                      ) {
                        props.form.setFields([
                          {
                            name: "mobile2",
                            errors: ["شماره تلفن تکراری است"],
                          },
                        ]);
                      }
                    })
                    .catch(() => {});
                }
              },
            },
          }}
        />
      </Row>
    </>
  );
};

export default FifthTab;
