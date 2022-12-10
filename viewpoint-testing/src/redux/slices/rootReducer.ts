import { themeReducer } from "./themeSlice";
import { combineReducers } from "redux";
import { authReducer } from "./authSlice";
import { domainReducer } from "./domainSlice";
import { roleReducer } from "./roleSlice";
import { userReducer } from "./userSlice";
import { viewpointCollectionReducer } from "./viewpointCollectionSlice";
import { productReducer } from "./productSlice";
import { detailViewpointReducer } from "./detailViewpointSlice";
import { detailProductReducer } from "./detailProductSlice";
import { treeReducer } from "./treeSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  domain: domainReducer,
  role: roleReducer,
  user: userReducer,
  viewpoint: viewpointCollectionReducer,
  product: productReducer,
  detailViewpoint: detailViewpointReducer,
  detailProduct: detailProductReducer,
  tree: treeReducer,
});
