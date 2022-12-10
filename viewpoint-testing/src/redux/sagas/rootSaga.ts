import { all } from "redux-saga/effects";

import { authWatcher } from "./authSaga";
import { domainWatcher } from "./domainSaga";
import { roleWatcher } from "./roleSaga";
import { userWatcher } from "./userSaga";
import { viewpointCollectionWatcher } from "./viewpointCollectionSaga";
import { productWatcher } from "./productSaga";
import { detailViewpointSaga } from "./detailViewpointSaga";
import { detailProductSaga } from "./detailProductSaga";

export function* rootSaga() {
  yield all([
    ...authWatcher,
    ...domainWatcher,
    ...roleWatcher,
    ...userWatcher,
    ...viewpointCollectionWatcher,
    ...productWatcher,
    ...detailViewpointSaga,
    ...detailProductSaga,
  ]);
}
