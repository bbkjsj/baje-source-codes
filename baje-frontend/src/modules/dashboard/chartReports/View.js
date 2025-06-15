import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  Divider,
  Form,
  Row,
  TreeSelect,
  Spin,
  Col,
  Menu,
  Dropdown,
} from "antd";
import ContentTop from "components/general/ContentTop";
import * as FormItem from "./formItems";
import { reportTypes, periodicReportTypes } from "modules/dashboard/const";
import SubmitBtn from "components/general/SubmitBtn";
import { getList, getChartData } from "./utils/index";
import styled from "styled-components";
import DailyProduction from "./components/DailyProduction";
import EmptyChart from "./components/EmptyChart";
import PeriodicProduction from "./components/PeriodicProduction";
import PeriodicProjectProgress from "./components/PeriodicProjectProgress";
import PeriodicMachinesActivity from "./components/PeriodicMachinesActivity";
import PeriodicReadyToWork from "./components/PeriodicReadyToWork";
import DailyMachinesActivity from "./components/DailyMachinesActivity";
import DailyMachinesActivityAverage from "./components/DailyMachinesActivityAverenge";
import { LayoutContext } from "contex/Layout-context";
import useIsMobile from "hooks/useIsMobile";
import GoBackBtn from "components/GoBackBtn";
import { MenuOutlined } from "@ant-design/icons";
import { formItemLayout, formRowGutter, pageNames } from "constant";

const { SHOW_CHILD, SHOW_PARENT } = TreeSelect;

function View() {
  const layoutContext = useContext(LayoutContext);
  const isMobile = useIsMobile();
  //
  const history = useHistory();
  const [mainForm] = Form.useForm();
  //
  const [type, setType] = useState(null);
  const [isPeriodic, setIsPeriodic] = useState();
  const [hasDate, setHasDate] = useState(false);
  const [list, setList] = useState([]);
  const [strategy, setStrategy] = useState(SHOW_CHILD);
  const [displayChart, setDisplayChart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartData, setChartData] = useState();
  const [displayMenu, setDisplayMenu] = useState(false);

  //

  const breadcrumbItems = [
    { text: "داشبورد ", link: pageNames.home.web },
    { text: "گزارشات نموداری ", link: pageNames.dashboard.chartReports },
  ];
  //

  const menuData = [
    {
      title: "مدیریت پیمان",
      link: pageNames.dashboard.peymanManagement.list,
      hidden: false,
    },
    {
      title: "پیشرفت پروژه ",
      link: pageNames.dashboard.projectProgress,
      hidden: false,
    },
    {
      title: "گزارش تولید",
      link: pageNames.dashboard.productionReport.list,
      hidden: false,
    },
    {
      title: "گزارشات نموداری",
      link: pageNames.dashboard.chartReports,
      hidden: false,
    },
  ];

  useEffect(() => {
    isMobile
      ? layoutContext.setHideMainHeader(true)
      : layoutContext.setHideMainHeader(false);
  }, [isMobile]);
  //
  const typeChangeHandler = (val) => {
    val ? setType(val) : setType(null);
    mainForm.setFieldsValue({
      report_date: null,
      start_date: null,
      end_date: null,
      contracts: undefined,
    });
    setHasDate(false);
    setList([]);
    setStrategy(
      val === reportTypes.daily_machines_activity_average
        ? SHOW_PARENT
        : SHOW_CHILD
    );

    setIsPeriodic(periodicReportTypes.filter((el) => el === val).length > 0);
  };

  //

  const changeDateHandler = (val) => {
    if (
      (isPeriodic &&
        mainForm.getFieldValue("start_date") &&
        mainForm.getFieldValue("end_date")) ||
      (!isPeriodic && mainForm.getFieldValue("report_date"))
    ) {
      setLoading(true);
      getList(mainForm, isPeriodic)
        .then(({ data }) => {
          const newList = data.filter((el) => el.children.length > 0);

          if (type === reportTypes.daily_machines_activity_average) {
            newList.forEach((item) => {
              item.children.forEach((child) => (child.disabled = true));
            });
          }
          setList(newList);
          setHasDate(true);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  //

  const onFinish = (values) => {
    // console.log(values, "!mainForm");
    setChartLoading(true);
    setDisplayChart(false);
    getChartData(values, isPeriodic)
      .then((res) => {
        // console.log(res, "!res1");
        // res.data[0].reports = res.data[0].reports.map((el) => {
        //   return {
        //     ...el,
        //     stone_tonnage: el.stone_tonnage === "0" ? null : el.stone_tonnage,
        //   };
        // });
        // console.log(res, "!res2");
        setChartLoading(false);
        if (res?.data) {
          setChartData(res.data);
          setDisplayChart(true);
        }
      })
      .catch((err) => {
        console.log(err, "!err");
        setChartLoading(false);
      });
  };

  //
  return (
    <>
      {!isMobile ? (
        <>
          <ContentTop
            noBack
            title="گزارشات نموداری "
            breadcrumbItems={breadcrumbItems}
          />
          <Divider orientation="right">فیلتر اطلاعات</Divider>
        </>
      ) : (
        <Row justify="space-between" className="mb-5">
          {displayMenu && (
            <div
              style={{
                width: "100%",
                minHeight: "100vh",
                backgroundColor: "rgba(128, 128, 128, 0.5)",
                position: "absolute",
                zIndex: 1000,
              }}
              onClick={(e) => setDisplayMenu(false)}
            >
              <StyledMenu>
                <Menu.ItemGroup title="داشبورد">
                  {menuData.map((el, index) => (
                    <Menu.Item
                      key={el.title}
                      onClick={() => {
                        setDisplayMenu(false);
                        history.push(el.link);
                      }}
                    >
                      {el.title}
                    </Menu.Item>
                    // {index !== menuData.length - 1 && <Menu.Divider />}
                  ))}
                </Menu.ItemGroup>
              </StyledMenu>
            </div>
          )}
          <span>
            <GoBackBtn />
          </span>
          <span>گزارشات نموداری</span>

          <span>
            <MenuOutlined
              style={{
                fontSize: 20,
                color: "white",
                backgroundColor: "#2F75B5",
                padding: "7px",
                borderRadius: "3px",
              }}
              onClick={() => {
                displayMenu ? setDisplayMenu(false) : setDisplayMenu(true);
              }}
            />
          </span>
        </Row>
      )}

      {/* <ContentTop
        noBack
        title="گزارشات نموداری "
        breadcrumbItems={breadcrumbItems}
      />
      <Divider orientation="right">فیلتر اطلاعات</Divider> */}
      <Spin spinning={loading}>
        <Form
          {...formItemLayout}
          form={mainForm}
          onFinish={onFinish}
          onFieldsChange={() => setDisplayChart(false)}
        >
          <Row gutter={formRowGutter}>
            <FormItem.ReportType onChange={typeChangeHandler} />

            <FormItem.ReportDate
              hidden={!type || (type && isPeriodic)}
              onChange={changeDateHandler}
              mainForm={mainForm}
              type={type}
            />
            <FormItem.StartDate
              hidden={!type || (type && !isPeriodic)}
              onChange={changeDateHandler}
              mainForm={mainForm}
            />
            <FormItem.EndDate
              hidden={!type || (type && !isPeriodic)}
              onChange={changeDateHandler}
              mainForm={mainForm}
              type={type}
            />
            <FormItem.Contracts
              hidden={!type || !hasDate}
              list={list}
              strategy={strategy}
            />

            <SubmitBtn text="مشاهده گزارش"> </SubmitBtn>
          </Row>
        </Form>
      </Spin>
      <Divider />

      <Spin spinning={chartLoading}>
        {!displayChart ? (
          <EmptyChart />
        ) : type === reportTypes.daily_production ? (
          <DailyProduction chartData={chartData} />
        ) : type === reportTypes.periodic_production ? (
          <PeriodicProduction chartData={chartData} />
        ) : type === reportTypes.periodic_project_progress ? (
          <PeriodicProjectProgress chartData={chartData} />
        ) : type === reportTypes.daily_machines_activity ? (
          <DailyMachinesActivity chartData={chartData} />
        ) : type === reportTypes.daily_machines_activity_average ? (
          <DailyMachinesActivityAverage chartData={chartData} />
        ) : type === reportTypes.periodic_machines_activity ? (
          <PeriodicMachinesActivity chartData={chartData} />
        ) : type === reportTypes.periodic_ready_to_work_factor ? (
          <PeriodicReadyToWork chartData={chartData} />
        ) : (
          <EmptyChart />
        )}
      </Spin>
    </>
  );
}
// css

const StyledMenu = styled(Menu)`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  width: 100%;
  z-index: 1000;
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 4px;

  .ant-menu-item-group-title {
    color: white;
    font-size: 1.3rem;
  }

  .ant-dropdown-menu-item,
  .ant-dropdown-menu-item-only-child {
    color: white;
    padding: 3px;
    height: 44px;
  }

  .ant-menu-item-group-list .ant-menu-item,
  .ant-menu-rtl .ant-menu-item-group-list .ant-menu-submenu-title {
    border-bottom: 1px solid white;
  }

  .ant-menu-item-group-list .ant-menu-item:last-child,
  .ant-menu-rtl .ant-menu-item-group-list .ant-menu-submenu-title:last-child {
    border-bottom: none;
  }

  .ant-dropdown-menu-item:hover,
  .ant-dropdown-menu-submenu-title:hover {
    color: white !important;
    background-color: rgba(125, 175, 222, 0.5);
  }
`;

export default View;
