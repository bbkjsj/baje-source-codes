import { Badge, Card, Col, Row, Spin } from "antd";
import ContentTop from "components/general/ContentTop";
import { pageNames } from "constant";
import { constant } from "modules/task/constant";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getLink } from "_helpers";
import { useSelector } from "react-redux";
import { getUnreadCount } from "modules/task/api/task";
import useNotifications from "hooks/useNotifications";
import { setTaskNotifications } from "store/action/notifications";
import styled from "styled-components";

const CardBoards = () => {
  const [loading, setLoading] = useState(false);
  const { push } = useHistory();
  const { notifications, dispatch } = useNotifications();

  const handleClickCardBoard = ({ status = constant.mytasks }) => {
    push(getLink(pageNames.task.index, { status }));
  };

  const getTaskUnreadCounts = useCallback(() => {
    setLoading(true);
    getUnreadCount()
      .then((res) => {
        dispatch(setTaskNotifications(res.data));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    getTaskUnreadCounts();
  }, [getTaskUnreadCounts]);

  return (
    <>
      <ContentTop title="کارتابل ها" noBack />
      <Spin spinning={loading}>
        <Row gutter={16}>
          {[
            {
              name: "وظایف",
              description: "کلیه وظایفی که شما بایستی آنها را به انجام برساند.",
              status: constant.mytasks,
              notification: notifications.tasks,
              ribbonColor: "#5eb762"
            },
            {
              name: "جهت اطلاع",
              description: "کلیه وظایفی که افراد دیگر مسئول انجام آنها هستند.",
              ribbonColor: "#f2cb90",
              status: constant.toinfo,
              notification: notifications.toInform,
            },
            {
              name: "در حال بررسی",
              description:
                "کلیه وظایفی انجام شده ای که در انتظار تایید انجام وظیفه می باشد.",
              ribbonColor: "orange",
              status: constant.inprogress,
              notification: notifications.inProgress,
            },
            {
              name: "انجام شده ها",
              description:
                "کلیه وظایفی که شما آنها را به انجام رسانده و تاییدیه اخذ گردیده است.",
              ribbonColor: "green",
              status: constant.done,
              notification: notifications.done,
            },
            {
              name: "انجام نشده ها",
              status: constant.notdone,
              description: "کلیه وظایفی انجام نشده شما.",
              ribbonColor: "#df5e53",
              notification: notifications.notDone,
            },
            {
              name: "ارجاع شده ها",
              status: constant.redirected,
              description:
                "کلیه وظایفی که شما مسئول انجام آنها بوده اید ولی آن را به شخص دیگری محول کردید.",
              notification: notifications.redirected,
            },
            {
              name: "بررسی انجام",
              status: constant.toapprove,
              description: "کلیه وظایفی که شما مسئول تایید آنها می باشد.",
              notification: notifications.toApprove,
              ribbonColor: "#4287f4"
            },
            {
              name: "گزارش وظیفه من نیست",
              status: constant.notMyDuty,
              description: "وظیفه های برگشت شده ای که کاربران گزارش کرده اند.",
              notification: notifications.notMyDuty,
              ribbonColor: "#ff941d"
            },
          ].map((item) => (
            <Col md={6} sm={8} xs={24} key={item.name} className="my-2">
              <Badge.Ribbon
                text={item.notification > 0 ? item.notification : ""}
                color={item.notification > 0 ? "red" : ""}
                style={{ display: item.notification > 0 ? "block" : "none" }}
              >
                <StyledCard
                  headStyle={{
                    backgroundColor: item.ribbonColor || "#2f75b5",
                    color: "white",
                  }}
                  title={item.name}
                  hoverable
                  onClick={() => handleClickCardBoard(item)}
                  style={{ minHeight: 200 }}
                >
                  <p>{item.description}</p>
                </StyledCard>
              </Badge.Ribbon>
            </Col>
          ))}
        </Row>
      </Spin>
    </>
  );
};

// css
const StyledCard = styled(Card)`
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #daf4f7;
  }
`;

export default CardBoards;
