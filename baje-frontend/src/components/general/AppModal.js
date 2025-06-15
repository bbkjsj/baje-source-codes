import React from "react";
import { Modal } from "antd";
import PropTypes from "prop-types";

const AppModal = (props) => <Modal {...props} />;

AppModal.propTypes = {
  visible: PropTypes.bool,
  closable: PropTypes.bool,
  title: PropTypes.string,
  maskClosable: PropTypes.bool,
  ...Modal.propTypes,
};

export default AppModal;
