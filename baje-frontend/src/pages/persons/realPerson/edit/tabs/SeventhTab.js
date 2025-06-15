import React from "react";
import { Row } from "antd";
import { v4 as uuidv4 } from "uuid";
import SubordinatePeople from "../../../../../components/renderInput/subordinatepeopleSection/SubordinatePeople";

const Seventh = (props) => {
  return (
    <>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {/* <RenderInputs inputsFiled={seventhTab} /> */}

        {/* must be edit*/}
        <SubordinatePeople
          form={props.form}
          name="mother"
          label="مادر"
          id={uuidv4()}
          limit={1}
        />
        <SubordinatePeople
          form={props.form}
          name="father"
          label="پدر"
          id={uuidv4()}
          limit={1}
          initLastName={props.firstForm.getFieldValue("last_name")}
          initName={props.firstForm.getFieldValue("father_name")}
        />

        <SubordinatePeople
          form={props.form}
          name="son"
          label="فرزندان پسر"
          id={uuidv4()}
          initLastName={props.firstForm.getFieldValue("last_name")}
          initFatherName={props.firstForm.getFieldValue("first_name")}
        />
        <SubordinatePeople
          form={props.form}
          name="daughter"
          label="فرزندان دختر"
          id={uuidv4()}
          initLastName={props.firstForm.getFieldValue("last_name")}
          initFatherName={props.firstForm.getFieldValue("first_name")}
        />
        <SubordinatePeople
          form={props.form}
          name="wife"
          label="همسر"
          id={uuidv4()}
        />
        {/* must be edit*/}
      </Row>
    </>
  );
};

export default Seventh;
