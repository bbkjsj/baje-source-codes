import React, { useEffect, useState } from "react";
import PermissionsForm from "./PermissionsForm";
import CompanySelector from "./CompanySelector";
import { getInitialPermissions } from "../../utils/index";
import { Form } from "antd";
import { formItemLayout } from "constant";
import LoadingLogo from "components/general/LoadingLogo";
import SubmitBtn from "components/general/SubmitBtn";
import { UPDATE_USER_PERMISSION } from "../../utils/api";
import { showMessage } from "utils/message";
import { PermissionsFarsiLabels } from "json/Permission";

export default function AccessLevelsForm({ visible, ID, setVisible }) {
  const [form] = Form.useForm();
  const [showPermissions, setShowPermissions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [staticPermissions, setStaticPermissions] = useState([]);
  const [totalAccess, setTotalAccess] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState();
  const [selectedContract, setSelectedContract] = useState();

  const submitForm = async (values) => {
    try {
      setLoading(true);
      const permissionEnums = Object.values(PermissionsFarsiLabels).map(
        (x) => x.value
      );

      const payload = totalAccess
        .filter((el) => el.companyId)
        .map((perm) => ({
          ...perm,
          access: perm.access.filter((acc) => permissionEnums.includes(acc)),
        }));

      // remove null accesses
      if (payload.length) {
        payload.forEach((item) => {
          item.access = item.access.filter(
            (i) => i && i !== null && i !== "null"
          );
        });
      }

      const res = await UPDATE_USER_PERMISSION(ID, payload);
      setLoading(false);
      showMessage("عملیات با موفقیت انجام شد", "success");

      setVisible(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInitialPermissions(setLoading, setTotalAccess, setStaticPermissions, ID);
  }, [ID]);

  if (loading) {
    return <LoadingLogo />;
  }

  return (
    <Form form={form} onFinish={submitForm} {...formItemLayout}>
      <CompanySelector
        setShowPermissions={setShowPermissions}
        totalAccess={totalAccess}
        setLoading={setLoading}
        form={form}
        selectedOffice={selectedOffice}
        setSelectedOffice={setSelectedOffice}
        selectedContract={selectedContract}
        setSelectedContract={setSelectedContract}
      />
      {showPermissions && (
        <PermissionsForm
          staticPermissions={staticPermissions}
          totalAccess={totalAccess}
          setTotalAccess={setTotalAccess}
          loading={loading}
          form={form}
        />
      )}
      {showPermissions && <SubmitBtn />}
    </Form>
  );
}
