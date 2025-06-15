import AppTag from "components/general/AppTag";
import TableOptionV2 from "components/general/TableActions";
import { criticalValues, questionTypes } from "modules/hse/constant";
import React from "react";

const columns = (handleRemoveQuestion, handleRemoveCritical) => [
  {
    render: (data, record, index) => index + 1,
    title: "#",
  },
  {
    render: (data, record) => record.question.question,
    title: "عنوان سوال",
  },
  {
    title: "کد سوال",
    render: (data, record) => record.question.code,
  },
  {
    title: "شیوه ممیزی",
    render: (data, record) =>
      questionTypes.find((item) => item.value === record.question.type).label,
  },
  {
    title: "ضریب وزنی",
    dataIndex: "weight_factor",
  },
  {
    title: "حالت بحرانی",
    render: (data, record) =>
      !record.critical || record.critical.length === 0
        ? "ندارد"
        : typeof record.critical === "string"
        ? record.critical
            .split(",")
            .map((item) =>
              criticalValues(!!record.question.is_reverse)[
                record.question.type
              ].find((crt) => crt.value === item)
            )
            .map((item) => (
              <AppTag
                onClick={() =>
                  handleRemoveCritical(record.question, item.value)
                }
                closable={false}
                color="red"
                children={item.label}
              />
            ))
        : record.critical
            .map((item) =>
              criticalValues(!!record.question.is_reverse)[
                record.question.type
              ].find((crt) => crt.value === item)
            )
            .map((item) => (
              <AppTag
                onClick={() =>
                  handleRemoveCritical(record.question, item.value)
                }
                closable={false}
                color="red"
                children={item.label}
              />
            )),
  },
  {
    title: "بند الزامات",
    dataIndex: "requirements",
  },
  {
    title: "توضیحات",
    dataIndex: "description",
  },

  {
    title: "ابزار",
    render: (data, render, index) => (
      <TableOptionV2
        list={[
          {
            title: "خذف",
            name: "delete",
            onClick: () => handleRemoveQuestion(index),
          },
        ]}
      />
    ),
  },
];

export default columns;
