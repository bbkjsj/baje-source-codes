import React, { useContext } from "react";
import styled from "styled-components";
import mobileHeadBg from "assets/images/mobile-head-bg.svg";
import ShadowAvatar from "components/general/ShadowAvatar";
import UserProfile from "assets/icons/profile_full.svg";
import WomanUserProfile from "assets/icons/profile_woman_full.svg";
import { config } from "../../../../constant";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";
import { useCallback } from "react";
import { GET_USER } from "modules/personnel/realPerson/users/utils/api";
import { useState } from "react";
import { useEffect } from "react";

const MobileHeader = () => {
  const user = useWhoAmI();
  const defaultImage = user?.gender === "f" ? WomanUserProfile : UserProfile;
  const [profile, setProfile] = useState(defaultImage);

  const setUserProfile = useCallback(() => {
    if (user?.id) {
      GET_USER(user.id).then((res) => {
        if (res?.data?.image_url) {
          setProfile(
            config.url.API_URL +
              "/api/v1/baje" +
              res?.data?.image_url.replace("$.", "")
          );
        }
      });
    }
  }, [user.id]);

  useEffect(() => {
    setUserProfile();
  }, [setUserProfile]);

  return (
    <HeaderContainer className="mobile-header fade-in">
      <ShadowAvatar src={profile} size={42} />
      <div className="mx-auto mt-2">
        <p className="mobile-header--name text-14 text-center">
          {`${user?.firstName} ${user?.lastName}`}
        </p>
        <h3 className="mobile-header--title text-white text-24 text-center font-peyda-medium mb-0">
          به <span className="font-peyda-medium">باجه</span> خوش آمدید
        </h3>
      </div>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  background-image: url(${mobileHeadBg});
  background-size: cover;
  width: 100%;
  min-height: 110px;
  padding: 30px 35px;
  display: flex;
  align-items: center;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  .mobile-header {
    &--title {
      span {
        color: #235786;
      }
    }
  }
`;

export default MobileHeader;
