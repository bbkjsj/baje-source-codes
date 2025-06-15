import React from "react";
import {
  ADD_SUBORDINATE,
  DELETE_FAMILY,
  DELETE_SUBORDINATE,
  SWAP_FAMILY,
  UPDATE_SUBORDINATE,
} from "../../utils/api";
import { message, Modal } from "antd";
import { permission } from "json/Permission";
import {
  getLink,
  convertDateToEN,
  dateToJalali,
  convertDateToISO8601,
  handleValidateNationalNumber,
} from "_helpers";
import TableActions from "components/general/TableActions";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { showMessage } from "utils/message";
import { pageNames } from "constant";
import axios from "api/appAxios";
import {
  InsuranceNumberInput,
  QuitDateInput,
  QuitReasonSelect,
} from "./components/FormItems";

export const persianTranslator = (text) => {
  switch (text) {
    case "doughter":
      return "دختر";
    case "son":
      return "پسر";
    case "spouse":
      return "همسر";
    case "mother":
      return "مادر";
    case "father":
      return "پدر";
    case "fatherInLaw":
      return "پدر همسر";
    case "motherInLaw":
      return "مادر همسر";
    case "dependant":
      return "تحت تکفل";
    case "independant":
      return "غیر تحت تکفل";
    case "brother":
      return "برادر (تنی)";
    case "brotherSameFather":
      return "برادر (از پدر مشترک)";
    case "brotherSameMother":
      return "برادر (از مادر مشترک)";
    case "sisterSameFather":
      return "خواهر (از پدر مشترک)";
    case "sisterSameMother":
      return "خواهر (از مادر مشترک)";
    case "sister":
      return "خواهر (تنی)";
    case "quit":
      return "خروج از تکفل";
    case "unknown":
      return "نامشخص";
    case "legal_age":
      return "سن قانونی";
    case "death":
      return "فوت";
    case "marriage":
      return "ازدواج";
    case "dependant_to_other":
      return "تکفل سایرین";
    case "other":
      return "سایر";
    default:
      return text;
  }
};

const { EDIT_PERSON, DELETE_PERSON } = permission;
//
export const columns = ({
  setLoading,
  editingKey,
  getList,
  history,
  form,
  setEditingKey,
  getMainPerson,
  setData,
  mainRecord,
  subordinates,
  setPersonModal,
  quitReason,
  relation,
  setNewPayloadData,
  setFamilyData,
  familyData,
  newMemberFamilyData,
  setNewMemberFamilyData,
  setDiscrepancyModal,
  familyMembers,
  setChooseMotherModal,
  setChooseChildrenModal,
}) => {
  //

  const isEditing = (record) => record.key === editingKey;

  const handleDelete = (record) => {
    if (record.relation === "father" || record.relation === "mother") {
      Modal.error({
        content: "پدر یا مادر خانواده را نمی‌توان حذف کرد.",
      });
      return;
    }

    setLoading(true);
    DELETE_FAMILY({
      personnelId: mainRecord.id,
      relativeId: record.id,
    })
      .then((res) => {
        setLoading(false);
        message.success("با موفقیت انجام شد");
        getList();
        getMainPerson();
      })
      .catch((err) => {
        if (
          err?.response?.data?.message ===
          "Person is either father or mother of a family and could not be deleted."
        ) {
          Modal.error({
            content: "پدر یا مادر خانواده را نمی‌توان حذف کرد.",
          });
        }
        setLoading(false);
      });
  };

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  // const PrepareDataToSever = (row) => {
  //   return {
  //     national_code: row.nationalCode,
  //     relation: row.relation,
  //     dependencyStatus: row.dependencyStatus,
  //     insurance_number: row.insurance_number,
  //     quit_reason: row.quit_reason,
  //     dependencyQuitDate: row.dependencyQuitDate,
  //   };
  // };

  function validateNid(nid) {
    return axios
      .get("/api/admin/personnel/lookup/" + form.getFieldValue("nationalCode"))
      .then((res) => {})
      .catch((err) => {
        if (
          err?.response?.data === "کد ملی وارد شده در سامانه ثبت نشده است" &&
          handleValidateNationalNumber(form.getFieldValue("nationalCode"))
        ) {
          Modal.confirm({
            content:
              ".کد ملی وارد شده در سامانه یافت نشد، لطفا ابتدا به نام نویسی فرد مورد نظر اقدام فرمایید",
            okText: "تایید و نام نویسی",
            cancelText: "انصراف",
            onOk: () => setPersonModal(true),
          });
        }
      });
  }

  const addHandler = async (update) => {
    try {
      await form.validateFields();
      const payload = form.getFieldsValue();
      const validate = await validateNid();
      const relation = payload.relation;

      const body = {
        relation: payload.relation,
        personnelNationalId: mainRecord.national_number,
        sameFather:
          relation === "brother" ||
          relation === "sister" ||
          relation.includes("SameFather")
            ? true
            : false,
        sameMother:
          relation === "brother" ||
          relation === "sister" ||
          relation.includes("SameMother")
            ? true
            : false,
        [payload?.relation + "NationalId"]: familyData.national_number,
      };
      if (body.nationalCode) delete body.nationalCode;
      if (body.dependencyQuitDate) {
        body.dependencyQuitDate = convertDateToISO8601(body.dependencyQuitDate);
      }

      // handle different parents
      if (
        relation === "brotherSameFather" ||
        relation === "brotherSameMother"
      ) {
        body.relation = "brother";
      } else if (
        relation === "sisterSameFather" ||
        relation === "sisterSameMother"
      ) {
        body.relation = "sister";
      }

      if (body?.brotherSameFatherNationalId) {
        body.brotherNationalId = body?.brotherSameFatherNationalId;
        delete body.brotherSameFatherNationalId;
      }

      if (body?.brotherSameMotherNationalId) {
        body.brotherNationalId = body?.brotherSameMotherNationalId;
        delete body.brotherSameMotherNationalId;
      }

      if (body?.sisterSameFatherNationalId) {
        body.sisterNationalId = body?.sisterSameFatherNationalId;
        delete body.sisterSameFatherNationalId;
      }

      if (body?.sisterSameMotherNationalId) {
        body.sisterNationalId = body?.sisterSameMotherNationalId;
        delete body.sisterSameMotherNationalId;
      }

      // handle if child has mother
      const spouses = familyMembers?.length
        ? familyMembers.filter((i) => i.relation === "spouse")
        : null;

      if (
        (body.relation === "son" || body.relation === "doughter") &&
        // newMemberFamilyData?.mother &&
        spouses?.length
      ) {
        Modal.warn({
          content: `برای این فرد همسر ثبت شده است، لطفاً یکی از همسران را به عنوان والد فرزند انتخاب نمایید.`,
          onOk: () => {
            setNewPayloadData({
              body,
              spouses,
              validateNamesAndSubmit,
              mainRecord,
            });
            setChooseMotherModal(true);
          },
        });

        return;
      }

      // handle if has children and is adding a new spouse
      const children = familyMembers?.length
        ? familyMembers.filter(
            (i) => i.relation === "son" || i.relation === "doughter"
          )
        : null;

      if (body.relation === "spouse" && children?.length) {
        Modal.warn({
          content: `لطفاً فرزندان مشترک ${
            mainRecord.first_name + " " + mainRecord.last_name
          } و ${
            familyData.first_name + " " + familyData.last_name
          } را انتخاب نمایید.`,
          onOk: () => {
            setNewPayloadData({
              body,
              children,
              validateNamesAndSubmit,
            });
            setChooseChildrenModal(true);
          },
        });

        return;
      }

      validateNamesAndSubmit(body, update);
    } catch (errInfo) {
      console.error(errInfo);
    }
  };

  async function validateNamesAndSubmit(body, update) {
    let valid = true;
    let lastNames = new Set(); // we use set since we need unique values
    let fatherNames = new Set();
    const secondValidationRelations = ["father", "son", "doughter"];

    // swap parent and son just to be able to add child, as not supported by backend
    const personnelNationalId = body.personnelNationalId;
    const sex = mainRecord.sex;
    if (body.relation === "son") {
      const sonNationalId = body.sonNationalId;
      body.personnelNationalId = sonNationalId;
      body[
        sex === "m" ? "fatherNationalId" : "motherNationalId"
      ] = personnelNationalId;
      body.relation = sex === "m" ? "father" : "mother";
      body.syncMother = false;
      delete body.sonNationalId;
    } else if (body.relation === "doughter") {
      const doughterNationalId = body.doughterNationalId;
      body.personnelNationalId = doughterNationalId;
      body[
        sex === "m" ? "fatherNationalId" : "motherNationalId"
      ] = personnelNationalId;
      body.relation = sex === "m" ? "father" : "mother";
      body.syncMother = false;
      delete body.doughterNationalId;
    }

    // validation 1
    // if (familyData && mainRecord) {
    //   if (body.relation === "father") {
    //     if (familyData.first_name !== mainRecord.father_name) {
    //       valid = false;
    //       fatherNames.add(familyData.first_name);
    //       fatherNames.add(mainRecord.father_name);
    //     }
    //   }

    //   // validation 2
    //   if (secondValidationRelations.includes(body.relation)) {
    //     if (familyData.last_name !== mainRecord.last_name) {
    //       valid = false;
    //       lastNames.add(familyData.last_name);
    //       lastNames.add(mainRecord.last_name);
    //     }
    //   }

    //   // validation 3
    //   if (body.relation === "son" || body.relation === "doughter") {
    //     if (familyData.father_name !== mainRecord.first_name) {
    //       valid = false;
    //       fatherNames.add(mainRecord.first_name);
    //       fatherNames.add(familyData.father_name);
    //     }
    //   }
    // }

    //   // validation 4
    // if (
    //   (body.relation === "brother" || body.relation === "sister") /* &&
    //   body.familyRelation !== "commonMother"*/
    // ) {
    //   if (familyData.father_name !== mainRecord.father_name) {
    //     valid = false;
    //     fatherNames.add(mainRecord.father_name);
    //     fatherNames.add(familyData.father_name);
    //   }
    //   if (familyData.last_name !== mainRecord.last_name) {
    //     valid = false;
    //     lastNames.add(mainRecord.last_name);
    //     lastNames.add(familyData.last_name);
    //   }
    // }

    // if valid just submit otherwise show modal and set all required data
    if (valid) {
      try {
        if (body.personnelNationalId == body?.[body?.relation + "NationalId"]) {
          console.log(
            body.personnelNationalId,
            body?.[body?.relation + "NationalId"]
          );
          Modal.error({
            content:
              "یک فرد نمی تواند عضو خانواده خودش باشد، لطفا یک کد ملی متفاوت وارد کنید",
          });
          setLoading(false);
          return;
        }

        setLoading(true);
        console.log(body);
        const res = await ADD_SUBORDINATE(body);
        setLoading(false);
        showMessage("عملیات با موفقیت انجام شد", "success");
        setEditingKey("");
        getMainPerson();
      } catch (err) {
        setLoading(false);
        console.error("submit failed:", err);
        if (err?.response?.status == 408) {
          Modal.error({
            title: "عملیات ناموفق",
            content:
              "لطفاً ابتدا برای هر دو فرد پدر تعریف کنید، پدر هر دو فرد باید یکسان باشد",
          });
        }
      }
    } else {
      setNewPayloadData({
        body,
        lastNames: [...lastNames],
        fatherNames: [...fatherNames],
        update: update,
        editingKey,
        mainRecord,
        showMessage,
        setEditingKey,
        getMainPerson,
      });
      setDiscrepancyModal(true);
    }
  }

  function inverseSponsorship(id) {
    setLoading(true);
    Modal.confirm({
      title: "معکوس کردن تکفل",
      content: "آیا از معکوس کردن تکفل اطمینان دارید؟",
      onOk: () => {
        SWAP_FAMILY({
          personnelId: id,
          parentId: mainRecord.id,
        })
          .then((res) => {
            setLoading(false);
            message.success("با موفقیت انجام شد");
            getList();
            getMainPerson();
          })
          .catch((err) => {
            setLoading(false);
          });
      },
    });
  }

  const save = (record) => {
    record.id ? addHandler(true) : addHandler(false);
  };

  const generateIcons = (record) => {
    const iconlist = [
      // {
      //   name: "edit",
      //   onClick: () => edit(record),
      //   permission: EDIT_PERSON,
      // },
      {
        name: "delete",
        onClick: record.id
          ? () => handleDelete(record)
          : () => setData((prev) => prev.slice(0, prev.length - 1)),
        permission: DELETE_PERSON,
      },
    ];
    if (record.id) {
      iconlist.push({
        name: "detail",
        onClick: () =>
          history.push(
            `${getLink(
              pageNames.personnel.realPerson.view,
              record.id
            )}?target=4`
          ),
      });
    }

    return iconlist;
  };

  const initialColumns = [
    {
      title: "ردیف",
      dataIndex: "",
      key: "",
      width: 30,
      render: (text, record, index) => <>{index + 1}</>,
    },
    {
      title: "کد ملی",
      dataIndex: "nationalCode",
      key: "nationalCode",
      editable: true,
      width: 120,
    },
    {
      title: "نام",
      dataIndex: "firstName",
      key: "firstName",
      editable: false,
      width: 100,
      render: (text, record) => record.firstName || "__",
    },
    {
      title: "نام خانوادگی",
      dataIndex: "lastName",
      key: "lastName",
      editable: false,
      width: 100,
      render: (text, record) => record.lastName || "__",
    },
    // {
    //   title: " نام پدر",
    //   dataIndex: "fatherName",
    //   key: "fatherName",
    //   editable: false,
    //   width: 100,
    // },
    {
      title: "نسبت",
      dataIndex: "relation",
      key: "relation",
      editable: true,
      width: 100,
      render: (text) => persianTranslator(text),
    },
    // {
    //   title: "شماره شماسنامه",
    //   dataIndex: "national_number",
    //   key: "national_number",
    //   editable: false,
    //   width: 140,
    // },
    // {
    //   title: "تاریخ تولد",
    //   dataIndex: "birth_day",
    //   key: "birth_day",
    //   editable: false,
    //   width: 200,
    // },
    // {
    //   title: "محل صدور",
    //   dataIndex: "birth_day_place",
    //   key: "birth_day_place",
    //   editable: false,
    //   width: 100,
    // },
    // {
    //   title: "وضعیت تکفل",
    //   dataIndex: "dependencyStatus",
    //   key: "dependencyStatus",
    //   editable: true,
    //   width: 120,
    //   render: (text) => persianTranslator(text),
    // },
    {
      title: "شماره بیمه",
      dataIndex: "insuranceNumber",
      key: "insuranceNumber",
      width: 120,
      render: (text, record) => {
        const editable = isEditing(record);

        return editable &&
          form.getFieldValue("dependencyStatus") === "independant" ? (
          <InsuranceNumberInput defaultValue={text} />
        ) : (
          text || "__"
        );
      },
    },
    // {
    //   title: "علت خروج از تکفل",
    //   dataIndex: "dependencyQuitReason",
    //   key: "dependencyQuitReason",
    //   width: 120,
    //   render: (text, record) => {
    //     const editable = isEditing(record);

    //     return editable && form.getFieldValue("dependencyStatus") === "quit" ? (
    //       <QuitReasonSelect />
    //     ) : record.dependencyStatus === "quit" ? (
    //       persianTranslator(text)
    //     ) : (
    //       <span className="text-gray">__</span>
    //     );
    //   },
    // },
    // {
    //   title: "تاریخ خروج از تکفل",
    //   dataIndex: "dependencyQuitDate",
    //   key: "dependencyQuitDate",
    //   width: 120,
    //   render: (text, record) => {
    //     const editable = isEditing(record);

    //     return editable && form.getFieldValue("dependencyStatus") === "quit" ? (
    //       <QuitDateInput form={form} quitReason={quitReason} />
    //     ) : record.dependencyStatus === "quit" ? (
    //       record?.dependencyQuitDate ? (
    //         dateToJalali(record?.dependencyQuitDate)
    //       ) : (
    //         "نامشخص"
    //       )
    //     ) : (
    //       <span className="text-gray">__</span>
    //     );
    //   },
    // },
    {
      title: "تنظیمات",
      dataIndex: "operation",
      width: 120,
      render: (_, record) => {
        const editable = isEditing(record);

        return editable ? (
          <TableActions
            list={[
              {
                name: "save",
                tooltip: "ثبت",
                onClick: () => save(record),
                icon: <SaveOutlined />,
                variant: "success",
              },
              {
                name: "cancel",
                tooltip: "انصراف",
                onClick: cancel,
                icon: <CloseOutlined />,
                variant: "danger",
              },
              // {
              //   name: "inverse",
              //   onClick: () => inverseSponsorship(record.id),
              //   children: "معکوس کردن تکفل",
              //   hide:
              //     form.getFieldValue("dependencyStatus") !== "dependant" ||
              //     !record.id,
              //   fullWidth: true,
              // },
            ]}
            record={record}
            contractKey="contract_id"
          />
        ) : (
          <TableActions
            list={generateIcons(record)}
            record={record}
            contractKey="contract_id"
          />
        );
      },
    },
  ];
  const mergedColumns = initialColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === "relation" || col.dataIndex === "dependencyStatus"
            ? "select"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        form,
        mainRecord,
        subordinates,
        setPersonModal,
        relation,
        setFamilyData,
        familyData,
        newMemberFamilyData,
        setNewMemberFamilyData,
        familyMembers,
        setData,
      }),
    };
  });

  return mergedColumns;
};
