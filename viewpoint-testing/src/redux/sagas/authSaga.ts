import { call, put, takeEvery } from "redux-saga/effects";

import authAPI from "@services/authAPI";
import { authActions } from "../slices/authSlice";

export type LoginType = {
  type: string;
  payload: { values: any; onSuccess: () => void };
};

// Worker
export function* loginWorker(action: LoginType): any {
  try {
    // TODO: handle callback | onSuccess
    const response = yield call<any>(authAPI.login, {
      payload: action.payload,
    });
    if (response && response?.success) {
      yield put(authActions.loginSuccess(response.data));
      if (action.payload?.onSuccess) {
        yield call(action.payload.onSuccess);
        // getCurrentUserWorker(action);
      }
    }
  } catch (error: any) {
    yield put(authActions.loginFailure(error.response.data.msg));
    // TODO: handle callback | onFailure
  } finally {
    yield put(authActions.closeLoading({}));
  }
}

export function* getCurrentUserWorker(action) {
  try {
    if (!localStorage.getItem("token")) {
      yield put(authActions.getCurrentUserFailure(null));
      return;
    }
    const user = yield call(authAPI.getCurrentUser);
    if (!user) {
      yield call(
        { context: localStorage, fn: localStorage.removeItem },
        "token"
      );
      yield put(authActions.getCurrentUserFailure(null));
    } else {
      let newPermission = [];
      if (user?.data?.permissions) {
        newPermission = [...user?.data?.permissions].map((item) => item?.name);
      }
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user.data,
          permissions: [],
        })
      );

      yield put(
        authActions.getCurrentUserSuccess({
          ...user.data,
          permissions: newPermission,
        })
      );
      if (action.payload?.onSuccess) {
        yield call(action.payload.onSuccess);
      }
    }
  } catch (error) {
    error;
  }
}

export function* logout() {
  yield;
}

//Watcher
export const authWatcher = [
  takeEvery(authActions.login, loginWorker),
  takeEvery(authActions.getCurrentUser, getCurrentUserWorker),
];
