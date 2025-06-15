import React, { useState, useEffect } from "react";
import * as api from "../utils/api";
import moment from "moment";

const useSaveShift = () => {
  const [loading, setLoading] = useState(false);

  const getTimestamp = (input) => {
    let timestamp = input;

    if (typeof input === "object") timestamp = input.utc(true).unix();

    return Number(timestamp);
  };

  const saveItem = async (params, isNew, id) => {
    if (params.patterns) {
      params.patterns = params.patterns.map((item) => ({
        ...item,
        from:
          item.status === "work"
            ? moment(item.from).format("YYYY/M/D HH:mm")
            : null,
        to:
          item.status === "work"
            ? moment(item.to).format("YYYY/M/D HH:mm")
            : null,
        days: parseInt(item.days),
      }));
    }

    params = {
      ...params,
      enabled: params.enabled || false,
      numberOfTimeOffDays: parseInt(params.numberOfTimeOffDays),
    };

    console.log("params:", params);

    try {
      setLoading(true);
      !isNew ? await api._PUT(id, params) : await api._POST(params);
      setLoading(false);

      return true;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };
  //
  // const saveItem = async (params, id) => {
  //   if(params.patterns) {
  //     params.patterns = params.patterns.map(item => {
  //       item.start_time = getTimestamp(item.start_time);
  //       item.end_time = getTimestamp(item.end_time);
  //
  //       return item;
  //     });
  //   }
  //
  //   try {
  //     setLoading(true);
  //     id ? await api._PUT(id, params) : await api._POST(params);
  //     setLoading(false);
  //
  //     return true;
  //   } catch (error) {
  //     if (error.response) {
  //       setLoading(false);
  //     }
  //
  //     return false;
  //   }
  // };

  return [loading, saveItem];
};

export default useSaveShift;
