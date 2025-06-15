import React from "react";
// import BigCalendar from "jalali-react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styled from "styled-components";
const events = [
  {
    title: "کار",
    start: new Date(2021, 2, 13),
    end: new Date(2021, 2, 13),
  },

  {
    title: "استراحت",
    start: new Date(2021, 10, 13),
    end: new Date(2021, 10, 13),
  },

  {
    title: "کار",
    start: new Date(2021, 3, 9),
    end: new Date(2021, 3, 9),
  },
  {
    title: "استراحت",
    start: new Date(2021, 5, 11),
    end: new Date(2021, 5, 11),
  },
];
const TestCalendar = () => {
  return (
    <StyledCalendar>
      {/* <BigCalendar events={events} /> */}
      <div>TODO: Replace jalali-react-big-calendar</div>
    </StyledCalendar>
  );
};

const StyledCalendar = styled.div`
  height: 500px;
  .rbc-day-bg {
    border-left: 1px solid #ddd;
  }
`;

export default TestCalendar;
