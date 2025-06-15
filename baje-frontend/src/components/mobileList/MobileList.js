import React, { useEffect, useLayoutEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import AppButton from "components/general/AppButton";
import { FilterOutlined } from "@ant-design/icons";
import { List } from "antd";
import MobileListFilterPanel from "./MobileListFilterPanel";
import MobileListItem from "./MobileListItem";
import qs from "query-string";
import styled from "styled-components";
import useAppendLocationState from "hooks/useAppendLocation";
import { jsxToString } from "_helpers";
import useFirstRender from "hooks/useFirstRender";

/**
 * A custom alternative list view for mobiles, created almost from scratch, be careful and precise with the props
 * refer to src\modules\personnel\realPerson\leaveRequest\common\Table.js and other pages with mobile view for an example
 * preferably use "columns" instead of "tableData" whenever possible
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
 * @param {boolean} [props.defaultSorter] - if data is sorted by default outside this component, set this to true
 * @param {Array} props.personFilters - filters that need person input in mobile filters panel
 * @returns
 */

const MobileList = ({
  dataSource,
  pagination,
  loading,
  selected,
  onSelectedChange,
  tableInfo,
  setTableInfo,
  tableData,
  itemActions,
  singleAction,
  filterMode = "client",
  showFilters = false,
  viewLink,
  titleKeys,
  titleSeparator = " ",
  initialData,
  setData,
  columns,
  noRowNum,
  noSearch,
  noSort,
  filterPaneLTitle,
  mobileItemsTitle,
  mobileItemColors,
  defaultSorter,
  personFilters,
}) => {
  const [isMobileFilterVisible, setIsMobileFilterVisible] = useState(false);
  const [columnData, setColumnData] = useState([]);
  const [itemColumns, setItemColumns] = useState(columns);
  const [appendModal, setAppendModal] = useAppendLocationState("filterModal");
  const location = useLocation();
  const history = useHistory();

  // reenable window scroll when back is pressed and modal is closed
  useEffect(() => {
    window.addEventListener("popstate", () => {
      document.body.style.overflowY = "auto";
    });

    let filters = {};
    let sorter = {};

    if (location.search) {
      const searchParams = qs.parse(location.search);

      if (searchParams && Object.keys(searchParams).length > 0) {
        for (let key in searchParams) {
          if (key !== "page" && key !== "sort" && key !== "sort_order") {
            if (!filters[key]) {
              filters[key] = searchParams[key];
            }
          }
        }

        // load saved sorter

        if (searchParams.sort && searchParams.sort_order) {
          sorter.field = searchParams.sort;
          sorter.columnKey = searchParams.sort;
          sorter.order = searchParams.sort_order;
        }

        setTableInfo((curr) => ({
          ...curr,
          filters,
          sorter,
        }));
      }
    }

    // remove event on unmount
    return () => {
      window.removeEventListener("popstate", () => {
        document.body.style.overflowY = "auto";
      });
    };
  }, []);

  // handle filters and sort on client if filterMode is client
  useEffect(() => {
    if (isMobileFilterVisible === false && showFilters && tableInfo?.filters) {
      if (
        filterMode === "client" &&
        ((initialData && Array.isArray(initialData)) || columnData.length) &&
        showFilters
      ) {
        let filteredData = columnData ? [...columnData] : [...initialData];
        // console.log("initial filtered:", filteredData);

        let filters = { ...tableInfo.filters };
        let sorter = { ...tableInfo.sorter };

        if (filters && Object.keys(filters).length) {
          for (let key in filters) {
            filteredData = filteredData.filter((item) => {
              const itemKey =
                item[key] &&
                typeof item[key] === "string" &&
                item[key].toLowerCase().replace(/\s+/g, "");
              const filtersKey =
                filters[key] &&
                typeof filters[key] === "string" &&
                filters[key].toLowerCase().replace(/\s+/g, "");

              // console.log("item:", item);
              // console.log(`item key:${itemKey} - filtersKey:${filtersKey}`);

              // filters logic, handling multiple possibilities, and some possibilities might be missed.
              if (item[key] !== undefined) {
                if (typeof item[key] === "string" && filtersKey && itemKey) {
                  return itemKey.includes(filtersKey)
                    ? true
                    : filtersKey.includes(itemKey); // in some cases filters[key] is actually an array but as a string with commas
                } else if (typeof item[key] !== "string" && filtersKey) {
                  return filtersKey.includes(
                    String(item[key]).toLowerCase().replace(/\s+/g, "")
                  );
                } else {
                  return item[key] == filters[key];
                }
              }
              return false;
            });
          }
        }

        // make sort completely based on table's columns data
        if (sorter && sorter.order) {
          //console.log("sorter:", sorter);
          const colSorter = columns.find(
            (col) =>
              col.key === sorter.columnKey || col.dataIndex === sorter.columnKey
          );
          if (colSorter && colSorter?.sorter) {
            filteredData.sort((a, b) => {
              if (sorter.order === "ascend") {
                return colSorter.sorter(a, b);
              } else {
                return colSorter.sorter(b, a);
              }
            });
          }
        } else if (
          defaultSorter &&
          (!filters ||
            (typeof filters === "object" && !Object.keys(filters).length))
        ) {
          // if no filters are applied, sort by default
          filteredData = initialData;
        }

        setData(filteredData);
        // console.log(
        //   "***************** FILTERS UPDATED ***************** new data:",
        //   filteredData
        // );
      }
    }
  }, [
    tableInfo,
    initialData,
    columnData,
    defaultSorter,
    isMobileFilterVisible,
  ]);

  useLayoutEffect(() => {
    // convert columns to mobile list columns
    const mobileItemColumns = [];
    if (columns) {
      for (let column of columns) {
        const col = {};
        if (
          column.title !== "تنظیمات" &&
          column.title !== "ابزار" &&
          column.key !== "action"
        ) {
          col.title = column.title;
          col.hideMobile = column.hideMobile || false;

          if (column.render && column.dataIndex) {
            col.value = (data) => column.render(data[column.dataIndex], data);
          } else if (column.dataIndex) {
            col.value = (data) => data[column.dataIndex];
          } else if (column.render) {
            col.value = (data) => column.render(data);
          }

          if (column.textFilter && column.dataIndex) {
            col.filter = "search";
            col.filterIndex = column.dataIndex;
          } else if (
            column.selectFilter &&
            column.configFilters &&
            column.dataIndex
          ) {
            col.filter = column.configFilters;
            col.filterIndex = column.dataIndex;
          }

          if (column.sorter) {
            col.sorter = true;
            col.filterIndex = column.dataIndex;
          }

          if (col.title && col.value) {
            mobileItemColumns.push(col);
          }
        }
      }

      setItemColumns(mobileItemColumns);

      // add custom columns that don't exist in data for filtering
      const datas = initialData || dataSource;
      let columnDatas;
      if (datas && datas.length) {
        columnDatas = datas.map((item, idx) => {
          const data = { ...item };
          for (let column of mobileItemColumns) {
            const val = column.value(data, idx);
            if (data[column.filterIndex] === undefined) {
              data[column.filterIndex] =
                typeof val === "object" ? jsxToString(val) : val;
            }
          }
          return data;
        });
      }
      if (columnDatas) {
        setColumnData(columnDatas);
      }
    }
  }, [initialData]);

  // save page
  const handlePageChange = (page, pageSize) => {
    if (setTableInfo) {
      setTableInfo((state) => ({
        ...state,
        pagination: { ...state.pagination, current: page, pageSize },
        silentUpdate: false,
      }));
    }

    if (tableInfo && tableInfo.pagination.current !== page) {
      const queryParams = qs.parse(location.search);
      const newQueries = { ...queryParams, page: page };
      history.replace({ search: qs.stringify(newQueries) });
    }
    window.scrollTo({
      top: 100,
      behavior: "smooth",
    });
  };

  return (
    <>
      {showFilters ? (
        <AppButton
          icon={<FilterOutlined />}
          variant="primary"
          onClick={() => {
            setIsMobileFilterVisible(true);
            document.body.style.overflowY = "hidden";
            setAppendModal(true);
          }}
          className="mt-3 mr-auto"
        />
      ) : (
        ""
      )}
      <List
        className="mt-3"
        dataSource={dataSource}
        pagination={pagination && { ...pagination, onChange: handlePageChange }}
        loading={loading}
        renderItem={(item, idx) => (
          <StyledListItem key={idx}>
            <MobileListItem
              key={item.id || idx}
              data={item}
              idx={
                ((tableInfo?.pagination?.current || 1) - 1) *
                  (tableInfo?.pagination?.pageSize || 20) +
                idx
              }
              selected={selected}
              onSelectedChange={onSelectedChange}
              tableData={itemColumns || tableData}
              itemActions={itemActions}
              singleAction={singleAction}
              viewLink={viewLink || null}
              titleKeys={titleKeys}
              titleSeparator={titleSeparator}
              mobileItemsTitle={mobileItemsTitle}
              noRowNum={noRowNum}
              mobileItemColors={mobileItemColors}
            />
          </StyledListItem>
        )}
      />
      {isMobileFilterVisible && showFilters && appendModal && (
        <MobileListFilterPanel
          onClose={(qParams) => {
            setIsMobileFilterVisible(false);
            document.body.style.overflowY = "auto";

            // handle close modal on browser back (which is actually impossible and this workaround is extremely bug prone)
            history.goBack();
            setAppendModal(false);
            if (qParams) {
              setTimeout(() => {
                history.replace({ search: qs.stringify(qParams) });
              }, 300);
            }
          }}
          tableInfo={tableInfo}
          setTableInfo={setTableInfo}
          tableData={tableData || itemColumns}
          filterMode={filterMode}
          noSearch={noSearch}
          noSort={noSort}
          filterPaneLTitle={filterPaneLTitle}
          personFilters={personFilters}
        />
      )}
    </>
  );
};

//css
const StyledListItem = styled(List.Item)`
  border: none !important;
  padding: 0;
`;

export default MobileList;
