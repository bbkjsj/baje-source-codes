import { Collapse } from "antd";
import LoadingLogo from "components/general/LoadingLogo";
import { pageNames } from "constant";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GET_PERSON } from "../utils/api";
import SubordinateListItem from "./SubordinateListItem";
import { UserAddOutlined } from "@ant-design/icons";
import AppButton from "components/general/AppButton";
import { getLink } from "_helpers";
import emptyList from "assets/icons/empty-list.svg";
import GoBackBtn from "components/GoBackBtn";
import { isArray } from "lodash";

export default function SubordinateList() {
  const params = useParams();

  const [subordinates, setSubordinates] = useState([]);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await GET_PERSON(params.id);
      console.log(res);
      setData(res.data);
      setSubordinates(res.data.subordinates ?? []);
    } catch (error) {}

    setLoading(false);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingLogo />
      ) : (
        <div>
          <div className="mb-2 flex justify-between w100">
            <span>
              <GoBackBtn />
            </span>
            <span>
              افراد تبعی{" "}
              {data?.person?.first_name + " " + data?.person?.last_name}{" "}
            </span>
            <span></span>
          </div>
          <Link
            to={getLink(pageNames.personnel.realPerson.subordinate.add, {
              id: params.id,
            })}
          >
            <AppButton icon={<UserAddOutlined />} className="full-btn mt-3">
              اضافه کردن افراد
            </AppButton>
          </Link>
          <div className="mt-4">
            {!isArray(subordinates) || subordinates.length === 0 ? (
              <>
                <img src={emptyList} className="empty-img" alt="لیست خالی" />
                <p className="text-12 text-center text-light-black mt-3">
                  {!isArray(subordinates)
                    ? "شما دسترسی مشاهده لیست افراد تبعی را ندارید"
                    : "  در حال حاظر لیست مربوطه خالیست"}
                </p>
                <p className="text-12 text-center text-primary mt-2">
                  میتوانید با استفاده از دکمه بالا افراد را به لیست اضافه نمایید
                </p>
              </>
            ) : (
              subordinates.map((el, index) => (
                <SubordinateListItem data={el} idx={index} onClick={() => {}} />
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
