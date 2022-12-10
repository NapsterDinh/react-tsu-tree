export const METHOD = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
};

export const PAGE_SIZE_TREE = 25;
export const ERR_CANCELED_RECEIVE_RESPONSE = "ERR_CANCELED";

export const ACTION = {
  CREATE: "CREATE",
  CLONE: "CLONE",
  UPDATE_PROCESSING_STATUS: "UPDATE_PROCESSING",
  UPDATE_PUBLISHING_STATUS: "UPDATE_PUBLISH",
  UPDATE_NAME: "UPDATE_NAME",
  UPDATE_INFORMATION: "UPDATE_INFORMATION",
  ADD_MEMBER: "ADD_MEMBER",
  REMOVE_MEMBER: "REMOVE_MEMBER",
  CREATE_REQUEST: "CREATE_REQUEST",
  APPROVE_REQUEST: "APPROVE_REQUEST",
};

export const VIEWPOINT_IMPORT_FIELD = {
  DOMAIN: "Domain",
  TEST_TYPE: "Test Type",
  CATEGORY: "Category",
  VIEWPOINT_DETAIL: "Viewpoint Detail",
  CONFIRMATION: "Confirmation",
  EXAMPLE: "Example",
  NOTE: "Note",
  NO: "No",
};

export const GUID_EMPTY = "00000000-0000-0000-0000-000000000000";
export const SHORT_TYPE = {
  VIEWPOINT_COLLECTION: "VP",
  PRODUCT: "P",
};
export const MAX_LEVEL_TREE = 7;

export const LANGUAGE = {
  VI: "vi",
  EN: "en",
  JPN: "jpn",
};

export const ENUM_DEEP_DIFF = {
  VALUE_CREATED: "created",
  VALUE_UPDATED: "updated",
  VALUE_DELETED: "deleted",
  VALUE_UNCHANGED: "unchanged",
  VALUE_DUPLICATED: "duplicated",
};

export const DEFAULT_VIEWPOINT_NODE_LEAF = {
  viewDetail: {
    language: "en",
    name: "",
    confirmation: "",
    example: "",
    note: "",
  },
  isLocked: false,
};

export const DEFAULT_FUNCTION_NODE_LEAF = {
  id: "000000",
  viewDetail: {
    language: "en",
    name: "",
    note: "",
  },
  createdAt: "2022-10-19 18:12:15.7609474",
  updatedAt: "2022-10-19 18:12:15.7609474",
  updateBy: "2d9d774b-a221-4d4f-aad1-08daaea65f6b",
  createdBy: "2d9d774b-a221-4d4f-aad1-08daaea65f6b",
  parentId: null,
  orderStrings: [],
};

export const PROCESSING_STATUS = {
  ON_GOING: "0",
  UPDATING: "1",
};

export const PUBLISH_STATUS = {
  PUBLISHING: "0",
  PUBLISHED: "1",
};

export const DEFAULT_VIEWPOINT_NODE_COMMON = {
  id: "000000",
  viewDetail: {
    language: "en",
    name: "",
    confirmation: null,
    example: null,
    note: null,
  },
  createdAt: "2022-10-19 18:12:15.7609474",
  updatedAt: "2022-10-19 18:12:15.7609474",
  updateBy: "2d9d774b-a221-4d4f-aad1-08daaea65f6b",
  createdBy: "2d9d774b-a221-4d4f-aad1-08daaea65f6b",
  parentId: null,
  orderStrings: [],
};

export const STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
  DEFAULT: 2,
};

export const TYPE_TREE_NODE = {
  DOMAIN: "domain",
  TEST_TYPE: "test-type",
  CATEGORY: "category",
  VIEWPOINT: "viewpoint",
  GROUP_FUNCTION: "group-function",
  FUNCTION: "function",
};

export const TYPE_REQUEST = {
  VIEWPOINT_COLLECTION: "ViewPointCollection",
  PRODUCT: "Product",
};

export const STATUS_REQUEST = {
  NO_REQUEST_STATUS: 0,
  WAITING: 1,
  PROCESSING: 2,
  APPROVE: 3,
  REJECT: 4,
  CANCELED: 5,
};

export const STATUS_VIEWPOINT_COLLECTION = {
  ON_GOING: 0,
  PUBlISH: 1,
  PRIVATE: 2,
};

export const TYPE_FILTER_LOG = {
  PRODUCT: 1,
  VIEWPOINT_COLLECTION: 0,
  DEFAULT: 2,
};

export const SORT = {
  ACS: "0",
  DESC: "1",
  DEFAULT: "2",
};

export const OWNED = {
  NO_OWNED: 3,
  ALL_USER: 1,
  OWNED: 2,
  NOT_FILTER: 0,
};

export const FILTER_TIME = {
  NO_TIME: 3,
  TODAY: 0,
  LAST_7_DAYS: 1,
  LAST_30_DAYS: 2,
};

export const DEFAULT_PAGE_SIZE = 20;

export const DEFAULT_PAGINATION = {
  pageSize: 20,
  totalCount: -1,
  totalPages: -1,
  currentPage: 1,
  hasNext: false,
  hasPreviousPage: false,
};

export const ROLE = {
  ADMIN: "Admin",
  USER: "User",
  LEADER: "Leader",
  GUEST: "Guest",
};

export const DEFAULT_NEW_CHILD_NODE_KEY = "DEFAULT_NEW_CHILD_NODE_KEY";

export const FUNCTION = [
  // { func: "Request review", key: "REQUEST_REVIEW" },
  { func: "Domain management", key: "DOMAIN" },
  // { func: "Category management", key: "CATEGORY" },
  // { func: "Test type management", key: "TEST_TYPE" },
  { func: "User management", key: "USER" },
  { func: "Role management", key: "ROLE" },
  { func: "Viewpoint Collection Management", key: "VIEWPOINT" },
  { func: "Product Management", key: "PRODUCT" },
  { func: "Request management", key: "REQUEST" },
  // { func: "Function group", key: "FUNCTION_GROUP" },
  // "Test type management",
  // "User management",
  // "Role management",
  // "Viewpoint Collection Management",
  // "Product Management",
  // "Request management",
];
// password regular express
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[A-Za-z\d!@#$%^&*?]{8,50}$/;
export const dateFormat = "YYYY/MM/DD";
export const weekFormat = "MM/DD";
export const monthFormat = "YYYY/MM";

export const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];

export const MAX_LENGTH = 20;
export const MIN_LENGTH = 3;
