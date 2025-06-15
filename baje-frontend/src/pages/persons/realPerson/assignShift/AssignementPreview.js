import React, { useState, useEffect, createRef } from "react";
// import BigCalendar from "jalali-react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styled from "styled-components";
import MenuInlineBtn from "components/MenuInlineBtn";
import { addDays } from "../../../../_helpers";
import { useScreenshot } from "use-screenshot-hook";
import { createFileName } from "use-react-screenshot";
import { pageNames } from "constant";
import { assignNewShift } from "./utils/api";
import { Spin } from "antd";

import { useHistory } from "react-router-dom";
import {
  handleExceptions,
  handleSuccess,
} from "modules/personnel/jobs/common/api";

const AssignementPreview = ({
  toFromDate,
  closeModal,
  body,
  shift,
  updating,
}) => {
  const [loading, setLoading] = useState(false);
  const ref = createRef();
  const { image, takeScreenshot, isLoading, clear } = useScreenshot({
    ref: ref,
  });
  let [events, setEvents] = useState([]);
  const history = useHistory();

  const download = (image, { name = "img", extension = "png" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  useEffect(() => {
    if (image) {
      download(image, { name: "پیش نمایش اختصاص شیفت کاری", extension: "png" });
    }
  }, [image]);

  useEffect(() => {
    console.log("curr shift:", shift);
    calculateShift();
  }, [shift]);

  const calculateShift = () => {
    if (shift && shift.patterns && shift.patterns.length) {
      let pattern = [0, 0];
      for (let i of shift.patterns) {
        if (i.status === "work") {
          pattern[0] += parseFloat(i.days);
        } else if (i.status === "rest") {
          pattern[1] += parseFloat(i.days);
        }
      }
      createPatternShift(toFromDate, pattern);
    }
  };

  const createPatternShift = (startDate, pattern) => {
    let i;
    let roullete = 1;
    let isWork = true;
    let newEvents = [];
    for (i = 0; i < 30; i++) {
      const event = {
        id: i + 1,
        title: isWork ? "کار" : "استراحت",
        start: addDays(new Date(startDate[0]), i),
        end: addDays(new Date(startDate[0]), i),
        allDay: true,
      };
      roullete++;
      if (roullete > pattern[0] && isWork) {
        isWork = false;
        roullete = 1;
      }
      if (roullete > pattern[1] && !isWork) {
        isWork = true;
        roullete = 1;
      }
      newEvents.push(event);
    }
    setEvents(newEvents);
  };

  // assign new shift to this person
  function submitShift() {
    setLoading(true);
    let action = () => assignNewShift(body);

    // if (updating && updating !== null) {
    //   action = () => updateAssignedShift(updating, body);
    // }

    action()
      .then((res) => {
        setLoading(false);
        handleSuccess(res);
        history.push(pageNames.personnel.realPerson.list);
      })
      .catch((err) => {
        setLoading(false);
        handleExceptions(err);
      });
  }

  const menuBtnList = [
    // {
    //   handleClick: () => {
    //     takeScreenshot();

    //     // printContent("content");
    //     // html2canvas(document.getElementById("content")).then((canvas) => {
    //     //   canvas.toBlob((blob) => {

    //     //     saveAs(blob, "شیفت کاری.png");
    //     //   });
    //     // });
    //   },
    //   label: "چاپ",
    //   id: "newRealPerson",
    //   loading: isLoading,
    // },
    {
      handleClick: submitShift,
      label: "اختصاص شیفت",
      id: "newGroup",
      variant: "primary",
    },
    {
      handleClick: closeModal,
      label: "انصراف",
      id: "closeModal",
    },
  ];

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = "#1A237E";
    if (event.title === "کار") backgroundColor = "#BF360C";
    const style = {
      backgroundColor: backgroundColor,
      borderRadius: "0px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
      fontSize: "13px",
      marginTop: "5px",
    };

    return {
      style: style,
    };
  };

  return (
    <Spin ref={ref} spinning={loading}>
      <Row id={"content"}>
        <StyledCalendar>
          {/* <BigCalendar
            eventPropGetter={eventStyleGetter}
            defaultDate={new Date(toFromDate[0])}
            views={{
              month: true,
              week: false,
            }}
            style={{ marginLeft: "20px" }}
            events={events}
          /> */}
          <div>TODO: Replace jalali-react-big-calendar</div>
        </StyledCalendar>

        <StyledCalendar>
          {/* <BigCalendar
            eventPropGetter={eventStyleGetter}
            defaultDate={addDays(new Date(toFromDate[0]), 30)}
            views={{
              month: true,
              week: false,
            }}
            events={events}
          /> */}
          <div>TODO: Replace jalali-react-big-calendar</div>
        </StyledCalendar>
      </Row>

      <MenuInlineBtn list={menuBtnList} />
    </Spin>
  );
};

const StyledCalendar = styled.div`
  height: 300px;
  width: 400px;
  .rbc-day-bg {
    border-left: 1px solid #ddd;
  }

  .rbc-btn-group {
    display: none;
    white-space: nowrap;
  }
`;

const Row = styled.div`
  display: flex;
  background: white;
  justify-content: center;
  margin-bottom: 15px;
`;

export default AssignementPreview;
