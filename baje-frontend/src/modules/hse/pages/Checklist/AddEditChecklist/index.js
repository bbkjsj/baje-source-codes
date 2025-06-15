import AppFormItem from "components/general/AppFormItem";
import { Col, Form, Modal, Row } from "antd";
import AppRadioGroup from "components/general/AppRadioGroup";
import AppButton from "components/general/AppButton";
import ContentTop from "components/general/ContentTop";
import GoBackBtn from "components/GoBackBtn";
import { pageNames } from "constant";
import { constant, questionGroups } from "modules/hse/constant";
import React, { useEffect, useState } from "react";
import AppSelect from "components/general/AppSelect";
import { getJobs, getVehicleTypes } from "modules/hse/api/genraal";
import AppInput from "components/general/AppInput";
import MenuInlineBtn from "components/MenuInlineBtn";
import QuestionPicker from "./QuestionPicker";
import AppTable from "components/general/AppTable";
import { messages, showMessage } from "utils/message";
import {
  createChecklist,
  getChecklist,
  updateChecklist,
} from "modules/hse/api/checklist";
import { useHistory, useLocation } from "react-router";
import AppNumInput from "components/general/AppNumInput";
import columns from "./columns";

const AddEditChecklist = () => {
  const [form] = Form.useForm();
  const { goBack } = useHistory();
  const { state: checklist } = useLocation();

  const [state, setState] = useState({
    jobs: [],
    questionPicker: false,
    questions: [],
    loading: false,
    jobsLoading: true,
    checklist: {},
    group: constant.inidividual,
    vehicleTypes: [],
  });

  useEffect(() => {
    if (state.group === constant.inidividual) loadJobs();
    if (state.group === constant.vehicle) loadVehicleTypes();
  }, [state.group]);

  useEffect(() => {
    if (checklist) loadCheckList();
  }, [checklist]);

  const loadCheckList = async () => {
    try {
      const { data } = await getChecklist(checklist);
      form.setFields([
        { name: "comment", value: data.checklist.comment },
        { name: "jobsId", value: data.checklist?.jobs_id_fk },
        {
          name: "vehicleTypeId",
          value: data.checklist?.vehicle_type_id_fk,
        },
        { name: "group", value: data.checklist?.group },
        { name: "type", value: data.checklist?.type },
        { name: "minimumPoint", value: data.checklist?.minimum_point },
      ]);
      setState((s) => ({
        ...s,
        group: data.checklist?.group,
        questions: data.questions.map((item) => ({
          question: { ...item, group: item._group, id: item.questionId },
          weight_factor: item.weight_factor,
          critical: item.critical,
        })),
      }));
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadJobs = async () => {
    setState((s) => ({ ...s, jobsLoading: true }));
    try {
      const { data: jobs } = await getJobs();
      setState((s) => ({ ...s, jobs, jobsLoading: false }));
    } catch (error) {
      setState((s) => ({ ...s, jobsLoading: false }));
      console.log(error.message);
    }
  };

  const loadVehicleTypes = async () => {
    setState((s) => ({ ...s, jobsLoading: true }));
    try {
      const { data: vehicleTypes } = await getVehicleTypes();
      setState((s) => ({ ...s, vehicleTypes, jobsLoading: false }));
    } catch (error) {
      console.log(error.message);
      setState((s) => ({ ...s, jobsLoading: false }));
    }
  };

  const toggleQuestionPicker = () => {
    if (!form.getFieldValue("group"))
      return showMessage("ابتدا باید گروه را انتخاب کنید.", "error");

    setState((s) => ({ ...s, questionPicker: !s.questionPicker }));
  };

  const handleAddQuestion = (question) => {
    if (
      state.questions.find((item) => item.question.id === question.question.id)
    )
      return setState((s) => ({
        ...s,
        questionPicker: false,
      }));

    setState((s) => ({
      ...s,
      questions: [...s.questions, question],
      questionPicker: false,
    }));
  };

  const handleRemoveQuestion = (questionIndex) => {
    setState((s) => ({
      ...s,
      questions: s.questions.filter((item, index) => index !== questionIndex),
    }));
  };

  const handleSubmitChecklist = async (params) => {
    if (state.questions.length === 0)
      return showMessage("باید برای چک لیست سوال انتخاب کنید", "error");
    const temp = {
      ...params,
      type: constant.public,
      questions: state.questions.map(
        ({ question, critical = [], ...item }) => ({
          questionId: question.id,
          critical:
            typeof critical === "string" ? critical : critical.join(","),
          ...item,
        })
      ),
    };
    // return console.log(temp, "RESIDAM");
    if (checklist) return handleEditChecklist(temp);
    try {
      setState((s) => ({ ...s, loading: true }));
      await createChecklist(temp);
      showMessage("چک لیست با موفقیت ساخته شد", "success");
      goBack();
    } catch (error) {
      console.log(error.message);
      setState((s) => ({ ...s, loading: false }));
    }
  };

  const handleEditChecklist = async (params) => {
    try {
      setState((s) => ({ ...s, loading: true }));
      await updateChecklist({
        ...params,
        id: checklist.id,
      });
      showMessage(messages.editedSuccessfully("چک لیست"), "success");
      goBack();
    } catch (error) {
      console.log(error.message);
      setState((s) => ({ ...s, loading: false }));
    }
  };

  const questionTotallPoint = () =>
    state.questions.reduce(
      (pre, current) => parseInt(pre) + parseInt(current.weight_factor) * 4,
      [0]
    );

  const handleRemoveCritical = (question, criticalValue) => {
    const removeCritical = () => {
      const temp = [...state.questions];

      const index = temp.findIndex(
        (item) =>
          item.question.id === question.id ||
          item.question.id === question.questionId
      );

      temp[index] = {
        ...temp[index],
        critical:
          typeof temp[index].critical === "string"
            ? temp[index].critical
                .split(",")
                .filter((item) => item !== criticalValue)
            : temp[index].critical.filter((item) => item !== criticalValue),
      };
      setState((s) => ({ ...s, questions: temp }));
    };
    Modal.warning({
      centered: true,
      maskClosable: true,
      title: "نسبت به حذف حالت بحرانی مطمئن هستید؟",
      onOk: removeCritical,
    });
  };

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title={`${checklist ? "ویرایش" : "ساخت"} چک لیست`}
        breadcrumbItems={[
          { text: "لیست چک لیست", link: pageNames.hse.checklist.index },
        ]}
      />
      <Form form={form} onFinish={handleSubmitChecklist}>
        <Row gutter={10}>
          <Col md={8} sm={12} xs={24}>
            <AppFormItem label="گروه ممیزی" name="group" required>
              <AppRadioGroup
                disabled={!!checklist}
                onChange={({ target }) =>
                  setState((s) => ({
                    ...s,
                    questions: [],
                    group: target.value,
                  }))
                }
                options={questionGroups.map((item) => ({
                  value: item.value,
                  label: item.text,
                  disabled: item.value === constant.environment,
                }))}
              />
            </AppFormItem>
          </Col>
          <Col md={8} sm={12} xs={24}>
            <AppFormItem
              name={
                state.group === constant.inidividual
                  ? "jobsId"
                  : state.group === constant.vehicle
                  ? "vehicleTypeId"
                  : "environmentId"
              }
              label={
                state.group === constant.inidividual
                  ? "شغل"
                  : state.group === constant.vehicle
                  ? "انتخاب نوع ماشین"
                  : "انتخاب نوع محیط"
              }
              required
            >
              <AppSelect
                showSearch
                // ={state.group === constant.inidividual}
                filterOption={(input, option) =>
                  `${option.label}`.includes(input)
                }
                placeholder={
                  state.group === constant.inidividual
                    ? "جستجو بر اساس عنوان شغلی"
                    : state.group === constant.vehicle
                    ? "انتخاب ماشین"
                    : ""
                }
                disabled={!!checklist}
                loading={state.jobsLoading}
                options={
                  state.group === constant.inidividual
                    ? state.jobs.map((item) => ({
                        label: `${item.id} - ${item.title}`,
                        value: item.id,
                      }))
                    : state.group === constant.vehicle
                    ? state.vehicleTypes.map((item) => ({
                        label: item.title,
                        value: item.id,
                      }))
                    : []
                }
              />
            </AppFormItem>
          </Col>
          <Col md={8} sm={12} xs={24}>
            <AppFormItem name="comment" label="توضیحات">
              <AppInput />
            </AppFormItem>
          </Col>
          <Col md={8} sm={12} xs={24}>
            <AppFormItem
              label="حداقل امتیاز صدور پرمیت از 100"
              name="minimumPoint"
              tooltip="مشخص کنید که با کسب چند درصد از امتیازات این چک لیست، مجوز کار صادر می شود."
              required
            >
              <AppNumInput min={1} max={100} />
            </AppFormItem>
          </Col>
        </Row>
        <ContentTop title="سوالات چک لیست" noBack />
        <MenuInlineBtn
          list={[
            {
              id: "newQuestion",
              variant: "primary",
              label: "افزودن سوال",
              handleClick: toggleQuestionPicker,
            },
          ]}
        />
        {state.questions.length > 0 && (
          <>
            <p className="text-danger my-2">
              {`جمع نمرات: ${questionTotallPoint()}`}
            </p>
            <AppTable
              notMarginTop
              dataSource={state.questions}
              columns={columns(handleRemoveQuestion, handleRemoveCritical)}
            />
          </>
        )}
        <Row justify="end">
          <AppButton
            loading={state.loading}
            htmlType="submit"
            className="flex-end"
            variant="primary"
          >
            {`${checklist ? "ویرایش" : "ساخت"} چک لیست`}
          </AppButton>
        </Row>
      </Form>

      <QuestionPicker
        visible={state.questionPicker}
        onCancel={toggleQuestionPicker}
        handleAddQuestion={handleAddQuestion}
        groupName={form.getFieldValue("group")}
        selectedQuestions={state.questions.map((item) => item.question)}
      />
    </>
  );
};

export default AddEditChecklist;
