import React from "react";
import { Modal, Button } from "antd";
import PropTypes from "prop-types";

/**
 * TextModal: a component to display simple and customizable modal
 * @param {props} props all props
 * @param {string} props.title modal's title
 * @param {boolean} props.status a boolean to toggle modal
 * @param {string} props.text  modal's text content
 * @param {function} props.close  close modal handler
 * @param {number} props.width modal's width
 * @returns
 */

const TextModal = (props) => {
  return (
    <Modal
      title={props.title}
      visible={props.status}
      width={props.width || 720}
      onCancel={() => props.close(false)}
      footer={[
        <Button key="back" onClick={() => props.close(false)}>
          بستن
        </Button>,
      ]}
    >
      <h4 style={{ textAlign: "center" }}>بنام خدا</h4>

      <p style={{ textAlign: "justify" }}>{props.text}</p>
    </Modal>
  );
};

TextModal.propTypes = {
  title: PropTypes.string,
  status: PropTypes.bool,
  text: PropTypes.string,
  close: PropTypes.func,
  width: PropTypes.number,
};

export default TextModal;
