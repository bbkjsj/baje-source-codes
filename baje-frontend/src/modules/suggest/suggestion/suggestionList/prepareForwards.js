import { forwardTypes, forwardTypeValues } from "../const";
import * as committeeApi from "../../committee/utils/api";
import { message } from "antd";
import { SECRETARIAT_COMMITTEE_ID } from "../../const";
import { committeeMemberPosition } from "../../committee/const";

export const prepareForwards = async (setPageForwardTypes) => {
  const forwards = [...forwardTypes];
  let forwardIndex = null;

  forwardIndex = forwards.findIndex(
    (item) => item.value === forwardTypeValues.TO_COMMITTEE
  );

  try {
    const res = await committeeApi._GET();
    forwards[forwardIndex]["custom"] = Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    message.error("دریافت اطلاعات کارگروه با مشکل روبرو شد");
  }

  //==============

  forwardIndex = forwards.findIndex(
    (item) => item.value === forwardTypeValues.TO_SECRETARIAT_MEMBER
  );

  try {
    const res = await committeeApi._GET_MEMBER(SECRETARIAT_COMMITTEE_ID);
    const items = [];

    if (Array.isArray(res.data))
      res.data.forEach((item) => {
        if (item.position !== committeeMemberPosition.SECRETARY) {
          items.push({
            name: item.first_name + " " + item.last_name,
            id: item.personnel_id,
          });
        }
      });

    forwards[forwardIndex]["personnel"] = items;
  } catch (error) {
    message.error("دریافت اطلاعات دبیرخانه با مشکل روبرو شد");
  }

  setPageForwardTypes(forwards);
};
