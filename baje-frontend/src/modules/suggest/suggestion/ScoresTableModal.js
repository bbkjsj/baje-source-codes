import React, { useEffect, useState, useContext } from "react";
import { Modal, Button, Table, notification, Spin } from "antd";
import AppTable from "components/general/AppTable";
import { _GET_SCORES, _GET_PUBLIC_SCORES } from "./utils/api";
import { roundNumberTwoDecimals } from "_helpers";
import styled from "styled-components";
import { NewContext } from "contex/New-Context";

const ScoresTableModal = (props) => {
  const [rows, setRows] = useState([]);
  const [pageData, setPageData] = useState();
  const [rank, setRank] = useState({ rank: 45, max: 100 });
  const [loading, setLoading] = useState(false);
  const newContext = useContext(NewContext);

  const columns = [
    {
      title: "شرح",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "میانگین نمرات کسب شده",
      dataIndex: "average",
      key: "average",
    },
    {
      title: "حداکثر نمره ممکن",
      dataIndex: "max",
      key: "max",
    },
  ];

  function getMaxPoint(score) {
    return score.max_point;
  }
  const getData = async (id) => {
    let res = null;
    if (newContext.isPublicSuggestion()) {
      // console.log("!!!!!!!!!!is public");
      res = await _GET_PUBLIC_SCORES(id);
    } else {
      // console.log("!not public");
      res = await _GET_SCORES(id);
    }
    return res;
  };

  useEffect(() => {
    setRows([]);
    setLoading(true);
    let res = null;

    (async function () {
      res = await getData(props.suggestionId);
      // console.log(res, "!res is :");
      setLoading(false);

      if (res && res.data) {
        setPageData(res.data);
        const newRows = res.data.map((score) => {
          return {
            description: score?.name,
            max: getMaxPoint(score),
            average:
              score.sum_value || score.sum_value == 0
                ? (score.sum_value * score.weight_factor) /
                  score.number_of_votes
                : "-",
            ...score,
          };
        });

        const averagesSum = newRows.reduce((sum, item) => {
          return sum + item.average;
        }, 0);

        const maxSum = newRows.reduce((sum, item) => {
          console.log(item);
          const plus = parseFloat(item.max);
          return sum + plus;
        }, 0);

        const coefficient = 100 / maxSum;

        const finalScore = coefficient * averagesSum;

        const specialRows = [
          {
            description: "جمع نمرات",
            average: roundNumberTwoDecimals(averagesSum),
            max: roundNumberTwoDecimals(maxSum),
          },
          {
            description: "نمره کسب شده با تعدیل",
            average: roundNumberTwoDecimals(finalScore),
            max: 100, //roundNumberTwoDecimals(coefficient),
          },
        ];

        const newArr = [...newRows, ...specialRows];
        setRows(newArr);
      }
    })();
  }, [props.suggestionId]);

  const StyledTable = styled(Table)`
    tbody {
      tr:nth-of-type(${rows.length}) {
        background: #cef7c7;
      }
      tr:nth-of-type(${rows.length - 1}) {
        background: #eaffe7;
      }
    }
  `;

  return (
    <Modal
      title="جزئیات امتیاز"
      visible={props.status}
      width={720}
      onCancel={() => props.close()}
      footer={[
        <Button key="back" onClick={() => props.close()}>
          بستن
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        {rows.length > 2 ? (
          <>
            <StyledTable
              columns={columns}
              dataSource={rows}
              pagination={false}
            />

            <div className="flex mt-3">
              <span>{`تعداد نفرات رای دهنده: ${pageData[0]?.number_of_votes} نفر`}</span>
              {/* <span className="mr-4">{`رتبه ${rank.rank} از ${rank.max}`}</span> */}
            </div>
          </>
        ) : (
          <h4 className="text-center">امتیازی وجود ندارد</h4>
        )}
      </Spin>
    </Modal>
  );
};

export default ScoresTableModal;
