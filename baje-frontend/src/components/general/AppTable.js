import React, { useRef, useEffect, useState } from "react";
import { Table } from "antd";
import styled, { keyframes } from "styled-components";
import bp from "../../utils/breakpoints";
import useIsMobile from "../../hooks/useIsMobile";
import PropTypes from "prop-types";

/**
 * App Table
 * @param {object} props -props of component
 * @param {object} props.dataSource -data for this table
 * @param {boolean} props.loading -table loading
 * @param {Array<{ title:string, render:Function, dataIndex:string, align:"center"|"left"|"right",
 * filters:Array<{text:string,value:string}>, onFilter:function(value, data) , filterDropdown:Function,filterIcon:Function }>} props.columns -columns
 * @param {{pageSize:number,onChange:Function,current:number}} props.pagination -pagination
 * @param {{onChange:Function,hideSelectAll:boolean,type:"radio"|"checkbox"}} props.rowSelection -rowSelection
 * @param {boolean} props.notMarginTop -notMarginTop
 * @param {string} props.className -custome tabel class
 * @returns
 */
const AppTable = ({ columns, ...props }) => {
  const isMobile = useIsMobile();
  const tableRef = useRef(null);
  const [current, setCurrent] = useState(1);
  useEffect(() => {
    props.current ? setCurrent(props.current) : setCurrent(1);
  }, [props.current]);

  const onChange = (page) => {
    setCurrent(page);
  };

  const handleOnShowSizeChange = (curr, size) => {
    window.localStorage.setItem("table_page_size", size);
  };

  return (
    <StyledTable
      {...props}
      columns={columns.map((item) => ({ align: "center", ...item }))}
      className={`${props.notMarginTop ? null : "mt-3"} ${props.className}`}
      ref={tableRef}
      bordered
      scroll={{
        x: isMobile ? 1080 : props.scrollX || "1080",
        y: isMobile
          ? "100vh"
          : props.scrollY === true
          ? "calc(100vh - 200px)"
          : props.scrollY,
      }}
      pagination={{
        current: current || 1,
        total: props.dataSource?.length,
        position: ["none", "bottomRight"],
        showQuickJumper: true,
        defaultPageSize: window.localStorage.getItem("table_page_size") || 20,
        pageSizeOptions: [10, 20, 50, 100],
        onShowSizeChange: handleOnShowSizeChange,
        onChange: onChange,
        ...(props.pagination ? props.pagination : {}),
      }}
      filterMultiple={false}
    />
  );
};

AppTable.propTypes = {
  ...Table.propTypes,
  columns: PropTypes.array,
};

const trFadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const trFadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

// css
const StyledTable = styled(Table)`
  td {
    padding: 4px 8px !important;
    white-space: ${(props) => (props.noWrapContent ? "nowrap" : "normal")};
  }
  .ant-table-measure-row {
    padding: 0px !important;
    margin: 0px !important;
    border: none !important;
    opacity: 0;
    height: 0px !important;
    width: 0px !important;
    z-index: -1;
  }
  th {
    border-left: 1px solid #7dafdd !important;
    border-top: 1px solid #7dafdd !important;
    border-bottom: 1px solid #7dafdd !important;
    padding: 0px 0px !important;
    font-family: "Peyda-Regular";
    font-size: 13px;
    text-align: right !important;
    &:not(.ant-table-selection-column) {
      //padding-right: 0px !important;
      @media (min-width: ${bp.md}) {
        // padding-right: 0px !important;
      }
    }
    &.ant-table-selection-column {
      padding: 0px 7px !important;
    }
  }
  .ant-table-container table > thead > tr:first-child th:first-child {
    border-top-left-radius: 0px;
    border-top-right-radius: 4px;
    border-right: 1px solid #7dafdd !important;
    border-left: 1px solid #7dafdd !important;
    padding-right: 16px !important;
  }
  .ant-table-container table > thead > tr:first-child th:last-child {
    border-top-right-radius: 0px;
    border-top-left-radius: 4px;
  }
  .ant-table-tbody > tr:nth-of-type(even) {
    background-color: #f5f5f5;
  }
  .ant-table-tbody > tr:last-of-type {
    border-radius: 4px;
    & > td:first-of-type {
      border-bottom-right-radius: 4px;
    }
    & > td:last-of-type {
      border-bottom-left-radius: 4px;
    }
  }

  .ant-table-container {
    border-radius: 4px;
    &::before,
    &::after {
      box-shadow: none !important;
    }
  }

  .ant-pagination-item-active {
    color: white;
    a {
      color: white;
    }
  }

  .ant-pagination-next:not(.ant-pagination-disabled) button {
    background: #e5eff8;
    border-color: ${({ theme }) => theme.primary};
    .anticon {
      color: ${({ theme }) => theme.primary};
    }
  }

  .ant-pagination-disabled {
    button {
      background: rgba(0, 0, 0, 0.05);
      border: 1px solid #d9d9d9;
    }
  }

  .ant-table-body {
    overflow: auto !important;
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.02);
      border-radius: 0px 0px 3px 0px;
      border: 1px solid rgba(0, 0, 0, 0.09);
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.25);
      border-radius: 999px;
      width: 8px;
      height: 8px;
      &:hover,
      &:active {
        background: rgba(0, 0, 0, 0.4);
      }
    }
  }

  tr {
    animation: ${trFadeIn} 0.6s ease;
    transition: opacity 0.6s ease;
    &.removing {
      opacity: 0;
    }
  }

  .ant-table-column-sorters {
    padding: 0px !important;
  }
  .ant-table-filter-column-title {
    padding: 0px !important;
  }
  .ant-table-filter-column {
    margin: 0px !important;
  }

  th.ant-table-cell {
    padding: 10px 8px !important;
  }

  .ant-table-column-sorters-with-tooltip {
    padding-left: 16px;
  }

  /* .ant-table-filter-trigger .anticon-search,
  .ant-table-filter-trigger .anticon-filter,
  .ant-table-filter-trigger .anticon-calendar {
    color: #f5222d !important;
  }

  .ant-table-filter-trigger.ant-dropdown-open {
    .anticon-search,
    .anticon-filter,
    .anticon-calendar {
      color: #f5222d !important;
      background: #ffffff;
      object-fit: cover;
      text-decoration: none;
      position: fixed;
      
    }
  } */

  .ant-table-column-sorter-up.active,
  .ant-table-column-sorter-down.active {
    color: #f5222d;
  }
`;

export default AppTable;
