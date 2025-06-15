import React, { useState, useEffect, useContext } from "react";
import * as api from "../suggestion/utils/api";
import { ContainerOutlined } from "@ant-design/icons";
import { getAsArray, getLink } from "_helpers";
import {
  cartableFilters,
  accessToCartable,
  suggestAccessTypes,
  cartableToStatus,
} from "../suggestion/const";
import { notice } from "_helpers";
import { pageNames } from "constant";
import { NewContext } from "contex/New-Context";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

const useSuggestMenu = () => {
  const newContext = useContext(NewContext);
  const user = useWhoAmI();
  const surveyAccess = user?.surveyAccess;
  const [menuItems, setMenuItems] = useState([]);
  const [cartableNewCounts, setCartableNewCounts] = useState({
    [cartableFilters.TO_APPROVE]: 0,
  });
  const [cartableTotalNewCounts, SetCartableTotalNewCounts] = useState(0);
  const suggestionListPath = pageNames.suggest.suggestion.list;

  // useEffect(() => {
  //   (async () => {
  //     await refreshCartableCounts();
  //     //setInterval(async () => await refreshCartableCounts(), 5000);
  //   })();
  // }, []);

  const refreshCartableCounts = async () => {
    const newCounts = {};
    let totalNewCounts = 0;

    const unreadRes = newContext.isPublicSuggestion()
      ? await api._GET_UNREAD_COUNT_PUBLIC()
      : await api._GET_UNREAD_COUNT();

    if (unreadRes.status !== 200) return;

    Object.keys(cartableToStatus).forEach((key) => {
      const statusList = cartableToStatus[key];
      const unreadList = unreadRes.data.filter((item) =>
        statusList.includes(item.status)
      );

      if (!unreadList.length) {
        newCounts[key] = 0;
        return;
      }

      newCounts[key] = unreadList.reduce(
        (total, item) => total + item["unread_count"],
        0
      );
      totalNewCounts += newCounts[key];
    });

    setCartableNewCounts(newCounts);
    SetCartableTotalNewCounts(totalNewCounts);
  };

  const checkAccess = (filter) => {
    const access = getAsArray(surveyAccess);
    let hasAccess = false;

    access.forEach((item) => {
      if (accessToCartable[filter].includes(item)) hasAccess = true;
    });

    if (user?.isSuper) hasAccess = true;

    return hasAccess;
  };

  const getFinalMenu = () => {
    const cartableItems = [
      {
        title: "همه",
        link: getLink(suggestionListPath, {
          filter: cartableFilters.ALL,
        }),
        hidden: !checkAccess(cartableFilters.ALL),
      },
      {
        title: "جهت تائید",
        link: getLink(suggestionListPath, {
          filter: cartableFilters.TO_APPROVE,
        }),
        hidden: !checkAccess(cartableFilters.TO_APPROVE),
        badge: cartableNewCounts[cartableFilters.TO_APPROVE],
      },
      {
        title: "جهت ابلاغ",
        link: getLink(suggestionListPath, {
          filter: cartableFilters.TO_SIGNIFY,
        }),
        hidden: !checkAccess(cartableFilters.TO_SIGNIFY),
        badge: cartableNewCounts[cartableFilters.TO_SIGNIFY],
      },
      {
        title: "در حال ارزیابی",
        link: getLink(suggestionListPath, {
          filter: cartableFilters.EVALUATING,
        }),
        hidden: !checkAccess(cartableFilters.EVALUATING),
        badge: cartableNewCounts[cartableFilters.EVALUATING],
      },
      {
        title: "در حال اصلاح",
        link: getLink(suggestionListPath, {
          filter: cartableFilters.IN_MODIFICATION,
        }),
        hidden: !checkAccess(cartableFilters.IN_MODIFICATION),
        badge: cartableNewCounts[cartableFilters.IN_MODIFICATION],
      },
      {
        title: "در حال اجرا",
        link: getLink(suggestionListPath, {
          filter: cartableFilters.IN_EXECUTION,
        }),
        hidden: !checkAccess(cartableFilters.IN_EXECUTION),
        badge: cartableNewCounts[cartableFilters.IN_EXECUTION],
      },
      {
        title: "تایید شده ها",
        link: getLink(suggestionListPath, {
          filter: cartableFilters.APPROVED,
        }),
        hidden: !checkAccess(cartableFilters.APPROVED),
        badge: cartableNewCounts[cartableFilters.APPROVED],
      },
      {
        title: "رد شده ها",
        link: getLink(suggestionListPath, {
          filter: cartableFilters.REJECTED,
        }),
        hidden: !checkAccess(cartableFilters.REJECTED),
        badge: cartableNewCounts[cartableFilters.REJECTED],
      },
      {
        title: "معوق شده",
        link: getLink(suggestionListPath, {
          filter: cartableFilters.PENDING,
        }),
        hidden: !checkAccess(cartableFilters.PENDING),
        badge: cartableNewCounts[cartableFilters.PENDING],
      },
      {
        title: "ابلاغ شده",
        link: getLink(suggestionListPath, {
          filter: cartableFilters.ASSIGNED,
        }),
        hidden: !checkAccess(cartableFilters.ASSIGNED),
        badge: cartableNewCounts[cartableFilters.ASSIGNED],
      },
      {
        title: "گزارش مشکل",
        link: getLink(suggestionListPath, {
          filter: cartableFilters.HAS_PROBLEM,
        }),
        hidden: !checkAccess(cartableFilters.HAS_PROBLEM),
        badge: cartableNewCounts[cartableFilters.HAS_PROBLEM],
      },
    ];

    const managementItems = [
      {
        title: "کارگروه ها",
        link: pageNames.suggest.commitee.list,
      },
      {
        title: "ملاک های ارزیابی",
        link: getLink(pageNames.suggest.assessmentCriteria.list, false),
      },
      {
        title: "ملاک های رد",
        link: getLink(pageNames.suggest.rejectionCriteria.list, false),
      },
      {
        title: "حوزه‌های پیشنهاد",
        link: pageNames.suggest.category.list,
      },
      {
        title: "فراخوان ها",
        link: pageNames.suggest.call.list,
      },
      {
        title: "گزارشات",
        link: pageNames.suggest.reportIndex,
      },
      {
        title: "تنظیمات",
        link: pageNames.suggest.configuration,
      },
    ];

    const cartable = cartableItems.filter((item) => !item.hidden).length
      ? [
          {
            title: "پیشنهادات",
            badge: cartableTotalNewCounts,
            items: cartableItems,
          },
        ]
      : [];

    let final = cartable;

    if (surveyAccess?.includes(suggestAccessTypes.SURVEY_MANAGER))
      final = [...cartable, ...managementItems];

    if (!final.length) return [];

    return [
      {
        title: "نظام پیشنهادات",
        icon: <ContainerOutlined />,
        className: "suggestions-submenu",
        top: true,
        items: final,
        badge: cartableTotalNewCounts,
      },
    ];
  };

  return [getFinalMenu(), cartableTotalNewCounts];
};

export default useSuggestMenu;
