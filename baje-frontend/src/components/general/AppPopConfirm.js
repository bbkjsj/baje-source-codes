import { Popconfirm } from "antd";
import React from "react";
import PropTypes from "prop-types";

const AppPopConfirm = (prp) => {
  return (
    <Popconfirm okText="بله" cancelText="خیر" placement="rightTop" {...prp} />
  );
};

// AppPopConfirm.propTypes = Popconfirm.propTypes;
AppPopConfirm.propTypes = {
  title: PropTypes.string,
  placement: PropTypes.oneOf([
    "topLeft",
    "top",
    "topRight",
    "leftTop",
    "left",
    "leftBottom",
    "rightTop",
    "right",
    "rightBottom",
    "bottomLeft",
    "bottom",
    "bottomRight",
  ]),
  ...Popconfirm.propTypes,
};

export default AppPopConfirm;
