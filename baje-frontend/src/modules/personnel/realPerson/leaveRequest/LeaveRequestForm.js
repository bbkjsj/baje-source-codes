import React, { useContext, useEffect, useState } from "react";
import { Form, message, Row, Spin, Input, notification, Modal } from "antd";
import GoBackBtn from "components/GoBackBtn";
import * as fields from "./common/formItems";
import SubmitBtn from "components/general/SubmitBtn";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { _POST, _GET_ITEM, _PUT, testPromise } from "./utils/api";
import {
  convertDateToENProper,
  convertDateToISO8601,
  convertTime,
  covetFormatDateToFA,
  subDomain,
  timeToFa,
} from "_helpers";
import moment from "moment-jalaali";
import ContentTop from "components/general/ContentTop";
import useSuperAdminCheck from "hooks/useSuperAdminCheck";
import { pageNames } from "constant";
import { useSelector } from "react-redux";
import useCheckAccess from "hooks/useCheckAccess";
import { permission } from "json/Permission";
import useWhoAmI from "hooks/useWhoAmI";

const formItemLayout = {
  labelCol: { span: 24 },
  colon: false,
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    lg: { span: 22 },
  },
};

function LeaveForm({ updating, view }) {
  const [mainForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const superAdminCheck = useSuperAdminCheck();
  const history = useHistory();
  const routeParams = useParams();
  const [pageTitle, setPageTitle] = useState("افزودن مرخصی");
  const [person, setPerson] = useState();
  const user = useWhoAmI();
  const [defaultCode, setDefaultCode] = useState(
    !updating ? user.nationalCode : null
  );
  const checkAccess = useCheckAccess();
  const endDateRef = React.useRef();
  const descriptionRef = React.useRef();

  const handleOnFinish = (params, isTwoMonths) => {
    console.log(params);

    const formData = new FormData();
    let timeValid = true;
    let isAfter = true;

    formData.append("type", params.type);
    formData.append("request_type", params.period_type || "روزانه");
    if (params.description) {
      formData.append("description", params.description);
    }

    const isSameYear =
      params?.end_date?.split("/")?.[0] == params?.start_date?.split("/")?.[0];

    const isSameMonth =
      params?.end_date?.split("/")?.[1] == params?.start_date?.split("/")?.[1];

    if (params.period_type === "ساعتی") {
      const server_from_date =
        convertDateToISO8601(params.time_date) +
        " " +
        convertTime(params.time_from) +
        ":00";

      const server_to_date =
        convertDateToISO8601(params.time_date) +
        " " +
        convertTime(params.time_to) +
        ":00";

      formData.append("from_date", server_from_date);
      formData.append("to_date", server_to_date);

      isAfter =
        new Date(server_to_date).getTime() >
        new Date(server_from_date).getTime();
      const numTimeFrom = parseFloat(
        convertTime(params.time_from).split(":").join("")
      );
      const numTimeTo = parseFloat(
        convertTime(params.time_to).split(":").join("")
      );

      if (numTimeTo - numTimeFrom > 400 || !isAfter) {
        timeValid = false;
      }
    } else {
      console.log(isSameMonth);

      if (!isSameYear) {
        Modal.error({
          content: "تاریخ شروع و پایان مرخصی باید در سال یکسان باشند",
        });
        return;
      }

      // split the leave request into two request if in two different months
      formData.append(
        "from_date",
        `${convertDateToISO8601(params.start_date)} 00:00:00`
      );

      if (!isSameMonth) {
        const fromMonth = params?.start_date?.split("/")?.[1];
        const year = params?.start_date?.split("/")?.[0];
        const lastDay = Number(fromMonth) <= 6 ? "31" : "30";
        const toDate = `${year}/${fromMonth}/${lastDay}`;
        console.log("to date:", toDate);
        formData.append("to_date", `${convertDateToISO8601(toDate)} 00:00:00`);
      } else {
        formData.append(
          "to_date",
          `${convertDateToISO8601(params.end_date)} 00:00:00`
        );
      }
    }
    if (person && person.id) formData.append("personnel_id", person.id);

    if (params.MedicalFile) {
      formData.append("file", params.MedicalFile[0]["originFileObj"]);
    }

    // for (var pair of formData.entries()) {
    //   console.log(pair[0] + ",! " + pair[1]);
    // }

    let request;
    if (updating) {
      request = () => _PUT(routeParams.id, formData);
    } else {
      request = () => _POST(formData);
    }

    if (timeValid === true) {
      setBtnLoading(true);
      //testPromise()
      request()
        .then((res) => {
          console.log("res:", res);
          if (!isSameMonth && !isTwoMonths) {
            const nextMonth = Number(params?.start_date?.split("/")?.[1]) + 1;
            const year = params?.start_date?.split("/")?.[0];
            const fromDate = `${year}/${
              nextMonth >= 10 ? String(nextMonth) : `0${nextMonth}`
            }/01`;
            console.log({
              from: fromDate,
              to: params.end_date,
            });
            // add leave requests recursively until the start and end date are the same month
            handleOnFinish({ ...params, start_date: fromDate }, true);
            return;
          }
          setBtnLoading(false);
          if (res) {
            notification.success({
              message: "با موفقیت ثبت شد",
            });
            // if (!updating) {
            // setTimeout(
            //   () =>
            //     history.push(pageNames.personnel.realPerson.leaveRequest.list),
            //   1000
            // );
            // }
          } else {
            notification.error({
              message: "عملیات ناموفق، لطفا مجددا تلاش کنید",
            });
            console.error(res);
          }
        })
        .catch((err) => {
          console.error(err);
          notification.error({
            message: "عملیات ناموفق، لطفا مجددا تلاش کنید",
          });
          setBtnLoading(false);
        });
    } else {
      Modal.error({
        content: isAfter
          ? "حداکثر مرخصی ساعتی مجاز در یک روز 4 ساعت است"
          : "بازه زمانی انتخاب شده صحیح نمیباشد",
      });
    }
  };

  const onChangeForm = (values, allValues) => {
    const { type, period_type } = values;
    if (type) {
      if (type === "استحقاقی" || type === "تشویقی" || type === "استعلاجی") {
        mainForm.setFieldsValue({ period_type: "روزانه" });
      } else {
        mainForm.setFieldsValue({ period_type: "" });
      }
    }

    if (period_type === "ساعتی") {
      let dayTime = moment(Date.now()).format("jYYYY/jMM/jDD");
      mainForm.setFieldsValue({ time_date: dayTime });
    }
  };

  // get initial values if is viewing or updating
  useEffect(() => {
    if (updating) {
      if (updating) setPageTitle("ویرایش مرخصی");

      setLoading(true);
      _GET_ITEM(routeParams.id)
        .then((res) => {
          setLoading(false);
          console.log(res.data);
          if (res) {
            console.log("responser in ", res);
            setDefaultCode(res.data.personnel_id_fk);
            const dataObj = {
              type: res.data.type,
              period_type: res.data.request_type,
              description:
                res.data.description == "undefined" || !res.data.description
                  ? ""
                  : res.data.description,
            };

            if (res.data.request_type === "ساعتی") {
              dataObj.time_date = timeToFa(res.data.from_date, false);
              const fromDate = timeToFa(res.data.from_date);
              const toDate = timeToFa(res.data.to_date);

              dataObj.time_from = (fromDate?.split("-")?.[0] + ":00")?.replace(
                " ",
                ""
              );
              dataObj.time_to = (toDate?.split("-")?.[0] + ":00")?.replace(
                " ",
                ""
              );

              dataObj.time_from = moment(res.data.from_date);
              dataObj.time_to = moment(res.data.to_date);
            } else {
              dataObj.start_date = timeToFa(res.data.from_date, false);
              dataObj.end_date = timeToFa(res.data.to_date, false);
            }

            mainForm.setFieldsValue(dataObj);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.error(err);
          notification.error({
            message: "مشکلی پیش آمده، لطفا دوباره تلاش کنید",
          });
        });
    }
  }, []);

  function handleFocusAfterFinish(val, currInput) {
    // if (val?.replace(/\D/g, "")?.length === 8) {
    //   if (currInput === "startDate") {
    //     endDateRef.current.focus();
    //   } else if (currInput === "endDate") {
    //     descriptionRef.current.focus();
    //   }
    // }
  }

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title={pageTitle}
        className="mt-3"
        breadcrumbItems={[
          // { text: "منابع انسانی" },
          {
            text: "درخواست های مرخصی",
            link: pageNames.personnel.realPerson.leaveRequest.list,
          },
          { text: pageTitle },
        ]}
      />

      <Form
        {...formItemLayout}
        form={mainForm}
        onValuesChange={onChangeForm}
        name="examination"
        onFinish={handleOnFinish}
        style={{}}
        initialValues={{
          type: "استحقاقی",
        }}
      >
        <Spin spinning={loading}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <fields.Person
              useForm={mainForm}
              setPerson={setPerson}
              defaultValue={defaultCode}
              disabled={!checkAccess([permission.TIMEOFFFOROTHERS])}
            />
            <fields.Type />
            <fields.PeriodType />
            <fields.MedicalFile />
            <fields.StartDate
              useForm={mainForm}
              onChange={(val) => handleFocusAfterFinish(val, "startDate")}
            />
            <fields.EndDate
              useForm={mainForm}
              onChange={(val) => handleFocusAfterFinish(val, "endDate")}
              pRef={endDateRef}
            />
            <fields.TimeDate useForm={mainForm} />
            <fields.TimeFrom useForm={mainForm} />
            <fields.TimeTo />
            <fields.Description pRef={descriptionRef} />
            <SubmitBtn loading={btnLoading} />
          </Row>
        </Spin>
      </Form>
    </>
  );
}

export default LeaveForm;
