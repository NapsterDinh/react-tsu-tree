import { call, debounce, put, takeEvery } from "redux-saga/effects";

import { userApi } from "@services/userAPI";
import { userActions } from "../slices/userSlice";
import { showErrorNotification } from "@utils/notificationUtils";

// Worker
export function* getAllUser(action): any {
  try {
    // TODO: handle callback | onSuccess
    const response = yield call<any>(userApi.getAllUser, {
      payload: action.payload,
    });
    yield put(userActions.getAllUserSuccess(response));
  } catch (error: any) {
    // TODO: handle callback | onFailure
  }
}

export function* updateRole(action): any {
  try {
    // TODO: handle callback | onSuccess
    const response = yield call<any>(userApi.updateRole, {
      payload: action.payload,
    });
    const response1 = yield call<any>(userApi.getAllUser, {
      payload: action.payload,
    });
    yield put(userActions.getAllUserSuccess(response1));
    yield put(userActions.updateRoleSuccess(response.data));
  } catch (error: any) {
    showErrorNotification(error?.description)
    yield put(userActions.updateRoleError(error));
  }
}

export function* updateStatus(action): any {
  try {
    // TODO: handle callback | onSuccess
    const response = yield call<any>(userApi.updateStatus, {
      payload: action.payload,
    });
    const response1 = yield call<any>(userApi.getAllUser, {
      payload: action.payload,
    });
    yield put(userActions.getAllUserSuccess(response1));
    yield put(userActions.updateStatusSuccess(response.data));
  } catch (error: any) {
    showErrorNotification(error?.description)
    yield put(userActions.updateStatusError(error));
  }
}
export function* searchUser(action): any {
  try {
    // TODO: handle callback | onSuccess
    const response = yield call<any>(
      userApi.searchUser, 
      action.payload
    );
    yield put(userActions.searchUserSuccess(response.data));
  } catch (error: any) {
    // TODO: handle callback | onFailure
    userActions.searchUserFailed();
  }
}
//Watcher
export const userWatcher = [
  takeEvery(userActions.getAllUser, getAllUser),
  takeEvery(userActions.updateRole, updateRole),
  takeEvery(userActions.updateStatus, updateStatus),
  debounce(500, userActions.searchUser, searchUser),
];
