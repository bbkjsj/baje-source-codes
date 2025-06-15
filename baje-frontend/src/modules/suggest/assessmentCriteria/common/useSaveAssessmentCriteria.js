import React, { useState, useEffect } from "react";
import * as api from "../utils/api";
import { message } from "antd";
import { assessmentMethod } from "../const";

const useSaveAssessmentCriteria = () => {
  const [loading, setLoading] = useState(false);

  const saveItem = async (params, id) => {
    try {
      setLoading(true);

      params.weight_factor = params.weight_factor
        ? parseFloat(params.weight_factor)
        : 1;

      params.max_point =
        params.rate_type === assessmentMethod.QUESTION
          ? params.weight_factor
          : params.weight_factor * 4;

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

export default useSaveAssessmentCriteria;
