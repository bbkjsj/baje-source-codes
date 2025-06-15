import { Modal, Radio, Spin } from "antd";
import AppButton from "components/general/AppButton";
import {
  ADD_SUBORDINATE,
  UPDATE_SUBORDINATE,
} from "pages/persons/realPerson/utils/api";
import React, { useEffect, useState } from "react";

const NameDiscrepancyModal = ({ onFinish, payload, familyData }) => {
  const [radioOptionsLast, setRadioOptionsLast] = useState([
    { label: "هر دو را بدون تغییر ثبت کن", value: "unchanged" },
  ]);
  const [radioOptionsFather, setRadioOptionsFather] = useState([
    { label: "هر دو را بدون تغییر ثبت کن", value: "unchanged" },
  ]);
  const [radioValueLast, setRadioValueLast] = useState("unchanged");
  const [radioValueFather, setRadioValueFather] = useState("unchanged");
  const [loading, setLoading] = useState(false);

  const {
    body,
    update,
    editingKey,
    mainRecord,
    showMessage,
    setEditingKey,
    getMainPerson,
    lastNames,
    fatherNames,
  } = payload;

  useEffect(() => {
    if (lastNames.length) {
      const lastOptions = lastNames.map((i) => ({ label: i, value: i }));
      setRadioOptionsLast((curr) => [...curr, ...lastOptions]);
    }
    if (fatherNames.length) {
      const fatherOptions = fatherNames.map((i) => ({ label: i, value: i }));
      setRadioOptionsFather((curr) => [...curr, ...fatherOptions]);
    }
  }, []);

  async function submit() {
    if (radioValueLast) {
      try {
        const newBody = { ...body };
        if (radioValueLast !== "unchanged") {
          newBody.lastName = radioValueLast;
        }
        if (radioValueFather !== "unchanged") {
          newBody.fatherName = radioValueFather;
        }

        // if (newBody.personnelId === newBody.parentId) {
        //   Modal.error({
        //     content:
        //       "یک فرد نمی تواند عضو خانواده خودش باشد، لطفا یک کد ملی متفاوت وارد کنید",
        //   });
        //   setLoading(false);
        //   return;
        // }
        console.log(newBody);

        // setLoading(true);
        // const res = await ADD_SUBORDINATE(newBody);
        // showMessage("عملیات با موفقیت انجام شد", "success");
        // onFinish();
        // setEditingKey("");
        // getMainPerson();
        // setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err?.response?.status == 408) {
          Modal.warn({
            title: "خطا",
            content: "لطفاً ابتدا برای هر دو فرد پدر یکسان تعریف نمایید",
          });
        }
      }
    } else {
      Modal.warn({ content: "لطفا یکی از گزینه ها را انتخاب نمایید" });
    }
  }

  return (
    <Spin spinning={loading}>
      <div>
        {radioOptionsLast.length > 1 ? (
          <>
            <strong className="d-block">
              نام خانوادگی فرد اصلی و عضو خانواده مغایرت دارد، لطفا نام خانوادگی
              مورد نظر برای ثبت را انتخاب نمایید
            </strong>
            <Radio.Group
              options={radioOptionsLast}
              value={radioValueLast}
              onChange={(e) => setRadioValueLast(e.target.value)}
              className="mt-2 mb-3"
            />
          </>
        ) : (
          ""
        )}

        {radioOptionsFather.length > 1 ? (
          <>
            <strong className="d-block">
              نام پدر مغایرت دارد، لطفا نام پدر مورد نظر را انتخاب کنید
            </strong>
            <Radio.Group
              options={radioOptionsFather}
              value={radioValueFather}
              onChange={(e) => setRadioValueFather(e.target.value)}
              className="mt-2 mb-3"
            />
          </>
        ) : (
          ""
        )}
        <AppButton variant="primary" onClick={submit} className="mt-1 mr-auto">
          تایید و ثبت
        </AppButton>
      </div>
    </Spin>
  );
};

export default NameDiscrepancyModal;
