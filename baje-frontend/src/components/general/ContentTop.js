import React from "react";
import { Breadcrumb } from "antd";
import styled from "styled-components";
import { Link } from "react-router-dom";
import bp from "../../utils/breakpoints";
import PropTypes from "prop-types";

/**

 *
 * @param {object} params - params of component
 * @param {string} params.title - title of component. title can be page Name
 * @param {Array<{link:string,text:string}>} params.breadcrumbItems - array of breadcrumbs item. link is optional
 * @param {boolean} params.noBack - no back boolean
 *
 * @returns
 */

const ContentTop = ({ title, breadcrumbItems, noBack, className }) => {
  const getBreadCrumbItems = () => {
    let breadItems = [];

    if (
      breadcrumbItems &&
      Array.isArray(breadcrumbItems) &&
      breadcrumbItems.length
    ) {
      breadItems = breadcrumbItems.map((i, idx) =>
        i.link ? (
          <Breadcrumb.Item key={"bi" + idx}>
            <Link to={i.link}>{i.text}</Link>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item key={"bi" + idx}>{i.text}</Breadcrumb.Item>
        )
      );
    }
    return breadItems;
  };

  return (
    <div
      className={`flex-wrap align-center mb-4 ${
        !noBack ? "pr-6" : ""
      } ${className}`}
    >
      <PageTitle className="text-hight-black text-16 font-peyda">
        {title}
      </PageTitle>

      {getBreadCrumbItems() && (
        <StyledBreadcrumb className="mr-md-3 mt-3 mt-md-0">
          {getBreadCrumbItems()}
        </StyledBreadcrumb>
      )}
    </div>
  );
};

// types
ContentTop.propTypes = {
  title: PropTypes.string,
  breadcrumbItems: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string,
      text: PropTypes.string,
    })
  ),
  noBack: PropTypes.bool,
};

// css
const StyledBreadcrumb = styled(Breadcrumb)`
  font-size: 11px;
`;

const PageTitle = styled.span`
  @media (max-width: ${bp.md}) {
    display: block;
    width: 100%;
  }
`;

export default ContentTop;
