import React, { useEffect, useState, useRef } from "react";
import { Divider, notification, Spin } from "antd";
import GoBackBtn from "components/GoBackBtn";
import { useParams } from "react-router-dom";
import DetailDescription from "components/DetailDescription";
import { convertIdToCode, priceNormalizer, timeToFa } from "_helpers";
import ContentTop from "components/general/ContentTop";
import { useSelector } from "react-redux";
import OrgChart from "modules/personnel/orgCharts/components/OrgChart/OrgChart";
import { _GET_ITEM } from "./utils/api";
import { getOccupiedTitle } from "./utils/utils";

function EnvironmentView({ updating, view }) {
  const [loading, setLoading] = useState(false);
  const [detailItems, setDetailItems] = useState();
  const routeParams = useParams();
  const orgchart = useRef();
  const [chartData, setChartData] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await _GET_ITEM(routeParams.id);

        setLoading(false);
        if (res) {
          const data = res.data;
          if (data) {
            setDetailItems([
              { label: "کد یکتا", value: convertIdToCode(data.id) },
              {
                label: "نام شرکت",
                value: data.companyName,
              },
              {
                label: "نام محیط",
                value: data.title,
              },
              {
                label: "کاربری محیط",
                value: data.usageTitle || "وابسطه به زیر محیط ها",
              },
              {
                label: "وضعیت",
                value: data.parentId == -1 ? "محیط" : "محاط",
              },
              {
                label: "وضعیت تصرف",
                value: getOccupiedTitle(data.occupiedStatus),
              },
            ]);

            if (data.nodes && data.nodes.length) {
              const chartDetails = generateChartDetailsView({
                id: -1,
                title: data.title || "محیط",
                nodes: data.nodes,
              });
              setChartData(chartDetails);
            }
          }
        }
      } catch (err) {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="مشاهده محیط"
        className="mt-3"
        breadcrumbItems={[{ text: "محیط ها" }]}
      />
      <Spin spinning={loading}>
        <DetailDescription items={detailItems} loading={false} />

        {!loading ? (
          <>
            <Divider>چارت محیط</Divider>

            {chartData ? (
              <OrgChart datasource={chartData} orgchart={orgchart} viewMode />
            ) : (
              <h4 className="text-center mt-4">این محیط فاقد زیر محیط است</h4>
            )}
          </>
        ) : (
          ""
        )}
      </Spin>
    </>
  );
}

// generate chart data for the chart
export function generateChartDetailsView(chData) {
  const data = {
    id: chData.id,
    root: true,
    job: [chData.title, chData.id],
  };

  data.children = getNodeChildrenView(chData.nodes);

  return data;
}

// get node children recursively
function getNodeChildrenView(children) {
  if (children) {
    return children.map((child) => {
      if (child.nodes) {
        return {
          id: child.id,
          root: false,
          job: [child.title, child.id],
          children: getNodeChildrenView(child.nodes),
        };
      } else {
        return {
          id: child.id,
          root: false,
          job: [child.title, child.id],
        };
      }
    });
  }
}

export default EnvironmentView;
