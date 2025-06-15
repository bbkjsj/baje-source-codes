import moment from "moment-jalaali";
import styled from "styled-components";
import { CalendarOutlined } from "@ant-design/icons";
import React from "react";

/**
 * Todat Date : a component to dispalay today's date in locale format
 * @param {object} props  all the props of component
 * @param {string} props.className css class for container
 * @returns
 */

const TodayDate = (props) => {
  return (
    <StyledTodayDate
      {...props}
      className={`today-date flex align-center justify-between ${props.className}`}
    >
      <CalendarOutlined className="text-light-black text-12" />
      <span className="text-med-black text-12 mr-1">امروز</span>
      <span className="text-primary text-12">{getTodayDate()}</span>
    </StyledTodayDate>
  );
};

function getTodayDate() {
  return moment(Date.now()).format("jYYYY/jMM/jDD");
}

// css
const StyledTodayDate = styled.div`
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.09);
  border-radius: 4px;
  padding: 6px;
  flex-grow: 1;
  min-width: 112px;
`;

export default TodayDate;
