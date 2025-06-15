import React from "react";
import GoBackBtn from "components/GoBackBtn";
import MobileMenu from "components/MobileMenu";
import styled from "styled-components";
import colors from "utils/colors";
import { PlusOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useHistory } from "react-router";
import { pageNames } from "constant";

const MobileInsuranceHeader = ({
  title,
  showPlus,
  onPlusOk,
  hasApproved,
  onBack,
}) => {
  const handlePlusClick = () => {
    if (hasApproved) {
      Modal.confirm({
        content: "شما بیمه فعال دارید آیا از ایجاد لیست بیمه جدید مطمئنید؟",
        onOk: onPlusOk,
      });
    } else {
      onPlusOk();
    }
  };

  const history = useHistory();

  return (
    <div className="flex justify-center mb-4">
      <GoBackBtn block onClick={onBack || history.goBack} />
      <p className="mx-auto text-high-black text-center my-0 text-16">
        {title}
      </p>

      {showPlus && (
        <ActiveInsuranceBtn onClick={handlePlusClick}>
          <PlusOutlined />
        </ActiveInsuranceBtn>
      )}

      <MobileMenu
        menuItems={{
          title: "منابع انسانی",
          items: [
            {
              title: "بیمه",
              items: [
                {
                  title: "بیمه تکمیلی",
                  link: pageNames.personnel.insurance.supplymentary.list,
                },
                {
                  title: "بیمه عمر و حادثه",
                  link: pageNames.personnel.insurance.accident.list,
                },
                {
                  title: "بیمه تامین اجتماعی",
                  link: pageNames.personnel.insurance.tamin.list,
                },
                {
                  title: "بیمه های تکمیلی من",
                  link:
                    pageNames.personnel.insurance.supplymentary.contracts.list,
                },
              ],
            },
          ],
        }}
      />
    </div>
  );
};

// css
const ActiveInsuranceBtn = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.primary};
  color: white;
  margin-left: 8px;
  cursor: pointer;
`;

export default MobileInsuranceHeader;
