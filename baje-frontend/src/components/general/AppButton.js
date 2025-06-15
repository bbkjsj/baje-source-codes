import React from "react";
import { Button } from "antd";
import PropTypes from "prop-types";

/**
 * Component to display a Custom antd Button
 * @param {object} props component's all props
 * @param {'primary' |'gray'|'alt-primary' |'success' |'danger'| 'successFilled'| 'info'|"default"} props.variant buttons's them
 * @param {boolean} props.loading - loading value
 * @param {boolean} props.disabled - disabled
 * @param {"submit"|"reset"|"button"} props.htmlType - html type
 * @param {string} props.className - class name
 * @returns
 */
const AppButton = ({ children, ...props }) => {
  switch (props.variant) {
    case "primary":
      return (
        <Button type="primary" {...props}>
          {children}
        </Button>
      );
    case "gray":
      return (
        <Button
          type="ghost"
          {...props}
          className={`bg-trans-gray ${props.className || ""}`}
        >
          {children}
        </Button>
      );
    case "alt-primary":
      return (
        <Button
          type="ghost"
          {...props}
          className={`btn-trans-primary ${props.className || ""}`}
        >
          {children}
        </Button>
      );
    case "success":
      return (
        <Button
          type="ghost"
          {...props}
          className={`btn-trans-success ${props.className || ""}`}
        >
          {children}
        </Button>
      );
    case "danger":
      return (
        <Button
          type="ghost"
          {...props}
          className={`btn-trans-danger ${props.className || ""}`}
        >
          {children}
        </Button>
      );
    case "successFilled":
      return (
        <Button
          type="success"
          {...props}
          className={`btn-success-filled ${props.className || ""}`}
        >
          {children}
        </Button>
      );
    case "info":
      return (
        <Button
          type="ghost"
          {...props}
          className={`btn-trans-gray ${props.className || ""}`}
        >
          {children}
        </Button>
      );
    default:
      return <Button {...props}>{children}</Button>;
  }
};

// types
AppButton.propTypes = {
  /**
   * buttons's color
   */

  variant: PropTypes.oneOf([
    "primary",
    "alt-primary",
    "gray",
    "success",
    "danger",
    "info",
  ]),
  htmlType: PropTypes.oneOf(["submit", "reset", "button"]),
  ...Button.propTypes,
};

export default AppButton;
