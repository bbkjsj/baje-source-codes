import { forwardTypeValues } from "../const";
import * as committeeApi from "../../committee/utils/api";
import { getServerDateTime } from "utils/api";
import { isCommitteeMemberActive } from "../../committee/utils/tools";
import { committeeMemberPosition } from "../../committee/const";
import { message, Modal } from "antd";
import * as api from "../utils/api";

export const handleOnForwardClick = async (
  data,
  forwards,
  setCurrentForwardTypes,
  setCurrentSuggestion,
  setIsForwardVisible
) => {
  let forwardIndex = null;

  if (!forwards) return false;

  forwardIndex = forwards.findIndex(
    (item) => item.value === forwardTypeValues.TO_STARTER
  );

  if (forwardIndex !== -1) forwards[forwardIndex]["personnel"] = false;

  //=========

  forwardIndex = forwards.findIndex(
    (item) => item.value === forwardTypeValues.TO_COMMITTEE_MEMBER
  );

  if (forwardIndex !== -1) {
    try {
      const res = await committeeApi._GET_MEMBER(data["workgroup_id_fk"]);
      const serverDate = await getServerDateTime();
      const items = [];

      if (Array.isArray(res.data))
        res.data.forEach((item) => {
          if (isCommitteeMemberActive(item, serverDate.data["date"])) {
            if (
              String(data["national_code"]) !== String(item.national_number) &&
              item.position !== committeeMemberPosition.SECRETARY
            )
              items.push({
                name: item.first_name + " " + item.last_name,
                id: item.personnel_id,
              });
          }
        });

      forwards[forwardIndex]["personnel"] = items;
    } catch (error) {
      message.error("دریافت اطلاعات کارگروه با مشکل روبرو شد");
    }
  }

  //========

  forwardIndex = forwards.findIndex(
    (item) => item.value === forwardTypeValues.TO_EXECUTOR_INITIAL
  );

  if (forwardIndex !== -1) {
    try {
      const res = await api._GET_COMPANIES();
      const items = [];

      if (Array.isArray(res.data.list))
        res.data.list.forEach((item) => {
          items.push({
            name: item.name,
            id: item.id,
          });
        });

      forwards[forwardIndex]["companies"] = items;
    } catch (error) {
      message.error("دریافت اطلاعات افراد حقوقی با مشکل روبرو شد");
    }
  }

  setCurrentForwardTypes(forwards);
  setCurrentSuggestion(data);
  setIsForwardVisible(true);
};
