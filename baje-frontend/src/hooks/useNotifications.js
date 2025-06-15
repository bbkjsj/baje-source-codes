import React from "react";
import { useDispatch, useSelector } from "react-redux";

function useNotifications() {
  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  const notificationsSum = () => {
    const sum = Object.keys(notifications).reduce(
      (total, key) => (total += notifications[key]),
      0
    );
    return sum;
  };

  return {
    notifications,
    notificationsSum,
    dispatch,
  };
}

export default useNotifications;
