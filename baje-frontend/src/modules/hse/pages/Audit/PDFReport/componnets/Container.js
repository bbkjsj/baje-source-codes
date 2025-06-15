import React from "react";
// import { View } from "@react-pdf/renderer";

/**
 *
 * @param {object} params - params of component
 * @param {"center"|"flex-start"|"flex-end"} params.align - alignment
 * @param {"center"|"space-between"|"flex-end"|"flex-start"|"space-around"|"space-evenly"} params.justify - justify
 * @param {number} params.flex - flex
 * @param {number} params.mX - margin horizontal
 * @param {number} params.mY - margin vertical
 * @returns
 */
const Container = ({ align, justify, flex, style, mX, mY, pX, pY, children, ...prp }) => {
  // Original View logic commented out
  // return (
  //   <View
  //     style={{
  //       alignItems: align,
  //       justifyContent: justify,
  //       flex,
  //       marginHorizontal: mX,
  //       marginVertical: mY,
  //       paddingHorizontal: pX,
  //       paddingVertical: pY,
  //       ...style,
  //     }}
  //     {...prp}
  //   />
  // );
  // Placeholder
  return <div style={{border: '1px dashed red', padding: '5px', margin: '2px', ...style}}>{children} {/* PDF Container Placeholder */}</div>;
};

export default Container;
