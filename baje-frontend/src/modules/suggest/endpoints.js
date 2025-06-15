const endpoints = {
  userLookup: "/api/survey/user/lookup",
  auth: {
    getPhone: "/api/survey/signup", //post
    verify: "/api/survey/signup/verify", //post
    register: "/api/survey/signup/new", //post
  },
  assessmentCriteria: {
    get: "/api/survey/workgroup/evaluation/all",
    getByCommittee: (id) => `/api/survey/workgroup/${id}/evaluations`,
    post: "/api/survey/workgroup/evaluation",
    put: (id) => `/api/survey/workgroup/evaluation/${id}`,
    delete: "/api/survey/workgroup/evaluation",
    getItem: (id) => `/api/survey/workgroup/evaluation/${id}`,
    checkSuggestionDependency: (id) => `/api/survey/eval/inuse/${id}`, //get
    getTotalInfo: (id) => `/api/survey/workgroup/${id}/info`,
  },
  call: {
    get: "/api/survey/workgroup/call/all",
    getCurrent: "/api/survey/workgroup/call/current",
    getByCommittee: (id) => `/api/survey/workgroup/${id}/calls`,
    post: "/api/survey/workgroup/call",
    put: (id) => `/api/survey/workgroup/call/${id}`,
    delete: "/api/survey/workgroup/call",
    getItem: (id) => `/api/survey/workgroup/call/${id}`,
    getChart: (id) => `/api/survey/call/statistics/${id}`,
  },
  category: {
    get: "/api/survey/category/all",
    post: "/api/survey/category",
    put: (id) => `/api/survey/category/${id}`,
    delete: "/api/survey/category",
    getItem: (id) => `/api/survey/category/${id}`,
    checkSuggestionDependency: (name) => `/api/survey/category/inuse/${name}`, //get
  },
  committee: {
    get: "/api/survey/workgroups/wg",
    post: "/api/survey/workgroup",
    put: (id) => `/api/survey/workgroup/${id}`,
    delete: "/api/survey/workgroup",
    getItem: (id) => `/api/survey/workgroup/${id}`,
    getMembers: (id) => `/api/survey/persons/${id}`,
    postMember: "/api/survey/add/person",
    putMember: (id) => `/api/survey/edit/person/${id}`,
    deleteMember: "/api/survey/delete/person",
    getMemberItem: (id) => `/api/survey/person/detail/${id}`,
    checkMemberCommitteeDependency: (id, wid) =>
      `/api/survey/person/participate/${id}` + (wid ? `/${wid}` : ""), //get
    checkMemberExcellentDependency: (id) =>
      `/api/survey/person/excellent/participate/${id}`, //get
    setAsExpired: (id) => `/api/survey/person/expire/${id}`, //put
  },
  configuration: {
    get: "/api/survey/setting",
    post: "/api/survey/setting",
  },
  evaluation: {
    post: "/api/survey/result",
    getItem: (id) => `/api/survey/result/${id}`,
  },
  forum: {
    get: "/api/survey",
    postPoint: "/api/survey/advdis",
    postComment: "/api/survey/forum",
    postReaction: "/api/survey/reaction/advdis",
    postReactionComment: "/api/survey/reaction/comment",
    put: (id) => `/api/survey/${id}`,
    delete: "/api/survey",
    deletePoints: (id) => `/api/survey/advdis/${id}`,
    getItem: (id) => `/api/survey/${id}`,
    getPersonnel: (id) => `/api/v1/baje/personnel/${id}`,
  },
  problemReport: {
    get: "/api/survey/problem",
    getBySurvey: (id) => `/api/survey/problem/survey/${id}`,
    post: "/api/survey/problem",
    put: (id) => `/api/survey/problem/${id}`,
    delete: "/api/survey/problem",
    getItem: (id) => `/api/survey/problem/${id}`,
  },
  rejectionCriteria: {
    get: "/api/survey/workgroup/reject/all",
    getByCommittee: (wid) => `/api/survey/workgroup/${wid}/rejects`,
    post: "/api/survey/workgroup/reject",
    put: (id) => `/api/survey/workgroup/reject/${id}`,
    delete: "/api/survey/workgroup/reject",
    getItem: (id) => `/api/survey/workgroup/reject/${id}`,
    checkSuggestionDependency: (id) => `/api/survey/reject/inuse/${id}`, //get
  },
  report: {
    post: "/api/survey/category",
    getReport: (type) => `/api/survey/report/${type}`,
    getReportUsers: (type) => `/api/survey/report/users/${type}`,
  },
  suggestion: {
    get: "/api/survey",
    getCartable: (filter) => `api/survey/kartabl/${filter}`,
    getPublic: "/api/survey/my/list",
    getByCall: (id) => `/api/survey/call/items/${id}`,
    post: "/api/survey",
    put: (id) => `/api/survey/edit/${id}`,
    putPublic: (id) => `/api/survey/my/item/${id}`,
    delete: "/api/survey",
    deletePublic: "/api/survey/my/item",
    getItem: (id) => `/api/survey/${id}`,
    getItemPublic: (id) => `/api/survey/item/${id}`,
    getPersonnel: (id) => `/api/v1/baje/personnel/${id}`,
    changeStatus: (suggestId) => `/api/survey/status/${suggestId}`, //put
    changeStatusPublic: (suggestId) => `/api/survey/revise/${suggestId}`, //put
    starterReviewRequest: (id) => `/api/survey/review/${id}`, //put
    changeCommittee: (id) => `/api/survey/assign/workgroup/${id}`, //put
    excellentCommitteeVote: `/api/survey/excellent/group/result`, //post
    getScores: (id) => `/api/survey/leaderboard/${id}`,
    getPublicScores: (id) => `/api/survey/leaderboard/lb/${id}`,
    getUpcomingCalls: "/api/survey/my/upcoming/calls",
    subscribeCall: "/api/survey/workgroup/call/subscribe",
    getCompanies: "/api/admin/personnel/legal/list",
    getWorkgroupRejectReason: (id) => `/api/survey/result/reject/reason/${id}`,
    setAsSeen: (id) => `/api/survey/notification/main/${id}`, //put
    setAsSeenPublic: (id) => `/api/survey/notification/survey/${id}`, //put
    resetExcellentNegativeVotes: "/api/survey/reset", //post
    getUnreadCount: "/api/survey/notification/main",
    getUnreadCountPublic: "/api/survey/notification/survey",
    getExecutionInfo: (id) => `/api/survey/execution/item/${id}`,
    getStatusLog: (id) => `/api/survey/status/log/${id}`,
    getStatusLogPublic: (id) => `/api/survey/log/status/${id}`,
    getPersonnelInfo: (id) => `/api/admin//personnel/lookup/${id}`,
    setAsPending: (id) => `/api/survey/postpone/${id}`, //put
  },
};

export default endpoints;
