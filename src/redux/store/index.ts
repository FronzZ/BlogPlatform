import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { articleApi } from '../apis/articles/ArticlesApi';
import userDataSlice from '../slices/userDataSlice';

const store = configureStore({
   reducer: {
      [articleApi.reducerPath]: articleApi.reducer,
      userData: userDataSlice,
   },
   preloadedState: {
      userData: { currentPage: 1, isAuthenticated: !!localStorage.getItem('token') || false },
   },

   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(articleApi.middleware),
});

setupListeners(store.dispatch);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
