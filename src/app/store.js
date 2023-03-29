import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {persistReducer} from 'reduxjs-toolkit-persist';
import storage from 'reduxjs-toolkit-persist/lib/storage'
import hardSet from 'reduxjs-toolkit-persist/lib/stateReconciler/hardSet'
import thunk from 'redux-thunk';
import booksSlice from '../features/library/booksSlice';
import categorySlice from '../features/library/categorySlice';
import userSlice from '../features/library/userSlice';
const persistConfig = {
  key: 'root',
  storage: storage,
 stateReconciler: hardSet,
};

const reducers = combineReducers({
  books: booksSlice,
  category:categorySlice,
  user:userSlice,
});

const _persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: _persistedReducer,
  middleware: [thunk]
});
