import React, { useState, useEffect, useContext } from "react";
import axios from "api/appAxios";
import RenderListContractModal from "../../components/contract/renderListContractModal/RenderListContractModal";
import { useSelector } from "react-redux";

const GetContractList = (props) => {
  const [contractList, setContractList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchBtnLoading, setSearchBtnLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const currentOffice = useSelector((state) => state.currentOffice);

  const setList = (resData) => {
    let data = [];
    if (resData.length > 0) {
      data = resData.map((el) => {
        if (
          el.type.substr(5) === props.contractType.substr(4) ||
          el.type.substr(4) === props.contractType.substr(4)
        ) {
          return { ...el, key: el.id };
        }
      });
      let filteredData = data.filter(function (el) {
        return el != null;
      });
      setContractList(filteredData);
    } else {
      setContractList([]);
    }
    setLoadingList(false);
    setSearchBtnLoading(false);
  };

  const getData = () => {
    axios
      .get("/api/v1/baje/contract/list/main")
      .then((res) => {
        setList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (props.modalVisible) {
      setSearchBtnLoading(true);
      getData();
      setSearchInput("");
    }
  }, [props.modalVisible]);

  const onSearch = (value) => {
    setSearchBtnLoading(true);
    if (value) {
      let config = {
        headers: {
          cid: currentOffice,
        },
      };
      axios
        .get(`/api/admin/contract/search/${value}`, config)
        .then((res) => {
          setList(res.data.list);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (!value) {
      getData();
    }
  };

  const onchangeInputSearch = (e) => {
    setSearchInput(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <>
      <RenderListContractModal
        visible={props.modalVisible}
        onCancel={props.modalOnCancel}
        list={contractList}
        form={props.form}
        onchangeInputSearch={onchangeInputSearch}
        searchValue={searchInput}
        search={onSearch}
        searchBtnLoading={searchBtnLoading}
        loadingList={loadingList}
        setContractDate={props.setContractDate}
        setFinishDate={props.setFinishDate}
      />
    </>
  );
};

export default GetContractList;
