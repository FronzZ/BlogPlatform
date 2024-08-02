import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IArticleState } from '../../interfaces/articles/articleState';

const initialState: IArticleState = {
   isAuthenticated: false,
   currentPage: 1,
};

const userDataSlice = createSlice({
   name: 'userData',
   initialState,
   reducers: {
      login: (state) => {
         state.isAuthenticated = true;
      },

      logout: (state) => {
         state.isAuthenticated = false;
      },

      setCurrentPage: (state, action: PayloadAction<number>) => {
         state.currentPage = action.payload;
      },
   },
});

export const { logout, login, setCurrentPage } = userDataSlice.actions;

export default userDataSlice.reducer;
