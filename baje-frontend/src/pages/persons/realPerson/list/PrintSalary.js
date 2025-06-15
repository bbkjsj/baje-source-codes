import React, { useContext, useEffect, useRef, useState } from "react";
import { Row, Col, Table, Descriptions, Button } from "antd";
import styled from "styled-components";
import LoadingLogo from "components/general/LoadingLogo";
import { covetFormatDateToFA } from "_helpers";
import logo from "assets/img/logo.png";
import { BASE_URL } from "../../../../constant";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";
import { PrinterOutlined } from "@ant-design/icons";

const PrintSalary = ({ match }) => {
  const printID = match.params.id;
  const [printContent, setPrintContent] = useState(undefined);
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const container = useRef(null);
  const user = useWhoAmI();

  useEffect(() => {
    // setLoading(true);
    // _GET_IntroLetter(printID)
    //   .then((res) => {
    //     setLoading(false);
    //     console.log("print data:", res.data);
    //     setPrintContent(res.data);
    //     if (res.data.list && res.data.list.length) {
    //       const members = res.data.list.map((i) => {
    //         return {
    //           name: i.fullname || "-",
    //           father: i.father_name || "-",
    //           birth: covetFormatDateToFA(i.birth_date) || "-",
    //           idCode: i.id_number || "-",
    //           nId: i.national_number || "-",
    //           city: i.city || "-",
    //           relation: relationValue(i.relation) || "-",
    //         };
    //       });
    //       setAllRows(members);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setLoading(false);
    //   });
  }, []);

  function printDiv(ref) {
    const printContents = ref.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
  }

  if (loading) {
    return <LoadingLogo />;
  } else if (true /*printContent*/) {
    return (
      <Wrapper>
        <Button
          className="print-btn"
          onClick={() => printDiv(container.current)}
          type="primary"
          icon={<PrinterOutlined />}
        >
          پرینت
        </Button>
        <div ref={container} className="print-div my-4">
          <Row>
            <Col span={21}>
              <h4 className="text-center">شرکت آبادگران نصر</h4>
              <h4 className="text-center">فیش حقوقی مرداد ماه 1402</h4>
              <div className="bordered bg-gray p-2 mt-3 ml-3">
                <div className="flex justify-between">
                  <p>کد پرسنلی: 343434</p>
                  <p>نام و نام خانوادگی: علیرضا جهانشاهی</p>
                </div>
                <div className="flex justify-between mt-3">
                  <p>شماره حساب: 343434343434 بانک ملی</p>
                  <p>پست سازمانی: کارمند</p>
                </div>
              </div>
            </Col>
            <Col span={3}>
              <img src="" />
            </Col>
          </Row>

          <Row className="mt-3 tables">
            <Col span={6} className="bordered">
              <p className="text-center bg-gray p-1">اطلاعات فیش</p>

              <table>
                <tbody>
                  <tr>
                    <td>کارکرد موثر</td>
                    <td>0</td>
                    <td>روز</td>
                  </tr>
                  <tr>
                    <td>کارکرد ماموریت</td>
                    <td>0</td>
                    <td>روز</td>
                  </tr>
                  <tr>
                    <td>اضافه کاری</td>
                    <td>0</td>
                    <td>ساعت</td>
                  </tr>
                  <tr>
                    <td>شب کاری</td>
                    <td>0</td>
                    <td>ساعت</td>
                  </tr>
                  <tr>
                    <td>تعطیل کاری</td>
                    <td>0</td>
                    <td>ساعت</td>
                  </tr>
                  <tr>
                    <td>جمعه کاری</td>
                    <td>0</td>
                    <td>ساعت</td>
                  </tr>
                  <tr>
                    <td>درآمد مشمول مالیات حقوق</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                  <tr>
                    <td>ماخذ بیمه تامین اجتماعی</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                </tbody>
              </table>
            </Col>
            <Col span={5} className="bordered">
              <p className="text-center bg-gray p-1">حقوق و مزایا</p>
              <table>
                <tbody>
                  <tr>
                    <td>حقوق پایه</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                  <tr>
                    <td>حق مسکن</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                  <tr>
                    <td>حق اولاد</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                  <tr>
                    <td>اضافه کاری</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                  <tr>
                    <td>حق شایستگی</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                  <tr>
                    <td>فوق العاده شغل</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                  <tr>
                    <td>جمعه کاری</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                  <tr>
                    <td>شب کاری</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                  <tr>
                    <td>حق شیفت</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                  <tr>
                    <td>حق ایاب و ذهاب</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                  <tr className="text-bold">
                    <td>جمع حقوق و مزایا</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                </tbody>
              </table>
            </Col>
            <Col span={5} className="bordered">
              <p className="text-center bg-gray p-1">کسورات</p>
              <table>
                <tbody>
                  <tr>
                    <td>حق بیمه تامین اجتماعی سهم کارمند</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                  <tr>
                    <td>مالیات</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                  <tr>
                    <td>جمع اقساط وام</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                  <tr>
                    <td>بیمه عمر</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                  <tr>
                    <td>بیمه تکمیلی</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                  <tr>
                    <td>مساعده</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                  <tr>
                    <td>جریمه</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                  <tr>
                    <td>کسر کار</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>

                  <tr className="text-bold">
                    <td>جمع کسورات</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                </tbody>
              </table>
            </Col>
            <Col span={8} className="bordered">
              <p className="text-center bg-gray p-1">وام</p>
              <table>
                <thead className="bg-gray">
                  <td>نام وام</td>
                  <td>قسط</td>
                  <td>مانده</td>
                </thead>
                <tbody>
                  <tr>
                    <td>وام مساعده</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>وام مسکن</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>وام ازدواج</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>

                  <tr className="text-bold">
                    <td>جمع کل</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                </tbody>
              </table>

              <p className="text-center bg-gray p-1">تعهدات کارفرما</p>
              <table>
                <tbody>
                  <tr>
                    <td>حق بیمه تامین اجتماعی سهم کارفرما</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                  <tr>
                    <td>بیمه تکمیلی</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                  <tr>
                    <td>بیمه عمر</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>

                  <tr className="text-bold bg-gray">
                    <td>خالص پرداختی</td>
                    <td>0</td>
                    <td>ریال</td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
          <div className="flex justify-between w-100 mt-1">
            <p className="text-bold">صفر ریال تمام</p>
            <p className="text-bold">
              قدرت گرفته از سامانه هوشمند باجه (بانک اطلاعات جامع هلدینگ)
            </p>
          </div>
        </div>
      </Wrapper>
    );
  } else {
    return (
      <p style={{ textAlign: "center", marginTop: "32px" }}>
        اشکال در دریافت اطلاعات، لطفا مجددا تلاش کنید
      </p>
    );
  }
};
const Wrapper = styled.div`
  background-color: white;

  .bordered {
    border: 2px solid black;
  }
  .bg-gray {
    background-color: #f2f2f2;
  }

  .print-div {
    width: 1000px;
  }

  img {
    width: 100%;
    height: 147px;
    background-color: #f2f2f2;
  }

  .tables .ant-col:not(:last-of-type) {
    border-left: none;
  }

  table,
  tbody,
  tr {
    width: 100%;
  }
  table {
    border-collapse: collapse;
  }

  td {
    border: 1px solid lightGray;
    padding: 0px 4px;
  }
`;

export default PrintSalary;
