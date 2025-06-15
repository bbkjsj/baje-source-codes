import React, { useEffect, useState, useRef } from "react";
import { Divider, notification } from "antd";
import GoBackBtn from "components/GoBackBtn";
import { useParams } from "react-router-dom";
import DetailDescription from "components/DetailDescription";
import { convertIdToCode, priceNormalizer, timeToFa } from "_helpers";
import routes from "../routes";
import ContentTop from "components/general/ContentTop";
import { getChart } from "./common/api";
import { handleExceptions } from "./../jobs/common/api";
import OrgChart from "./components/OrgChart/OrgChart";
import { useSelector } from "react-redux";

function MemberView({ updating, view }) {
  const [loading, setLoading] = useState(false);
  const [detailItems, setDetailItems] = useState([]);
  const routeParams = useParams();
  const orgchart = useRef();
  const [chartData, setChartData] = useState();
  const contractList = useSelector((state) => state.contractList);

  function getContractName(id) {
    const contract = contractList.filter((c) => c.contract_id === id);
    return contract && contract[0] && contract[0].subject
      ? contract[0].subject
      : "";
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await getChart(routeParams.chart_id);

        setLoading(false);
        if (res) {
          const data = res.data;
          if (data) {
            setDetailItems([
              { label: "عنوان", value: data?.title },
              {
                label: "وضعیت",
                value: data?.enable == true ? "تایید شده" : "عدم تایید",
              },
              {
                label: "تاریخ اعمال",
                value: timeToFa(data?.apply_date).split("-")[1],
              },
              {
                label: "کد محیط",
                value: data?.environment_id_fk
                  ? convertIdToCode(data.environment_id_fk)
                  : "",
              },
              { label: "توضیحات", value: data?.description },
            ]);

            if (data.nodes && data.nodes[0]) {
              const chartDetails = generateChartDetailsView(data.nodes[0]);
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
        title="مشاهده جزئیات چارت"
        className="mt-3"
        breadcrumbItems={[
          { text: "منابع انسانی" },
          { text: "افراد حقوقی" },
          { text: "لیست افراد", link: routes.PERSONNEL_RIGHTFUL_LIST },
          { text: "چارت سازمانی" },
          { text: "جزئیات چارت" },
        ]}
      />
      <DetailDescription items={detailItems} loading={loading} />

      <Divider>چارت سازمانی</Divider>

      {chartData ? (
        <OrgChart datasource={chartData} orgchart={orgchart} viewMode />
      ) : (
        ""
      )}
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

  if (chData.count) data.peopleCount = chData.count;
  if (chData.jobs_tamin_code_id_fk)
    data.insuranceCode = chData.jobs_tamin_code_id_fk;

  data.children = getNodeChildrenView(chData.nodes);

  return data;
}

// get node children recursively
// also used in edit
export function getNodeChildrenView(children) {
  if (children) {
    return children.map((child) => {
      if (child.nodes) {
        return {
          peopleCount: child.count,
          insuranceCode: child.jobs_tamin_code_id_fk,
          id: child.id,
          root: false,
          job: [child.title, child.id],
          children: getNodeChildrenView(child.nodes),
        };
      } else {
        return {
          peopleCount: child.count,
          insuranceCode: child.jobs_tamin_code_id_fk,
          id: child.id,
          root: false,
          job: [child.title, child.id],
        };
      }
    });
  }
}

export default MemberView;
