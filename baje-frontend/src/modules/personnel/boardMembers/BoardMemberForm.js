import React, { useContext, useEffect, useReducer, useState } from "react";
import { Form, message, Row, Spin, Input, notification, Modal } from "antd";
import GoBackBtn from "components/GoBackBtn";
import * as fields from "./common/formItems";
import SubmitBtn from "components/general/SubmitBtn";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {
  addBoardMember,
  getBoardMemberByPersonId,
  updateBoardMember,
} from "./utils/api";

import { convertDateToISO8601, covetFormatDateToFA, getLink } from "_helpers";
import ContentTop from "components/general/ContentTop";
import { UserContext } from "contex/User-context";
import { pageNames } from "constant";
import actions from "./utils/actions";

const formItemLayout = {
  labelCol: { span: 24 },
  colon: false,
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    lg: { span: 22 },
  },
};

const pageReducer = (state, action) => {
  switch (action.type) {
    case actions.SET_LOADING:
      return { ...state, loading: action.payload };
    case actions.SET_BTN_LOADING:
      return { ...state, btnLoading: action.payload };
    case actions.SET_PERSON:
      return { ...state, person: action.payload };
    case actions.SET_DEFAULT_CODE:
      return { ...state, defaultCode: action.payload };

    default:
      return state;
  }
};

function BoardMemberForm({ updating }) {
  const [mainForm] = Form.useForm();
  const history = useHistory();
  const routeParams = useParams();
  const { userData } = useContext(UserContext);

  const [state, dispatch] = useReducer(
    pageReducer,
    {
      loading: false,
      btnLoading: false,
      person: {},
      defaultCode: !updating ? userData && userData.national_code : null,
    },
    (state) => state
  );

  const handleOnFinish = async (params) => {
    dispatch({ type: actions.SET_BTN_LOADING, payload: true });

    const body = {
      company_id_fk: Number(routeParams.id),
      role: params.role,
      from_date: convertDateToISO8601(params.from_date),
      to_date: convertDateToISO8601(params.to_date),
      signature_rights: params.signature_rights,
      description: params.description,
      enabled: false,
    };
    if (state.person && state.person.id)
      body.personnel_id_fk = Number(state.person.id);

    let request;
    if (updating) {
      request = () => updateBoardMember(body, routeParams.id);
    } else {
      request = () => addBoardMember(body);
    }

    try {
      const res = await request();

      dispatch({ type: actions.SET_BTN_LOADING, payload: false });
      if (res) {
        notification.success({
          message: "با موفقیت ثبت شد",
        });

        setTimeout(
          () =>
            history.push(
              getLink(pageNames.personnel.boardMembers.list, {
                id: routeParams.id,
              })
            ),
          1000
        );
      }
    } catch (err) {
      console.error(err);
      dispatch({ type: actions.SET_BTN_LOADING, payload: false });
    }
  };

  // get initial values if is viewing or updating
  useEffect(() => {
    async function fetchData() {
      try {
        dispatch({ type: actions.SET_LOADING, payload: true });

        const res = await getBoardMemberByPersonId(routeParams.member_id);

        dispatch({ type: actions.SET_LOADING, payload: false });
        if (res) {
          dispatch({
            type: actions.SET_DEFAULT_CODE,
            payload: res.data.personnel_id,
          });
          mainForm.setFieldsValue({
            description: res.data.description || "",
            from_date: covetFormatDateToFA(res.data.from_date),
            role: res.data.role || "",
            signature_rights:
              res.data.signature_rights && res.data.signature_rights.length
                ? res.data.signature_rights.split(",")
                : [],
            to_date: covetFormatDateToFA(res.data.to_date),
          });
        }
      } catch (err) {
        dispatch({ type: actions.SET_LOADING, payload: false });
        console.error(err);
      }
    }
    if (updating) {
      fetchData();
    }
  }, []);

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title={updating ? "ویرایش عضو هیئت مدیره" : "افزودن عضو هیئت مدیره"}
        className="mt-3"
        breadcrumbItems={[
          { text: "منابع انسانی" },
          {
            text: "اعضای هیئت مدیره",
            link: pageNames.personnel.boardMembers.list,
          },
          {
            text: updating ? "ویرایش عضو هیئت مدیره" : "افزودن عضو هیئت مدیره",
          },
        ]}
      />

      <Form
        {...formItemLayout}
        form={mainForm}
        name="examination"
        onFinish={handleOnFinish}
        style={{}}
      >
        <Spin spinning={state.loading}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <fields.Person
              useForm={mainForm}
              setPerson={(person) =>
                dispatch({ type: actions.SET_PERSON, payload: person })
              }
              defaultValue={state.defaultCode}
            />
            <fields.Role />
            <fields.StartDate useForm={mainForm} />
            <fields.EndDate useForm={mainForm} />
            <fields.Signature />
            <fields.Description />
            <SubmitBtn loading={state.btnLoading} />
          </Row>
        </Spin>
      </Form>
    </>
  );
}

export default BoardMemberForm;
