import React from "react";
import { Space, Button } from "antd";
import sort from "../../assets/images/icons/sort.svg";
import { PrinterOutlined, FilterOutlined } from "@ant-design/icons";
import styled from "styled-components";
import ExcelBtn from "./ExcelBtn";
import AppButton from "components/general/AppButton";
import PropTypes from "prop-types";
import bp from "utils/breakpoints";

const SortIcon = styled.img`
  width: 20px;
  margin-top: -3px;
`;

/**
 *ListAction : a component for displaying 4 or less actions related to table
 * @param {object} props all props of component
 * @param {string} props.className names of btns container css classes
 * @param {object} props.actions an object of actions for each btn consist of:print,excelExport
 * @param {boolean} props.noExcel a boolean to display excelBtn or not
 * @param {boolean} props.noPrint a boolean to display printBtn or not
 * @param {boolean} props.noFilter a boolean to display filterBtn or not
 * @param {boolean} props.noSort a boolean to display sortBtn or not
 * @returns
 */
const ListActions = ({
  className,
  noExcel,
  noPrint,
  noFilter,
  noSort,
  excelLoading,
  actions,
  children,
}) => {
  return (
    <StyledActions wrap className={className || ""}>
      {!noExcel && (
        <ExcelBtn onClick={actions.excelExport} loading={excelLoading} />
      )}

      {!noPrint && (
        <AppButton
          icon={<PrinterOutlined />}
          variant="gray"
          onClick={(e) =>
            actions.print && actions.print() && e.preventDefault()
          }
        />
      )}

      {!noFilter && <AppButton icon={<FilterOutlined />} variant="gray" />}

      {!noSort && (
        <AppButton icon={<SortIcon src={sort} alt="sort" />} variant="gray" />
      )}
      {children ? children : ""}
    </StyledActions>
  );
};

// types
ListActions.propTypes = {
  noExcel: PropTypes.bool,
  noPrint: PropTypes.bool,
  noFilter: PropTypes.bool,
  noSort: PropTypes.bool,
  actions: PropTypes.shape({
    excelExport: PropTypes.func,
    print: PropTypes.func,
  }),
};

const StyledActions = styled(Space)`
  @media (max-width: ${bp.lg}) {
    display: block;
    width: 100%;
  }
`;

export default ListActions;
