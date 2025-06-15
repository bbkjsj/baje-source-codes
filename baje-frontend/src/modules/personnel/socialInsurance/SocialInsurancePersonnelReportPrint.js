import React, { useEffect, useState } from "react";
import { Button } from "antd";
import styled from "styled-components";
import { _GET_PERSONNEL_REPORT_PRINT } from "./util/api";
import LoadingLogo from "components/general/LoadingLogo";
import moment from "moment-jalaali";
import logo from "assets/images/social-insurance-logotype.svg";
import { getSingleRealPerson } from "../realPerson/utils/API";
import { getServerDateTime } from "utils/api";
import { printContent } from "../../../_helpers";
import { PrinterOutlined } from "@ant-design/icons";
import useIsMobile from "../../../hooks/useIsMobile";

const SocialInsurancePersonnelReportPrint = (props) => {
  const pageId = props.match.params.id;
  const [loading, setLoading] = useState(true);
  const [listData, setListData] = useState([]);
  const [personInfo, setPersonInfo] = useState();
  const [serverDate, setServerDate] = useState();
  const isMobile = useIsMobile();

  useEffect(() => {
    (async () => {
      await Promise.all([
        getPersonnelInfo(),
        getListData(),
        async () => {
          const res = await getServerDateTime();
          setServerDate(res.data.date);
        },
      ]);

      setLoading(false);
    })();
  }, []);

  const getPersonnelInfo = async () => {
    const res = await getSingleRealPerson(pageId);
    setPersonInfo(res.data);
  };

  const getListData = async () => {
    const res = await _GET_PERSONNEL_REPORT_PRINT(pageId);
    setListData(res.data || []);
  };

  if (loading) {
    return <LoadingLogo />;
  } else if (listData) {
    const perPage = 10;
    const totalPages = Math.ceil(listData.length / perPage);
    const listDataSorted = [...listData];
    const paginatedData = [];

    //sort based on year
    listDataSorted.sort((a, b) => b.year - a.year);

    for (let i = 0; i < totalPages; i++) {
      const dataIndex = i * perPage;
      const lastPage = i + 1 === totalPages;

      paginatedData.push(
        listDataSorted.slice(
          dataIndex,
          lastPage ? listDataSorted.length : dataIndex + perPage
        )
      );
    }

    let itemNum = 1;

    return (
      <MainContainer>
        <Button
          className="print-btn"
          onClick={() => printContent(!isMobile)}
          type="primary"
          icon={<PrinterOutlined />}
        >
          پرینت گزارش
        </Button>
        <div className="print-area">
          {paginatedData.map((pageData, pageIndex) => (
            <div className="page">
              <div className="report-header">
                <img src={logo} className="logo" alt="لوگو تامین اجتماعی" />
                <div className="date">
                  گزارش کلیه سوابق در {moment(serverDate).format("jYYYY/jM/jD")}
                </div>
                <div className="notice">
                  این سوابق صرفا جهت اطلاع بوده و سوابق قطعی و قابل استناد توسط
                  شعب به هنگام احراز شرایط بهره مندی از مزایای قانونی اعلام
                  خواهد شد
                </div>
              </div>
              <div className="person-info">
                <table>
                  <tr>
                    <td>شماره بیمه:</td>
                    <td>{personInfo?.insurance_number}</td>

                    <td>نام:</td>
                    <td>{personInfo?.first_name}</td>

                    <td>نام خانوادگی:</td>
                    <td>{personInfo?.last_name}</td>
                  </tr>
                  <tr>
                    <td>کد ملی:</td>
                    <td>{personInfo?.national_number}</td>

                    <td>شماره شناسنامه:</td>
                    <td>{personInfo?.id_number}</td>

                    <td>تاریخ تولد:</td>
                    <td>
                      {moment(personInfo?.birth_date).format("jYYYY/jM/jD")}
                    </td>
                  </tr>
                </table>
              </div>
              <div className="report-data">
                <table>
                  <tr>
                    <th>
                      <span className="vertical-text">ردیف</span>
                    </th>
                    <th>سال</th>
                    <th>نوع سابقه</th>
                    <th>نام شعبه</th>
                    <th>شماره کارگاه</th>
                    <th>نام کارگاه</th>
                    <th>فروردین</th>
                    <th>اردیبهشت</th>
                    <th>خرداد</th>
                    <th>تیر</th>
                    <th>مرداد</th>
                    <th>شهریور</th>
                    <th>مهر</th>
                    <th>آبان</th>
                    <th>آذر</th>
                    <th>دی</th>
                    <th>بهمن</th>
                    <th>اسفند</th>
                  </tr>
                  {pageData.map((item) => (
                    <tr>
                      <td>{itemNum++}</td>
                      <td>{item.year}</td>
                      <td>کارکرد عادی لیست</td>
                      <td>-</td>
                      <td>{item.workshop_code}</td>
                      <td>{item.company_name}</td>
                      <td>{item.work_days[0]}</td>
                      <td>{item.work_days[1]}</td>
                      <td>{item.work_days[2]}</td>
                      <td>{item.work_days[3]}</td>
                      <td>{item.work_days[4]}</td>
                      <td>{item.work_days[5]}</td>
                      <td>{item.work_days[6]}</td>
                      <td>{item.work_days[7]}</td>
                      <td>{item.work_days[8]}</td>
                      <td>{item.work_days[9]}</td>
                      <td>{item.work_days[10]}</td>
                      <td>{item.work_days[11]}</td>
                    </tr>
                  ))}
                </table>
              </div>
              <div className="page-number">{pageIndex + 1}</div>
            </div>
          ))}
        </div>
      </MainContainer>
    );
  } else {
    return (
      <p style={{ textAlign: "center", marginTop: "32px" }}>
        اشکال در دریافت اطلاعات، لطفا مجددا تلاش کنید
      </p>
    );
  }
};

const MainContainer = styled("div")`
  @page {
    size: A4 landscape;
    margin: 0;
  }

  * {
    -webkit-text-size-adjust: none !important;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  .print-area {
    font-family: "B Nazanin", iranyekan, tahoma, serif;
    font-size: 1.2em;

    @media (max-width: 460px) {
      overflow: scroll;
    }

    .page {
      margin-top: 5mm;
    }

    @media print {
      .page {
        page-break-after: always;
        zoom: 150%;
      }
    }

    @media screen and (max-width: 450px) {
      .page {
        width: 297mm;
        height: 210mm;
      }
    }

    .report-header {
      text-align: center;

      .logo {
        width: 75px;
        height: 75px;
        margin: 0 auto;
      }

      .date {
        margin: 16px 0 8px;
        font-size: 1.2em;
      }

      .notice {
        width: 80%;
        border: 2px solid #000;
        padding: 6px;
        margin: 0 auto;
        background-color: #dfdbda !important;
        font-size: 1.2em;
      }
    }

    .person-info {
      border: 2px solid #000;
      padding: 20px 16px;
      margin: 8px 0;
      font-size: 1.1em;

      table {
        width: 100%;

        tr {
          td:nth-child(even) {
            width: 23%;
          }
        }
      }
    }

    .report-data {
      table {
        width: 100%;
        border: 1px solid #000;

        th,
        td {
          text-align: center;
          padding: 8px;
          font-size: 0.9em;
          font-weight: normal;
        }

        th + th,
        td + td {
          border-right: 1px solid #000;
        }

        tr {
          border-bottom: 2px solid #000;
        }

        th {
          background-color: #dfdbda !important;
        }

        .vertical-text {
          writing-mode: vertical-rl;
          vertical-align: middle;
        }
      }
    }

    .page-number {
      text-align: center;
      margin-top: 20px;
    }
  }
`;

export default SocialInsurancePersonnelReportPrint;
