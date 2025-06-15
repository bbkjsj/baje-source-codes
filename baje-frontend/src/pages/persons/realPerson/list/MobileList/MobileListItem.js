import React from "react";
import { Checkbox, Collapse, Dropdown, Menu, Modal } from "antd";
import styled from "styled-components";
import colors from "utils/colors";
import { covetFormatDateToFA, getLink } from "_helpers";
import { Link, useHistory } from "react-router-dom";
import ChevronWhite from "assets/images/icons/chevron-down-white.svg";
import { pageNames } from "constant";
import { permission } from "json/Permission";
import TableActions from "components/general/TableActions";
import AppButton from "components/general/AppButton";
import { DownOutlined } from "@ant-design/icons";
import { CheckAccess } from "AuxComponent/CheckAccess";
import { additionalTypes } from "../../constant";
const { EDIT_PERSON, DELETE_PERSON, SOCIAL_INSURANCE_REPORT } = permission;

const { Panel } = Collapse;

const MobileListItem = ({
  data,
  idx,
  onClick,
  noCollapse,
  handleDelete,
  onSelectedChange,
  selected,
  onDisplayUserModal,
  setUserID,
  setFamilyModal,
  noActions,
  onChoose,
}) => {
  const history = useHistory();

  //-------------- static --------------//
  const tableData = [
    { title: "ردیف", value: idx + 1 },
    { title: "نام پدر", value: data?.father_name },
    { title: "شماره شناسنامه", value: data?.id_number },
    // {
    //   title: "تاریخ تولد",
    //   value: data?.birth_date ? covetFormatDateToFA(data?.birth_date) : null,
    // },
    // { title: "نام شرکت", value: data?.company_name },
    // { title: "پروژه", value: data?.contract_subject },
  ];

  if (!noActions) {
    tableData.push({ title: "موبایل", value: data?.mobile1 });
    tableData.push({ title: "شماره بیمه", value: data?.insurance_number });
  }

  const itemActions = [
    {
      name: "ویرایش",
      onClick: () =>
        history.push(getLink(pageNames.personnel.realPerson.edit, data.id)),
      permission: EDIT_PERSON,
    },
    {
      name: "حذف",
      onClick: () => {
        Modal.confirm({
          onOk: () => handleDelete([data.id]),
          content: "آیا از حذف این فرد اطمینان دارید؟",
        });
      },
      permission: DELETE_PERSON,
    },
    {
      onClick: () => {
        history.push(getLink(pageNames.permissions.person.list, data.id));
      },
      name: "دسترسی ها",
    },
    {
      name: "گزارش بیمه تامین اجتماعی",
      onClick: () =>
        history.push(
          getLink(pageNames.personnel.insurance.tamin.personnelReport, data.id)
        ),
      permission: SOCIAL_INSURANCE_REPORT,
    },
    {
      name: "سوابق بیمه تکمیلی",
      onClick: () => {
        history.push(
          getLink(
            pageNames.personnel.insurance.supplymentary.personnel.history,
            {
              id: data?.id,
              personName: data?.first_name + " " + data?.last_name,
            }
          )
        );
      },
    },
    {
      name: "اختصاص شغل و رزومه",
      onClick: () => {
        history.push(
          getLink(pageNames.personnel.realPerson.resume.list, data.id)
        );
      },
    },
    {
      name: "اختصاص شیفت",
      onClick: () => {
        history.push(
          getLink(pageNames.personnel.realPerson.assignShift, {
            id: data.id,
          }),
          data.id
        );
      },
    },

    {
      onClick: () => {
        onDisplayUserModal(additionalTypes.CONTACT, data?.id);
      },
      name: "اطلاعات تماس ",
      id: "contactInfo",
      disabled: selected?.length !== 1,
    },
    {
      onClick: () => {
        onDisplayUserModal(additionalTypes.BANK_ACCOUNTS, data?.id);
      },
      name: "حساب های بانکی",
      id: "bankInfo",
      disabled: selected?.length !== 1,
    },
    {
      onClick: () => {
        onDisplayUserModal(additionalTypes.DOCUMENTS, data?.id);
      },
      name: "اسناد",
      id: "documents",
      disabled: selected?.length !== 1,
    },
    // {
    //   onClick: () => {
    //     onDisplayUserModal(additionalTypes.ACCESS_LEVEL, data?.id);
    //   },
    //   name: "دسترسی ها",
    //   id: "accessList",
    //   disabled: selected.length !== 1,
    // },
    {
      onClick: () => {
        onDisplayUserModal(additionalTypes.USER_ACCOUNT, data?.id);
      },
      name: "اطلاعات کاربری",
      id: "USER_ACCOUNT",
      disabled: selected?.length !== 1,
    },
    {
      onClick: () => {
        onDisplayUserModal(additionalTypes.INSURANCE_INFO, data?.id);
      },
      name: "اطلاعات بیمه",
      id: "INSURANCE_INFO",
      disabled: selected?.length !== 1,
    },
    {
      onClick: () => {
        onDisplayUserModal(additionalTypes.OTHER_INFO, data?.id);
      },
      name: "متفرقه",
      id: "OTHER_INFO",
      disabled: selected?.length !== 1,
    },
    {
      onClick: () => {
        history.push(
          getLink(pageNames.personnel.realPerson.subordinate.list, data.id)
        );
      },
      name: "افرادتبعی",
      id: "SUBORDINATES",
      disabled: selected?.length !== 1,
    },
    {
      name: "خانواده",
      onClick: () => {
        setUserID(data.id);
        setFamilyModal(true);
      },
    },
    {
      name: "دریافت فیش حقوقی",
      onClick: () => {},
    },
    // {
    //   name: "استعلام از ثبت احوال",
    //   onClick: () => {},
    // },
  ];

  //-------------- functions --------------//
  function handleChecked(e) {
    if (e.target.checked) {
      onSelectedChange([...selected, data]);
    } else {
      const spliced = selected.filter((i) => i.id != data.id);
      onSelectedChange(spliced);
    }
  }

  //-------------- template --------------//
  const menu = noActions ? (
    ""
  ) : (
    <Menu>
      {itemActions.map((i, idx) => {
        const item = (
          <Menu.Item key={idx} onClick={i.onClick}>
            {i.name}
          </Menu.Item>
        );

        if (i.permission) {
          return <CheckAccess permission={i.permission}>{item}</CheckAccess>;
        }

        return item;
      })}
    </Menu>
  );

  return (
    <StyledCollapse
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {selected && (
        <Checkbox
          checked={selected?.length && selected.find((i) => i.id == data.id)}
          //disabled={selected.length > 1}
          onChange={handleChecked}
        ></Checkbox>
      )}
      <Collapse
        bordered={false}
        className="custom-collapse"
        collapsible={!noCollapse}
        expandIcon={(state) =>
          !noCollapse ? (
            <img
              src={ChevronWhite}
              style={{
                transform: state.isActive ? "rotate(180deg)" : "none",
              }}
              alt="بیشتر"
              width="11"
            />
          ) : (
            ""
          )
        }
      >
        <Panel
          header={
            <div className="m-0 text-white flex">
              <h4 className="mobileitem-title text-white mb-0 text-12">
                {data?.first_name + " " + data?.last_name}
              </h4>
              <h4 className="mobileitem-date text-white mb-0 text-12">
                {data?.national_number || data?.national_code}
              </h4>
            </div>
          }
          className="custom-collapse-panel"
        >
          {!noCollapse && (
            <>
              <table className="sub-items w-100">
                <colgroup>
                  <col span="1" style={{ width: "35%" }} />
                  <col span="1" style={{ width: "65%" }} />
                </colgroup>

                <thead className="d-none">
                  <tr className="d-none">
                    <th>عنوان</th>
                    <th>مقدار</th>
                  </tr>
                </thead>

                <tbody>
                  {tableData.map((item, idx) => (
                    <MobileListSubItem
                      key={idx}
                      title={item.title}
                      value={item.value || "-"}
                    />
                  ))}
                </tbody>
              </table>
              <div className="flex insurance-item-btns">
                {/* <TableActions
                  list={generateIcons(data)}
                  record={data.id}
                  contractKey="contract_id"
                /> */}

                {noActions ? (
                  <AppButton
                    className="people-btn"
                    onClick={() => onChoose(data.national_number)}
                    style={{ borderRadius: "4px !important" }}
                  >
                    انتخاب
                  </AppButton>
                ) : (
                  <Link
                    to={getLink(pageNames.personnel.realPerson.view, data.id)}
                  >
                    <AppButton className="people-btn">مشاهده</AppButton>
                  </Link>
                )}
                {noActions ? (
                  ""
                ) : (
                  <Dropdown overlay={menu} trigger={["click"]}>
                    <AppButton className="people-btn">
                      گزینه ها <DownOutlined />
                    </AppButton>
                  </Dropdown>
                )}
              </div>
            </>
          )}
        </Panel>
      </Collapse>
    </StyledCollapse>
  );
};

//-------------- sub components --------------//
const MobileListSubItem = ({ title, value, background }) => {
  return (
    <StyledSubItem
      className="mobileitem-subitem"
      style={{ backgroundColor: background || "auto" }}
    >
      <td>{title}</td>
      <td className="text-mid-black">{value}</td>
    </StyledSubItem>
  );
};

//-------------- styles --------------//
const StyledCollapse = styled.div`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  .custom-collapse {
    flex-grow: 1;
    border: none;
    .ant-collapse-header,
    .custom-collapse-panel {
      border-radius: 4px !important;
      border: none;
      color: white;
    }

    .ant-collapse-content {
      background-color: white;
      color: black;
      border: none;
    }

    .ant-collapse-content-box {
      padding: 0 !important;
    }

    .ant-collapse-header {
      width: 100%;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      padding-left: 20px !important;
      padding-right: 20px !important;
      background: ${colors.primary};

      .ant-collapse-arrow {
        position: static;
        margin-right: auto;
        padding-top: 0px;
        color: white;
      }

      .mobileitem-title {
        border-left: 1px solid rgba(255, 255, 255, 0.35);
        padding-left: 8px;
      }
      .mobileitem-date {
        padding-right: 8px;
      }
    }

    .links-list {
      li:not(:last-of-type) {
        margin-bottom: 10px;
      }
    }
    .people-btn {
      height: 44px;
      font-size: 14px;
    }

    .actions-container {
      background-color: #f5f5f5;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      border: 1px solid #ececec;
      border-top: none;
    }
  }

  .ant-checkbox-wrapper {
    margin-left: 8px;
    margin-top: 10px;
  }

  .insurance-item-btns {
    a {
      flex: 1 0 50%;
      .people-btn {
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        width: 100%;
      }
    }
    & > .people-btn {
      flex: 1 0 50%;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }
  }
`;

const StyledSubItem = styled.tr`
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.09);
  border-top: none;

  h4 {
    font-weight: 500;
    margin-bottom: 0px;
  }
  &:nth-of-type(even) {
    background-color: rgba(0, 0, 0, 0.04);
  }

  td {
    padding: 10px 16px;
    padding-bottom: 8px;
  }
`;

export default MobileListItem;
