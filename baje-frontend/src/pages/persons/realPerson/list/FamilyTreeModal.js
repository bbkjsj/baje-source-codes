import React, { useEffect, useState, useRef } from "react";
import { Divider, Modal, notification, Spin } from "antd";
import { useParams } from "react-router-dom";
import OrgChart from "modules/personnel/orgCharts/components/OrgChart/OrgChart";
import { GET_FAMILY } from "../utils/api";
import { persianTranslator } from "./NestedTable/columns";

function FamilyTreeModal({ userId, visible, setFamilyModal }) {
  const [loading, setLoading] = useState(false);
  const routeParams = useParams();
  const orgchart = useRef();
  const [chartData, setChartData] = useState();

  useEffect(() => {
    async function fetchData() {
      if (userId) {
        try {
          setLoading(true);
          const res = await GET_FAMILY(userId);

          setLoading(false);
          if (res) {
            const data = res.data;
            if (data) {
              if (data.familyMembers && data.familyMembers.length) {
                const chartDetails = generateChartDetailsView({
                  id: -1,
                  title:
                    data?.personnel?.firstName + " " + data?.personnel.lastName,
                  familyMembers: data.familyMembers,
                });
                setChartData(chartDetails);
              }
            }
          }
        } catch (err) {
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [userId]);

  return (
    <Modal
      visible={visible}
      title="خانواده"
      onCancel={() => setFamilyModal(0)}
      footer={null}
      width={"80%"}
    >
      <Spin spinning={loading}>
        {!loading ? (
          <>
            {chartData ? (
              <OrgChart datasource={chartData} orgchart={orgchart} viewMode />
            ) : (
              <h4 className="text-center mt-4">
                این فرد فاقد درخت خانواده است
              </h4>
            )}
          </>
        ) : (
          ""
        )}
      </Spin>
    </Modal>
  );
}

// generate chart data for the chart
export function generateChartDetailsView(chData) {
  const data = {
    id: chData.id,
    root: true,
    job: [chData.title, chData.id],
  };

  data.children = getNodeChildrenView(chData.familyMembers);

  return data;
}

// get node children recursively
function getNodeChildrenView(children) {
  if (children) {
    return children.map((child) => {
      if (child.familyMembers) {
        return {
          id: child.personnel.id,
          root: false,
          job: [
            persianTranslator(child.relation) +
              ": " +
              child.personnel.firstName +
              " " +
              child.personnel.lastName,
            child.personnel.id,
          ],
          children: getNodeChildrenView(child.familyMembers),
        };
      } else {
        return {
          id: child.id,
          root: false,
          job: [
            persianTranslator(child.relation) +
              ": " +
              child.personnel.firstName +
              " " +
              child.personnel.lastName,
            child.personnel.id,
          ],
        };
      }
    });
  }
}

export default FamilyTreeModal;
