import {
  CategoryManagement,
  ClonedDetailRequest,
  DetailProduct,
  DetailViewpointCollection,
  DomainManagement,
  FunctionGroupManagement,
  HomePage,
  LoginPage,
  RequestManagement,
  RoleManagement,
  TestTypeManagement,
  UserManagement,
  ViewpointCollection,
} from "@pages";
import OrderManagement from "@pages/OrderManagement/OrderManagement";
import ProductManagementPhuc from "@pages/ProductManagementPhuc/ProductManagementPhuc";
import { ROLE } from "@utils/constants";
import { Route } from "react-router-dom";

export const routes = {
  LoginPage: {
    path: "/login",
    index: false,
    element: <LoginPage />,
    role: [ROLE.GUEST],
    isRequired: false,
  },
  CategoryManagement: {
    path: ["/category"],
    index: false,
    element: <CategoryManagement />,
    permissions: ["CATEGORY.VIEW"],
    isRequired: true,
    keyRoute: "category_management",
  },
  TestTypeManagement: {
    path: ["/test-type", "/test-type/123"],
    index: false,
    element: <TestTypeManagement />,
    permissions: ["DOMAIN.VIEW"],
    isRequired: true,
    keyRoute: "test_type_management",
  },
  FunctionGroup: {
    path: ["/function-group"],
    index: false,
    element: <FunctionGroupManagement />,
    permissions: ["FUNCTION_GROUP.VIEW"],
    isRequired: true,
    keyRoute: "function_group_management",
  },
  DomainManagement: {
    path: ["/domain-management"],
    index: false,
    element: <DomainManagement />,
    permissions: ["DOMAIN.VIEW"],
    isRequired: true,
    keyRoute: "domain_management",
  },
  UserManagement: {
    path: ["/user-management"],
    index: false,
    element: <UserManagement />,
    permissions: ["USER.VIEW"],
    isRequired: true,
    keyRoute: "user_management",
  },
  OrderManagement: {
    path: ["/order-management"],
    index: false,
    element: <OrderManagement />,
    permissions: ["ROLE.VIEW"],
    isRequired: true,
    keyRoute: "order-management",
  },
  ViewpointCollection: {
    path: ["/viewpoint-management"],
    index: false,
    element: <ViewpointCollection />,
    permissions: ["VIEWPOINT.VIEW"],
    isRequired: true,
    keyRoute: "viewpoint_management",
  },
  DetailViewpointCollection: {
    path: ["/viewpoint-management/:id"],
    index: false,
    element: <DetailViewpointCollection />,
    permissions: ["VIEWPOINT.UPDATE"],
    isRequired: true,
    keyRoute: "viewpoint_management",
  },
  ProductManagement: {
    path: ["/product-management"],
    index: false,
    element: <ProductManagementPhuc />,
    permissions: ["PRODUCT.VIEW"],
    isRequired: true,
    keyRoute: "product_management",
  },
  DetailProduct: {
    path: ["/product-management/:id"],
    index: false,
    element: <DetailProduct />,
    permissions: ["PRODUCT.UPDATE"],
    isRequired: true,
    keyRoute: "product_management",
  },
  RequestManagement: {
    path: ["/request-management"],
    index: false,
    element: <RequestManagement />,
    permissions: ["REQUEST.VIEW"],
    isRequired: true,
    keyRoute: "request_management",
  },
  DetailRequest: {
    path: ["/request-management/:id"],
    index: false,
    element: <ClonedDetailRequest />,
    permissions: ["REQUEST.VIEW"],
    isRequired: true,
    keyRoute: "request_management",
  },
  HomePage: {
    //home page must be at last of array
    path: ["/"],
    index: false,
    element: <HomePage />,
    permissions: [],
    isRequired: true,
    keyRoute: "home",
  },
};

export const renderMultiRoutes = ({ element: Element, path, ...rest }) =>
  path.map((path) => (
    <Route key={path} path={path} {...rest} element={Element} />
  ));
