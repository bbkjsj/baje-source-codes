import React, { useContext, useEffect, useRef, useState } from "react";
import { Row, Col, Table, Descriptions, Button, Typography } from "antd";
import styled from "styled-components";
import LoadingLogo from "components/general/LoadingLogo";
import { covetFormatDateToFA, priceNormalizer } from "_helpers";
import logo from "assets/img/logo.png";
import { useGetSocialInsurancePrintList } from "./util/hooks";
import { BASE_URL } from "../../../constant";

const generateColumns = () => {
  return [
    {
      width: 20,
      align: "center",
      title: "",
      render: (text, record, index) => {
        console.log("data record", record);
        return index + 1;
      },
    },
    {
      title: "نام نام خانوادگی",
      dataIndex: "first_name",
      key: "first_name",
      render: (text, record) => {
        return text + " " + record.last_name;
      },
    },
    {
      title: "شغل",
      dataIndex: "job_title",
      key: "job_title",
    },
    {
      title: "کدملی",
      dataIndex: "id_number",
      key: "id_number",
    },
    {
      title: "شماره شناسنامه",
      dataIndex: "nId",
      key: "nId",
    },
    {
      title: "نام پدر",
      dataIndex: "father_name",
      key: "father_name",
    },
    {
      title: "تاریخ شروع کار",
      dataIndex: "start_date",
      key: "start_date",
      render: (text) => {
        return covetFormatDateToFA(text);
      },
    },
    {
      title: "تاریخ ترک کار",
      dataIndex: "end_date",
      key: "end_date",
      render: (text) => {
        return covetFormatDateToFA(text);
      },
    },
    {
      title: "کار کرد",
      dataIndex: "total_work_day",
      key: "total_work_day",
    },
    {
      title: "دستمزد روزانه",
      dataIndex: "daily_salary",
      key: "daily_salary",
      render: (text) => {
        return priceNormalizer(text);
      },
    },
    {
      title: "دست مزد ماهانه",
      dataIndex: "monthly_salary",
      key: "monthly_salary",
      render: (text) => {
        return priceNormalizer(text);
      },
    },
    {
      title: "مزایای مشمول",
      dataIndex: "include_benefit",
      key: "include_benefit",
      render: (text) => {
        return priceNormalizer(text);
      },
    },
    {
      title: "کل مشمول بیمه",
      dataIndex: "relation",
      key: "relation",
      // render: (text) => {
      //   return priceNormalizer(text);
      // },
    },
    {
      title: "مشمول و غ مشمول",
      dataIndex: "salary_benefit_include_notinclude",
      key: "salary_benefit_include_notinclude",
      render: (text) => {
        return priceNormalizer(text);
      },
    },
    {
      title: "سهم بیمه شده",
      dataIndex: "insured_share",
      key: "insured_share",
      render: (text) => {
        return priceNormalizer(text);
      },
    },
    {
      title: "ملاحظات امضا",
      dataIndex: "relation",
      key: "relation",
    },
  ];
};

const SocialInsurancePrint = ({ match }) => {
  const printID = match.params.id;
  const [printContent, setPrintContent] = useState(undefined);
  const [allRows, setAllRows] = useState([]);

  const container = useRef(null);
  const { data, loading } = useGetSocialInsurancePrintList(printID);

  console.log("data insurance ", data);

  function printDiv(ref) {
    const printContents = ref.innerHTML;
    //  const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    // document.body.innerHTML = originalContents;
  }

  const calculateTotal = () => {
    let sum =
      data.total_employer +
      data.total_hard +
      data.total_insured +
      data.total_jobless;

    return priceNormalizer(sum.toString());
  };

  if (loading) {
    return <LoadingLogo />;
  }
  // } else if (printContent) {
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
            <Col span={8}>
              شماره کارگاه(ردیف پیمان) : {`${data.workshop_code}-${data.row}`}
            </Col>

            <ColStyled span={8}>
              کارفرما (مدیر عامل ) مسول کارگاه : {`${data.manager}`}
            </ColStyled>
            <Col className="justify-end" span={8}>
              <div>
                <p>لیست شماره : 10203</p>
                <p>دوره {`${data.period.year} - ${data.period.month}`}</p>
              </div>
            </Col>
          </Row>

          <TableStyled
            bordered
            // tableLayout="fixed"
            columns={generateColumns()}
            dataSource={data.list}
            pagination={false}
            summary={(pageData) => {
              let totalDailySalary = 0;
              let totalMonthlySalary = 0;
              let totalIncludeBenefit = 0;
              let totalSalaryBenefitIncludeNotInclude = 0;
              let totalInsuredShare = 0;
              let totalRepayment = 0;

              pageData.forEach(
                ({
                  borrow,
                  repayment,
                  daily_salary,
                  monthly_salary,
                  include_benefit,
                  salary_benefit_include_notinclude,
                  insured_share,
                }) => {
                  totalDailySalary += +daily_salary;
                  totalMonthlySalary += +monthly_salary;
                  totalIncludeBenefit += +include_benefit;
                  totalSalaryBenefitIncludeNotInclude += +salary_benefit_include_notinclude;
                  totalInsuredShare += +insured_share;
                  totalRepayment += repayment;
                }
              );

              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={9}>جمع</Table.Summary.Cell>

                    <Table.Summary.Cell>
                      <Typography.Text type="danger">
                        {priceNormalizer(totalDailySalary.toString())}
                      </Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Typography.Text type="danger">
                        {priceNormalizer(totalMonthlySalary.toString())}
                      </Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Typography.Text type="danger">
                        {priceNormalizer(totalIncludeBenefit.toString())}
                      </Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Typography.Text type="danger">
                        {priceNormalizer(totalDailySalary.toString())}
                      </Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Typography.Text type="danger">
                        {priceNormalizer(
                          totalSalaryBenefitIncludeNotInclude.toString()
                        )}
                      </Typography.Text>
                    </Table.Summary.Cell>

                    <Table.Summary.Cell>
                      <Typography.Text type="danger">
                        {priceNormalizer(totalInsuredShare.toString())}
                      </Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
          />

          <Row gutter={10}>
            <Col span={10}>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="جمع سهم بیمه شده">
                  {priceNormalizer(data.total_insured.toString())}
                </Descriptions.Item>
                <Descriptions.Item label="جمع سهم کارفرما">
                  {priceNormalizer(data.total_employer.toString())}
                </Descriptions.Item>
                <Descriptions.Item label="جمع سهم بیکاری">
                  {priceNormalizer(data.total_jobless.toString())}
                </Descriptions.Item>
                <Descriptions.Item label="جمع مشاغل سخت و زیان آور">
                  {priceNormalizer(data.total_hard.toString())}
                </Descriptions.Item>
                <Descriptions.Item label="جمع کل">
                  {calculateTotal()}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <SignContainer span={14}>
              <p>مهر و امضا کار فرما</p>
            </SignContainer>
          </Row>
        </Container>
      </div>
    </Wrapper>
  );
  // } else {
  //   return (
  //     <p style={{ textAlign: "center", marginTop: "32px" }}>
  //       اشکال در دریافت اطلاعات، لطفا مجددا تلاش کنید
  //     </p>
  //   );
  // }
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
  margin-bottom: 16px;
`;

const SignContainer = styled(Col)`
  border: 1px solid #ccc;
  /* padding-bottom: 110px; */
`;

export default SocialInsurancePrint;
