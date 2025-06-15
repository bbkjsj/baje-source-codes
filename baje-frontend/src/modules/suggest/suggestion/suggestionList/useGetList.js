import * as api from "../utils/api";
import { uniqueListConvertor } from "../utils";
import { message } from "antd";
import { statusTypes } from "../const";
import { useState } from "react";

export const useGetList = (pageId, callId, pageFilter, newContext) => {
  const [listLoading, setListLoading] = useState(true);
  const [list, setList] = useState([]);

  const getList = async () => {
    setListLoading(true);

    try {
      let res;

      if (newContext.isPublicSuggestion()) res = await api._GET_PUBLIC();
      else if (callId) res = await api._GET_BY_CALL(callId);
      else if (pageFilter) res = await api._GET_CARTABLE(pageFilter);
      else res = await api._GET();

      const unique = uniqueListConvertor(
        res.data,
        newContext.isPublicSuggestion()
      );
      setList(unique);
      await attachMetaData(unique);

      setListLoading(false);
    } catch (error) {
      setListLoading(false);
      message.error("دریافت اطلاعات لیست با مشکل روبرو شد");
    }
  };

  const attachMetaData = async (data) => {
    const newList = [];

    for (const record of data) {
      if (newContext.isPublicSuggestion()) {
        if (record.status === statusTypes.COMMITTEE_HEAD_REVIEW) {
          const log = (
            await api._GET_STATUS_LOG_PUBLIC(record.id || record.s_id)
          ).data.filter((item) => item.from_status || item.to_status);
          record["_is_deletable"] = record["_is_editable"] = log.length <= 1;
        } else if (record.status === statusTypes.STARTER_REVIEW) {
          record["_is_editable"] = true;
        }
      }

      newList.push(record);
    }

    setList(newList);
  };

  return [list, listLoading, getList];
};
