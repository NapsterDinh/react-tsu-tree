import { call, debounce, put } from "redux-saga/effects";

import { detailViewpointActions } from "@redux/slices/detailViewpointSlice";
import viewpointCollectionAPI from "@services/viewpointCollectionAPI";

export function* searchViewpoint(action): any {
  try {
    // TODO: handle callback | onSuccess
    const response = yield call<any>(
      viewpointCollectionAPI.searchViewpointCollection,
      action.payload
    );
    yield put(detailViewpointActions.searchViewpointSuccess(response.data));
  } catch (error: any) {
    // TODO: handle callback | onFailure
    detailViewpointActions.searchViewpointFailed();
  }
}

//Watcher
export const detailViewpointSaga = [
  debounce(1000, detailViewpointActions.searchViewpoint, searchViewpoint),
];
