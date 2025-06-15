import React, { useContext, useEffect, useState } from "react";
import AppTable from "components/general/AppTable";
import { LayoutContext } from "contex/Layout-context";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import { columns as tableColumns } from "./socialInsurancePersonnelReport/tableColumns";
import ContentTop from "components/general/ContentTop";
import useTableSearch from "hooks/useTableSearch";
import { getLink } from "_helpers";
import {
  CloseOutlined,
  FilterOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { getSingleRealPerson } from "../realPerson/utils/API";
import DropdownButton from "components/DropdownButton";
import { _GET_PERSONNEL_REPORT } from "./util/api";
import useIsMobile from "hooks/useIsMobile";
import InsuranceItem from "./socialInsurancePersonnelReport/InsuranceItem";
import GoBackBtn from "components/GoBackBtn";
import AppButton from "components/general/AppButton";
import MobileListFilterPanel from "./socialInsurancePersonnelReport/MobileListFilterPanel";
import ActiveMobileFilters from "./socialInsurancePersonnelReport/ActiveMobileFilters";
import useCheckAccess from "hooks/useCheckAccess";
import { permission } from "json/Permission";
import { pageNames } from "constant";

const SocialInsurancePersonnelReport = (props) => {
  const checkAccess = useCheckAccess();
  const [listLoading, setListLoading] = useState(true);
  const [list, setList] = useState([]);
  const [listFilters, setListFilters] = useState({});
  const [personInfo, setPersonInfo] = useState();
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [isMobileFilterVisible, setIsMobileFilterVisible] = useState(false);
  const layoutContext = useContext(LayoutContext);
  const isMobile = useIsMobile();
  const tableSearch = useTableSearch();
  const pageId = props.match.params.id;

  const defaultColumns = [
    "number",
    "period",
    "employer",
    "workshop_code",
    "salary_benefit_include",
    "total_work_day",
    "daily_salary",
    "monthly_salary",
    "total_share",
    "title",
  ];

  const mobileFilters = [
    {
      dataIndex: "name",
      title: "شرکت",
    },
    {
      dataIndex: "subject",
      title: "قرارداد",
    },
    {
      dataIndex: "period",
      title: "دوره",
      computeValue: (data) => data.year + "-" + data.month,
    },
  ];

  const getStoredColumns = () => {
    const storedColumns = localStorage.getItem(
      "social_insurance_personnel_report_columns"
    );
    return storedColumns ? storedColumns.split(",") : false;
  };

  useEffect(() => {
    (async function () {
      setListLoading(true);
      await Promise.all([getList(), getPersonnelInfo()]);

      const columns = getStoredColumns();
      columns
        ? setSelectedColumns(columns)
        : setSelectedColumns(defaultColumns);

      setListLoading(false);
    })();
  }, []);

  const getPersonnelInfo = async () => {
    const res = await getSingleRealPerson(pageId);
    setPersonInfo(res.data);
  };

  const getList = async () => {
    setListLoading(true);

    try {
      const res = await _GET_PERSONNEL_REPORT(pageId);
      const sortedData = [...res.data];

      //sort based on year and month
      sortedData.sort((a, b) => {
        if (a.year === b.year) return b.month - a.month;
        else return b.year - a.year;
      });

      setListLoading(false);
      setList(sortedData);
    } catch (error) {
      setListLoading(false);
      console.log(error);
    }
  };

  const getColumns = () =>
    tableColumns({ list, tableSearch }).filter((el) => {
      return (
        (el.dataIndex !== "subject" &&
          el.dataIndex !== "salary_benefit_include_notinclude") ||
        (el.dataIndex === "subject" &&
          checkAccess([permission.SOCIAL_INSURANCE_CONTRACTS])) ||
        (el.dataIndex === "salary_benefit_include_notinclude" &&
          checkAccess([permission.SOCIAL_INSURANCE_BENEFITS]))
      );
    });

  const getActiveColumns = () => {
    let columns = getColumns();

    return columns.filter(
      (item) => selectedColumns.indexOf(item.dataIndex) !== -1
    );
  };

  const getColumnListItems = () => {
    return getColumns().map((item) => ({
      title: item.title,
      value: item.dataIndex,
    }));
  };

  if (listLoading) {
    return <LogoLoading />;
  }

  const getFilteredList = () => {
    const filters = Object.entries(listFilters);

    if (!filters.length) return list;
    else {
      return list.filter((listItem) => {
        let pass = true;

        filters.forEach(([filterIndex, filterValues]) => {
          const filterOptions = mobileFilters.find(
            (item) => item.dataIndex === filterIndex
          );
          const listValue = filterOptions.computeValue
            ? filterOptions.computeValue(listItem)
            : listItem[filterIndex];

          if (filterValues?.length && !filterValues.includes(listValue))
            pass = false;
        });

        return pass;
      });
    }
  };

  const removeMobileFilterValue = (filterIndex, value) => {
    if (!Array.isArray(listFilters[filterIndex])) return;

    const newFilterItemValues = listFilters[filterIndex].filter(
      (item) => item !== value
    );
    setListFilters({
      ...listFilters,
      ...{ [filterIndex]: newFilterItemValues },
    });
  };

  const handleOnChangeTablePage = (page) => {
    layoutContext.setTablePage(page);
  };

  const handleOnPrintClick = () => {
    const printLink = getLink(
      pageNames.personnel.insurance.tamin.personnelReportPrint,
      pageId
    );
    window.open(printLink, "_blank");
  };

  const handleOnTableColumnsChange = (value) => {
    setSelectedColumns(value);
    localStorage.setItem("social_insurance_personnel_report_columns", value);
  };

  const menuBtnList = [
    <DropdownButton
      defaultValue={getStoredColumns() || defaultColumns}
      onChange={handleOnTableColumnsChange}
      items={getColumnListItems()}
    >
      ستون‌های فعال جدول
    </DropdownButton>,
    {
      label: "پرینت گزارش",
      id: "reportPrint",
      handleClick: () => handleOnPrintClick(),
      icon: <PrinterOutlined />,
      variant: "primary",
      disabled: !list?.length,
    },
  ];

  let personInfoSection = (
    <PersonInfo>
      <div className="person-info-item">
        <span className="title">نام فرد:</span>
        <span>{`${personInfo?.first_name || "-"} ${
          personInfo?.last_name || ""
        }`}</span>
      </div>
      <div className="person-info-item">
        <span className="title">کد ملی:</span>
        <span>{personInfo?.national_number || "-"}</span>
      </div>
      <div className="person-info-item">
        <span className="title">شماره بیمه:</span>
        <span>{personInfo?.insurance_number || "-"}</span>
      </div>
    </PersonInfo>
  );

  return isMobile ? (
    <div>
      <MobileTitleBar>
        <GoBackBtn style={{ position: "static" }} />
        <div className="title">گزارش بیمه تامین اجتماعی</div>
        <AppButton
          icon={<FilterOutlined />}
          variant="primary"
          onClick={() => setIsMobileFilterVisible(true)}
        />
      </MobileTitleBar>
      {personInfoSection}
      <ActiveMobileFilters
        filters={listFilters}
        removeHandler={removeMobileFilterValue}
      />
      <div>
        {getFilteredList().length
          ? getFilteredList().map((item) => (
              <InsuranceItem data={item} activeRows={getColumns()} />
            ))
          : "اطلاعات یافت نشد"}
      </div>
      <MobileActionBar>
        <AppButton
          icon={<PrinterOutlined />}
          size="large"
          onClick={() => handleOnPrintClick()}
          block
        >
          پرینت گزارش
        </AppButton>
      </MobileActionBar>
      {isMobileFilterVisible && (
        <MobileListFilterPanel
          filters={mobileFilters}
          listData={list}
          selectedValues={listFilters}
          onChange={(values) => setListFilters(values)}
          onClose={() => setIsMobileFilterVisible(false)}
          visible={isMobileFilterVisible}
        />
      )}
    </div>
  ) : (
    <div>
      <GoBackBtn customUrl={pageNames.personnel.realPerson.list} />
      <ContentTop
        title="گزارش بیمه تامین اجتماعی"
        className="mt-3"
        breadcrumbItems={[
          { text: "منابع انسانی" },
          { text: "افراد حقیقی" },
          {
            text: "لیست افراد حقیقی",
            link: pageNames.personnel.realPerson.list,
          },
        ]}
      />

      <div className="w-100 flex-wrap align-center mb-3">
        {personInfoSection}
        <MenuInlineBtn list={menuBtnList} className="mr-md-auto mt-lg-0" />
      </div>

      <div className="card-container">
        <AppTable
          pagination={{
            defaultCurrent: layoutContext.tablePage,
            defaultPageSize: 20,
            onChange: handleOnChangeTablePage,
          }}
          rowKey={(record) => record.id}
          size="small"
          scroll={{ y: 600, x: true }}
          onRow={() => false}
          columns={getActiveColumns()}
          dataSource={list}
          bordered={true}
        />
      </div>
    </div>
  );
};

const PersonInfo = styled("div")`
  padding: 8px 16px;
  background: rgba(243, 161, 50, 0.15);

  .person-info-item {
    display: inline-block;

    .title {
      opacity: 0.65;
      font-size: 13px;
      padding-left: 6px;
    }
  }

  @media (max-width: 420px) {
    margin-bottom: 20px;

    .person-info-item {
      display: block;
      margin-bottom: 4px;
    }
  }

  @media (min-width: 420px) {
    .person-info-item + .person-info-item {
      border-right: 1px solid rgba(0, 0, 0, 0.09);
      padding-right: 24px;
      margin-right: 24px;
    }
  }
`;

const MobileTitleBar = styled("div")`
  display: flex;
  margin-bottom: 20px;
  align-items: center;

  .title {
    flex-grow: 1;
    text-align: center;
  }
`;

const MobileActionBar = styled("div")`
  position: fixed;
  bottom: 0px;
  left: 0;
  right: 0;
  padding: 16px;
  background: #fff;
  box-shadow: 0px -2px 4px rgba(22, 25, 49, 0.1);
  z-index: 4;
`;

export default SocialInsurancePersonnelReport;
