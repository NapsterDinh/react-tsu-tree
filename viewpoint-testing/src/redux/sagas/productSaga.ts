import { call, put, takeEvery } from "redux-saga/effects";

import productAPI from "@services/productAPI";
import { productActions } from "../slices/productSlice";
import { showSuccessNotification } from "@utils/notificationUtils";

// Worker
export function* getAllProduct(action): any {
  try {
    // TODO: handle callback | onSuccess
    const response = yield call<any>(productAPI.getAllProduct, {
      payload: action.payload,
    });
    yield put(productActions.getAllProductSuccess(response));
  } catch (error: any) {
    // TODO: handle callback | onFailure
    productActions.getAllProductError();
  }
}

export function* getProductById(action): any {
  try {
    // TODO: handle callback | onSuccess
    const response = yield call<any>(productAPI.getProductById, action.payload);
    yield put(productActions.getProductByIdSuccess(response));
  } catch (error: any) {
    // TODO: handle callback | onFailure
    productActions.getProductByIdError();
  }
}

export function* deleteProduct(action): any {
  try {
    // TODO: handle callback | onSuccess
    yield call<any>(productAPI.deleteProduct, {
      payload: action.payload.delete,
    });
    const response1 = yield call<any>(productAPI.getAllProduct, {
      payload: { search: action.payload.search },
    });

    yield put(productActions.getAllProductSuccess(response1));
    showSuccessNotification("Successfully delete viewpoint collection!!!");
  } catch (error: any) {
    // TODO: handle callback | onFailure
  }
}

export function* cloneProduct(action): any {
  try {
    // TODO: handle callback | onSuccess
    const response = yield call<any>(productAPI.cloneProduct, {
      payload: action.payload.clone,
    });

    yield put(productActions.cloneProductSuccess(response));
    const response1 = yield call<any>(productAPI.getAllProduct, {
      payload: { search: action.payload.search },
    });

    yield put(productActions.getAllProductSuccess(response1));
    showSuccessNotification("Successfully clone product collection!!!");
  } catch (error: any) {
    // TODO: handle callback | onFailure
    productActions.cloneProductError(error);
  }
}
export function* createProduct(action): any {
  try {
    // TODO: handle callback | onSuccess
    const response = yield call<any>(productAPI.createProduct, {
      payload: action.payload.create,
    });

    yield put(productActions.createProductSuccess(response));
    const response1 = yield call<any>(productAPI.getAllProduct, {
      payload: { search: action.payload.search },
    });

    yield put(productActions.getAllProductSuccess(response1));
    showSuccessNotification("Successfully created product collection!!!");
  } catch (error: any) {
    // TODO: handle callback | onFailure
  }
}

export function* searchProduct(action): any {
  try {
    // TODO: handle callback | onSuccess
    const response = yield call<any>(productAPI.searchProduct, action.payload);
    yield put(productActions.searchProductSuccess(response.data));
  } catch (error: any) {
    // TODO: handle callback | onFailure
    productActions.searchProductFailed();
  }
}
//Watcher
export const productWatcher = [
  takeEvery(productActions.getAllProduct, getAllProduct),
  takeEvery(productActions.deleteProduct, deleteProduct),
  takeEvery(productActions.cloneProduct, cloneProduct),
  takeEvery(productActions.createProduct, createProduct),
  takeEvery(productActions.getProductById, getProductById),
  takeEvery(productActions.searchProduct, searchProduct),
];
