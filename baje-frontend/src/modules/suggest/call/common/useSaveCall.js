import React, { useState, useEffect } from "react";
import * as api from "../utils/api";
import { message } from "antd";
import moment from "moment-jalaali";

const useSaveCall = () => {
  const [loading, setLoading] = useState(false);

  const saveItem = async (params, id) => {
    try {
      setLoading(true);

      id ? await api._PUT(id, params) : await api._POST(params);
      setLoading(false);

      return true;
    } catch (error) {
      if (error.response) {
        setLoading(false);
        message.error(error?.response?.data);
      }

      return false;
    }
  };

  return [loading, saveItem];
};

export default useSaveCall;
