import React from "react";
import styled from "styled-components";
import { Tooltip, Popconfirm, Space } from "antd";
import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  MoreOutlined,
  FileAddFilled,
} from "@ant-design/icons";
import { CheckAccess } from "AuxComponent/CheckAccess";
import AppButton from "components/general/AppButton";
import AppDropdown from "components/general/AppDropdown";
import PropTypes, { object, objectOf } from "prop-types";
import AppPopConfirm from "./AppPopConfirm";

const CommonIcon = ({ name }) => {
  return (
    <>
      {name === "edit" ? (
        <EditFilled className="text-13" />
      ) : name === "detail" ? (
        <EyeFilled className="text-13" />
      ) : name === "file" ? (
        <FileAddFilled className="text-13" />
      ) : null}
    </>
  );
};

const VariantSelecor = (name) => {
  switch (name) {
    case "edit":
      return "alt-primary";
    case "detail":
      return "success";
    case "file":
      return "alt-primary";

    default:
      return "";
  }
};

const ToolTipSelector = (name) => {
  switch (name) {
    case "delete":
      return "حذف";
    case "edit":
      return "ویرایش";
    case "detail":
      return "جزئیات";
    case "file":
      return "آپلود فایل";

    default:
      return "";
  }
};

/**
 *
 * @param {object} params - all the component props
 * @param {Array<{name:"delete"|"edit"|"detail"|"file",onClick:function,hide:boolean,permission:string,icon:React.FC,
 * tooltip:string, warningText:string, children:string, style:object,variant:string,disabled:boolean }>} params.list - list of action ,  list.icon and list.tooltip are not necessary for common actions
 * @param {React.FC} params.moreMenu - a Menu should be displayed when more btn is clicked
 * @param {object} params.record - current record af table
 * @param {string} params.contractKey - it is the key to access contract in each record and used for check permison
 * @returns
 *
 */
const TableActions = ({ list, moreMenu, record, contractKey }) => {
  if (!list) return null;
  return (
    <StyledActions>
      {list.map((el) => {
        if (!el || el.hide) return null;
        return (
          <div key={el.name}>
            {
              <CheckAccess
                permission={el.permission}
                contract={contractKey ? record[contractKey] : null}
              >
                <Tooltip
                  title={el.tooltip ? el.tooltip : ToolTipSelector(el.name)}
                >
                  {el.name === "delete" ? (
                    <AppPopConfirm
                      title={
                        el.warningText
                          ? el.warningText
                          : "آیا برای حذف اطمینان دارید ؟"
                      }
                      onConfirm={el.onClick}
                    >
                      <AppButton
                        disabled={el.disabled}
                        icon={<DeleteFilled className="text-13" />}
                        variant="danger"
                      />
                    </AppPopConfirm>
                  ) : (
                    <AppButton
                      disabled={el.disabled}
                      style={el.style}
                      onClick={el.onClick}
                      icon={el.icon ? el.icon : <CommonIcon name={el.name} />}
                      variant={
                        el.variant ? el.variant : VariantSelecor(el.name)
                      }
                      className={el.fullWidth ? "full-width" : ""}
                    >
                      {el.children}
                    </AppButton>
                  )}
                </Tooltip>
              </CheckAccess>
            }
          </div>
        );
      })}

      {moreMenu && (
        <AppDropdown
          overlay={moreMenu}
          placement="bottomLeft"
          trigger={["click"]}
        >
          <Tooltip title="بیشتر">
            <AppButton icon={<MoreOutlined />} variant="info" />
          </Tooltip>
        </AppDropdown>
      )}
    </StyledActions>
  );
};

TableActions.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      hide: PropTypes.bool,
      permission: PropTypes.string,
      icon: PropTypes.func,
      toolTip: PropTypes.string,
      warningText: PropTypes.string,
      children: PropTypes.string,
      style: PropTypes.object,
      variant: PropTypes.string,
      fullWidth: PropTypes.bool,
    })
  ),
  moreMenu: PropTypes.func,
  record: PropTypes.object,
  contractKey: PropTypes.string,
};

// css
const StyledActions = styled(Space)`
  button {
    width: 30px;
    height: 30px;
    &.full-width {
      width: auto;
    }
  }
`;

export default TableActions;
