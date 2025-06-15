import moment from "moment-jalaali";

export const isCommitteeMemberActive = (member, currDate = false) => {
  console.log(currDate, member.member_from);
  return (
    !member.expire &&
    moment(currDate).isSameOrAfter(member.member_from, "day") &&
    (!member.member_to ||
      moment(currDate).isSameOrBefore(member.member_to, "day"))
  );
};

export const momentFromStart = (dateString) => {
  const item = moment(dateString);

  item.setHour(0);
  item.setMinute(0);

  return item;
};

export const momentFromEnd = (dateString) => {
  const item = moment(dateString);

  item.setHour(23);
  item.setMinute(59);

  return item;
};
