import React from "react";
import { v4 as uuidv4 } from "uuid";
import AccessRolesSection from "./section/AccessRolesSection";
import { Divider } from "antd";
const RenderSection = (props) => {
  let sections = props.permissions.permissions.map((el) => {
    return (
      <React.Fragment key={uuidv4()}>
        <Divider orientation="right">{el.label}</Divider>
        <AccessRolesSection
          form={props.form}
          data={el.permissions}
          label={el.label}
          name={el.section}
        />
      </React.Fragment>
    );
  });
  return <>{sections}</>;
};

export default RenderSection;
