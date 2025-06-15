import React, { useState, useEffect } from "react";

const useTimer = (count, isActive) => {
  const [counter, setCounter] = useState(count);
  const [seconds, setSeconds] = useState("");
  const [minutes, setMinutes] = useState("");

  useEffect(() => {
    let intervalId;

    if (isActive) {
      intervalId = setInterval(() => {
        if (counter >= 1) setCounter((counter) => counter - 1);

        const secondCounter = counter % 60;
        const minuteCounter = Math.floor(counter / 60);

        const computedSecond =
          String(secondCounter).length === 1
            ? `0${secondCounter}`
            : secondCounter;
        const computedMinute =
          String(minuteCounter).length === 1
            ? `0${minuteCounter}`
            : minuteCounter;

        setSeconds(computedSecond);
        setMinutes(computedMinute);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive, counter]);

  function reset() {
    setCounter(count);
    setSeconds("00");
    setMinutes("00");
  }

  return { counter, seconds, minutes, reset };
};

export default useTimer;
