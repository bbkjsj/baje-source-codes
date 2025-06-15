import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Table, Descriptions, Button, message } from "antd";
import styled from "styled-components";
import { _GET_IntroLetter } from "./util/api";
import LoadingLogo from "components/general/LoadingLogo";
import { allAdd } from "./personIntroductionLetter/TablesCols";
import { covetFormatDateToFA } from "_helpers";
import logo from "assets/img/logo.png";
import { config } from "../../../../constant";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

const PrintIntroLetter = ({ match }) => {
  const printID = match.params.id;
  const [printContent, setPrintContent] = useState(undefined);
  const [defectProps, setDefectProps] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const container = useRef(null);
  const user = useWhoAmI();

  useEffect(() => {
    _GET_IntroLetter(printID)
      .then((res) => {
        setLoading(false);
        // console.log("print data:", res.data);
        if (
          !res.data.sheba ||
          !res.data.mobile ||
          !res.data.insurance_number ||
          !res.data.logo ||
          !res.data.manager_name ||
          !res.data.sign
        ) {
          const defects = [
            res.data.sheba,
            res.data.mobile,
            res.data.insurance_number,
            res.data.logo,
            res.data.manager_name,
            res.data.sign,
          ];
          console.log(defects, "!def");
          setDefectProps(defects);
          // message.error(
          //   "لطفا ابتدا نسبت به تكميل اطلاعات ذيل اقدام و سپس نسبت به صدور معرفی نامه اقدام نماييد"
          // );
          return;
        }
        setPrintContent(res.data);
        if (res.data.list && res.data.list.length) {
          const members = res.data.list.map((i) => {
            return {
              name: i.fullname || "-",
              father: i.father_name || "-",
              birth: covetFormatDateToFA(i.birth_date) || "-",
              idCode: i.id_number || "-",
              nId: i.national_number || "-",
              issue_place: i.issue_place || "-",
              city: i.city || "-",
              relation: relationValue(i.relation) || "-",
            };
          });

          setAllRows(members);
          // this leads to tab hanging and eventually crashing! used print button instead
          // if (container.current && container.current.innerHTML) {
          //   setTimeout(() => {
          //     printDiv(container.current);
          //   }, 2000);
          // }
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  function printDiv(ref) {
    const printContents = ref.innerHTML;
    //  const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    document.getElementById("printFoot").style.bottom = "0";
    window.print();
    // document.body.innerHTML = originalContents;
  }

  function relationValue(relation) {
    if (relation === "father") return "پدر";
    else if (relation === "daughter") return "فرزند دختر";
    else if (relation === "main") return "اصلی";
    else if (relation === "wife") return "همسر";
    else if (relation === "son") return "فرزند پسر";
  }

  console.log(printContent, "printContnt!");
  if (loading) {
    return <LoadingLogo />;
  } else if (!printContent) {
    // console.info(defectProps);
    return (
      <Wrapper>
        <Button
          className="print-btn"
          onClick={() => printDiv(container.current)}
          type="primary"
        >
          پرینت
        </Button>
        <div ref={container} className="print-div">
          <Container>
            <Body>
              <p style={{ "white-space": "pre-line" }}>
                لطفا ابتدا نسبت به تكميل اطلاعات ذيل اقدام و سپس نسبت به صدور
                معرفی نامه اقدام نماييد
              </p>
            </Body>
            <Descriptions
              bordered
              contentStyle={{ fontSize: "1rem" }}
              labelStyle={{ fontSize: "1rem" }}
            >
              {defectProps[5] ? null : (
                <Descriptions.Item label="امضا مدیر عامل">
                  نامشخص
                </Descriptions.Item>
              )}
              {defectProps[4] ? null : (
                <Descriptions.Item label="نام مدیر عامل">
                  نامشخص
                </Descriptions.Item>
              )}
              {defectProps[3] ? null : (
                <Descriptions.Item label="لوگو">نامشخص</Descriptions.Item>
              )}
              {defectProps[2] ? null : (
                <Descriptions.Item label="شماره بیمه">نامشخص</Descriptions.Item>
              )}
              {defectProps[1] ? null : (
                <Descriptions.Item label="شماره شبا">نامشخص</Descriptions.Item>
              )}
              {defectProps[0] ? null : (
                <Descriptions.Item label="تلفن تماس">نامشخص</Descriptions.Item>
              )}
            </Descriptions>

            <div className="footer" id="printFoot">
              <div>
                <h3>تهیه کننده: {user.firstName + " " + user.lastName}</h3>
                <p>
                  تهیه و تنظیم توسط نرم افزار <strong>باجه</strong>
                </p>
                <p>تولید شرکت نگین گهرزمین</p>
                <p>
                  شما هم بیاین پشت <strong>باجه</strong> - تلفن تماس:...
                </p>
              </div>
              <img src={logo} alt="باجه" />
            </div>
          </Container>
        </div>
      </Wrapper>
    );
  } else if (printContent) {
    console.info(printContent);
    return (
      <Wrapper>
        <Button
          className="print-btn"
          onClick={() => printDiv(container.current)}
          type="primary"
        >
          پرینت
        </Button>
        <div ref={container} className="print-div">
          <Container>
            <Row>
              {printContent.logo && (
                <Col span={8}>
                  <CompanyLogo src={config.url.API_URL + printContent.logo} />
                </Col>
              )}
              <ColStyled span={8}>بسمه تعالی</ColStyled>
              <Col className="justify-end" span={8}>
                <div>
                  <p>شماره: {printContent.indicator_number || "-"}</p>
                  <p>تاریخ : {printContent.date || "-"}</p>
                </div>
              </Col>
            </Row>

            <Body>
              <p style={{ "white-space": "pre-line" }}>
                {printContent.content || "-"}
              </p>
            </Body>
            {allRows.length ? (
              <TableStyled
                bordered
                columns={allAdd}
                dataSource={allRows}
                pagination={false}
              />
            ) : (
              ""
            )}

            {printContent.main_remove_date ? (
              <Descriptions
                bordered
                contentStyle={{ fontSize: "1rem" }}
                labelStyle={{ fontSize: "1rem" }}
              >
                <Descriptions.Item label="شماره ملی" span={3}>
                  {printContent.main_national_number || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="تاریخ درخواستی حذف" span={3}>
                  {covetFormatDateToFA(printContent.main_remove_date) || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="علت حذف" span={3}>
                  {printContent.description || "-"}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Descriptions
                bordered
                contentStyle={{ fontSize: "1rem" }}
                labelStyle={{ fontSize: "1rem" }}
              >
                <Descriptions.Item label="شماره بیمه ">
                  {printContent.insurance_number || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="تاریخ شروع">
                  {covetFormatDateToFA(printContent.main_start_date) || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="شماره ملی">
                  {printContent.main_national_number || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="شماره شبا">
                  {printContent.sheba || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="تلفن تماس">
                  {printContent.mobile || "-"}
                </Descriptions.Item>
              </Descriptions>
            )}

            <div className="manager">
              <div>
                <p>باتشکر</p>
                {printContent.manager_name && (
                  <p>{printContent.manager_name}</p>
                )}
                <p>مدیر عامل</p>
                {printContent.sign && (
                  <CEOSignature src={config.url.API_URL + printContent.sign} />
                )}
              </div>
            </div>

            <div className="footer" id="printFoot">
              <div>
                <h3>تهیه کننده: {user.firstName + " " + user.lastName}</h3>
                <p>
                  تهیه و تنظیم توسط نرم افزار <strong>باجه</strong>
                </p>
                <p>تولید شرکت نگین گهرزمین</p>
                <p>
                  شما هم بیاین پشت <strong>باجه</strong> - تلفن تماس:...
                </p>
              </div>
              <br />
              <img src={logo} alt="باجه" />
            </div>
          </Container>
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
  font-size: 1.2rem;
  background-color: white;
  padding-top: 16px;
  position: relative;
  height: 100%;
  padding-bottom: 100px;
  .print-btn {
    margin-right: 30px;
  }
  .print-div {
    height: 100%;
    position: relative;
  }
`;

const Container = styled.div`
  margin: 30px;
  background-color: #fff;
  padding: 16px;
  position: relative;
  height: 95%;
  padding-bottom: 16px;

  .justify-end {
    justify-content: flex-end;
    display: flex;
  }

  .manager {
    margin-top: 30px;
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    padding-left: 30px;
    p {
      text-align: center;
    }
  }

  .footer {
    position: absolute;
    bottom: -100px;
    right: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 20px;
    img {
      width: 40px;
    }
    p {
      font-size: 12px;
    }
  }
`;

const Body = styled.div`
  margin-top: 30px;
  margin-bottom: 16px;
`;

const ColStyled = styled(Col)`
  text-align: center;
`;

const CompanyLogo = styled.img`
  width: 160px;
  object-fit: contain;
`;

const CEOSignature = styled.img`
  width: 160px;
  object-fit: contain;
`;

const TableStyled = styled(Table)`
  margin-top: 30px;
  margin-bottom: 16px;
  tr {
    font-size: 1rem;
  }
`;
export default PrintIntroLetter;
