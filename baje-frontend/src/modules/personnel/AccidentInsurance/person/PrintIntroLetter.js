import React, { useContext, useEffect, useRef, useState } from "react";
import { Row, Col, Table, Descriptions, Button } from "antd";
import styled from "styled-components";
import { _GET_IntroLetter } from "./util/api";
import LoadingLogo from "components/general/LoadingLogo";
import { allAdd } from "./personIntroductionLetter/TablesCols";
import { covetFormatDateToFA } from "_helpers";
import logo from "assets/img/logo.png";
import { BASE_URL } from "../../../../constant";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

const PrintIntroLetter = ({ match }) => {
  const printID = match.params.id;
  const [printContent, setPrintContent] = useState(undefined);
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const container = useRef(null);
  const user = useWhoAmI();

  useEffect(() => {
    _GET_IntroLetter(printID)
      .then((res) => {
        setLoading(false);
        console.log("print data:", res.data);
        setPrintContent(res.data);
        if (res.data.list && res.data.list.length) {
          const members = res.data.list.map((i) => {
            return {
              name: i.fullname || "-",
              father: i.father_name || "-",
              birth: covetFormatDateToFA(i.birth_date) || "-",
              idCode: i.id_number || "-",
              nId: i.national_number || "-",
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
    else if (relation === "mother") return "مادر";
    else if (relation === "daughter") return "فرزند دختر";
    else if (relation === "main") return "اصلی";
    else if (relation === "wife") return "همسر";
    else if (relation === "son") return "فرزند پسر";
  }

  if (loading) {
    return <LoadingLogo />;
  } else if (printContent) {
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
                  <CompanyLogo src={BASE_URL + printContent.logo} />
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
              <Descriptions bordered>
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
              <Descriptions bordered>
                <Descriptions.Item label="شماره پرسنلی">
                  {printContent.personnel_number || "-"}
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
      font-size: 10px;
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
  width: 80px;
  object-fit: contain;
`;

const TableStyled = styled(Table)`
  margin-top: 30px;
  margin-bottom: 16px;
`;
export default PrintIntroLetter;
