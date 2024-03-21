import { Provider, TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';

import common, { setData } from './reducers/common';
import user, { setMenu, setUserToken, setUserInfor } from './reducers/user';
import site, { setSiteInfor } from './reducers/site';

const store = configureStore({
  reducer: {
    user,
    common,
    site,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['user/setMenu'],
        // Ignore these paths in the state
        ignoredPaths: ['user'],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
type AppDispatch = typeof store.dispatch;

export { store, Provider, useSelector, useDispatch };

export { setUserToken, setUserInfor, setMenu, setData, setSiteInfor };

export type { RootState, AppDispatch, TypedUseSelectorHook };
