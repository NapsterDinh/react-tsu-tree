import { createSlice } from "@reduxjs/toolkit";

export type TreeData = {
  children: any[]; //get ID, order item
  key: React.Key;
  parentKey: React.Key;
  title: string | any;
  detail: any;
  id?: React.Key;
};

export type TInitialStateTree = {
  treeFullData: TreeData[];
  selectedNode: any;
  searchValue: string;
  levelShow: number;
  defaultNewTreeNodeLeaf: any;
  hintTextList: string[];
  error: string;
  expandedKeys: React.Key[];
  autoExpandParent: boolean;
  nodeEditing: TreeData;
  checkedList: React.Key[];
  checkAll: boolean;
  loadingTree: boolean;
};
// initial state for theme
const initialState: TInitialStateTree = {
  treeFullData: [],
  searchValue: "",
  selectedNode: null,
  levelShow: 1,
  defaultNewTreeNodeLeaf: "",
  hintTextList: [],
  error: "",
  expandedKeys: [],
  autoExpandParent: true,
  nodeEditing: null,
  checkedList: [],
  checkAll: false,
  loadingTree: false,
};

// create theme slice to manage state of theme
const treeSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {
    setTree(state, { payload }) {
      state.loadingTree = true;
    },
    setTreeSuccess(state, { payload }) {
      state.treeFullData = payload;
      state.loadingTree = false;
    },
    setTreeFailed(state, { payload }) {
      state.loadingTree = false;
      state.error = payload;
    },
  },
});

const { actions, reducer } = treeSlice;

export { actions as treeActions, reducer as treeReducer };
