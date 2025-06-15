import React from "react";

const CustomNode = ({ nodeData }) => {
  const selectNode = () => {
    console.log("Node Data:", nodeData);
  };

  return (
    <div
      onClick={selectNode}
      title={nodeData.peopleCount ? `تعداد افراد: ${nodeData.peopleCount}` : ""}
    >
      <div className="position">{nodeData.job ? nodeData.job[0] : "-"}</div>
    </div>
  );
};

export default CustomNode;
