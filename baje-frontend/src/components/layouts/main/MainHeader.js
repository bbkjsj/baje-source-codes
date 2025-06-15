import { Select, Space, Spin } from "antd";
import AppSelect from "../../general/AppSelect";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { LayoutContext } from "contex/Layout-context";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentOffice } from "../../../store/action/currentOffice";
import { setContractList } from "../../../store/action/contractList";
import { setCurrentContract } from "../../../store/action/currentContract";
import { NewContext } from "contex/New-Context";
import { setOfficeLogo } from "store/action/officeLogo";
import { setCurrentEnvironment } from "store/action/currentEnvironment";
import { useLocation } from "react-router-dom";
import { _GET } from "modules/environment/enviromentDefinition/utils/api";
import { getPermissionsList } from "modules/permissions/utils/api";
import { stringCommonLetters } from "_helpers";
import useWhoAmI from "hooks/useWhoAmI";
import { getUnreadCount } from "modules/task/api/task";
import { setTaskNotifications } from "store/action/notifications";
const { Option } = Select;

const MainHeader = () => {
  const layoutContext = useContext(LayoutContext);
  const newContext = useContext(NewContext);
  //
  const dispatch = useDispatch();
  const user = useWhoAmI();
  const listLegal = user.companies || [];
  const currentOffice = useSelector((state) => state.currentOffice);
  const currentContract = useSelector((state) => state.currentContract);
  const contractList = useSelector((state) => state.contractList);
  const currentEnvironment = useSelector((state) => state.currentEnvironment);

  const [environmentsList, setEnvironmentsList] = useState([]);
  const [environmentsFiltered, setEnvironmentsFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  //
  const isDoctor = user.isDoctor;
  const isPublicSuggestion = newContext.isPublicSuggestion();
  // watch location and change the visibility of contract and environment selects
  const [showContracts, setShowContracts] = useState(false);
  const [showEnvironments, setShowEnvironments] = useState(false);
  const [matchingMinAccess, setMatchingMinAccess] = useState("company");
  const [accessList, setAccessList] = useState([]);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("insurance/tamin")) {
      setShowContracts(true);
    } else if (showContracts === true) {
      setShowContracts(false);
    }

    if (
      location.pathname.includes("real-persons") ||
      location.pathname.includes("machinery") ||
      location.pathname.includes("hse/audit")
    ) {
      setShowEnvironments(true);
    } else if (showEnvironments === true) {
      setShowEnvironments(false);
    }

    if (accessList.length) {
      findMatchingMinAccess(accessList);
    }
  }, [location.pathname]);

  useEffect(() => {
    layoutContext.setTablePage(1);
    getEnvironmentList();
    getAccessList();
    getTaskUnreadCounts();
  }, []);

  // filter environments based on office and page
  useEffect(() => {
    const filterEnvironments = (company) => {
      if (
        (location.pathname.includes("real-persons") ||
          location.pathname.includes("machinery") ||
          location.pathname.includes("hse/audit")) &&
        environmentsList.length
      ) {
        let filtered = [...environmentsList];
        // only show environments with indie chart if in real persons page and with indie machinery in
        if (location.pathname.includes("real-persons")) {
          filtered = filtered.filter((i) => i.independentChart == 1);
        } else if (location.pathname.includes("machinery")) {
          filtered = filtered.filter((i) => i.independentVehicle == 1);
        }

        // filter by company
        if (company != "-1") {
          filtered = filtered.filter((i) => i.companyId == company);
        }
        setEnvironmentsFiltered(filtered);
      }
    };
    filterEnvironments(currentOffice);
  }, [currentOffice, environmentsList]);

  const getEnvironmentList = () => {
    setLoading(true);

    _GET()
      .then((res) => {
        setLoading(false);
        setEnvironmentsList(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  const getAccessList = () => {
    setLoading(true);

    getPermissionsList().then((res) => {
      setAccessList(res.data);
      findMatchingMinAccess(res.data);
    });
  };

  function findMatchingMinAccess(list) {
    if (list.length) {
      const findFirstMatching = list.find((access) => {
        return location.pathname.includes(
          access.name.split("/")[0].replace("-", "_")
        );
      });
      if (findFirstMatching) {
        setMatchingMinAccess(findFirstMatching.minimumRequiredAccessLevel);
      }
    }
  }

  const getTaskUnreadCounts = useCallback(() => {
    getUnreadCount()
      .then((res) => {
        dispatch(setTaskNotifications(res.data));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  return (
    !isDoctor &&
    !isPublicSuggestion &&
    user && (
      <Spin spinning={loading}>
        <div className="flex-wrap align-center">
          {matchingMinAccess === "company" ||
          matchingMinAccess === "environment" ? (
            <AppSelect
              value={currentOffice}
              onChange={(v) => {
                dispatch(setCurrentOffice(v));
                dispatch(setCurrentContract("-1"));
                dispatch(setCurrentEnvironment("-1"));
                newContext.getContractList(v);
                layoutContext.setTablePage(1);
                if (v) {
                  const findOffice = listLegal.find((i) => i.id == v);
                  dispatch(
                    setOfficeLogo(
                      findOffice && findOffice.logoUrl ? findOffice.logoUrl : ""
                    )
                  );
                }
              }}
              disabled={layoutContext.disableHeaderSelects}
            >
              <Option key="all" value="-1">
                تمام شرکت ها
              </Option>
              {listLegal.map((el) => (
                <Option key={el.id} value={el.id} title={el.name}>
                  {el.name}
                </Option>
              ))}
            </AppSelect>
          ) : (
            ""
          )}

          {showContracts ? (
            <AppSelect
              value={currentContract}
              onChange={(v) => {
                dispatch(setCurrentContract(v));
                layoutContext.setTablePage(1);
              }}
              className="mr-2"
              disabled={layoutContext.disableHeaderSelects}
            >
              <Option key="all" value="-1">
                تمامی قراداد ها
              </Option>

              {contractList.map((el) => (
                <Option
                  key={el.contract_id}
                  value={el.contract_id}
                  title={el.subject}
                >
                  {el.subject}
                </Option>
              ))}
            </AppSelect>
          ) : (
            ""
          )}

          {showEnvironments || matchingMinAccess === "environment" ? (
            <AppSelect
              value={currentEnvironment}
              onChange={(v) => {
                dispatch(setCurrentEnvironment(v));
                layoutContext.setTablePage(1);
              }}
              className="mr-2"
              disabled={layoutContext.disableHeaderSelects}
            >
              <Option key="all" value="-1">
                تمامی محیط ها
              </Option>

              {environmentsFiltered.map((el) => (
                <Option key={el.id} value={el.id} title={el.title}>
                  {el.title}
                </Option>
              ))}
            </AppSelect>
          ) : (
            ""
          )}

          {/* <HeaderActions size="middle" className="mr-auto">
        <SearchOutlined className="hide-mobile" />
        <Badge size="small" count={3} className="hide-mobile">
          <BellOutlined />
        </Badge>
        <QuestionCircleOutlined />
      </HeaderActions> */}
        </div>
      </Spin>
    )
  );
};

const HeaderActions = styled(Space)`
  .anticon {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    &:hover {
      color: ${({ theme }) => theme.primary};
    }
  }
`;

export default MainHeader;
