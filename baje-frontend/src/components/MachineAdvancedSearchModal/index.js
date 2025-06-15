import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import { getMachineList } from "modules/machinery/utils/index";
import { columns } from "./columns";
import { permission } from "json/Permission";
import useCheckAccess from "hooks/useCheckAccess";
import { CheckAccess } from "AuxComponent/CheckAccess";
import useTableSearch from "hooks/useTableSearch";
import { useSelector } from "react-redux";
import qs from "query-string";
import ResponsiveList from "components/general/ResponsiveList";
import useTableSelectSearch from "hooks/useTableSelectSearch";
import styled, { keyframes } from "styled-components";
import { CloseOutlined } from "@ant-design/icons";

const { LIST_MACHINERY } = permission;

const MachineSearchModal = ({ onChoose, visible, handleCancel }) => {
  const [listLoading, setListLoading] = useState(false);
  const [list, setList] = useState([]);
  const history = useHistory();
  const checkAccess = useCheckAccess();
  const tableSearch = useTableSearch();
  const [exportKey, setExportKey] = useState();
  const currentOffice = useSelector((state) => state.currentOffice);
  const currentContract = useSelector((state) => state.currentContract);
  const currentEnvironment = useSelector((state) => state.currentEnvironment);
  const [initialList, setInitialList] = useState([]);
  ////
  const location = useLocation();
  const searchParams = qs.parse(location.search);
  const [filterOptions, setFilterOptions] = useState({
    style: [],
    system: [],
    type: [],
  });

  const [tableInfo, setTableInfo] = useState({
    pagination: {
      current: searchParams.page ? +searchParams.page : 1,
      defaultPageSize: 20,
    },
  });
  const selectSearch = useTableSelectSearch();

  useEffect(() => {
    if (!checkAccess(LIST_MACHINERY)) {
      setListLoading(false);
    }
    if (currentContract && currentOffice && checkAccess(LIST_MACHINERY)) {
      setListLoading(true);

      (async () => {
        await getMachineList(
          setList,
          setListLoading,
          currentContract,
          currentOffice,
          currentEnvironment,
          setExportKey,
          setInitialList,
          setFilterOptions
        );
      })();
    }
  }, [currentOffice, currentContract, currentEnvironment]);

  const handleTableChange = (
    pagination,
    filters,
    sorter,
    { currentDataSource, action }
  ) => {
    //Reset current page on filter or sort
    if (action !== "paginate")
      pagination = {
        ...pagination,
        current: 1,
      };

    // save current page if it is updated as url query param so that the page would be loaded on back or refresh
    if (action !== "filter") {
      const queryParams = qs.parse(location.search);
      const newQueries = { ...queryParams };
      const isDiffPage = pagination.current !== tableInfo.pagination.current;
      const isDiffSort =
        !queryParams?.sort ||
        (queryParams?.sort &&
          (sorter?.field !== queryParams.sort ||
            sorter?.order !== queryParams.sort_order));

      if (isDiffPage) {
        newQueries.page = pagination.current;
      }
      if (isDiffSort) {
        newQueries.sort = sorter.field;
        newQueries.sort_order = sorter.order;
      }
      if (!sorter.order) {
        delete newQueries.sort_order;
        delete newQueries.sort;
      }

      if (isDiffPage || isDiffSort) {
        history.replace({ search: qs.stringify(newQueries) });
      }
    }

    //Trigger changes on table info
    setTableInfo({
      pagination,
      filters,
      sorter,
    });
  };

  return (
    <StyledModal visible={visible}>
      <div className="header">
        <div className="title">انتخاب ماشین</div>
        <CloseOutlined
          className="close"
          onClick={() => {
            history.replace({ search: qs.stringify({}) });
            handleCancel();
          }}
        />
      </div>
      <div className="container">
        {list && (
          <CheckAccess permission={LIST_MACHINERY}>
            <ResponsiveList
              dataSource={list}
              pagination={tableInfo?.pagination}
              tableInfo={tableInfo}
              setTableInfo={setTableInfo}
              filterMode="client"
              singleAction={{
                name: "انتخاب",
                onClick: (record) => onChoose(record),
              }}
              showFilters={true}
              columns={columns(
                history,
                tableSearch,
                qs.parse(location.search),
                onChoose,
                selectSearch,
                filterOptions
              )}
              titleKeys={["type", "companyName", "organizationCode"]}
              titleSeparator=" | "
              initialData={initialList}
              setData={setList}
              loading={listLoading}
              rowKey={(record) => record.id}
              onChange={handleTableChange}
              noSearch
              noSort
              filterPaneLTitle="فیلتر"
            />
          </CheckAccess>
        )}
      </div>
    </StyledModal>
  );
};

// css
const StyledModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 10;
  padding: 16px;
  display: ${(props) => (props.visible ? "block" : "none")};
  overflow-y: auto;

  .container {
    width: 100%;
    max-width: 1280px;
    margin: 16px auto;
    padding-top: 50px;
  }
  .close {
    z-index: 4;
    font-size: 26px;
  }
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 4;
    background: white;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    padding: 16px;

    .title {
      flex-grow: 1;
      font-size: 1.2em;
    }
  }
`;

export default MachineSearchModal;
