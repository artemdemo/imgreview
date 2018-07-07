import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import campaigns from './model/campaigns/campaignsReducer';

const reducers = combineReducers({
    campaigns,

    routing: routerReducer,
});

export default reducers;
