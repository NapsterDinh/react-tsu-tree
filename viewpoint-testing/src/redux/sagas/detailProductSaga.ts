import { call, debounce, put } from "redux-saga/effects";

import { detailProductActions } from "@redux/slices";
import productAPI from "@services/productAPI";

export function* searchProduct(action): any {
  try {
    // TODO: handle callback | onSuccess
    const response = yield call<any>(productAPI.searchProduct, action.payload);
    yield put(detailProductActions.searchProductSuccess(response.data));
  } catch (error: any) {
    // TODO: handle callback | onFailure
    detailProductActions.searchProductFailed();
  }
}

//Watcher
export const detailProductSaga = [
  debounce(1000, detailProductActions.searchProduct, searchProduct),
];
