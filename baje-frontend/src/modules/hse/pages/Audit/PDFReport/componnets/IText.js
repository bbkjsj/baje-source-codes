import React from "react";
import { Text } from "@react-pdf/renderer";
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
  ...prp
}) => {
  return (
    <Text
      style={{
        color,
        fontSize: size,
        fontFamily: "peyda",
        fontStyle: semibold
          ? "semibold"
          : bold
          ? "bold"
          : black
          ? "black"
          : null,
        marginHorizontal: mX,
        marginVertical: mY,
        ...style,
      }}
      {...prp}
    />
  );
};

export default IText;
