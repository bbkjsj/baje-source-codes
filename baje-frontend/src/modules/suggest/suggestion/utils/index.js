import { forwardTypesMap, forwardTypesPermissions } from "../const";
import * as api from "./api";
import * as committeeApi from "../../committee/utils/api";
import { committeeMemberPosition } from "../../committee/const";
import { message, Modal, Space, Tooltip } from "antd";
import AppButton from "../../../../components/general/AppButton";
import { MailOutlined } from "@ant-design/icons";
import React from "react";

export const uniqueListConvertor = (data, isPublic) => {
  //   console.log(isPublic, "!!sug");
  if (!isPublic) {
    console.log({ oldData: data });
    const newData = [];
    data.forEach((element, i) => {
      const newRoles = [];
      const index = newData.findIndex(
        (el) => el.s_id && element.s_id && el.s_id === element.s_id
      );

      if (index == -1) {
        data.forEach((item) => {
          if (element.s_id === item.s_id) {
            newRoles.push(item.role);

            element.workgroup_id_fk = element.workgroup_id_fk
              ? element.workgroup_id_fk
              : item.workgroup_id_fk;

            element.excellent_member_vote = element.excellent_member_vote
              ? element.excellent_member_vote
              : item.excellent_member_vote;
          }
        });
        const newElement = { ...element, totalRoles: newRoles };
        newData.push(newElement);
      }
    });
    console.log({ newData });
    return newData;
  } else {
    // console.log("!is pb");
    return data.map((el) => ({ ...el, totalRoles: [] }));
  }
};

export const setSuggestionAsSeen = async (id, isPublic) => {
  try {
    isPublic ? await api._SET_AS_SEEN_PUBLIC(id) : await api._SET_AS_SEEN(id);
  } catch (error) {
    console.log("ثبت دیده شدن پیشنهاد با مشکل روبرو شد");
  }
};

export const checkSuggestionPermission = (
  permittedRoles = [],
  totalRoles = []
) => {
  let hasAccess = false;

  permittedRoles.forEach((role) => {
    if (totalRoles?.includes(role)) hasAccess = true;
  });

  return hasAccess;
};

export const findCommitteeHead = async (committeeId) => {
  try {
    const res = await committeeApi._GET_MEMBER(committeeId);
    let result = false;

    if (Array.isArray(res.data))
      await res.data.forEach((item) => {
        if (item.position === committeeMemberPosition.SECRETARY) {
          result = {
            name: item.first_name + " " + item.last_name,
            id: item.personnel_id,
          };
        }
      });

    return result;
  } catch (error) {
    message.error("دریافت اطلاعات کارگروه با مشکل روبرو شد");
  }
};

export const getButtons = (record) => {
  const items = [];

  if (record.message && record.message !== "****")
    items.push(
      <Tooltip title="مشاهده پیام">
        <AppButton
          onClick={() => {
            Modal.info({
              title: "پیام همراه ارجاع",
              content: record.message,
            });
          }}
          type="text"
          variant="alt-primary"
          icon={<MailOutlined className="text-13" />}
        >
          {null}
        </AppButton>
      </Tooltip>
    );

  return <Space>{items}</Space>;
};

export const getForwardTypes = (record, pageForwardTypes) => {
  if (!forwardTypesMap[record.status]) return false;
  else
    return forwardTypesMap[record.status]
      .filter((forwardType) => {
        return (
          !forwardTypesPermissions[forwardType] ||
          forwardTypesPermissions[forwardType].filter((role) =>
            record.totalRoles?.includes(role)
          ).length
        );
      })
      .map((value) => pageForwardTypes.find((item) => item.value === value))
      .filter((item) => item !== undefined);
};
