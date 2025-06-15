import React, { useContext, useEffect, useRef, useState } from "react";
import { Row, Col, Table, Descriptions, Button } from "antd";
import styled from "styled-components";
import { _GET_DISKET } from "../util/api";
import LoadingLogo from "components/general/LoadingLogo";
import { disket } from "./TablesCols";
import { covetFormatDateToFA, priceNormalizer } from "_helpers";
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
    document.title = "رسید دیسکت بیمه تامین اجتماعی";
    _GET_DISKET(printID)
      .then((res) => {
        setLoading(false);
        console.log("print data:", res.data);
        setPrintContent(res.data);
        setAllRows([
          {
            row: "1",
            title: "حق بیمه سهم بیمه شده",
            price: priceNormalizer(res.data.total_insured),
          },
          {
            row: "2",
            title: "حق بیمه سهم کارفرما",
            price: priceNormalizer(res.data.total_employer),
          },
          {
            row: "3",
            title: "بیمه بیکاری",
            price: priceNormalizer(res.data.total_jobless),
          },
        ]);
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
    window.print();
    // document.body.innerHTML = originalContents;
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
              {printContent.logo_url && (
                <Col span={12}>
                  <CompanyLogo src={BASE_URL + printContent.logo_url} />
                </Col>
              )}
              <Col className="justify-end" span={12}>
                <div>
                  <p>شماره: {printContent.indicator || "-"}</p>
                  <p>تاریخ : {covetFormatDateToFA(printContent.date) || "-"}</p>
                </div>
              </Col>
            </Row>

            <h2 style={{ marginTop: "30px" }}>سازمان تامین اجتماعی</h2>

            <Body>
              <p>{`باسلام، احتراماً به پیوست یک حلقه CD حاوی ریز اطلاعات لیست کارکنان پیمانکاري شرکت کاوشگران نصر بافق به شماره کارگاه ${
                printContent.workshop_code
              } رديف پيمان ${printContent.row} مربوط به ماه ${
                printContent.month
              } سال ${printContent.year} به تعداد ${
                printContent.personnel_count
              } نفر و جمع حقوق، دستمزد و مزایای مشمول کسر حق بیمه ${priceNormalizer(
                printContent.total_salary_benefit_include
              )} ريال به شرح ذیل ارسال می‎گردد.`}</p>
            </Body>
            {allRows.length ? (
              <TableStyled
                bordered
                columns={disket}
                dataSource={allRows}
                pagination={false}
                footer={() => (
                  <TableFooter className="table-footer">
                    <div className="table-footer--right">
                      <strong>جمع کل حق بیمه</strong>
                    </div>
                    <div className="table-footer--left">
                      <strong>
                        {priceNormalizer(
                          (
                            parseFloat(printContent.total_insured) +
                            parseFloat(printContent.total_employer) +
                            parseFloat(printContent.total_jobless)
                          ).toString()
                        )}
                      </strong>
                    </div>
                  </TableFooter>
                )}
              />
            ) : (
              ""
            )}

            <p>
              خواهشمند است دستور فرمائید تا نسبت به انجام امور لیست و ارائه رسید
              آن، اقدامات لازم را مبذول نمایند. ضمناً این شرکت صحت لیست مذکور را
              تأیید نموده و ضمن آگاهی کامل از ماده 97 قانون تأمین اجتماعی و
              اصلاح برخی مواد قانونی تأمین اجتماعی عواقب و هرگونه خسارت آن را به
              عهده خواهد گرفت.
            </p>

            <div className="manager">
              <div>
                <h3>مهر و امضاء کارفرما</h3>
              </div>
            </div>

            <p style={{ marginBottom: 30 }}>
              1 - ماده 97 قانون تامین اجتماعی هرکس به استناد و گواهی‎های خلاف
              واقع یا با توسل به عناوین و وسایل تقلبی از مزایای مقرر در این
              قانون به نفع خود استفاده نماید یا موجبات استفاده افراد خانواده خود
              یا اشخاص ثالث را از مزایای مذکور فراهم سازد به پرداخت جزای نقدی
              معادل دو برابر خسارت وارده به سازمان و در صورت تکرار به حبس
              جنحه‎ای از 61 روز تا شش ماه محکوم خواهد شد. روز تا شش ماه محکوم
              خواهد شد.
              <br />
              <br />2 - طبق تبصره (2) ماده واحده قانون معافیت از پرداخت حق بیمه
              سهم کارفرما تا میزان 5 نفر کارگر مصوب 12/2/61 و اصلاح قانون برخی
              از مواد قانون تامین اجتماعی مصوب 8/4/87 مجمع تشخیص مصلحت نظام،
              کارگاه‎هایی که ظرفیت کاری کمتر از 5 نفر کارگر دارند در صورتی که
              کارفرما افرادی را بدون اشتغال در کارگاه برای استفاده از مزایای این
              قانون به تأمین اجتماعی به عنوان کارگر معرفی نماید ملزم به پرداخت
              جریمه‎ای معادل سه برابر مزایای بهره‎مند شده از این بابت خواهد بود.
            </p>

            <div className="footer">
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
    margin-top: 40px;
    margin-bottom: 40px;
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
    bottom: 0;
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
  margin-bottom: 30px;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
`;

const TableFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export default PrintIntroLetter;
