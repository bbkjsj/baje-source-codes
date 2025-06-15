import React from "react";
// import { Text } from "@react-pdf/renderer";
import { max, maxBy } from "lodash";

/**
 *
 * @param {object} params - params of component
 * @param {string} params.color - color
 * @param {number} params.size - size
 * @param {number} params.mX - margin horizontal
 * @param {number} params.mY - margin vertical
 * @param {boolean} params.semibold - semibold
 * @param {boolean} params.bold - bold
 * @param {boolean} params.black - black
 * @returns
 */
const IText = ({
  size = 12,
  mX,
  mY,
  color,
  style,
  semibold,
  bold,
  black,
  children, // Added children to props
  ...prp
}) => {
  // Original Text logic commented out
  // return (
  //   <Text
  //     style={{
  //       color,
  //       fontSize: size,
  //       fontFamily: "peyda",
  //       fontStyle: semibold
  //         ? "semibold"
  //         : bold
  //         ? "bold"
  //         : black
  //         ? "black"
  //         : null,
  //       marginHorizontal: mX,
  //       marginVertical: mY,
  //       ...style,
  //     }}
  //     {...prp}
  //   />
  // );
  // Placeholder
  const fontStyle = semibold ? "600" : bold ? "700" : black ? "900" : "normal";
  const inlineStyle = {
    color: color,
    fontSize: size,
    fontFamily: "peyda, sans-serif", // Added fallback font
    fontWeight: fontStyle,
    margin: `${mY || 0}px ${mX || 0}px`,
    ...style,
  };
  return <span style={inlineStyle} {...prp}>{children}</span>; // PDF Text Placeholder
};

export default IText;
