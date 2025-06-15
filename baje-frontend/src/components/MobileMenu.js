import React, { useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import styled from "styled-components";
import colors from "utils/colors";
import { Collapse } from "antd";
import { Link } from "react-router-dom";

const { Panel } = Collapse;

const MobileMenu = ({ menuItems }) => {
  const [open, setOpen] = useState(false);

  return (
    <StyledMenu>
      {open && (
        <div
          className="menu-overlay fade-in"
          onClick={() => setOpen(false)}
        ></div>
      )}
      <div className="menu-inner">
        <div className="menu-toggle pointer" onClick={() => setOpen(!open)}>
          <MenuOutlined />
        </div>

        {open && (
          <div className="menu-content">
            <Collapse
              bordered={false}
              defaultActiveKey={["1"]}
              // expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              className="custom-collapse"
            >
              <Panel
                header={<h3 className="m-0 text-white">{menuItems.title}</h3>}
                className="custom-collapse-panel"
                key="1"
              >
                {menuItems.items &&
                  menuItems.items.map((item, idx) => {
                    return (
                      <Collapse defaultActiveKey={["0"]} key={idx} ghost>
                        <Panel
                          header={
                            <span className=" flex align-center">
                              <span className="text-24 pt-2 ml-1">•</span>{" "}
                              {item.title}
                            </span>
                          }
                          className="custom-collapse-panel"
                        >
                          <ul className="py-3 m-0 links-list">
                            {item.items &&
                              item.items.map((subItem, subIdx) => {
                                return (
                                  <li className="text-white" key={subIdx}>
                                    <Link to={subItem.link}>
                                      <p className="text-white">
                                        {subItem.title}
                                      </p>
                                    </Link>
                                  </li>
                                );
                              })}
                          </ul>
                        </Panel>
                      </Collapse>
                    );
                  })}
              </Panel>
            </Collapse>
          </div>
        )}
      </div>
    </StyledMenu>
  );
};

// CSS
const StyledMenu = styled.div`
  .menu-toggle {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${colors.primary};
    color: white;
  }

  .menu-overlay {
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.15);
    width: 100%;
    height: 100vh;
    z-index: 1;
  }

  .menu-content {
    background: ${colors.primary};
    width: 93%;
    box-shadow: 1px 0px 8px rgba(22, 25, 49, 0.3);
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 18px;
    transform: translateX(-50%);
    z-index: 2;
  }

  .custom-collapse {
    background: ${colors.primary};
    border: none;
    .ant-collapse-header,
    .custom-collapse-panel {
      background: ${colors.primary};
      border-radius: 4px !important;
      border: none;
      color: white;
    }

    .ant-collapse-content {
      background-color: rgba(125, 175, 221, 0.3);
      color: white;
      border: none;
    }

    .ant-collapse-content-box {
      padding: 0 !important;
    }

    .ant-collapse-header {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      padding-left: 20px !important;
      padding-right: 20px !important;

      .ant-collapse-arrow {
        position: static;
        margin-right: auto;
        padding-top: 0px;
      }
    }

    .links-list {
      li:not(:last-of-type) {
        margin-bottom: 10px;
      }
    }
  }
`;

export default MobileMenu;
