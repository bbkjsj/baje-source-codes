import React, { useState, useEffect } from "react";
import { Form, Row, Button, message, Modal } from "antd";
import GoBackBtn from "components/GoBackBtn";
import { getContractList } from "../utils/index";
import ContentTop from "components/general/ContentTop";
import SubmitBtn from "components/general/SubmitBtn";
import { formItemLayout, formRowGutter, pageNames } from "constant";
import { useSelector } from "react-redux";
import { ADD_GROUP_MACHINE } from "../utils/api";
import * as FormItem from "./formItems";

const MachineAddGroup = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [contractList, setContractList] = useState([]);
  const currentOffice = useSelector((state) => state.currentOffice);

  const error = () => {
    console.log("مشکلی پیش آمده است");
  };

  useEffect(() => {
    form.setFieldsValue({ contract_id: null });
    if (currentOffice) {
      getContractList(currentOffice, setContractList, error);
    }
  }, [currentOffice]);

  const onFinish = (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", values.excel_file[0]["originFileObj"]);
    formData.append("id", values.contract_id);
    ADD_GROUP_MACHINE(formData)
      .then((res) => {
        setLoading(false);
        form.resetFields();
        Modal.success({
          content: `از تعداد : ${res.data.total} ردیف ، ${res.data.success} ردیف وارد سیستم شد.`,
        });
      })
      .catch((error) => {
        if (error.response) {
          setLoading(false);
          message.error(error?.response?.data);
        }
      });
  };

  return (
    <div>
      <GoBackBtn />
      <ContentTop
        title="ثبت اطلاعات گروهی ماشین آلات"
        breadcrumbItems={[
          {
            text: "ماشین آلات",
            link: pageNames.machinery.list,
          },
          { text: "ثبت اطلاعات گروهی ماشین آلات" },
        ]}
      />

      <Button
        href="/machine.xlsx"
        style={{ marginBottom: "10px", width: "200px" }}
      >
        فایل نمونه
      </Button>
      <Form form={form} {...formItemLayout} onFinish={onFinish}>
        <Row gutter={formRowGutter}>
          <FormItem.ExcelUploader />
          <FormItem.Contract options={contractList} />

          <SubmitBtn loading={loading} />
        </Row>
      </Form>
    </div>
  );
};

export default MachineAddGroup;
