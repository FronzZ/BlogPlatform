import { articleApi } from '../articles/ArticlesApi';
import {
   RegistrRequest,
   RegisterResponse,
   LoginRequest,
   LoginResponse,
   currentUserResponse,
   updateUserRequest,
} from '../../../interfaces/user/userApi';

export const userApi = articleApi.injectEndpoints({
   endpoints: (builder) => ({
      registeringNewUser: builder.mutation<RegisterResponse, RegistrRequest>({
         query: (body) => ({
            url: 'users',
            method: 'POST',
            body,
         }),
      }),

      existing: builder.mutation<LoginResponse, LoginRequest>({
         query: (body) => ({
            url: 'users/login',
            method: 'POST',
            body,
         }),
      }),

      getCurrentUser: builder.query<currentUserResponse, void>({
         query: () => ({
            url: 'user',
            method: 'GET',
         }),
         providesTags: ['User'],
         transformResponse: (result: LoginResponse) => {
            const { username, email, image = '' } = result.user;
            return { username, email, image };
         },
      }),

      updateUser: builder.mutation<LoginResponse, updateUserRequest>({
         query: (body) => ({
            url: 'user',
            method: 'PUT',
            body,
         }),
         invalidatesTags: ['User'],
      }),
   }),
   overrideExisting: 'throw',
});

export const { useRegisteringNewUserMutation, useExistingMutation, useUpdateUserMutation, useGetCurrentUserQuery } =
   userApi;
