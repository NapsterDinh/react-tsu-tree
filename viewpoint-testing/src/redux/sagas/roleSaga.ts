import { call, put, takeEvery } from "redux-saga/effects";

import { roleApi } from "@services/roleAPI";
import { roleActions } from "../slices/roleSlice";

// Worker
export function* getAllRole(action): any {
  try {
    // TODO: handle callback | onSuccess
    const response = yield call<any>(roleApi.getAllRole, {
      payload: action.payload,
    });
    yield put(roleActions.getAllRoleSuccess(response.data));
  } catch (error: any) {
    // TODO: handle callback | onFailure
  }
}

//Watcher
export const roleWatcher = [takeEvery(roleActions.getAllRole, getAllRole)];
