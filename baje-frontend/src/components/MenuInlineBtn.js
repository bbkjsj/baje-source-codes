import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { CheckAccess } from "AuxComponent/CheckAccess";
import AppButton from "components/general/AppButton";

/**
 *
 * @param {object} params - params of component
 * @param {Array<{hidden:boolean,icon:React.FC,disabled:boolean,
 * loading:boolean,id:string,variant:"primary",handleClick:Function,url:string,label:string, htmlType:'submit'}>} params.list - list of buttons
 * @returns
 */
const MenuInlineBtn = ({ list, handleClick, className }) => {
  const history = useHistory();
  return (
    <Wrapper className={"flex-wrap align-center " + className}>
      {list.map((el) =>
        React.isValidElement(el) ? (
          el
        ) : (
          <CheckAccess permission={el.permission} key={el.id}>
            {!el.hidden && (
              <AppButton
                icon={el.icon}
                className="mt-3 mt-lg-0"
                disabled={el.disabled}
                loading={el.loading || false}
                key={el.id}
                title={el?.title}
                variant={el.variant}
                htmlType={el.htmlType}
                onClick={() =>
                  el.handleClick ? el.handleClick() : history.push(el.url)
                }
              >
                {el.label}
              </AppButton>
            )}
          </CheckAccess>
        )
      )}
    </Wrapper>
  );
};

const Wrapper = styled("div")`
  button:not(:last-child) {
    margin-left: 8px;
  }
`;

export default MenuInlineBtn;
