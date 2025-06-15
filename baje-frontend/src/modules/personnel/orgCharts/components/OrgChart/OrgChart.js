import React, { useEffect, useRef, useState } from "react";
import OrganizationChart from "@dabeng/react-orgchart";
import JSONDigger from "json-digger";
import { v4 as uuidv4 } from "uuid";
import AppButton from "components/general/AppButton";
import { Divider, Input, message, Space, Modal } from "antd";
import CustomNode from "./CustomNode";
import styled from "styled-components";
import colors from "utils/colors";
import { addChildNode, deleteChartNode, updateNode } from "../../common/api";

const EditChart = ({
  orgchart,
  datasource,
  job,
  peopleCount,
  insuranceCode,
  updating,
  onAddRoot,
  onAdd,
  onRemoveRoot,
  onSetDs,
  viewMode,
  onEdit,
  onRemove,
  setLoading,
  print,
}) => {
  const [ds, setDS] = useState(datasource);
  const dsDigger = new JSONDigger(ds, "id", "children");
  const [selectedNodes, setSelectedNodes] = useState(new Set());
  const [newNodes, setNewNodes] = useState([
    { job: "", peopleCount: "", insuranceCode: "" },
  ]);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isMultipleSelect, setIsMultipleSelect] = useState(false);

  // update new nodes on form fields change
  useEffect(() => {
    const newNewNodes = [{}];
    newNewNodes[0].job = job;
    newNewNodes[0].peopleCount = peopleCount;
    newNewNodes[0].insuranceCode = insuranceCode;
    setNewNodes(newNewNodes);
  }, [job, peopleCount, insuranceCode]);

  // update initial dataset
  useEffect(() => {
    setDS(datasource);
    if (!viewMode) {
      onSetDs(datasource);
    }
  }, [datasource]);

  const readSelectedNode = (nodeData) => {
    if (isMultipleSelect) {
      setSelectedNodes((prev) => new Set(prev.add(nodeData)));
    } else {
      setSelectedNodes(new Set([nodeData]));
    }
  };

  const clearSelectedNode = () => {
    setSelectedNodes(new Set());
  };

  const getNewNodes = (insertId) => {
    const nodes = [];
    for (const node of newNodes) {
      nodes.push({ ...node, id: insertId || uuidv4() });
    }
    return nodes;
  };

  const addChildNodes = async () => {
    //console.log("selected node:", [...selectedNodes][0]);

    if (
      !newNodes[0].job ||
      !newNodes[0].insuranceCode ||
      !newNodes[0].peopleCount.length
    ) {
      Modal.warn({ content: "لطفا همه ی ورودی ها را کامل کنید" });
    } else {
      try {
        let insertId = null;
        if (updating) {
          setLoading(true);
          const response = await addChildNode(
            {
              title: job[0],
              count: Number(peopleCount),
              jobs_tamin_code_id_fk: insuranceCode,
            },
            [...selectedNodes][0].id
          );
          setLoading(false);
          message.success("با موفقیت اضافه شد");
          insertId = response?.data?.raw?.insertId;
          console.log("insertId:", insertId);
        }
        await dsDigger.addChildren(
          [...selectedNodes][0].id,
          getNewNodes(insertId)
        );
        setDS({ ...dsDigger.ds });
        onSetDs({ ...dsDigger.ds });
        onAdd(getNewNodes()[0]);
        setNewNodes([{ job: "", peopleCount: "", insuranceCode: "" }]);
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    }
  };

  const editNode = async () => {
    if (
      !newNodes[0].job ||
      !newNodes[0].insuranceCode ||
      !newNodes[0].peopleCount.length
    ) {
      Modal.warn({ content: "لطفا همه ی ورودی ها را کامل کنید" });
    } else {
      try {
        if (updating) {
          setLoading(true);
          await updateNode(
            {
              title: job[0],
              count: Number(peopleCount),
              jobs_tamin_code_id_fk: insuranceCode,
            },
            [...selectedNodes][0].id
          );
          setLoading(false);
          message.success("با موفقیت ویرایش شد");
        }
        await dsDigger.updateNodes(
          [...selectedNodes].map((node) => node.id),
          {
            id: uuidv4(),
            job,
            peopleCount,
            insuranceCode,
          }
        );
        setDS({ ...dsDigger.ds });

        onSetDs({ ...dsDigger.ds });
        onEdit(getNewNodes()[0]);
        setNewNodes([{ job: "", peopleCount: "", insuranceCode: "" }]);
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    }
  };

  const addRootNode = () => {
    // dsDigger.addRoot(getNewNodes()[0]);
    // setDS({ ...dsDigger.ds });
    if (
      !newNodes[0].job ||
      !newNodes[0].insuranceCode ||
      !newNodes[0].peopleCount.length
    ) {
      Modal.warn({ content: "لطفا همه ی ورودی ها را کامل کنید" });
    } else {
      onAddRoot(newNodes[0]);
      onAdd();
      setNewNodes([{ job: "", peopleCount: "", insuranceCode: "" }]);
    }
  };

  const remove = async () => {
    if (![...selectedNodes][0].root) {
      try {
        if (updating) {
          setLoading(true);
          await deleteChartNode([...selectedNodes][0].id);
          setLoading(false);
          message.success("با موفقیت حذف شد");
        }
        await dsDigger.removeNodes([...selectedNodes].map((node) => node.id));
        setDS({ ...dsDigger.ds });
        onSetDs({ ...dsDigger.ds });
        setSelectedNodes(new Set());
        onRemove([...selectedNodes][0]);
      } catch (e) {
        setLoading(false);
        console.error(e);
      }
    } else {
      Modal.info({
        title: "حذف ریشه",
        content: "حذف ریشه مجاز نیست",
        centered: true,
        closable: true,
      });
      // if (!updating) {
      //   onRemoveRoot();
      // }
      //clearSelectedNode();
    }
  };

  return (
    <div className="edit-chart-wrapper">
      {!viewMode && (
        <section className="toolbar pr-2 mb-4">
          <Space className="mt-3">
            {datasource && datasource.job ? (
              <AppButton
                disabled={!Array.from(selectedNodes).length >= 1}
                onClick={addChildNodes}
              >
                افزودن
              </AppButton>
            ) : (
              <AppButton onClick={addRootNode}>افزودن به عنوان ریشه</AppButton>
            )}

            <AppButton
              disabled={!Array.from(selectedNodes).length >= 1}
              onClick={editNode}
            >
              ویرایش
            </AppButton>

            <AppButton
              disabled={!Array.from(selectedNodes).length >= 1}
              onClick={remove}
              variant="danger"
            >
              حذف
            </AppButton>
          </Space>
        </section>
      )}

      {!viewMode && (
        <Divider className="mt-4" orientation="center">
          پیش نمایش چارت
        </Divider>
      )}

      {datasource && datasource.job ? (
        <StyledChartContainer className="ltr my-5">
          {print ? (
            <AppButton
              className="big-btn mb-4 ml-2"
              size="large"
              onClick={print}
              disabled={!ds || (ds && !ds.children.length)}
            >
              پرینت
            </AppButton>
          ) : (
            ""
          )}
          <OrganizationChart
            ref={orgchart}
            NodeTemplate={CustomNode}
            chartClass="custom-org-chart"
            datasource={ds}
            collapsible={!isEditMode}
            onClickNode={!viewMode ? readSelectedNode : () => {}}
            onClickChart={clearSelectedNode}
            pan
            //zoom={viewMode}
          />
        </StyledChartContainer>
      ) : (
        <h4 className="text-center text-gray my-5">
          چارت خالی است، لطفا ریشه را اضافه کنید
        </h4>
      )}
    </div>
  );
};

// CSS
const StyledChartContainer = styled.section`
  overflow: hidden;

  .orgchart.custom-org-chart {
    background-image: linear-gradient(
      90deg,
      rgba(33, 90, 136, 0) 10%,
      rgba(0, 0, 0, 0) 10%
    ) !important;

    width: 100%;
    height: 100%;
    display: grid;
    justify-content: center;
  }

  .orgchart.custom-org-chart > ul > li > ul li::before {
    border-top-color: #215a88;
  }

  .orgchart.custom-org-chart > ul > li > ul li .oc-node::before,
  .orgchart.custom-org-chart ul li .oc-node:not(:only-child)::after {
    background-color: #215a88;
  }

  .orgchart.custom-org-chart .oc-node .position {
    box-sizing: border-box;
    background-color: white;
    border: 2px solid ${colors.primary} !important;
    border-radius: 10px;
    color: ${colors["primary-dark"]};
    width: fit-content;
    padding: 14px;
  }

  .orgchart-container {
    overflow: hidden;
  }
`;

export default EditChart;
