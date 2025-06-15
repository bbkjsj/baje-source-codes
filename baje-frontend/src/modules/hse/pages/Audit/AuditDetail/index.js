import { Collapse, Descriptions } from "antd";
import ContentTop from "components/general/ContentTop";
import LoadingLogo from "components/general/LoadingLogo";
import GoBackBtn from "components/GoBackBtn";
import { pageNames } from "constant";
import { getAudit } from "modules/hse/api/audit";
import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import moment from "moment-jalaali";
import AppTable from "components/general/AppTable";
import { CheckCircleOutlined } from "@ant-design/icons";
import { criticalValues, questionTypes } from "modules/hse/constant";
import AppTag from "components/general/AppTag";
import AppButton from "components/general/AppButton";
import { getLink } from "_helpers";
import IndividualDetail from "./IndividualDetail";
import MachineDetail from "./MachinDetail";
import useCheckAccess from "hooks/useCheckAccess";
import { permission } from "json/Permission";

const AuditDetail = () => {
  const {
    params: { id: auditId },
  } = useRouteMatch();
  const { push } = useHistory();
  const checkAccess = useCheckAccess();

  const [state, setState] = useState({
    audit: {
      first_name: "رضا",
      last_name: "قهرمانی",
      national_number: "0014148171",
      personnel_id_fk: 16064,
      image_url: "/api/image/personnel/211130144578.$.jpg",
      organization_code: null,
      plaque1: null,
      plaque2: null,
      plaque3: null,
      plaque4: null,

      id: 96,
      vehicle_id_fk: null,
      environment_id_fk: null,
      audit_date: "2021-12-03T20:30:00.000Z",
      minimum_point: 50,
      description: null,
      date: "2021-12-04T16:23:13.000Z",
      draft: 0,
      operator_first_name: "رضا",
      operator_last_name: "قهرمانی",
      questions: [
        {
          id: 1043,
          audit_id_fk: 96,
          question: "آیا لباس کار بر تن دارد؟",
          question_id_fk: 28,
          answer: "4",
          critical: "",
          weight_factor: 1,
          requirements: null,
          description: null,
          group: "individual",
          type: "yes/no",
          code: "101352",
          is_not_related: null,
        },
      ],
    },
    loading: true,
  });

  useEffect(() => {
    handleLoadAudit();
  }, []);

  const handleLoadAudit = async () => {
    try {
      const { data } = await getAudit(auditId);
      setState((s) => ({
        ...s,
        audit: { ...data.audit, questions: data.questions },
        loading: false,
      }));
    } catch (error) {
      console.log(error.message);
    }
  };

  const { Panel } = Collapse;

  const getAuditPoint = () =>
    state.audit.questions
      .filter((item) => item.answer)
      .reduce(
        (pre, current) =>
          parseInt(pre) + parseInt(current.answer || 0) * current.weight_factor,
        [0]
      );

  const getTotalAuditPoint = () =>
    state.audit.questions
      .filter((item) => item.answer)
      .reduce((pre, current) => parseInt(pre) + 4 * current.weight_factor, [0]);

  const getCritialQuestions = () => {
    const temp = [];
    state.audit.questions.forEach((question) => {
      if (!question.critical || !question.answer) return;
      const criticals = question.critical.split(",");
      const q = criticals.find((item) => item === question.answer);
      if (q) temp.push(q);
    });
    return temp;
  };

  const handlePDFReport = () => {
    push(getLink(pageNames.hse.audit.auditReport, auditId));
  };

  if (state.loading) return <LoadingLogo />;
  if (!checkAccess(permission.HSE_AUDIT)) return null;

  return (
    <>
      <GoBackBtn />
      <ContentTop title="جزییات بازرسی" />

      <Collapse defaultActiveKey={"1"}>
        <Panel
          key={"1"}
          header="مشخصات ممیزی"
          extra={
            state.audit.draft === 0 && (
              <AppButton onClick={handlePDFReport}>گزارش بازرسی</AppButton>
            )
          }
        >
          <Descriptions>
            <Descriptions.Item label="شناسه ممیزی">
              {state.audit.id}
            </Descriptions.Item>
            <Descriptions.Item label="تاریخ ساخت فرم بازرسی">
              {moment(state.audit.date).format("HH:mm:ss jYYYY/jMM/jDD")}
            </Descriptions.Item>
            <Descriptions.Item label="تاریخ بازرسی">
              {moment(state.audit.audit_date).format("jYYYY/jMM/jDD")}
            </Descriptions.Item>
            <Descriptions.Item label="سازنده فرم بازرسی">
              {state.audit.operator_first_name +
                " " +
                state.audit.operator_last_name}
            </Descriptions.Item>
            <Descriptions.Item label="امتیازات کسب شده">
              {getAuditPoint() || 0}
            </Descriptions.Item>
            <Descriptions.Item label="حداکثر امتیاز قابل کسب">
              {getTotalAuditPoint()}
            </Descriptions.Item>
            <Descriptions.Item label="درصد امتیازات کسب شده">
              {Math.floor((getAuditPoint() / getTotalAuditPoint()) * 100) || 0}
            </Descriptions.Item>
            <Descriptions.Item label="حداقل درصد لازم جهت اخذ پرمیت">
              {state.audit.minimum_point}
            </Descriptions.Item>
            <Descriptions.Item label="وضعیت حالت بحرانی">
              {getCritialQuestions().length > 0 ? "بله" : "خیر"}
            </Descriptions.Item>
            <Descriptions.Item label="وضعیت پرمیت">
              {getCritialQuestions().length > 0
                ? "صادر نشد (حالت بحرانی رخ داده)"
                : (getAuditPoint() / getTotalAuditPoint()) * 100 >=
                  state.audit.minimum_point
                ? "صادر شد"
                : "صادر نشد (امتیاز به حد نساب نرسیده)"}
            </Descriptions.Item>
          </Descriptions>
        </Panel>
        <Panel key={"2"} header="مشخصات ممیزی شونده">
          {state.audit.first_name || state.audit.last_name ? (
            <IndividualDetail audit={state.audit} />
          ) : state.audit.plaque1 ||
            state.audit.plaque2 ||
            state.audit.plaque3 ||
            state.audit.plaque4 ? (
            <MachineDetail audit={state.audit} />
          ) : null}
        </Panel>
        <Panel key={"3"} header="سوالات ممیزی">
          <AppTable
            dataSource={state.audit.questions}
            columns={[
              { title: "کد سوال", dataIndex: "code" },
              { title: "عنوان سوال", dataIndex: "question" },
              {
                title: "شیوه ممیزی سوال",
                dataIndex: "type",
                render: (data) =>
                  questionTypes.find((item) => item.value === data).label,
              },
              {
                title: "نمره دهی",
                children: [
                  {
                    title: "پاسخ اخذ شده",
                    render: (data) =>
                      !data.answer ? (
                        "بدون پاسخ"
                      ) : (
                        <AppTag color="green">
                          {
                            criticalValues(!!data.is_reverse)[data.type].find(
                              (item) => item.value === data.answer
                            ).label
                          }
                        </AppTag>
                      ),
                  },
                  {
                    title: "ضریب وزنی سوال",
                    dataIndex: "weight_factor",
                  },
                  {
                    title: "امتیاز قابل کسب",
                    dataIndex: "weight_factor",
                    render: (data) => data * 4,
                  },
                ],
              },
              {
                title: "حالت بحرانی",
                render: (data) =>
                  !data.critical
                    ? "ندارد"
                    : data.critical
                        .split(",")
                        .map(
                          (item) =>
                            criticalValues(!!data.is_reverse)[data.type].find(
                              (ttt) => ttt.value === item
                            ).label
                        )
                        .map((item) => <AppTag color="red">{item}</AppTag>),
              },
              {
                title: "سوال نامربوط",
                dataIndex: "is_not_related",
                render: (data) => data && <CheckCircleOutlined />,
              },
              {
                title: "رخ دادن حالت بحرانی",
                render: (data) =>
                  !data.answer || !data.critical
                    ? ""
                    : data.critical
                        .split(",")
                        .find((item) => item === data.answer)
                    ? "بله"
                    : "-",
              },
            ]}
          />
        </Panel>
      </Collapse>
    </>
  );
};

export default AuditDetail;
