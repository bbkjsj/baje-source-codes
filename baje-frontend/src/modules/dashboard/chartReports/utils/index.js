import * as api from "./api";
import { reportTypes } from "modules/dashboard/const";
import { convertDateToEN } from "_helpers";

export const preparePayload = (mainForm, isPeriodic) => {
  const payload = {};
  if (isPeriodic) {
    payload.start_date = convertDateToEN(mainForm.getFieldValue("start_date"));
    payload.end_date = convertDateToEN(mainForm.getFieldValue("end_date"));
  } else {
    payload.start_date = convertDateToEN(mainForm.getFieldValue("report_date"));
    payload.end_date = convertDateToEN(mainForm.getFieldValue("report_date"));
  }

  if (
    mainForm.getFieldValue("chart_type") === reportTypes.daily_production ||
    mainForm.getFieldValue("chart_type") === reportTypes.periodic_production
  ) {
    payload.activity = "mineral";
  }

  return payload;
};

export const getList = (mainForm, isPeriodic) => {
  const payload = preparePayload(mainForm, isPeriodic);
  return api._GET_REPORTS_CONTRACTS(payload);
};

export const getChartData = (values, isPeriodic) => {
  const payload = {
    contracts: values.contracts,
  };

  if (isPeriodic) {
    payload.start_date = convertDateToEN(values.start_date);
    payload.end_date = convertDateToEN(values.end_date);
  } else payload.report_date = convertDateToEN(values.report_date);

  let url = null;
  switch (values.chart_type) {
    case reportTypes.daily_production:
      url = "/contract/report/production/daily";
      break;

    case reportTypes.periodic_production:
      url = "/contract/report/production/periodically";
      break;

    case reportTypes.periodic_project_progress:
      url = "/contract/report/progress";
      break;
    case reportTypes.periodic_machines_activity:
    case reportTypes.periodic_ready_to_work_factor:
      url = "/vehicle/report/activity";
      break;

    case reportTypes.daily_machines_activity:
      url = "/vehicle/report/status/daily";
      break;

    case reportTypes.daily_machines_activity_average:
      url = "/vehicle/report/status/average";
      const companies = payload.contracts;
      delete payload.contracts;
      payload.companies = companies;
      break;
  }

  // console.log(payload, "!payload");
  return api
    ._Get_CHART_DATA(url, payload)
    .then((res) => {
      // console.log(res, "!res-chart");
      return res;
    })
    .catch((err) => {
      console.log(err, "خطای دریافت اطلاعات نمودار");
    });
};

export const getFakeList = (mainForm, isPeriodic) => {
  return new Promise((resolve, reject) => {
    const list = [];

    if (mainForm.getFieldValue("chart_type") === reportTypes.daily_production) {
      list.push({
        title: "شرکت 1",
        value: "o-1",
        key: "o-1",
        children: [
          {
            title: "قرارداد 1",
            value: "c-1",
            key: "c-1",
          },
          {
            title: "قرارداد 2",
            value: "c-2",
            key: "c-2",
          },
          {
            title: "قرارداد 3",
            value: "c-3",
            key: "c-3",
          },
        ],
      });
    } else
      list.push({
        title: "شرکت 2",
        value: "o-2",
        key: "o-2",
        children: [
          {
            title: "قرارداد 21",
            value: "c-21",
            key: "c-21",
          },
          {
            title: "قرارداد 22",
            value: "c-22",
            key: "c-22",
          },
          {
            title: "قرارداد 23",
            value: "c-23",
            key: "c-23",
          },
        ],
      });

    setTimeout(resolve(list), 100);
    setTimeout(reject("err!$$"), 100);
  });
};

export const getFakeChartData = (values, isPeriodic) => {
  const payload = {
    contracts: values.contracts,
  };

  if (isPeriodic) {
    payload.start_date = convertDateToEN(values.start_date);
    payload.end_date = convertDateToEN(values.end_date);
  } else payload.report_date = convertDateToEN(values.report_date);

  const response = { data: [] };

  switch (values.chart_type) {
    case reportTypes.daily_production:
      response.data.push(
        {
          company_name: "شرکت 1",
          contract_name: "قرارداد1",
          contract_id_fk: "698",
          date: "2021-08-05 00:00:00",
          dust_load_quantity: "1",
          stone_load_quantity: "2",
          dust_tonnage: "3",
          stone_tonnage: "4",
          id: 335,
        },
        {
          company_name: "شرکت 2",
          contract_name: "قرارداد2",
          contract_id_fk: "333",
          date: "2021-08-05 00:00:00",
          dust_load_quantity: "5",
          stone_load_quantity: "6",
          dust_tonnage: "7",
          stone_tonnage: "8.551",
          id: 111,
        },
        {
          company_name: "شرکت 3",
          contract_name: "قرارداد3",
          contract_id_fk: "52257",
          date: "2021-08-05 00:00:00",
          dust_load_quantity: "2.54278",
          stone_load_quantity: "5",
          dust_tonnage: "1",
          stone_tonnage: "11",
          id: 454,
        }
      );
      break;

    case reportTypes.periodic_production:
      response.data.push(
        {
          company_name: "شرکت 1",
          contract_name: "قرارداد1",
          contract_id_fk: "11",
          company_id: 1,
          reports: [
            {
              id: 1,
              date: "2021-08-05 00:00:00",
              dust_load_quantity: "1",
              stone_load_quantity: "2",
              dust_tonnage: "3",
              stone_tonnage: "4",
              total_load: 3,
              total_tonnage: 7,
            },
            {
              id: 2,
              date: "2021-08-06 00:00:00",
              dust_load_quantity: "2",
              stone_load_quantity: "3",
              dust_tonnage: "4",
              stone_tonnage: "5",
              total_load: 5,
              total_tonnage: 9,
            },
          ],
        },
        {
          company_name: "شرکت 2",
          contract_name: "قرارداد2",
          contract_id_fk: "22",
          company_id: 2,
          reports: [
            {
              id: 3,
              date: "2021-08-05 00:00:00",
              dust_load_quantity: "1.5",
              stone_load_quantity: "2.5",
              dust_tonnage: "3.5",
              stone_tonnage: "4.5",
              total_load: 4,
              total_tonnage: 8,
            },
            {
              id: 4,
              date: "2021-08-06 00:00:00",
              dust_load_quantity: "2.5",
              stone_load_quantity: "3.5",
              dust_tonnage: "4.5",
              stone_tonnage: "5.5",
              total_load: 6,
              total_tonnage: 10,
            },
          ],
        }
      );
      break;

    case reportTypes.periodic_project_progress:
      response.data.push(
        {
          company_name: "شرکت 1",
          contract_name: "قرارداد1",
          contract_id_fk: "11",
          company_id: 1,
          reports: [
            {
              id: 1,
              program_progress: "1",
              real_progress: "1.5",
              date: "2021-08-05 00:00:00",
            },
            {
              id: 2,
              program_progress: "2",
              real_progress: "2.5",
              date: "2021-08-06 00:00:00",
            },
          ],
        },
        {
          company_name: "شرکت 2",
          contract_name: "قرارداد2",
          contract_id_fk: "22",
          company_id: 2,
          reports: [
            {
              id: 3,
              program_progress: "3",
              real_progress: "3.5",
              date: "2021-08-05 00:00:00",
            },
            {
              id: 4,
              program_progress: "4",
              real_progress: "4.5",
              date: "2021-08-06 00:00:00",
            },
          ],
        }
      );
      break;
    case reportTypes.periodic_machines_activity:
    case reportTypes.periodic_ready_to_work_factor:
      response.data.push(
        {
          company_name: "شرکت 1",
          contract_name: "قرارداد1",
          contract_id_fk: "11",
          company_id: 1,
          reports: [
            {
              id: 1,
              total_active: "1",
              total_disabled_car_no_part: "1.5",
              total_disabled_car_no_tier: "2",
              ready_to_work_factor: "1.5",
              total_disable: 3.5,
              date: "2021-08-05 00:00:00",
            },
            {
              id: 2,
              total_active: "2",
              total_disabled_car_no_part: "2.5",
              total_disabled_car_no_tier: "3",
              total_disable: 5.5,
              ready_to_work_factor: "2.5",
              date: "2021-08-06 00:00:00",
            },
          ],
        },
        {
          company_name: "شرکت 2",
          contract_name: "قرارداد2",
          contract_id_fk: "22",
          company_id: 2,
          reports: [
            {
              id: 3,
              total_active: "4",
              total_disabled_car_no_part: "3",
              total_disabled_car_no_tier: "2",
              total_disable: 5,
              ready_to_work_factor: "5",
              date: "2021-08-05 00:00:00",
            },
            {
              id: 4,
              total_active: "2",
              total_disabled_car_no_part: "4",
              total_disabled_car_no_tier: "2.5",
              total_disable: 6.5,
              ready_to_work_factor: "1",
              date: "2021-08-06 00:00:00",
            },
          ],
        }
      );
      break;

    case reportTypes.daily_machines_activity:
      response.data.push(
        {
          company_name: "شرکت 1",
          contract_name: "قرارداد1",
          contract_id_fk: "11",
          company_id: 1,
          total_active: "10",
          total_disabled_car_no_part: "5",
          total_disabled_car_no_tier: "8",
          date: "2021-08-05 00:00:00",
        },
        {
          company_name: "شرکت 2",
          contract_name: "قرارداد2",
          contract_id_fk: "12",
          company_id: 2,
          total_active: "6",
          total_disabled_car_no_part: "4",
          total_disabled_car_no_tier: "9",

          date: "2021-08-05 00:00:00",
        },
        {
          company_name: "شرکت 3",
          contract_name: "قرارداد3",
          contract_id_fk: "12",
          company_id: 2,
          total_active: "1",
          total_disabled_car_no_part: "1",
          total_disabled_car_no_tier: "3",

          date: "2021-08-05 00:00:00",
        }
      );
      break;

    case reportTypes.daily_machines_activity_average:
      response.data.push(
        {
          company_name: "شرکت 1",
          company_id: 1,
          total_active_average: "1",
          total_disabled_car_no_part_average: "1.5",
          total_disabled_car_no_tier_average: "2",
          date: "2021-08-05 00:00:00",
        },
        {
          company_name: "شرکت 2",
          company_id: 2,
          total_active_average: "2",
          total_disabled_car_no_part_average: "3",
          total_disabled_car_no_tier_average: "1",
          date: "2021-08-05 00:00:00",
        }
      );
      break;
  }

  return new Promise((resolve, reject) => {
    setTimeout(resolve(response), 100);
  });
};
