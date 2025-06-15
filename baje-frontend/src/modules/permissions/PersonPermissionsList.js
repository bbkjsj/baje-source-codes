import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { getPermissionsList, getUserPermissions } from "./utils/api";
import Table from "./common/Table";
import ContentTop from "components/general/ContentTop";
import {
  PermissionsSectionsFarsiLabels,
  PermissionsFarsiLabels,
  baseLevels,
} from "json/Permission";
import { pageNames } from "constant";
import { getLink } from "_helpers";
import { PlusOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import MenuInlineBtn from "components/MenuInlineBtn";
import { GET_USER } from "modules/personnel/realPerson/users/utils/api";
import PersonTable from "./common/PersonTable";
import GoBackBtn from "components/GoBackBtn";
import EditModal from "./common/EditModal";

const PersonPermissionsList = (props) => {
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [person, setPerson] = useState();
  const [editModal, setEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [permissionList, setPermissionList] = useState([]);

  const menuBtnList = [
    {
      url: getLink(pageNames.permissions.person.add, params?.id),
      label: "دسترسی جدید",
      id: "newRequest",
      variant: "primary",
      icon: <PlusOutlined />,
    },
  ];

  const getPerson = () => {
    if (params.id && params.id !== "all") {
      GET_USER(params.id).then((res) => {
        setPerson(res.data);
      });
    }
  };

  const getList = () => {
    setLoading(true);
    getUserPermissions(params.id)
      .then((res) => {
        const permissions = res.data.map((i) => {
          const module = i.access.split("/")[0];
          const moduleFa = PermissionsSectionsFarsiLabels[module] || "-";

          return {
            realModule: module,
            module: moduleFa,
            label:
              PermissionsFarsiLabels[
                i.access.replaceAll("/", "_").replaceAll("-", "_")
              ]?.label || i.access.replaceAll("/", "_").replaceAll("-", "_"), // fallback string for finding untranslated ones
            ...i,
          };
        });

        setList(permissions);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getPermissionList = () => {
    getPermissionsList().then((res) => {
      const permissions = res.data.map((i) => {
        const module = i.name.split("/")[0];
        const moduleFa = PermissionsSectionsFarsiLabels[module] || "-";

        return {
          realModule: module,
          module: moduleFa,
          id: i.code,
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

      setPermissionList(permissions);
    });
  };

  useEffect(() => {
    getPerson();
    getList();
    getPermissionList();
  }, []);

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedRow(selectedRowKeys);
    },
  };

  return (
    <>
      <Spin spinning={loading}>
        <GoBackBtn />
        <ContentTop
          title={
            person?.first_name
              ? `دسترسی های ${person?.first_name + " " + person?.last_name}`
              : "دسترسی همه افراد"
          }
          className="mt-3"
        />
        {params.id !== "all" && (
          <div className="w-100 flex-wrap align-center mb-3">
            <MenuInlineBtn list={menuBtnList} />
          </div>
        )}

        <div className="card-container">
          <PersonTable
            data={list}
            updateList={getList}
            selectedRow={selectedRow}
            rowSelection={rowSelection}
            setLoadingList={setLoading}
            setSelectedId={setSelectedId}
            setEditModal={setEditModal}
          />
        </div>
      </Spin>

      {editModal ? (
        <Modal
          visible={editModal}
          onCancel={() => setEditModal(false)}
          footer={null}
          title="ویرایش"
          width={400}
        >
          <EditModal
            visible={editModal}
            onCancel={() => setEditModal(false)}
            permissionId={selectedId}
            updateList={getList}
          />
        </Modal>
      ) : (
        ""
      )}
    </>
  );
};

export default PersonPermissionsList;
