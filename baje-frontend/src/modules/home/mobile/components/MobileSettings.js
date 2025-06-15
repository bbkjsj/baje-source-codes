import React, { useState } from "react";
import { Row } from "antd";
import ShortcutItem from "./ShortcutItem";
import {
  IdcardOutlined,
  PhoneOutlined,
  CreditCardOutlined,
  LaptopOutlined,
  PaperClipOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { getLink } from "_helpers";
import { pageNames } from "constant";
import useWhoAmI from "hooks/useWhoAmI";
import UserInfoModal from "pages/persons/realPerson/list/UserInfoModal";
import { additionalTypes } from "pages/persons/realPerson/constant";

const MobileSettings = () => {
  const rowProps = {
    justify: "center",
    style: { alignItems: "baseline", marginTop: "16px", rowGap: "16px" },
  };
  const iconClass = "text-primary";
  const history = useHistory();
  const { id } = useWhoAmI();

  const [additionalInfoModal, setAdditionalInfoModal] = useState(null);

  return (
    <>
      <Row {...rowProps}>
        <ShortcutItem
          icon={<IdcardOutlined className={iconClass} />}
          title="اطلاعات هویتی"
          onClick={() =>
            history.push(getLink(pageNames.personnel.realPerson.edit, id))
          }
        />
        <ShortcutItem
          icon={<PhoneOutlined className={iconClass} />}
          title="اطلاعات تماس"
          onClick={() => setAdditionalInfoModal(additionalTypes.CONTACT)}
        />
        <ShortcutItem
          icon={<CreditCardOutlined className={iconClass} />}
          title="حسابهای بانکی"
          onClick={() => setAdditionalInfoModal(additionalTypes.BANK_ACCOUNTS)}
        />
        <ShortcutItem
          icon={<LaptopOutlined className={iconClass} />}
          title="اطلاعات کاربری"
          onClick={() => setAdditionalInfoModal(additionalTypes.USER_ACCOUNT)}
        />
        <ShortcutItem
          icon={<PaperClipOutlined className={iconClass} />}
          title="اطلاعات متفرقه"
          onClick={() => setAdditionalInfoModal(additionalTypes.OTHER_INFO)}
        />
        <ShortcutItem
          icon={<CameraOutlined className={iconClass} />}
          title="اسکن اسناد"
          onClick={() => setAdditionalInfoModal(additionalTypes.DOCUMENTS)}
        />
      </Row>

      <UserInfoModal
        additionalInfoModal={additionalInfoModal}
        setAdditionalInfoModal={setAdditionalInfoModal}
        userID={id}
      />
    </>
  );
};

export default MobileSettings;
