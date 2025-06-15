import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { covetFormatDateToFA, removeDuplicatesBasedOnKey } from "_helpers";
import AppTable from "components/general/AppTable";
import AppButton from "components/general/AppButton";
import LoadingLogo from "components/general/LoadingLogo";
import EditableCell from "./components/EditableCell";
import { GET_FAMILY } from "../../utils/api";
import { columns as mergedColumns } from "./columns";
import NewPersonModal from "./components/NewPersonModal";
import NameDiscrepancyModal from "./components/NameDiscrepancyModal";
import { getPersonData } from "modules/personnel/insurance/mobileInsuranceContracts/common/api";
import ChooseMotherModal from "./components/ChooseMotherModal";
import ChooseChildrenModal from "./components/ChooseChildrenModal";
import styled from "styled-components";

export default function EditableTable({ record, getList }) {
  const history = useHistory();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState("");
  const [personModal, setPersonModal] = useState(false);
  const [discrepancyModal, setDiscrepancyModal] = useState(false);
  const [chooseMotherModal, setChooseMotherModal] = useState(false);
  const [chooseChildrenModal, setChooseChildrenModal] = useState(false);
  const [quitReason, setQuitReason] = useState();
  const [relation, setRelation] = useState();
  const [newPayloadData, setNewPayloadData] = useState();
  const [familyData, setFamilyData] = useState();
  const [newMemberFamilyData, setNewMemberFamilyData] = useState();
  const [mainRecord, setMainRecord] = useState();

  //
  async function getMainPerson() {
    try {
      setLoading(true);
      const response = await getPersonData(record.id);
      setMainRecord(response.data);
      const { data } = await GET_FAMILY(record.national_number);
      let convertedData = [];

      for (let key in data) {
        if (
          key === "children" ||
          key === "sisters" ||
          key === "brothers" ||
          key === "spouse"
        ) {
          if (data[key]?.length) {
            for (let child of data[key]) {
              let relation = child?.relation;

              if (
                relation === "brother" &&
                child.sameFather &&
                !child.sameMother
              ) {
                relation = "brotherSameFather";
              }
              if (
                relation === "brother" &&
                !child.sameFather &&
                child.sameMother
              ) {
                relation = "brotherSameMother";
              }
              if (
                relation === "sister" &&
                child.sameFather &&
                !child.sameMother
              ) {
                relation = "sisterSameFather";
              }
              if (
                relation === "sister" &&
                !child.sameFather &&
                child.sameMother
              ) {
                relation = "sisterSameMother";
              }

              convertedData.push({
                ...child,
                id: child?.id || child?.nationalId,
                nationalCode: child?.nationalId,
                key: child?.nationalId,
                relation,
              });
            }
          }
        } else if (key !== "person") {
          if (data[key]?.firstName) {
            convertedData.push({
              ...data[key],
              id: data[key]?.id || data[key]?.nationalId,
              nationalCode: data[key]?.nationalId,
              key: data[key]?.nationalId,
            });
          }
        }
      }

      convertedData = removeDuplicatesBasedOnKey(convertedData, "nationalId");

      console.log("converted:", convertedData);

      setData(convertedData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }
  const addNewRow = () => {
    form.resetFields();
    const key = data.length;
    const newRecord = {
      key,
      nationalCode: "",
      relation: "",
      dependencyStatus: "",
      firstName: "",
      lastName: "",
      insuranceNumber: "",
    };
    const newData = [...data, newRecord];

    // setFamilyData();
    setData(newData);
    setEditingKey(key);
  };

  useEffect(() => {
    getMainPerson();
  }, []);

  if (loading) {
    return <LoadingLogo />;
  }

  return (
    <>
      <StyledContainer>
        <div className="flex align-center ">
          <AppButton
            onClick={addNewRow}
            size="small"
            className="ml-2"
            tooltip="افزودن"
            variant="primary"
          >
            <PlusOutlined />
            <p className="mr-1">افزودن عضو خانواده</p>
          </AppButton>

          <span></span>
        </div>
        <Form
          form={form}
          component={false}
          onFieldsChange={(changed) => {
            if (changed.length) {
              if (changed[0].name[0] === "dependencyQuitReason") {
                setQuitReason(changed[0].value);
              }
              if (changed[0].name[0] === "relation") {
                setRelation(changed[0].value);
              }
            }
          }}
        >
          {mainRecord ? (
            <AppTable
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={data}
              columns={mergedColumns({
                setLoading,
                editingKey,
                getList,
                history,
                form,
                setEditingKey,
                getMainPerson,
                setData,
                mainRecord,
                subordinates: data,
                setPersonModal,
                quitReason,
                relation,
                setNewPayloadData,
                setFamilyData,
                newMemberFamilyData,
                setNewMemberFamilyData,
                familyData,
                setDiscrepancyModal,
                setChooseMotherModal,
                setChooseChildrenModal,
                familyMembers: data,
              })}
              rowClassName="editable-row"
              footer={null}
              pagination={true}
            />
          ) : (
            ""
          )}
        </Form>
      </StyledContainer>
      {personModal ? (
        <Modal
          visible={personModal}
          onCancel={() => setPersonModal(false)}
          footer={null}
          title="فرد حقیقی جدید"
          width={960}
        >
          <NewPersonModal
            onFinish={(nid) => {
              form.setFieldsValue({ nationalCode: nid });
              setPersonModal(false);
            }}
            form={form}
          />
        </Modal>
      ) : (
        ""
      )}

      {discrepancyModal ? (
        <Modal
          visible={discrepancyModal}
          footer={null}
          title="مغایرت ها"
          closable
          onCancel={() => setDiscrepancyModal(false)}
        >
          <NameDiscrepancyModal
            onFinish={() => setDiscrepancyModal(false)}
            payload={newPayloadData}
            familyData={familyData}
          />
        </Modal>
      ) : (
        ""
      )}

      {chooseMotherModal ? (
        <Modal
          visible={chooseMotherModal}
          footer={null}
          title={`انتخاب ${mainRecord.sex === "f" ? "پدر" : "مادر"} برای فرزند`}
          closable
          onCancel={() => setChooseMotherModal(false)}
        >
          <ChooseMotherModal
            onFinish={() => setChooseMotherModal(false)}
            payload={newPayloadData}
            familyData={familyData}
            getMainPerson={getMainPerson}
            setEditingKey={setEditingKey}
          />
        </Modal>
      ) : (
        ""
      )}

      {chooseChildrenModal ? (
        <Modal
          visible={chooseChildrenModal}
          footer={null}
          title="انتخاب فرزندان مشترک"
          closable
          onCancel={() => setChooseChildrenModal(false)}
        >
          <ChooseChildrenModal
            onFinish={() => setChooseChildrenModal(false)}
            payload={newPayloadData}
            familyData={familyData}
          />
        </Modal>
      ) : (
        ""
      )}
    </>
  );
}

const StyledContainer = styled.div`
  padding: 10px 20px;
  .ant-table-thead > tr > th {
    background-color: rgba(46, 125, 50, 0.1);
  }
`;
