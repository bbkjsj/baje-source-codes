export const nations = {
  iranian: "iranian",
  non_iranian: "non_iranian",
};
export const endpoints = {
  getUserWithNationalNumber: (nationalNumber) =>
    `/api/admin/personnel/lookup/${nationalNumber}`,
  getUser: (id) => `/api/v1/baje/personnel/${id}`,
  addUser: "api/v1/baje/personnel",
  updateUser: (id) => `api/v1/baje/personnel/${id}`,
  updateUserDocument: (id) => `api/v1/baje/personnel/document/${id}`,
  updateUserPermission: (id) => `api/v1/baje/permission/${id}`,
  getUserPermission: (id) => `/api/v1/baje/permission/${id}`,
  checkInsuranceNumber: (insuranceNumber) =>
    `/api/admin/personnel/lookup/insurance/${insuranceNumber}`,
  getPermissios: "/api/admin/personnel/permissions",
  getNewPermissios: "/api/v1/baje/permission/list",
};
