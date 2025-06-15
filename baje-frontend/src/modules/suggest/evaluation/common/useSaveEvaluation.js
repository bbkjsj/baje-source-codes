import React, { useState, useEffect } from "react";
import * as api from "../utils/api";
import { message } from "antd";
import { convertDataKeys, createFormData } from "_helpers";
import { keyMap } from "../const";

const useSaveEvaluation = () => {
  const [loading, setLoading] = useState(false);

  const saveItem = async (params) => {
    try {
      setLoading(true);

      const saveResult = await api._POST(params);
      setLoading(false);

      return saveResult;
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

export default useSaveEvaluation;
