import { Col, Input, Spin } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { getChecklist, getChecklists } from "modules/hse/api/checklist";
import { getVehicles, searchPerson } from "modules/hse/api/genraal";

import AppButton from "components/general/AppButton";
import AppFormItem from "components/general/AppFormItem";
import { AuditContext } from "./context";
import { CloseOutlined } from "@ant-design/icons";
import MachineSearchModal from "./../../../../../components/MachineAdvancedSearchModal/index";
import { constant } from "modules/hse/constant";
import { getExclusiveQuesitons } from "modules/hse/api/audit";
import { parse } from "query-string";
import { showMessage } from "utils/message";
import useIsMobile from "hooks/useIsMobile";
import { useLocation } from "react-router-dom";

const Existency = ({ form }) => {
  const { search } = useLocation();
  const [state, setState] = useState({
    searchContent: "",
    loading: false,
    searchModal: false,
  });
  const {
    setState: setParentState,
    state: parentState,
    toggleSelectQuestion,
  } = useContext(AuditContext);

  const handleChangeSearch = ({ target }) => {
    setState((s) => ({ ...s, searchContent: target.value }));
  };

  const isMobile = useIsMobile();

  useEffect(() => {
    if (!search) return;
    const { organization_code } = parse(search);
    if (!organization_code) return;
    setParentState((s) => ({ ...s, group: constant.vehicle }));
    form.setFields([{ name: "group", value: constant.vehicle }]);
    setTimeout(() => {
      setState((s) => ({ ...s, searchContent: organization_code }));
      handleSearchVehicle(organization_code);
    }, 50);
  }, [search]);

  useEffect(() => {
    if (state.searchContent.length === 10) handleSearch();
  }, [state.searchContent]);

  const handleSearchVehicle = async (params) => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const { data } = await getVehicles({
        organization_code: params || state.searchContent,
      });

      if (!data[0]) return showMessage("ماشینی یافت نشد", "error");
      const {
        data: { exclusiveQuestions },
      } = await getExclusiveQuesitons({ vehicleId: data[0].id });
      const { data: checkLists } = await getChecklists();

      const selectedChecklist = checkLists.find(
        (item) =>
          item.vehicle_type_id_fk === data[0].type_id_fk && item.enable === 1
      );

      if (!selectedChecklist)
        return showMessage(
          "برای این ممیزی شونده تا کنون چک لیستی در سامانه تعریف نشده است، لطفاً با مدیر ایمنی تماس حاصل فرمایید.",
          "error"
        );
      if (selectedChecklist) {
        const { data: checklistDetail } = await getChecklist(selectedChecklist);

        showMessage("سوالات با موفقیت بارگزاری شد.", "success");
        return setParentState((s) => ({
          ...s,
          selectedQuestions: [
            ...checklistDetail.questions.map((item) => ({
              ...item,
              id: item.questionId,
            })),
            ...exclusiveQuestions.map((item) => ({
              ...item,
              id: item.question_id,
            })),
          ],
          minimumPoint: checklistDetail.checklist.minimum_point,
          existency: data[0],
        }));
      }
      if (exclusiveQuestions.length > 0)
        setParentState((s) => ({
          ...s,
          selectedQuestions: exclusiveQuestions.map((item) => ({
            ...item,
            id: item.question_id,
          })),
          minimumPoint: 0,
          existency: data[0],
        }));
      else
        setParentState((s) => ({
          ...s,
          existency: data[0],
        }));
    } catch (error) {
      console.log(error.message);
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  };

  const handleSearchPersonel = async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const { data } = await searchPerson({
        nationalNumber: state.searchContent,
      });
      if (!data.list[0]) return showMessage("کاربری یافت نشد", "error");
      const {
        data: { exclusiveQuestions },
      } = await getExclusiveQuesitons({ personnelId: data.list[0].id });
      console.log(exclusiveQuestions);
      if (exclusiveQuestions.length > 0)
        toggleSelectQuestion(
          exclusiveQuestions.map((item) => ({
            ...item,
            id: item.question_id,
          }))
        );
      setTimeout(() => {
        setParentState((s) => ({ ...s, existency: data.list[0] }));
      }, 20);
    } catch (error) {
      console.log(error.message);
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  };

  const handleSearch = (params) => {
    if (!state.searchContent && !params)
      return showMessage("مقداری برای جستجو وارد نکرده اید", "error");

    if (parentState.group === constant.inidividual) handleSearchPersonel();
    if (parentState.group === constant.vehicle) handleSearchVehicle();
  };

  // search machine after machine search modal is closed
  useEffect(() => {
    if (state.searchModal === false && state.searchContent.length) {
      handleSearch();
    }
  }, [state.searchModal]);

  const removeExistency = () => {
    setParentState((s) => ({
      ...s,
      existency: {},
      selectedQuestions: [],
      minimumPoint: 0,
    }));
    setTimeout(() => {
      setState((s) => ({ ...s, searchContent: "" }));
    }, 20);
  };

  const openMachineSearchModal = () => {
    if (parentState.group === constant.vehicle) {
      setState((s) => ({ ...s, searchModal: true }));
    }
  };

  function handleSubmit() {
    if (parentState.group === constant.vehicle) {
      if (!parentState.existency.id && state.searchContent) {
        handleSearch();
      } else {
        openMachineSearchModal();
      }
    } else {
      !parentState.existency.id ? handleSearch() : removeExistency();
    }
  }

  return (
    <>
      <Col md={8} sm={24} className="w-xs-100">
        <AppFormItem name="search" label={!isMobile && "ممیزی شونده"}>
          <div className="flex">
            <Input
              placeholder={
                parentState.group === constant.inidividual
                  ? "جستجو با شماره ملی"
                  : parentState.group === constant.vehicle
                  ? "جستجو ماشین با کد کارگاهی"
                  : isMobile
                  ? "ممیزی شونده"
                  : ""
              }
              onChange={handleChangeSearch}
              disabled={!parentState.group || parentState.existency.id}
              prefix={
                state.loading ? (
                  <Spin />
                ) : (
                  <CloseOutlined
                    style={{ color: "red", fontSize: 10 }}
                    onClick={() => {
                      handleChangeSearch({ target: { value: "" } });
                    }}
                  />
                )
              }
              value={
                parentState.existency.id
                  ? parentState.group === constant.inidividual
                    ? parentState.existency.first_name +
                      "" +
                      parentState.existency.last_name
                    : parentState.group === constant.vehicle
                    ? ""
                    : null
                  : state.searchContent
              }
              className="text-xs-center"
            />
            <AppButton onClick={handleSubmit} style={{ height: "40px" }}>
              {parentState.existency.id
                ? "تغییر"
                : state.searchContent
                ? "بررسی"
                : "جستجو"}
            </AppButton>
          </div>
        </AppFormItem>
      </Col>
      {parentState.group === constant.vehicle && (
        <MachineSearchModal
          visible={state.searchModal}
          handleCancel={() => setState((s) => ({ ...s, searchModal: false }))}
          onChoose={(item) => {
            setState((s) => ({
              ...s,
              searchContent: item.organizationCode,
              searchModal: false,
            }));
          }}
        />
      )}
    </>
  );
};

export default Existency;
