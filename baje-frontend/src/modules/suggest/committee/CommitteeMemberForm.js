import React, { useContext, useEffect, useState } from "react";
import { Form, message, Modal, Row, Spin } from "antd";
import GoBackBtn from "components/GoBackBtn";
import * as fields from "./common/committeeMemberFormItems";
import SubmitBtn from "components/general/SubmitBtn";
import AppCard from "components/general/AppCard";
import { useHistory, useLocation } from "react-router-dom";
import * as api from "./utils/api";
import { getAsArray, getLink, notice } from "_helpers";
import { committeeMemberPosition } from "./const";
import moment from "moment-jalaali";
import ContentTop from "../../../components/general/ContentTop";
import { formItemLayout, formRowGutter, pageNames } from "constant";
import { getServerDateTime } from "utils/api";

function CommitteeMemberForm(props) {
  const [mainForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [person, setPerson] = useState();
  const [committeeList, setCommitteeList] = useState();
  const [theSecretary, setTheSecretary] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const defaultCommitteeId = query.get("committee_id");
  const pageId = props.match.params.id;
  const isNew = !pageId;
  const [saveLoading, setSaveLoading] = useState();
  const [initialPersonnelId, setInitialPersonnelId] = useState(null);
  const [pageData, setPageData] = useState({});
  const [isPositionEditable, setIsPositionEditable] = useState(false);

  const handleOnFinish = async (params) => {
    let fromDate = moment(params.member_from, "jYYYY/jMM/jDD");
    const serverDate = await getServerDateTime();
    const memberList = await api._GET_MEMBER(params.wid);

    if (
      params.member_to &&
      fromDate.isAfter(moment(params.member_to, "jYYYY/jMM/jDD"))
    ) {
      Modal.warn({
        title: "تاریخ پایان عضویت",
        content: "تاریخ پایان عضویت باید پس از تاریخ شروع عضویت باشد",
      });

      return;
    }

    if (fromDate.isBefore(serverDate.data.date, "day")) {
      Modal.warn({
        title: "تاریخ شروع عضویت",
        content: "تاریخ شروع عضویت نمیتواند پیش از امروز باشد",
      });

      return;
    }

    if (
      isNew &&
      params.position === committeeMemberPosition.MEMBER &&
      !memberList.data.find(
        (item) => item.position === committeeMemberPosition.SECRETARY
      )
    ) {
      Modal.warn({
        title: "تعیین دبیر",
        content: "لازم است ابتدا دبیر کارگروه را تعریف کنید",
      });

      return;
    }

    if (
      isNew &&
      memberList.data.find(
        (item) =>
          item.personnel_id === person.id &&
          (!item.member_to ||
            moment(item.member_to).isAfter(serverDate.data.date))
      )
    ) {
      Modal.warn({
        title: "عضو تکرای",
        content:
          "در حال حاضر، فرد مورد نظر در کارگروه انتخابی عضو فعال میباشد. لطفا از گزینه های ویرایش در کارگروه استفاده کنید.",
      });

      return;
    }

    if (
      params.position === committeeMemberPosition.SECRETARY &&
      fromDate.isAfter(serverDate.data.date, "day") &&
      memberList.data.find(
        (item) =>
          item.position === committeeMemberPosition.SECRETARY &&
          fromDate.isSame(item.member_from, "day")
      )
    ) {
      Modal.warn({
        title: "تعیین ۲ دبیر در یک روز",
        content:
          "قبلا برای تاریخ انتخابی شما یک دبیر تعیین شده است. لطفا تاریخ دیگری را انتخاب نمایید یا دبیر مربوطه را ویرایش نمایید",
      });

      return;
    }

    if (
      theSecretary &&
      theSecretary.personnel_id !== person.id &&
      params.position === committeeMemberPosition.SECRETARY &&
      (!theSecretary.member_to ||
        moment(theSecretary.member_to).isSameOrAfter(
          serverDate.data.date,
          "day"
        )) &&
      moment(params.member_from, "jYYYY/jMM/jDD").isSameOrBefore(
        serverDate.data.date,
        "day"
      )
    ) {
      Modal.confirm({
        title: "تغییر دبیر کارگروه",
        content:
          "این کارگروه دارای دبیر میباشد. آیا مایل به جایگزینی دبیر با فرد انتخاب شده هستید؟",
        onOk: async () => {
          await saveChanges(params, true);
        },
      });
    } else {
      await saveChanges(params);
    }
  };

  const saveChanges = async (params, replaceSecretary = false) => {
    const toDeleteParams = ["person_name", "person_national_code"];
    const serverDate = await getServerDateTime();

    if (person && person.id) params.personnel_id = person.id;
    toDeleteParams.map((key) => delete params[key]);

    //--------------

    try {
      setSaveLoading(true);
      const committeeId = isNew
        ? Number(defaultCommitteeId)
        : pageData["workgroup_id_fk"];
      const members = await api._GET_MEMBER(committeeId);

      const prevMembership = members.data.find(
        (item) => !item.expire && item.personnel_id === person.id
      );

      const toTerminateMembers = [];

      if (
        prevMembership &&
        prevMembership.position !== params.position &&
        moment(params.member_from, "jYYYY/jMM/jDD").isSameOrBefore(
          serverDate.data.date,
          "day"
        )
      )
        toTerminateMembers.push(prevMembership);

      if (replaceSecretary) toTerminateMembers.push(theSecretary);

      if (toTerminateMembers.length) {
        for (let toTerminate of toTerminateMembers) {
          if (
            moment(toTerminate.member_from).isSameOrAfter(
              serverDate.data.date,
              "day"
            )
          ) {
            notice("delete");
            console.log(toTerminate);
            await api._DELETE_MEMBER(getAsArray(toTerminate.id));
          } else {
            const memberTo = moment(serverDate.data.date)
              .subtract(1, "days")
              .format("YYYY/M/D HH:mm:ss");

            notice("terminate");
            console.log(toTerminate);
            await saveItem(
              toTerminate.id,
              toTerminate.workgroup_id_fk || params.wid,
              toTerminate.personnel_id_fk || toTerminate.personnel_id,
              toTerminate.position,
              toTerminate.member_from,
              memberTo
            );
          }
        }
      }

      if (replaceSecretary) {
        notice("member for prev secr");
        await saveItem(
          false,
          params.wid,
          theSecretary.personnel_id,
          committeeMemberPosition.MEMBER,
          moment(serverDate.data.date).format("YYYY/M/D HH:mm:ss"),
          ""
        );

        notice("new secret (replace)");
        await saveItem(
          false,
          params.wid,
          params.personnel_id,
          committeeMemberPosition.SECRETARY,
          moment(serverDate.data.date).format("YYYY/M/D HH:mm:ss"),
          ""
        );
      } else {
        const theId =
          prevMembership &&
          prevMembership.position !== params.position &&
          moment(params.member_from, "jYYYY/jMM/jDD").isAfter(
            serverDate.data.date,
            "day"
          ) &&
          !moment(params.member_from, "jYYYY/jMM/jDD").isSame(
            prevMembership.member_from,
            "day"
          )
            ? false
            : pageId;

        notice("regular save");
        await saveItem(
          theId,
          params.wid,
          params.personnel_id,
          params.position,
          moment(params.member_from, "jYYYY/jMM/jDD").format(
            "YYYY/M/D HH:mm:ss"
          ),
          params.member_to &&
            moment(params.member_to, "jYYYY/jMM/jDD").format(
              "YYYY/M/D HH:mm:ss"
            )
        );
      }

      setSaveLoading(false);
    } catch (error) {
      if (error.response) {
        setSaveLoading(false);
        message.error(error?.response?.data);
      }
    }

    //-------------

    message.success("با موفقیت انجام شد");

    const newPath = getLink(
      pageNames.suggest.commitee.member.list,
      isNew ? defaultCommitteeId : params.wid
    );

    history.push(newPath);
  };

  const saveItem = async (
    id,
    wid,
    personnel_id,
    position,
    member_from,
    member_to
  ) => {
    const data = {
      personnel_id,
      position,
      member_from,
      wid,
    };

    console.log(data);

    if (member_to) data["member_to"] = member_to;

    console.log(id, data);
    return id ? await api._PUT_MEMBER(id, data) : await api._POST_MEMBER(data);
  };

  useEffect(() => {
    try {
      (async () => {
        const committeeList = await api._GET();

        let secretary = false;
        let committeeId = isNew ? defaultCommitteeId : 0;

        setCommitteeList(committeeList.data);

        if (!isNew) {
          setLoading(true);

          const itemData = await api._GET_ITEM_MEMBER(pageId);
          setPageData(itemData.data);

          mainForm.setFieldsValue({
            ...itemData.data,
            wid: itemData.data["workgroup_id_fk"],
            member_from: moment(itemData.data.member_from).format(
              "jYYYY/jMM/jDD"
            ),
            member_to:
              itemData.data.member_to &&
              moment(itemData.data.member_to).format("jYYYY/jMM/jDD"),
          });

          committeeId = itemData.data.workgroup_id_fk;
          setInitialPersonnelId(itemData.data.national_number);
          setLoading(false);
        }

        if (committeeList.data.length) {
          const members = await api._GET_MEMBER(committeeId);

          if (members.data.length)
            secretary = members.data.find(
              (item) =>
                item.position === committeeMemberPosition.SECRETARY &&
                !item.expire
            );

          if (isNew) {
            const todayDate = moment().format("jYYYY/jMM/jDD");

            mainForm.setFieldsValue({
              member_from: todayDate,
              position: secretary
                ? committeeMemberPosition.MEMBER
                : committeeMemberPosition.SECRETARY,
            });
          }

          setTheSecretary(secretary);
        }

        mainForm.setFieldsValue({ wid: parseInt(committeeId) });
      })();
    } catch (error) {
      message.error("مشکلی در نمایش صفحه پیش آمده است");
    }
  }, []);

  useEffect(() => {
    (async () => {
      const serverDate = await getServerDateTime();

      const editPosition =
        isNew ||
        pageData.position === committeeMemberPosition.MEMBER ||
        (pageData &&
          moment(pageData.member_from).isAfter(serverDate.data.date, "day"));

      setIsPositionEditable(editPosition);
    })();
  }, [pageData]);

  const onPositionChange = (val) => {
    if (val === committeeMemberPosition.SECRETARY)
      mainForm.setFieldsValue({ member_to: "" });
  };

  const formInitialValues = {
    wid: defaultCommitteeId ? parseInt(defaultCommitteeId) : null,
  };

  if (!committeeList) {
    return <p>در حال دریافت</p>;
  }

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title={(isNew ? "ایجاد" : "ویرایش") + " عضو کارگروه"}
        className="mt-3"
        breadcrumbItems={[
          { text: "نظام پیشنهادات" },
          { text: "کارگروه‌ها", link: pageNames.suggest.commitee.list },
          {
            text: "اعضای کارگروه",
            link: getLink(
              pageNames.suggest.commitee.member.list,
              defaultCommitteeId
            ),
          },
        ]}
      />

      <AppCard>
        <Form
          {...formItemLayout}
          form={mainForm}
          name="examination"
          onFinish={handleOnFinish}
          initialValues={formInitialValues}
        >
          <Spin spinning={loading}>
            <Row gutter={formRowGutter}>
              <fields.Person
                useForm={mainForm}
                setPerson={setPerson}
                defaultValue={initialPersonnelId}
                disabled={!isNew}
              />
              <fields.Committee
                items={committeeList}
                defaultValue={4}
                disabled={true}
              />
              <fields.Position
                secretaryExists={theSecretary}
                disabled={!isPositionEditable}
                onChange={onPositionChange}
              />
              <fields.StartDate
                useForm={mainForm}
                disabled={
                  (!!!theSecretary &&
                    mainForm.getFieldValue("position") ===
                      committeeMemberPosition.SECRETARY) ||
                  (!isNew &&
                    theSecretary &&
                    theSecretary.personnel_id === person?.id) ||
                  (isNew && !!!theSecretary)
                }
              />
              <fields.FinishDate useForm={mainForm} />
              <SubmitBtn loading={loading} />
            </Row>
          </Spin>
        </Form>
      </AppCard>
    </>
  );
}

export default CommitteeMemberForm;
