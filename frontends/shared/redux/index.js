import {
  createStore, applyMiddleware, combineReducers, compose,
} from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';

import thunkMiddleware from 'redux-thunk';
import storage from 'redux-persist/es/storage'; // default: localStorage if web, AsyncStorage if react-native
import mainReducer from './reducers';
import persistedReducer from './persistedReducer';
import Ressource from './actions/ressource';
import * as alerts from './actions/alerts';

const config = {
  key: 'data',
  storage,
  whitelist: ['persistedData'],
};

const reducer = persistCombineReducers(config, {
  data: mainReducer,
  persistedData: persistedReducer,
});

const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
  : compose;

const enhancer = composeEnhancers(applyMiddleware(thunkMiddleware));

export const store = createStore(reducer, enhancer);

export const persistor = persistStore(store);

export { Ressource, alerts };
