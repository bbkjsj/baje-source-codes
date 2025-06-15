import { Col, Form, Row } from "antd";
import AppButton from "components/general/AppButton";
import AppFormItem from "components/general/AppFormItem";
import AppInput from "components/general/AppInput";
import AppNumInput from "components/general/AppNumInput";
import AppSelect from "components/general/AppSelect";
import AppTextArea from "components/general/AppTextArea";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { getJobs, getPersonnel } from "modules/task/api/general";
import { getTasks, postTasks } from "modules/task/api/task";
import {
  constant,
  ifTaskFailed,
  taskApproveSequence,
  taskDoneCondition,
  taskSMSNotirfication,
} from "modules/task/constant";
import React, { useEffect, useState } from "react";
import { utils } from "react-modern-calendar-datepicker";
import { useHistory } from "react-router-dom";
import moment from "moment-jalaali";
import AppRadioGroup from "components/general/AppRadioGroup";

const CreateTask = () => {
  const { goBack } = useHistory();
  const [form] = Form.useForm();

  const [state, setState] = useState({
    loading: true,
    personnels: [],
    tasks: [],
    approveCondition: constant.none,
    jobs: [],
  });

  useEffect(() => {
    loadDatas();
  }, []);

  const loadDatas = async () => {
    try {
      const {
        data: { list: personnels },
      } = await getPersonnel();
      const { data: tasks } = await getTasks();
      const { data: jobs } = await getJobs();
      setState((s) => ({ ...s, personnels, loading: false, tasks, jobs }));
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleCreateTask = async ({ dueDate, ...params }) => {
    try {
      await postTasks({
        taskType: constant.independent,
        dueDate: moment(dueDate, "jYYYY/jMM/jDD").toDate(),
        ...params,
      });
      goBack();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChangeApproveCondition = (approveCondition) => {
    setState((s) => ({ ...s, approveCondition }));
  };

  return (
    <>
      <Form
        initialValues={{
          title: "TEST TASK",
          point: 10,
          negativePoint: 5,
          ifTaskFailed: constant.killTask,
          members: [9699, 16064],
          approveCondition: state.approveCondition,
          approvePersonnelId: 16064,
          punishment: constant.none,
        }}
        form={form}
        onFinish={handleCreateTask}>
        <Row gutter={16}>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem required label="عنوان وظیفه" name="title">
              <AppInput />
            </AppFormItem>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <CustomDatePicker
              plain
              required
              rules={[
                { required: true, message: "مهلت انجام وظیفه الزامی است." },
              ]}
              name="dueDate"
              label="مهلت انجام"
              form={form}
              minimumDate={utils("fa").getToday()}
            />
          </Col>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem
              required
              label="امتیاز مثبت"
              name="point"
              tooltip="در صورت انجام وظیفه در زمان مشخص شده، این مقدار امتیاز برای شخص در نظر گرفته خواهد شد">
              <AppNumInput min={0} />
            </AppFormItem>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem
              required
              label="امتیاز منفی"
              name="negativePoint"
              tooltip="در صورت عدم انجام وظیفه در زمان مشخص شده، این مقدار امتیاز منفی برای شخص در نظر گرفته خواهد شد">
              <AppNumInput min={0} />
            </AppFormItem>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem
              label="اگر وظیفه انجام نشد"
              name="ifTaskFailed"
              required>
              <AppSelect options={ifTaskFailed} />
            </AppFormItem>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem name="approveCondition" label="نحوه تایید انجام">
              <AppSelect
                onChange={handleChangeApproveCondition}
                options={taskDoneCondition}
              />
            </AppFormItem>
          </Col>
          {state.approveCondition === constant.specificJob && (
            <>
              <Col md={6} sm={24} xs={24}>
                <AppFormItem
                  required
                  name="approveSequence"
                  label="روند تایید انجام وظیفه">
                  <AppRadioGroup options={taskApproveSequence} />
                </AppFormItem>
              </Col>
              <Col md={6} sm={24} xs={24}>
                <AppFormItem
                  required
                  name="approverJobsId"
                  label="شغل های تایید کننده">
                  <AppSelect
                    mode="tags"
                    options={state.jobs.map((item) => ({
                      label: item.title,
                      value: item.id,
                    }))}
                  />
                </AppFormItem>
              </Col>
            </>
          )}
          {state.approveCondition === constant.specificPerson && (
            <Col md={6} sm={24} xs={24}>
              <AppFormItem
                required
                name="approverPersonnelId"
                label="فرد تایید کننده">
                <AppSelect
                  filterOption={(search, { value, label }) =>
                    label.includes(search)
                  }
                  showSearch
                  options={state.personnels.map((item) => ({
                    label: item.first_name + " " + item.last_name,
                    value: item.id,
                  }))}
                />
              </AppFormItem>
            </Col>
          )}
        </Row>

        <Row gutter={16}>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem label="وظیفه مرتبط" name="relatedTask">
              <AppSelect
                allowClear
                loading={state.loading}
                placeholder="جستجو بر اساس عنوان وظیفه"
                showSearch
                filterOption={(search, { label }) => label.includes(search)}
                options={state.tasks.map((item) => ({
                  label: item.title,
                  value: item.id,
                }))}
              />
            </AppFormItem>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem
              label="یاد آور پیامک اطلاع رسانی"
              name="smsNotification">
              <AppSelect mode="tags" options={taskSMSNotirfication} />
            </AppFormItem>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem
              label="ثبت وظیفه برای"
              name="members"
              required
              tooltip="وظیفه ساخته شده، در کارتابل اسن افراد قرار خواهد گرفت">
              <AppSelect
                placeholder="جستجو بر حسب کد ملی یا نام"
                mode="tags"
                loading={state.loading}
                filterOption={(search, { value, label }) => {
                  return label.includes(search);
                  return !!parseInt(search[0]) && parseInt(search[0]) > 0
                    ? value.startsWith(search)
                    : label.includes(search);
                }}
                options={state.personnels.map((item) => ({
                  label: `${item.first_name} ${item.last_name}`,
                  value: item.id,
                }))}
              />
            </AppFormItem>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem required label="توضیحات" name="description">
              <AppTextArea />
            </AppFormItem>
          </Col>
        </Row>

        <AppButton htmlType="submit">ساخت وظیفه</AppButton>
      </Form>
    </>
  );
};

export default CreateTask;
