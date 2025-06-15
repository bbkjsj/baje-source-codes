import React from "react";
// import { animated, useSpring } from "@react-spring/web";

const SlideUp = ({ children, delay, duration = 1000 }) => {
  // const style = useSpring({
  //   from: { y: 100, opacity: 0 },
  //   to: { y: 0, opacity: 1 },
  //   config: { duration },
  //   delay,
  // });
  return children;
  // return <animated.div style={style}>{children}</animated.div>;
};

const SlideDown = ({ children, delay, duration = 1000 }) => {
  // const style = useSpring({
  //   from: { y: -100, opacity: 0 },
  //   to: { y: 0, opacity: 1 },
  //   config: { duration },
  //   delay,
  // });

  return children;
  // return <animated.div style={style}>{children}</animated.div>;
};

const AppAnimations = { SlideUp, SlideDown };

export default AppAnimations;
