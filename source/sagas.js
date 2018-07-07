import { all } from 'redux-saga/effects';

import campaignsSagas from './model/campaigns/campaignsSagas';

export default function* rootSaga() {
    yield all([
        campaignsSagas(),
    ]);
}
