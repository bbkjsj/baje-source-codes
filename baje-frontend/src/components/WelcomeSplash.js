import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import splash_logo from "assets/img/splash_logo.png";
// splash videos
import sp_1 from "assets/videos/sp_1.mp4";
import sp_2 from "assets/videos/sp_2.mp4";
import sp_3 from "assets/videos/sp_3.mp4";
import sp_4 from "assets/videos/sp_4.mp4";
import sp_5 from "assets/videos/sp_5.mp4";
import sp_7 from "assets/videos/sp_7.mp4";
import sp_8 from "assets/videos/sp_8.mp4";
import sp_9 from "assets/videos/sp_9.mp4";
import { randomBetween } from "_helpers";

function WelcomeSplash({ show }) {
  useEffect(() => {
    document.documentElement.style.overflowY = "hidden";
    return () => {
      document.documentElement.style.overflowY = "auto";
    };
  }, []);

  const sources = [sp_1, sp_2, sp_3, sp_4, sp_5, sp_7, sp_8, sp_9];
  const randomSource = sources[randomBetween(0, sources.length - 1)];

  return createPortal(
    <StyledSplash
      className={show === "unmounting" ? "splash fade-out" : "splash"}
    >
      <video autoPlay loop muted playsInline>
        <source src={randomSource} type="video/mp4" />
      </video>

      <img src={splash_logo} alt="هلدینگ جهاد نصر" className="splash-logo" />
    </StyledSplash>,
    document.body
  );
}

// styles
const StyledSplash = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;

  video {
    width: 90%;
    margin-top: 64px;
    width: 400px;
    height: 200px;
  }

  .splash-logo {
    width: 256px;
    margin-top: 64px;
  }
`;

export default WelcomeSplash;
