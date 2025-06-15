import React, { useContext } from "react";
import {
  TeamOutlined,
  DashboardOutlined,
  CarOutlined,
  BookOutlined,
  ContainerOutlined,
  ReconciliationOutlined,
  BankOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import { getAsArray, getLink } from "_helpers";
import useCheckAccess from "hooks/useCheckAccess";
import { permission as permissions } from "json/Permission";
import useSuggestMenu from "modules/suggest/components/useSuggestMenu";
import useMobileDetect from "use-mobile-detect-hook";
import { pageNames } from "constant";
import { useSelector } from "react-redux";
import { NewContext } from "contex/New-Context";
import hemletIcon from "../assets/icons/hemlet.svg";
import umbrellaIcon from "../assets/icons/umbrella.svg";
import useWhoAmI from "hooks/useWhoAmI";
import SidebarCustomIcon from "components/SidebarCustomIcon";
import useNotifications from "hooks/useNotifications";

const rootSubmenuKeys = ["person", "machinery", "contract"];

function SidebarItems() {
  const checkAccess = useCheckAccess();
  const newContext = useContext(NewContext);
  const user = useWhoAmI();
  const isDoctor = user?.isDoctor;
  const isSuper = user?.isSuper;
  const isPublicSuggestion = newContext.isPublicSuggestion();
  const [suggestMenu] = useSuggestMenu();
  const { isMobile } = useMobileDetect();
  const { notificationsSum } = useNotifications();

  const publicSuggestionItems = [
    {
      title: "پیشنهادات من",
      icon: <ContainerOutlined />,
      link: pageNames.suggest.suggestion.list,
    },
  ];

  const doctorItems = [
    {
      title: "معاینات پزشکی",
      icon: <ReconciliationOutlined />,
      link: pageNames.personnel.realPerson.examination.personList,
    },
  ];

  const noAccessToDashboard = !checkAccess([
    permissions.ADD_EDIT_PEYMAN,
    permissions.ADD_EDIT_PROGRESS,
    permissions.ADD_EDIT_PRODUCTION,
    permissions.DASHBOARD_CHART_REPORTS,
  ]);

  const noAccesToLegals = !checkAccess([
    permissions.INSERT_LEGAL,
    permissions.EDIT_LEGAL,
    permissions.DELETE_LEGAL,
    permissions.APPROVE_LEGAL,
    permissions.EDIT_CONTACT_LEGAL,
    permissions.LIST_LEGAL,
  ]);

  const noAccessToMachinary = !checkAccess([
    permissions.INSERT_MACHINERY,
    permissions.EDIT_MACHINERY,
    permissions.DELETE_MACHINERY,
    permissions.APPROVE_MACHINERY,
    permissions.LIST_MACHINERY,
  ]);

  const noAccessToContracts = !checkAccess([
    permissions.INSERT_CONTRACT,
    permissions.EDIT_CONTRACT,
    permissions.DELETE_CONTRACT,
    permissions.APPROVE_CONTRACT,
    permissions.LIST_CONTRACT,
  ]);

  const items = [
    {
      title: "داشبورد",
      icon: <DashboardOutlined />,
      hidden: noAccessToDashboard,
      items: [
        {
          title: "مدیریت پیمان",
          link: pageNames.dashboard.peymanManagement.list,
          hidden: !checkAccess([permissions.ADD_EDIT_PEYMAN]),
        },
        {
          title: "پیشرفت پروژه ",
          link: pageNames.dashboard.projectProgress,
          hidden: !checkAccess([permissions.ADD_EDIT_PROGRESS]),
        },
        {
          title: "گزارش تولید",
          link: pageNames.dashboard.productionReport.list,
          hidden: !checkAccess(permissions.ADD_EDIT_PRODUCTION),
        },
        {
          title: "گزارشات نموداری",
          link: pageNames.dashboard.chartReports,
          hidden: !checkAccess([permissions.DASHBOARD_CHART_REPORTS]),
        },
      ],
    },
    {
      title: "منابع انسانی",
      icon: <TeamOutlined />,

      items: [
        {
          title: "افراد حقیقی",
          items: [
            {
              title: "لیست افراد",
              link: pageNames.personnel.realPerson.list,
              hidden: !checkAccess([
                permissions.INSERT_PERSON,
                permissions.EDIT_PERSON,
                permissions.DELETE_PERSON,
                permissions.APPROVE_PERSON,
                permissions.PRIVET_DESCRIPTION_PERSON,
                permissions.EDIT_CONTACT_PERSON,
                permissions.VIEWSUBORDINATE_PERSON,
                permissions.LIST_PERSON,
              ]),
            },
            // {
            //   title: "گزارش کارکرد",
            //   link: "/dfdf",
            // },
            {
              title: "خدمات و خسارات",
              link: pageNames.personnel.realPerson.service.list,
              hidden: !checkAccess([]),
            },
            {
              title: "معاینات پزشکی",
              link: pageNames.personnel.realPerson.examination.personList,
              hidden: !checkAccess([]),
            },

            {
              title: "مرخصی ها",
              link: pageNames.personnel.realPerson.leaveRequest.list,
            },
            {
              title: "مساعده ها",
              link: pageNames.personnel.realPerson.loanRequest.list,
              hidden: !checkAccess([]),
            },
            {
              title: "ماموریت ها",
              link: pageNames.personnel.realPerson.mission.list,
              hidden: !checkAccess([]),
            },
            // {
            //   title: "حضور و غیاب",
            //   link: "/dfdf",
            // },
            {
              title: "ادعای سابقه",
              link: pageNames.personnel.realPerson.recordClaim.list,
              hidden: !checkAccess([]),
            },
            {
              title: "تسویه حساب",
              link: pageNames.personnel.realPerson.checkout.list,
              hidden: !checkAccess([]),
            },
          ],
        },
        {
          title: "افراد حقوقی",
          hidden: noAccesToLegals,
          items: [
            {
              title: "لیست افراد",
              link: pageNames.personnel.rightFull.list,
              hidden: !checkAccess([
                permissions.INSERT_LEGAL,
                permissions.EDIT_LEGAL,
                permissions.DELETE_LEGAL,
                permissions.APPROVE_LEGAL,
                permissions.EDIT_CONTACT_LEGAL,
                permissions.LIST_LEGAL,
              ]),
            },

            {
              title: "پزشک",
              link: pageNames.personnel.doctor.list,
              hidden: !checkAccess([]),
            },
          ],
        },
        {
          title: "تنظیمات",
          hidden: !checkAccess([]),
          items: [
            {
              title: "تنظیمات سالانه",
              link: pageNames.personnel.annualSetting.list,
              hidden: !checkAccess([]),
            },
            {
              title: "تعریف مشاغل",
              link: pageNames.personnel.jobs.list,
            },
            {
              title: "شیفت کاری",
              link: pageNames.personnel.shiftWork.list,
            },
            {
              title: "دسترسی ها",
              link: pageNames.permissions.list,
              hidden: !checkAccess(permissions.ACCESS_LIST),
            },
            {
              title: "دسترسی همه افراد",
              link: pageNames.permissions.person.all,
              hidden: !checkAccess(permissions.ACCESS_LIST),
            },
          ],
        },
      ],
    },
    {
      title: "بیمه",
      icon: <SidebarCustomIcon src={umbrellaIcon} alt="بیمه" />,
      items: [
        {
          title: "بیمه تکمیلی",
          link: pageNames.personnel.insurance.supplymentary.list,
          hidden: !checkAccess([permissions.SUPPLEMENTARY_LIST]),
        },
        {
          title: "بیمه عمر و حادثه",
          link: pageNames.personnel.insurance.accident.list,
          hidden: !checkAccess([]),
        },
        {
          title: "بیمه تامین اجتماعی",
          link: pageNames.personnel.insurance.tamin.list,
          hidden: !checkAccess([permissions.SOCIAL_INSURANCE_MENU]),
        },
        {
          title: "گزارش بیمه تامین اجتماعی",
          link: getLink(
            pageNames.personnel.insurance.tamin.personnelReport,
            user?.id
          ),

          hidden: false,
        },
        {
          title: "بیمه شخص ثالث",
          link: pageNames.personnel.insurance.thirdPartyIns.list,
          hidden: !checkAccess([permissions.THIRD_PARTY_INSURANCE_VIEW]),
        },
        {
          title: "بیمه های تکمیلی من",
          link: pageNames.personnel.insurance.supplymentary.contracts.list,
          hidden: !isMobile(),
        },
      ],
    },
    {
      title: "ماشین آلات",
      icon: <CarOutlined />,
      hidden: noAccessToMachinary,
      items: [
        {
          title: "لیست ماشین آلات",
          link: pageNames.machinery.list,
          hidden: !checkAccess([
            permissions.INSERT_MACHINERY,
            permissions.EDIT_MACHINERY,
            permissions.DELETE_MACHINERY,
            permissions.APPROVE_MACHINERY,
            permissions.LIST_MACHINERY,
          ]),
        },
        {
          title: "تنظیمات",

          hidden: !checkAccess([]),

          items: [
            {
              title: "نوع ",
              link: pageNames.machinery.addType,
              hidden: !checkAccess([]),
            },
            {
              title: "سیستم ",
              link: pageNames.machinery.addSystem,
              hidden: !checkAccess([]),
            },

            {
              title: "تیپ ",
              link: pageNames.machinery.addTip,
              hidden: !checkAccess([]),
            },
          ],
        },
      ],
    },
    {
      title: "امور قرارداد ها",
      icon: <BookOutlined />,
      hidden: !checkAccess([
        permissions.INSERT_CONTRACT,
        permissions.EDIT_CONTRACT,
        permissions.DELETE_CONTRACT,
        permissions.APPROVE_CONTRACT,
        permissions.LIST_CONTRACT,
      ]),
      items: [
        {
          title: "قرارداد ها",
          link: pageNames.contract.list,
          hidden: !checkAccess([
            permissions.INSERT_CONTRACT,
            permissions.EDIT_CONTRACT,
            permissions.DELETE_CONTRACT,
            permissions.APPROVE_CONTRACT,
            permissions.LIST_CONTRACT,
          ]),
        },
      ],
    },

    {
      title: "HSE",
      // icon: <BookOutlined />,
      icon: <SidebarCustomIcon src={hemletIcon} alt="HSE" />,
      // hidden: noAccessToContracts,
      items: [
        {
          title: "بازرسی",
          link: pageNames.hse.audit.index,
        },
        {
          title: "حوادث",
          link: pageNames.personnel.realPerson.accidentReport.list,
          hidden: !checkAccess([]),
        },
        {
          title: "تنظیمات",
          hidden: !checkAccess([permissions.HSE_SETTINGS]),
          items: [
            {
              title: "سوالات",
              link: pageNames.hse.questions.index,
            },
            {
              title: "چک لیست عمومی",
              link: pageNames.hse.checklist.index,
            },
            {
              title: "اختصاص دادن سوال",
              link: pageNames.hse.allocate.index,
            },
          ],
        },
      ],
    },

    {
      title: "وظیفه ها",
      icon: <CheckSquareOutlined />,
      badge: notificationsSum(),
      items: [
        {
          title: "کارتابل ها",
          link: pageNames.task.cardBoards,
          onClick: () => {
            if (window.location.pathname === pageNames.task.cardBoards) {
              window.location.reload();
            }
          },
        },
        {
          title: "تنظیمات",
          hidden: false, //!isSuper,
          items: [
            {
              title: "تعریف جداول",
              link: pageNames.task.tableName.index,
              hidden: !isSuper,
            },
            {
              title: "شرط ها",
              link: pageNames.task.taskCondtion.index,
              hidden: false, //!isSuper,
            },
          ],
        },
      ],
    },

    {
      title: "محیط",
      icon: <BankOutlined />,
      hidden: !checkAccess([
        permissions.ENVIRONMENT_USAGE_LIST,
        permissions.ENVIRONMENT_LIST,
      ]),
      items: [
        {
          title: "تعریف محیط",
          link: pageNames.environment.list,
          hidden: !checkAccess([permissions.ENVIRONMENT_LIST]),
        },
        {
          title: "کاربری محیط ",
          link: pageNames.environment.usage,
          hidden: !checkAccess([permissions.ENVIRONMENT_USAGE_LIST]),
        },
      ],
    },

    // {
    //   title: "انبار",
    //   icon: <BankOutlined />,
    //   items: [],
    // },
    // {
    //   title: "اتوماسیون",
    //   icon: <CopyOutlined />,
    //   items: [],
    // },
    // {
    //   title: "وظایف",
    //   icon: <CheckCircleOutlined />,
    //   items: [],
    // },
    ...getAsArray(suggestMenu),
  ];

  if (isPublicSuggestion) return publicSuggestionItems;
  else if (isDoctor) return doctorItems;
  else return items;
}

export default SidebarItems;
