import React, { useEffect, useState, useContext } from "react";
import { Form, Row, message, Col } from "antd";
import * as FormItems from "./components/FormItems";
import SubmitBtn from "components/general/SubmitBtn";
import { convertDateToEN } from "_helpers";
import { withRouter } from "react-router-dom";
import OtherCompany from "./components/OtherCompany";
import { useAddPerson } from "./util/hooks";
import { useGetUserAndSubordinate } from "./util/hooks";
import SubordinatesList from "./components/SubordinatesList";
import Modal from "antd/lib/modal/Modal";
import AddSubordinateForm from "./components/AddSubordinateForm";

const formItemLayout = {
  labelCol: { span: 24 },
  colon: false,
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    lg: { span: 22 },
  },
};

const formStyle = {};

const formGutter = { xs: 8, sm: 16, md: 24, lg: 32 };

const PersonAdd = ({ match, updateList, data, insurance }) => {
  const [form] = Form.useForm();
  const [subForm] = Form.useForm();
  //
  const [otherCompanyVsible, setOtherCompanyVisible] = useState(false);
  const insuranceID = match.params.id;
  const [person, setPerson] = useState();
  const [subModal, setSubModal] = useState(false);
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [initialSub, setInitialSub] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const { submit, loading: submitLoading } = useAddPerson(form, updateList);
  const {
    getSubordinates: getUserAndSubordinate,
    sub: subordinatesList,
    formAssignment,
  } = useGetUserAndSubordinate();

  const onCancle = () => {
    form.resetFields();
    setOtherCompanyVisible(false);
  };

  const onOk = () => {
    setOtherCompanyVisible(false);
  };

  const addToSelectedSubordinates = (data) => {
    const subordinate = subordinatesList.find(
      (el) => el.id == data.personnel_id
    );
    const payload = {
      ...data,
      is_approved: 0,
      name: `${subordinate.first_name} ${subordinate.last_name}`,
      national_number: subordinate.national_number,
    };

    const newList = selectedSubs.filter(
      (el) => el.personnel_id !== payload.personnel_id
    );
    newList.push(payload);
    setSelectedSubs(newList);
  };

  const handleOnFinish = (values) => {
    // convert date
    values.is_approved = 0;
    values.type = "takmili";
    values.insurance_id = insuranceID;
    values.start_date = convertDateToEN(values.start_date);
    values.end_date = convertDateToEN(values.end_date);

    if (!values.main_insurer_personnel_id) {
      values.main_insurer_personnel_id = values.personnel_id;
    }

    // console.info(values);
    let isExist = data.filter(
      (item) => item.main_national_number === values.national_id
    );

    values.subordinates = selectedSubs.map((el) => ({
      ...el,
      start_date: convertDateToEN(el.start_date),
      end_date: convertDateToEN(el.end_date),
    }));

    if (isExist.length > 0) {
      message.warning("این شخص قبلا ثبت شده است");
    } else {
      console.log("!values!", values);
      submit(values);
    }
  };

  const handleOnSubSubmit = (data, keepOpen) => {
    console.log(keepOpen, "%%%%%%%%%");
    addToSelectedSubordinates(data);
    if (keepOpen) {
      subForm.resetFields();
      openAddSubordinateModal();
    } else setSubModal(false);
  };

  const openAddSubordinateModal = () => {
    setEditMode(false);
    setSubModal(true);
    setInitialSub({
      start_date: form.getFieldValue("start_date"),
      end_date: form.getFieldValue("end_date"),
    });
  };

  const handleSetOtherCompanyVisible = (value) => {
    setOtherCompanyVisible(value);
  };

  useEffect(() => {
    if (form.getFieldValue("national_id")) {
      getUserAndSubordinate(form.getFieldValue("national_id"), insurance).then(
        (res) => {
          if (res) {
            formAssignment(res, form, insurance);
          }
        }
      );
    }
  }, [person]);

  useEffect(() => {
    if (!subModal) {
      setInitialSub(null);
      subForm.resetFields();
    }
  }, [subModal]);

  return (
    <>
      {/* <GoBackBtn />
      <h2>افزدون فرد به لیست بیمه</h2> */}

      <OtherCompany
        visible={otherCompanyVsible}
        onCancle={onCancle}
        onOk={onOk}
      />
      <Form
        {...formItemLayout}
        form={form}
        style={formStyle}
        onFinish={handleOnFinish}
      >
        <Row gutter={formGutter}>
          <FormItems.UserID useForm={form} />
          <FormItems.MainUserID useForm={form} />
          {/* <FormItems.UserStatus useForm={form} /> */}

          <FormItems.Person
            useForm={form}
            setPerson={setPerson}
            defaultValue={null}
            onReset={() => setSelectedSubs([])}
          />

          <FormItems.StartDateInsurance useForm={form} insurance={insurance} />
          <FormItems.EndDateInsurance useForm={form} insurance={insurance} />
          <Col xs={0} sm={0} md={0} lg={0} xl={6}></Col>
          <FormItems.MobileNumber useForm={form} />
          <FormItems.BankAccount useForm={form} />

          <FormItems.Description />

          <FormItems.AddSubordinate
            onClick={openAddSubordinateModal}
            list={subordinatesList}
          />
          {selectedSubs?.length > 0 && (
            <SubordinatesList
              list={selectedSubs}
              onDelete={(data) => {
                const newList = selectedSubs.filter(
                  (el) => el.personnel_id != data.personnel_id
                );
                setSelectedSubs(newList);
              }}
              onEdit={(data) => {
                setEditMode(true);
                setInitialSub(data);
                setSubModal(true);
              }}
            />
          )}
        </Row>
        <SubmitBtn loading={submitLoading} />
      </Form>

      <Modal
        title="تبعی"
        visible={subModal}
        onCancel={() => setSubModal(false)}
        footer={null}
        closable={false}
      >
        <AddSubordinateForm
          subForm={subForm}
          list={subordinatesList.filter(
            (person) =>
              data.findIndex((el) => el.sub_id === person.id) === -1 &&
              (editMode
                ? true
                : selectedSubs.findIndex(
                    (elem) => elem.personnel_id === person.id
                  ) === -1)
          )}
          mainPerson={form.getFieldsValue()}
          initialSub={initialSub}
          insurance={insurance}
          onFinish={handleOnSubSubmit}
        />
      </Modal>
    </>
  );
};

export default withRouter(PersonAdd);
