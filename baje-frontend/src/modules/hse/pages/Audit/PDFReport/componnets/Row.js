import React from "react";
import { View, StyleSheet } from "@react-pdf/renderer";
/**
 *
 * @param {object} params - params of component
 * @param {"center"|"flex-start"|"flex-end"} params.align - alignment
 * @param {"center"|"space-between"|"flex-end"|"flex-start"|"space-around"|"space-evenly"} params.justify - justify
 * @param {number} params.flex - flex
 * @param {number} params.mX - margin horizontal
 * @param {number} params.mY - margin vertical
 * @param {number} params.pY - paddding vertical
 * @param {number} params.pY - paddding vertical
 * @returns
 */
const Row = ({ align, justify, flex, style, mX, mY, pX, pY, ...prp }) => {
  return (
    <View
      style={{
        alignItems: align,
        justifyContent: justify,
        flex,
        marginHorizontal: mX,
        marginVertical: mY,
        paddingHorizontal: pX,
        paddingVertical: pY,
        ...styles.container,
        ...style,
      }}
      {...prp}
    />
  );
};

const styles = StyleSheet.create({ container: { flexDirection: "row" } });

export default Row;
