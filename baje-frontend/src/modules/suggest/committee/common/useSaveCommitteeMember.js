import React, { useState, useEffect } from "react";
import * as api from "../utils/api";
import { message } from "antd";
import moment from "moment-jalaali";

const useSaveCommitteeMember = () => {
  const [loading, setLoading] = useState(false);

  const saveItem = async (params, id) => {
    try {
      setLoading(true);

      params.member_from = moment(params.member_from, "jYYYY/jM/jD").format(
        "YYYY/M/D HH:mm:ss"
      );
      params.member_to =
        params.member_to &&
        moment(params.member_to, "jYYYY/jM/jD").format("YYYY/M/D HH:mm:ss");

      id ? await api._PUT_MEMBER(id, params) : await api._POST_MEMBER(params);
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

export default useSaveCommitteeMember;
