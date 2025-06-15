import React, { useEffect, useState } from "react";
import { Button, message, Popconfirm, Spin, Tabs } from "antd";
import LogoLoading from "components/general/LoadingLogo";
import MenuInlineBtn from "components/MenuInlineBtn";
import { _GET } from "./utils/api";
import Table from "./common/Table";
import { PlusOutlined } from "@ant-design/icons";
import ContentTop from "components/general/ContentTop";
import {
  convertDateFormat,
  covetFormatDateToFA,
  dateToInt,
  handleClickExportExl,
  timeToFa,
} from "_helpers";
import ListActions from "components/general/ListActions";
import { pageNames } from "constant";
import moment from "moment-jalaali";

const LeaveRequestList = (props) => {
  const [listLoading, setListLoading] = useState(false);
  const [list, setList] = useState([]);
  const [selectedRow, setSleetedRow] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [exportKey, setExportKey] = useState();

  const menuBtnList = [
    {
      url: pageNames.personnel.realPerson.leaveRequest.add,
      label: "افزودن درخواست مرخصی",
      id: "newRequest",
      variant: "primary",
      icon: <PlusOutlined />,
    },
  ];

  // sort new list by date desc
  function sorteByDate(arr) {
    return arr.sort((a, b) => {
      return new Date(b.from_date) - new Date(a.from_date);
    });
  }

  const getList = () => {
    setListLoading(true);

    _GET()
      .then((res) => {
        const newList = calculateTimeOffUsed(res.data).map((item, idx) => {
          const fromDate = convertDateFormat(item.from_date);
          const toDate = convertDateFormat(item.from_date);

          const year = covetFormatDateToFA(fromDate).split("/")[0];

          const newObj = { ...item };

          let requested = null;
          const from = moment(fromDate);
          const to = moment(toDate);

          // set newObj year
          newObj.year = from.jYear();
          if (
            item.request_type === "روزانه" &&
            item.from_date &&
            item.to_date
          ) {
            requested = to.diff(from, "days");
          } else if (
            item.request_type === "ساعتی" &&
            item.from_date &&
            item.to_date
          ) {
            requested = to.diff(from, "hours");
          }
          newObj.requested = String(requested);

          if (item.status == null) {
            newObj.status = "در انتظار تایید";
          }
          return newObj;
        });
        // sort first by status then date, actually split them by status
        let nullStatus = newList.filter((i) => i.status === "در انتظار تایید");
        let notverified = newList.filter((i) => i.status === "عدم تایید");
        let verified = newList.filter((i) => i.status === "تایید نهایی");

        nullStatus = nullStatus.length ? sorteByDate(nullStatus) : [];
        notverified = notverified.length ? sorteByDate(notverified) : [];
        verified = verified.length ? sorteByDate(verified) : [];

        const finalList = [...nullStatus, ...notverified, ...verified];

        setListLoading(false);
        setDeleteLoading(false);
        setList(finalList);
      })
      .catch((err) => {
        setListLoading(false);
        console.error(err);
      });
  };

  useEffect(() => {
    getList();
    setListLoading(true);
  }, []);

  if (listLoading) {
    return <LogoLoading />;
  }

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSleetedRow(selectedRowKeys);
    },
  };

  return (
    <div>
      <ContentTop
        noBack
        title="درخواست های مرخصی"
        className="mt-3"
        // breadcrumbItems={[
        //   // { text: "منابع انسانی" },
        //   { text: "افراد حقیقی" },
        //   { text: "مرخصی" },
        // ]}
      />
      <div className="w-100 flex-wrap align-center mb-3">
        <MenuInlineBtn list={menuBtnList} />
        <ListActions
          className="mr-md-auto mt-lg-0"
          noPrint
          noFilter
          noSort
          actions={{
            excelExport: () => handleClickExportExl(exportKey),
          }}
        />
      </div>
      <Spin spinning={deleteLoading}>
        <div className="card-container">
          {list && list.length ? (
            <Table
              data={list}
              updateList={getList}
              selectedRow={selectedRow}
              rowSelection={rowSelection}
              setLoadingList={setListLoading}
            />
          ) : (
            ""
          )}
        </div>
      </Spin>
    </div>
  );
};

function calculateTimeOffUsed(list) {
  const usedTimeOff = {
    year: {},
    month: {},
    all: {},
  };
  const result = list
    .sort((a, b) =>
      a.to_date
        ? dateToInt(timeToFa(a.to_date, false)) -
          dateToInt(timeToFa(b.to_date, false))
        : false
    )
    .map((timeOff) => {
      const personnelId = timeOff.personnel_id_fk;
      const from = new Date(timeOff.from_date);
      const to = new Date(timeOff.to_date);
      const diff = to.getTime() - from.getTime();
      const diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      const diffInHours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const jalaliYear = moment(from).jYear();
      const jalaliMonth = moment(from).jMonth();
      const keyYear = `${personnelId}-${jalaliYear}`;
      const keyMonth = `${personnelId}-${jalaliMonth}`;
      const keyAll = `${personnelId}`;

      if (!usedTimeOff.year[keyYear]) {
        usedTimeOff.year[keyYear] = 0;
      }
      if (!usedTimeOff.month[keyMonth]) {
        usedTimeOff.month[keyMonth] = 0;
      }
      if (!usedTimeOff.all[keyAll]) {
        usedTimeOff.all[keyAll] = 0;
      }

      if (timeOff.status === "تایید نهایی" && timeOff.type === "استحقاقی") {
        usedTimeOff.year[keyYear] +=
          diffInDays +
          diffInHours / 8 +
          (timeOff.request_type === "روزانه" ? 1 : 0);
        usedTimeOff.month[keyMonth] +=
          diffInDays +
          diffInHours / 8 +
          (timeOff.request_type === "روزانه" ? 1 : 0);
        usedTimeOff.all[keyAll] +=
          diffInDays +
          diffInHours / 8 +
          (timeOff.request_type === "روزانه" ? 1 : 0);
      }

      const daysYear = Math.floor(usedTimeOff.year[keyYear]);
      const hoursYear = Math.floor((usedTimeOff.year[keyYear] % 1) * 8);
      let outputYear = `${daysYear} روز`;
      if (hoursYear > 0) {
        outputYear += ` و ${hoursYear} ساعت`;
      }

      const daysMonth = Math.floor(usedTimeOff.month[keyMonth]);
      const hoursMonth = Math.floor((usedTimeOff.month[keyMonth] % 1) * 8);
      let outputMonth = `${daysMonth} روز`;
      if (hoursMonth > 0) {
        outputMonth += ` و ${hoursMonth} ساعت`;
      }

      const daysAll = Math.floor(usedTimeOff.all[keyAll]);
      const hoursAll = Math.floor((usedTimeOff.all[keyAll] % 1) * 8);
      let outputAll = `${daysAll} روز`;
      if (hoursAll > 0) {
        outputAll += ` و ${hoursAll} ساعت`;
      }

      return {
        ...timeOff,
        usedInYear: outputYear,
        usedInMonth: outputMonth,
        usedAll: outputAll,
        daysYear,
        daysMonth,
        daysAll,
        hours: diffInHours,
        days: diffInDays,
      };
    });
  return result;
}

export default LeaveRequestList;
