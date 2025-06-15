import React from "react";
import { Descriptions, Spin } from "antd";
import styled from "styled-components";
import LoadingLogo from "components/general/LoadingLogo";

const DetailDescription = ({ items, loading }) => {
  let descriptionItems;
  let change = false;
  let include = null;
  if (items && items.length) {
    descriptionItems = items.map((i, idx) => {
      if (i.label === "کد شغل") {
        i.label = "عنوان شغل";
      }
      if (i.label === "مزایای مشمول") {
        include = (
          <Descriptions.Item key={"detail-" + idx} label={i.label}>
            {i.value || "-"}
          </Descriptions.Item>
        );
        change = true;
        return null;
      }
      if (change) {
        change = false;
        return (
          <>
            <Descriptions.Item key={"detail-" + idx} label={i.label}>
              {i.value || "-"}
            </Descriptions.Item>
            {include}
          </>
        );
      }
      return (
        <Descriptions.Item key={"detail-" + idx} label={i.label}>
          {i.value || "-"}
        </Descriptions.Item>
      );
    });
  }

  if (loading) return <LoadingLogo />;

  return (
    <Spin spinning={loading}>
      <DescriptionContainer>
        <Descriptions bordered={true}>{descriptionItems}</Descriptions>
      </DescriptionContainer>
    </Spin>
  );
};

const DescriptionContainer = styled.div`
  background-color: white;
  padding: 20px;
`;

export default DetailDescription;
