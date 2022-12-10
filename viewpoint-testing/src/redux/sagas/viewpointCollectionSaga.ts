import { call, put, takeEvery } from "redux-saga/effects";

import viewpointCollectionAPI from "@services/viewpointCollectionAPI";
import { showSuccessNotification } from "@utils/notificationUtils";
import { viewpointCollectionActions } from "../slices/viewpointCollectionSlice";

// Worker
export function* getAllViewpointCollection(action): any {
  try {
    // TODO: handle callback | onSuccess
    const response = yield call<any>(
      viewpointCollectionAPI.getAllViewpointCollection,
      {
        payload: action.payload,
      }
    );
    yield put(
      viewpointCollectionActions.getAllViewpointCollectionSuccess(response)
    );
  } catch (error: any) {
    // TODO: handle callback | onFailure
    viewpointCollectionActions.getAllViewpointCollectionError();
  }
}

export function* getViewpointCollectionById(action): any {
  try {
    // TODO: handle callback | onSuccess
    const response = yield call<any>(
      viewpointCollectionAPI.getViewpointCollectionById,
      action.payload
    );
    yield put(
      viewpointCollectionActions.getViewpointCollectionByIdSuccess(response)
    );
  } catch (error: any) {
    // TODO: handle callback | onFailure
    viewpointCollectionActions.getViewpointCollectionByIdError();
  }
}

export function* deleteCollection(action): any {
  try {
    // TODO: handle callback | onSuccess
    yield call<any>(viewpointCollectionAPI.deleteCollection, {
      payload: action.payload.delete,
    });
    const response1 = yield call<any>(
      viewpointCollectionAPI.getAllViewpointCollection,
      {
        payload: { search: action.payload.search },
      }
    );

    yield put(
      viewpointCollectionActions.getAllViewpointCollectionSuccess(response1)
    );
    showSuccessNotification("Successfully delete viewpoint collection!!!");
  } catch (error: any) {
    // TODO: handle callback | onFailure
  }
}

export function* cloneCollection(action): any {
  try {
    // TODO: handle callback | onSuccess
    const response = yield call<any>(viewpointCollectionAPI.cloneCollection, {
      payload: action.payload.clone,
    });

    yield put(viewpointCollectionActions.cloneCollectionSuccess(response));
    const response1 = yield call<any>(
      viewpointCollectionAPI.getAllViewpointCollection,
      {
        payload: { search: action.payload.search },
      }
    );

    yield put(
      viewpointCollectionActions.getAllViewpointCollectionSuccess(response1)
    );
    showSuccessNotification("Successfully clone viewpoint collection!!!");
  } catch (error: any) {
    // TODO: handle callback | onFailure
    viewpointCollectionActions.cloneCollectionError(error);
  }
}
export function* createViewpointCollection(action): any {
  try {
    // TODO: handle callback | onSuccess
    const response = yield call<any>(
      viewpointCollectionAPI.createViewpointCollection,
      {
        payload: action.payload.create,
      }
    );

    yield put(
      viewpointCollectionActions.createViewpointCollectionSuccess(response)
    );
    const response1 = yield call<any>(
      viewpointCollectionAPI.getAllViewpointCollection,
      {
        payload: { search: action.payload.search },
      }
    );

    yield put(
      viewpointCollectionActions.getAllViewpointCollectionSuccess(response1)
    );
    showSuccessNotification("Successfully created viewpoint collection!!!");
  } catch (error: any) {
    // TODO: handle callback | onFailure
    yield put(viewpointCollectionActions.createViewpointCollectionError(error));
    // showErrorNotification(error.description);
  }
}
//Watcher
export const viewpointCollectionWatcher = [
  takeEvery(
    viewpointCollectionActions.getAllViewpointCollection,
    getAllViewpointCollection
  ),
  takeEvery(viewpointCollectionActions.deleteCollection, deleteCollection),
  takeEvery(viewpointCollectionActions.cloneCollection, cloneCollection),
  takeEvery(
    viewpointCollectionActions.createViewpointCollection,
    createViewpointCollection
  ),
  takeEvery(
    viewpointCollectionActions.getViewpointCollectionById,
    getViewpointCollectionById
  ),
];
