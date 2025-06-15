import React from "react";
import { Card } from "antd";
import PropTypes from "prop-types";

/**
 *
 * @param {object}  params - params of component
 * @param {boolean}  params.loading - loading AppCard
 * @returns
 */
const AppCard = (props) => {
  return (
    <Card
      {...props}
      style={{
        boxShadow: "0 2px 4px 0 rgba(19, 37, 71, 0.05)",
      }}
    />
  );
};

AppCard.propTypes = {
  title: PropTypes.string,
  extra: PropTypes.element,
  size: PropTypes.oneOf(["default", "small"]),
  bordered: PropTypes.bool,
  loading: PropTypes.bool,
  ...Card.propTypes,
};

// AppCard.propTypes = Card.propTypes;
export default AppCard;
