import { Button, Form, Input, message, Modal, Space, Spin } from "antd";
import AppButton from "components/general/AppButton";
import React, { useEffect, useState } from "react";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { countOfNumInp } from "_helpers";
import {
  addPermissionPrerequisites,
  getPermissionPrerequisites,
} from "../utils/api";

const RequiredPermissionsModal = ({
  onCancel,
  permissionId,
  permissionsList,
  visible,
}) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codeNames, setCodeNames] = useState({});
  const [form] = Form.useForm();
  const [currPermissions, setCurrPermissions] = useState([]);

  // get required codes of this permission
  useEffect(() => {
    setLoading(true);
    form.resetFields();

    getPermissionPrerequisites(permissionId)
      .then((res) => {
        if (res?.data?.length && permissionsList?.length) {
          const findCodes = permissionsList.filter((perm) =>
            res.data.includes(perm.id)
          );
          const toCodes = findCodes.map((perm) => perm.code);
          form.setFieldsValue({ codes: toCodes });
          setCurrPermissions(toCodes);
        }
      })
      .finally(() => setLoading(false));
  }, [permissionId, form, permissionsList]);

  // set code names
  useEffect(() => {
    if (permissionsList?.length) {
      const newCodeNames = {};

      for (let permission of permissionsList) {
        if (permission.code && permission.label) {
          newCodeNames[String(permission.code)] =
            permission.module + " - " + permission.label;
        }
      }

      setCodeNames(newCodeNames);
    }
  }, [permissionsList]);

  const handleOnFinish = (vals) => {
    if (!vals?.codes?.length) {
      Modal.warning({
        content: "لطفا کدهای دسترسی را اضافه نمایید",
        okText: "تایید",
        closable: true,
      });
    } else {
      let allValid = true;
      for (let i of vals.codes) {
        if (!codeNames[i]) {
          allValid = false;
          break;
        }
      }
      if (allValid) {
        const codes = vals.codes.map((i) => Number(i));
        // check if there are any new permissions, if so, ask the user to add new required permissions to the users who had this permission
        const isAnyNewPermissions = codes.some(
          (code) => !currPermissions.includes(code)
        );

        if (isAnyNewPermissions) {
          Modal.confirm({
            content:
              "با توجه به تعریف دسترسی پیش نیاز جدید، آیا مایلید برای تمامی دارندگان این دسترسی، دسترسی جدید نیز ایجاد شود؟",
            okText: "بله",
            cancelText: "خیر",
            onOk: () => postCodes(codes, true),
            onCancel: () => postCodes(codes, false),
          });
        } else {
          postCodes(codes, false);
        }
      } else {
        Modal.warning({
          content: "لطفا کد دسترسی های معتبر وارد نمایید",
          okText: "تایید",
          closable: true,
        });
      }
    }
  };

  const postCodes = (codes, createPrequisiteForUsers) => {
    setBtnLoading(true);

    const prerequisiteIds = permissionsList.filter((perm) =>
      codes.includes(perm.code)
    );

    const ids = prerequisiteIds.map((perm) => perm.id);

    const body = {
      accessCode: permissionId,
      prerequisiteIds: ids,
      createPrequisiteForUsers,
    };

    addPermissionPrerequisites(body)
      .then(() => {
        message.success("با موفقیت انجام شد");
        onCancel();
      })
      .finally(() => setBtnLoading(false));
  };

  // check if the new added permission has any required permissions and prompt the user to add those permissions
  const handleCodesInputChange = (e) => {
    const val = e.target.value;

    if (val.length === 5) {
      setCodeNames({
        ...codeNames,
      });

      // check if code is valid and new
      const currPerms = form.getFieldValue("codes");

      if (codeNames[val]) {
        setLoading(true);
        getPermissionPrerequisites(Number(val))
          .then((res) => {
            let requiredList = permissionsList.filter((perm) =>
              res.data.includes(perm.id)
            );
            requiredList = requiredList.map((perm) => perm.code);

            if (requiredList.length) {
              // check if these permissions don't already exist
              const newRequiredPerms = requiredList.filter(
                (i) => !currPerms.includes(String(i))
              );

              if (newRequiredPerms.length) {
                Modal.confirm({
                  title: "این دسترسی دارای پیش نیاز است",
                  content:
                    "این دسترسی، دارای دسترسی های پیش نیاز است که آن ها نیز الزاماً می بایست اضافه گردند.",
                  cancelText: "انصراف",
                  okText: "تایید",
                  onOk: () => {
                    const uniqueCodes = [
                      ...new Set([...newRequiredPerms, ...currPerms]),
                    ];
                    form.setFieldsValue({
                      codes: uniqueCodes,
                    });
                  },
                });
              }
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };

  return (
    <div className="codes-modal">
      <Spin spinning={loading}>
        <p className="mb-4">
          لطفاً کد دسترسی های پیش نیاز برای دسترسی انتخاب شده را وارد نمایید
        </p>

        <Form
          name="dynamic_form_nest_item"
          form={form}
          onFinish={handleOnFinish}
          autoComplete="off"
          labelCol={{
            xs: { span: 24 },
            sm: { span: 24 },
          }}
        >
          <Form.List name="codes">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }, idx) => {
                  return (
                    <div>
                      <Space
                        style={{ display: "flex", marginBottom: 0 }}
                        key={key}
                        align="center"
                      >
                        <Form.Item
                          {...restField}
                          name={[name]}
                          fieldKey={[fieldKey]}
                          label="کد دسترسی (5 رقمی)"
                          rules={[
                            {
                              required: true,
                              message: "لطفا کد دسترسی را وارد کنید",
                            },
                          ]}
                          normalize={(value, prevValue) =>
                            countOfNumInp(value, prevValue, 5)
                          }
                        >
                          <Input
                            type="number"
                            placeholder="کد دسترسی"
                            onChange={handleCodesInputChange}
                          />
                        </Form.Item>
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          className="mt-3"
                        />

                        <p className="text-13 mt-3 mr-3">
                          {codeNames[
                            String(form.getFieldValue("codes")[idx])
                          ] || ""}
                        </p>
                      </Space>
                    </div>
                  );
                })}

                <Button
                  type="primary"
                  shape="circle"
                  className="mt-2"
                  onClick={add}
                  icon={<PlusOutlined />}
                  size="large"
                />
              </>
            )}
          </Form.List>

          <div className="flex mt-4">
            <AppButton
              className="big-btn"
              variant="primary"
              size="large"
              loading={btnLoading}
              htmlType="submit"
              disabled={btnLoading}
            >
              تایید
            </AppButton>
            <AppButton
              className="big-btn mr-1"
              size="large"
              variant="text"
              onClick={() => onCancel()}
              disabled={btnLoading}
            >
              انصراف
            </AppButton>
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default RequiredPermissionsModal;
