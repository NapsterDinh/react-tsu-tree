import { call, put, takeEvery } from "redux-saga/effects";
import DomainAPI from "@services/domainAPI";
import { domainActions } from "../slices/domainSlice";

// Worker
export function* getDomain(action): any {
  try {
    // TODO: handle callback | onSuccess
    const response = yield call<any>(DomainAPI.getDomain, action.payload);
    yield put(domainActions.getDomainSuccess(response.data));
  } catch (error: any) {
    // TODO: handle callback | onFailure
    yield put(domainActions.getDomainFailed());
  }
}

export function* postDomain(action): any {
  try {
    // TODO: handle callback | onSuccess
    yield call<any>(DomainAPI.postDomain, action.payload);
    // yield put(domainActions.getDomain());
    yield put(domainActions.postDomainSuccess());
  } catch (error: any) {
    // TODO: handle callback | onFailure
    yield put(domainActions.postDomainFailed());
  }
}

export function* updateDomain(action): any {
  try {
    // TODO: handle callback | onSuccess
    yield call<any>(DomainAPI.updateDomain, action.payload);
    // yield put(domainActions.getDomain());
    yield put(domainActions.updateDomainSuccess());
  } catch (error: any) {
    // TODO: handle callback | onFailure
    yield put(domainActions.updateDomainFailed());
  }
}

export function* deleteDomain(action): any {
  try {
    // TODO: handle callback | onSuccess
    yield call<any>(DomainAPI.deleteDomain, action.payload);
    yield put(domainActions.deleteDomainSuccess());
  } catch (error: any) {
    // TODO: handle callback | onFailure
    yield put(domainActions.deleteDomainFailed);
  }
}

//Watcher
export const domainWatcher = [
  takeEvery(domainActions.getDomain, getDomain),
  takeEvery(domainActions.postDomain, postDomain),
  takeEvery(domainActions.updateDomain, updateDomain),
  takeEvery(domainActions.deleteDomain, deleteDomain),
];
