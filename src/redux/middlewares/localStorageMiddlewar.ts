import { Middleware } from '@reduxjs/toolkit';

import { login, logout } from '../slices/userDataSlice';

const localStorageMiddleware: Middleware = () => (next) => (action) => {
   const result = next(action);
   if (login.match(action)) {
      localStorage.setItem('userData', JSON.stringify(action.payload));
   } else if (logout.match(action)) {
      localStorage.removeItem('userData');
   }
   return result;
};

export default localStorageMiddleware;
