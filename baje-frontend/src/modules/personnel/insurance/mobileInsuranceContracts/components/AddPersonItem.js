import React from "react";
import styled from "styled-components";
import { Checkbox, Modal } from "antd";
import { EditFilled, LockFilled, DeleteFilled } from "@ant-design/icons";
import AppButton from "components/general/AppButton";
import { getLink } from "_helpers";
import { useParams, Link } from "react-router-dom";
import { persianRelations } from "../common/const";
import { pageNames } from "constant";

const AddPersonItem = ({
  data,
  checked,
  onCheck,
  disabled,
  onClick,
  hasDelete,
  onDelete,
  hasEdit,
}) => {
  const params = useParams();

  return (
    <StyledPersonItem
      className="flex w-100"
      checked={checked}
      disabled={disabled}
      onClick={onClick && onClick}
    >
      <Checkbox
        onChange={(e) => onCheck(data, e.target.checked)}
        checked={checked}
        disabled={disabled}
      >
        <span>{`${data.first_name + " " + data.last_name} (${
          persianRelations[data.relation] || data.relation
        })`}</span>
      </Checkbox>
      {disabled ? (
        <LockFilled className="mr-auto ml-2 text-light-black text-16" />
      ) : (
        <div className="flex mr-auto">
          {hasEdit && (
            <Link
              to={getLink(
                pageNames.personnel.insurance.supplymentary.contracts
                  .subordinate.editNew,
                { id: params.id, sub_id: data.id }
              )}
            >
              <AppButton variant="alt-primary">
                <EditFilled className="text-primary" />
              </AppButton>
            </Link>
          )}
          {/* {hasDelete && (
            <AppButton
              variant="danger"
              className="mr-1"
              onClick={() => {
                if (onDelete) {
                  Modal.confirm({
                    content: "آیا از حذف این فرد اطمینان دارید؟",
                    onOk: () => {
                      onDelete(data.id);
                    },
                  });
                }
              }}
            >
              <DeleteFilled />
            </AppButton>
          )} */}
        </div>
      )}
    </StyledPersonItem>
  );
};

// css
const StyledPersonItem = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding-left: 8px;
  padding-right: 16px;
  margin-top: 16px;
  height: 48px;
  transition: background-color 0.3s ease;
  background-color: ${(params) =>
    params.disabled
      ? "rgba(0, 0, 0, 0.04)"
      : params.checked
      ? "#E5EFF8"
      : "#ffffff"};
  button {
    font-size: 14px;
    width: 30px;
    height: 30px;
    margin-right: auto;
  }
`;

export default AddPersonItem;
