import React from "react";
import useIsMobile from "hooks/useIsMobile";
import MobileList from "components/mobileList/MobileList";
import AppTable from "./AppTable";
import useMobileDetect from "use-mobile-detect-hook";

/**
 * a component that shows table if the viewport is desktop and shows mobile list if it's mobile, receives both AppTable and MobileList properties at the same time without affecting either of them negatively
 * //////////// AppTable Props ////////////
 * @param {object} props combination of AppTable and MobileList props
 * @param {object} props.dataSource -data for this table
 * @param {boolean} props.loading -table loading
 * @param {Array<{ title:string, render:Function, dataIndex:string, align:"center"|"left"|"right",
 * filters:Array<{text:string,value:string}>, onFilter:function(value, data) , filterDropdown:Function,filterIcon:Function }>} props.columns -columns
 * @param {{pageSize:number,onChange:Function,current:number}} props.pagination -pagination
 * @param {{onChange:Function,hideSelectAll:boolean,type:"radio"|"checkbox"}} props.rowSelection -rowSelection
 * @param {boolean} props.notMarginTop -notMarginTop
 * @param {object} props component's all props
 * @param {Array} props.dataSource - data list
 * @param {Object} props.pagination - antd pagination object
 * @param {boolean} [props.loading] - loading condition
 * @param {Array} [props.selected] - selected items list
 * @param {Function} [props.onSelectedChange] - onSelectedChange callback
 * @param {Object} props.tableInfo - standard table info object
 * @param {Function} props.setTableInfo - setTableInfo callback
 * @param {Array} [props.tableData] - columns and their corresponding data(actually render method), don't mistake with dataSource at least one of "columns" or "tableData" must be present
 * @param {Array} [props.itemActions] - standard item actions array
 * @param {Object} [props.singleAction] - if singleAction is provided itemActions and viewLink won't be shown, singleAction is one button with a "name" and "onClick"
 * @param {string} [props.mode] - filtering mode, default is client
 * @param {boolean} [props.showFilters = false] - show filters panel, default is false
 * @param {string} [props.viewLink] - link to view page
 * @param {Array} props.titleKeys - keys of the title, keys must be present in dataSource
 * @param {Function} props.mobileItemsTitle - a callback function that receives the item data and returns the title and thus an alternative solution to "titleKeys" which has priority over "titleKeys"
 * @param {String} props.titleSeparator - the string between title keys, which is empty space by default
 * @param {Array} [props.initialData] - initial data which doesn't change and is necessary for client side filtering, ignore if filtering is server side
 * @param {Function} [props.setData] - set data state callback, this is necessary for client side filtering, ignore if filtering is server side
 * @param {Array} props.columns - antd standard table columns, not all properties supported yet, at least one of "columns" or "tableData" must be present columns would be converted automatically and tableData is static
 * @param {boolean} [props.noRowNum] - don't show row number for list items, default is false
 * @param {boolean} [props.noSearch] - don't show search dropdown and input, which is visible by default
 * @param {boolean} [props.noSort] - don't show sort dropdowns, which is visible by default
 * @param {Function} [props.mobileItemColors] - it's a callback function that receives the item data and returns a color based on conditions, refer to "src\modules\personnel\realPerson\leaveRequest\common\Table.js" for an example
 * @param {Array} props.personFilters - filters that need person input in mobile filters panel
 * @returns
 */

const ResponsiveList = (props) => {
  const { isMobile } = useMobileDetect();
  return isMobile() ? <MobileList {...props} /> : <AppTable {...props} />;
};

export default ResponsiveList;
