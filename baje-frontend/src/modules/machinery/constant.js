export const plateStatusConstant = {
  WITH_LICENSE_PLATE: "with_license_plate",
  WITHOUT_LICENSE_PLATE: "without_license_plate",
};

export const endpoints = {
  machine: {
    //old-add
    add: "/api/admin/vehicle/add",
    //new-add
    addNew: "/api/v1/baje/vehicle",
    addGroup: "/api/admin/vehicle/add/excel",
    edit: "/api/admin/vehicle/edit",
    //new-edit
    editNew: (id) => `/api/v1/baje/vehicle/${id}`,
    //old-get
    get: (id) => `/api/admin/vehicle/${id}`,
    //new-get
    getNew: (id) => `/api/v1/baje/vehicle/${id}`,
    //old-getList
    getList: (officeID, contractID) =>
      `/api/admin/vehicle/list/${officeID}/${contractID}`,
    //new-getList
    getListNew: () => `/api/v1/baje/vehicle/advance-search`,
    getAllList: () => `/api/v1/baje/vehicle/find`,
    //old-delete
    delete: `/api/admin/vehicle`,
    //new-delete
    deleteNew: `/api/v1/baje/vehicle`,
    getRefrence: "/api/admin/vehicle/references",
  },

  type: {
    //new-get-Type-List
    listNew: "/api/v1/baje/vehicle/types",
    addNew: "/api/v1/baje/vehicle/type",
    deleteNew: "/api/v1/baje/vehicle/type",
  },

  system: {
    getRelatedList: (id) => `/api/v1/baje/vehicle/systems/${id}`,
    listNew: "/api/v1/baje/vehicle/systems",
    addNew: "/api/v1/baje/vehicle/system",
    editNew: (id) => `/api/v1/baje/vehicle/system/${id}`,
    delete: "/api/v1/baje/vehicle/system",
  },
  tip: {
    getRelatedList: (id) => `/api/v1/baje/vehicle/styles/${id}`,
    list: "/api/v1/baje/vehicle/styles",
    add: "/api/v1/baje/vehicle/style",
    delete: "/api/v1/baje/vehicle/style",
  },
  contractList: "/api/admin/contract/list",
};

export const StatusTranslator = (status) => {
  switch (status) {
    case "enable":
      return "فعال";

    case "ready":
      return "آماده به کار";

    case "auction":
      return "مزایده ای";

    case "disable":
      return "غیر فعال";
    default:
      return "";
  }
};

export const dateTypeTranslator = (dateType) => {
  switch (dateType) {
    case "shamsi":
      return "شمسی";

    case "miladi":
      return "میلادی";
    default:
      return "";
  }
};

export const gearBoxTranslator = (dateType) => {
  switch (dateType) {
    case "manual":
      return "دستی";

    case "auto":
      return "اتومانیک";
    default:
      return "";
  }
};
