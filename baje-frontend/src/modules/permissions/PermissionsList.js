import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { getPermissionsList } from "./utils/api";
import Table from "./common/Table";
import ContentTop from "components/general/ContentTop";
import {
  PermissionsSectionsFarsiLabels,
  PermissionsFarsiLabels,
  baseLevels,
} from "json/Permission";
import RequiredPermissionsModal from "./common/RequiredPermissionsModal";
import PermissionJobsModal from "./common/PermissionJobsModal";

const PermissionsList = (props) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [codesModal, setCodesModal] = useState(false);
  const [jobsModal, setJobsModal] = useState(false);
  const [selectedId, setSelectedId] = useState();

  // const menuBtnList = [
  //   {
  //     url: pageNames.personnel.realPerson.mission.add,
  //     label: "ثبت ماموریت",
  //     id: "newRequest",
  //     variant: "primary",
  //     icon: <PlusOutlined />,
  //   },
  // ];

  const getList = () => {
    setLoading(true);

    getPermissionsList()
      .then((res) => {
        const permissions = res.data.map((i) => {
          const module = i.name.split("/")[0];
          const moduleFa = PermissionsSectionsFarsiLabels[module] || "-";

          return {
            realModule: module,
            module: moduleFa,
            id: i.id,
            code: i.code,
            access: i.name,
            label:
              PermissionsFarsiLabels[
                i.name.replaceAll("/", "_").replaceAll("-", "_")
              ]?.label || i.name.replaceAll("/", "_").replaceAll("-", "_"), // fallback string for finding untranslated ones
            status: i.enable,
            baseLevel: i.minimumRequiredAccessLevel,
            baseLevelLabel: baseLevels[i.minimumRequiredAccessLevel].label,
          };
        });

        setList(permissions);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedRow(selectedRowKeys);
    },
  };

  return (
    <>
      <ContentTop noBack title="دسترسی ها" className="mt-3" />
      <div className="w-100 flex-wrap align-center mb-3">
        {/* <MenuInlineBtn list={menuBtnList} /> */}
      </div>
      <Spin spinning={loading}>
        <div className="card-container">
          {list && list.length ? (
            <Table
              data={list}
              updateList={getList}
              selectedRow={selectedRow}
              rowSelection={rowSelection}
              setLoadingList={setLoading}
              setSelectedId={setSelectedId}
              setCodesModal={setCodesModal}
              setJobsModal={setJobsModal}
            />
          ) : (
            ""
          )}
        </div>
      </Spin>

      {codesModal ? (
        <Modal
          visible={codesModal}
          onCancel={() => setCodesModal(false)}
          footer={null}
          title="کد دسترسی های پیش نیاز"
          width={720}
        >
          <RequiredPermissionsModal
            visible={codesModal}
            onCancel={() => setCodesModal(false)}
            permissionId={selectedId}
            permissionsList={list}
          />
        </Modal>
      ) : (
        ""
      )}
      {jobsModal ? (
        <Modal
          visible={jobsModal}
          onCancel={() => setJobsModal(false)}
          footer={null}
          title="مشاغل دارای دسترسی"
          width={720}
        >
          <PermissionJobsModal
            visible={jobsModal}
            onCancel={() => setJobsModal(false)}
            permCode={selectedId}
          />
        </Modal>
      ) : (
        ""
      )}
    </>
  );
};

export default PermissionsList;
