import React, { useContext } from "react";
import UserProfile from "../../assets/icons/profile.svg";
import WomanUserProfile from "../../assets/icons/profile_woman.svg";
import { DownOutlined } from "@ant-design/icons";
import { Menu, Dropdown } from "antd";
import moment from "moment-jalaali";
import { config } from "../../constant";
import { NewContext } from "contex/New-context";
import { useSelector } from "react-redux";
import styled from "styled-components";
import useWhoAmI from "hooks/useWhoAmI";

const SiderTopSection = (props) => {
  const user = useWhoAmI();
  const newContext = useContext(NewContext);
  if (!user) {
    return null;
  }

  const isPublicSuggestion = newContext.isPublicSuggestion();

  const menu = (
    <Menu style={{ padding: "0.5rem" }}>
      <Menu.Item key="0">
        <p>ناحیه کاربری</p>
      </Menu.Item>
      <Menu.Item key="1">
        <p>ویرایش اطلاعات</p>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">خروج</Menu.Item>
    </Menu>
  );

  const dropDown = (
    <Dropdown overlay={menu} trigger={["click"]}>
      <DropDownText onClick={(e) => e.preventDefault()}>
        پروفایل <DownOutlined />
      </DropDownText>
    </Dropdown>
  );

  return (
    <StyledContainer>
      <div className="userInfo">
        <img
          src={
            user.profileImage
              ? `${config.url.API_URL + user.profileImage}`
              : user?.gender === "m"
              ? UserProfile
              : WomanUserProfile
          }
          className="profile"
          alt="profileImage"
        />
        <h3 className="userName">{`${user.firstName} ${user.lastName}`}</h3>

        <h4 className="welcomeText">خوش آمدید</h4>
        {!isPublicSuggestion && dropDown}
      </div>
      <div className="time">
        <p className="timeText">
          <span>تاریخ امروز : </span>
          <span>{moment().format("jYYYY/jM/jD")}</span>
        </p>
      </div>
    </StyledContainer>
  );
};

//css
const StyledContainer = styled.div`
  background-color: #2f4050;
  background-image: url(../../assets/paterns/header-profile.png);
  background-repeat: no-repeat;
  background-size: cover;

  .userInfo {
    padding: 20px 0;
    text-align: center;

    .profile {
      height: 80px;
      width: 80px;
      border-radius: 50%;
      border: 5px solid #ced6e0;
    }

    .userName {
      color: #fff;
      margin-top: 10px;
      font-family: "Peyda-Bold";
      margin-bottom: 3px;
    }

    .welcomeText {
      color: #fff;
      margin-bottom: 10px;
    }
  }

  .time {
    padding: 8px 14px;

    .timeText {
      color: #dcdde1;
      display: flex;
      justify-content: space-around;
      border: 2px solid #7f8fa6;
      padding: 3px;
      border-radius: 3px;

      &:first-child {
        font-size: 1.1em;
      }
    }
  }
`;
const DropDownText = styled.p`
  color: #8095a8;
  cursor: pointer;
`;

export default SiderTopSection;
