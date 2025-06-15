import React, { useState, useEffect } from "react";
import * as api from "../utils/api";
import { message } from "antd";
import { createFormData } from "../../../../_helpers";

const useSaveConfiguration = () => {
  const [loading, setLoading] = useState(false);

  const saveItem = async (params, id) => {
    try {
      setLoading(true);

      const formData = createFormData(params);
      await api._POST(formData);

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

export default useSaveConfiguration;
