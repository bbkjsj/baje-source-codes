import axios from "api/appAxios";
import { covetFormatDateToFA } from "../../../_helpers";

const getList = (setList, error, type, setLoading, officeID, setExportKey) => {
  setLoading(true);
  axios
    .get(`/api/v1/baje/contract/list/main`)
    .then((res) => {
      // console.log(
      //   res.data.list.map((el) => el.id),
      //   "!!"
      // );
      setLoading(false);
      setList(res.data);
      setExportKey("");
    })
    .catch((err) => {
      setLoading(false);
      error();
    });
};

const getSingleContract = (
  setContract,
  setError,
  ID,
  setLoading,
  setBoss = null,
  setContractor = null,
  setManager
) => {
  setLoading(true);
  axios
    .get(`/api/admin/contract/${ID}`)
    .then((res) => {
      setLoading(false);
      let contract = { ...res.data.contract };
      contract.contract_date = covetFormatDateToFA(contract.date);
      contract.start_date = covetFormatDateToFA(contract.start_date);
      contract.finish_date = covetFormatDateToFA(contract.end_date);
      contract.contract_number = contract.number;
      if (contract.initial_amount)
        contract.initial_amount = contract.initial_amount
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      contract.contractor_code =
        contract.contractor_type == "company"
          ? contract.national_id
          : contract.national_number;
      contract.contractor_name = contract.name;

      contract.boss_code = contract.boss_national_num;
      contract.boss_name = contract.boss;
      contract.manager_national_ic = contract.manager_national_num;
      contract.manager_name = contract.manager;
      if (setContractor) {
        setContractor({
          id: contract.contractor_id,
          type: contract.contractor_type,
        });
      }
      if (setBoss) {
        setBoss({ id: contract.boss_id });
      }

      if (setManager) {
        setManager({ id: contract.manager_id });
      }

      setContract(contract);
    })
    .catch((err) => {
      setLoading(false);
      setError();
    });
};

const deleteContractor = (ids, setLoading) => {
  return new Promise((resolve, reject) => {
    setLoading(true);
    axios
      .delete(`/api/admin/contract`, { data: { id: ids } })
      .then((res) => {
        resolve();
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          reject(error.response);
        }
      });
  });
};

export { getList, getSingleContract, deleteContractor };
