import React, { useState, useEffect } from "react";
import * as api from "../utils/api";
import { message } from "antd";
import { convertDataKeys, createFormData, notice } from "_helpers";
import { keyMap, participationType } from "../const";

const keysToSend = {
  ...keyMap(),
  title: true,
  advantages: true,
  disadvantages: true,
  participants: { national_number: true },
};

const useSaveSuggestion = (state) => {
  const [loading, setLoading] = useState(false);

  const saveItem = async (params, id) => {
    try {
      setLoading(true);

      //set a default name for group suggestions
      if (params.participation_type === participationType.SINGLE)
        params.group_title = "انفرادی";
      else if (!params.group_title) params.group_title = "گروه بدون نام";

      //remove price separators
      if (params.suggestion_price)
        params.suggestion_price = params.suggestion_price.split(",").join("");

      if (state.participants) params.participants = [...state.participants];
      const result = convertDataKeys(keyMap(), params);

      if (id) {
        result.del_participants = state.del_participants;
        result.del_dis_adv = state.del_dis_adv;
      }

      if (result.advantages)
        result.advantages = result.advantages.map((item) => ({
          ...item,
          id: item.id || -1,
        }));

      if (result.disadvantages)
        result.disadvantages = result.disadvantages.map((item) => ({
          ...item,
          id: item.id || -1,
        }));

      console.error(result);

      const formData = createFormData(result);
      id ? await api._PUT_PUBLIC(id, formData) : await api._POST(formData);

      setLoading(false);
      return true;
    } catch (error) {
      if (error.response) {
        message.error(error?.response?.data);
      } else {
        console.log(error);
      }

      setLoading(false);
      return false;
    }
  };

  return [loading, saveItem];
};

export default useSaveSuggestion;
