import React, { useContext, useEffect, useState } from "react";
import {
  Form,
  message,
  Row,
  Spin,
  Input,
  notification,
  Modal,
  Divider,
} from "antd";
import GoBackBtn from "components/GoBackBtn";
import * as fields from "./common/formItems";
import SubmitBtn from "components/general/SubmitBtn";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {
  convertDateToENProper,
  timeToFa,
  convertDateToISO8601,
} from "_helpers";
import ContentTop from "components/general/ContentTop";
import AssignementPreview from "./AssignementPreview";
import { pageNames } from "constant";
import { getShiftTimeString } from "modules/personnel/shiftwork/utils/misc";
import { getAssignedShift } from "./utils/api";
import { handleExceptions } from "modules/personnel/jobs/common/api";
const formItemLayout = {
  labelCol: { span: 24 },
  colon: false,
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    lg: { span: 22 },
  },
};

const AssignShiftForm = (props) => {
  const [mainForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [pageTitle, setPageTitle] = useState("اختصاص شیفت");
  const [person, setPerson] = useState();
  const [defaultCode, setDefaultCode] = useState(props.location.state);
  const [assignPreviewModal, setAssignPreviewModal] = useState(false);
  const [startAndActionDate, setStartAndActionDate] = useState([]);
  const [currShift, setCurrShift] = useState();
  const [shiftList, setShiftList] = useState([]);
  const [formBody, setFormBody] = useState(null);
  const [updating, setUpdating] = useState(null);
  const params = useParams();

  // get user shift
  useEffect(() => {
    setLoading(true);

    getAssignedShift(params.id)
      .then((res) => {
        setLoading(false);
        if (res?.data?.length) {
          const personShift = res?.data[res?.data?.length - 1];
          if (personShift) {
            mainForm.setFieldsValue({
              job_shift_id: personShift.id,
              startDate: timeToFa(personShift.start_date, false),
              actionDate: timeToFa(personShift.end_date, false),
            });

            setUpdating(personShift.id);
            setCurrShift(personShift.id);
          }
        }
      })
      .catch((err) => {
        setLoading(false);
        handleExceptions(err);
      });
  }, []);

  // set current shift
  useEffect(() => {
    if (currShift) {
      const shift = shiftList.find((i) => i.id == currShift);
      if (shift) {
        setCurrShift(shift);
      }
    }
  }, [shiftList]);

  const handleShiftChange = (shift) => {
    setCurrShift(shift);
  };

  const handleOnFinish = (params) => {
    const body = {
      start_date: convertDateToISO8601(params.startDate),
      end_date: convertDateToISO8601(params.actionDate),
      jobs_shift_id_fk: params.job_shift_id,
      personnel_id_fk: person.id,
    };

    setFormBody(body);

    setStartAndActionDate([
      convertDateToENProper(params.startDate),
      convertDateToENProper(params.actionDate),
    ]);
    setAssignPreviewModal(true);
  };

  function shiftPattern() {
    if (currShift && currShift.patterns && currShift.patterns.length) {
      const pattern = currShift.patterns;
      let result = "";

      for (let i = 0; i < pattern.length; i++) {
        const shift = pattern[i];
        result =
          result +
          `${shift?.days} روز ${shift.status === "work" ? "کار" : "استراحت"} ${
            shift.status === "work"
              ? `${getShiftTimeString(
                  shift.from_time
                )} لغایت ${getShiftTimeString(shift.to_time)}`
              : ""
          }`;
        if (i !== pattern.length - 1) {
          result = result + " - ";
        }
      }

      return result;
    } else {
      return "-";
    }
  }

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title={pageTitle}
        className="mt-3"
        breadcrumbItems={[
          { text: "منابع انسانی" },
          { text: "افراد حقیقی", link: pageNames.personnel.realPerson.list },
          { text: "اختصاص شیفت" },
        ]}
      />

      <Form
        {...formItemLayout}
        form={mainForm}
        name="examination"
        onFinish={handleOnFinish}
        style={{}}
      >
        <Spin spinning={loading}>
          <fields.Person
            useForm={mainForm}
            setPerson={setPerson}
            defaultValue={defaultCode}
            disabled
          />

          <Divider orientation="right">الگوی شیفت</Divider>
          <fields.ShiftList
            onChange={handleShiftChange}
            onLoad={(list) => setShiftList(list)}
          />
          <p className="pb-3">
            <strong>الگوی شیفت:</strong> {shiftPattern()}
          </p>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <fields.StartDate useForm={mainForm} />
            <fields.ActionDate useForm={mainForm} />
          </Row>
          <SubmitBtn text={"نمایش و ثبت"} />
        </Spin>
      </Form>

      <Modal
        visible={assignPreviewModal}
        width={820}
        onCancel={() => setAssignPreviewModal(false)}
        footer={null}
        title="پیش نمایش اختصاص شیفت"
      >
        <AssignementPreview
          toFromDate={startAndActionDate}
          body={formBody}
          shift={currShift}
          updating={updating}
          closeModal={() => {
            setAssignPreviewModal(false);
            setBtnLoading(false);
          }}
        />
      </Modal>
    </>
  );
};

export default AssignShiftForm;
